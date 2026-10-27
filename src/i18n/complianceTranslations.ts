import { Language } from '../types/index.ts';

export interface PolicySection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface ComplianceLocaleContent {
  footerAbout: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
  footerAccessibility: string;
  footerContact: string;
  themeLight: string;
  themeDark: string;
  toggleThemeLabel: string;
  demoNoticeBanner: string;
  lastUpdatedLabel: string;
  backToApp: string;

  privacy: {
    title: string;
    subtitle: string;
    sections: PolicySection[];
  };

  terms: {
    title: string;
    subtitle: string;
    sections: PolicySection[];
  };

  cookies: {
    title: string;
    subtitle: string;
    clearStorageBtn: string;
    clearedSuccessMsg: string;
    sections: PolicySection[];
  };

  accessibility: {
    title: string;
    subtitle: string;
    sections: PolicySection[];
  };

  contact: {
    title: string;
    subtitle: string;
    formTitle: string;
    subjectLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitBtn: string;
    successNotice: string;
  };
}

export const COMPLIANCE_TRANSLATIONS: Record<Language, ComplianceLocaleContent> = {
  en: {
    footerAbout: 'About',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Use',
    footerCookies: 'Cookie & Storage Notice',
    footerAccessibility: 'Accessibility Statement',
    footerContact: 'Contact',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    toggleThemeLabel: 'Toggle color theme',
    demoNoticeBanner: 'Demonstration project. Not a production service.',
    lastUpdatedLabel: 'Last updated: October 26, 2026',
    backToApp: 'Back to FairShift',

    privacy: {
      title: 'Privacy Policy',
      subtitle:
        'Plain-language explanation of how FairShift handles worker and administrator data.',
      sections: [
        {
          heading: '1. What Data We Collect',
          body: 'FairShift collects only the minimum information required to demonstrate transparent shift tracking and workplace safety:',
          bullets: [
            'Shift check-in and check-out timestamps.',
            'GPS coordinates at check-in only (latitude, longitude, and accuracy reading) when you use GPS check-in.',
            'Safety and hazard reports (category, urgency level, text or voice-transcribed description, and resolution status).',
            'Anonymous feedback (1–5 star ratings for manager fairness and working conditions, plus optional plain-text comments with NO worker identifier).',
            'Interface preferences (selected language and light/dark theme preference).',
          ],
        },
        {
          heading: '2. Why We Use This Data',
          body: 'Each data item serves a specific, transparent purpose aligned with UN SDG 8 (Decent Work and Economic Growth):',
          bullets: [
            'GPS coordinates are used ONLY to verify presence within the configured site geofence radius at the moment of check-in. FairShift never performs continuous background tracking.',
            'Shift timestamps are used to compute regular hours, 1.5x overtime hours, itemised payslips, and proactive worker fatigue alerts.',
            'Anonymous feedback stores NO worker identifier, name, email, or device ID so workers can speak honestly without fear of retaliation.',
            'The demonstration uses local seeded sample data unless the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are explicitly configured.',
          ],
        },
        {
          heading: '3. How Data Is Stored',
          body: 'By default, FairShift runs in offline-capable Sample Data Mode and stores records locally in your browser’s localStorage. When connected to a configured Supabase instance, records are stored in PostgreSQL tables protected by Row Level Security (RLS) and input sanitization.',
        },
        {
          heading: '4. Who Can See It',
          body: 'Workers see their own shift logs, payslip calculations, and real-time status updates on safety reports. Administrators see attendance overviews, fatigue alerts, safety hazard queues, and aggregated anonymous feedback summaries—administrators can NEVER see feedback authors because no author identifier is collected or stored.',
        },
        {
          heading: '5. Data Retention',
          body: 'In local demonstration mode, data remains in your browser until you clear browser storage or click the "Reset Local Demo Storage" button on the Cookie & Storage Notice page. If a Supabase backend is configured by an evaluator, retention is governed by that administrator’s project lifecycle.',
        },
        {
          heading: '6. Your Rights (Access, Correction & Deletion)',
          body: 'You have the right to inspect, correct, or delete any data stored during your use of this demonstration. You can view your recorded hours directly in the Worker App, reset local storage at any time, or submit a data inquiry via [CONTACT EMAIL].',
        },
        {
          heading: '7. Children’s Privacy',
          body: 'FairShift is a workforce and workplace safety platform intended for adult workers and students/staff of working age. We do not knowingly collect personal information from children.',
        },
        {
          heading: '8. Changes to This Policy',
          body: 'If we update this Privacy Policy for future hackathon or academic iterations, we will revise the "Last updated" date at the top of this page.',
        },
        {
          heading: '9. Contact',
          body: 'For privacy questions or data requests regarding this demonstration project, contact: [CONTACT EMAIL] (Organization: [ORGANIZATION NAME], Address: [MAILING ADDRESS]).',
        },
      ],
    },

    terms: {
      title: 'Terms of Use',
      subtitle: 'Rules and disclaimers governing the use of the FairShift hackathon demonstration.',
      sections: [
        {
          heading: '1. Purpose and Scope (Hackathon Demonstration)',
          body: 'FairShift is an educational and hackathon demonstration project built for UN Sustainable Development Goal 8 (Decent Work and Economic Growth) as part of Prompt Wars 2026 x SRM ACM Student Chapter. It is provided to showcase transparent overtime calculation, geofenced check-ins, safety reporting, and anonymous worker voice.',
        },
        {
          heading: '2. Acceptable Use',
          body: 'You may use this application to evaluate its code quality, security architecture, accessibility features, and cross-sector workflows. You agree not to attempt unauthorized disruption, automated scraping abuse, or injection of malicious payloads.',
        },
        {
          heading: '3. No Misuse of Safety Reports',
          body: 'The safety and hazard reporting module in this demonstration is not connected to live emergency services (such as 911, 112, or campus emergency dispatch). Never use this demonstration app to report real-world life-threatening emergencies; always contact official site safety personnel or emergency responders directly.',
        },
        {
          heading: '4. No Warranty',
          body: 'This software and demonstration environment are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, or statutory payroll compliance.',
        },
        {
          heading: '5. Limitation of Liability',
          body: 'To the fullest extent permitted by applicable law in [GOVERNING JURISDICTION], the author and contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use this demonstration project or its sample payslip calculations.',
        },
        {
          heading: '6. Changes to Terms',
          body: 'These Terms of Use may be updated periodically to reflect new demonstration features. Continued use of the demonstration constitutes acceptance of the revised terms.',
        },
        {
          heading: '7. Contact',
          body: 'Questions regarding these Terms of Use may be directed to [CONTACT EMAIL].',
        },
      ],
    },

    cookies: {
      title: 'Cookie & Storage Notice',
      subtitle: 'How FairShift uses browser localStorage and zero tracking cookies.',
      clearStorageBtn: 'Reset Local Demo Storage to Defaults',
      clearedSuccessMsg: 'Local browser storage has been reset to clean sample defaults.',
      sections: [
        {
          heading: '1. Zero Third-Party Tracking or Advertising Cookies',
          body: 'FairShift does NOT use advertising cookies, analytics trackers, or cross-site fingerprinting scripts.',
        },
        {
          heading: '2. Essential Browser LocalStorage Keys',
          body: 'To allow the application to work offline and without external database credentials, FairShift stores the following keys in your browser’s localStorage:',
          bullets: [
            'fairshift_workers_v1, fairshift_shifts_v1, fairshift_hazards_v1, fairshift_feedback_v1, fairshift_settings_v1: Stores sample and user-created demonstration records.',
            'fairshift_lang: Remembers your selected language (English, Hindi, or Spanish).',
            'fairshift_theme: Remembers your selected color theme (Light or Dark mode).',
          ],
        },
        {
          heading: '3. Managing or Clearing Your Stored Data',
          body: 'You can clear all locally stored demonstration records at any time using the button below or through your browser settings.',
        },
      ],
    },

    accessibility: {
      title: 'Accessibility Statement',
      subtitle: 'Our commitment to inclusive access for workers of all literacy levels and devices.',
      sections: [
        {
          heading: '1. Commitment to Inclusive Decent Work',
          body: 'FairShift is designed specifically to address barriers faced by frontline workers: limited literacy, regional language preferences, outdoor glare on basic smartphones, and motor constraints when wearing protective gear.',
        },
        {
          heading: '2. Built-In Accessibility Features',
          body: 'The platform implements the following accessibility standards and assistive capabilities:',
          bullets: [
            'Multi-Language Support: Full interface and compliance support for English, Hindi (हिन्दी), and Spanish (Español).',
            'Audio Readout (Text-to-Speech): One-tap "Read Aloud" buttons using the Web SpeechSynthesis API read shift statuses, payslips, and instructions aloud.',
            'Voice Dictation Input: Web Speech API voice recognition lets workers report safety hazards by speaking rather than typing, with graceful text fallback.',
            'Touch Targets & Semantic HTML: Interactive buttons meet >=44px touch target guidelines, use native semantic landmarks (<header>, <main>, <nav>, <footer>), and provide ARIA labels.',
            'High-Contrast Theme Toggle: Instant switching between high-contrast Light Mode and Dark Mode.',
          ],
        },
        {
          heading: '3. Feedback & Assistance',
          body: 'If you encounter an accessibility barrier in FairShift, please let us know at [CONTACT EMAIL] so we can remediate it promptly.',
        },
      ],
    },

    contact: {
      title: 'Contact & Compliance Inquiries',
      subtitle:
        'Reach out regarding the UN SDG 8 FairShift demonstration, privacy rights, or accessibility feedback.',
      formTitle: 'Send a Demonstration Inquiry',
      subjectLabel: 'Inquiry Topic / Subject',
      emailLabel: 'Your Reply Email (Optional)',
      messageLabel: 'Message or Feedback',
      submitBtn: 'Submit Inquiry',
      successNotice:
        'Your inquiry has been validated and recorded locally for this demonstration. For direct reach, email [CONTACT EMAIL].',
    },
  },

  hi: {
    footerAbout: 'परिचय (About)',
    footerPrivacy: 'गोपनीयता नीति (Privacy Policy)',
    footerTerms: 'उपयोग की शर्तें (Terms of Use)',
    footerCookies: 'कुकी और स्टोरेज सूचना',
    footerAccessibility: 'सुगमता विवरण (Accessibility)',
    footerContact: 'संपर्क करें (Contact)',
    themeLight: 'लाइट मोड',
    themeDark: 'डार्क मोड',
    toggleThemeLabel: 'रंग थीम बदलें',
    demoNoticeBanner: 'यह एक प्रदर्शन (डेमो) प्रोजेक्ट है। यह कोई व्यावसायिक सेवा नहीं है। (Demonstration project. Not a production service.)',
    lastUpdatedLabel: 'अंतिम अपडेट: 26 अक्टूबर, 2026 (Last updated: October 26, 2026)',
    backToApp: 'FairShift पर वापस जाएं',

    privacy: {
      title: 'गोपनीयता नीति (Privacy Policy)',
      subtitle: 'सरल भाषा में समझें कि FairShift श्रमिक और व्यवस्थापक डेटा को कैसे संभालता है।',
      sections: [
        {
          heading: '1. हम क्या डेटा एकत्र करते हैं (What We Collect)',
          body: 'FairShift केवल पारदर्शी शिफ्ट ट्रैकिंग और कार्यस्थल सुरक्षा दिखाने के लिए आवश्यक न्यूनतम जानकारी संभालता है:',
          bullets: [
            'शिफ्ट चेक-इन और चेक-आउट का समय।',
            'केवल चेक-इन के समय जीपीएस निर्देशांक (अक्षांश, देशांतर और सटीकता)।',
            'सुरक्षा और खतरे की रिपोर्ट (श्रेणी, गंभीरता स्तर, पाठ या आवाज द्वारा विवरण, और स्थिति)।',
            'गुमनाम प्रतिक्रिया (प्रबंधक और कार्य स्थितियों के लिए 1–5 रेटिंग और वैकल्पिक टिप्पणी — इसमें कोई श्रमिक पहचान या नाम नहीं होता)।',
            'भाषा और थीम (लाइट/डार्क मोड) प्राथमिकताएं।',
          ],
        },
        {
          heading: '2. हम इसका उपयोग क्यों करते हैं (Why We Collect It)',
          body: 'प्रत्येक डेटा बिंदु संयुक्त राष्ट्र एसडीजी 8 (गरिमापूर्ण कार्य) के अनुरूप एक स्पष्ट उद्देश्य पूरा करता है:',
          bullets: [
            'जीपीएस का उपयोग केवल चेक-इन के समय कार्यस्थल की सीमा (जियोफेंस) के भीतर उपस्थिति की पुष्टि करने के लिए किया जाता है। पृष्ठभूमि में कोई निरंतर ट्रैकिंग नहीं होती।',
            'गुमनाम प्रतिक्रिया में कोई श्रमिक आईडी (Worker ID) या नाम सहेजा नहीं जाता ताकि श्रमिक बिना डर के अपनी बात रख सकें।',
            'जब तक Supabase पर्यावरण चर (VITE_SUPABASE_URL) कॉन्फ़िगर नहीं किए जाते, यह डेमो केवल स्थानीय नमूना डेटा (Sample Data) का उपयोग करता है।',
          ],
        },
        {
          heading: '3. डेटा कैसे संग्रहीत किया जाता है (How It Is Stored)',
          body: 'डिफ़ॉल्ट रूप से, FairShift आपके ब्राउज़र के localStorage में डेटा संग्रहीत करता है। यदि Supabase कॉन्फ़िगर किया गया है, तो डेटा Row Level Security (RLS) वाले तालिकाओं में सुरक्षित रहता है।',
        },
        {
          heading: '4. इसे कौन देख सकता है (Who Can See It)',
          body: 'श्रमिक अपनी स्वयं की शिफ्ट, वेतन पर्ची और सुरक्षा रिपोर्ट की स्थिति देख सकते हैं। व्यवस्थापक (Admin) केवल उपस्थिति सारांश, थकान अलर्ट, खतरे की रिपोर्ट और गुमनाम प्रतिक्रिया का औसत देखते हैं — व्यवस्थापक कभी भी प्रतिक्रिया देने वाले श्रमिक की पहचान नहीं देख सकते।',
        },
        {
          heading: '5. डेटा प्रतिधारण (Retention)',
          body: 'डेमो मोड में डेटा आपके ब्राउज़र में तब तक रहता है जब तक आप स्टोरेज साफ़ नहीं करते।',
        },
        {
          heading: '6. आपके अधिकार: पहुंच, सुधार और हटाना (User Rights)',
          body: 'आपको अपने डेटा को देखने, सुधारने या हटाने का अधिकार है। आप कुकी और स्टोरेज पेज से एक क्लिक में स्थानीय डेटा हटा सकते हैं या [CONTACT EMAIL] पर संपर्क कर सकते हैं।',
        },
        {
          heading: '7. बच्चों की गोपनीयता (Children)',
          body: 'यह मंच वयस्क श्रमिकों और कार्यशील आयु के कर्मचारियों के लिए है। हम जानबूझकर बच्चों से डेटा एकत्र नहीं करते हैं।',
        },
        {
          heading: '8. नीति में बदलाव (Changes to the Policy)',
          body: 'भविष्य के बदलावों को इस पृष्ठ के शीर्ष पर "अंतिम अपडेट" तिथि के साथ दर्शाया जाएगा।',
        },
        {
          heading: '9. संपर्क (Contact)',
          body: 'गोपनीयता संबंधी प्रश्नों के लिए संपर्क करें: [CONTACT EMAIL] (संगठन: [ORGANIZATION NAME], पता: [MAILING ADDRESS])।',
        },
      ],
    },

    terms: {
      title: 'उपयोग की शर्तें (Terms of Use)',
      subtitle: 'FairShift हैकथॉन डेमो के उपयोग से संबंधित नियम और अस्वीकरण।',
      sections: [
        {
          heading: '1. उद्देश्य और दायरा (Hackathon Demonstration)',
          body: 'FairShift संयुक्त राष्ट्र एसडीजी 8 के लिए Prompt Wars 2026 x SRM ACM Student Chapter के अंतर्गत बनाया गया एक शैक्षिक और हैकथॉन प्रदर्शन प्रोजेक्ट है।',
        },
        {
          heading: '2. स्वीकार्य उपयोग (Acceptable Use)',
          body: 'आप इस एप्लिकेशन का उपयोग इसकी विशेषताओं, कोड गुणवत्ता और सुरक्षा का मूल्यांकन करने के लिए कर सकते हैं। किसी भी प्रकार का दुर्भावनापूर्ण उपयोग वर्जित है।',
        },
        {
          heading: '3. सुरक्षा रिपोर्टों का दुरुपयोग न करें (No Misuse of Safety Reports)',
          body: 'यह डेमो ऐप वास्तविक आपातकालीन सेवाओं (जैसे 112 या अग्निशमन) से जुड़ा नहीं है। वास्तविक जीवन के खतरे की स्थिति में तुरंत आधिकारिक आपातकालीन सेवाओं से संपर्क करें।',
        },
        {
          heading: '4. कोई वारंटी नहीं (No Warranty)',
          body: 'यह सॉफ़्टवेयर बिना किसी प्रत्यक्ष या अप्रत्यक्ष वारंटी के "जैसा है" (AS IS) प्रदान किया जाता है।',
        },
        {
          heading: '5. दायित्व की सीमा (Limitation of Liability)',
          body: '[GOVERNING JURISDICTION] के लागू कानूनों के तहत, इस डेमो या इसके नमूना वेतन गणनाओं के उपयोग से होने वाले किसी भी नुकसान के लिए निर्माता उत्तरदायी नहीं होंगे।',
        },
        {
          heading: '6. शर्तों में परिवर्तन और संपर्क (Changes & Contact)',
          body: 'शर्तों में बदलाव समय-समय पर किए जा सकते हैं। किसी भी प्रश्न के लिए [CONTACT EMAIL] पर संपर्क करें।',
        },
      ],
    },

    cookies: {
      title: 'कुकी और स्टोरेज सूचना (Cookie & Storage Notice)',
      subtitle: 'FairShift ब्राउज़र localStorage का उपयोग कैसे करता है (शून्य ट्रैकिंग कुकीज़)।',
      clearStorageBtn: 'स्थानीय डेमो डेटा रीसेट करें',
      clearedSuccessMsg: 'स्थानीय ब्राउज़र डेटा को सफलतापूर्वक डिफ़ॉल्ट पर रीसेट कर दिया गया है।',
      sections: [
        {
          heading: '1. कोई विज्ञापन या ट्रैकिंग कुकी नहीं',
          body: 'FairShift किसी भी तृतीय-पक्ष विज्ञापन या ट्रैकिंग कुकीज़ का उपयोग नहीं करता है।',
        },
        {
          heading: '2. आवश्यक LocalStorage कुंजियाँ',
          body: 'ऑफ़लाइन डेमो डेटा, आपकी चुनी हुई भाषा (fairshift_lang), और थीम (fairshift_theme) को सहेजने के लिए केवल ब्राउज़र localStorage का उपयोग किया जाता है।',
        },
      ],
    },

    accessibility: {
      title: 'सुगमता विवरण (Accessibility Statement)',
      subtitle: 'सभी श्रमिकों और बुनियादी स्मार्टफ़ोन के लिए समावेशी डिज़ाइन।',
      sections: [
        {
          heading: '1. समावेशी कार्यस्थल प्रतिबद्धता',
          body: 'FairShift को कम साक्षरता, क्षेत्रीय भाषाओं (हिन्दी, अंग्रेज़ी, स्पेनिश), बोलकर रिपोर्ट दर्ज करने (Voice Input) और ऑडियो रीडआउट (Read Aloud) के साथ डिज़ाइन किया गया है।',
        },
        {
          heading: '2. सहायता और प्रतिक्रिया',
          body: 'यदि आपको किसी भी सुगमता समस्या का सामना करना पड़ता है, तो कृपया [CONTACT EMAIL] पर सूचित करें।',
        },
      ],
    },

    contact: {
      title: 'संपर्क करें (Contact)',
      subtitle: 'FairShift डेमो, गोपनीयता अधिकारों या सुगमता पर प्रतिक्रिया के लिए संपर्क करें।',
      formTitle: 'संदेश भेजें',
      subjectLabel: 'विषय (Subject)',
      emailLabel: 'आपका ईमेल (वैकल्पिक)',
      messageLabel: 'संदेश (Message)',
      submitBtn: 'संदेश भेजें',
      successNotice: 'आपका संदेश डेमो में दर्ज कर लिया गया है। सीधे संपर्क के लिए [CONTACT EMAIL] पर ईमेल करें।',
    },
  },

  es: {
    footerAbout: 'Acerca de',
    footerPrivacy: 'Política de Privacidad',
    footerTerms: 'Términos de Uso',
    footerCookies: 'Aviso de Cookies y Almacenamiento',
    footerAccessibility: 'Accesibilidad',
    footerContact: 'Contacto',
    themeLight: 'Modo Claro',
    themeDark: 'Modo Oscuro',
    toggleThemeLabel: 'Cambiar tema de color',
    demoNoticeBanner: 'Proyecto de demostración. No es un servicio en producción. (Demonstration project. Not a production service.)',
    lastUpdatedLabel: 'Última actualización: 26 de octubre de 2026',
    backToApp: 'Volver a FairShift',

    privacy: {
      title: 'Política de Privacidad',
      subtitle: 'Explicación clara de cómo FairShift protege los datos de los trabajadores.',
      sections: [
        {
          heading: '1. Qué datos recopilamos',
          body: 'Recopilamos únicamente horas de entrada/salida, coordenadas GPS en el momento del registro, reportes de seguridad, comentarios anónimos (sin identificador de trabajador) y preferencias de idioma/tema.',
        },
        {
          heading: '2. Por qué y cómo se almacenan',
          body: 'El GPS solo verifica la presencia dentro del radio del sitio al registrar la entrada. Los comentarios anónimos jamás guardan identidad. La demostración usa datos locales de muestra a menos que se configure Supabase. Contacto: [CONTACT EMAIL].',
        },
      ],
    },

    terms: {
      title: 'Términos de Uso',
      subtitle: 'Condiciones de uso de la demostración FairShift.',
      sections: [
        {
          heading: '1. Propósito de demostración y sin garantía',
          body: 'Proyecto de demostración para hackathon (ODS 8 ONU). No utilizar para emergencias reales. Se entrega "tal cual" sin garantías. Contacto: [CONTACT EMAIL].',
        },
      ],
    },

    cookies: {
      title: 'Aviso de Cookies y Almacenamiento',
      subtitle: 'Uso de localStorage sin cookies de rastreo.',
      clearStorageBtn: 'Restablecer datos locales de demostración',
      clearedSuccessMsg: 'Datos locales restablecidos correctamente.',
      sections: [
        {
          heading: '1. Almacenamiento Local',
          body: 'FairShift no utiliza cookies publicitarias y solo guarda preferencias de idioma, tema y datos de muestra en localStorage.',
        },
      ],
    },

    accessibility: {
      title: 'Declaración de Accesibilidad',
      subtitle: 'Diseño inclusivo con lectura por voz y alto contraste.',
      sections: [
        {
          heading: '1. Compromiso de Accesibilidad',
          body: 'Soporte multilingüe, entrada por voz, lectura en voz alta y botones de >=44px. Contacto: [CONTACT EMAIL].',
        },
      ],
    },

    contact: {
      title: 'Contacto',
      subtitle: 'Consultas sobre privacidad, accesibilidad o la demostración FairShift.',
      formTitle: 'Enviar consulta',
      subjectLabel: 'Asunto',
      emailLabel: 'Correo electrónico (Opcional)',
      messageLabel: 'Mensaje',
      submitBtn: 'Enviar consulta',
      successNotice: 'Consulta registrada localmente. Para contacto directo escriba a [CONTACT EMAIL].',
    },
  },
};
