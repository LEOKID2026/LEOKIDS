/**
 * Russian (ru-RU) Help articles for parents — adult-facing Вы.
 */
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
  title: "Добро пожаловать в гид для родителей",
  summary: "Что такое Leo Kids, что могут делать родители на сайте и как начать.",
  keywords: ["parents", "start", "overview", "родители"],
  toc: [
    { id: "what-is-leo", title: "Что такое Leo Kids?" },
    { id: "parent-role", title: "Роль родителя" },
  ],
  blocks: [
    heading(2, "what-is-leo", "Что такое Leo Kids?"),
    paragraph(
      "Leo Kids — учебное пространство для учеников начальной школы с 1 по 6 класс: практика по математике, геометрии, английскому языку и естественным наукам, а также игры и отчёты о прогрессе для родителей."
    ),
    screenshotBlock(S, "welcome-and-overview", "overview", "Главная страница Leo Kids с зонами учёбы и игр"),
    videoBlock(S, "welcome-and-overview"),
    heading(2, "parent-role", "Роль родителя"),
    list([
      "Создайте родительскую учётную запись и войдите",
      "Добавьте детей и управляйте данными для входа",
      "Смотрите отчёты и рекомендации по практике",
    ]),
    relatedLinks([
      { href: "/help/parents/create-parent-account", label: "Создать родительскую учётную запись" },
      { href: "/help/parents/parent-dashboard-tour", label: "Тур по панели родителя" },
    ]),
  ],
});

export const createParentAccount = baseArticle({
  slug: "create-parent-account",
  section: S,
  title: "Создать родительскую учётную запись",
  summary: "Как зарегистрироваться и войти в портал родителя.",
  keywords: ["sign up", "login", "parents", "регистрация"],
  toc: [{ id: "login-page", title: "Страница входа" }],
  blocks: [
    heading(2, "login-page", "Страница входа"),
    paragraph("Перейдите на страницу входа для родителей и завершите регистрацию или войдите с электронной почтой и паролем."),
    screenshotBlock(S, "create-parent-account", "login", "Экран входа для родителей"),
    videoBlock(S, "create-parent-account"),
    callout("tip", "Храните данные для входа в безопасном месте — они понадобятся при каждом входе."),
  ],
});

export const parentDashboardTour = baseArticle({
  slug: "parent-dashboard-tour",
  section: S,
  title: "Тур по панели родителя",
  summary: "Основные разделы после входа: дети, отчёты и инструменты.",
  keywords: ["dashboard", "parents", "панель"],
  toc: [{ id: "dashboard", title: "Панель" }],
  blocks: [
    heading(2, "dashboard", "Панель"),
    paragraph("После входа вы увидите список детей, отчёты и быстрые действия. Выберите ребёнка, чтобы открыть его прогресс."),
    screenshotBlock(S, "parent-dashboard-tour", "dashboard", "Панель родителя"),
    videoBlock(S, "parent-dashboard-tour"),
  ],
});

export const addStudents = baseArticle({
  slug: "add-students",
  section: S,
  title: "Добавить ребёнка",
  summary: "Как добавить ребёнка к родительской учётной записи.",
  keywords: ["add", "child", "ребёнок"],
  toc: [{ id: "add", title: "Добавление" }],
  blocks: [
    heading(2, "add", "Добавление"),
    list([
      "Откройте раздел управления детьми",
      "Введите имя ребёнка и класс",
      "Сохраните — система создаст данные для входа ученика",
    ]),
    videoBlock(S, "add-students"),
    screenshotBlock(S, "add-students", "add", "Форма добавления ребёнка"),
  ],
});

export const studentPinAndCredentials = baseArticle({
  slug: "student-pin-and-credentials",
  section: S,
  title: "PIN и данные для входа ребёнка",
  summary: "Где найти имя пользователя и код ребёнка.",
  keywords: ["PIN", "login", "credentials"],
  toc: [{ id: "credentials", title: "Данные для входа" }],
  blocks: [
    heading(2, "credentials", "Данные для входа"),
    paragraph("В карточке ребёнка вы найдёте имя пользователя и код входа. Передайте их ребёнку для входа в детскую зону."),
    callout("info", "Не публикуйте коды детей в открытых чатах."),
    videoBlock(S, "student-pin-and-credentials"),
  ],
});

export const editOrDeleteStudent = baseArticle({
  slug: "edit-or-delete-student",
  section: S,
  title: "Изменить или удалить ребёнка",
  summary: "Как обновить данные ребёнка или удалить профиль.",
  keywords: ["edit", "delete", "child"],
  toc: [{ id: "edit", title: "Изменение" }],
  blocks: [
    heading(2, "edit", "Изменение"),
    paragraph("Откройте карточку ребёнка, чтобы изменить имя или класс. Удаление необратимо удаляет связанные данные практики с этой учётной записи."),
    videoBlock(S, "edit-or-delete-student"),
  ],
});

export const howToReadReport = baseArticle({
  slug: "how-to-read-report",
  section: S,
  title: "Как начать читать отчёт?",
  summary: "Первый взгляд на отчёт о прогрессе ребёнка.",
  keywords: ["report", "read", "отчёт"],
  toc: [{ id: "start", title: "С чего начать" }],
  blocks: [
    heading(2, "start", "С чего начать"),
    paragraph("Откройте отчёт ребёнка. Сначала посмотрите сводку, затем темы для закрепления и рекомендации для дома."),
    relatedLinks([{ href: "/help/parent-report/report-overview", label: "Обзор отчёта родителя" }]),
    videoBlock(S, "how-to-read-report"),
  ],
});

export const parentCopilot = baseArticle({
  slug: "parent-copilot",
  section: S,
  title: "Спросите об отчёте (Copilot)",
  summary: "Как задавать вопросы по данным практики в отчёте.",
  keywords: ["copilot", "report", "вопросы"],
  toc: [{ id: "ask", title: "Как спрашивать" }],
  blocks: [
    heading(2, "ask", "Как спрашивать"),
    paragraph("Copilot отвечает только на основе данных практики на сайте. Спрашивайте о темах для практики, домашнем шаге или том, что видно в отчёте."),
    callout("info", "Это не медицинский и не личный диагноз — только учебные сигналы из практики."),
    videoBlock(S, "parent-copilot"),
  ],
});

export const monthlyRewards = baseArticle({
  slug: "monthly-rewards",
  section: S,
  title: "Ежемесячная награда за настойчивость",
  summary: "Как работает месячный прогресс и награды.",
  keywords: ["monthly", "rewards", "награда"],
  toc: [{ id: "monthly", title: "Месячный прогресс" }],
  blocks: [
    heading(2, "monthly", "Месячный прогресс"),
    paragraph("Регулярная практика в течение месяца продвигает путь настойчивости. В конце периода могут появиться награды за участие."),
    videoBlock(S, "monthly-rewards"),
  ],
});

export const installAsApp = baseArticle({
  slug: "install-as-app",
  section: S,
  title: "Установить как приложение",
  summary: "Как добавить Leo Kids на домашний экран.",
  keywords: ["install", "PWA", "приложение"],
  toc: [{ id: "install", title: "Установка" }],
  blocks: [
    heading(2, "install", "Установка"),
    paragraph("В поддерживаемом браузере выберите «Установить приложение» или «На экран «Домой»», чтобы открывать Leo Kids как приложение."),
    videoBlock(S, "install-as-app"),
  ],
});

export const mobileAndOffline = baseArticle({
  slug: "mobile-and-offline",
  section: S,
  title: "Мобильные и офлайн-игры",
  summary: "Что доступно на телефоне и без интернета.",
  keywords: ["mobile", "offline", "офлайн"],
  toc: [{ id: "mobile", title: "Мобильный доступ" }],
  blocks: [
    heading(2, "mobile", "Мобильный доступ"),
    paragraph("Многие функции работают на телефоне. Некоторые игры доступны офлайн на том же устройстве."),
    videoBlock(S, "mobile-and-offline"),
  ],
});

export const troubleshootingLogin = baseArticle({
  slug: "troubleshooting-login",
  section: S,
  title: "Устранение проблем со входом",
  summary: "Что проверить, если вход не получается.",
  keywords: ["login", "troubleshoot", "вход"],
  toc: [{ id: "checks", title: "Проверки" }],
  blocks: [
    heading(2, "checks", "Проверки"),
    list([
      "Проверьте электронную почту и пароль",
      "Подтвердите электронную почту, если система просит",
      "Попробуйте сброс пароля",
    ]),
    callout("info", "Если проблема сохраняется, свяжитесь с нами через страницу контактов."),
    videoBlock(S, "troubleshooting-login"),
    relatedLinks([{ href: "/contact", label: "Связаться с нами" }]),
  ],
});

export const privacyAndData = baseArticle({
  slug: "privacy-and-data",
  section: S,
  title: "Конфиденциальность и данные",
  summary: "Что собирается во время практики и как связаться по вопросам конфиденциальности.",
  keywords: ["privacy", "data", "конфиденциальность"],
  toc: [{ id: "data", title: "Данные практики" }],
  blocks: [
    heading(2, "data", "Данные практики"),
    paragraph("Система хранит данные практики, чтобы показывать прогресс и отчёты. Не передавайте коды входа детей другим людям."),
    callout("info", "По вопросам конфиденциальности см. политику конфиденциальности или свяжитесь с нами."),
    videoBlock(S, "privacy-and-data"),
    relatedLinks([
      { href: "/privacy", label: "Политика конфиденциальности" },
      { href: "/legal", label: "Условия, конфиденциальность и доступность" },
      { href: "/contact", label: "Связаться с нами" },
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
