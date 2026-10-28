
export const PROFILE = {
  name: 'Ángela López Oliva',
  first: 'Ángela',
  email: 'angelalopezoliva03@gmail.com',
  phone: '+34 601 319 645',
  linkedin: 'https://www.linkedin.com/in/angela-lopez03',
  github: 'https://github.com/angelalop03',
  cv: 'cv.pdf',
};

// El diario sobre la cama: quién soy.
export const ABOUT = {
  paragraphs: {
    es: [
      'Soy Software Engineer y Product Developer con una base sólida en Ingeniería Informática, especializada en desarrollo Full-Stack de aplicaciones web, analítica de datos y diseño UI/UX.',
      'Dentro de Airbus (Discover Program) implemento soluciones digitales y optimizo flujos operativos en entornos aeroespaciales de alta exigencia normativa. Me gusta conectar arquitecturas backend en Java/Spring con frontends modulares en Angular o React para crear productos empresariales seguros, escalables y centrados en las personas.',
    ],
    en: [
      "I'm a Software Engineer and Product Developer with a strong foundation in Computer Science, specialized in Full-Stack Web Application Development, Data Analytics and UI/UX Design.",
      'At Airbus (Discover Program) I implement digital solutions and optimize operational workflows in high-compliance aerospace environments. I love connecting backend Java/Spring architectures with modular Angular/React frontends to deliver secure, scalable and user-centered enterprise products.',
    ],
  },
  facts: [
    { label: { es: 'Rol', en: 'Role' }, value: { es: 'Software Engineer · Product Developer', en: 'Software Engineer · Product Developer' } },
    { label: { es: 'Ahora mismo', en: 'Right now' }, value: { es: 'Airbus · Discover Program', en: 'Airbus · Discover Program' } },
    { label: { es: 'Ubicación', en: 'Location' }, value: { es: 'Sanlúcar de Barrameda, Cádiz', en: 'Sanlúcar de Barrameda, Cádiz (Spain)' } },
    { label: { es: 'Disponibilidad', en: 'Availability' }, value: { es: 'Abierta a reubicación', en: 'Open to relocation' } },
  ],
};

// El tablón de corcho sobre el escritorio: experiencia profesional.
export const EXPERIENCE = [
  {
    company: 'Airbus · Discover Program',
    role: { es: 'Logistics & Digitalization Trainee', en: 'Logistics & Digitalization Trainee' },
    place: { es: 'Cádiz, España', en: 'Cádiz, Spain' },
    period: { es: 'Mar 2026 – Feb 2027', en: 'Mar 2026 – Feb 2027' },
    current: true,
    note: '#ffe48a',
    bullets: {
      es: [
        'Implemento soluciones digitales para automatizar procesos y optimizar flujos de trabajo en un entorno corporativo de alta exigencia normativa.',
        'Recojo y refino requisitos funcionales con equipos multidisciplinares y Agile, haciendo de puente entre las necesidades de negocio y la ejecución IT.',
        'Contribuyo a la eficiencia operativa y a la visibilidad de datos en los flujos de logística y fabricación.',
      ],
      en: [
        'Implementing digital solutions for process automation and workflow optimization within a high-compliance corporate environment.',
        'Gathering and refining functional requirements with multidisciplinary and Agile teams, bridging the gap between business needs and IT execution.',
        'Contributing to operational efficiency and data visibility across logistics and manufacturing workflows.',
      ],
    },
  },
  {
    company: 'Dedalus Healthcare',
    role: { es: 'Software Consulting & Development Intern', en: 'Software Consulting & Development Intern' },
    place: { es: 'Sevilla, España', en: 'Seville, Spain' },
    period: { es: '2025', en: '2025' },
    note: '#ffc1d9',
    bullets: {
      es: [
        'Analicé flujos clínicos complejos y traduje necesidades operativas en especificaciones de software.',
        'Participé activamente en ceremonias Agile/Scrum, code reviews y procesos de aseguramiento de calidad.',
      ],
      en: [
        'Analyzed complex clinical workflows and translated operational needs into software specifications.',
        'Participated actively in Agile/Scrum ceremonies, peer code reviews and quality assurance processes.',
      ],
    },
  },
];

// La estantería: formación, certificaciones e idiomas.
export const EDUCATION = {
  degrees: [
    {
      title: { es: 'Máster en Desarrollo de Aplicaciones Web', en: "Master's Degree in Web Application Development" },
      place: 'Universidad Europea',
      period: { es: '2025 – 2026 · En curso', en: '2025 – 2026 · In progress' },
    },
    {
      title: { es: 'Máster en Dirección de Organizaciones y Analítica de Datos', en: "Master's Degree in Organizational Management & Data Analytics" },
      place: 'Universidad Camilo José Cela',
      period: { es: '2025 – 2026 · En curso', en: '2025 – 2026 · In progress' },
    },
    {
      title: { es: 'Grado en Ingeniería Informática – Ingeniería del Software', en: 'BSc in Computer Science & Software Engineering' },
      place: 'Universidad de Sevilla',
      period: { es: '2021 – 2025', en: '2021 – 2025' },
    },
  ],
  certs: [
    {
      title: { es: 'Figma UI/UX Design Essentials', en: 'Figma UI/UX Design Essentials' },
      place: 'Udemy',
      period: { es: 'Junio 2026', en: 'June 2026' },
    },
  ],
  languages: [
    { es: 'Español — Nativo', en: 'Spanish — Native' },
    { es: 'Inglés — B2 (Cambridge FCE)', en: 'English — B2 (Cambridge FCE)' },
  ],
};

// Las polaroids colgadas de la guirnalda encima de la puerta: proyectos.
export const PROJECTS = [
  {
    id: 'ludikat',
    name: 'LudikaT',
    image: 'assets/projects/ludikat.jpg',
    kind: { es: 'Web para un negocio real', en: 'Website for a real business' },
    summary: {
      es: 'Web de cuidado infantil y animación de cumpleaños y comuniones, con landing 3D en tonos pastel y un sistema de reservas completo.',
      en: 'Website for a childcare and birthday-party business, with a pastel 3D landing page and a complete booking system.',
    },
    highlights: {
      es: [
        'Bebé 3D interactivo hecho solo con código: respira, parpadea, sigue el ratón y salta al hacerle cosquillas.',
        'Calendario de reservas conectado a Supabase, con aviso por email a las cuidadoras mediante Resend.',
        'Panel de administración para ver, filtrar y borrar reservas, y versión sin 3D accesible.',
      ],
      en: [
        'Interactive 3D baby built purely in code: it breathes, blinks, follows the mouse and jumps when tickled.',
        'Booking calendar connected to Supabase, with email alerts to the caregivers via Resend.',
        'Admin panel to view, filter and delete bookings, plus an accessible non-3D fallback.',
      ],
    },
    tags: ['React 19', 'Vite', 'React Three Fiber', 'Three.js', 'Supabase', 'Resend', 'Vercel'],
    links: [
      { label: { es: 'Ver la web', en: 'Visit site' }, url: 'https://ludika-t.vercel.app/' },
      { label: { es: 'Código', en: 'Code' }, url: 'https://github.com/angelalop03/LudikaT' },
    ],
  },
  {
    id: 'tripeas',
    name: 'TripEAs',
    image: 'assets/projects/tripeas.jpg',
    kind: { es: 'Trabajo de Fin de Máster', en: "Master's thesis project" },
    summary: {
      es: 'App para organizar viajes en grupo sin caos: gastos compartidos, calendario de planes, listas, documentos sin conexión, álbum común y una ruleta para decidir.',
      en: 'App to organize group trips without the chaos: shared expenses, plan calendar, lists, offline documents, a shared album and a roulette to decide.',
    },
    highlights: {
      es: [
        'App móvil para Android, iOS y web con React Native y Expo, en TypeScript.',
        'API REST propia en Node.js y Express sobre Supabase/PostgreSQL, con tests en Jest.',
        'Liquidación automática de gastos con el mínimo de transferencias, y landing desplegada con GitHub Actions.',
      ],
      en: [
        'Mobile app for Android, iOS and web built with React Native and Expo, in TypeScript.',
        'Custom REST API in Node.js and Express on Supabase/PostgreSQL, tested with Jest.',
        'Automatic expense settlement with the fewest possible transfers, and a landing page deployed with GitHub Actions.',
      ],
    },
    tags: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'PostgreSQL', 'Jest'],
    links: [
      { label: { es: 'Ver la web', en: 'Visit site' }, url: 'https://angelalop03.github.io/TripEAs-Web/' },
      { label: { es: 'Probar la app', en: 'Try the app' }, url: 'https://tripeas-app.expo.app/' },
      { label: { es: 'Código app', en: 'App code' }, url: 'https://github.com/angelalop03/TripEAs-app' },
      { label: { es: 'Código API', en: 'API code' }, url: 'https://github.com/angelalop03/TripEAs-backend' },
    ],
  },
];

// Cada grupo de habilidades es una pegatina del portátil.
export const SKILLS = [
  {
    name: { es: 'Full-Stack Web', en: 'Full-Stack Web' },
    icon: '🌐',
    color: '#ffc1d9',
    items: ['Java', 'Spring Boot', 'Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'SCSS/CSS', 'REST APIs', { es: 'Microservicios', en: 'Microservices' }],
  },
  {
    name: { es: 'Backend y lenguajes', en: 'Backend & languages' },
    icon: '⚙️',
    color: '#cdbbff',
    items: ['Java', 'Python', 'FastAPI', 'Django', 'Flask', 'Node.js', 'Express.js', 'C/C++'],
  },
  {
    name: { es: 'Bases de datos y datos', en: 'Databases & data' },
    icon: '🗄️',
    color: '#a9e5d9',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', { es: 'Analítica de datos', en: 'Data Analytics' }, { es: 'Modelado de procesos', en: 'Process Modeling' }],
  },
  {
    name: { es: 'DevOps y control de versiones', en: 'DevOps & version control' },
    icon: '🚀',
    color: '#ffe48a',
    items: ['Git', 'GitHub (GitFlow)', 'Docker', 'Google Cloud Platform', 'CI/CD'],
  },
  {
    name: { es: 'Producto y UI/UX', en: 'Product & UI/UX' },
    icon: '🎨',
    color: '#ffcfb3',
    items: [{ es: 'Figma (certificada)', en: 'Figma (certified)' }, { es: 'Diseño de PoC', en: 'PoC Design' }, 'Agile / Scrum', 'Jira', { es: 'Gestión del ciclo de vida del producto', en: 'Product Lifecycle Management' }],
  },
];

// Deseos que se piden por la ventana, uno por cada estrella fugaz.
export const WISHES = {
  es: [
    'Seguir creando productos que la gente disfrute usar.',
    'Unir un backend sólido con un diseño bonito en cada proyecto.',
    'Llevar la digitalización allí donde más falta hace.',
    'Mudarme a donde esté el próximo gran reto ✈',
    'Que tu equipo y yo coincidamos muy pronto 💌',
  ],
  en: [
    'Keep building products people genuinely enjoy using.',
    'Pair a solid backend with a beautiful design in every project.',
    'Bring digitalization wherever it is needed most.',
    'Move wherever the next big challenge is ✈',
    'That your team and I cross paths very soon 💌',
  ],
};

export const GUIDE = {
  es: {
    speaker: 'Luna · la gata de la habitación',
    intro: [
      '¡Miau! Soy Luna, la gata de esta habitación (y la que manda aquí, que quede claro).',
      'Este es el cuarto de {first}: aquí programa, diseña y sueña de noche. Cada rincón guarda un trocito de su CV.',
      'En el diario está quién es, en el portátil su stack, en el tablón su experiencia, en la estantería su formación y en el móvil cómo contactarla.',
      'Las polaroids de encima de la puerta son sus proyectos, y si abres la puerta llegas a su GitHub.',
      'Toca la lámpara para encenderla o la ventana para pedir un deseo. ¿Poco tiempo? Arriba tienes el «Modo rápido».',
    ],
    allWishes: ['¡Has pedido todos los deseos! El último depende de ti: escríbele a {first} desde el móvil de la mesita 💌'],
  },
  en: {
    speaker: 'Luna · the room cat',
    intro: [
      "Meow! I'm Luna, the cat of this room (and the one in charge, just so you know).",
      "This is {first}'s room: she codes, designs and dreams here at night. Every corner holds a piece of her CV.",
      'The diary tells you who she is, the laptop her stack, the corkboard her experience, the bookshelf her education and the phone how to reach her.',
      'The polaroids above the door are her projects, and opening the door takes you to her GitHub.',
      'Tap the lamp to switch it on or the window to make a wish. Short on time? Up top there\'s a "Quick mode".',
    ],
    allWishes: ["You've made every wish! The last one is up to you: message {first} from the phone on the nightstand 💌"],
  },
};

export const UI = {
  es: {
    docTitle: 'La habitación de {first} · Portfolio 3D',
    brandEyebrow: 'Portfolio de {name}',
    brandTitle: 'La habitación de {first}',
    tagline: 'Software Engineer · Product Developer · Full-Stack & UI/UX',
    overview: 'Vista general',
    express: 'Modo rápido',
    exitExpress: 'Volver a la habitación',
    lightOn: 'Encender la luz',
    lightOff: 'Apagar la luz',
    hint: 'Arrastra para mirar · rueda para acercarte · toca los carteles',
    hintTouch: 'Desliza para mirar · pellizca para acercarte · toca los carteles',
    loading: 'Encendiendo las lucecitas…',
    next: 'Siguiente',
    gotIt: '¡Vamos allá!',
    skip: 'Saltar',
    close: 'Cerrar',
    help: 'Ayuda',
    hsAbout: 'Mi diario',
    hsSkills: 'Mi portátil',
    hsExperience: 'Tablón de experiencia',
    hsEducation: 'Estantería',
    hsContact: 'Contacto',
    hsLampOn: 'Encender lámpara',
    hsLampOff: 'Apagar lámpara',
    hsWindow: 'Pedir un deseo',
    hsProjects: 'Mis proyectos',
    hsDoor: 'GitHub ↗',
    meow: 'Miau 🐾',
    wish: '🌠 Deseo {n}/{total}: {text}',
    aboutEyebrow: 'Mi diario · Sobre mí',
    aboutTitle: 'Sobre mí',
    skillsEyebrow: 'Mi portátil · Stack',
    skillsTitle: 'Habilidades técnicas',
    skillsIntro: 'Cada pegatina del portátil es un grupo de herramientas con las que construyo productos.',
    experienceEyebrow: 'Tablón de corcho',
    experienceTitle: 'Experiencia profesional',
    experienceIntro: 'Las notas que tengo clavadas encima del escritorio: dónde he trabajado y qué he aprendido.',
    current: 'Actualidad',
    projectsEyebrow: 'Polaroids de la guirnalda',
    projectsTitle: 'Proyectos',
    projectsIntro: 'Las fotos que tengo colgadas encima de la puerta: webs y apps que he diseñado y construido de principio a fin.',
    seeAllGithub: 'Ver todos en GitHub',
    educationEyebrow: 'Estantería',
    educationTitle: 'Formación',
    educationIntro: 'Los libros, los apuntes y los diplomas que me han traído hasta aquí.',
    degreesTitle: 'Estudios',
    certsTitle: 'Certificaciones',
    languagesTitle: 'Idiomas',
    contactEyebrow: 'El móvil de la mesita',
    contactTitle: '¿Hablamos?',
    contactText: 'Si tienes un proyecto, una oferta o simplemente quieres hablar de producto, código o diseño, escríbeme. Contesto rápido (después de dar de comer a Luna).',
    experienceShort: 'Experiencia',
    email: 'Escríbeme',
    copyEmail: 'Copiar email',
    copied: 'Email copiado',
    call: 'Llamar',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    downloadCv: 'Descargar CV',
    seeContact: 'Contactar',
    seeExperience: 'Ver experiencia',
    noWebgl: 'Tu navegador no pudo cargar la escena 3D, así que te muestro la versión rápida.',
  },
  en: {
    docTitle: "{first}'s Room · 3D Portfolio",
    brandEyebrow: "{name}'s portfolio",
    brandTitle: "{first}'s Room",
    tagline: 'Software Engineer · Product Developer · Full-Stack & UI/UX',
    overview: 'Overview',
    express: 'Quick mode',
    exitExpress: 'Back to the room',
    lightOn: 'Turn the light on',
    lightOff: 'Turn the light off',
    hint: 'Drag to look around · scroll to zoom · tap the signs',
    hintTouch: 'Swipe to look around · pinch to zoom · tap the signs',
    loading: 'Switching on the fairy lights…',
    next: 'Next',
    gotIt: "Let's go!",
    skip: 'Skip',
    close: 'Close',
    help: 'Help',
    hsAbout: 'My diary',
    hsSkills: 'My laptop',
    hsExperience: 'Experience board',
    hsEducation: 'Bookshelf',
    hsContact: 'Contact',
    hsLampOn: 'Switch lamp on',
    hsLampOff: 'Switch lamp off',
    hsWindow: 'Make a wish',
    hsProjects: 'My projects',
    hsDoor: 'GitHub ↗',
    meow: 'Meow 🐾',
    wish: '🌠 Wish {n}/{total}: {text}',
    aboutEyebrow: 'My diary · About me',
    aboutTitle: 'About me',
    skillsEyebrow: 'My laptop · Stack',
    skillsTitle: 'Technical skills',
    skillsIntro: 'Every sticker on the laptop is a set of tools I use to build products.',
    experienceEyebrow: 'Corkboard',
    experienceTitle: 'Professional experience',
    experienceIntro: "The notes pinned above my desk: where I've worked and what I've learned.",
    current: 'Present',
    projectsEyebrow: 'Polaroids on the fairy lights',
    projectsTitle: 'Projects',
    projectsIntro: "The photos clipped above my door: websites and apps I've designed and built end to end.",
    seeAllGithub: 'See them all on GitHub',
    educationEyebrow: 'Bookshelf',
    educationTitle: 'Education',
    educationIntro: 'The books, notes and diplomas that brought me here.',
    degreesTitle: 'Degrees',
    certsTitle: 'Certifications',
    languagesTitle: 'Languages',
    contactEyebrow: 'The phone on the nightstand',
    contactTitle: "Let's talk?",
    contactText: "If you have a project, an offer or just want to chat about product, code or design, drop me a line. I reply fast (right after feeding Luna).",
    experienceShort: 'Experience',
    email: 'Email me',
    copyEmail: 'Copy email',
    copied: 'Email copied',
    call: 'Call',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    downloadCv: 'Download CV',
    seeContact: 'Get in touch',
    seeExperience: 'See experience',
    noWebgl: "Your browser couldn't load the 3D scene, so here's the quick version.",
  },
};
