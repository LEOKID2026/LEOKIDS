# Livro de aprendizagem de inglês da 1ª série - Rascunhos

**Status:** Rascunho do conteúdo — **10/10** páginas. Não aprovado pelo proprietário. Nenhum tempo de execução conectado.
**Data:** junho de 2026
**Pasta:** `docs/learning-book/english/g1/drafts/`
**Título do livro:** ספר אנגלית — כיתה א׳

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/ENGLISH_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **10/10** |
| Pacote de revisão | ✅ `docs/learning-book/ENGLISH_GRADE_1_HEBREW_REVIEW_PACK.md` (gerado) |
| Verificação de conteúdo | ✅ `scripts/verify-english-g1-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/english-g1-draft-manifest.mjs` |
| Tempo de execução/registro/rotas | ❌ Não criado |

---

## Nomenclatura

- Disciplina voltada para crianças: **אנגלית**
- IDs internos: `english:g1:{pageId}`, `subject: english`

---

## Lote A — אוצר מילים (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `vocab_colors.md` | צבעים באנגלית |
| `vocab_numbers.md` | מספרים 0–10 באנגלית |
| `vocab_family.md` | משפחה באנגלית |

## Lote B — אוצר מילים (4)

| Arquivo | Título do rascunho |
|------|-------------|
| `vocab_animals.md` | חיות באנגלית |
| `vocab_emotions.md` | רגשות באנגלית |
| `vocab_actions.md` | פעולות באנגלית |
| `vocab_school.md` | בית ספר באנגלית |

## Lote C — תבניות בסיסיות (3)

| Arquivo | Título do rascunho | Mesclar nota |
|------|-------------|--------|
| `grammar_be.md` | Eu sou / Você é — היכרות | Linha be mesclada com pool be_basic |
| `sentence_base.md` | משפטים קצרים — בסיס | |
| `translation_classroom.md` | ביטויי כיתה | |

---

## Regras de conteúdo

- Explicações em hebraico; Exemplos de inglês em linhas próprias
- 7 seções por página; não `[DRAFT]` nos corpos da seção
- Seção 7 somente texto - sem roteamento prático
- Sem páginas alfabéticas/fonéticas (não na lombada)

---

## Regenerar pacote de revisão

```bash
node scripts/build-english-g1-hebrew-review-pack.mjs
node scripts/verify-english-g1-book-content.mjs
```

---

## Regra de parada explícita

- ❌ Sem registro, rotas, pratique CTA, SQL, commit, push, deploy
- ✅ Os rascunhos permanecem como fonte para futuras tarefas de tempo de execução