import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  screenshotBlock,
  videoBlock,
  relatedLinks,
} from "../articleHelpers.js";

const S = "parents";

export const welcomeAndOverview = baseArticle({
  slug: "welcome-and-overview",
  section: S,
  title: "Bienvenida a la guía para padres",
  summary: "Qué es Leo Kids, qué pueden hacer los padres en el sitio y cómo empezar.",
  keywords: ["padres", "inicio", "resumen"],
  toc: [
    { id: "what-is-leo", title: "¿Qué es Leo Kids?" },
    { id: "parent-role", title: "El rol de los padres" },
  ],
  blocks: [
    heading(2, "what-is-leo", "¿Qué es Leo Kids?"),
    paragraph(
      "Leo Kids es un espacio de aprendizaje para estudiantes de primaria (grados 1 a 6), con práctica de matemáticas, geometría, inglés y ciencias, además de juegos e informes de progreso para padres."
    ),
    screenshotBlock(S, "welcome-and-overview", "overview", "Página de inicio de Leo Kids con áreas de aprendizaje y juegos"),
    videoBlock(S, "welcome-and-overview"),
    heading(2, "parent-role", "El rol de los padres"),
    list([
      "Crear una cuenta de padre o madre e iniciar sesión",
      "Agregar hijos e hijas y gestionar los datos de acceso",
      "Ver informes y recomendaciones de práctica",
    ]),
    relatedLinks([
      { href: "/help/parents/create-parent-account", label: "Crear una cuenta de padre o madre" },
      { href: "/help/parents/parent-dashboard-tour", label: "Recorrido del panel de padres" },
    ]),
  ],
});

export const createParentAccount = baseArticle({
  slug: "create-parent-account",
  section: S,
  title: "Crear una cuenta de padre o madre",
  summary: "Cómo registrarse y entrar al portal de padres.",
  keywords: ["registro", "inicio de sesión", "padres"],
  toc: [{ id: "login-page", title: "Página de inicio de sesión" }],
  blocks: [
    heading(2, "login-page", "Página de inicio de sesión"),
    paragraph("Ve a la página de inicio de sesión para padres y completa el registro o inicia sesión con tu correo y contraseña."),
    screenshotBlock(S, "create-parent-account", "login", "Pantalla de inicio de sesión para padres"),
    videoBlock(S, "create-parent-account"),
    callout("tip", "Guarda tus datos de acceso en un lugar seguro: los necesitarás cada vez que inicies sesión."),
    relatedLinks([{ href: "/parent/login", label: "Ir al inicio de sesión de padres" }]),
  ],
});

export const parentDashboardTour = baseArticle({
  slug: "parent-dashboard-tour",
  section: S,
  title: "Recorrido del panel de padres",
  summary: "Lista de hijos e hijas, cómo agregar uno nuevo y límites de la cuenta.",
  keywords: ["panel", "hijos", "padres"],
  toc: [
    { id: "children-list", title: "Lista de hijos e hijas" },
    { id: "limits", title: "Límites de la cuenta" },
  ],
  blocks: [
    heading(2, "children-list", "Lista de hijos e hijas"),
    paragraph("En la página de padres verás a todos los niños y niñas vinculados a la cuenta, con nombre, grado y opciones de gestión."),
    screenshotBlock(S, "parent-dashboard-tour", "dashboard", "Página de padres con lista de hijos e hijas"),
    videoBlock(S, "parent-dashboard-tour"),
    heading(2, "limits", "Límites de la cuenta"),
    paragraph("Por defecto, cada cuenta de padre o madre puede incluir hasta tres hijos o hijas."),
    callout("info", "Si llegas al límite, edita o elimina un perfil existente antes de agregar uno nuevo."),
  ],
});

export const addStudents = baseArticle({
  slug: "add-students",
  section: S,
  title: "Agregar un hijo o hija",
  summary: "Crear un perfil infantil, elegir un grado y guardar.",
  keywords: ["hijo", "grado", "agregar"],
  toc: [{ id: "add-form", title: "Formulario para agregar" }],
  blocks: [
    heading(2, "add-form", "Formulario para agregar"),
    paragraph("Escribe el nombre del niño o niña y elige un grado (1 a 6). Después de guardar, aparecerán los datos de acceso."),
    videoBlock(S, "add-students"),
    screenshotBlock(S, "add-students", "form", "Formulario para agregar un hijo o hija con selección de grado"),
    list(["Grado 1 — grade_1", "Grado 2 — grade_2", "hasta Grado 6 — grade_6"], false),
  ],
});

export const studentPinAndCredentials = baseArticle({
  slug: "student-pin-and-credentials",
  section: S,
  title: "PIN y datos de acceso de tu hijo o hija",
  summary: "Qué es un PIN, cuándo se muestra una sola vez y cómo restablecerlo.",
  keywords: ["PIN", "contraseña", "hijo"],
  toc: [
    { id: "what-is-pin", title: "¿Qué es un PIN?" },
    { id: "reset", title: "Restablecer" },
  ],
  blocks: [
    heading(2, "what-is-pin", "¿Qué es un PIN?"),
    paragraph("Tu hijo o hija inicia sesión con un nombre de usuario y un código de 4 dígitos. Después de crearlo o restablecerlo, el código se muestra una sola vez: guárdalo."),
    screenshotBlock(S, "student-pin-and-credentials", "pin-display", "Mensaje que muestra un código PIN nuevo"),
    videoBlock(S, "student-pin-and-credentials"),
    heading(2, "reset", "Restablecer"),
    paragraph("En la página de padres puedes crear un código de acceso nuevo. El código anterior dejará de funcionar."),
    callout("warning", "No compartas el código en redes sociales ni en grupos públicos."),
  ],
});

export const editOrDeleteStudent = baseArticle({
  slug: "edit-or-delete-student",
  section: S,
  title: "Editar o eliminar un hijo o hija",
  summary: "Cambiar nombre o grado, y eliminar con confirmación.",
  keywords: ["editar", "eliminar", "hijo"],
  toc: [
    { id: "edit", title: "Editar" },
    { id: "delete", title: "Eliminar" },
  ],
  blocks: [
    heading(2, "edit", "Editar"),
    paragraph("Haz clic en editar junto al nombre, actualiza los datos y guarda."),
    screenshotBlock(S, "edit-or-delete-student", "edit", "Edición de los datos de un hijo o hija"),
    videoBlock(S, "edit-or-delete-student"),
    heading(2, "delete", "Eliminar"),
    paragraph("Para eliminar debes escribir el nombre del niño o niña como confirmación; esta acción no se puede deshacer."),
    callout("warning", "Eliminar un perfil quita su acceso y los datos asociados de tu cuenta."),
  ],
});

export const howToReadReport = baseArticle({
  slug: "how-to-read-report",
  section: S,
  title: "¿Cómo empiezo a leer el informe?",
  summary: "Una introducción breve al informe para padres y enlaces a guías detalladas.",
  keywords: ["informe", "padres", "lectura"],
  toc: [{ id: "open-report", title: "Abrir un informe" }],
  blocks: [
    heading(2, "open-report", "Abrir un informe"),
    paragraph("Desde la página de padres, elige un hijo o hija y haz clic en ver informe. Puedes cambiar entre el informe estándar y el detallado."),
    videoBlock(S, "how-to-read-report"),
    screenshotBlock(S, "how-to-read-report", "report-link", "Botón para abrir un informe desde la página de padres"),
    relatedLinks([
      { href: "/help/parent-report/report-overview", label: "Resumen del informe" },
      { href: "/help/parent-report/summary-card", label: "Tarjeta de resumen" },
    ]),
  ],
});

export const parentCopilot = baseArticle({
  slug: "parent-copilot",
  section: S,
  title: "Preguntar sobre el informe (Copilot)",
  summary: "Cómo hacer preguntas sobre el informe y qué puede responder el sistema.",
  keywords: ["Copilot", "preguntas", "informe"],
  toc: [
    { id: "how-to-ask", title: "Cómo preguntar" },
    { id: "limits", title: "Límites" },
  ],
  blocks: [
    heading(2, "how-to-ask", "Cómo preguntar"),
    paragraph(
      'Dentro del informe, abre "Preguntar sobre el informe" y escribe una pregunta sobre el desempeño, los temas o las recomendaciones.'
    ),
    videoBlock(S, "parent-copilot"),
    screenshotBlock(S, "parent-copilot", "copilot-panel", "Panel para preguntar sobre el informe"),
    heading(2, "limits", "Límites"),
    list([
      "Las respuestas se basan en los datos de práctica del sitio",
      "No reemplazan el consejo educativo profesional",
      "Las preguntas no relacionadas con el informe pueden recibir una respuesta general",
    ]),
  ],
});

export const monthlyRewards = baseArticle({
  slug: "monthly-rewards",
  section: S,
  title: "Recompensa mensual de constancia",
  summary: "El recorrido de constancia por materia y las recompensas para padres.",
  keywords: ["recompensa", "constancia", "mensual"],
  toc: [{ id: "journey", title: "Recorrido de constancia" }],
  blocks: [
    heading(2, "journey", "Recorrido de constancia"),
    paragraph("Tu hijo o hija construye constancia con la práctica mensual. En la página de recompensas puedes ver el progreso por materia."),
    screenshotBlock(S, "monthly-rewards", "rewards", "Página de recompensas de constancia"),
    videoBlock(S, "monthly-rewards"),
    relatedLinks([{ href: "/parent/rewards", label: "Ir a la página de recompensas" }]),
  ],
});

export const installAsApp = baseArticle({
  slug: "install-as-app",
  section: S,
  title: "Instalar como aplicación",
  summary: "Agregar Leo Kids a la pantalla de inicio del teléfono o la tableta.",
  keywords: ["PWA", "instalar", "aplicación"],
  toc: [{ id: "install", title: "Instalar" }],
  blocks: [
    heading(2, "install", "Instalar"),
    paragraph(
      'En la página de inicio o en el navegador puede aparecer "Instalar aplicación": tócalo y confirma. Luego puedes abrir Leo Kids como una app.'
    ),
    screenshotBlock(S, "install-as-app", "install-prompt", "Aviso para instalar la aplicación"),
    videoBlock(S, "install-as-app"),
    callout("tip", "En iPhone: Compartir → Agregar a la pantalla de inicio."),
  ],
});

export const mobileAndOffline = baseArticle({
  slug: "mobile-and-offline",
  section: S,
  title: "Móvil y juegos sin conexión",
  summary: "Usar el sitio en el teléfono y jugar sin internet.",
  keywords: ["móvil", "sin conexión"],
  toc: [
    { id: "mobile", title: "Uso en el móvil" },
    { id: "offline", title: "Sin conexión" },
  ],
  blocks: [
    heading(2, "mobile", "Uso en el móvil"),
    paragraph("El sitio funciona en pantallas pequeñas. El inicio de sesión de estudiantes y de padres también funciona desde el teléfono."),
    heading(2, "offline", "Sin conexión"),
    paragraph('En el área "Sin conexión" hay juegos que funcionan en el mismo dispositivo sin conexión a internet.'),
    screenshotBlock(S, "mobile-and-offline", "offline-hub", "Página de juegos sin conexión"),
    videoBlock(S, "mobile-and-offline"),
    relatedLinks([{ href: "/offline", label: "Juegos sin conexión" }]),
  ],
});

export const troubleshootingLogin = baseArticle({
  slug: "troubleshooting-login",
  section: S,
  title: "Solución de problemas de inicio de sesión",
  summary: "PIN incorrecto, cuenta bloqueada y limpieza de la caché del navegador.",
  keywords: ["problema", "inicio de sesión", "PIN"],
  toc: [{ id: "common", title: "Problemas frecuentes" }],
  blocks: [
    heading(2, "common", "Problemas frecuentes"),
    list([
      "PIN incorrecto — pide a tu padre o madre un código nuevo",
      "Nombre de usuario no reconocido — revisa la ortografía",
      "La página no carga — prueba actualizar o limpiar la caché del navegador",
    ]),
    callout("info", "Si el problema continúa, contáctanos por la página de contacto."),
    videoBlock(S, "troubleshooting-login"),
    relatedLinks([{ href: "/contact", label: "Contáctanos" }]),
  ],
});

export const privacyAndData = baseArticle({
  slug: "privacy-and-data",
  section: S,
  title: "Privacidad y datos",
  summary: "Qué se recopila durante la práctica y cómo contactarnos sobre privacidad.",
  keywords: ["privacidad", "datos"],
  toc: [{ id: "data", title: "Datos de práctica" }],
  blocks: [
    heading(2, "data", "Datos de práctica"),
    paragraph(
      "El sistema guarda datos de práctica para mostrar el progreso y los informes. No compartas los códigos de acceso de los niños con otras personas."
    ),
    callout("info", "Para preguntas o solicitudes de privacidad, consulta la política de privacidad o contáctanos."),
    videoBlock(S, "privacy-and-data"),
    relatedLinks([
      { href: "/privacy", label: "Política de privacidad" },
      { href: "/legal", label: "Términos, privacidad y accesibilidad" },
      { href: "/contact", label: "Contáctanos" },
    ]),
  ],
});

export const PARENT_ARTICLES = [
  welcomeAndOverview,
  createParentAccount,
  parentDashboardTour,
  addStudents,
  studentPinAndCredentials,
  editOrDeleteStudent,
  howToReadReport,
  parentCopilot,
  monthlyRewards,
  installAsApp,
  mobileAndOffline,
  troubleshootingLogin,
  privacyAndData,
];
