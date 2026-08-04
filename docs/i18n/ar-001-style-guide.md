# ar-001 style guide

**Locale:** `ar-001` · **Script:** Arabic (MSA) · **Direction:** RTL · **Digits:** 0–9 (Western)

## Voice

- Modern Standard Arabic — formal but child-friendly
- Country-neutral — no Egypt/Levant/Gulf dialect markers
- No Israeli Hebrew loan translations
- No machine-translation calques; edit for natural Arabic

## Brand

The brand is always **Leo Kids** (Latin). Never translate or transliterate to أطفال ليو / ليو كيدز / أدلة ليو للأطفال.

## Terminology locks

| English | ar-001 |
|---------|--------|
| Grade / year level | الصف |
| Class group | الفصل |
| Subject | مادة |
| Topic | موضوع |
| Student | تلميذ / تلميذة |
| Students | تلاميذ |
| Parent/guardian | ولي الأمر |
| Parents/guardians | أولياء الأمور |
| Teacher | معلّم / معلّمة |
| School | مدرسة |
| Activity | نشاط |
| Worksheet | ورقة عمل |
| Report | تقرير |
| Finding | ملاحظة |
| Strength / Strengths | نقطة قوة / نقاط قوة |
| PIN | رمز PIN |
| Math | الرياضيات |
| Geometry | الهندسة |
| English (subject) | الإنجليزية |

### Forbidden swaps

- Subject ≠ موضوع / عنوان
- Topic ≠ عنوان
- Class group ≠ الصف
- Parent ≠ الوالد / الوالدين / الآباء / كوالد (UI must use ولي الأمر / أولياء الأمور; kid UI: اطلب من ولي الأمر — not والديك)
- Powers (math) ≠ السلطات → القوى
- Division (math) ≠ التقسيم → القسمة
- Square/triangle/circle area ≠ منطقة → مساحة
- Rotation (geometry) ≠ تناوب → دوران
- Heights (geometry) ≠ مرتفعات → الارتفاعات

## Mixed direction

- UI chrome: RTL
- English learning Q/A: LTR in scoped islands
- Math variables and expressions: LTR (`MathExpression`, `.leo-ltr-island`)
- Email, URL, code, ID: LTR scoped

## Forbidden in chrome

English UI strings, Hebrew, country-specific Arabic dialects, Israeli curriculum terms, Arabic-Indic digits (`٠١٢٣٤٥٦٧٨٩`).

## Numbers

Always Western digits `0–9`.
