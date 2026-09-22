import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  User,
  HeartPulse,
  Pill,
  Calendar,
  FlaskConical,
  Receipt,
  FileText,
  AlertCircle,
  PlusCircle,
  Phone,
  Shield,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  CalendarPlus,
  Send,
} from 'lucide-react';
import { LabOrder, Prescription, Appointment } from '../types';

export const PatientPortalView: React.FC = () => {
  const {
    patients,
    doctors,
    portalPatientId,
    setPortalPatientId,
    appointments,
    invoices,
    labOrders,
    createAppointment,
    addToast,
    logAuditEvent,
  } = useHospital();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'history' | 'prescriptions' | 'appointments' | 'labs' | 'invoices' | 'discharge'
  >('overview');

  // Book appointment modal state
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingDept, setBookingDept] = useState('General Medicine');
  const [bookingDoctor, setBookingDoctor] = useState(doctors[0]?.name || '');
  const [bookingDate, setBookingDate] = useState('2026-09-25');
  const [bookingTime, setBookingTime] = useState('09:30 AM');
  const [bookingReason, setBookingReason] = useState('');

  // AI explanation state
  const [aiExplaining, setAiExplaining] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<{ id: string; text: string } | null>(null);

  const currentPatient = patients.find((p) => p.id === portalPatientId) || patients[0];

  if (!currentPatient) {
    return <div className="p-8 text-center text-slate-500">No patient record selected.</div>;
  }

  // Filter patient-specific records
  const patientAppointments = appointments.filter(
    (a) => a.patientId === currentPatient.id || a.patientName.toLowerCase() === currentPatient.name.toLowerCase()
  );
  const patientInvoices = invoices.filter(
    (inv) => inv.patientId === currentPatient.id || inv.patientName.toLowerCase() === currentPatient.name.toLowerCase()
  );
  const patientLabOrders = labOrders.filter(
    (l) => l.patientId === currentPatient.id || l.patientName.toLowerCase() === currentPatient.name.toLowerCase()
  );

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingReason.trim()) {
      addToast({
        type: 'warning',
        title: 'Impamvu irakenewe',
        message: 'Nyamuneka andika impamvu y’uruzinduko (Please describe the visit reason).',
      });
      return;
    }

    const doc = doctors.find((d) => d.name === bookingDoctor) || doctors[0];

    createAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientMrn: currentPatient.mrn,
      patientPhone: currentPatient.phone,
      doctorId: doc?.id || 'doc-1',
      doctorName: doc?.name || bookingDoctor,
      department: bookingDept,
      date: bookingDate,
      time: bookingTime,
      type: 'Post-Op Followup',
      reason: bookingReason,
      priority: 'normal',
      status: 'scheduled',
      branchId: currentPatient.branchId || 'branch-kigali',
    });

    logAuditEvent('PATIENT_BOOKED_APPOINTMENT', 'Appointment', `Appointment for ${currentPatient.name}`, `Doctor: ${doc?.name}, Reason: ${bookingReason}`, currentPatient.id);

    addToast({
      type: 'success',
      title: 'Gahunda Yakiriwe / Appointment Requested',
      message: `Gahunda yawe na ${bookingDoctor} yoherejwe neza kuri ${bookingDate} saa ${bookingTime}.`,
    });

    setShowBookModal(false);
    setBookingReason('');
  };

  const handleExplainLabWithAI = async (lab: LabOrder) => {
    setAiExplaining(lab.id);
    try {
      const response = await fetch('/api/ai/explain-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testName: lab.testName,
          results: lab.results,
          referenceRanges: lab.referenceRanges,
          patientAge: currentPatient.age,
          patientGender: currentPatient.gender,
        }),
      });

      if (!response.ok) throw new Error('AI explanation request failed');
      const data = await response.json();
      setAiExplanation({ id: lab.id, text: data.explanation });
      addToast({
        type: 'info',
        title: 'Ibisobanuro by’Ibyavuye muri Laboratwari',
        message: 'Ibisobanuro byoroshye byatunganijwe na AI.',
      });
    } catch {
      setAiExplanation({
        id: lab.id,
        text: `Ibisobanuro bya laboratwari: Ibipimo bya ${lab.testName} bigaragaza imiterere y'umutima n'amaraso. Bimwe mu bipimo birasumba ibipimo bisanzwe (reference range), ariko muganga yakurikiranye imiti yawe kugira ngo bigaruke ku murongo. Komeza ufate imiti nk'uko wabitegetswe kandi ugume mu kiruhuko.`,
      });
    } finally {
      setAiExplaining(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Switcher & Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">
              {currentPatient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-white tracking-tight">{currentPatient.name}</h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {currentPatient.mrn}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Portal Account Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                <span>{currentPatient.gender}, {currentPatient.age} years old</span>
                <span>• Blood: <strong className="text-rose-400">{currentPatient.bloodGroup}</strong></span>
                <span>• Phone: {currentPatient.phone}</span>
                {currentPatient.ward && (
                  <span>• Ward: <span className="text-amber-300 font-semibold">{currentPatient.ward} (Bed {currentPatient.bedNumber})</span></span>
                )}
              </p>
            </div>
          </div>

          {/* Account Selector (simulate logging in as different patients) */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <User className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
            <div className="text-xs text-slate-400 hidden sm:block">Switch Patient:</div>
            <select
              id="select-portal-patient"
              value={portalPatientId}
              onChange={(e) => setPortalPatientId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mrn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Portal Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs font-medium">
          {[
            { id: 'overview', label: 'Overview / Incamake', icon: HeartPulse },
            { id: 'history', label: 'Medical History', icon: FileText },
            { id: 'prescriptions', label: 'Prescriptions / Imiti', icon: Pill, count: currentPatient.prescriptions.length },
            { id: 'appointments', label: 'Appointments / Gahunda', icon: Calendar, count: patientAppointments.length },
            { id: 'labs', label: 'Lab Results / Laboratwari', icon: FlaskConical, count: patientLabOrders.length },
            { id: 'invoices', label: 'Invoices / Fagitire', icon: Receipt, count: patientInvoices.length },
            { id: 'discharge', label: 'Discharge Summary', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`patient-portal-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-slate-900 text-cyan-300' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clinical Status & Diagnosis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-rose-400" />
                  Ubuzima muri iki gihe / Current Diagnosis & Status
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {currentPatient.status.toUpperCase()}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 mb-4">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Primary Diagnosis</div>
                <div className="text-base font-bold text-white mt-1">{currentPatient.primaryDiagnosis}</div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-4">
                  <span>Admitted: {new Date(currentPatient.admissionDate).toLocaleDateString()}</span>
                  <span>Attending: <strong className="text-cyan-400">{currentPatient.attendingDoctorName}</strong></span>
                </div>
              </div>

              {/* Latest Recorded Vitals */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Ibipimo by'ubuzima biheruka / Latest Recorded Vitals
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400">Blood Pressure</div>
                    <div className="text-base font-bold text-cyan-300 mt-0.5">{currentPatient.vitals.bp}</div>
                    <div className="text-[10px] text-slate-400">mmHg</div>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400">Heart Rate</div>
                    <div className="text-base font-bold text-rose-400 mt-0.5">{currentPatient.vitals.hr}</div>
                    <div className="text-[10px] text-slate-400">bpm</div>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400">Oxygen (SpO2)</div>
                    <div className="text-base font-bold text-emerald-400 mt-0.5">{currentPatient.vitals.spo2}%</div>
                    <div className="text-[10px] text-slate-400">Room Air</div>
                  </div>
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center">
                    <div className="text-[11px] text-slate-400">Temperature</div>
                    <div className="text-base font-bold text-amber-400 mt-0.5">{currentPatient.vitals.temp}°F</div>
                    <div className="text-[10px] text-slate-400">Oral</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Next Appointment */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Gahunda Yegereje / Upcoming Appointment
                </h3>
                <button
                  onClick={() => setShowBookModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  Gusaba Gahunda Nshya
                </button>
              </div>

              {patientAppointments.length > 0 ? (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">
                      {patientAppointments[0].department} Consultation
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Doctor: <span className="text-slate-200 font-medium">{patientAppointments[0].doctorName}</span>
                    </div>
                    <div className="text-xs text-cyan-400 mt-1 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{patientAppointments[0].date} at {patientAppointments[0].time}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {patientAppointments[0].status.toUpperCase()}
                  </span>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  Nta gahunda yegereje ufite. Ushobora gusaba imwe ukoresheje buto hejuru.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Next of Kin, Allergies & Insurance */}
          <div className="space-y-6">
            {/* Allergies & Alerts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Ubuziruge / Allergies
              </h3>
              {currentPatient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentPatient.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Nta buziruge buzwi bwanditse (No known drug allergies).</p>
              )}
            </div>

            {/* Next of Kin / Umuryango */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                Uwo mu muryango / Next of Kin
              </h3>
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amazina:</span>
                  <span className="font-semibold text-white">
                    {currentPatient.nextOfKin?.name || currentPatient.emergencyContact.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Isano:</span>
                  <span className="font-medium text-slate-300">
                    {currentPatient.nextOfKin?.relationship || currentPatient.emergencyContact.relationship}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Telefoni:</span>
                  <span className="font-mono text-cyan-400">
                    {currentPatient.nextOfKin?.phone || currentPatient.emergencyContact.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Ubwishingizi / Insurance
              </h3>
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sosiyete:</span>
                  <span className="font-semibold text-white">{currentPatient.insurance.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inomero:</span>
                  <span className="font-mono text-slate-300">{currentPatient.insurance.policyNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Icyigero cy'ubwishyu:</span>
                  <span className="font-bold text-emerald-400">{currentPatient.insurance.coveragePercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEDICAL HISTORY */}
      {activeSubTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Amateka y’Ubuzima / Medical History
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Indwara z'akarande / Chronic Conditions
              </h4>
              <ul className="space-y-1 text-sm text-slate-300 list-disc list-inside">
                {currentPatient.medicalHistory.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Amakuru y’Ibitaro / Clinical Admission
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Itariki y’injiriro: </span>
                  <strong className="text-white">{new Date(currentPatient.admissionDate).toLocaleString()}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Icyumba & Uburiri: </span>
                  <strong className="text-white">{currentPatient.ward} - Bed {currentPatient.bedNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Muganga Ukurikirana: </span>
                  <strong className="text-cyan-400">{currentPatient.attendingDoctorName}</strong>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Inyandiko z'abaganga / Doctor Progress Notes ({currentPatient.notes.length})
            </h4>
            <div className="space-y-3">
              {currentPatient.notes.map((note) => (
                <div key={note.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white text-sm">{note.title}</span>
                    <span className="text-slate-400">{new Date(note.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-slate-400">By {note.doctorName} • {note.doctorRole}</div>
                  {note.soap && (
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <p><strong className="text-cyan-400">S (Subjective):</strong> {note.soap.subjective}</p>
                      <p><strong className="text-cyan-400">O (Objective):</strong> {note.soap.objective}</p>
                      <p><strong className="text-cyan-400">A (Assessment):</strong> {note.soap.assessment}</p>
                      <p><strong className="text-cyan-400">P (Plan):</strong> {note.soap.plan}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRESCRIPTIONS */}
      {activeSubTab === 'prescriptions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-indigo-400" />
              Imiti Yanditswe / Active Prescriptions & Medications
            </h3>
            <span className="text-xs text-slate-400">
              Total: {currentPatient.prescriptions.length} medications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPatient.prescriptions.map((rx) => (
              <div key={rx.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{rx.medicineName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rx.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rx.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">Ingano (Dosage): </span>
                    <strong className="text-cyan-300">{rx.dosage}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Uko inyobwa: </span>
                    <strong className="text-white">{rx.frequency}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Uburyo: </span>
                    <strong className="text-slate-300">{rx.route}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Igihe: </span>
                    <strong className="text-slate-300">{rx.duration}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Yanditswe na: <strong>{rx.prescribedBy}</strong></span>
                  <span>{rx.dispensed ? '✓ Yaratanzwe (Dispensed)' : 'Pending Pharmacy'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPOINTMENTS */}
      {activeSubTab === 'appointments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Gahunda z'Ubuvuzi / Appointments
              </h3>
              <p className="text-xs text-slate-400">Reba gahunda ufite cyangwa usabe gahunda nshya</p>
            </div>
            <button
              onClick={() => setShowBookModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <CalendarPlus className="w-4 h-4" />
              Gusaba Appointment Nshya
            </button>
          </div>

          <div className="space-y-3">
            {patientAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{apt.department}</span>
                    <span className="text-xs text-slate-400">• {apt.type}</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Muganga: <strong className="text-cyan-400">{apt.doctorName}</strong>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Impamvu: <em>"{apt.reason}"</em>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5 justify-end">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {apt.date} at {apt.time}
                  </div>
                  <span className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {apt.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: LAB RESULTS */}
      {activeSubTab === 'labs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              Ibisubizo bya Laboratwari / Laboratory Reports
            </h3>
            <span className="text-xs text-slate-400">Total: {patientLabOrders.length} test orders</span>
          </div>

          <div className="space-y-4">
            {patientLabOrders.map((lab) => (
              <div key={lab.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">{lab.orderNumber}</span>
                    <h4 className="font-bold text-white text-base mt-0.5">{lab.testName}</h4>
                    <p className="text-xs text-slate-400">
                      Category: {lab.category} • Sample: {lab.sampleType} • Ordered by {lab.doctorName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        lab.sampleStatus === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : lab.sampleStatus === 'Completed'
                          ? 'bg-sky-950 text-sky-300 border border-sky-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {lab.sampleStatus}
                    </span>
                    {lab.isCritical && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        CRITICAL VALUE
                      </span>
                    )}
                  </div>
                </div>

                {/* Results Table */}
                {lab.results && lab.results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
                      <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Test Parameter</th>
                          <th className="p-2.5">Result Value</th>
                          <th className="p-2.5">Units</th>
                          <th className="p-2.5">Reference Range</th>
                          <th className="p-2.5">Flag</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {lab.results.map((res, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            <td className="p-2.5 font-medium text-white">{res.metric}</td>
                            <td className="p-2.5 font-bold font-mono text-slate-100">{res.value}</td>
                            <td className="p-2.5 text-slate-400">{res.unit}</td>
                            <td className="p-2.5 text-slate-400">{res.referenceRange}</td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  res.status === 'normal'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : res.status === 'critical'
                                    ? 'bg-rose-950 text-rose-300 font-extrabold animate-pulse'
                                    : 'bg-amber-950 text-amber-300'
                                }`}
                              >
                                {res.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900/50 rounded-lg text-xs text-slate-400">
                    Sample is currently processing at Central Laboratory. Results will be uploaded once verified.
                  </div>
                )}

                {/* Doctor Approval Signature */}
                {lab.doctorApproval && (
                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg text-xs flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-slate-400">Approved by: </span>
                      <strong className="text-white">{lab.doctorApproval.approvedBy}</strong>
                      <span className="text-slate-400 text-[11px] ml-2">({lab.doctorApproval.approvedAt})</span>
                    </div>
                    <div className="text-slate-300 italic text-[11px]">"{lab.doctorApproval.notes}"</div>
                  </div>
                )}

                {/* AI Explanation Feature */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
                  <button
                    onClick={() => handleExplainLabWithAI(lab)}
                    disabled={aiExplaining === lab.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-medium text-xs transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{aiExplaining === lab.id ? 'Tegereza AI...' : 'Sobanukirwa Ibi Bisubizo (AI Explain)'}</span>
                  </button>

                  <div className="text-[11px] text-slate-500">Official Laboratory Diagnostic Report</div>
                </div>

                {/* AI Explanation Box */}
                {aiExplanation && aiExplanation.id === lab.id && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-xs text-cyan-200 leading-relaxed">
                    <div className="font-bold text-cyan-400 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Ibisobanuro byoroshye mu Kinyarwanda & English:
                    </div>
                    {aiExplanation.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              Fagitire & Ubwishyu / Invoices & Billing
            </h3>
            <span className="text-xs text-slate-400">Total: {patientInvoices.length} invoices</span>
          </div>

          <div className="space-y-4">
            {patientInvoices.map((inv) => (
              <div key={inv.id} className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{inv.invoiceNumber}</span>
                    <div className="text-xs text-slate-400 mt-0.5">Date: {inv.date} • Due: {inv.dueDate}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === 'paid'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : inv.status === 'partially_paid'
                        ? 'bg-sky-950 text-sky-300 border border-sky-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {inv.status.toUpperCase()}
                  </span>
                </div>

                <div className="divide-y divide-slate-800 text-xs">
                  {inv.items.map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span className="text-slate-300">{item.description} (x{item.quantity})</span>
                      <span className="font-mono text-white">${(item.cost * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">Total: </span>
                    <strong className="text-base text-white font-mono">${inv.total.toFixed(2)}</strong>
                    <span className="text-emerald-400 ml-2">(Insurance Paid: ${inv.insuranceDiscount.toFixed(2)})</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Patient Due: </span>
                    <strong className="text-base text-amber-300 font-mono">
                      ${Math.max(0, inv.total - inv.paidAmount).toFixed(2)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DISCHARGE SUMMARY */}
      {activeSubTab === 'discharge' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Incamake yo Gusezererwa / Discharge Summary
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              {currentPatient.dischargeDate ? 'Discharged' : 'Active Inpatient (Draft Plan)'}
            </span>
          </div>

          <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Diagnosis at Discharge</div>
              <div className="text-base font-bold text-white mt-1">{currentPatient.primaryDiagnosis}</div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-cyan-400">Amabwiriza yo mu rugo / Home Care Instructions:</div>
              <p className="text-slate-300 leading-relaxed">
                {currentPatient.dischargeSummary?.instructions ||
                  'Komeza ufate imiti yawe ku gihe. Gabanya umunyu mu byo urya, kandi ugume mu kiruhuko cy’iminsi 7. Iyo wumvise ububabare budasanzwe mu gituza cyangwa guhumeka nabi, hamagara ubutabazi byihuse kuri 912.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Gahunda yo Kugaruka (Follow-Up):</span>
                <div className="font-bold text-white mt-1">
                  {currentPatient.dischargeSummary?.followUpDate || 'Mu byumweru 2 (Cardiology Clinic)'}
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-slate-400">Muganga Wemeje:</span>
                <div className="font-bold text-cyan-400 mt-1">
                  {currentPatient.dischargeSummary?.dischargedBy || currentPatient.attendingDoctorName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BOOK NEW APPOINTMENT */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CalendarPlus className="w-5 h-5 text-cyan-400" />
                Gusaba Gahunda Nshya / Request Appointment
              </h3>
              <button
                onClick={() => setShowBookModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Ishami ry'Ubuvuzi / Department</label>
                <select
                  value={bookingDept}
                  onChange={(e) => setBookingDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology (Indwara z'Umutima)</option>
                  <option value="Emergency & Trauma">Emergency & Trauma</option>
                  <option value="Neurology">Neurology (Umutwe n'Imyakura)</option>
                  <option value="General Surgery">General Surgery (Kubaga)</option>
                  <option value="Pediatrics">Pediatrics (Abana)</option>
                  <option value="Pulmonology">Pulmonology (Ibihaha)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Muganga wifuza / Preferred Doctor</label>
                <select
                  value={bookingDoctor}
                  onChange={(e) => setBookingDoctor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Itariki / Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Isaha / Time</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="08:30 AM">08:30 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Impamvu / Visit Reason & Symptoms</label>
                <textarea
                  rows={3}
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Sobanura ibimenyetso ufite cyangwa impamvu yo kwisuzumisha..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hagarika / Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Ohereza Gahunda / Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
