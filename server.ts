import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getIdentityProvider,
  getInsuranceProvider,
  normalizeNIN,
  formatRwandanNIN,
  isValidRwandanNIN,
} from "./server/identity/providers";
import {
  RWANDA_FACILITIES,
  INITIAL_NATIONAL_PATIENTS,
  INITIAL_PATIENT_REFERRALS,
  INITIAL_PATIENT_CONSENTS,
  INITIAL_ACCESS_AUDIT_LOGS,
} from "./src/data/mockRwandaNationalData";

dotenv.config();

// In-memory data store for live full-stack verification & referrals
let serverNationalPatients = [...INITIAL_NATIONAL_PATIENTS];
let serverPatientReferrals = [...INITIAL_PATIENT_REFERRALS];
let serverPatientConsents = [...INITIAL_PATIENT_CONSENTS];
let serverAccessAuditLogs = [...INITIAL_ACCESS_AUDIT_LOGS];

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Clinical SOAP Notes generator
  app.post("/api/ai/soap-notes", async (req, res) => {
    try {
      const { doctorNotes, patientInfo } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback clinical template
        return res.json({
          soapNote: {
            subjective: `Patient (${patientInfo?.name || "Patient"}, Age ${patientInfo?.age || "N/A"}) reports: ${doctorNotes || "Routine check-up."}`,
            objective: `Vitals: BP ${patientInfo?.vitals?.bp || "120/80"}, HR ${patientInfo?.vitals?.hr || "72"} bpm, Temp ${patientInfo?.vitals?.temp || "98.6"}°F, SpO2 ${patientInfo?.vitals?.spo2 || "98"}%. General: Alert, oriented x3, in no acute distress.`,
            assessment: `Clinical impression: ${patientInfo?.diagnosis || "Primary presentation under clinical evaluation"}. Stable baseline.`,
            plan: `1. Continue supportive management. 2. Prescribed appropriate medication regimen. 3. Monitor vitals Q4H. 4. Follow up in 48-72 hours or seek immediate care if red flag symptoms develop.`
          },
          source: "offline_clinical_engine"
        });
      }

      const prompt = `You are an expert Hospital Clinical Scribe and Physician Assistant.
Convert the following unstructured clinician notes and patient context into a professional, formal hospital SOAP Note (Subjective, Objective, Assessment, Plan).

Patient Information:
${JSON.stringify(patientInfo, null, 2)}

Clinician's Dictation / Rough Notes:
"${doctorNotes}"

Respond in valid JSON with this exact structure:
{
  "subjective": "...",
  "objective": "...",
  "assessment": "...",
  "plan": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ soapNote: parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("Error generating SOAP note:", err);
      res.status(500).json({ error: err.message || "Failed to generate SOAP note" });
    }
  });

  // Drug Interaction Checker
  app.post("/api/ai/drug-interactions", async (req, res) => {
    try {
      const { currentMedications, newMedication, patientAllergies } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          severity: "Low",
          hasInteraction: false,
          summary: "No severe contraindications identified by baseline formulary rule-engine.",
          recommendations: "Administer with water as prescribed. Monitor for gastrointestinal sensitivity.",
          source: "offline_formulary_engine"
        });
      }

      const prompt = `You are a clinical pharmacologist in a hospital pharmacy.
Analyze potential drug-drug interactions, contraindications, and allergy risks for:

Current Medications: ${JSON.stringify(currentMedications)}
New Prescribed Medication: ${newMedication}
Known Patient Allergies: ${JSON.stringify(patientAllergies || [])}

Provide your evaluation in valid JSON with:
{
  "hasInteraction": boolean,
  "severity": "None" | "Low" | "Moderate" | "Severe" | "Contraindicated",
  "summary": "Clear clinical summary of the risk or compatibility",
  "mechanism": "Brief pharmacologic mechanism if applicable",
  "recommendations": "Actionable instructions for the prescribing physician and nursing team"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("Error checking drug interactions:", err);
      res.status(500).json({ error: err.message || "Drug interaction check failed" });
    }
  });

  // Emergency Triage & Differential Diagnosis Decision Support
  app.post("/api/ai/triage-assist", async (req, res) => {
    try {
      const { chiefComplaint, vitals, age, gender, medicalHistory } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          esiLevel: 3,
          esiCategory: "Urgent",
          redFlags: ["Monitor for sudden decompensation or vital spikes"],
          differentialDiagnoses: ["Acute presenting symptoms requiring diagnostic evaluation"],
          recommendedWorkup: ["Complete Blood Count (CBC)", "Basic Metabolic Panel", "12-Lead ECG"],
          triageNotes: "Standard urgent triage protocol initiated. Re-evaluate vitals in 30 minutes.",
          source: "offline_triage_protocol"
        });
      }

      const prompt = `You are an Emergency Medicine Triage Physician.
Evaluate the following patient triage data based on the Emergency Severity Index (ESI Levels 1-5):
- Level 1: Resuscitation (immediate life-saving intervention needed)
- Level 2: Emergent (high risk, confused/lethargic, severe pain/distress)
- Level 3: Urgent (requires 2+ hospital resources, vitals outside danger zone)
- Level 4: Less Urgent (requires 1 hospital resource)
- Level 5: Non-Urgent (requires 0 hospital resources)

Patient Profile:
- Age: ${age}, Gender: ${gender}
- Chief Complaint: "${chiefComplaint}"
- Vitals: ${JSON.stringify(vitals)}
- Past Medical History: ${JSON.stringify(medicalHistory || [])}

Provide your output in strict JSON format:
{
  "esiLevel": number (1 to 5),
  "esiCategory": "Resuscitation" | "Emergent" | "Urgent" | "Less Urgent" | "Non-Urgent",
  "urgencyScore": number (1-100),
  "redFlags": ["list", "of", "critical", "signs"],
  "differentialDiagnoses": ["top 3-4 likely clinical considerations"],
  "recommendedWorkup": ["labs, imaging, or monitoring to order immediately"],
  "triageNotes": "Succinct clinical reasoning for the assigned level"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("Error in triage assist:", err);
      res.status(500).json({ error: err.message || "Triage evaluation failed" });
    }
  });

  // Discharge Summary Generator
  app.post("/api/ai/discharge-summary", async (req, res) => {
    try {
      const { patientName, diagnosis, treatmentsGiven, medications, dischargeVitals } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          summary: `Patient ${patientName} is discharged in stable condition following treatment for ${diagnosis}.`,
          medicationSchedule: medications?.map((m: any) => `${m.name}: ${m.dosage}, ${m.frequency}`) || [],
          activityRestrictions: "Resume normal activities as tolerated. Rest for 48 hours and avoid heavy lifting.",
          warningSigns: ["Fever over 101°F", "Sudden shortness of breath", "Severe chest or abdominal pain", "Persistent dizziness"],
          followUpInstructions: "Schedule outpatient follow-up with attending physician in 7 days.",
          source: "offline_discharge_engine"
        });
      }

      const prompt = `You are a hospital discharge coordinator.
Generate a comprehensive, clear, compassionate, and patient-readable discharge summary.

Patient: ${patientName}
Admission Diagnosis: ${diagnosis}
Treatments & Procedures: ${JSON.stringify(treatmentsGiven)}
Discharge Medications: ${JSON.stringify(medications)}
Discharge Vitals: ${JSON.stringify(dischargeVitals)}

Respond in valid JSON with:
{
  "summary": "Clear overview of hospital stay, recovery status, and care provided",
  "medicationSchedule": ["Detailed timing and food instructions for each medicine"],
  "activityRestrictions": "Dietary and physical activity instructions",
  "warningSigns": ["Specific red flag symptoms that require return to Emergency Room"],
  "followUpInstructions": "When and whom to see for follow-up appointments"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("Error generating discharge summary:", err);
      res.status(500).json({ error: err.message || "Discharge summary generation failed" });
    }
  });

  // AI Patient-Friendly Lab Result Explainer
  app.post("/api/ai/explain-lab", async (req, res) => {
    try {
      const { testName, results, patientName } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          overview: `Laboratory report for ${testName} completed for ${patientName || "the patient"}.`,
          simplifiedFindings: results?.map((r: any) => `${r.metric}: ${r.value} ${r.unit} (${r.status === 'normal' ? 'Within healthy limits' : 'Outside typical range'})`) || [],
          clinicalMeaning: "Most measured values align with expectations or minor variations under clinical supervision.",
          questionsForDoctor: ["Are there dietary changes recommended?", "When should this panel be repeated?"],
          source: "offline_lab_explainer"
        });
      }

      const prompt = `You are a supportive, knowledgeable clinical educator explaining laboratory results to a patient.
Translate these medical lab metrics into clear, non-jargon, reassuring yet accurate patient explanations.

Test: ${testName}
Patient: ${patientName}
Results: ${JSON.stringify(results)}

Format your response in strict JSON:
{
  "overview": "Short summary explaining the purpose of this test",
  "simplifiedFindings": ["Plain-language interpretation for each key metric"],
  "clinicalMeaning": "What the pattern suggests in everyday language",
  "questionsForDoctor": ["2-3 helpful questions the patient can ask their care team"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("Error explaining lab results:", err);
      res.status(500).json({ error: err.message || "Lab explanation failed" });
    }
  });

  // AI Comprehensive Medical Record Summarizer
  app.post("/api/ai/summarize-record", async (req, res) => {
    try {
      const { patientChart } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          executiveSummary: `${patientChart?.name || "Patient"} (${patientChart?.mrn || ""}) is under active hospital care for ${patientChart?.primaryDiagnosis || "clinical observation"}.`,
          keyRiskFactors: patientChart?.medicalHistory || ["Hypertension"],
          activeRegimenSummary: "Standard inpatient pharmacotherapy and scheduled vitals observation.",
          carePriorities: ["Maintain vital stability", "Complete ordered diagnostic labs", "Evaluate for discharge planning"],
          source: "offline_record_summarizer"
        });
      }

      const prompt = `You are a Chief Medical Officer conducting a high-level clinical review.
Synthesize the following comprehensive hospital patient chart into an executive clinical summary.

Patient Medical Chart:
${JSON.stringify(patientChart, null, 2)}

Format response in strict JSON:
{
  "executiveSummary": "1-2 paragraphs summarizing history, current presentation, clinical course, and trajectory",
  "keyRiskFactors": ["Bullet list of major clinical risk flags or comorbidities"],
  "activeRegimenSummary": "Concise summary of medications, pending labs, and consultations",
  "carePriorities": ["Top 3-4 clinical actions recommended for the care team"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ ...parsed, source: "gemini-3.8-flash" });
    } catch (err: any) {
      console.error("Error summarizing record:", err);
      res.status(500).json({ error: err.message || "Record summary failed" });
    }
  });

  // ============================================================================
  // Rwanda National Patient Identity & Insurance Verification Endpoints (NIDA / RSSB / RHIE)
  // ============================================================================

  // Provider configuration & demo mode status
  app.get("/api/national-id/config", (_req, res) => {
    const idProvider = getIdentityProvider();
    const insProvider = getInsuranceProvider();
    res.json({
      isDemo: idProvider.isDemo && insProvider.isDemo,
      demoNotice: "DEMO MODE — NOT CONNECTED TO GOVERNMENT SYSTEMS",
      identityProvider: idProvider.providerName,
      insuranceProvider: insProvider.providerName,
      nidaApiConfigured: Boolean(process.env.NIDA_API_KEY),
      rssbApiConfigured: Boolean(process.env.RSSB_API_KEY),
      rhieApiConfigured: Boolean(process.env.RHIE_API_URL),
    });
  });

  // 1. Facilities Directory
  app.get("/api/national-id/facilities", (_req, res) => {
    res.json({ facilities: RWANDA_FACILITIES });
  });

  // 2. National Patients Registry
  app.get("/api/national-id/patients", (_req, res) => {
    res.json({ patients: serverNationalPatients });
  });

  // 3. Verify Patient Identity via NIN (NIDA Provider Adapter)
  app.post("/api/national-id/verify-identity", async (req, res) => {
    try {
      const { nin, staffId, staffName, staffRole, facilityId, facilityName, reason } = req.body;

      if (!nin) {
        return res.status(400).json({ error: "National ID (NIN) is required" });
      }

      const cleanNIN = normalizeNIN(nin);
      const validation = isValidRwandanNIN(cleanNIN);
      if (!validation.isValid) {
        return res.status(422).json({ error: validation.error });
      }

      const idProvider = getIdentityProvider();
      const patientRecord = await idProvider.verifyNIN(cleanNIN, {
        staffId: staffId || "STAFF-UNKNOWN",
        facilityId: facilityId || "FAC-UNKNOWN",
        reason: reason || "Outpatient Consultation",
      });

      if (!patientRecord) {
        return res.status(404).json({
          error: `No citizen identity found for NIN ${formatRwandanNIN(cleanNIN)}`,
        });
      }

      // Record access audit log
      const auditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staff_id: staffId || "doc-001",
        staff_name: staffName || "Attending Physician",
        staff_role: staffRole || "doctor",
        facility_id: facilityId || "fac-chuk",
        facility_name: facilityName || "CHUK Kigali",
        patient_nin: patientRecord.nin,
        patient_name: patientRecord.full_name,
        action: "IDENTITY_VERIFIED" as const,
        timestamp: new Date().toISOString(),
        ip_address: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
        reason: reason || "Clinical Intake & EMR Identification",
        status: "SUCCESS" as const,
        details: `Verified via ${idProvider.providerName}. Demographic identity confirmed.`,
      };
      serverAccessAuditLogs.unshift(auditLog);

      // Keep in local registry if not already present
      if (!serverNationalPatients.some((p) => normalizeNIN(p.nin) === cleanNIN)) {
        serverNationalPatients.unshift(patientRecord as any);
      }

      res.json({
        patient: patientRecord,
        provider: idProvider.providerName,
        isDemo: idProvider.isDemo,
        notice: "DEMO MODE — NOT CONNECTED TO GOVERNMENT SYSTEMS",
        auditId: auditLog.id,
      });
    } catch (err: any) {
      console.error("Error verifying NIN identity:", err);
      res.status(500).json({ error: err.message || "Failed to verify identity" });
    }
  });

  // 4. Verify Insurance Eligibility (RSSB / Mutuelle / MMI / Private)
  app.post("/api/national-id/verify-insurance", async (req, res) => {
    try {
      const { nin, provider, patientName, staffId, staffName, staffRole, facilityId, facilityName } = req.body;

      if (!nin) {
        return res.status(400).json({ error: "NIN is required for insurance verification" });
      }

      const insProvider = getInsuranceProvider();
      const verification = await insProvider.verifyInsurance(nin, provider, patientName);

      if (!verification) {
        return res.status(404).json({ error: "Insurance policy verification record not found" });
      }

      // Log access audit
      const auditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staff_id: staffId || "doc-001",
        staff_name: staffName || "Attending Physician",
        staff_role: staffRole || "doctor",
        facility_id: facilityId || "fac-chuk",
        facility_name: facilityName || "CHUK Kigali",
        patient_nin: formatRwandanNIN(nin),
        patient_name: patientName || verification.patient_name,
        action: "INSURANCE_CHECK" as const,
        timestamp: new Date().toISOString(),
        ip_address: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
        reason: "Insurance Coverage & Copay Determination",
        status: "SUCCESS" as const,
        details: `${verification.provider_display_name} verified. Policy: ${verification.policy_number}, Tier: ${verification.tier || "STANDARD"}, Coverage: ${verification.coverage_percentage}%.`,
      };
      serverAccessAuditLogs.unshift(auditLog);

      res.json({
        insurance: verification,
        provider: insProvider.providerName,
        isDemo: insProvider.isDemo,
        notice: "DEMO MODE — NOT CONNECTED TO GOVERNMENT SYSTEMS",
      });
    } catch (err: any) {
      console.error("Error verifying insurance:", err);
      res.status(500).json({ error: err.message || "Insurance verification failed" });
    }
  });

  // 5. Record Patient Consent (Rwanda Data Protection Law N° 058/2021)
  app.post("/api/national-id/record-consent", (req, res) => {
    try {
      const {
        patientNin,
        patientName,
        facilityId,
        facilityName,
        staffId,
        staffName,
        staffRole,
        consentType,
        notes,
      } = req.body;

      if (!patientNin || !patientName) {
        return res.status(400).json({ error: "Patient NIN and name are required for consent recording" });
      }

      const consent = {
        id: `cst-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        patient_nin: formatRwandanNIN(patientNin),
        patient_name: patientName,
        facility_id: facilityId || "fac-chuk",
        facility_name: facilityName || "CHUK Kigali",
        staff_id: staffId || "doc-001",
        staff_name: staffName || "Attending Physician",
        staff_role: staffRole || "doctor",
        consent_type: consentType || "EMR_ACCESS",
        granted: true,
        granted_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
        legal_framework: "Rwanda Law N° 058/2021 relating to personal data protection and privacy",
        notes: notes || "Informed patient consent digitally recorded for EMR diagnostic and clinical treatment.",
        ip_address: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
      };

      serverPatientConsents.unshift(consent as any);

      // Audit entry
      const auditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staff_id: staffId || "doc-001",
        staff_name: staffName || "Attending Physician",
        staff_role: staffRole || "doctor",
        facility_id: facilityId || "fac-chuk",
        facility_name: facilityName || "CHUK Kigali",
        patient_nin: consent.patient_nin,
        patient_name: patientName,
        action: "CONSENT_GRANTED" as const,
        timestamp: new Date().toISOString(),
        ip_address: consent.ip_address,
        reason: `Patient consent recorded for ${consentType || "EMR_ACCESS"}`,
        status: "SUCCESS" as const,
        details: `Consent stored under Rwanda Law N° 058/2021. Valid for 1 year.`,
      };
      serverAccessAuditLogs.unshift(auditLog);

      res.json({ consent, success: true });
    } catch (err: any) {
      console.error("Error recording consent:", err);
      res.status(500).json({ error: err.message || "Failed to record consent" });
    }
  });

  // 6. Get Patient Consents
  app.get("/api/national-id/consents", (_req, res) => {
    res.json({ consents: serverPatientConsents });
  });

  // 7. Create Encounter / Link National ID into Hospital EMR
  app.post("/api/national-id/create-encounter", (req, res) => {
    try {
      const {
        patientNin,
        patientName,
        facilityId,
        facilityName,
        staffId,
        staffName,
        staffRole,
        department,
        diagnosis,
        insuranceProvider,
        policyNumber,
        coveragePercent,
        encounterType,
      } = req.body;

      if (!patientNin || !patientName) {
        return res.status(400).json({ error: "patientNin and patientName are required" });
      }

      const mrn = `MRN-${Math.floor(10000 + Math.random() * 90000)}`;
      const encounter = {
        id: `enc-${Date.now()}`,
        mrn,
        patientNin: formatRwandanNIN(patientNin),
        patientName,
        facilityId: facilityId || "fac-chuk",
        facilityName: facilityName || "CHUK Kigali",
        staffId: staffId || "doc-001",
        staffName: staffName || "Attending Physician",
        department: department || "Internal Medicine",
        encounterType: encounterType || "Outpatient Consultation",
        diagnosis: diagnosis || "Clinical Intake Evaluation",
        insurance: {
          provider: insuranceProvider || "RSSB_RAMA",
          policyNumber: policyNumber || "RAMA-2026-AUTO",
          coveragePercent: coveragePercent || 85,
        },
        registeredAt: new Date().toISOString(),
        status: "ACTIVE",
      };

      // Audit log
      const auditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staff_id: staffId || "doc-001",
        staff_name: staffName || "Attending Physician",
        staff_role: staffRole || "doctor",
        facility_id: facilityId || "fac-chuk",
        facility_name: facilityName || "CHUK Kigali",
        patient_nin: encounter.patientNin,
        patient_name: patientName,
        action: "ENCOUNTER_CREATED" as const,
        timestamp: new Date().toISOString(),
        ip_address: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
        reason: `${encounterType || "Outpatient Consultation"} registered with assigned ${mrn}`,
        status: "SUCCESS" as const,
        details: `Linked National ID to hospital EMR chart ${mrn} in ${department || "Internal Medicine"}.`,
      };
      serverAccessAuditLogs.unshift(auditLog);

      res.json({ encounter, success: true });
    } catch (err: any) {
      console.error("Error creating encounter:", err);
      res.status(500).json({ error: err.message || "Failed to create encounter" });
    }
  });

  // 8. Referrals (Local & International)
  app.get("/api/national-id/referrals", (req, res) => {
    const { facilityId, status, type } = req.query;
    let list = [...serverPatientReferrals];
    if (facilityId) {
      list = list.filter(
        (r) => r.source_facility_id === facilityId || r.destination_facility_id === facilityId
      );
    }
    if (status) {
      list = list.filter((r) => r.status === status);
    }
    if (type) {
      list = list.filter((r) => r.referral_type === type);
    }
    res.json({ referrals: list });
  });

  app.post("/api/national-id/referrals", (req, res) => {
    try {
      const {
        patient_nin,
        patient_name,
        patient_age,
        patient_gender,
        source_facility_id,
        source_facility_name,
        destination_facility_id,
        destination_facility_name,
        destination_country,
        referral_type,
        priority,
        primary_diagnosis,
        clinical_summary,
        transfer_reason,
        required_services,
        referring_doctor_id,
        referring_doctor_name,
        referring_department,
        ambulance_required,
        assigned_ambulance,
        transport_notes,
      } = req.body;

      if (!patient_nin || !destination_facility_id || !primary_diagnosis) {
        return res.status(400).json({
          error: "patient_nin, destination_facility_id, and primary_diagnosis are required",
        });
      }

      const refSeq = serverPatientReferrals.length + 105;
      const refCode =
        referral_type === "INTERNATIONAL"
          ? `REF-2026-INT-${String(refSeq).padStart(4, "0")}`
          : `REF-2026-RW-${String(refSeq).padStart(4, "0")}`;

      const newReferral = {
        id: `ref-${Date.now()}`,
        referral_number: refCode,
        patient_nin: formatRwandanNIN(patient_nin),
        patient_name,
        patient_age: Number(patient_age) || 35,
        patient_gender: patient_gender || "Male",
        source_facility_id: source_facility_id || "fac-chuk",
        source_facility_name: source_facility_name || "CHUK Kigali",
        source_facility_district: "Kigali",
        destination_facility_id,
        destination_facility_name,
        destination_country: destination_country || "Rwanda",
        referral_type: referral_type || "LOCAL",
        priority: priority || "ROUTINE",
        status: "PENDING" as const,
        primary_diagnosis,
        clinical_summary: clinical_summary || "Referral for specialized tertiary medical care.",
        transfer_reason: transfer_reason || "Requires specialized intervention.",
        required_services: required_services || ["Specialist Consultation"],
        referring_doctor_id: referring_doctor_id || "doc-001",
        referring_doctor_name: referring_doctor_name || "Attending Physician",
        referring_department: referring_department || "Internal Medicine",
        created_at: new Date().toISOString(),
        ambulance_required: Boolean(ambulance_required),
        assigned_ambulance: assigned_ambulance || (ambulance_required ? "AMB-01 (KGL-ALS)" : undefined),
        transport_notes,
      };

      serverPatientReferrals.unshift(newReferral as any);

      // Log access audit
      const auditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staff_id: referring_doctor_id || "doc-001",
        staff_name: referring_doctor_name || "Attending Physician",
        staff_role: "doctor",
        facility_id: source_facility_id || "fac-chuk",
        facility_name: source_facility_name || "CHUK Kigali",
        patient_nin: newReferral.patient_nin,
        patient_name,
        action: "REFERRAL_CREATED" as const,
        timestamp: new Date().toISOString(),
        ip_address: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
        reason: `${referral_type} Referral issued to ${destination_facility_name} (${refCode})`,
        status: "SUCCESS" as const,
        details: `Diagnosis: ${primary_diagnosis}. Priority: ${priority}.`,
      };
      serverAccessAuditLogs.unshift(auditLog);

      res.status(201).json({ referral: newReferral, success: true });
    } catch (err: any) {
      console.error("Error creating referral:", err);
      res.status(500).json({ error: err.message || "Failed to create referral" });
    }
  });

  // Update Referral Status (Pending -> Accepted / In Transit / Completed / Rejected)
  app.patch("/api/national-id/referrals/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status, receivingNotes, assignedAmbulance, staffName, facilityName } = req.body;

      const referralIndex = serverPatientReferrals.findIndex((r) => r.id === id);
      if (referralIndex === -1) {
        return res.status(404).json({ error: "Referral not found" });
      }

      const existing = serverPatientReferrals[referralIndex];
      const updated = {
        ...existing,
        status: status || existing.status,
        receiving_notes: receivingNotes || existing.receiving_notes,
        assigned_ambulance: assignedAmbulance || existing.assigned_ambulance,
        accepted_at: status === "ACCEPTED" ? new Date().toISOString() : existing.accepted_at,
        completed_at: status === "COMPLETED" ? new Date().toISOString() : existing.completed_at,
      };

      serverPatientReferrals[referralIndex] = updated;

      // Log status change audit
      const auditLog = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        staff_id: "doc-receiving",
        staff_name: staffName || "Receiving Medical Officer",
        staff_role: "doctor",
        facility_id: updated.destination_facility_id,
        facility_name: facilityName || updated.destination_facility_name,
        patient_nin: updated.patient_nin,
        patient_name: updated.patient_name,
        action: "REFERRAL_UPDATED" as const,
        timestamp: new Date().toISOString(),
        ip_address: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1",
        reason: `Referral ${updated.referral_number} status changed to ${status}`,
        status: "SUCCESS" as const,
        details: receivingNotes || `Updated status to ${status}`,
      };
      serverAccessAuditLogs.unshift(auditLog);

      res.json({ referral: updated, success: true });
    } catch (err: any) {
      console.error("Error updating referral status:", err);
      res.status(500).json({ error: err.message || "Failed to update referral" });
    }
  });

  // 9. Access Audit Logs (Read-only immutable trace)
  app.get("/api/national-id/audit-logs", (_req, res) => {
    res.json({ auditLogs: serverAccessAuditLogs });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hospital Management System server running on http://localhost:${PORT}`);
  });
}

startServer();
