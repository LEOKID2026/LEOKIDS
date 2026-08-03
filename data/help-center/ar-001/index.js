import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_AR_001 = {
  "parents": {
    "key": "parents",
    "title": "دليل للآباء والأمهات",
    "description": "قم بالتسجيل وإدارة الأطفال والتقارير وأدوات الوالدين.",
    "href": "/help/parents",
    "emoji": "👨‍👩‍👧",
    "hubGradientKey": "parents"
  },
  "students": {
    "key": "students",
    "title": "دليل للطلاب",
    "description": "تسجيل الدخول والممارسة والمهام والألعاب - بلغة بسيطة.",
    "href": "/help/students",
    "emoji": "🎒",
    "hubGradientKey": "students"
  },
  "parent-report": {
    "key": "parent-report",
    "title": "وأوضح تقرير الوالدين",
    "description": "كيفية قراءة كل جزء من التقرير – خطوة بخطوة.",
    "href": "/help/parent-report",
    "emoji": "📊",
    "hubGradientKey": "parent-report"
  },
  "subjects": {
    "key": "subjects",
    "title": "أدلة الموضوع",
    "description": "ما يجب التدرب عليه في كل موضوع وكيف.",
    "href": "/help/subjects",
    "emoji": "📚",
    "hubGradientKey": "subjects"
  }
};

export const BY_SECTION_AR_001 = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_AR_001 = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
