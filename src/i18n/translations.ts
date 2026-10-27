import { Language } from '../types/index.ts';

export interface Translations {
  appName: string;
  tagline: string;
  sdgGoal: string;
  roleWorker: string;
  roleAdmin: string;
  switchRole: string;
  sampleModeBadge: string;
  sectorConstruction: string;
  sectorCollege: string;
  switchSector: string;

  // Nav
  navShift: string;
  navPayslip: string;
  navSafety: string;
  navFeedback: string;
  navOverview: string;
  navHazards: string;
  navFatigue: string;
  navSentiment: string;
  navSettings: string;
  navAbout: string;

  // Shift Check-in / Out
  checkInTitle: string;
  checkOutTitle: string;
  checkInButton: string;
  checkOutButton: string;
  manualCheckInFallback: string;
  gpsActive: string;
  gpsError: string;
  distanceToSite: string;
  withinSite: string;
  outsideSite: string;
  lowAccuracyWarning: string;
  shiftInProgress: string;
  elapsedTime: string;
  manualFlag: string;
  standardHours: string;
  overtimeHours: string;

  // Payslip
  payslipTitle: string;
  grossPay: string;
  regularPay: string;
  overtimePay: string;
  deductions: string;
  netPay: string;
  hourlyRate: string;
  overtimeRate: string;
  itemizedSummary: string;
  printPayslip: string;

  // Safety
  safetyTitle: string;
  reportHazardButton: string;
  category: string;
  severity: string;
  description: string;
  voiceInput: string;
  listeningNow: string;
  stopListening: string;
  statusReported: string;
  statusInReview: string;
  statusResolved: string;
  myReports: string;

  // Feedback
  feedbackTitle: string;
  anonymousBanner: string;
  rateManager: string;
  rateConditions: string;
  optionalComment: string;
  submitFeedback: string;
  feedbackSubmittedNotice: string;

  // Accessibility / Audio
  readAloud: string;
  listenToSummary: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'FairShift',
    tagline: 'Decent Work & Transparent Pay for Every Worker',
    sdgGoal: 'UN SDG 8: Decent Work & Economic Growth',
    roleWorker: 'Worker App',
    roleAdmin: 'Employer Dashboard',
    switchRole: 'Switch Role',
    sampleModeBadge: 'Sample Data Mode',
    sectorConstruction: 'Metro Tower Construction',
    sectorCollege: 'S.R.M Institue Of Science and Technology KTR',
    switchSector: 'Switch Sector',

    navShift: 'GPS Shift',
    navPayslip: 'Payslip',
    navSafety: 'Safety',
    navFeedback: 'Feedback',
    navOverview: 'Overview',
    navHazards: 'Hazards',
    navFatigue: 'Fatigue Alerts',
    navSentiment: 'Worker Feedback',
    navSettings: 'Site Settings',
    navAbout: 'SDG 8 Info',

    checkInTitle: 'Shift Check-in',
    checkOutTitle: 'Shift Check-out',
    checkInButton: 'GPS Check-In to Site',
    checkOutButton: 'Complete Shift & Check-Out',
    manualCheckInFallback: 'Offline / Manual Check-In',
    gpsActive: 'GPS Located',
    gpsError: 'GPS Unavailable or Denied',
    distanceToSite: 'Distance to Site',
    withinSite: 'Inside Authorized Geofence',
    outsideSite: 'Outside Work Site Boundary',
    lowAccuracyWarning: 'Low accuracy GPS reading (>100m). Ensure clear sky view.',
    shiftInProgress: 'Active Shift in Progress',
    elapsedTime: 'Shift Duration',
    manualFlag: 'Manual Verification Required',
    standardHours: 'Standard Hours',
    overtimeHours: 'Overtime Hours',

    payslipTitle: 'My Transparent Payslip',
    grossPay: 'Gross Earnings',
    regularPay: 'Regular Pay',
    overtimePay: 'Overtime Pay (1.5x)',
    deductions: 'Statutory Deductions',
    netPay: 'Take-Home Net Pay',
    hourlyRate: 'Base Hourly Rate',
    overtimeRate: 'Overtime Rate',
    itemizedSummary: 'Transparent Hours Breakdown',
    printPayslip: 'Print / Save Receipt',

    safetyTitle: 'Safety & Hazard Reporting',
    reportHazardButton: 'Submit Safety Report',
    category: 'Hazard Category',
    severity: 'Urgency Level',
    description: 'Hazard Description',
    voiceInput: 'Tap to Speak (Voice Report)',
    listeningNow: 'Listening... Speak clearly',
    stopListening: 'Stop Recording',
    statusReported: 'Reported',
    statusInReview: 'In Review',
    statusResolved: 'Resolved',
    myReports: 'Recent Hazard Reports',

    feedbackTitle: '100% Anonymous Feedback',
    anonymousBanner: 'Zero worker ID recorded. Your voice is fully protected.',
    rateManager: 'Manager Fairness & Support',
    rateConditions: 'Working Conditions & Safety',
    optionalComment: 'Comments, suggestions or concerns',
    submitFeedback: 'Submit Anonymously',
    feedbackSubmittedNotice: 'Thank you! Your feedback has been sent anonymously.',

    readAloud: 'Read Aloud',
    listenToSummary: 'Audio summary for accessibility',
  },
  es: {
    appName: 'FairShift',
    tagline: 'Trabajo Decente y Pago Transparente para Todos',
    sdgGoal: 'ODS 8 ONU: Trabajo Decente y Crecimiento Económico',
    roleWorker: 'App del Trabajador',
    roleAdmin: 'Panel de Empresa',
    switchRole: 'Cambiar Rol',
    sampleModeBadge: 'Modo Datos de Muestra',
    sectorConstruction: 'Construcción Torre Metro',
    sectorCollege: 'S.R.M Institue Of Science and Technology KTR',
    switchSector: 'Cambiar Sector',

    navShift: 'Turno GPS',
    navPayslip: 'Nómina',
    navSafety: 'Seguridad',
    navFeedback: 'Voz Anónima',
    navOverview: 'Resumen',
    navHazards: 'Peligros',
    navFatigue: 'Fatiga',
    navSentiment: 'Comentarios',
    navSettings: 'Ajustes',
    navAbout: 'Sobre ODS 8',

    checkInTitle: 'Entrada de Turno',
    checkOutTitle: 'Salida de Turno',
    checkInButton: 'Registrar Entrada GPS',
    checkOutButton: 'Finalizar Turno y Salir',
    manualCheckInFallback: 'Registro Manual / Sin GPS',
    gpsActive: 'GPS Localizado',
    gpsError: 'GPS no disponible o denegado',
    distanceToSite: 'Distancia a la Obra',
    withinSite: 'Dentro de la Zona Autorizada',
    outsideSite: 'Fuera del Límite del Sitio',
    lowAccuracyWarning: 'Lectura GPS de baja precisión (>100m).',
    shiftInProgress: 'Turno Activo en Curso',
    elapsedTime: 'Tiempo Transcurrido',
    manualFlag: 'Verificación Manual Requerida',
    standardHours: 'Horas Ordinarias',
    overtimeHours: 'Horas Extras',

    payslipTitle: 'Mi Nómina Transparente',
    grossPay: 'Salario Bruto',
    regularPay: 'Pago Ordinario',
    overtimePay: 'Pago Horas Extras (1.5x)',
    deductions: 'Deducciones Legales',
    netPay: 'Salario Neto a Percibir',
    hourlyRate: 'Tarifa Base por Hora',
    overtimeRate: 'Tarifa Hora Extra',
    itemizedSummary: 'Desglose Transparente de Horas',
    printPayslip: 'Imprimir / Guardar Recibo',

    safetyTitle: 'Reporte de Peligros y Seguridad',
    reportHazardButton: 'Enviar Reporte de Peligro',
    category: 'Categoría del Peligro',
    severity: 'Nivel de Urgencia',
    description: 'Descripción del Peligro',
    voiceInput: 'Tocar para Hablar (Voz)',
    listeningNow: 'Escuchando... Hable claramente',
    stopListening: 'Detener Grabación',
    statusReported: 'Reportado',
    statusInReview: 'En Revisión',
    statusResolved: 'Resuelto',
    myReports: 'Reportes Recientes',

    feedbackTitle: 'Comentarios 100% Anónimos',
    anonymousBanner: 'Cero identificación guardada. Su voz está protegida.',
    rateManager: 'Trato y Apoyo del Supervisor',
    rateConditions: 'Condiciones de Trabajo y Seguridad',
    optionalComment: 'Comentarios o inquietudes opcionales',
    submitFeedback: 'Enviar Anónimamente',
    feedbackSubmittedNotice: '¡Gracias! Su comentario fue enviado de forma anónima.',

    readAloud: 'Leer en voz alta',
    listenToSummary: 'Resumen en audio para accesibilidad',
  },
  hi: {
    appName: 'FairShift',
    tagline: 'हर कर्मचारी के लिए पारदर्शी वेतन और सुरक्षित काम',
    sdgGoal: 'संयुक्त राष्ट्र एसडीजी 8: गरिमापूर्ण कार्य',
    roleWorker: 'श्रमिक ऐप',
    roleAdmin: 'प्रबंधक डैशबोर्ड',
    switchRole: 'भूमिका बदलें',
    sampleModeBadge: 'नमूना डेटा मोड',
    sectorConstruction: 'मेट्रो टॉवर निर्माण स्थल',
    sectorCollege: 'S.R.M Institue Of Science and Technology KTR',
    switchSector: 'क्षेत्र बदलें',

    navShift: 'जीपीएस हाजिरी',
    navPayslip: 'वेतन पर्ची',
    navSafety: 'सुरक्षा रिपोर्ट',
    navFeedback: 'गुमनाम आवाज',
    navOverview: 'अवलोकन',
    navHazards: 'खतरे',
    navFatigue: 'थकान चेतावनी',
    navSentiment: 'श्रमिक प्रतिक्रिया',
    navSettings: 'सेटिंग्स',
    navAbout: 'एसडीजी 8 के बारे में',

    checkInTitle: 'शिफ्ट शुरू करें',
    checkOutTitle: 'शिफ्ट समाप्त करें',
    checkInButton: 'जीपीएस हाजिरी लगाएं',
    checkOutButton: 'शिफ्ट खत्म कर चेक-आउट करें',
    manualCheckInFallback: 'मैन्युअल / बिना जीपीएस हाजिरी',
    gpsActive: 'जीपीएस सक्रिय है',
    gpsError: 'जीपीएस उपलब्ध नहीं है',
    distanceToSite: 'कार्यस्थल से दूरी',
    withinSite: 'कार्यस्थल सीमा के भीतर',
    outsideSite: 'कार्यस्थल सीमा से बाहर',
    lowAccuracyWarning: 'जीपीएस सिग्नल कमजोर है (>100 मी)।',
    shiftInProgress: 'सक्रिय शिफ्ट जारी है',
    elapsedTime: 'काम किया गया समय',
    manualFlag: 'मैन्युअल सत्यापन आवश्यक',
    standardHours: 'सामान्य घंटे',
    overtimeHours: 'ओवरटाइम घंटे',

    payslipTitle: 'मेरी पारदर्शी वेतन पर्ची',
    grossPay: 'कुल वेतन',
    regularPay: 'सामान्य वेतन',
    overtimePay: 'ओवरटाइम वेतन (1.5x)',
    deductions: 'कटौतियां (टैक्स/बीमा)',
    netPay: 'हाथ में मिलने वाला वेतन',
    hourlyRate: 'प्रति घंटा दर',
    overtimeRate: 'ओवरटाइम दर',
    itemizedSummary: 'घंटों का पारदर्शी विवरण',
    printPayslip: 'रसीद प्रिंट / सहेजें',

    safetyTitle: 'सुरक्षा और खतरे की सूचना',
    reportHazardButton: 'खतरे की रिपोर्ट दर्ज करें',
    category: 'खतरे की श्रेणी',
    severity: 'गंभीरता स्तर',
    description: 'खतरे का विवरण',
    voiceInput: 'बोलकर रिपोर्ट दर्ज करें',
    listeningNow: 'सुन रहे हैं... कृपया स्पष्ट बोलें',
    stopListening: 'रिकॉर्डिंग बंद करें',
    statusReported: 'दर्ज किया गया',
    statusInReview: 'जाँच जारी',
    statusResolved: 'हल किया गया',
    myReports: 'हालिया सुरक्षा रिपोर्टें',

    feedbackTitle: '100% गुमनाम प्रतिक्रिया',
    anonymousBanner: 'कोई नाम या पहचान दर्ज नहीं होती। आपकी आवाज सुरक्षित है।',
    rateManager: 'प्रबंधक का व्यवहार और सहयोग',
    rateConditions: 'कार्यस्थल की स्थिति और सुरक्षा',
    optionalComment: 'आपकी राय या सुझाव (वैकल्पिक)',
    submitFeedback: 'गुमनाम भेजें',
    feedbackSubmittedNotice: 'धन्यवाद! आपकी प्रतिक्रिया सुरक्षित रूप से भेज दी गई है।',

    readAloud: 'सुनें (आवाज)',
    listenToSummary: 'सुगमता हेतु ऑडियो विवरण',
  },
};
