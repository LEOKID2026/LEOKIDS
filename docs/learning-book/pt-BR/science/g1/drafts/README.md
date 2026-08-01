# Livro de aprendizagem de ciências da 1ª série - Rascunhos

**Status:** Rascunho do conteúdo — **6/6** páginas. Nenhuma inserção de tempo de execução.  
**Plano:** `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md`  
**Escopo mestre:** `docs/learning-book/SCIENCE_LEARNING_BOOK_MASTER_SCOPE_PLAN.md`  
**Data:** junho de 2026  
**Pasta:** `docs/learning-book/science/g1/drafts/`

---

## Status atual

| Artigo | Estado |
|------|--------|
| Plano curricular | ✅ `docs/learning-book/SCIENCE_GRADE_1_LEARNING_BOOK_PLAN.md` |
| Rascunho de páginas de redução | ✅ **6/6** (Lotes A–B) |
| Verificação de conteúdo | ✅ `scripts/verify-science-g1-book-content.mjs` |
| Rascunho do manifesto (somente scripts) | ✅ `scripts/lib/science-g1-draft-manifest.mjs` |
| Rotas/registro em tempo de execução | ❌ Não criado |

---

## Nomenclatura

- O conteúdo do livro voltado para crianças usa **מדעים**.
- Os IDs internos permanecem `science:g1:{topic}` e `subject: science`.

---

## Lote A — עולם החיים (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `body.md` | גוף האדם — חושים ותנועה |
| `animals.md` | בעלי חיים — חי לעומת דומם |
| `plants.md` | צמחים — מה צמחים צריכים |

---

## Lote B — חומרים, כדור הארץ וסביבה (3)

| Arquivo | Título do rascunho |
|------|-------------|
| `materials.md` | חומרים — תכונות יומיומיות |
| `earth_space.md` | כדור הארץ ומזג אוויר |
| `environment.md` | הסביבה שלנו |

---

## Notas

- Todas as páginas: `age_band: grades_1_2`, `approval_status: draft`, `grade: g1`.
- Seção 7: somente texto — **sem roteamento prático**.
- Sem experimentos inseguros, instruções sobre produtos químicos, incêndio ou eletricidade.
- `science:topic:experiments` excluído em G1 (coluna minGrau 2).

---

## Verifique

```bash
node scripts/verify-science-g1-book-content.mjs
node scripts/verify-science-learning-book-master-scope.mjs
```

---

## Regra de parada explícita

- ❌ Sem registro, rotas, SQL, commit, push ou implantação
- ✅ Os rascunhos em hebraico permanecem como fonte para uma tarefa de tempo de execução futura