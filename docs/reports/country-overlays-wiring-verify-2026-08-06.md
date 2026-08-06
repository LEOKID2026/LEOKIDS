# Country overlays wiring verification

**Date:** 2026-08-06  
**Status:** **PASS**

---

## 1. סטטוס כללי

```text
Country overlays wiring verification: PASS
English SoT remains valid: yes
Masters remain valid: yes
Can proceed to final fixes/closure: yes
```

---

## 2. Inventory

**67 country overlays** (masters לא נכללים: `en`, `ar-001`, `es-419`, `pt-BR`, `pt-PT`, `it-IT`, `fr-FR`, `nl-NL`, `de-DE`, `ru-RU`).

| master | overlays |
|---|---:|
| es-419 | 22 |
| en | 21 |
| fr-FR | 12 |
| ru-RU | 4 |
| pt-PT | 3 |
| de-DE | 2 |
| nl-NL | 2 |
| it-IT | 1 |

| locale | path | selector | visible | master/fallback | overlay type | reachable |
|---|---|---|---|---|---|---|
| es-MX | /mx | México | visible | es-MX → es-419 → en | sparse | yes |
| es-CO | /co | Colombia | visible | es-CO → es-419 → en | sparse | yes |
| es-AR | /ar | Argentina | visible | es-AR → es-419 → en | partial | yes |
| es-PE | /pe | Perú | visible | es-PE → es-419 → en | sparse | yes |
| es-CL | /cl | Chile | visible | es-CL → es-419 → en | sparse | yes |
| es-EC | /ec | Ecuador | visible | es-EC → es-419 → en | sparse | yes |
| es-GT | /gt | Guatemala | visible | es-GT → es-419 → en | sparse | yes |
| es-DO | /do | R. Dominicana | visible | es-DO → es-419 → en | sparse | yes |
| es-VE | /ve | Venezuela | visible | es-VE → es-419 → en | sparse | yes |
| es-BO | /bo | Bolivia | visible | es-BO → es-419 → en | sparse | yes |
| es-HN | /hn | Honduras | visible | es-HN → es-419 → en | sparse | yes |
| es-SV | /sv | El Salvador | visible | es-SV → es-419 → en | sparse | yes |
| es-NI | /ni | Nicaragua | visible | es-NI → es-419 → en | sparse | yes |
| es-PY | /py | Paraguay | visible | es-PY → es-419 → en | sparse | yes |
| es-CR | /cr | Costa Rica | visible | es-CR → es-419 → en | sparse | yes |
| es-PA | /pa | Panamá | visible | es-PA → es-419 → en | sparse | yes |
| es-UY | /uy | Uruguay | visible | es-UY → es-419 → en | sparse | yes |
| es-CU | /cu | Cuba | visible | es-CU → es-419 → en | sparse | yes |
| es-PR | /pr | Puerto Rico | visible | es-PR → es-419 → en | sparse | yes |
| es-ES | /es | España | visible | es-ES → es-419 → en | partial | yes |
| es-US | /us-es | USA-es | visible | es-US → es-419 → en | sparse | yes |
| es-GQ | /gq-es | Equatorial Guinea-es | visible | es-GQ → es-419 → en | sparse | yes |
| pt-AO | /ao | Angola | visible | pt-AO → pt-PT → pt-BR → en | sparse | yes |
| pt-MZ | /mz | Mozambique | visible | pt-MZ → pt-PT → pt-BR → en | sparse | yes |
| pt-CV | /cv-pt | Cabo Verde-pt | visible | pt-CV → pt-PT → pt-BR → en | sparse | yes |
| fr-CI | /ci | Côte d’Ivoire | visible | fr-CI → fr-FR → en | sparse | yes |
| fr-CA | /ca-fr | Canada-fr | visible | fr-CA → fr-FR → en | sparse | yes |
| fr-BE | /be-fr | Belgium-fr | visible | fr-BE → fr-FR → en | sparse | yes |
| fr-CH | /ch-fr | Switzerland-fr | visible | fr-CH → fr-FR → en | sparse | yes |
| fr-SN | /sn | Senegal | visible | fr-SN → fr-FR → en | sparse | yes |
| fr-CD | /cd | DR Congo | visible | fr-CD → fr-FR → en | sparse | yes |
| fr-CM | /cm-fr | Cameroon-fr | visible | fr-CM → fr-FR → en | partial | yes |
| fr-BJ | /bj | Benin | visible | fr-BJ → fr-FR → en | partial | yes |
| fr-GN | /gn | Guinea | visible | fr-GN → fr-FR → en | partial | yes |
| fr-TG | /tg | Togo | visible | fr-TG → fr-FR → en | partial | yes |
| fr-GA | /ga | Gabon | visible | fr-GA → fr-FR → en | partial | yes |
| fr-CG | /cg | Congo | visible | fr-CG → fr-FR → en | sparse | yes |
| de-AT | /at | Austria | visible | de-AT → de-DE → en | partial | yes |
| de-CH | /ch-de | Switzerland-de | visible | de-CH → de-DE → en | sparse | yes |
| nl-BE | /be-nl | Belgium-nl | visible | nl-BE → nl-NL → en | sparse | yes |
| nl-SR | /sr-nl | Suriname-nl | visible | nl-SR → nl-NL → en | sparse | yes |
| it-CH | /ch-it | Switzerland-it | visible | it-CH → it-IT → en | sparse | yes |
| ru-KZ | /kz-ru | Kazakhstan-ru | visible | ru-KZ → ru-RU → en | sparse | yes |
| ru-UZ | /uz-ru | Uzbekistan-ru | visible | ru-UZ → ru-RU → en | sparse | yes |
| ru-KG | /kg-ru | Kyrgyzstan-ru | visible | ru-KG → ru-RU → en | sparse | yes |
| ru-BY | /by-ru | Belarus-ru | visible | ru-BY → ru-RU → en | sparse | yes |
| en-AU | /au | Australia | visible | en-AU → en | partial | yes |
| en-NZ | /nz | New Zealand | visible | en-NZ → en | partial | yes |
| en-IE | /ie | Ireland | visible | en-IE → en | partial | yes |
| en-GB | /eng | England | visible | en-GB → en | partial | yes |
| en-CA | /ca | Canada-en | visible | en-CA → en | sparse | yes |
| en-SG | /sg | Singapore | visible | en-SG → en | partial | yes |
| en-ZA | /za | South Africa | visible | en-ZA → en | sparse | yes |
| en-NG | /ng | Nigeria | visible | en-NG → en | partial | yes |
| en-KE | /ke | Kenya | visible | en-KE → en | sparse | yes |
| en-WLS | /wls | Wales | visible | en-WLS → en-GB → en | zero-content | yes |
| en-SCT | /sct | Scotland | visible | en-SCT → en-GB → en | partial | yes |
| en-NIR | /nir | Northern Ireland | visible | en-NIR → en-GB → en | partial | yes |
| en-PH | /ph | Philippines | visible | en-PH → en | zero-content | yes |
| en-IN | /in-en | India-en | visible | en-IN → en | partial | yes |
| en-GH | /gh | Ghana | visible | en-GH → en | partial | yes |
| en-RW | /rw-en | Rwanda-en | visible | en-RW → en | partial | yes |
| en-CM | /cm-en | Cameroon-en | visible | en-CM → en | partial | yes |
| en-MU | /mu-en | Mauritius-en | visible | en-MU → en | partial | yes |
| en-SL | /sl-en | Sierra Leone-en | visible | en-SL → en | partial | yes |
| en-LR | /lr | Liberia | visible | en-LR → en | sparse | yes |
| en-GM | /gm | The Gambia | visible | en-GM → en | partial | yes |

בדיקות חיווט סטטיות לכל overlay: path ייחודי, selector label ייחודי, fallback עד `en`, Spanish → `es-419` → `en`, runtime reachable.

---

## 3. ממצאים

**אין ממצאים.**

| Hebrew | English leakage | fallback | selector | route | country mismatch |
|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 | 0 |

אנגלית במדינות EN אינה נספרת כ־leakage.

---

## 4. Logged-in/API sampling

**12 overlays מייצגים** לפי משפחת שפה (לא כל 67):

| overlay | למה נבחר | Parent | Teacher | Hebrew | EN leakage |
|---|---|---|---|---|---|
| es-MX | Spanish LatAm | OK | OK | 0 | 0 |
| es-AR | Spanish denser pack | OK | OK | 0 | 0 |
| es-ES | Spain | OK | OK | 0 | 0 |
| en-GB | UK England | OK | OK | 0 | n/a |
| en-AU | EN Commonwealth | OK | OK | 0 | n/a |
| en-SCT | UK Scotland | OK | OK | 0 | n/a |
| fr-CA | French overlay | OK | OK | 0 | 0 |
| de-AT | German overlay | OK | OK | 0 | 0 |
| pt-AO | Portuguese overlay | OK | OK | 0 | 0 |
| ru-KZ | Russian overlay | OK | OK | 0 | 0 |
| nl-BE | Dutch overlay | OK | OK | 0 | 0 |
| it-CH | Italian overlay | OK | OK | 0 | 0 |

Roles/APIs: Parent login + dashboard + `list-students` · Teacher login + dashboard + `me`/`dashboard` APIs.

תוצאה: **12/12 PASS** · Hebrew 0 · EN leakage 0 · route issues 0

---

## 5. Evidence

```bash
node docs/reports/_country-overlays-wiring-verify.mjs
```

| artifact | path |
|---|---|
| Script | `docs/reports/_country-overlays-wiring-verify.mjs` |
| JSON | `docs/reports/country-overlays-wiring-verify.json` |
| Log | `docs/reports/_country-overlays-wiring-verify-run.log` |
| Report | `docs/reports/country-overlays-wiring-verify-2026-08-06.md` |

| metric | value |
|---:|---:|
| Overlays | **67** |
| Public routes | **469** |
| Logged-in samples | **12** |
| API responses | **36** |
| Findings | **0** |
| Hebrew | **0** |
| EN leakage | **0** |
| PASS/FAIL/BLOCKED | **67/0/0** |

Smoke לכל overlay: `/` · `/contact` · `/help` · `/guides` · `/practice` · `/practice/worksheets` · `/demo/student`

```text
Country overlays verification passed. Proceed to final fixes/closure planning.
```
