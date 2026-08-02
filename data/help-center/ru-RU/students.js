/**
 * Russian (ru-RU) Help articles for students — child-facing ты.
 * IDs/slugs/sections preserved vs English authority.
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

const S = "students";

function studentArticle(opts) {
  return baseArticle({ ...opts, section: S, audience: "student" });
}

export const studentLogin = studentArticle({
  slug: "student-login",
  title: "Как войти?",
  summary: "Войди со своим именем пользователя и PIN-кодом.",
  keywords: ["login", "PIN", "вход"],
  toc: [{ id: "steps", title: "Шаги" }],
  blocks: [
    heading(2, "steps", "Шаги"),
    list(
      [
        "Попроси у родителя имя пользователя и код",
        "Введи их на странице входа",
        "Нажми «Войти»",
      ],
      true
    ),
    videoBlock(S, "student-login"),
    screenshotBlock(S, "student-login", "login", "Экран входа ученика"),
  ],
});

export const studentHomeTour = studentArticle({
  slug: "student-home-tour",
  title: "Моя главная страница",
  summary: "Что ты видишь после входа: предметы, монеты и аватар.",
  keywords: ["home", "student", "главная"],
  toc: [{ id: "home", title: "Главная страница" }],
  blocks: [
    heading(2, "home", "Главная страница"),
    paragraph("Здесь ты увидишь своё имя, сколько у тебя монет и какие предметы можно открыть."),
    videoBlock(S, "student-home-tour"),
    screenshotBlock(S, "student-home-tour", "home", "Главная страница ученика с карточками предметов"),
  ],
});

export const chooseSubjectAndGrade = studentArticle({
  slug: "choose-subject-and-grade",
  title: "Выбери предмет и класс",
  summary: "Как начать практику по выбранному предмету.",
  keywords: ["subject", "grade", "предмет", "класс"],
  toc: [{ id: "learning-hub", title: "Учебный центр" }],
  blocks: [
    heading(2, "learning-hub", "Учебный центр"),
    paragraph("Выбери предмет из списка. Задания будут соответствовать твоему классу."),
    videoBlock(S, "choose-subject-and-grade"),
    screenshotBlock(S, "choose-subject-and-grade", "subjects", "Список предметов в учебном центре"),
    relatedLinks([{ href: "/learning", label: "Перейти в учебный центр" }]),
  ],
});

export const answeringQuestions = studentArticle({
  slug: "answering-questions",
  title: "Как отвечать на вопросы?",
  summary: "Выбор, ввод и отметка ответов.",
  keywords: ["questions", "answer", "вопросы"],
  toc: [{ id: "types", title: "Типы вопросов" }],
  blocks: [
    heading(2, "types", "Типы вопросов"),
    list([
      "Иногда нужно выбрать ответ из списка",
      "Иногда нужно написать число или слово",
      "После ответа ты увидишь, правильно ли получилось",
    ]),
    videoBlock(S, "answering-questions"),
    screenshotBlock(S, "answering-questions", "question", "Вопрос практики на экране"),
  ],
});

export const hintsAndExplanations = studentArticle({
  slug: "hints-and-explanations",
  title: "Подсказки и объяснения",
  summary: "Что происходит после правильного или неправильного ответа.",
  keywords: ["explanation", "hint", "объяснение"],
  toc: [{ id: "after", title: "После ответа" }],
  blocks: [
    heading(2, "after", "После ответа"),
    paragraph("Если ошибся — прочитай объяснение и попробуй снова. Если ответил верно — переходи к следующему вопросу!"),
    callout("tip", "Не торопись — чтение объяснения помогает понять."),
    videoBlock(S, "hints-and-explanations"),
  ],
});

export const dailyMissions = studentArticle({
  slug: "daily-missions",
  title: "Ежедневные миссии",
  summary: "Маленькие задания, которые помогают двигаться вперёд каждый день.",
  keywords: ["daily", "missions", "миссии"],
  toc: [{ id: "missions", title: "Миссии" }],
  blocks: [
    heading(2, "missions", "Миссии"),
    paragraph("На главной странице ты увидишь ежедневные миссии. Когда выполнишь их, получишь очки и прогресс."),
    videoBlock(S, "daily-missions"),
    screenshotBlock(S, "daily-missions", "missions", "Панель ежедневных миссий"),
  ],
});

export const monthlyPersistence = studentArticle({
  slug: "monthly-persistence",
  title: "Месячный путь настойчивости",
  summary: "Практикуйся каждый месяц и накапливай прогресс.",
  keywords: ["persistence", "month", "настойчивость"],
  toc: [{ id: "persistence", title: "Настойчивость" }],
  blocks: [
    heading(2, "persistence", "Настойчивость"),
    paragraph("Чем больше ты практикуешься за месяц, тем дальше идёт твоё путешествие. Оно показывает, как ты продолжал!"),
    screenshotBlock(S, "monthly-persistence", "persistence", "Месячный путь настойчивости"),
    videoBlock(S, "monthly-persistence"),
  ],
});

export const coinsAndArcade = studentArticle({
  slug: "coins-and-arcade",
  title: "Монеты и аркада",
  summary: "Как зарабатывать монеты и играть онлайн.",
  keywords: ["coins", "arcade", "монеты"],
  toc: [{ id: "coins", title: "Монеты" }],
  blocks: [
    heading(2, "coins", "Монеты"),
    paragraph("Практикуйся и зарабатывай монеты. В аркаде можно играть в настольные игры с друзьями."),
    videoBlock(S, "coins-and-arcade"),
    screenshotBlock(S, "coins-and-arcade", "arcade", "Страница аркады"),
    relatedLinks([{ href: "/student/arcade", label: "Перейти в аркаду" }]),
  ],
});

export const avatarAndProfile = studentArticle({
  slug: "avatar-and-profile",
  title: "Смени аватар",
  summary: "Как выбрать персонажа или картинку для профиля.",
  keywords: ["avatar", "profile", "аватар"],
  toc: [{ id: "avatar", title: "Аватар" }],
  blocks: [
    heading(2, "avatar", "Аватар"),
    paragraph("Нажми на свою картинку на главной и выбери новый аватар."),
    screenshotBlock(S, "avatar-and-profile", "avatar", "Выбор аватара"),
    videoBlock(S, "avatar-and-profile"),
  ],
});

export const offlineGames = studentArticle({
  slug: "offline-games",
  title: "Офлайн-игры",
  summary: "Игры без интернета на том же устройстве.",
  keywords: ["offline", "game", "офлайн"],
  toc: [{ id: "offline", title: "Офлайн" }],
  blocks: [
    heading(2, "offline", "Офлайн"),
    paragraph("Крестики-нолики и другие игры — сеть не нужна."),
    screenshotBlock(S, "offline-games", "offline", "Список офлайн-игр"),
    videoBlock(S, "offline-games"),
    relatedLinks([{ href: "/offline", label: "Офлайн-игры" }]),
  ],
});

export const tipsForGoodPractice = studentArticle({
  slug: "tips-for-good-practice",
  title: "Советы для хорошей практики",
  summary: "Время учёбы, перерывы и регулярность.",
  keywords: ["tips", "practice", "советы"],
  toc: [{ id: "tips", title: "Советы" }],
  blocks: [
    heading(2, "tips", "Советы"),
    list([
      "Практикуйся понемногу каждый день",
      "Сделай перерыв, если устал",
      "Читай объяснения, когда что-то непонятно",
    ]),
    callout("tip", "Учиться веселее, когда ты не давишь на себя!"),
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
