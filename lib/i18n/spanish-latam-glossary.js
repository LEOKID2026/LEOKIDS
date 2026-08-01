/**
 * Spanish (Latin America) glossary — translation SSOT for es-419 and future country layers.
 * Neutral LatAm Spanish for ages 5–12 and parents. No vos/vosotros; no Spain-specific wording.
 * Prefer natural phrasing over literal English calques. Context notes override a single gloss.
 */

/** @typedef {{ preferred: string, avoid?: string[], notes?: string }} GlossaryEntry */

/** @type {Readonly<Record<string, GlossaryEntry>>} */
export const SPANISH_LATAM_GLOSSARY = Object.freeze({
  // —— Subjects (product: Math, Geometry, English, Science only) ——
  Math: {
    preferred: "Matemáticas",
    avoid: ["Mates", "Matemática (alone as product label)", "Math"],
    notes: "Product subject label. Plural form is standard in LatAm schools.",
  },
  Geometry: {
    preferred: "Geometría",
    avoid: ["Geometry"],
  },
  English: {
    preferred: "Inglés",
    avoid: ["English"],
    notes:
      "Subject name in UI/reports. Learning stems, options, and reading passages stay in English; only chrome, hints, feedback, and reports translate.",
  },
  Science: {
    preferred: "Ciencias",
    avoid: ["Ciencia (singular as subject label)", "Science", "Ciencias Naturales (unless a specific curriculum pack requires it)"],
    notes: "Elementary subject label: Ciencias.",
  },

  // —— Learning structure ——
  subject: {
    preferred: "materia",
    avoid: ["profesión", "subject", "asignatura (kids UI — prefer materia)"],
    notes: "Kids/parent UI: materia. Teacher/school formal lists may use asignatura.",
  },
  topic: {
    preferred: "tema",
    avoid: ["tópico (calque)", "topic"],
  },
  skill: {
    preferred: "habilidad",
    avoid: ["destreza (unless pedagogy copy needs nuance)", "skill"],
  },
  grade: {
    preferred: "grado",
    avoid: ["curso (Spain-leaning for school year)", "año", "grade"],
    notes: "Grade 1 → Grado 1 (not Year 1).",
  },
  practice: {
    preferred: "práctica",
    avoid: ["practicar (when a noun is required)", "ensayo", "practice"],
    notes: "Noun: práctica. Verb CTA: Practica / Practica ahora. Context decides.",
  },
  activity: {
    preferred: "actividad",
    avoid: ["tarea (when meaning assigned classroom activity — use only if clearly homework)", "activity"],
  },
  worksheet: {
    preferred: "hoja de actividades",
    avoid: ["worksheet", "fotocopia", "ficha (Spain-leaning in some regions)"],
    notes:
      "Default for parents/kids: hoja de actividades. hoja de trabajo is OK in school/teacher formal contexts. Choose by surface — do not blind-replace.",
  },
  question: {
    preferred: "pregunta",
    avoid: ["cuestión", "question"],
  },
  answer: {
    preferred: "respuesta",
    avoid: ["contestación", "answer"],
  },
  "correct answer": {
    preferred: "respuesta correcta",
    avoid: ["correct answer", "acierto (alone as the answer label)"],
  },
  "incorrect answer": {
    preferred: "respuesta incorrecta",
    avoid: ["respuesta errónea (OK in reports; prefer incorrecta in kids UI)", "incorrect answer"],
  },
  hint: {
    preferred: "pista",
    avoid: ["hint", "ayuda (too vague for the hint control)", "indicio"],
  },
  explanation: {
    preferred: "explicación",
    avoid: ["explanation", "solución (when explaining why, not the numeric solution)"],
  },
  instructions: {
    preferred: "instrucciones",
    avoid: ["indicaciones (OK as synonym in long copy)", "instructions"],
  },

  // —— Child actions ——
  Start: {
    preferred: "Empezar",
    avoid: ["Iniciar (prefer for sessions/systems)", "Comenzar (OK synonym; keep Empezar on short buttons)", "Start"],
  },
  Continue: {
    preferred: "Continuar",
    avoid: ["Seguir (ambiguous)", "Continue"],
  },
  "Try again": {
    preferred: "Intentar de nuevo",
    avoid: ["Reintentar (OK on short retry)", "Try again", "Volver a intentar (longer)"],
  },
  Check: {
    preferred: "Comprobar",
    avoid: ["Checar (regional)", "Check", "Verificar (OK in formal/admin; prefer Comprobar for kids)"],
    notes: "Answer-check button for children: Comprobar.",
  },
  Next: {
    preferred: "Siguiente",
    avoid: ["Next", "Próximo (prefer Siguiente on wizards)"],
  },
  Back: {
    preferred: "Atrás",
    avoid: ["Volver (OK when meaning return to a place)", "Back", "Anterior"],
  },
  Choose: {
    preferred: "Elegir",
    avoid: ["Escoger (OK synonym)", "Choose", "Seleccionar (forms/settings)"],
  },
  Write: {
    preferred: "Escribir",
    avoid: ["Write"],
  },
  Listen: {
    preferred: "Escuchar",
    avoid: ["Listen", "Oír (prefer Escuchar for intentional listening)"],
  },
  Read: {
    preferred: "Leer",
    avoid: ["Read"],
  },
  Play: {
    preferred: "Jugar",
    avoid: ["Play", "Reproducir (audio/video play control — use Reproducir there)"],
    notes: "Games: Jugar. Media play: Reproducir.",
  },
  Finish: {
    preferred: "Terminar",
    avoid: ["Finalizar (OK formal)", "Finish", "Acabar"],
  },

  // —— Parents & reports ——
  Parent: {
    preferred: "padres",
    avoid: ["progenitor", "Parent"],
    notes:
      "Context-dependent — do not blind-replace. Portal/nav: Padres. Role/form singular: madre, padre o tutor. Household framing: familia. Prefer natural phrasing per surface.",
  },
  "Parent report": {
    preferred: "informe para padres",
    avoid: ["reporte de padres (reporte is OK in LatAm; prefer informe for learning reports)", "Parent report"],
  },
  "Learning pattern": {
    preferred: "patrón de aprendizaje",
    avoid: ["patrón de estudio", "learning pattern"],
  },
  Strength: {
    preferred: "fortaleza",
    avoid: ["punto fuerte (OK in long parent copy)", "Strength", "fuerza"],
  },
  "Area to strengthen": {
    preferred: "área para reforzar",
    avoid: ["área de mejora (OK synonym in reports)", "Worth strengthening", "area to strengthen"],
  },
  Progress: {
    preferred: "progreso",
    avoid: ["avance (OK synonym)", "Progress"],
  },
  Improvement: {
    preferred: "mejora",
    avoid: ["mejoramiento", "Improvement"],
  },
  "Correct answers": {
    preferred: "respuestas correctas",
    avoid: ["aciertos (OK compact stats label)", "correct answers"],
  },
  "Incorrect answers": {
    preferred: "respuestas incorrectas",
    avoid: ["errores (OK compact stats)", "incorrect answers"],
  },
  "Practice summary": {
    preferred: "resumen de práctica",
    avoid: ["practice summary", "sumario"],
  },

  // —— Accounts & system ——
  "Sign in": {
    preferred: "Iniciar sesión",
    avoid: ["Entrar (OK short kids CTA)", "Sign in", "Loguearse"],
  },
  "Sign up": {
    preferred: "Crear cuenta",
    avoid: ["Registrarse (OK synonym)", "Sign up", "Inscribirse"],
  },
  "Log out": {
    preferred: "Cerrar sesión",
    avoid: ["Salir (OK short)", "Log out", "Desconectarse"],
  },
  Profile: {
    preferred: "Perfil",
    avoid: ["Profile"],
  },
  Settings: {
    preferred: "Configuración",
    avoid: ["Ajustes (OK synonym on mobile)", "Settings", "Preferencias (when meaning prefs only)"],
  },
  Password: {
    preferred: "Contraseña",
    avoid: ["Password", "Clave (ambiguous)"],
  },
  Email: {
    preferred: "Correo electrónico",
    avoid: ["Email (OK as short field label if space is tight)", "e-mail", "Mail"],
  },
  Save: {
    preferred: "Guardar",
    avoid: ["Save", "Salvar (false friend)"],
  },
  Cancel: {
    preferred: "Cancelar",
    avoid: ["Cancel"],
  },
  Delete: {
    preferred: "Eliminar",
    avoid: ["Borrar (OK synonym for soft clear)", "Delete", "Suprimir"],
  },
  Loading: {
    preferred: "Cargando…",
    avoid: ["Loading", "Carga"],
  },
  Error: {
    preferred: "Error",
    avoid: ["Fallo (prefer Error in system messages)"],
  },
});

/** Patterns that must not appear in es-419 product copy (Spain / regional / calques). */
export const FORBIDDEN_ES_LATAM_PATTERNS = Object.freeze([
  { id: "vosotros", re: /\bvosotros\b/i },
  { id: "vosotras", re: /\bvosotras\b/i },
  { id: "vos_conjugation", re: /\b(tenés|querés|podés|sos|estás\s+vos)\b/i },
  { id: "standalone_vos", re: /(^|[^\wáéíóúñ])vos([^\wáéíóúñ]|$)/i },
  { id: "ordenador", re: /\borderador(?:es)?\b/i },
  { id: "vosotros_verbs", re: /\b(?:hacéis|tenéis|estáis|sois|vais)\b/i },
  { id: "chaval", re: /\bchaval(?:es)?\b/i },
  { id: "profesion_subject", re: /\bla profesión\b/i },
]);

export const ES_LATAM_LOCALE_ID = "es-419";
