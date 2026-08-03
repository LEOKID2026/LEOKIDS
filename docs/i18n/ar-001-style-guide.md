# ar-001 style guide

**Locale:** `ar-001` · **Script:** Arabic (MSA) · **Direction:** RTL · **Digits:** 0–9 (Western)

## Voice

- Modern Standard Arabic — formal but child-friendly
- Country-neutral — no Egypt/Levant/Gulf dialect markers
- No Israeli Hebrew loan translations

## Terminology locks

| English | ar-001 |
|---------|--------|
| Grade (school level) | الصف |
| Class group | مجموعة صفّية |
| Parent | ولي الأمر |
| Worksheet | ورقة عمل |
| Answer key | مفتاح الإجابات |
| Math | الرياضيات |
| Geometry | الهندسة |
| English (subject) | الإنجليزية |

## Mixed direction

- UI chrome: RTL
- English learning Q/A: LTR in scoped islands
- Math variables and expressions: LTR (`MathExpression`, `.leo-ltr-island`)
- Email, URL, code, ID: LTR scoped

## Forbidden in chrome

English UI strings, Hebrew, country-specific Arabic dialects, Israeli curriculum terms.

## Numbers

Always Western digits `0–9`. No Eastern Arabic numerals in user-facing copy.

## Brand

`Leo Kids` stays Latin. Tagline: **التعلّم كاللعب**.
