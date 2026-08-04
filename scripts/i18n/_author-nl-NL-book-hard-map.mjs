import fs from "node:fs";

const lines = fs
  .readFileSync("scripts/i18n/_nl-NL-book-still-en.txt", "utf8")
  .split(/\n/)
  .filter(Boolean);

/** @type {Record<string, string>} */
const T = {
  "You slide a triangle sticker across the page to the right without flipping it over. What kind of move is this?":
    "Je schuift een driehoeksticker over de pagina naar rechts zonder die om te draaien. Wat voor beweging is dit?",
  "What kind of move is this — translation or reflection?":
    "Wat voor beweging is dit — translatie of spiegeling?",
  "What kind of move is this?": "Wat voor beweging is dit?",
  "Did the shape move to a new place, or does it look like a mirror image?":
    "Is de vorm naar een nieuwe plek verplaatst, of lijkt hij op een spiegelbeeld?",
  "Cube: 6 equal square faces (like a dice).":
    "Kubus: 6 gelijke vierkante vlakken (zoals een dobbelsteen).",
  "Imagine a dice:": "Stel je een dobbelsteen voor:",
  "In practice you will read a description of a solid — look for how many faces it has and what shape each face is!":
    "In de oefening lees je een beschrijving van een lichaam — let op hoeveel vlakken het heeft en welke vorm elk vlak heeft!",
  "We stick a heart sticker on glass and see it from outside in a mirror. What kind of move is this?":
    "We plakken een hartsticker op glas en zien hem van buiten in een spiegel. Wat voor beweging is dit?",
  "Did the shape only move to a new place, or does it look like a mirror image?":
    "Is de vorm alleen naar een nieuwe plek verplaatst, of lijkt hij op een spiegelbeeld?",
  "Check angles — there are 4 right angles → fits a rectangle and also a square.":
    "Controleer de hoeken — er zijn 4 rechte hoeken → past bij een rechthoek en ook bij een vierkant.",
  "In practice you will read a description — choose:": "In de oefening lees je een beschrijving — kies:",
  "# Solids — Faces, Vertices, and Edges": "# Lichamen — vlakken, hoekpunten en ribben",
  "A dice:": "Een dobbelsteen:",
  "Vertices — the corners of the cube: 8.": "Hoekpunten — de hoeken van de kubus: 8.",
  "Edges — the lines between two faces: 12.": "Ribben — de lijnen tussen twee vlakken: 12.",
  "You have a dice in front of you.": "Je hebt een dobbelsteen voor je.",
  "In practice count square units or multiply side by side!":
    "In de oefening tel je vierkante eenheden of vermenigvuldig je zijde × zijde!",
  "A triangle has three sides of length 5, 5, and 5. What type is it?":
    "Een driehoek heeft drie zijden van lengte 5, 5 en 5. Wat voor type is het?",
  "Check if there are two equal sides — the side 3 appears twice: yes, two equal sides.":
    "Controleer of er twee even lange zijden zijn — de zijde 3 komt twee keer voor: ja, twee even lange zijden.",
  "In practice you will see a triangle and check how many sides are equal — that tells you if it is equilateral, isosceles, or scalene.":
    "In de oefening zie je een driehoek en controleer je hoeveel zijden even lang zijn — dat vertelt of hij gelijkzijdig, gelijkbenig of ongelijkzijdig is.",
  "In practice check: 90°?": "In de oefening controleer: 90°?",
  "Volume = how much space is inside the solid — calculate: length × width × height.":
    "Volume = hoeveel ruimte er in het lichaam zit — bereken: lengte × breedte × hoogte.",
  "Now you know how to calculate the volume of a rectangular prism in geometry.":
    "Nu weet je hoe je het volume van een balk berekent in meetkunde.",
  "That is what makes a square different from a regular rectangle — in a rectangle not all sides are necessarily equal.":
    "Dat maakt een vierkant anders dan een gewone rechthoek — in een rechthoek zijn niet per se alle zijden even lang.",
  "# Solids — Faces in the Plane": "# Lichamen — vlakken in het vlak",
  "A line that divides a shape into two equal parts — like a mirror.":
    "Een lijn die een vorm in twee gelijke delen deelt — zoals een spiegel.",
  "In practice add three sides — check that none is missing!":
    "In de oefening tel je drie zijden op — controleer dat er geen ontbreekt!",
  "In a rectangle — there are right angles; we learn the diagonal separately there.":
    "In een rechthoek — er zijn rechte hoeken; daar leren we de diagonaal apart.",
  "In a parallelogram, what does the diagonal do?": "In een parallellogram, wat doet de diagonaal?",
  "In a rectangle there are right angles — so √(a²+b²) works.":
    "In een rechthoek zijn er rechte hoeken — dus √(a²+b²) werkt.",
  "Diagonal of a parallelogram — first understand what it does.":
    "Diagonaal van een parallellogram — begrijp eerst wat die doet.",
  "In practice you'll recognize when there's enough information — and when not to use the rectangle formula!":
    "In de oefening herken je wanneer er genoeg informatie is — en wanneer je de rechthoekformule niet moet gebruiken!",
  "In a parallelogram there is no division by 2 in the area formula.":
    "In een parallellogram is er geen deling door 2 in de oppervlakteformule.",
  "A solid — a shape with length, width, and height (not just area!).":
    "Een lichaam — een vorm met lengte, breedte en hoogte (niet alleen oppervlakte!).",
  "In practice you'll find cubes and rectangular prisms — check the shape of the faces!":
    "In de oefening vind je kubussen en balken — controleer de vorm van de vlakken!",
  "Today we will learn volume of a prism — a solid with two identical bases (rectangle) and rectangular faces.":
    "Vandaag leren we het volume van een prisma — een lichaam met twee identieke grondvlakken (rechthoek) en rechthoekige zijvlakken.",
  "In practice you'll find cylinder, pyramid, cone, and sphere — check the shape of the base!":
    "In de oefening vind je cilinder, piramide, kegel en bol — controleer de vorm van het grondvlak!",
  "In practice you'll be asked:": "In de oefening krijg je gevraagd:",
  "Sometimes in an addition problem there is a blank:": "Soms is er in een optelsom een leeg vak:",
  "On the number line — from 2 to 8 there are 6 jumps: 3, 4, 5, 6, 7, 8.":
    "Op de getallenlijn — van 2 naar 8 zijn er 6 sprongen: 3, 4, 5, 6, 7, 8.",
  "Sometimes in a subtraction problem there is a blank:": "Soms is er in een aftreksom een leeg vak:",
  'The question is: "How many were there at the start?" — put back what was taken.':
    'De vraag is: "Hoeveel waren er aan het begin?" — zet terug wat er is weggehaald.',
  "how many were taken, or how many there were at the start.":
    "hoeveel er zijn weggehaald, of hoeveel er aan het begin waren.",
  "Today we're going to learn what a number line is.": "Vandaag gaan we leren wat een getallenlijn is.",
  "- In 15 there is 1 ten-stick and 5 single cubes": "- In 15 is er 1 tientalstok en 5 losse blokjes",
  "- In 20 there are 2 ten-sticks and 0 single cubes": "- In 20 zijn er 2 tientalstokken en 0 losse blokjes",
  "In 23 there are 2 ten-sticks and 3 single cubes.": "In 23 zijn er 2 tientalstokken en 3 losse blokjes.",
  "In 17 there is one ten-stick and 7 single cubes.": "In 17 is er één tientalstok en 7 losse blokjes.",
  "In 17 there is 1 ten and 7 ones.": "In 17 is er 1 tiental en 7 eenheden.",
  "In 29 there are 2 ten-sticks (20) and 9 single cubes.":
    "In 29 zijn er 2 tientalstokken (20) en 9 losse blokjes.",
  "In 29 there are 2 tens and 9 ones.": "In 29 zijn er 2 tientallen en 9 eenheden.",
  "There were eight, three were taken — five are left.":
    "Er waren er acht, er zijn er drie weggehaald — er blijven er vijf over.",
  "There were 8 stickers.": "Er waren 8 stickers.",
  "Mark what was taken or hop to the left on the number line!":
    "Markeer wat is weggehaald of spring naar links op de getallenlijn!",
  "When you add the values, you find out how much money there is altogether.":
    "Als je de waarden optelt, weet je hoeveel geld er in totaal is.",
  "In a coin problem we usually ask: how much money is there altogether?":
    "Bij een muntenvraag vragen we meestal: hoeveel geld is er in totaal?",
  "1. What do we know? — which coins there are and what each is worth":
    "1. Wat weten we? — welke munten er zijn en wat elke waard is",
  "5 + 5 + 2 = 12 → there are 12 shekels altogether.": "5 + 5 + 2 = 12 → er zijn in totaal 12 sjekel.",
  "Read what you know, what you're asked, and add the values!":
    "Lees wat je weet, wat er gevraagd wordt, en tel de waarden op!",
  "In these problems there are three parts:": "In deze sommen zijn er drie delen:",
  "- Had — how much money there was before": "- Had — hoeveel geld er eerder was",
  "- Left / change — what remains": "- Over / wisselgeld — wat overblijft",
  "1. What do we know? — how much there was, how much was spent (or how much it cost)":
    "1. Wat weten we? — hoeveel er was, hoeveel er is uitgegeven (of hoeveel het kostte)",
  "Check how much there was, how much was paid or spent, then subtract.":
    "Controleer hoeveel er was, hoeveel er is betaald of uitgegeven, en trek dan af.",
  "You know the order of the days — then you can answer: what day is tomorrow? Or which day will it be in two days?":
    "Je kent de volgorde van de dagen — dan kun je antwoorden: welke dag is morgen? Of welke dag is het over twee dagen?",
  "3. Add the tens (including carry if there is one)":
    "3. Tel de tientallen op (inclusief onthouden als die er is)",
  "# When Does a Number Divide by 2, 5, and 10?": "# Wanneer is een getal deelbaar door 2, 5 en 10?",
  "Today we're going to learn what a half is — half of the whole.":
    "Vandaag gaan we leren wat een half is — de helft van het geheel.",
  "Today we're going to learn what a quarter is — a quarter of the whole.":
    "Vandaag gaan we leren wat een kwart is — een kwart van het geheel.",
  "Multiplication helps you count fast when there are several same-size groups.":
    "Vermenigvuldigen helpt je snel te tellen als er meerdere even grote groepen zijn.",
  "(On the next division page — we'll see that division is related to multiplication.)":
    "(Op de volgende delingspagina — zien we dat delen samenhangt met vermenigvuldigen.)",
  "What do you see?": "Wat zie je?",
  "In 236 there are 2 hundreds, 3 tens, and 6 ones.":
    "In 236 zijn er 2 honderdtallen, 3 tientallen en 6 eenheden.",
  "In 312 there are 3 hundreds, 1 ten, and 2 ones.":
    "In 312 zijn er 3 honderdtallen, 1 tiental en 2 eenheden.",
  "2. When there aren't enough ones, trade one ten for 10 ones (for example 52 → 4 tens and 12 ones)":
    "2. Als er niet genoeg eenheden zijn, wissel één tiental om voor 10 eenheden (bijvoorbeeld 52 → 4 tientallen en 12 eenheden)",
  "When there are several coins of the same value, you can figure out how much money there is altogether — with addition or equal groups.":
    "Als er meerdere munten van dezelfde waarde zijn, kun je uitrekenen hoeveel geld er in totaal is — met optellen of gelijke groepen.",
  "4 × 5 = 20 → there are 20 shekels altogether.": "4 × 5 = 20 → er zijn in totaal 20 sjekel.",
  "When there are several groups of the same size, you can find how many there are altogether — with multiplication.":
    "Als er meerdere even grote groepen zijn, kun je uitrekenen hoeveel er in totaal zijn — met vermenigvuldigen.",
  "There are 5 boxes. Each box has 4 pencils. How many pencils are there altogether?":
    "Er zijn 5 dozen. Elke doos heeft 4 potloden. Hoeveel potloden zijn er in totaal?",
  "When the division comes out exactly — there is no remainder.":
    "Als de deling precies uitkomt — is er geen rest.",
  "Ask: from some number we subtracted 18 and got 42 — what was the number?":
    "Vraag: van een getal trokken we 18 af en kregen 42 — wat was het getal?",
  "From some number we subtracted 34 and got 48 — what was the number?":
    "Van een getal trokken we 34 af en kregen 48 — wat was het getal?",
  "# Fractions — What Are They and How Do We Compare?": "# Breuken — wat zijn ze en hoe vergelijken we ze?",
  "**Content scope:** What a fraction is. Numerator and denominator. Halves, thirds, quarters. Basic comparison between fractions with the same denominator.":
    "**Inhoudsbereik:** Wat een breuk is. Teller en noemer. Halven, derden, kwarten. Eenvoudig vergelijken van breuken met dezelfde noemer.",
  "The denominator — how many equal parts there are in all.":
    "De noemer — hoeveel gelijke delen er in totaal zijn.",
  "Check the ones digit!": "Controleer het eenhedencijfer!",
  "Today we will learn to read numbers up to 1,000 and figure out what each digit means by its place.":
    "Vandaag leren we getallen tot 1.000 lezen en uitzoeken wat elk cijfer betekent door zijn plaats.",
  "In a big number there are hundreds, tens, and ones.":
    "In een groot getal zijn er honderdtallen, tientallen en eenheden.",
  "Today we will learn order of operations — when there is addition and multiplication in the same problem, multiply first!":
    "Vandaag leren we de volgorde van bewerkingen — als er optellen en vermenigvuldigen in dezelfde som staan, vermenigvuldig eerst!",
  "Today we will learn order of operations when there is subtraction and multiplication — multiply first, then subtract.":
    "Vandaag leren we de volgorde van bewerkingen als er aftrekken en vermenigvuldigen zijn — vermenigvuldig eerst, trek daarna af.",
  "When there aren't enough ones (or tens) — we borrow from the place to the left.":
    "Als er niet genoeg eenheden (of tientallen) zijn — lenen we van de plaats links.",
  "When there isn't enough — borrow!": "Als er niet genoeg is — leen!",
  "In practice you'll find does it divide evenly? — use the rules!":
    "In de oefening vind je: is het deelbaar? — gebruik de regels!",
  "Ask: what do you add to 125 to reach 380?": "Vraag: wat tel je bij 125 op om op 380 te komen?",
  "Today we're going to learn to read big numbers up to 10,000 and figure out what each digit means by its place.":
    "Vandaag gaan we grote getallen tot 10.000 lezen en uitzoeken wat elk cijfer betekent door zijn plaats.",
  "In a four-digit number there are thousands, hundreds, tens, and ones.":
    "In een viercijferig getal zijn er duizendtallen, honderdtallen, tientallen en eenheden.",
  "Today we'll learn what happens when you multiply a number by 1.":
    "Vandaag leren we wat er gebeurt als je een getal met 1 vermenigvuldigt.",
  "Today we'll learn what a power means — short writing for repeated multiplication of the same number.":
    "Vandaag leren we wat een macht betekent — korte schrijfwijze voor herhaald vermenigvuldigen van hetzelfde getal.",
  "What does 2⁴ mean? (Base? Exponent? Write it as repeated multiplication.)":
    "Wat betekent 2⁴? (Grondtal? Exponent? Schrijf het als herhaalde vermenigvuldiging.)",
  "Today we'll learn to calculate the value of a power — for example 2⁵.":
    "Vandaag leren we de waarde van een macht berekenen — bijvoorbeeld 2⁵.",
  "If there are none — it's prime.": "Als er geen zijn — is het een priemgetal.",
  "When there aren't enough in the ones, tens, hundreds, or thousands — borrow from the place to the left.":
    "Als er niet genoeg is bij de eenheden, tientallen, honderdtallen of duizendtallen — leen van de plaats links.",
  "When there aren't enough — borrow!": "Als er niet genoeg is — leen!",
  "What do you know? Two amounts — for example 156 and 89":
    "Wat weet je? Twee hoeveelheden — bijvoorbeeld 156 en 89",
  "What do you do? Subtract: bigger − smaller": "Wat doe je? Aftrekken: groter − kleiner",
  "In practice you'll also find bigger comparison questions.":
    "In de oefening vind je ook grotere vergelijkingsvragen.",
  "Library: there are 53 new books. Each shelf holds 8 books.":
    "Bibliotheek: er zijn 53 nieuwe boeken. Elke plank houdt 8 boeken.",
  "In practice you'll also find bigger division-with-remainder word problems.":
    "In de oefening vind je ook grotere verhaalsommen met delen met rest.",
  "In practice you'll also find bigger questions about adding times. Add the minutes!":
    "In de oefening vind je ook grotere vragen over tijden optellen. Tel de minuten op!",
  "Today we'll learn what happens when you add 0 to a number.":
    "Vandaag leren we wat er gebeurt als je 0 bij een getal optelt.",
  "Today we'll learn what happens when you multiply a number by 0.":
    "Vandaag leren we wat er gebeurt als je een getal met 0 vermenigvuldigt.",
  "Today we'll learn what happens when you subtract 0 from a number.":
    "Vandaag leren we wat er gebeurt als je 0 van een getal aftrekt.",
  "First check the ten-thousands digit — the number with the bigger digit is larger (read from left to right)":
    "Controleer eerst het tienduizendtallencijfer — het getal met het grotere cijfer is groter (lees van links naar rechts)",
  "If they're equal — check the thousands": "Als ze gelijk zijn — controleer de duizendtallen",
  "If they're equal — check the hundreds, tens, ones":
    "Als ze gelijk zijn — controleer de honderdtallen, tientallen, eenheden",
  "Ask: what do you add to 3,250 to reach 8,400?": "Vraag: wat tel je bij 3.250 op om op 8.400 te komen?",
  "Ask: 15,000 minus what equals 6,500?": "Vraag: 15.000 minus wat is gelijk aan 6.500?",
  "Check the order of magnitude: 8,800 is close to 9,000":
    "Controleer de ordegrootte: 8.800 ligt dicht bij 9.000",
  "±1 works even when there are zeros in the middle — for example 45,600.":
    "±1 werkt ook als er nullen in het midden staan — bijvoorbeeld 45.600.",
  "When there are zeros: 45,600 − 1 = 45,599 — not 45,500!":
    "Als er nullen zijn: 45.600 − 1 = 45.599 — niet 45.500!",
  "And what comes after 82,000?": "En wat komt na 82.000?",
  "Today we'll learn to read large numbers up to 100,000 and figure out what each digit means by its place.":
    "Vandaag leren we grote getallen tot 100.000 lezen en uitzoeken wat elk cijfer betekent door zijn plaats.",
  "In a five-digit number there are ten-thousands, thousands, hundreds, tens, and ones.":
    "In een vijfcijferig getal zijn er tienduizendtallen, duizendtallen, honderdtallen, tientallen en eenheden.",
  "The step might be +500, +1,000, +2,000 and more — it's important to find what size repeats.":
    "De stap kan +500, +1.000, +2.000 en meer zijn — het is belangrijk te vinden welke grootte zich herhaalt.",
  "Subtract the ones — if there aren't enough, borrow 1 from the tens":
    "Trek de eenheden af — als er niet genoeg zijn, leen 1 van de tientallen",
  "What do you know? Two amounts — for example 420 liters and 275 liters":
    "Wat weet je? Twee hoeveelheden — bijvoorbeeld 420 liter en 275 liter",
  "What do you do? Always: bigger − smaller": "Wat doe je? Altijd: groter − kleiner",
  "420 − 275 = 145 — there are 145 liters more.": "420 − 275 = 145 — er zijn 145 liter meer.",
  "There were $450, they spent $120, then another $80. How much is left?":
    "Er was $450, ze gaven $120 uit, daarna nog $80. Hoeveel blijft er over?",
  "An item costs $300, there is a 20% discount.": "Een artikel kost $300, er is 20% korting.",
  "In practice you will add three numbers — pick a convenient pair to add first!":
    "In de oefening tel je drie getallen op — kies eerst een handig paar!",
  "In practice you will compare large numbers — work from the left!":
    "In de oefening vergelijk je grote getallen — werk van links!",
  "In practice you will add decimals — always line them up!":
    "In de oefening tel je decimalen op — zet ze altijd recht onder elkaar!",
  "In practice you will divide decimals — change to whole numbers first!":
    "In de oefening deel je decimalen — maak er eerst hele getallen van!",
  "In practice you will divide by 10 and 100 — watch the direction of the decimal point!":
    "In de oefening deel je door 10 en 100 — let op de richting van de komma!",
  "In practice you will multiply decimals — count digits after the decimal point!":
    "In de oefening vermenigvuldig je decimalen — tel de cijfers achter de komma!",
  "In practice you will multiply by 10 and 100 — the direction of the decimal point matters!":
    "In de oefening vermenigvuldig je met 10 en 100 — de richting van de komma telt!",
  "In practice you will subtract decimals — check with addition!":
    "In de oefening trek je decimalen af — controleer met optellen!",
  "In practice you will divide fractions — flip and multiply!":
    "In de oefening deel je breuken — keer om en vermenigvuldig!",
  "In practice you will multiply fractions — simplify at the end!":
    "In de oefening vermenigvuldig je breuken — vereenvoudig aan het eind!",
  "In practice you will multiply two-digit numbers — use breaking apart!":
    "In de oefening vermenigvuldig je tweecijferige getallen — gebruik splitsen!",
  "In practice you will find discounts — calculate the percent of the price!":
    "In de oefening vind je kortingen — bereken het percentage van de prijs!",
  "# Ratios — What Do They Mean?": "# Verhoudingen — wat betekenen ze?",
  "In practice you will round to tens, hundreds, and thousands — identify the deciding digit correctly!":
    "In de oefening rond je af op tientallen, honderdtallen en duizendtallen — bepaal het beslissende cijfer goed!",
  "In practice you will find map→real life — first figure out what 1 cm equals!":
    "In de oefening vind je kaart→echt leven — zoek eerst uit wat 1 cm is!",
  "Tens: after borrowing there are 9 tens. 9 − 6 = 3.":
    "Tientallen: na lenen zijn er 9 tientallen. 9 − 6 = 3.",
  "Hundreds: after borrowing there are 3 hundreds. 3 − 3 = 0.":
    "Honderdtallen: na lenen zijn er 3 honderdtallen. 3 − 3 = 0.",
  "Ten thousands: after borrowing there are 6 ten thousands. 6 − 2 = 4.":
    "Tienduizendtallen: na lenen zijn er 6 tienduizendtallen. 6 − 2 = 4.",
  "In practice you will find distance/speed/time — figure out what you are looking for!":
    "In de oefening vind je afstand/snelheid/tijd — zoek uit wat je zoekt!",
  "In practice you will find sales — calculate the discount first!":
    "In de oefening vind je uitverkoop — bereken eerst de korting!",
  "In practice you will add hours — add the minutes, then convert 60 minutes to 1 hour!":
    "In de oefening tel je uren op — tel de minuten op, reken daarna 60 minuten om naar 1 uur!",
  "We will also learn what animals need to stay alive.":
    "We leren ook wat dieren nodig hebben om te blijven leven.",
  "In a garden there is a dog, a tree, and a rock.": "In een tuin is er een hond, een boom en een steen.",
  "What does it need to stay alive?": "Wat heeft het nodig om te blijven leven?",
  "What does it need?": "Wat heeft het nodig?",
  "In practice, look for questions about what animals need.":
    "In de oefening zoek je vragen over wat dieren nodig hebben.",
  "Today in science we will learn about our Earth — what we see in the sky and how the weather changes.":
    "Vandaag bij natuur en techniek leren we over onze Aarde — wat we aan de hemel zien en hoe het weer verandert.",
  "In the sky there is the sun, clouds, and wind.": "Aan de hemel zijn de zon, wolken en wind.",
  "During the day there is light — the sun shines.": "Overdag is er licht — de zon schijnt.",
  "What did you see in the sky?": "Wat zag je aan de hemel?",
  "On a rainy day there are dark clouds in the sky.":
    "Op een regenachtige dag zijn er donkere wolken aan de hemel.",
  "On a rainy day — it is cold and wet outside, and there are dark clouds in the sky.":
    "Op een regenachtige dag — het is koud en nat buiten, en er zijn donkere wolken aan de hemel.",
  "In practice, look for questions about the sun, rain, and what happens in the sky.":
    "In de oefening zoek je vragen over de zon, regen en wat er aan de hemel gebeurt.",
  "In the classroom there is a pen, a sponge, and a small rock.":
    "In de klas is er een pen, een spons en een kleine steen.",
  "What happens when you press on it?": "Wat gebeurt er als je erop drukt?",
  "# Plants — What Plants Need": "# Planten — wat planten nodig hebben",
  "Today in science we will learn about plants — what they look like and what they need to grow.":
    "Vandaag bij natuur en techniek leren we over planten — hoe ze eruitzien en wat ze nodig hebben om te groeien.",
  "In the classroom there is a pot with a small plant.": "In de klas staat een pot met een klein plantje.",
  "What does a plant need to grow?": "Wat heeft een plant nodig om te groeien?",
  "Think about what you see in a garden — sun, water, soil.":
    "Denk aan wat je in een tuin ziet — zon, water, aarde.",
  "What will happen if we do not pour water for a whole week?":
    "Wat gebeurt er als we een hele week geen water geven?",
  "What will happen to the pot if we do not pour water for a whole week?":
    "Wat gebeurt er met de pot als we een hele week geen water geven?",
  "Now you know plant parts and what plants need to grow in science.":
    "Nu ken je plantendelen en wat planten nodig hebben om te groeien bij natuur en techniek.",
  "In practice, look for questions about roots, leaves, and what a plant needs.":
    "In de oefening zoek je vragen over wortels, bladeren en wat een plant nodig heeft.",
  "What comes first in a butterfly's life cycle?": "Wat komt eerst in de levenscyclus van een vlinder?",
  "What could they have done differently?": "Wat hadden ze anders kunnen doen?",
  "A child who ate without washing hands — what could they have done differently?":
    "Een kind dat at zonder handen te wassen — wat had het anders kunnen doen?",
  "During the year there are seasons:": "Gedurende het jaar zijn er seizoenen:",
  "What gives light and heat during the day?": "Wat geeft overdag licht en warmte?",
  "Does a plant by the window grow taller?": "Groeit een plant bij het raam hoger?",
  "Write down what you see — without guessing.": "Schrijf op wat je ziet — zonder te raden.",
  "If you change both water and light — you do not know what made the difference.":
    "Als je zowel water als licht verandert — weet je niet wat het verschil maakte.",
  "Does a plant by a window grow taller than a plant in a dark corner?":
    "Groeit een plant bij een raam hoger dan een plant in een donkere hoek?",
  "What will be the variable in this test?": "Wat is de variabele in deze test?",
  "What will be the variable in a test of a plant by a window versus a plant in a dark corner?":
    "Wat is de variabele in een test van een plant bij een raam versus een plant in een donkere hoek?",
  "Ice is a solid.": "IJs is een vaste stof.",
  "Today in science we will learn how a plant grows from a seed — and what happens when water is missing.":
    "Vandaag bij natuur en techniek leren we hoe een plant uit een zaad groeit — en wat er gebeurt als water ontbreekt.",
  "What happens to a seed without water?": "Wat gebeurt er met een zaad zonder water?",
  "A plant moved to a dark room — what will happen to its leaves?":
    "Een plant verplaatst naar een donkere kamer — wat gebeurt er met de bladeren?",
  "Why does a fish have fins?": "Waarom heeft een vis vinnen?",
  "What will happen to the puddle on a sunny day?": "Wat gebeurt er met de plas op een zonnige dag?",
  "Which stage of the water cycle does it enter?": "In welke fase van de waterkringloop komt het?",
  "Fifth step — conclusion: what did we learn?": "Vijfde stap — conclusie: wat hebben we geleerd?",
  "If you change several things — you do not know what made the difference.":
    "Als je meerdere dingen verandert — weet je niet wat het verschil maakte.",
  "What stays the same?": "Wat blijft hetzelfde?",
  "What does a pulling action do?": "Wat doet een trekkende kracht?",
  "What happens when you stop pushing — why does the book stop?":
    "Wat gebeurt er als je stopt met duwen — waarom stopt het boek?",
  "Today we will summarize what we learned in science about plants — the last lesson summary on this topic.":
    "Vandaag vatten we samen wat we bij natuur en techniek over planten hebben geleerd — de laatste lessensamenvatting over dit onderwerp.",
  "What does the plant do with sunlight?": "Wat doet de plant met zonlicht?",
  "What will happen to food production in the plant?":
    "Wat gebeurt er met de voedselproductie in de plant?",
  "Light, water, and suitable soil are important growing conditions; without light there is no food production in leaves.":
    "Licht, water en geschikte aarde zijn belangrijke groeiomstandigheden; zonder licht is er geen voedselproductie in bladeren.",
  "The question: a kingfisher and a small fish in a river — who is predator and who is prey? And there is also competition — for what?":
    "De vraag: een ijsvogel en een klein visje in een rivier — wie is roofdier en wie is prooi? En er is ook concurrentie — waarvoor?",
  "What happens to food in the mouth?": "Wat gebeurt er met voedsel in de mond?",
  "Where does it go after swallowing?": "Waar gaat het naartoe na het doorslikken?",
  "The question: what happens to food in the mouth — and where does it go after swallowing?":
    "De vraag: wat gebeurt er met voedsel in de mond — en waar gaat het naartoe na het doorslikken?",
  "Today in science we will learn about natural resources — what nature gives us — and how to protect them.":
    "Vandaag bij natuur en techniek leren we over natuurlijke hulpbronnen — wat de natuur ons geeft — en hoe we ze beschermen.",
  "Method — what we do, what is the variable, what stays the same":
    "Methode — wat we doen, wat de variabele is, wat hetzelfde blijft",
  "Does a plant in a warm room grow faster than a plant in a cold room?":
    "Groeit een plant in een warme kamer sneller dan een plant in een koude kamer?",
  "What comes after experiment results?": "Wat komt na de experimentresultaten?",
  "What conclusion would you want to write after the table?":
    "Welke conclusie zou je na de tabel willen schrijven?",
  "In this experiment, the variable is sponge size — that is what changes between trials.":
    "In dit experiment is de variabele de sponsgrootte — dat is wat tussen proeven verandert.",
  "Inherited traits — what offspring receive from parents.":
    "Erfelijke kenmerken — wat nakomelingen van ouders ontvangen.",
  "What changes in the stages?": "Wat verandert in de fasen?",
  "What stays the same species?": "Wat blijft dezelfde soort?",
  "The question: in a butterfly and caterpillar — what changes in the life stages? And what stays the same species?":
    "De vraag: bij een vlinder en een rups — wat verandert in de levensfasen? En wat blijft dezelfde soort?",
  "What stays?": "Wat blijft?",
  "- The brain decides what to do": "- De hersenen beslissen wat te doen",
  "In places with active volcanoes — there are warning systems and safety plans.":
    "Op plaatsen met actieve vulkanen — zijn er waarschuwingssystemen en veiligheidsplannen.",
  "The question: water from a well — where does it come from? And which natural phenomenon is related to movement inside Earth?":
    "De vraag: water uit een put — waar komt het vandaan? En welk natuurverschijnsel hangt samen met beweging in de Aarde?",
  "What we can do:": "Wat we kunnen doen:",
  "Variable — what we change (for example amount of water)":
    "Variabele — wat we veranderen (bijvoorbeeld hoeveelheid water)",
  "Controlled conditions — what stays the same (plant type, light)":
    "Gecontroleerde omstandigheden — wat hetzelfde blijft (plantensoort, licht)",
  "Does a plant that gets the right amount of water grow more than a plant that gets almost no water after a week?":
    "Groeit een plant die de juiste hoeveelheid water krijgt meer dan een plant die na een week bijna geen water krijgt?",
  "What will you write in the journal?": "Wat schrijf je in het logboek?",
  "What will the graph look like (axes, points)?": "Hoe ziet de grafiek eruit (assen, punten)?",
  "The question: plan an investigation — which sponge absorbs more water? What do you write in the journal and how do you build a graph?":
    "De vraag: plan een onderzoek — welke spons neemt meer water op? Wat schrijf je in het logboek en hoe bouw je een grafiek?",
  "What happens to light that hits a mirror?": "Wat gebeurt er met licht dat een spiegel raakt?",
  "What is the difference between a mirror and clear glass — in which does light pass and in which does it return?":
    "Wat is het verschil tussen een spiegel en helder glas — waarin gaat licht door en waarin keert het terug?",
  "The question: what is the difference between a mirror and clear glass — in which does light pass and in which does it return?":
    "De vraag: wat is het verschil tussen een spiegel en helder glas — waarin gaat licht door en waarin keert het terug?",
  "What happens to the food web if all tigers disappear?":
    "Wat gebeurt er met het voedselweb als alle tijgers verdwijnen?",
  "The more species there are — the stronger and more resilient the web is to changes.":
    "Hoe meer soorten er zijn — hoe sterker en veerkrachtiger het web is bij veranderingen.",
  "What did each one do?": "Wat deed ieder?",
  "What do you know about the sun and Earth from your lessons?":
    "Wat weet je over de zon en de Aarde uit je lessen?",
  "- Talk with family — what can change at home": "- Praat met het gezin — wat kan thuis veranderen",
  "A real challenge — but there is something to do, and every small choice matters.":
    "Een echte uitdaging — maar er is iets te doen, en elke kleine keuze telt.",
  "What reduces carbon footprint — walking or driving alone in a car?":
    "Wat verkleint de CO₂-voetafdruk — lopen of alleen in een auto rijden?",
  "Hypothesis — what seems likely to happen?": "Hypothese — wat lijkt waarschijnlijk te gebeuren?",
  "Variable — what we change; constant — what stays the same":
    "Variabele — wat we veranderen; constant — wat hetzelfde blijft",
  "Conclusion — what did we learn from the data?": "Conclusie — wat hebben we uit de gegevens geleerd?",
  "Variable — what we change (light).": "Variabele — wat we veranderen (licht).",
  "Variable — what differs; comparison — between the situations":
    "Variabele — wat verschilt; vergelijking — tussen de situaties",
  "What will you present in class?": "Wat presenteer je in de klas?",
  "The question: plan a project — which material insulates heat better: cloth or paper? What do you present in class?":
    "De vraag: plan een project — welk materiaal isoleert warmte beter: stof of papier? Wat presenteer je in de klas?",
  "Fire is dangerous, so students do not do fire experiments at home or alone. If there is a demonstration in class, only a responsible teacher does it; if there is danger, move away and call an adult immediately.":
    "Vuur is gevaarlijk, dus leerlingen doen geen vuurexperimenten thuis of alleen. Als er een demonstratie in de klas is, doet alleen een verantwoordelijke leerkracht dat; bij gevaar ga je weg en roep je meteen een volwassene.",
  // extras from remain samples / EN sources
  "# Addition with a Missing Number": "# Optellen met een ontbrekend getal",
  "# Subtraction with a Missing Number": "# Aftrekken met een ontbrekend getal",
  'The question is: "How much do you need to add to get to 7?"':
    'De vraag is: "Hoeveel moet je optellen om op 7 te komen?"',
  "There is a shape with 4 equal sides and 4 right angles. What is it called?":
    "Er is een vorm met 4 even lange zijden en 4 rechte hoeken. Hoe heet het?",
  "A solid has 6 equal square faces. What is it called?":
    "Een lichaam heeft 6 gelijke vierkante vlakken. Hoe heet het?",
  "If you only know 5 cm and 12 cm as adjacent sides — that's not enough to calculate the diagonal.":
    "Als je alleen 5 cm en 12 cm als aangrenzende zijden weet — is dat niet genoeg om de diagonaal te berekenen.",
  "In a parallelogram — can you always calculate the diagonal like in a rectangle, using only two adjacent sides?":
    "In een parallellogram — kun je de diagonaal altijd berekenen zoals in een rechthoek, met alleen twee aangrenzende zijden?",
  'Reasoning: 60° + 70° = 130° — "how much is left" until 180°?':
    'Redenering: 60° + 70° = 130° — "hoeveel blijft er over" tot 180°?',
  "How much is left from 180°?": "Hoeveel blijft er over van 180°?",
  'First calculate the area of the base — then "stretch" it by the height.':
    'Bereken eerst de oppervlakte van het grondvlak — "rek" het daarna met de hoogte.',
};

const missing = lines.filter((l) => !T[l]);
const existing = JSON.parse(fs.readFileSync("scripts/i18n/_nl-NL-book-hard-map.json", "utf8"));
const merged = { ...existing, ...T };
fs.writeFileSync("scripts/i18n/_nl-NL-book-hard-map.json", JSON.stringify(merged, null, 2));
console.log({ totalStill: lines.length, curated: Object.keys(T).length, missing: missing.length });
if (missing.length) console.log(missing.join("\n"));
