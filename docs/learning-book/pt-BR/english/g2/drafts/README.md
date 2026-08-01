# Livro de aprendizagem de inglês da 2ª série - Rascunhos

**Status:** Rascunho do conteúdo — **15/15** páginas. Não aprovado pelo proprietário. Nenhum tempo de execução conectado.
**Data:** junho de 2026
**Pasta:** `docs/learning-book/english/g2/drafts/`
**Título do livro:** ספר אנגלית — כיתה ב׳

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/ENGLISH_GRADE_2_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **15/15** |
| Pacote de revisão | ✅ `docs/learning-book/ENGLISH_GRADE_2_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-english-g2-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/english-g2-draft-manifest.mjs` |
| Tempo de execução/registro/rotas | ❌ Não criado |

---

## Nomenclatura

- Disciplina voltada para crianças: **אנגלית**
- IDs internos: `english:g2:{pageId}`, `subject: english`

---

## Lote A — continuação do vocabulário (7)

| Arquivo | Título do rascunho |
|------|-------------|
| `vocab_colors.md` | צבעים — שימוש במשפט |
| `vocab_numbers.md` | מספרים — עד 20 |
| `vocab_family.md` | משפחה — מילים במשפט |
| `vocab_animals.md` | חיות — שמות ומשפטים |
| `vocab_emotions.md` | רגשות — במשפט |
| `vocab_actions.md` | פעולות — פועל במשפט |
| `vocab_school.md` | בית ספר — חפצים במשפט |

## Lote B — novo vocabulário (2)

| Arquivo | Título do rascunho |
|------|-------------|
| `vocab_food.md` | מזון באנגלית |
| `vocab_house.md` | בית — חדרים וחפצים |

## Lote C — gramática (2)

| Arquivo | Título do rascunho | Mesclar nota |
|------|-------------|--------|
| `grammar_be.md` | sou / é / são — חיזוק | Linha mesclada com ו-be_basic |
| `grammar_plural_questions.md` | ריבוי ושאלות פשוטות | Linha plural mesclada ו-question_frames |

## Lote D — sentenças ו-tradução (4)

| Arquivo | Título do rascunho |
|------|-------------|
| `sentence_base.md` | משפטים קצרים — כיתה ב׳ |
| `sentence_routine.md` | שגרת יום — משפטים |
| `translation_classroom.md` | ביטויי כיתה — משפטים |
| `translation_routines.md` | שגרת יום — תרגום |

---

## Regras de conteúdo

- As páginas de continuação devem ser diferentes do G1 — frases mais profundas, não copiar e colar
- Nenhuma página de escrita independente (linha de acesso de escrita excluída)
- Seção 7 somente texto - sem roteamento prático

---

## Regenerar pacote de revisão

```bash
node scripts/build-english-g2-hebrew-review-pack.mjs
node scripts/verify-english-g2-book-content.mjs
```

---

## Regra de parada explícita

- ❌ Sem registro, rotas, pratique CTA, SQL, commit, push, deploy
- ✅ Os rascunhos permanecem como fonte para futuras tarefas de tempo de execução