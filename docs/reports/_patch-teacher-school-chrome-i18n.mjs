import fs from "node:fs";
import path from "node:path";

const TRANSLATIONS = {
  "es-419": {
    signOut: "Cerrar sesión",
    signOutBusy: "Cerrando sesión…",
    myClasses: "Mis clases",
    classReportTitle: "Informe de clase",
    backToDashboard: "← Volver al panel",
    schoolLabel: "Escuela: {name}",
  },
  "pt-BR": {
    signOut: "Sair",
    signOutBusy: "Saindo…",
    myClasses: "Minhas turmas",
    classReportTitle: "Relatório da turma",
    backToDashboard: "← Voltar ao painel",
    schoolLabel: "Escola: {name}",
  },
  "pt-PT": {
    signOut: "Terminar sessão",
    signOutBusy: "A terminar sessão…",
    myClasses: "As minhas turmas",
    classReportTitle: "Relatório da turma",
    backToDashboard: "← Voltar ao painel",
    schoolLabel: "Escola: {name}",
  },
  "de-DE": {
    signOut: "Abmelden",
    signOutBusy: "Abmelden…",
    myClasses: "Meine Klassen",
    classReportTitle: "Klassenbericht",
    backToDashboard: "← Zurück zum Dashboard",
    schoolLabel: "Schule: {name}",
  },
  "fr-FR": {
    signOut: "Se déconnecter",
    signOutBusy: "Déconnexion…",
    myClasses: "Mes classes",
    classReportTitle: "Rapport de classe",
    backToDashboard: "← Retour au tableau de bord",
    schoolLabel: "École : {name}",
  },
  "it-IT": {
    signOut: "Esci",
    signOutBusy: "Uscita…",
    myClasses: "Le mie classi",
    classReportTitle: "Report di classe",
    backToDashboard: "← Torna alla dashboard",
    schoolLabel: "Scuola: {name}",
  },
  "nl-NL": {
    signOut: "Uitloggen",
    signOutBusy: "Bezig met uitloggen…",
    myClasses: "Mijn klassen",
    classReportTitle: "Klasrapport",
    backToDashboard: "← Terug naar overzicht",
    schoolLabel: "School: {name}",
  },
  "ru-RU": {
    signOut: "Выйти",
    signOutBusy: "Выход…",
    myClasses: "Мои классы",
    classReportTitle: "Отчёт по классу",
    backToDashboard: "← Назад к панели",
    schoolLabel: "Школа: {name}",
  },
};

for (const [loc, t] of Object.entries(TRANSLATIONS)) {
  const uiPath = path.join("locales", loc, "ui.json");
  const schoolPath = path.join("locales", loc, "school.json");
  const ui = JSON.parse(fs.readFileSync(uiPath, "utf8"));
  ui.teacherShell = {
    backToDashboard: t.backToDashboard,
    schoolLabel: t.schoolLabel,
    signOut: t.signOut,
    myClasses: t.myClasses,
    classReportTitle: t.classReportTitle,
  };
  fs.writeFileSync(uiPath, `${JSON.stringify(ui, null, 2)}\n`);

  const school = JSON.parse(fs.readFileSync(schoolPath, "utf8"));
  school.portal = school.portal || {};
  school.portal.signOut = t.signOut;
  school.portal.signOutBusy = t.signOutBusy;
  school.portal.classReportTitle = t.classReportTitle;
  fs.writeFileSync(schoolPath, `${JSON.stringify(school, null, 2)}\n`);
  console.log("patched", loc);
}

console.log("done");
