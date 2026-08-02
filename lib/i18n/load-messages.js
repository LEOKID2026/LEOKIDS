/**
 * Namespace loader for locales/{locale}/{ns}.json
 * Real locale loading with fallback chain and dev warnings.
 */

import uiEn from "../../locales/en/ui.json" with { type: "json" };
import learningEn from "../../locales/en/learning.json" with { type: "json" };
import reportsEn from "../../locales/en/reports.json" with { type: "json" };
import emailsEn from "../../locales/en/emails.json" with { type: "json" };
import seoEn from "../../locales/en/seo.json" with { type: "json" };
import legalEn from "../../locales/en/legal.json" with { type: "json" };
import worksheetsEn from "../../locales/en/worksheets.json" with { type: "json" };
import gamesEn from "../../locales/en/games.json" with { type: "json" };
import validationEn from "../../locales/en/validation.json" with { type: "json" };
import commonEn from "../../locales/en/common.json" with { type: "json" };
import authEn from "../../locales/en/auth.json" with { type: "json" };
import teacherEn from "../../locales/en/teacher.json" with { type: "json" };
import schoolEn from "../../locales/en/school.json" with { type: "json" };
import platformEn from "../../locales/en/platform.json" with { type: "json" };
import copilotEn from "../../locales/en/copilot.json" with { type: "json" };
import commonEs419 from "../../locales/es-419/common.json" with { type: "json" };
import uiEs419 from "../../locales/es-419/ui.json" with { type: "json" };
import authEs419 from "../../locales/es-419/auth.json" with { type: "json" };
import validationEs419 from "../../locales/es-419/validation.json" with { type: "json" };
import learningEs419 from "../../locales/es-419/learning.json" with { type: "json" };
import reportsEs419 from "../../locales/es-419/reports.json" with { type: "json" };
import worksheetsEs419 from "../../locales/es-419/worksheets.json" with { type: "json" };
import gamesEs419 from "../../locales/es-419/games.json" with { type: "json" };
import emailsEs419 from "../../locales/es-419/emails.json" with { type: "json" };
import seoEs419 from "../../locales/es-419/seo.json" with { type: "json" };
import legalEs419 from "../../locales/es-419/legal.json" with { type: "json" };
import teacherEs419 from "../../locales/es-419/teacher.json" with { type: "json" };
import schoolEs419 from "../../locales/es-419/school.json" with { type: "json" };
import platformEs419 from "../../locales/es-419/platform.json" with { type: "json" };
import copilotEs419 from "../../locales/es-419/copilot.json" with { type: "json" };
import commonEsMx from "../../locales/es-MX/common.json" with { type: "json" };
import uiEsMx from "../../locales/es-MX/ui.json" with { type: "json" };
import learningEsMx from "../../locales/es-MX/learning.json" with { type: "json" };
import worksheetsEsMx from "../../locales/es-MX/worksheets.json" with { type: "json" };
import commonEsCo from "../../locales/es-CO/common.json" with { type: "json" };
import uiEsCo from "../../locales/es-CO/ui.json" with { type: "json" };
import learningEsCo from "../../locales/es-CO/learning.json" with { type: "json" };
import worksheetsEsCo from "../../locales/es-CO/worksheets.json" with { type: "json" };
import seoEsCo from "../../locales/es-CO/seo.json" with { type: "json" };
import teacherEsCo from "../../locales/es-CO/teacher.json" with { type: "json" };
import commonEsAr from "../../locales/es-AR/common.json" with { type: "json" };
import uiEsAr from "../../locales/es-AR/ui.json" with { type: "json" };
import learningEsAr from "../../locales/es-AR/learning.json" with { type: "json" };
import worksheetsEsAr from "../../locales/es-AR/worksheets.json" with { type: "json" };
import authEsAr from "../../locales/es-AR/auth.json" with { type: "json" };
import validationEsAr from "../../locales/es-AR/validation.json" with { type: "json" };
import reportsEsAr from "../../locales/es-AR/reports.json" with { type: "json" };
import emailsEsAr from "../../locales/es-AR/emails.json" with { type: "json" };
import seoEsAr from "../../locales/es-AR/seo.json" with { type: "json" };
import gamesEsAr from "../../locales/es-AR/games.json" with { type: "json" };
import copilotEsAr from "../../locales/es-AR/copilot.json" with { type: "json" };
import commonEsPe from "../../locales/es-PE/common.json" with { type: "json" };
import uiEsPe from "../../locales/es-PE/ui.json" with { type: "json" };
import learningEsPe from "../../locales/es-PE/learning.json" with { type: "json" };
import worksheetsEsPe from "../../locales/es-PE/worksheets.json" with { type: "json" };
import seoEsPe from "../../locales/es-PE/seo.json" with { type: "json" };
import commonEsCl from "../../locales/es-CL/common.json" with { type: "json" };
import uiEsCl from "../../locales/es-CL/ui.json" with { type: "json" };
import learningEsCl from "../../locales/es-CL/learning.json" with { type: "json" };
import worksheetsEsCl from "../../locales/es-CL/worksheets.json" with { type: "json" };
import seoEsCl from "../../locales/es-CL/seo.json" with { type: "json" };
import teacherEsCl from "../../locales/es-CL/teacher.json" with { type: "json" };
import commonEsEc from "../../locales/es-EC/common.json" with { type: "json" };
import uiEsEc from "../../locales/es-EC/ui.json" with { type: "json" };
import learningEsEc from "../../locales/es-EC/learning.json" with { type: "json" };
import worksheetsEsEc from "../../locales/es-EC/worksheets.json" with { type: "json" };
import seoEsEc from "../../locales/es-EC/seo.json" with { type: "json" };
import teacherEsEc from "../../locales/es-EC/teacher.json" with { type: "json" };
import commonEsGt from "../../locales/es-GT/common.json" with { type: "json" };
import uiEsGt from "../../locales/es-GT/ui.json" with { type: "json" };
import learningEsGt from "../../locales/es-GT/learning.json" with { type: "json" };
import worksheetsEsGt from "../../locales/es-GT/worksheets.json" with { type: "json" };
import seoEsGt from "../../locales/es-GT/seo.json" with { type: "json" };
import commonEsDo from "../../locales/es-DO/common.json" with { type: "json" };
import uiEsDo from "../../locales/es-DO/ui.json" with { type: "json" };
import learningEsDo from "../../locales/es-DO/learning.json" with { type: "json" };
import worksheetsEsDo from "../../locales/es-DO/worksheets.json" with { type: "json" };
import seoEsDo from "../../locales/es-DO/seo.json" with { type: "json" };
import teacherEsDo from "../../locales/es-DO/teacher.json" with { type: "json" };
import commonEsVe from "../../locales/es-VE/common.json" with { type: "json" };
import uiEsVe from "../../locales/es-VE/ui.json" with { type: "json" };
import learningEsVe from "../../locales/es-VE/learning.json" with { type: "json" };
import worksheetsEsVe from "../../locales/es-VE/worksheets.json" with { type: "json" };
import teacherEsVe from "../../locales/es-VE/teacher.json" with { type: "json" };
import commonEsBo from "../../locales/es-BO/common.json" with { type: "json" };
import uiEsBo from "../../locales/es-BO/ui.json" with { type: "json" };
import learningEsBo from "../../locales/es-BO/learning.json" with { type: "json" };
import worksheetsEsBo from "../../locales/es-BO/worksheets.json" with { type: "json" };
import seoEsBo from "../../locales/es-BO/seo.json" with { type: "json" };
import commonEsHn from "../../locales/es-HN/common.json" with { type: "json" };
import uiEsHn from "../../locales/es-HN/ui.json" with { type: "json" };
import learningEsHn from "../../locales/es-HN/learning.json" with { type: "json" };
import worksheetsEsHn from "../../locales/es-HN/worksheets.json" with { type: "json" };
import teacherEsHn from "../../locales/es-HN/teacher.json" with { type: "json" };
import commonEsSv from "../../locales/es-SV/common.json" with { type: "json" };
import uiEsSv from "../../locales/es-SV/ui.json" with { type: "json" };
import learningEsSv from "../../locales/es-SV/learning.json" with { type: "json" };
import worksheetsEsSv from "../../locales/es-SV/worksheets.json" with { type: "json" };
import seoEsSv from "../../locales/es-SV/seo.json" with { type: "json" };
import teacherEsSv from "../../locales/es-SV/teacher.json" with { type: "json" };
import commonEsNi from "../../locales/es-NI/common.json" with { type: "json" };
import uiEsNi from "../../locales/es-NI/ui.json" with { type: "json" };
import learningEsNi from "../../locales/es-NI/learning.json" with { type: "json" };
import worksheetsEsNi from "../../locales/es-NI/worksheets.json" with { type: "json" };
import seoEsNi from "../../locales/es-NI/seo.json" with { type: "json" };
import teacherEsNi from "../../locales/es-NI/teacher.json" with { type: "json" };
import commonEsPy from "../../locales/es-PY/common.json" with { type: "json" };
import uiEsPy from "../../locales/es-PY/ui.json" with { type: "json" };
import learningEsPy from "../../locales/es-PY/learning.json" with { type: "json" };
import worksheetsEsPy from "../../locales/es-PY/worksheets.json" with { type: "json" };
import seoEsPy from "../../locales/es-PY/seo.json" with { type: "json" };
import teacherEsPy from "../../locales/es-PY/teacher.json" with { type: "json" };
import commonEsCr from "../../locales/es-CR/common.json" with { type: "json" };
import uiEsCr from "../../locales/es-CR/ui.json" with { type: "json" };
import learningEsCr from "../../locales/es-CR/learning.json" with { type: "json" };
import worksheetsEsCr from "../../locales/es-CR/worksheets.json" with { type: "json" };
import teacherEsCr from "../../locales/es-CR/teacher.json" with { type: "json" };
import commonEsPa from "../../locales/es-PA/common.json" with { type: "json" };
import uiEsPa from "../../locales/es-PA/ui.json" with { type: "json" };
import learningEsPa from "../../locales/es-PA/learning.json" with { type: "json" };
import worksheetsEsPa from "../../locales/es-PA/worksheets.json" with { type: "json" };
import seoEsPa from "../../locales/es-PA/seo.json" with { type: "json" };
import teacherEsPa from "../../locales/es-PA/teacher.json" with { type: "json" };
import commonEsUy from "../../locales/es-UY/common.json" with { type: "json" };
import uiEsUy from "../../locales/es-UY/ui.json" with { type: "json" };
import learningEsUy from "../../locales/es-UY/learning.json" with { type: "json" };
import worksheetsEsUy from "../../locales/es-UY/worksheets.json" with { type: "json" };
import seoEsUy from "../../locales/es-UY/seo.json" with { type: "json" };
import teacherEsUy from "../../locales/es-UY/teacher.json" with { type: "json" };
import commonEsCu from "../../locales/es-CU/common.json" with { type: "json" };
import uiEsCu from "../../locales/es-CU/ui.json" with { type: "json" };
import learningEsCu from "../../locales/es-CU/learning.json" with { type: "json" };
import worksheetsEsCu from "../../locales/es-CU/worksheets.json" with { type: "json" };
import seoEsCu from "../../locales/es-CU/seo.json" with { type: "json" };
import teacherEsCu from "../../locales/es-CU/teacher.json" with { type: "json" };
import commonEsPr from "../../locales/es-PR/common.json" with { type: "json" };
import uiEsPr from "../../locales/es-PR/ui.json" with { type: "json" };
import learningEsPr from "../../locales/es-PR/learning.json" with { type: "json" };
import worksheetsEsPr from "../../locales/es-PR/worksheets.json" with { type: "json" };
import seoEsPr from "../../locales/es-PR/seo.json" with { type: "json" };
import teacherEsPr from "../../locales/es-PR/teacher.json" with { type: "json" };
import commonEsEs from "../../locales/es-ES/common.json" with { type: "json" };
import uiEsEs from "../../locales/es-ES/ui.json" with { type: "json" };
import learningEsEs from "../../locales/es-ES/learning.json" with { type: "json" };
import worksheetsEsEs from "../../locales/es-ES/worksheets.json" with { type: "json" };
import seoEsEs from "../../locales/es-ES/seo.json" with { type: "json" };
import teacherEsEs from "../../locales/es-ES/teacher.json" with { type: "json" };
import schoolEsEs from "../../locales/es-ES/school.json" with { type: "json" };
import validationEsEs from "../../locales/es-ES/validation.json" with { type: "json" };
import copilotEsEs from "../../locales/es-ES/copilot.json" with { type: "json" };
import commonPtBr from "../../locales/pt-BR/common.json" with { type: "json" };
import uiPtBr from "../../locales/pt-BR/ui.json" with { type: "json" };
import authPtBr from "../../locales/pt-BR/auth.json" with { type: "json" };
import validationPtBr from "../../locales/pt-BR/validation.json" with { type: "json" };
import learningPtBr from "../../locales/pt-BR/learning.json" with { type: "json" };
import reportsPtBr from "../../locales/pt-BR/reports.json" with { type: "json" };
import worksheetsPtBr from "../../locales/pt-BR/worksheets.json" with { type: "json" };
import gamesPtBr from "../../locales/pt-BR/games.json" with { type: "json" };
import emailsPtBr from "../../locales/pt-BR/emails.json" with { type: "json" };
import seoPtBr from "../../locales/pt-BR/seo.json" with { type: "json" };
import legalPtBr from "../../locales/pt-BR/legal.json" with { type: "json" };
import teacherPtBr from "../../locales/pt-BR/teacher.json" with { type: "json" };
import schoolPtBr from "../../locales/pt-BR/school.json" with { type: "json" };
import platformPtBr from "../../locales/pt-BR/platform.json" with { type: "json" };
import copilotPtBr from "../../locales/pt-BR/copilot.json" with { type: "json" };
import commonPtPt from "../../locales/pt-PT/common.json" with { type: "json" };
import uiPtPt from "../../locales/pt-PT/ui.json" with { type: "json" };
import authPtPt from "../../locales/pt-PT/auth.json" with { type: "json" };
import validationPtPt from "../../locales/pt-PT/validation.json" with { type: "json" };
import learningPtPt from "../../locales/pt-PT/learning.json" with { type: "json" };
import reportsPtPt from "../../locales/pt-PT/reports.json" with { type: "json" };
import worksheetsPtPt from "../../locales/pt-PT/worksheets.json" with { type: "json" };
import gamesPtPt from "../../locales/pt-PT/games.json" with { type: "json" };
import emailsPtPt from "../../locales/pt-PT/emails.json" with { type: "json" };
import seoPtPt from "../../locales/pt-PT/seo.json" with { type: "json" };
import legalPtPt from "../../locales/pt-PT/legal.json" with { type: "json" };
import teacherPtPt from "../../locales/pt-PT/teacher.json" with { type: "json" };
import schoolPtPt from "../../locales/pt-PT/school.json" with { type: "json" };
import platformPtPt from "../../locales/pt-PT/platform.json" with { type: "json" };
import copilotPtPt from "../../locales/pt-PT/copilot.json" with { type: "json" };
import commonItIt from "../../locales/it-IT/common.json" with { type: "json" };
import uiItIt from "../../locales/it-IT/ui.json" with { type: "json" };
import authItIt from "../../locales/it-IT/auth.json" with { type: "json" };
import validationItIt from "../../locales/it-IT/validation.json" with { type: "json" };
import learningItIt from "../../locales/it-IT/learning.json" with { type: "json" };
import reportsItIt from "../../locales/it-IT/reports.json" with { type: "json" };
import worksheetsItIt from "../../locales/it-IT/worksheets.json" with { type: "json" };
import gamesItIt from "../../locales/it-IT/games.json" with { type: "json" };
import emailsItIt from "../../locales/it-IT/emails.json" with { type: "json" };
import seoItIt from "../../locales/it-IT/seo.json" with { type: "json" };
import legalItIt from "../../locales/it-IT/legal.json" with { type: "json" };
import teacherItIt from "../../locales/it-IT/teacher.json" with { type: "json" };
import schoolItIt from "../../locales/it-IT/school.json" with { type: "json" };
import platformItIt from "../../locales/it-IT/platform.json" with { type: "json" };
import copilotItIt from "../../locales/it-IT/copilot.json" with { type: "json" };
import commonFrFr from "../../locales/fr-FR/common.json" with { type: "json" };
import uiFrFr from "../../locales/fr-FR/ui.json" with { type: "json" };
import authFrFr from "../../locales/fr-FR/auth.json" with { type: "json" };
import validationFrFr from "../../locales/fr-FR/validation.json" with { type: "json" };
import learningFrFr from "../../locales/fr-FR/learning.json" with { type: "json" };
import reportsFrFr from "../../locales/fr-FR/reports.json" with { type: "json" };
import worksheetsFrFr from "../../locales/fr-FR/worksheets.json" with { type: "json" };
import gamesFrFr from "../../locales/fr-FR/games.json" with { type: "json" };
import emailsFrFr from "../../locales/fr-FR/emails.json" with { type: "json" };
import seoFrFr from "../../locales/fr-FR/seo.json" with { type: "json" };
import legalFrFr from "../../locales/fr-FR/legal.json" with { type: "json" };
import teacherFrFr from "../../locales/fr-FR/teacher.json" with { type: "json" };
import schoolFrFr from "../../locales/fr-FR/school.json" with { type: "json" };
import platformFrFr from "../../locales/fr-FR/platform.json" with { type: "json" };
import copilotFrFr from "../../locales/fr-FR/copilot.json" with { type: "json" };
import commonNlNl from "../../locales/nl-NL/common.json" with { type: "json" };
import uiNlNl from "../../locales/nl-NL/ui.json" with { type: "json" };
import authNlNl from "../../locales/nl-NL/auth.json" with { type: "json" };
import validationNlNl from "../../locales/nl-NL/validation.json" with { type: "json" };
import learningNlNl from "../../locales/nl-NL/learning.json" with { type: "json" };
import reportsNlNl from "../../locales/nl-NL/reports.json" with { type: "json" };
import worksheetsNlNl from "../../locales/nl-NL/worksheets.json" with { type: "json" };
import gamesNlNl from "../../locales/nl-NL/games.json" with { type: "json" };
import emailsNlNl from "../../locales/nl-NL/emails.json" with { type: "json" };
import seoNlNl from "../../locales/nl-NL/seo.json" with { type: "json" };
import legalNlNl from "../../locales/nl-NL/legal.json" with { type: "json" };
import teacherNlNl from "../../locales/nl-NL/teacher.json" with { type: "json" };
import schoolNlNl from "../../locales/nl-NL/school.json" with { type: "json" };
import platformNlNl from "../../locales/nl-NL/platform.json" with { type: "json" };
import copilotNlNl from "../../locales/nl-NL/copilot.json" with { type: "json" };
import commonDeDe from "../../locales/de-DE/common.json" with { type: "json" };
import uiDeDe from "../../locales/de-DE/ui.json" with { type: "json" };
import authDeDe from "../../locales/de-DE/auth.json" with { type: "json" };
import validationDeDe from "../../locales/de-DE/validation.json" with { type: "json" };
import learningDeDe from "../../locales/de-DE/learning.json" with { type: "json" };
import reportsDeDe from "../../locales/de-DE/reports.json" with { type: "json" };
import worksheetsDeDe from "../../locales/de-DE/worksheets.json" with { type: "json" };
import gamesDeDe from "../../locales/de-DE/games.json" with { type: "json" };
import emailsDeDe from "../../locales/de-DE/emails.json" with { type: "json" };
import seoDeDe from "../../locales/de-DE/seo.json" with { type: "json" };
import legalDeDe from "../../locales/de-DE/legal.json" with { type: "json" };
import teacherDeDe from "../../locales/de-DE/teacher.json" with { type: "json" };
import schoolDeDe from "../../locales/de-DE/school.json" with { type: "json" };
import platformDeDe from "../../locales/de-DE/platform.json" with { type: "json" };
import copilotDeDe from "../../locales/de-DE/copilot.json" with { type: "json" };
import commonRuRu from "../../locales/ru-RU/common.json" with { type: "json" };
import uiRuRu from "../../locales/ru-RU/ui.json" with { type: "json" };
import authRuRu from "../../locales/ru-RU/auth.json" with { type: "json" };
import validationRuRu from "../../locales/ru-RU/validation.json" with { type: "json" };
import learningRuRu from "../../locales/ru-RU/learning.json" with { type: "json" };
import reportsRuRu from "../../locales/ru-RU/reports.json" with { type: "json" };
import worksheetsRuRu from "../../locales/ru-RU/worksheets.json" with { type: "json" };
import gamesRuRu from "../../locales/ru-RU/games.json" with { type: "json" };
import emailsRuRu from "../../locales/ru-RU/emails.json" with { type: "json" };
import seoRuRu from "../../locales/ru-RU/seo.json" with { type: "json" };
import legalRuRu from "../../locales/ru-RU/legal.json" with { type: "json" };
import teacherRuRu from "../../locales/ru-RU/teacher.json" with { type: "json" };
import schoolRuRu from "../../locales/ru-RU/school.json" with { type: "json" };
import platformRuRu from "../../locales/ru-RU/platform.json" with { type: "json" };
import copilotRuRu from "../../locales/ru-RU/copilot.json" with { type: "json" };
import commonPtAo from "../../locales/pt-AO/common.json" with { type: "json" };
import learningPtAo from "../../locales/pt-AO/learning.json" with { type: "json" };
import uiPtAo from "../../locales/pt-AO/ui.json" with { type: "json" };
import worksheetsPtAo from "../../locales/pt-AO/worksheets.json" with { type: "json" };
import schoolPtAo from "../../locales/pt-AO/school.json" with { type: "json" };
import validationPtAo from "../../locales/pt-AO/validation.json" with { type: "json" };
import seoPtAo from "../../locales/pt-AO/seo.json" with { type: "json" };
import commonEnNg from "../../locales/en-NG/common.json" with { type: "json" };
import uiEnNg from "../../locales/en-NG/ui.json" with { type: "json" };
import authEnNg from "../../locales/en-NG/auth.json" with { type: "json" };
import learningEnNg from "../../locales/en-NG/learning.json" with { type: "json" };
import worksheetsEnNg from "../../locales/en-NG/worksheets.json" with { type: "json" };
import seoEnNg from "../../locales/en-NG/seo.json" with { type: "json" };
import teacherEnNg from "../../locales/en-NG/teacher.json" with { type: "json" };
import schoolEnNg from "../../locales/en-NG/school.json" with { type: "json" };
import platformEnNg from "../../locales/en-NG/platform.json" with { type: "json" };
import validationEnNg from "../../locales/en-NG/validation.json" with { type: "json" };
import copilotEnNg from "../../locales/en-NG/copilot.json" with { type: "json" };
import reportsEnNg from "../../locales/en-NG/reports.json" with { type: "json" };
import commonFrCi from "../../locales/fr-CI/common.json" with { type: "json" };
import learningFrCi from "../../locales/fr-CI/learning.json" with { type: "json" };
import worksheetsFrCi from "../../locales/fr-CI/worksheets.json" with { type: "json" };
import seoFrCi from "../../locales/fr-CI/seo.json" with { type: "json" };
import schoolFrCi from "../../locales/fr-CI/school.json" with { type: "json" };
import commonDeAt from "../../locales/de-AT/common.json" with { type: "json" };
import learningDeAt from "../../locales/de-AT/learning.json" with { type: "json" };
import worksheetsDeAt from "../../locales/de-AT/worksheets.json" with { type: "json" };
import uiDeAt from "../../locales/de-AT/ui.json" with { type: "json" };
import schoolDeAt from "../../locales/de-AT/school.json" with { type: "json" };
import seoDeAt from "../../locales/de-AT/seo.json" with { type: "json" };
import validationDeAt from "../../locales/de-AT/validation.json" with { type: "json" };
import copilotDeAt from "../../locales/de-AT/copilot.json" with { type: "json" };
import commonFrCa from "../../locales/fr-CA/common.json" with { type: "json" };
import learningFrCa from "../../locales/fr-CA/learning.json" with { type: "json" };
import worksheetsFrCa from "../../locales/fr-CA/worksheets.json" with { type: "json" };
import seoFrCa from "../../locales/fr-CA/seo.json" with { type: "json" };
import schoolFrCa from "../../locales/fr-CA/school.json" with { type: "json" };
import uiFrCa from "../../locales/fr-CA/ui.json" with { type: "json" };
import authFrCa from "../../locales/fr-CA/auth.json" with { type: "json" };
import validationFrCa from "../../locales/fr-CA/validation.json" with { type: "json" };
import commonPtMz from "../../locales/pt-MZ/common.json" with { type: "json" };
import learningPtMz from "../../locales/pt-MZ/learning.json" with { type: "json" };
import uiPtMz from "../../locales/pt-MZ/ui.json" with { type: "json" };
import worksheetsPtMz from "../../locales/pt-MZ/worksheets.json" with { type: "json" };
import schoolPtMz from "../../locales/pt-MZ/school.json" with { type: "json" };
import validationPtMz from "../../locales/pt-MZ/validation.json" with { type: "json" };
import seoPtMz from "../../locales/pt-MZ/seo.json" with { type: "json" };
import authPtMz from "../../locales/pt-MZ/auth.json" with { type: "json" };
import reportsPtMz from "../../locales/pt-MZ/reports.json" with { type: "json" };
import commonEnKe from "../../locales/en-KE/common.json" with { type: "json" };
import learningEnKe from "../../locales/en-KE/learning.json" with { type: "json" };
import worksheetsEnKe from "../../locales/en-KE/worksheets.json" with { type: "json" };
import schoolEnKe from "../../locales/en-KE/school.json" with { type: "json" };
import seoEnKe from "../../locales/en-KE/seo.json" with { type: "json" };
import authEnKe from "../../locales/en-KE/auth.json" with { type: "json" };
import uiEnKe from "../../locales/en-KE/ui.json" with { type: "json" };
import reportsEnKe from "../../locales/en-KE/reports.json" with { type: "json" };
import teacherEnKe from "../../locales/en-KE/teacher.json" with { type: "json" };
import platformEnKe from "../../locales/en-KE/platform.json" with { type: "json" };
import validationEnKe from "../../locales/en-KE/validation.json" with { type: "json" };
import copilotEnKe from "../../locales/en-KE/copilot.json" with { type: "json" };
import commonDeCh from "../../locales/de-CH/common.json" with { type: "json" };
import uiDeCh from "../../locales/de-CH/ui.json" with { type: "json" };
import seoDeCh from "../../locales/de-CH/seo.json" with { type: "json" };
import learningDeCh from "../../locales/de-CH/learning.json" with { type: "json" };
import worksheetsDeCh from "../../locales/de-CH/worksheets.json" with { type: "json" };
import schoolDeCh from "../../locales/de-CH/school.json" with { type: "json" };
import reportsDeCh from "../../locales/de-CH/reports.json" with { type: "json" };
import gamesDeCh from "../../locales/de-CH/games.json" with { type: "json" };
import copilotDeCh from "../../locales/de-CH/copilot.json" with { type: "json" };
import authDeCh from "../../locales/de-CH/auth.json" with { type: "json" };
import legalDeCh from "../../locales/de-CH/legal.json" with { type: "json" };
import commonNlBe from "../../locales/nl-BE/common.json" with { type: "json" };
import learningNlBe from "../../locales/nl-BE/learning.json" with { type: "json" };
import schoolNlBe from "../../locales/nl-BE/school.json" with { type: "json" };
import seoNlBe from "../../locales/nl-BE/seo.json" with { type: "json" };
import uiNlBe from "../../locales/nl-BE/ui.json" with { type: "json" };
import worksheetsNlBe from "../../locales/nl-BE/worksheets.json" with { type: "json" };
import validationNlBe from "../../locales/nl-BE/validation.json" with { type: "json" };
import reportsNlBe from "../../locales/nl-BE/reports.json" with { type: "json" };
import authFrBe from "../../locales/fr-BE/auth.json" with { type: "json" };
import commonFrBe from "../../locales/fr-BE/common.json" with { type: "json" };
import learningFrBe from "../../locales/fr-BE/learning.json" with { type: "json" };
import schoolFrBe from "../../locales/fr-BE/school.json" with { type: "json" };
import seoFrBe from "../../locales/fr-BE/seo.json" with { type: "json" };
import uiFrBe from "../../locales/fr-BE/ui.json" with { type: "json" };
import validationFrBe from "../../locales/fr-BE/validation.json" with { type: "json" };
import worksheetsFrBe from "../../locales/fr-BE/worksheets.json" with { type: "json" };
import commonFrCh from "../../locales/fr-CH/common.json" with { type: "json" };
import learningFrCh from "../../locales/fr-CH/learning.json" with { type: "json" };
import worksheetsFrCh from "../../locales/fr-CH/worksheets.json" with { type: "json" };
import schoolFrCh from "../../locales/fr-CH/school.json" with { type: "json" };
import seoFrCh from "../../locales/fr-CH/seo.json" with { type: "json" };
import uiFrCh from "../../locales/fr-CH/ui.json" with { type: "json" };
import validationFrCh from "../../locales/fr-CH/validation.json" with { type: "json" };
import authFrCh from "../../locales/fr-CH/auth.json" with { type: "json" };
import commonItCh from "../../locales/it-CH/common.json" with { type: "json" };
import learningItCh from "../../locales/it-CH/learning.json" with { type: "json" };
import worksheetsItCh from "../../locales/it-CH/worksheets.json" with { type: "json" };
import seoItCh from "../../locales/it-CH/seo.json" with { type: "json" };
import schoolItCh from "../../locales/it-CH/school.json" with { type: "json" };
import uiItCh from "../../locales/it-CH/ui.json" with { type: "json" };
import authItCh from "../../locales/it-CH/auth.json" with { type: "json" };
import validationItCh from "../../locales/it-CH/validation.json" with { type: "json" };
import authEnIn from "../../locales/en-IN/auth.json" with { type: "json" };
import commonEnIn from "../../locales/en-IN/common.json" with { type: "json" };
import copilotEnIn from "../../locales/en-IN/copilot.json" with { type: "json" };
import learningEnIn from "../../locales/en-IN/learning.json" with { type: "json" };
import platformEnIn from "../../locales/en-IN/platform.json" with { type: "json" };
import reportsEnIn from "../../locales/en-IN/reports.json" with { type: "json" };
import schoolEnIn from "../../locales/en-IN/school.json" with { type: "json" };
import seoEnIn from "../../locales/en-IN/seo.json" with { type: "json" };
import teacherEnIn from "../../locales/en-IN/teacher.json" with { type: "json" };
import uiEnIn from "../../locales/en-IN/ui.json" with { type: "json" };
import validationEnIn from "../../locales/en-IN/validation.json" with { type: "json" };
import worksheetsEnIn from "../../locales/en-IN/worksheets.json" with { type: "json" };
import authEnGh from "../../locales/en-GH/auth.json" with { type: "json" };
import commonEnGh from "../../locales/en-GH/common.json" with { type: "json" };
import copilotEnGh from "../../locales/en-GH/copilot.json" with { type: "json" };
import learningEnGh from "../../locales/en-GH/learning.json" with { type: "json" };
import platformEnGh from "../../locales/en-GH/platform.json" with { type: "json" };
import reportsEnGh from "../../locales/en-GH/reports.json" with { type: "json" };
import schoolEnGh from "../../locales/en-GH/school.json" with { type: "json" };
import seoEnGh from "../../locales/en-GH/seo.json" with { type: "json" };
import teacherEnGh from "../../locales/en-GH/teacher.json" with { type: "json" };
import uiEnGh from "../../locales/en-GH/ui.json" with { type: "json" };
import validationEnGh from "../../locales/en-GH/validation.json" with { type: "json" };
import worksheetsEnGh from "../../locales/en-GH/worksheets.json" with { type: "json" };
import authFrSn from "../../locales/fr-SN/auth.json" with { type: "json" };
import commonFrSn from "../../locales/fr-SN/common.json" with { type: "json" };
import learningFrSn from "../../locales/fr-SN/learning.json" with { type: "json" };
import schoolFrSn from "../../locales/fr-SN/school.json" with { type: "json" };
import seoFrSn from "../../locales/fr-SN/seo.json" with { type: "json" };
import uiFrSn from "../../locales/fr-SN/ui.json" with { type: "json" };
import validationFrSn from "../../locales/fr-SN/validation.json" with { type: "json" };
import worksheetsFrSn from "../../locales/fr-SN/worksheets.json" with { type: "json" };
import authFrCd from "../../locales/fr-CD/auth.json" with { type: "json" };
import commonFrCd from "../../locales/fr-CD/common.json" with { type: "json" };
import learningFrCd from "../../locales/fr-CD/learning.json" with { type: "json" };
import schoolFrCd from "../../locales/fr-CD/school.json" with { type: "json" };
import seoFrCd from "../../locales/fr-CD/seo.json" with { type: "json" };
import uiFrCd from "../../locales/fr-CD/ui.json" with { type: "json" };
import validationFrCd from "../../locales/fr-CD/validation.json" with { type: "json" };
import worksheetsFrCd from "../../locales/fr-CD/worksheets.json" with { type: "json" };
import commonEnAu from "../../locales/en-AU/common.json" with { type: "json" };
import uiEnAu from "../../locales/en-AU/ui.json" with { type: "json" };
import authEnAu from "../../locales/en-AU/auth.json" with { type: "json" };
import learningEnAu from "../../locales/en-AU/learning.json" with { type: "json" };
import worksheetsEnAu from "../../locales/en-AU/worksheets.json" with { type: "json" };
import seoEnAu from "../../locales/en-AU/seo.json" with { type: "json" };
import teacherEnAu from "../../locales/en-AU/teacher.json" with { type: "json" };
import schoolEnAu from "../../locales/en-AU/school.json" with { type: "json" };
import platformEnAu from "../../locales/en-AU/platform.json" with { type: "json" };
import validationEnAu from "../../locales/en-AU/validation.json" with { type: "json" };
import copilotEnAu from "../../locales/en-AU/copilot.json" with { type: "json" };
import commonEnNz from "../../locales/en-NZ/common.json" with { type: "json" };
import uiEnNz from "../../locales/en-NZ/ui.json" with { type: "json" };
import authEnNz from "../../locales/en-NZ/auth.json" with { type: "json" };
import learningEnNz from "../../locales/en-NZ/learning.json" with { type: "json" };
import worksheetsEnNz from "../../locales/en-NZ/worksheets.json" with { type: "json" };
import seoEnNz from "../../locales/en-NZ/seo.json" with { type: "json" };
import teacherEnNz from "../../locales/en-NZ/teacher.json" with { type: "json" };
import schoolEnNz from "../../locales/en-NZ/school.json" with { type: "json" };
import platformEnNz from "../../locales/en-NZ/platform.json" with { type: "json" };
import validationEnNz from "../../locales/en-NZ/validation.json" with { type: "json" };
import copilotEnNz from "../../locales/en-NZ/copilot.json" with { type: "json" };
import commonEnIe from "../../locales/en-IE/common.json" with { type: "json" };
import uiEnIe from "../../locales/en-IE/ui.json" with { type: "json" };
import authEnIe from "../../locales/en-IE/auth.json" with { type: "json" };
import learningEnIe from "../../locales/en-IE/learning.json" with { type: "json" };
import worksheetsEnIe from "../../locales/en-IE/worksheets.json" with { type: "json" };
import seoEnIe from "../../locales/en-IE/seo.json" with { type: "json" };
import teacherEnIe from "../../locales/en-IE/teacher.json" with { type: "json" };
import schoolEnIe from "../../locales/en-IE/school.json" with { type: "json" };
import platformEnIe from "../../locales/en-IE/platform.json" with { type: "json" };
import validationEnIe from "../../locales/en-IE/validation.json" with { type: "json" };
import copilotEnIe from "../../locales/en-IE/copilot.json" with { type: "json" };
import commonEnGb from "../../locales/en-GB/common.json" with { type: "json" };
import uiEnGb from "../../locales/en-GB/ui.json" with { type: "json" };
import authEnGb from "../../locales/en-GB/auth.json" with { type: "json" };
import learningEnGb from "../../locales/en-GB/learning.json" with { type: "json" };
import worksheetsEnGb from "../../locales/en-GB/worksheets.json" with { type: "json" };
import seoEnGb from "../../locales/en-GB/seo.json" with { type: "json" };
import teacherEnGb from "../../locales/en-GB/teacher.json" with { type: "json" };
import schoolEnGb from "../../locales/en-GB/school.json" with { type: "json" };
import platformEnGb from "../../locales/en-GB/platform.json" with { type: "json" };
import validationEnGb from "../../locales/en-GB/validation.json" with { type: "json" };
import copilotEnGb from "../../locales/en-GB/copilot.json" with { type: "json" };
import reportsEnGb from "../../locales/en-GB/reports.json" with { type: "json" };
import uiEnCa from "../../locales/en-CA/ui.json" with { type: "json" };
import learningEnCa from "../../locales/en-CA/learning.json" with { type: "json" };
import worksheetsEnCa from "../../locales/en-CA/worksheets.json" with { type: "json" };
import commonEnSg from "../../locales/en-SG/common.json" with { type: "json" };
import uiEnSg from "../../locales/en-SG/ui.json" with { type: "json" };
import authEnSg from "../../locales/en-SG/auth.json" with { type: "json" };
import learningEnSg from "../../locales/en-SG/learning.json" with { type: "json" };
import worksheetsEnSg from "../../locales/en-SG/worksheets.json" with { type: "json" };
import seoEnSg from "../../locales/en-SG/seo.json" with { type: "json" };
import teacherEnSg from "../../locales/en-SG/teacher.json" with { type: "json" };
import schoolEnSg from "../../locales/en-SG/school.json" with { type: "json" };
import platformEnSg from "../../locales/en-SG/platform.json" with { type: "json" };
import validationEnSg from "../../locales/en-SG/validation.json" with { type: "json" };
import copilotEnSg from "../../locales/en-SG/copilot.json" with { type: "json" };
import commonEnZa from "../../locales/en-ZA/common.json" with { type: "json" };
import uiEnZa from "../../locales/en-ZA/ui.json" with { type: "json" };
import authEnZa from "../../locales/en-ZA/auth.json" with { type: "json" };
import learningEnZa from "../../locales/en-ZA/learning.json" with { type: "json" };
import worksheetsEnZa from "../../locales/en-ZA/worksheets.json" with { type: "json" };
import seoEnZa from "../../locales/en-ZA/seo.json" with { type: "json" };
import teacherEnZa from "../../locales/en-ZA/teacher.json" with { type: "json" };
import platformEnZa from "../../locales/en-ZA/platform.json" with { type: "json" };
import validationEnZa from "../../locales/en-ZA/validation.json" with { type: "json" };
import copilotEnZa from "../../locales/en-ZA/copilot.json" with { type: "json" };
import commonEnSct from "../../locales/en-SCT/common.json" with { type: "json" };
import uiEnSct from "../../locales/en-SCT/ui.json" with { type: "json" };
import learningEnSct from "../../locales/en-SCT/learning.json" with { type: "json" };
import worksheetsEnSct from "../../locales/en-SCT/worksheets.json" with { type: "json" };
import seoEnSct from "../../locales/en-SCT/seo.json" with { type: "json" };
import schoolEnSct from "../../locales/en-SCT/school.json" with { type: "json" };
import validationEnSct from "../../locales/en-SCT/validation.json" with { type: "json" };
import copilotEnSct from "../../locales/en-SCT/copilot.json" with { type: "json" };
import commonEnNir from "../../locales/en-NIR/common.json" with { type: "json" };
import uiEnNir from "../../locales/en-NIR/ui.json" with { type: "json" };
import learningEnNir from "../../locales/en-NIR/learning.json" with { type: "json" };
import worksheetsEnNir from "../../locales/en-NIR/worksheets.json" with { type: "json" };
import seoEnNir from "../../locales/en-NIR/seo.json" with { type: "json" };
import schoolEnNir from "../../locales/en-NIR/school.json" with { type: "json" };
import validationEnNir from "../../locales/en-NIR/validation.json" with { type: "json" };
import copilotEnNir from "../../locales/en-NIR/copilot.json" with { type: "json" };
import uiEnPh from "../../locales/en-PH/ui.json" with { type: "json" };
import teacherEnPh from "../../locales/en-PH/teacher.json" with { type: "json" };
import platformEnPh from "../../locales/en-PH/platform.json" with { type: "json" };
import validationEnPh from "../../locales/en-PH/validation.json" with { type: "json" };
import { DEFAULT_LOCALE, FALLBACK_LOCALE, resolveLocaleDefinition } from "./locale-registry.js";
import { getLocaleFallbackChain } from "./locale-resolution.js";
import { deepMergeJson } from "./deep-merge.js";

export const I18N_NAMESPACES = Object.freeze([
  "common",
  "ui",
  "auth",
  "learning",
  "reports",
  "emails",
  "seo",
  "legal",
  "worksheets",
  "games",
  "validation",
  "teacher",
  "school",
  "platform",
  "copilot",
]);

/** @type {Record<string, Record<string, unknown>>} */
const EN_BUNDLE = Object.freeze({
  common: commonEn,
  ui: uiEn,
  auth: authEn,
  learning: learningEn,
  reports: reportsEn,
  emails: emailsEn,
  seo: seoEn,
  legal: legalEn,
  worksheets: worksheetsEn,
  games: gamesEn,
  validation: validationEn,
  teacher: teacherEn,
  school: schoolEn,
  platform: platformEn,
  copilot: copilotEn,
});

/**
 * Bundles keyed by canonical locale id.
 * Pseudo locales inherit from en until dedicated bundles exist.
 * @type {Record<string, Record<string, Record<string, unknown>>>}
 */
const LOCALE_BUNDLES = {
  en: EN_BUNDLE,
  "en-XA": EN_BUNDLE,
  "ar-XB": EN_BUNDLE,
  "es-419": Object.freeze({
    common: commonEs419,
    ui: uiEs419,
    auth: authEs419,
    validation: validationEs419,
    learning: learningEs419,
    reports: reportsEs419,
    worksheets: worksheetsEs419,
    games: gamesEs419,
    emails: emailsEs419,
    seo: seoEs419,
    legal: legalEs419,
    teacher: teacherEs419,
    school: schoolEs419,
    platform: platformEs419,
    copilot: copilotEs419,
  }),
  "es-MX": Object.freeze({
    common: commonEsMx,
    ui: uiEsMx,
    learning: learningEsMx,
    worksheets: worksheetsEsMx,
  }),
  "es-CO": Object.freeze({
    common: commonEsCo,
    ui: uiEsCo,
    learning: learningEsCo,
    worksheets: worksheetsEsCo,
    seo: seoEsCo,
    teacher: teacherEsCo,
  }),
  "es-AR": Object.freeze({
    common: commonEsAr,
    ui: uiEsAr,
    learning: learningEsAr,
    worksheets: worksheetsEsAr,
    auth: authEsAr,
    validation: validationEsAr,
    reports: reportsEsAr,
    emails: emailsEsAr,
    seo: seoEsAr,
    games: gamesEsAr,
    copilot: copilotEsAr,
  }),
  "es-PE": Object.freeze({
    common: commonEsPe,
    ui: uiEsPe,
    learning: learningEsPe,
    worksheets: worksheetsEsPe,
    seo: seoEsPe,
  }),
  "es-CL": Object.freeze({
    common: commonEsCl,
    ui: uiEsCl,
    learning: learningEsCl,
    worksheets: worksheetsEsCl,
    seo: seoEsCl,
    teacher: teacherEsCl,
  }),
  "es-EC": Object.freeze({
    common: commonEsEc,
    ui: uiEsEc,
    learning: learningEsEc,
    worksheets: worksheetsEsEc,
    seo: seoEsEc,
    teacher: teacherEsEc,
  }),
  "es-GT": Object.freeze({
    common: commonEsGt,
    ui: uiEsGt,
    learning: learningEsGt,
    worksheets: worksheetsEsGt,
    seo: seoEsGt,
  }),
  "es-DO": Object.freeze({
    common: commonEsDo,
    ui: uiEsDo,
    learning: learningEsDo,
    worksheets: worksheetsEsDo,
    seo: seoEsDo,
    teacher: teacherEsDo,
  }),
  "es-VE": Object.freeze({
    common: commonEsVe,
    ui: uiEsVe,
    learning: learningEsVe,
    worksheets: worksheetsEsVe,
    teacher: teacherEsVe,
  }),
  "es-BO": Object.freeze({
    common: commonEsBo,
    ui: uiEsBo,
    learning: learningEsBo,
    worksheets: worksheetsEsBo,
    seo: seoEsBo,
  }),
  "es-HN": Object.freeze({
    common: commonEsHn,
    ui: uiEsHn,
    learning: learningEsHn,
    worksheets: worksheetsEsHn,
    teacher: teacherEsHn,
  }),
  "es-SV": Object.freeze({
    common: commonEsSv,
    ui: uiEsSv,
    learning: learningEsSv,
    worksheets: worksheetsEsSv,
    seo: seoEsSv,
    teacher: teacherEsSv,
  }),
  "es-NI": Object.freeze({
    common: commonEsNi,
    ui: uiEsNi,
    learning: learningEsNi,
    worksheets: worksheetsEsNi,
    seo: seoEsNi,
    teacher: teacherEsNi,
  }),
  "es-PY": Object.freeze({
    common: commonEsPy,
    ui: uiEsPy,
    learning: learningEsPy,
    worksheets: worksheetsEsPy,
    seo: seoEsPy,
    teacher: teacherEsPy,
  }),
  "es-CR": Object.freeze({
    common: commonEsCr,
    ui: uiEsCr,
    learning: learningEsCr,
    worksheets: worksheetsEsCr,
    teacher: teacherEsCr,
  }),
  "es-PA": Object.freeze({
    common: commonEsPa,
    ui: uiEsPa,
    learning: learningEsPa,
    worksheets: worksheetsEsPa,
    seo: seoEsPa,
    teacher: teacherEsPa,
  }),
  "es-UY": Object.freeze({
    common: commonEsUy,
    ui: uiEsUy,
    learning: learningEsUy,
    worksheets: worksheetsEsUy,
    seo: seoEsUy,
    teacher: teacherEsUy,
  }),
  "es-CU": Object.freeze({
    common: commonEsCu,
    ui: uiEsCu,
    learning: learningEsCu,
    worksheets: worksheetsEsCu,
    seo: seoEsCu,
    teacher: teacherEsCu,
  }),
  "es-PR": Object.freeze({
    common: commonEsPr,
    ui: uiEsPr,
    learning: learningEsPr,
    worksheets: worksheetsEsPr,
    seo: seoEsPr,
    teacher: teacherEsPr,
  }),
  "es-ES": Object.freeze({
    common: commonEsEs,
    ui: uiEsEs,
    learning: learningEsEs,
    worksheets: worksheetsEsEs,
    seo: seoEsEs,
    teacher: teacherEsEs,
    school: schoolEsEs,
    validation: validationEsEs,
    copilot: copilotEsEs,
  }),
  "pt-BR": Object.freeze({
    common: commonPtBr,
    ui: uiPtBr,
    auth: authPtBr,
    validation: validationPtBr,
    learning: learningPtBr,
    reports: reportsPtBr,
    worksheets: worksheetsPtBr,
    games: gamesPtBr,
    emails: emailsPtBr,
    seo: seoPtBr,
    legal: legalPtBr,
    teacher: teacherPtBr,
    school: schoolPtBr,
    platform: platformPtBr,
    copilot: copilotPtBr,
  }),
  "pt-PT": Object.freeze({
    common: commonPtPt,
    ui: uiPtPt,
    auth: authPtPt,
    validation: validationPtPt,
    learning: learningPtPt,
    reports: reportsPtPt,
    worksheets: worksheetsPtPt,
    games: gamesPtPt,
    emails: emailsPtPt,
    seo: seoPtPt,
    legal: legalPtPt,
    teacher: teacherPtPt,
    school: schoolPtPt,
    platform: platformPtPt,
    copilot: copilotPtPt,
  }),
  "it-IT": Object.freeze({
    common: commonItIt,
    ui: uiItIt,
    auth: authItIt,
    validation: validationItIt,
    learning: learningItIt,
    reports: reportsItIt,
    worksheets: worksheetsItIt,
    games: gamesItIt,
    emails: emailsItIt,
    seo: seoItIt,
    legal: legalItIt,
    teacher: teacherItIt,
    school: schoolItIt,
    platform: platformItIt,
    copilot: copilotItIt,
  }),
  "fr-FR": Object.freeze({
    common: commonFrFr,
    ui: uiFrFr,
    auth: authFrFr,
    validation: validationFrFr,
    learning: learningFrFr,
    reports: reportsFrFr,
    worksheets: worksheetsFrFr,
    games: gamesFrFr,
    emails: emailsFrFr,
    seo: seoFrFr,
    legal: legalFrFr,
    teacher: teacherFrFr,
    school: schoolFrFr,
    platform: platformFrFr,
    copilot: copilotFrFr,
  }),
  "nl-NL": Object.freeze({
    common: commonNlNl,
    ui: uiNlNl,
    auth: authNlNl,
    validation: validationNlNl,
    learning: learningNlNl,
    reports: reportsNlNl,
    worksheets: worksheetsNlNl,
    games: gamesNlNl,
    emails: emailsNlNl,
    seo: seoNlNl,
    legal: legalNlNl,
    teacher: teacherNlNl,
    school: schoolNlNl,
    platform: platformNlNl,
    copilot: copilotNlNl,
  }),
  "de-DE": Object.freeze({
    common: commonDeDe,
    ui: uiDeDe,
    auth: authDeDe,
    validation: validationDeDe,
    learning: learningDeDe,
    reports: reportsDeDe,
    worksheets: worksheetsDeDe,
    games: gamesDeDe,
    emails: emailsDeDe,
    seo: seoDeDe,
    legal: legalDeDe,
    teacher: teacherDeDe,
    school: schoolDeDe,
    platform: platformDeDe,
    copilot: copilotDeDe,
  }),
  "ru-RU": Object.freeze({
    common: commonRuRu,
    ui: uiRuRu,
    auth: authRuRu,
    validation: validationRuRu,
    learning: learningRuRu,
    reports: reportsRuRu,
    worksheets: worksheetsRuRu,
    games: gamesRuRu,
    emails: emailsRuRu,
    seo: seoRuRu,
    legal: legalRuRu,
    teacher: teacherRuRu,
    school: schoolRuRu,
    platform: platformRuRu,
    copilot: copilotRuRu,
  }),
  "pt-AO": Object.freeze({
    common: commonPtAo,
    learning: learningPtAo,
    ui: uiPtAo,
    worksheets: worksheetsPtAo,
    school: schoolPtAo,
    validation: validationPtAo,
    seo: seoPtAo,
  }),
  "en-NG": Object.freeze({
    common: commonEnNg,
    ui: uiEnNg,
    auth: authEnNg,
    learning: learningEnNg,
    worksheets: worksheetsEnNg,
    seo: seoEnNg,
    teacher: teacherEnNg,
    school: schoolEnNg,
    platform: platformEnNg,
    validation: validationEnNg,
    copilot: copilotEnNg,
    reports: reportsEnNg,
  }),
  "fr-CI": Object.freeze({
    common: commonFrCi,
    learning: learningFrCi,
    worksheets: worksheetsFrCi,
    seo: seoFrCi,
    school: schoolFrCi,
  }),
  "de-AT": Object.freeze({
    common: commonDeAt,
    learning: learningDeAt,
    worksheets: worksheetsDeAt,
    ui: uiDeAt,
    school: schoolDeAt,
    seo: seoDeAt,
    validation: validationDeAt,
    copilot: copilotDeAt,
  }),
  "fr-CA": Object.freeze({
    common: commonFrCa,
    learning: learningFrCa,
    worksheets: worksheetsFrCa,
    seo: seoFrCa,
    school: schoolFrCa,
    ui: uiFrCa,
    auth: authFrCa,
    validation: validationFrCa,
  }),
  "pt-MZ": Object.freeze({
    common: commonPtMz,
    learning: learningPtMz,
    ui: uiPtMz,
    worksheets: worksheetsPtMz,
    school: schoolPtMz,
    validation: validationPtMz,
    seo: seoPtMz,
    auth: authPtMz,
    reports: reportsPtMz,
  }),
  "en-KE": Object.freeze({
    common: commonEnKe,
    learning: learningEnKe,
    worksheets: worksheetsEnKe,
    school: schoolEnKe,
    seo: seoEnKe,
    auth: authEnKe,
    ui: uiEnKe,
    reports: reportsEnKe,
    teacher: teacherEnKe,
    platform: platformEnKe,
    validation: validationEnKe,
    copilot: copilotEnKe,
  }),
  "de-CH": Object.freeze({
    common: commonDeCh,
    ui: uiDeCh,
    seo: seoDeCh,
    learning: learningDeCh,
    worksheets: worksheetsDeCh,
    school: schoolDeCh,
    reports: reportsDeCh,
    games: gamesDeCh,
    copilot: copilotDeCh,
    auth: authDeCh,
    legal: legalDeCh,
  }),
  "nl-BE": Object.freeze({
    common: commonNlBe,
    learning: learningNlBe,
    school: schoolNlBe,
    seo: seoNlBe,
    ui: uiNlBe,
    worksheets: worksheetsNlBe,
    validation: validationNlBe,
    reports: reportsNlBe,
  }),
  "fr-BE": Object.freeze({
    auth: authFrBe,
    common: commonFrBe,
    learning: learningFrBe,
    school: schoolFrBe,
    seo: seoFrBe,
    ui: uiFrBe,
    validation: validationFrBe,
    worksheets: worksheetsFrBe,
  }),
  "fr-CH": Object.freeze({
    common: commonFrCh,
    learning: learningFrCh,
    worksheets: worksheetsFrCh,
    school: schoolFrCh,
    seo: seoFrCh,
    ui: uiFrCh,
    validation: validationFrCh,
    auth: authFrCh,
  }),
  "it-CH": Object.freeze({
    common: commonItCh,
    learning: learningItCh,
    worksheets: worksheetsItCh,
    seo: seoItCh,
    school: schoolItCh,
    ui: uiItCh,
    auth: authItCh,
    validation: validationItCh,
  }),
  "en-IN": Object.freeze({
    auth: authEnIn,
    common: commonEnIn,
    copilot: copilotEnIn,
    learning: learningEnIn,
    platform: platformEnIn,
    reports: reportsEnIn,
    school: schoolEnIn,
    seo: seoEnIn,
    teacher: teacherEnIn,
    ui: uiEnIn,
    validation: validationEnIn,
    worksheets: worksheetsEnIn,
  }),
  "en-GH": Object.freeze({
    auth: authEnGh,
    common: commonEnGh,
    copilot: copilotEnGh,
    learning: learningEnGh,
    platform: platformEnGh,
    reports: reportsEnGh,
    school: schoolEnGh,
    seo: seoEnGh,
    teacher: teacherEnGh,
    ui: uiEnGh,
    validation: validationEnGh,
    worksheets: worksheetsEnGh,
  }),
  "fr-SN": Object.freeze({
    auth: authFrSn,
    common: commonFrSn,
    learning: learningFrSn,
    school: schoolFrSn,
    seo: seoFrSn,
    ui: uiFrSn,
    validation: validationFrSn,
    worksheets: worksheetsFrSn,
  }),
  "fr-CD": Object.freeze({
    auth: authFrCd,
    common: commonFrCd,
    learning: learningFrCd,
    school: schoolFrCd,
    seo: seoFrCd,
    ui: uiFrCd,
    validation: validationFrCd,
    worksheets: worksheetsFrCd,
  }),
  "en-AU": Object.freeze({
    common: commonEnAu,
    ui: uiEnAu,
    auth: authEnAu,
    learning: learningEnAu,
    worksheets: worksheetsEnAu,
    seo: seoEnAu,
    teacher: teacherEnAu,
    school: schoolEnAu,
    platform: platformEnAu,
    validation: validationEnAu,
    copilot: copilotEnAu,
  }),
  "en-NZ": Object.freeze({
    common: commonEnNz,
    ui: uiEnNz,
    auth: authEnNz,
    learning: learningEnNz,
    worksheets: worksheetsEnNz,
    seo: seoEnNz,
    teacher: teacherEnNz,
    school: schoolEnNz,
    platform: platformEnNz,
    validation: validationEnNz,
    copilot: copilotEnNz,
  }),
  "en-IE": Object.freeze({
    common: commonEnIe,
    ui: uiEnIe,
    auth: authEnIe,
    learning: learningEnIe,
    worksheets: worksheetsEnIe,
    seo: seoEnIe,
    teacher: teacherEnIe,
    school: schoolEnIe,
    platform: platformEnIe,
    validation: validationEnIe,
    copilot: copilotEnIe,
  }),
  "en-GB": Object.freeze({
    common: commonEnGb,
    ui: uiEnGb,
    auth: authEnGb,
    learning: learningEnGb,
    worksheets: worksheetsEnGb,
    seo: seoEnGb,
    teacher: teacherEnGb,
    school: schoolEnGb,
    platform: platformEnGb,
    validation: validationEnGb,
    copilot: copilotEnGb,
    reports: reportsEnGb,
  }),
  "en-CA": Object.freeze({
    ui: uiEnCa,
    learning: learningEnCa,
    worksheets: worksheetsEnCa,
  }),
  "en-SG": Object.freeze({
    common: commonEnSg,
    ui: uiEnSg,
    auth: authEnSg,
    learning: learningEnSg,
    worksheets: worksheetsEnSg,
    seo: seoEnSg,
    teacher: teacherEnSg,
    school: schoolEnSg,
    platform: platformEnSg,
    validation: validationEnSg,
    copilot: copilotEnSg,
  }),
  "en-ZA": Object.freeze({
    common: commonEnZa,
    ui: uiEnZa,
    auth: authEnZa,
    learning: learningEnZa,
    worksheets: worksheetsEnZa,
    seo: seoEnZa,
    teacher: teacherEnZa,
    platform: platformEnZa,
    validation: validationEnZa,
    copilot: copilotEnZa,
  }),
  // en-WLS: zero-content locale — no namespace overlays; inherits en-GB → en.
  "en-WLS": Object.freeze({}),
  "en-SCT": Object.freeze({
    common: commonEnSct,
    ui: uiEnSct,
    learning: learningEnSct,
    worksheets: worksheetsEnSct,
    seo: seoEnSct,
    school: schoolEnSct,
    validation: validationEnSct,
    copilot: copilotEnSct,
  }),
  "en-NIR": Object.freeze({
    common: commonEnNir,
    ui: uiEnNir,
    learning: learningEnNir,
    worksheets: worksheetsEnNir,
    seo: seoEnNir,
    school: schoolEnNir,
    validation: validationEnNir,
    copilot: copilotEnNir,
  }),
  "en-PH": Object.freeze({
    ui: uiEnPh,
    teacher: teacherEnPh,
    platform: platformEnPh,
    validation: validationEnPh,
  }),
};

/** @type {Map<string, Record<string, Record<string, unknown>>>} */
const bundleCache = new Map();

/** @type {Set<string>} */
const warnedMissingLocales = new Set();

/**
 * @param {string} locale
 * @returns {Record<string, Record<string, unknown>>}
 */
export function loadLocaleBundles(locale) {
  const def = resolveLocaleDefinition(locale);
  const id = def.id;

  if (bundleCache.has(id)) {
    return bundleCache.get(id);
  }

  const chain = getLocaleFallbackChain(id);
  /** @type {Record<string, Record<string, unknown>>} */
  const merged = {};

  for (const ns of I18N_NAMESPACES) {
    merged[ns] = {};
  }

  const sources = [...chain].reverse();
  for (const loc of sources) {
    const bundle = LOCALE_BUNDLES[loc];
    if (!bundle) {
      warnMissingLocaleBundle(loc, id);
      continue;
    }
    for (const ns of I18N_NAMESPACES) {
      if (bundle[ns]) {
        merged[ns] = /** @type {Record<string, unknown>} */ (
          deepMergeJson(merged[ns], bundle[ns])
        );
      }
    }
  }

  const frozen = Object.freeze(
    Object.fromEntries(I18N_NAMESPACES.map((ns) => [ns, Object.freeze(merged[ns] || {})]))
  );
  bundleCache.set(id, frozen);
  return frozen;
}

/**
 * @param {string} missingLoc
 * @param {string} requestedLoc
 */
function warnMissingLocaleBundle(missingLoc, requestedLoc) {
  const key = `${requestedLoc}:${missingLoc}`;
  if (warnedMissingLocales.has(key)) return;
  warnedMissingLocales.add(key);
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] no bundle for locale "${missingLoc}" while resolving "${requestedLoc}"`);
  }
}

/**
 * Register additional locale bundles at runtime (tests / future locales).
 * @param {string} localeId
 * @param {Record<string, Record<string, unknown>>} bundle
 */
export function registerLocaleBundle(localeId, bundle) {
  LOCALE_BUNDLES[localeId] = bundle;
  bundleCache.delete(localeId);
}

/**
 * @param {Record<string, Record<string, unknown>>} bundles
 * @param {string} key
 * @returns {string|null}
 */
export function lookupMessage(bundles, key) {
  const raw = String(key || "").trim();
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length < 2) {
    const v = dig(bundles.common, [raw]);
    return typeof v === "string" ? v : null;
  }

  const ns = parts[0];
  if (bundles[ns]) {
    const v = dig(bundles[ns], parts.slice(1));
    if (typeof v === "string") return v;
  }

  for (const name of I18N_NAMESPACES) {
    const v = dig(bundles[name], parts);
    if (typeof v === "string") return v;
  }
  return null;
}

/**
 * @param {unknown} obj
 * @param {string[]} path
 */
function dig(obj, path) {
  let cur = obj;
  for (const p of path) {
    if (!cur || typeof cur !== "object") return null;
    cur = /** @type {Record<string, unknown>} */ (cur)[p];
  }
  return cur;
}

export function getFallbackBundles() {
  return loadLocaleBundles(FALLBACK_LOCALE);
}

/**
 * Collect missing keys for a locale vs reference locale (default en).
 * @param {string} localeId
 * @param {string} [referenceLocale]
 * @returns {string[]}
 */
export function collectMissingKeys(localeId, referenceLocale = DEFAULT_LOCALE) {
  const ref = loadLocaleBundles(referenceLocale);
  const target = loadLocaleBundles(localeId);
  /** @type {string[]} */
  const missing = [];

  for (const ns of I18N_NAMESPACES) {
    collectLeafKeys(ref[ns] || {}, [ns], target[ns] || {}, missing);
  }
  return missing.sort();
}

/**
 * @param {Record<string, unknown>} refObj
 * @param {string[]} prefix
 * @param {Record<string, unknown>} targetObj
 * @param {string[]} missing
 */
function collectLeafKeys(refObj, prefix, targetObj, missing) {
  for (const [k, v] of Object.entries(refObj)) {
    const path = [...prefix, k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      collectLeafKeys(
        /** @type {Record<string, unknown>} */ (v),
        path,
        /** @type {Record<string, unknown>} */ (targetObj[k] || {}),
        missing
      );
    } else if (typeof v === "string") {
      const tv = dig(targetObj, [k]);
      if (typeof tv !== "string" || !tv.trim()) {
        missing.push(path.join("."));
      }
    }
  }
}

/**
 * Reset loader cache (tests).
 */
export function resetLocaleBundleCache() {
  bundleCache.clear();
  warnedMissingLocales.clear();
}
