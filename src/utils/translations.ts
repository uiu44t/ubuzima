import { AppLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    dashboard: string;
    operations: string;
    patients: string;
    appointments: string;
    wards: string;
    emergency: string;
    surgery: string;
    maternity: string;
    dental: string;
    laboratory: string;
    radiology: string;
    blood_bank: string;
    pharmacy: string;
    procurement: string;
    ambulance: string;
    billing: string;
    accounting: string;
    insurance: string;
    analytics: string;
    mobile_clinic: string;
    staff: string;
    patient_portal: string;
    system_settings: string;
    api_docs: string;
  };
  common: {
    search: string;
    filter: string;
    status: string;
    action: string;
    cancel: string;
    save: string;
    submit: string;
    print: string;
    downloadPdf: string;
    sendSms: string;
    viewDetails: string;
    registerPatient: string;
    statTriage: string;
    allBranches: string;
    total: string;
    subtotal: string;
    paid: string;
    balance: string;
    copay: string;
    insuranceCoverage: string;
    reference: string;
    date: string;
    time: string;
    doctor: string;
    patient: string;
    department: string;
  };
  payment: {
    rwandaPaymentGateway: string;
    chooseMethod: string;
    momoPrompt: string;
    airtelPrompt: string;
    cardPayment: string;
    bankTransfer: string;
    cashPayment: string;
    insuranceDirect: string;
    partialPayment: string;
    advanceDeposit: string;
    refund: string;
    enterPhone: string;
    amountToPay: string;
    processingTransaction: string;
    verifyingNetwork: string;
    paymentSuccess: string;
    receiptTitle: string;
    cashierReconciliation: string;
    todayRevenue: string;
    transactions?: string;
  };
  operations?: any;
  procurement?: any;
  surgery?: any;
  nationalId?: any;
  accounting?: any;
  analytics?: any;
  billing?: any;
  dental?: any;
  maternity?: any;
  [key: string]: any;
}

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en: {
    appName: 'Kigali Central Teaching Hospital',
    appSubtitle: 'Centre Hospitalier Universitaire de Kigali (CHUK)',
    tagline: 'Enterprise Healthcare Management & Clinical Operations Platform',
    nav: {
      dashboard: 'Executive Dashboard',
      operations: 'Hospital Operations',
      patients: 'Patient Directory & EMR',
      appointments: 'Outpatient Appointments',
      wards: 'Inpatient Beds & Wards',
      emergency: 'STAT Emergency & Triage',
      surgery: 'Operating Theatre (OT)',
      maternity: 'Maternity & Neonatal (NICU)',
      dental: 'Dental Medicine & Chart',
      laboratory: 'Laboratory Information (LIS)',
      radiology: 'Radiology & PACS Viewer',
      blood_bank: 'Blood Bank & Transfusion',
      pharmacy: 'Pharmacy & Dispensary',
      procurement: 'Procurement & Supply Chain',
      ambulance: 'Ambulance Fleet & Dispatch',
      billing: 'Billing & Cashier Gateway',
      accounting: 'Accounting & General Ledger',
      insurance: 'Insurance e-Claims Adjudication',
      analytics: 'Analytics & Business Intelligence',
      mobile_clinic: 'Doctor/Nurse Mobile Clinic',
      staff: 'Medical Staff & Rosters',
      patient_portal: 'Patient Portal',
      system_settings: 'Enterprise Security & RBAC',
      api_docs: 'REST API & Interoperability',
    },
    common: {
      search: 'Search by name, MRN, phone...',
      filter: 'Filter',
      status: 'Status',
      action: 'Action',
      cancel: 'Cancel',
      save: 'Save Changes',
      submit: 'Submit',
      print: 'Print Document',
      downloadPdf: 'Download PDF',
      sendSms: 'Send SMS Receipt',
      viewDetails: 'View Details',
      registerPatient: 'Register Patient',
      statTriage: 'STAT Triage',
      allBranches: 'All Hospital Branches',
      total: 'Total',
      subtotal: 'Subtotal',
      paid: 'Paid',
      balance: 'Balance Due',
      copay: 'Patient Copay',
      insuranceCoverage: 'Insurance Coverage',
      reference: 'Transaction Ref',
      date: 'Date',
      time: 'Time',
      doctor: 'Attending Doctor',
      patient: 'Patient Name',
      department: 'Department',
    },
    payment: {
      rwandaPaymentGateway: 'Rwanda National Payment Gateway',
      chooseMethod: 'Select Payment Method',
      momoPrompt: 'MTN Mobile Money (MoMo)',
      airtelPrompt: 'Airtel Money Rwanda',
      cardPayment: 'Visa / Mastercard',
      bankTransfer: 'Bank Wire / Transfer (RWF)',
      cashPayment: 'Physical Hospital Cashier',
      insuranceDirect: 'Insurance Pre-Authorization',
      partialPayment: 'Partial Payment Installment',
      advanceDeposit: 'Admission Advance Deposit',
      refund: 'Patient Refund / Adjustment',
      enterPhone: 'Enter Mobile Money Number (+250 78... / +250 73...)',
      amountToPay: 'Amount to Pay (RWF)',
      processingTransaction: 'Initiating USSD Network Prompt...',
      verifyingNetwork: 'Verifying Transaction with Telco...',
      paymentSuccess: 'Payment Verified Successfully!',
      receiptTitle: 'Official Hospital Payment Receipt',
      cashierReconciliation: 'Cashier Daily Shift Reconciliation',
      todayRevenue: "Today's Revenue Collections",
      transactions: 'Payment Transactions',
    },
    operations: {
      title: 'Hospital Operational Command & Bed Bureau',
      subtitle: 'Real-time telemetry across clinical departments, emergency bay, and resource utilization',
      occupiedBeds: 'Occupied Inpatient Beds',
      availableBeds: 'Available Beds',
      activeEmergencies: 'Active Emergency Cases',
      pendingLabs: 'Pending Lab Tests',
      otUtilization: 'Operating Theatres in Surgery',
      icuBeds: 'ICU Capacity & Occupancy',
      ambulanceFleet: 'Active Ambulances on Dispatch',
    },
    procurement: {
      title: 'Procurement, Warehouse & Medical Supply Chain',
      subtitle: 'Hospital requisition orders, inventory replenishment, and approved supplier database',
      purchaseOrders: 'Purchase Orders',
      centralInventory: 'Central Warehouse Inventory',
      suppliers: 'Approved Vendors & Suppliers',
      createPO: 'Create Requisition Order',
      lowStockAlerts: 'Low Stock Alert Thresholds',
    },
    surgery: {
      title: 'Operating Theatres & Surgical Schedule',
      subtitle: 'Surgical bookings, pre-op verification, WHO Surgical Safety Checklist, and post-op recovery',
      scheduleSurgery: 'Schedule Surgery',
      theatreRooms: 'Operating Theatre Bays',
      activeCases: 'Surgical Procedures in Progress',
      whoChecklist: 'WHO Surgical Safety Checklist',
    },
    nationalId: {
      title: 'Rwanda National Patient Identity & Insurance Verification',
      subtitle: 'NIDA Citizen Identity Verification, RSSB/Mutuelle/MMI Eligibility, and Inter-Facility Referrals',
      demoBanner: 'DEMO MODE — NOT CONNECTED TO GOVERNMENT SYSTEMS (NIDA / RSSB / RHIE)',
      ninInputLabel: 'Enter 16-Digit National ID (Indangamuntu)',
      ninPlaceholder: 'e.g. 1 1990 8 0012345 1 20',
      verifyButton: 'Verify Citizen Identity',
      identityVerified: 'Identity Verified by NIDA Provider',
      insuranceCheck: 'Verify Insurance Eligibility',
      consentNotice: 'Patient Consent Recorded (Rwanda Law N° 058/2021)',
      createEncounter: 'Create Hospital Encounter / EMR Link',
      referPatient: 'Create Inter-Facility Referral',
      auditLog: 'NIDA & RHIE Access Audit Trail',
      demoNote: 'This prototype uses a sandbox adapter layer. Production NIDA and RSSB API credentials can be plugged in via environment variables.',
    },
    accounting: {
      accounting: 'Accounting & Financial Ledger',
      recordExpense: 'Record Operational Expense',
      generalLedger: 'General Ledger',
      expenses: 'Operating Expenses',
      financialStatements: 'Financial Statements (P&L)',
    },
    analytics: {
      analytics: 'Hospital Analytics',
    },
    billing: {
      createInvoice: 'Generate Hospital Invoice',
      invoices: 'Hospital Invoices',
      title: 'Hospital Billing & Invoices',
    },
    dental: {
      title: 'Dental Medicine & Odontogram',
      recordExam: 'Record Dental Examination',
      teethChart: 'Odontogram & Dental Chart',
      treatmentPlan: 'Dental Treatment Plan',
      periodontal: 'Periodontal Screening',
      procedures: 'Dental Procedures & Billing',
      healthy: 'Healthy',
      caries: 'Caries',
      missing: 'Missing',
      filled: 'Filled',
      crown: 'Crown',
    },
    maternity: {
      title: 'Maternity, Labour & Neonatal Care (NICU)',
      registerMother: 'Register Maternity Admission',
      recordDelivery: 'Record Childbirth Delivery',
      activeLabour: 'Active Labour Ward',
      partograph: 'Digital Partograph',
      postpartum: 'Postpartum & Neonates',
    },
  },
  rw: {
    appName: 'Ibitaro Bikuru bya Kaminuza bya Kigali',
    appSubtitle: 'Centre Hospitalier Universitaire de Kigali (CHUK)',
    tagline: 'Gahunda Rusange yo Gucunga Ibitaro n’Ubuvuzi buhanitse',
    nav: {
      dashboard: 'Ikibaho cy’Ibitaro',
      operations: 'Ibikorwa by’Ibitaro',
      patients: 'Abarwayi & Dosiye zabo',
      appointments: 'Gahunda zo kwa Muganga',
      wards: 'Ibyumba & Ibitanda',
      emergency: 'Ubutabazi Bwihuse (Emergencies)',
      surgery: 'Icyumba cy’Ububazi (OT)',
      maternity: 'Kubyara & Abana Bavutse (NICU)',
      dental: 'Ubuvuzi bw’Amenyo & Imbonerahamwe',
      laboratory: 'Laboratwari (LIS)',
      radiology: 'Guca mu Cyuma & Radiologiya',
      blood_bank: 'Ikigega cy’Amaraso (Blood Bank)',
      pharmacy: 'Farisiyo & Imiti',
      procurement: 'Gutumiza Imiti & Ububiko',
      ambulance: 'Imbangukiragutabara',
      billing: 'Kwishyura & Inyemezabwishyu',
      accounting: 'Imicungire y’Imari & Amakonti',
      insurance: 'Ubwishingizi & Kwemeza Fagitire',
      analytics: 'Isesenguramakuru & Raporo',
      mobile_clinic: 'Gahunda ya Muganga kuri Telefoni',
      staff: 'Abaganga & Abakozi',
      patient_portal: 'Urubuga rw’Umurwayi',
      system_settings: 'Umutekano & Ubuyobozi Bukuru',
      api_docs: 'Imiyoboro ya API (Interoperability)',
    },
    common: {
      search: 'Shakisha izina, MRN, telefoni...',
      filter: 'Gushungura',
      status: 'Imiterere',
      action: 'Igikorwa',
      cancel: 'Guhagarika',
      save: 'Kubika Impinduka',
      submit: 'Ohereza',
      print: 'Gucapa Inyandiko',
      downloadPdf: 'Kumanura PDF',
      sendSms: 'Kohereza Inyemezabwishyu kuri SMS',
      viewDetails: 'Kureba Ibirambuye',
      registerPatient: 'Kwandika Umurwayi',
      statTriage: 'Ubutabazi Bwihuse',
      allBranches: 'Amashami Yose y’Ibitaro',
      total: 'Igiteranyo Rusange',
      subtotal: 'Igiteranyo cy’Ibikoresho',
      paid: 'Icyishyuwe',
      balance: 'Asigaye Kwishyurwa',
      copay: 'Uruhare rw’Umurwayi',
      insuranceCoverage: 'Icyishyurwa n’Ubwishingizi',
      reference: 'Nimero y’Ubwishyu',
      date: 'Itariki',
      time: 'Isaha',
      doctor: 'Muganga Uvura',
      patient: 'Izina ry’Umurwayi',
      department: 'Ishami ry’Ubuvuzi',
    },
    payment: {
      rwandaPaymentGateway: 'Uburyo bwo Kwishyura mu Rwanda (Gateway)',
      chooseMethod: 'Hitamo Uburyo bwo Kwishyura',
      momoPrompt: 'MTN Mobile Money (MoMo)',
      airtelPrompt: 'Airtel Money Rwanda',
      cardPayment: 'Ikarita ya Banki (Visa / Mastercard)',
      bankTransfer: 'Kwishyura kuri Konti ya Banki (RWF)',
      cashPayment: 'Amafaranga y’Inoti ku Mukozi (Cash)',
      insuranceDirect: 'Kwishyurirwa n’Ubwishingizi Ako Kanya',
      partialPayment: 'Kwishyura Igice (Installment)',
      advanceDeposit: 'Ingwate / Kwishyura Mbere (Deposit)',
      refund: 'Gusubiza Amafaranga Umurwayi (Refund)',
      enterPhone: 'Injiza Nimero ya Mobile Money (+250 78... / +250 73...)',
      amountToPay: 'Amafaranga yo Kwishyura (RWF)',
      processingTransaction: 'Gusaba Uburenganzira kuri Telefoni...',
      verifyingNetwork: 'Gusuzuma ko Amafaranga Yagezeho...',
      paymentSuccess: 'Ubwishyu Bwemejwe neza!',
      receiptTitle: 'Inyemezabwishyu Yemewe y’Ibitaro',
      cashierReconciliation: 'Ibarurishamutungo rya Buri Munsi (Cashier Shift)',
      todayRevenue: 'Amafaranga Yinjiye Uyu Munsi',
    },
    operations: {
      title: 'Imikorere y’Ibitaro muri Rusange & Imyanya y’Ibitanda',
      subtitle: 'Amakuru y’uburyo amashami yose akora, ubutabazi bwihuse, n’ibikoresho by’ibitaro',
      occupiedBeds: 'Ibitanda Birwayemo Abarwayi',
      availableBeds: 'Ibitanda Bisigaye Byiteguye',
      activeEmergencies: 'Abarwayi Barembye muri Emergensi',
      pendingLabs: 'Ibizamini Byatanzwe Bitaraboneka',
      otUtilization: 'Ibyumba by’Ibagiro Birimo Gukora',
      icuBeds: 'Ibitanda byo muri Reanimasiyo (ICU)',
      ambulanceFleet: 'Imbangukiragutabara Ziri mu Butumwa',
    },
    procurement: {
      title: 'Gutumiza Imiti, Ububiko & Ibikoresho by’Ibitaro',
      subtitle: 'Gutumiza imiti n’ibikoresho, kureba ibishize mu bubiko, n’abacuruzi bemewe',
      purchaseOrders: 'Inyandiko zo Gutumiza Imiti (PO)',
      centralInventory: 'Ububiko Bukuru bw’Ibitaro',
      suppliers: 'Abacuruzi n’Inganda Bemewe',
      createPO: 'Tanga Icyifuzo cyo Gutumiza',
      lowStockAlerts: 'Imiti Igomba Kongerwa vuba',
    },
    surgery: {
      title: 'Ibyumba by’Ibagiro & Gahunda y’Ababagwa',
      subtitle: 'Gahunda z’abagiye kubagwa, urutonde rw’umutekano rwa OMS, no gukurikirana abamaze kubagwa',
      scheduleSurgery: 'Shyiraho Gahunda yo Kubaga',
      theatreRooms: 'Ibyumba by’Ibagiro Byose',
      activeCases: 'Abarwayi barimo kubagwa aka kanya',
      whoChecklist: 'Urutonde rw’Umutekano wo Kubaga rwa OMS',
    },
    nationalId: {
      title: 'Kugenzura Indangamuntu y’Umurwayi & Ubwishingizi mu Rwanda',
      subtitle: 'Gusuzuma Indangamuntu muri NIDA, Kumenya Ubwishingizi bwa RSSB/Mutuelle/MMI, no Kohereza Umurwayi mu Bindi Bitaro',
      demoBanner: 'ICYITONDERWA: IKI NI ICYITEGEREREZO (DEMO MODE) — NTABWO CYIFATANYIJE NA SISTEMU YA LETA (NIDA / RSSB / RHIE)',
      ninInputLabel: 'Injiza Imibare 16 y\'Indangamuntu y\'u Rwanda',
      ninPlaceholder: 'urugero: 1 1990 8 0012345 1 20',
      verifyButton: 'Kugenzura Indangamuntu muri NIDA',
      identityVerified: 'Amakuru y\'Indangamuntu Yemejwe muri NIDA',
      insuranceCheck: 'Kugenzura Ubwishingizi bwa RSSB / Mutuelle',
      consentNotice: 'Uruhushya rw\'Umurwayi rwanditswe (Itegeko N° 058/2021 ryo kurinda amakuru bwite)',
      createEncounter: 'Kwandika Umurwayi muri Dosiye y\'Ibitaro (EMR)',
      referPatient: 'Kohereza Umurwayi mu Bindi Bitaro (Referral)',
      auditLog: 'Inyandiko z\'Umutekano ku bageze ku Makuru (Audit Trail)',
      demoNote: 'Iyi porogaramu ikoresha sandbox. Kode z\'ukuri za NIDA na RSSB zishobora gushyirwamo binyuze muri variables z\'ibidukikije.',
    },
    accounting: {
      accounting: 'Imicungire y’Imari & Amakonti',
      recordExpense: 'Kwandika Amafaranga Yasohotse',
      generalLedger: 'Igitabo cy’Imari (General Ledger)',
      expenses: 'Ibyasohotse Byose',
      financialStatements: 'Raporo y’Imari n’Inyungu',
    },
    analytics: {
      analytics: 'Isesenguramakuru',
    },
    billing: {
      createInvoice: 'Kora Inyemezabwishyu Nshya',
      invoices: 'Inyemezabwishyu z\'Abarwayi',
      title: 'Kwishyura & Fagitire',
    },
    dental: {
      title: 'Ubuvuzi bw’Amenyo & Imbonerahamwe',
      recordExam: 'Suzuma Amenyo',
      teethChart: 'Imbonerahamwe y’Amenyo',
      treatmentPlan: 'Gahunda yo Kuvura Amenyo',
      periodontal: 'Isesengura ry’Ishinya',
      procedures: 'Ibikorwa byakozwe ku Menyo',
      healthy: 'Kizima',
      caries: 'Kiborera',
      missing: 'Kirabuze',
      filled: 'Cyasannye',
      crown: 'Cyambitswe Ikamba',
    },
    maternity: {
      title: 'Kubyara & Abana Bavutse (NICU)',
      registerMother: 'Kwandika Umubyeyi Uje Kubyara',
      recordDelivery: 'Kwandika Umwana Wavutse',
      activeLabour: 'Icyumba cyo Kubyara',
      partograph: 'Ikarita yo Gukurikirana Ikise (Partograph)',
      postpartum: 'Aho Abamaze Kubyara Baruhukira',
    },
  },
};
