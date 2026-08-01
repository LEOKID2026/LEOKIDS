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

const S = "students";

function studentArticle(opts) {
  return baseArticle({ ...opts, section: S, audience: "student" });
}

export const studentLogin = studentArticle({
  slug: "student-login",
  title: "¿Cómo inicio sesión?",
  summary: "Inicia sesión con tu nombre de usuario y tu PIN.",
  keywords: ["inicio de sesión", "PIN"],
  toc: [{ id: "steps", title: "Pasos" }],
  blocks: [
    heading(2, "steps", "Pasos"),
    list(
      [
        "Pide a tu padre o madre tu nombre de usuario y tu código",
        "Escríbelos en la página de inicio de sesión",
        "Toca Iniciar sesión",
      ],
      true
    ),
    videoBlock(S, "student-login"),
    screenshotBlock(S, "student-login", "login", "Pantalla de inicio de sesión del estudiante"),
  ],
});

export const studentHomeTour = studentArticle({
  slug: "student-home-tour",
  title: "Mi página de inicio",
  summary: "Lo que ves después de iniciar sesión: materias, monedas y avatar.",
  keywords: ["inicio", "estudiante"],
  toc: [{ id: "home", title: "Página de inicio" }],
  blocks: [
    heading(2, "home", "Página de inicio"),
    paragraph("Aquí verás tu nombre, cuántas monedas tienes y qué materias puedes abrir."),
    videoBlock(S, "student-home-tour"),
    screenshotBlock(S, "student-home-tour", "home", "Página de inicio del estudiante con tarjetas de materias"),
  ],
});

export const chooseSubjectAndGrade = studentArticle({
  slug: "choose-subject-and-grade",
  title: "Elegir una materia y un grado",
  summary: "Cómo entrar a practicar en la materia que elegiste.",
  keywords: ["materia", "grado"],
  toc: [{ id: "learning-hub", title: "Centro de aprendizaje" }],
  blocks: [
    heading(2, "learning-hub", "Centro de aprendizaje"),
    paragraph("Elige una materia de la lista. Las actividades coincidirán con tu grado."),
    videoBlock(S, "choose-subject-and-grade"),
    screenshotBlock(S, "choose-subject-and-grade", "subjects", "Lista de materias en el centro de aprendizaje"),
    relatedLinks([{ href: "/learning", label: "Ir al centro de aprendizaje" }]),
  ],
});

export const answeringQuestions = studentArticle({
  slug: "answering-questions",
  title: "¿Cómo respondo las preguntas?",
  summary: "Elegir, escribir y seleccionar respuestas.",
  keywords: ["preguntas", "respuesta"],
  toc: [{ id: "types", title: "Tipos de preguntas" }],
  blocks: [
    heading(2, "types", "Tipos de preguntas"),
    list([
      "A veces eliges una respuesta de una lista",
      "A veces escribes un número o una palabra",
      "Después de responder verás si acertaste",
    ]),
    videoBlock(S, "answering-questions"),
    screenshotBlock(S, "answering-questions", "question", "Pregunta de práctica en pantalla"),
  ],
});

export const hintsAndExplanations = studentArticle({
  slug: "hints-and-explanations",
  title: "Pistas y explicaciones",
  summary: "Qué pasa después de una respuesta correcta o incorrecta.",
  keywords: ["explicación", "pista"],
  toc: [{ id: "after", title: "Después de la respuesta" }],
  blocks: [
    heading(2, "after", "Después de la respuesta"),
    paragraph("Si te equivocaste, lee la explicación e inténtalo de nuevo. Si acertaste, ¡pasa a la siguiente pregunta!"),
    callout("tip", "No te apresures: leer la explicación te ayuda a entender."),
    videoBlock(S, "hints-and-explanations"),
  ],
});

export const dailyMissions = studentArticle({
  slug: "daily-missions",
  title: "Misiones diarias",
  summary: "Tareas pequeñas que te ayudan a avanzar cada día.",
  keywords: ["diario", "misiones"],
  toc: [{ id: "missions", title: "Misiones" }],
  blocks: [
    heading(2, "missions", "Misiones"),
    paragraph("En tu página de inicio verás misiones diarias. Al terminarlas ganas puntos y avances."),
    videoBlock(S, "daily-missions"),
    screenshotBlock(S, "daily-missions", "missions", "Panel de misiones diarias"),
  ],
});

export const monthlyPersistence = studentArticle({
  slug: "monthly-persistence",
  title: "Recorrido mensual de constancia",
  summary: "Practica cada mes y construye tu progreso.",
  keywords: ["constancia", "mes"],
  toc: [{ id: "persistence", title: "Constancia" }],
  blocks: [
    heading(2, "persistence", "Constancia"),
    paragraph("Cuanto más practiques en un mes, más avanza tu recorrido. ¡Muestra cuánto seguiste adelante!"),
    screenshotBlock(S, "monthly-persistence", "persistence", "Recorrido mensual de constancia"),
    videoBlock(S, "monthly-persistence"),
  ],
});

export const coinsAndArcade = studentArticle({
  slug: "coins-and-arcade",
  title: "Monedas y arcade",
  summary: "Cómo ganar monedas y jugar juegos en línea.",
  keywords: ["monedas", "arcade"],
  toc: [{ id: "coins", title: "Monedas" }],
  blocks: [
    heading(2, "coins", "Monedas"),
    paragraph("Practica y gana monedas. En el arcade puedes jugar juegos de mesa con amigos."),
    videoBlock(S, "coins-and-arcade"),
    screenshotBlock(S, "coins-and-arcade", "arcade", "Página del arcade"),
    relatedLinks([{ href: "/student/arcade", label: "Ir al arcade" }]),
  ],
});

export const avatarAndProfile = studentArticle({
  slug: "avatar-and-profile",
  title: "Cambiar tu avatar",
  summary: "Cómo elegir un personaje o una imagen para tu perfil.",
  keywords: ["avatar", "perfil"],
  toc: [{ id: "avatar", title: "Avatar" }],
  blocks: [
    heading(2, "avatar", "Avatar"),
    paragraph("Toca tu imagen en la página de inicio y elige un avatar nuevo."),
    screenshotBlock(S, "avatar-and-profile", "avatar", "Elegir un avatar"),
    videoBlock(S, "avatar-and-profile"),
  ],
});

export const offlineGames = studentArticle({
  slug: "offline-games",
  title: "Juegos sin conexión",
  summary: "Juegos sin internet en el mismo dispositivo.",
  keywords: ["sin conexión", "juego"],
  toc: [{ id: "offline", title: "Sin conexión" }],
  blocks: [
    heading(2, "offline", "Sin conexión"),
    paragraph("Tres en raya y otros juegos: no hace falta red."),
    screenshotBlock(S, "offline-games", "offline", "Lista de juegos sin conexión"),
    videoBlock(S, "offline-games"),
    relatedLinks([{ href: "/offline", label: "Juegos sin conexión" }]),
  ],
});

export const tipsForGoodPractice = studentArticle({
  slug: "tips-for-good-practice",
  title: "Consejos para practicar bien",
  summary: "Tiempo de estudio, descansos y constancia.",
  keywords: ["consejos", "práctica"],
  toc: [{ id: "tips", title: "Consejos" }],
  blocks: [
    heading(2, "tips", "Consejos"),
    list([
      "Practica un poco cada día",
      "Descansa si estás cansado o cansada",
      "Lee las explicaciones cuando no entiendas",
    ]),
    callout("tip", "¡Aprender es más divertido cuando no te presionas!"),
    videoBlock(S, "tips-for-good-practice"),
  ],
});

export const STUDENT_ARTICLES = [
  studentLogin,
  studentHomeTour,
  chooseSubjectAndGrade,
  answeringQuestions,
  hintsAndExplanations,
  dailyMissions,
  monthlyPersistence,
  coinsAndArcade,
  avatarAndProfile,
  offlineGames,
  tipsForGoodPractice,
];
