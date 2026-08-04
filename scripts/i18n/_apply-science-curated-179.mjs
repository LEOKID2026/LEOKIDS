/**
 * Apply curated EN→NL for the 179 residual science strings; rebuild overlay from cache.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, "_mt-cache-nl-NL.json"), "utf8"));
const PATCHES = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-nl-NL-curated-patches.json"), "utf8"));
const NEED = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-en-need-fix.json"), "utf8"));

/** Full curated map — Netherlands Dutch, primary-school friendly. */
const M = {
  "The kidneys filter blood, remove waste and extra water, and make urine that leaves the body.":
    "De nieren filteren bloed, verwijderen afvalstoffen en extra water en maken urine die het lichaam verlaat.",
  "People have two kidneys.": "Mensen hebben twee nieren.",
  "Recycling turns used materials such as plastic, paper, and glass into new products instead of throwing them away.":
    "Recycling maakt van gebruikte materialen zoals plastic, papier en glas nieuwe producten, in plaats van ze weg te gooien.",
  "Using old materials again to make new products": "Oude materialen opnieuw gebruiken om nieuwe producten te maken",
  "Crushing mixed materials together with no prep for reuse":
    "Gemengde materialen samenpersen zonder voorbereiding voor hergebruik",
  "Burning is an example of a chemical change.": "Verbranden is een voorbeeld van een chemische verandering.",
  "The eyes work together.": "De ogen werken samen.",
  "Which animal is covered in fur?": "Welk dier is bedekt met vacht?",
  "Which animal is covered in feathers?": "Welk dier is bedekt met veren?",
  "It becomes a harder solid": "Het wordt een hardere vaste stof",
  "Which material is hard?": "Welk materiaal is hard?",
  "Elasticity is a useful material property.": "Elasticiteit is een nuttige materiaaleigenschap.",
  "Energy from burning coal": "Energie uit het verbranden van steenkool",
  "Which material is transparent?": "Welk materiaal is doorzichtig?",
  "Which material is shiny?": "Welk materiaal is glanzend?",
  "Recycling means using old materials again to make new products instead of throwing them away.":
    "Recycling betekent oude materialen opnieuw gebruiken om nieuwe producten te maken, in plaats van ze weg te gooien.",
  "Using old materials again to make new things": "Oude materialen opnieuw gebruiken om nieuwe dingen te maken",
  "Birds are covered in feathers.": "Vogels zijn bedekt met veren.",
  "The Sun moving to the far side of the Moon each night.":
    "De zon die elke nacht naar de andere kant van de maan beweegt.",
  "The Sun itself does not move around Earth — Earth's spin makes it look like the Sun rises and sets.":
    "De zon zelf beweegt niet om de Aarde — de draaiing van de Aarde laat het lijken alsof de zon opkomt en ondergaat.",
  "Burning paper into ash": "Papier verbranden tot as",
  "Reviewers check methods, consistency, and relevance before acceptance":
    "Reviewers controleren methoden, consistentie en relevantie vóór acceptatie",
  "Filter waste from the blood and help make urine": "Afvalstoffen uit het bloed filteren en helpen urine te maken",
  "Digest fats from food": "Vetten uit voedsel verteren",
  "It lays eggs only in water": "Het legt alleen eieren in water",
  "Every variable changed together": "Elke variabele tegelijk veranderd",
  "Moving forever without rest": "Voor altijd bewegen zonder rust",
  "For breathing underwater": "Om onder water te ademen",
  "Feathers also help.": "Veren helpen ook.",
  "Which substance dissolves in water?": "Welke stof lost op in water?",
  "Sweating and seeking shade are common heat responses.":
    "Zweten en schaduw zoeken zijn gewone reacties op hitte.",
  "The heart pumps blood to the lungs and then to the body.":
    "Het hart pompt bloed naar de longen en daarna naar het lichaam.",
  "Which organs help digest food after you swallow?":
    "Welke organen helpen voedsel te verteren nadat je hebt doorgeslikt?",
  "The heart pumps blood into arteries.": "Het hart pompt bloed in slagaders.",
  "Earth travels around the Sun on a nearly circular elliptical path":
    "De Aarde beweegt om de zon in een bijna cirkelvormige elliptische baan",
  "The Moon sets the seasons directly every day": "De maan bepaalt elke dag rechtstreeks de seizoenen",
  "Kidneys filter blood and help regulate fluids and wastes.":
    "Nieren filteren bloed en helpen vocht en afvalstoffen te reguleren.",
  "Sleep and hydration also support energy and focus.":
    "Slaap en voldoende drinken ondersteunen ook energie en concentratie.",
  "Sleep supports growth and recovery.": "Slaap ondersteunt groei en herstel.",
  "The heart is a strong muscle that pumps blood. Blood carries oxygen and nutrients to every part of your body.":
    "Het hart is een sterke spier die bloed pompt. Bloed brengt zuurstof en voedingsstoffen naar elk deel van je lichaam.",
  "The nose also helps you breathe.": "De neus helpt je ook te ademen.",
  "People need water every day.": "Mensen hebben elke dag water nodig.",
  "Sleep with candy under your pillow.": "Slaap met snoep onder je kussen.",
  "Gills work underwater.": "Kieuwen werken onder water.",
  "People are mammals too.": "Mensen zijn ook zoogdieren.",
  "To turn into fish underwater.": "Om onder water in vissen te veranderen.",
  "Fish need oxygen just like we do. Gills pull oxygen out of the water so fish can breathe underwater.":
    "Vissen hebben net als wij zuurstof nodig. Kieuwen halen zuurstof uit het water zodat vissen onder water kunnen ademen.",
  "Feathers act like a coat. Fluffing them traps air that helps hold in body heat.":
    "Veren werken als een jas. Als je ze opzet, houden ze lucht vast die lichaamswarmte helpt bewaren.",
  "Claws help a cat breathe underwater.": "Klauwen helpen een kat onder water te ademen.",
  "Birds need quiet, safe nests to raise young. People should watch from a distance and leave nests alone.":
    "Vogels hebben rustige, veilige nesten nodig om jongen groot te brengen. Mensen moeten op afstand kijken en nesten met rust laten.",
  "The right amount of water and warmth": "De juiste hoeveelheid water en warmte",
  "Pour gasoline on dry leaves outdoors.": "Benzine over droge bladeren buiten gieten.",
  "What is a careful way to pick flowers or plants outdoors?":
    "Wat is een voorzichtige manier om bloemen of planten buiten te plukken?",
  "Respect living things outdoors.": "Respecteer levende wezens buiten.",
  "Why might gardeners slowly move seedlings outdoors before planting?":
    "Waarom zouden tuiniers zaailingen langzaam naar buiten brengen vóór het planten?",
  "People do not need nutrients at all.": "Mensen hebben helemaal geen voedingsstoffen nodig.",
  "The heart keeps blood moving.": "Het hart houdt het bloed in beweging.",
  "The hard skull surrounds the brain. Soft tissues and fluid add cushioning against bumps.":
    "De harde schedel omringt de hersenen. Zachte weefsels en vocht dempen stoten.",
  "The skull (and also fluid and soft tissues around the brain)":
    "De schedel (en ook vocht en zachte weefsels rond de hersenen)",
  "Food provides energy for brain and body.": "Voedsel levert energie voor hersenen en lichaam.",
  "Muscles and bones work together.": "Spieren en botten werken samen.",
  "Feathers for flying underground": "Veren om ondergronds te vliegen",
  "Fur lets mammals breathe underwater with gills.": "Vacht laat zoogdieren onder water ademen met kieuwen.",
  "They breathe only through underwater gills.": "Zij ademen alleen via kieuwen onder water.",
  "The seed becomes a cloud.": "Het zaad wordt een wolk.",
  "It becomes plant sap.": "Het wordt plantensap.",
  "Kidneys clean the blood by removing wastes and extra water. The wastes leave the body as urine.":
    "Nieren zuiveren het bloed door afvalstoffen en extra water te verwijderen. De afvalstoffen verlaten het lichaam als urine.",
  "Digest food using chlorophyll": "Voedsel verteren met bladgroen",
  "Evidence becomes clearer with comparison.": "Bewijs wordt duidelijker door vergelijking.",
  "It provides a baseline to compare with the group that received the change.":
    "Het biedt een uitgangspunt om te vergelijken met de groep die de verandering kreeg.",
  "They all breathe with gills underwater only.": "Zij ademen allemaal alleen onder water met kieuwen.",
  "Gills are specialized for underwater gas exchange. Land pets like dogs and cats use lungs instead.":
    "Kieuwen zijn gespecialiseerd in gasuitwisseling onder water. Landhuisdieren zoals honden en katten gebruiken in plaats daarvan longen.",
  "Mechanical and chemical digestion work together.": "Mechanische en chemische spijsvertering werken samen.",
  "The digestive tract is a long pathway for food.": "Het spijsverteringskanaal is een lange weg voor voedsel.",
  "Digest proteins in the mouth": "Eiwitten in de mond verteren",
  "Respiratory and circulatory systems work together.": "Ademhalings- en bloedsomloopsystemen werken samen.",
  "Working muscles have higher demand. The body responds by sending more blood where it is needed most.":
    "Werkende spieren hebben meer nodig. Het lichaam reageert door meer bloed te sturen waar het het hardst nodig is.",
  "Which tool measures length most directly?": "Welk hulpmiddel meet lengte het meest rechtstreeks?",
  "Without a control, it is harder to know whether your change mattered. The control is the comparison baseline.":
    "Zonder controle is het moeilijker te weten of jouw verandering ertoe deed. De controle is het vergelijkingspunt.",
  '"The plants grew because my lucky pencil was blue."':
    '"De planten groeiden omdat mijn gelukspotlood blauw was."',
  "Make nectar in underwater flowers": "Nectar maken in bloemen onder water",
  "Feathers and hollow mammal bones only": "Alleen veren en holle zoogdierbotten",
  "Water holds dissolved oxygen. Gills extract it so fish and some other aquatic animals can breathe underwater.":
    "Water bevat opgeloste zuurstof. Kieuwen halen die eruit zodat vissen en sommige andere waterdieren onder water kunnen ademen.",
  "Breathe underwater with hidden gills": "Onder water ademen met verborgen kieuwen",
  "Breeding success depends on quiet, safe nesting sites. People can watch respectfully from a distance.":
    "Broedsucces hangt af van rustige, veilige nestplaatsen. Mensen kunnen respectvol op afstand kijken.",
  "They can live only underwater": "Zij kunnen alleen onder water leven",
  "The heart is a strong muscle that pumps blood so oxygen and nutrients can reach body cells.":
    "Het hart is een sterke spier die bloed pompt zodat zuurstof en voedingsstoffen lichaamscellen kunnen bereiken.",
  "Digest all the food you eat": "Al het voedsel verteren dat je eet",
  "The lungs are the main organs of breathing.": "De longen zijn de belangrijkste organen voor ademhaling.",
  "Food provides chemical energy. Digestion and body processes turn that energy into fuel for movement, growth, and warmth.":
    "Voedsel levert chemische energie. Spijsvertering en lichaamsprocessen zetten die energie om in brandstof voor beweging, groei en warmte.",
  "Digest food in the stomach only": "Voedsel alleen in de maag verteren",
  "Digest food in the mouth": "Voedsel in de mond verteren",
  "The heart and vessels work together as a system.": "Het hart en de vaten werken samen als een systeem.",
  "So every measurement becomes identical forever": "Zodat elke meting voor altijd identiek wordt",
  "So every object becomes the same size": "Zodat elk voorwerp even groot wordt",
  "Gills let fish breathe underwater.": "Kieuwen laten vissen onder water ademen.",
  "Gills for breathing underwater": "Kieuwen om onder water te ademen",
  "Feathers help with flight and keeping warm.": "Veren helpen bij vliegen en warm blijven.",
  "A habitat provides food, water, shelter, and space for living things.":
    "Een leefgebied biedt voedsel, water, schuilplaats en ruimte voor levende wezens.",
  "Digest food in the stomach": "Voedsel in de maag verteren",
  "Bones and muscles work together for movement.": "Botten en spieren werken samen voor beweging.",
  "Rain becomes unnecessary": "Regen wordt onnodig",
  "The lungs breathe in air and pass oxygen to the blood while removing carbon dioxide.":
    "De longen ademen lucht in en geven zuurstof door aan het bloed terwijl ze koolstofdioxide verwijderen.",
  "The lungs filter old blood and produce new blood cells.":
    "De longen filteren oud bloed en maken nieuwe bloedcellen.",
  "Reptiles are covered in dry, scaly skin that protects their bodies and reduces water loss. Unlike mammals, reptiles are cold-blooded and depend on their environment for warmth.":
    "Reptielen zijn bedekt met droge, schubbige huid die hun lichaam beschermt en waterverlies vermindert. Anders dan zoogdieren zijn reptielen koudbloedig en afhankelijk van hun omgeving voor warmte.",
  "Rain becomes harmful to plants": "Regen wordt schadelijk voor planten",
  "The circulatory system is made up of the heart, blood vessels, and blood. The heart pumps blood through a network of blood vessels that reach every part of the body. Blood carries oxygen and nutrients to cells and collects waste products, like carbon dioxide, to be removed.":
    "De bloedsomloop bestaat uit het hart, bloedvaten en bloed. Het hart pompt bloed door een netwerk van bloedvaten dat elk deel van het lichaam bereikt. Bloed brengt zuurstof en voedingsstoffen naar cellen en verzamelt afvalstoffen, zoals koolstofdioxide, om te verwijderen.",
  "The heart is a muscular pump that beats continuously to keep blood moving.":
    "Het hart is een gespierde pomp die voortdurend klopt om het bloed in beweging te houden.",
  "The breathing system alone": "Alleen het ademhalingssysteem",
  "Gills pull dissolved oxygen out of water so fish can live underwater.":
    "Kieuwen halen opgeloste zuurstof uit water zodat vissen onder water kunnen leven.",
  "The plant wilts, stops growing, and may eventually die.":
    "De plant verwelkt, stopt met groeien en kan uiteindelijk doodgaan.",
  "It becomes the hypothesis by itself": "Het wordt vanzelf de hypothese",
  "Birds breathe only with gills underwater": "Vogels ademen alleen met kieuwen onder water",
  "The excretory system removes wastes.": "Het uitscheidingssysteem verwijdert afvalstoffen.",
  "Breathing becomes unnecessary": "Ademen wordt onnodig",
  "The circulatory system — made up of the heart, blood, and blood vessels — pumps blood to every cell in the body, delivering oxygen and nutrients while removing waste products.":
    "De bloedsomloop — bestaande uit hart, bloed en bloedvaten — pompt bloed naar elke cel in het lichaam, levert zuurstof en voedingsstoffen en verwijdert afvalstoffen.",
  "What causes the strong urge to breathe when you hold your breath for a short time?":
    "Wat veroorzaakt de sterke aandrang om te ademen als je even je adem inhoudt?",
  "Your skeleton becomes too heavy and presses on your lungs":
    "Je skelet wordt te zwaar en drukt op je longen",
  "Science becomes stronger when results can be repeated.":
    "Wetenschap wordt sterker als resultaten herhaald kunnen worden.",
  "Because all science experiments must be done outdoors.":
    "Omdat alle wetenschappelijke experimenten buiten gedaan moeten worden.",
  "Which sequence shows a butterfly's life cycle?": "Welke volgorde toont de levenscyclus van een vlinder?",
  "Body shape and fins work together in water.": "Lichaamsvorm en vinnen werken samen in water.",
  "Birds take oxygen only from underwater gills": "Vogels halen zuurstof alleen uit kieuwen onder water",
  "Sleep helps the body and brain recover so you can learn, grow, and stay healthy.":
    "Slaap helpt lichaam en hersenen te herstellen zodat je kunt leren, groeien en gezond blijven.",
  "Digestion becomes unnecessary": "Spijsvertering wordt onnodig",
  "A balanced diet provides proteins, carbohydrates, fats, vitamins, and minerals in useful amounts.":
    "Een evenwichtige voeding levert eiwitten, koolhydraten, vetten, vitaminen en mineralen in nuttige hoeveelheden.",
  "They are warm-blooded and maintain a steady internal body temperature":
    "Zij zijn warmbloedig en houden een stabiele inwendige lichaamstemperatuur",
  "Feathers are a key bird trait. Fish typically have scales and use gills in water.":
    "Veren zijn een belangrijk kenmerk van vogels. Vissen hebben meestal schubben en gebruiken kieuwen in water.",
  Feathers: "Veren",
  "Gills for underwater breathing": "Kieuwen voor ademen onder water",
  "Living only underwater forever": "Voor altijd alleen onder water leven",
  "Smell and taste often work together.": "Reuk en smaak werken vaak samen.",
  "The light becomes blood in the heart": "Het licht wordt bloed in het hart",
  "To make lungs breathe underwater": "Om longen onder water te laten ademen",
  "Digest meals by themselves": "Maaltijden zelf verteren",
  "It helps keep the body hydrated and working well":
    "Het helpt het lichaam voldoende vocht te houden en goed te werken",
  "Exercise, sleep, and nutrition work together.": "Beweging, slaap en voeding werken samen.",
  "The body needs more oxygen for working muscles": "Het lichaam heeft meer zuurstof nodig voor werkende spieren",
  "It becomes faster": "Het wordt sneller",
  "Kidneys filter blood and help form urine that carries wastes away.":
    "Nieren filteren bloed en helpen urine te vormen die afvalstoffen afvoert.",
  "Eating in the morning provides fuel after a night without food.":
    "Eten in de ochtend levert brandstof na een nacht zonder voedsel.",
  "Sleep helps the body grow and recover": "Slaap helpt het lichaam te groeien en te herstellen",
  "Sleep is useless for health": "Slaap is nutteloos voor de gezondheid",
  "Sleep replaces all food needs": "Slaap vervangt alle voedselbehoeften",
  "Sleep stops the brain from learning forever": "Slaap zorgt dat de hersenen voor altijd stoppen met leren",
  "The brain and nerves work together.": "De hersenen en zenuwen werken samen.",
  "How can you protect your eyes outdoors on a very bright day?":
    "Hoe kun je je ogen buiten beschermen op een heel zonnige dag?",
  "Keep your eyes open underwater with soap": "Je ogen openhouden onder water met zeep",
  "The body tries to keep a steady temperature.": "Het lichaam probeert een stabiele temperatuur te houden.",
  "Kidneys filter wastes from blood and help make urine.":
    "Nieren filteren afvalstoffen uit bloed en helpen urine te maken.",
  "It pumps blood instead of the heart": "Het pompt bloed in plaats van het hart",
  "Sleep and practice both support learning.": "Slaap en oefenen ondersteunen beide het leren.",
  "Digest food without saliva": "Voedsel verteren zonder speeksel",
  "How do body systems work together?": "Hoe werken lichaamssystemen samen?",
  "It hardens and becomes as stiff as a piece of metal":
    "Het hardt uit en wordt zo stijf als een stuk metaal",
  "It becomes invisible in daylight": "Het wordt onzichtbaar bij daglicht",
  "The sun provides light and heat during the day. Its light lets us see, and its warmth keeps the Earth at temperatures that support life.":
    "De zon levert overdag licht en warmte. Haar licht laat ons zien, en haar warmte houdt de Aarde op temperaturen die leven mogelijk maken.",
  "People dress warmly for cold weather.": "Mensen kleden zich warm aan bij koud weer.",
  "The Sun travels all the way around Earth once every 24 hours":
    "De zon reist elke 24 uur helemaal om de Aarde heen",
  "The Sun stays up longer and shines more directly, bringing extra light and warmth.":
    "De zon blijft langer op en schijnt meer rechtstreeks, wat extra licht en warmte brengt.",
  "The Sun moves much closer to Earth and becomes visibly larger in summer.":
    "De zon komt veel dichter bij de Aarde en wordt in de zomer zichtbaar groter.",
  "We wear a raincoat so rain does not soak our body and clothes. The waterproof material keeps us dry and protected while it is raining.":
    "We dragen een regenjas zodat regen ons lichaam en kleren niet doorweekt. Het waterdichte materiaal houdt ons droog en beschermd terwijl het regent.",
  "The sun will break down all garbage outdoors before it causes any harm":
    "De zon breekt al het afval buiten af voordat het schade veroorzaakt",
  "People should dispose of trash properly.": "Mensen moeten afval op de juiste manier wegdoen.",
  "It becomes colder than ice automatically": "Het wordt automatisch kouder dan ijs",
  "The heat from the sun causes the water to evaporate and turn into water vapor in the air":
    "De warmte van de zon zorgt dat water verdampt en in waterdamp in de lucht verandert",
  "The Dead Sea is extremely salty because lots of salt stays dissolved in its water.":
    "De Dode Zee is extreem zout omdat veel zout opgelost blijft in het water.",
  "Why is burning trash outdoors a poor idea?": "Waarom is afval buiten verbranden een slecht idee?",
  "At room temperature, water is a liquid. It becomes ice (solid) when cooled below 32°F (0°C) and turns to steam (gas) when heated above 212°F (100°C).":
    "Bij kamertemperatuur is water een vloeistof. Het wordt ijs (vast) als het onder 0°C wordt gekoeld en verandert in stoom (gas) als het boven 100°C wordt verwarmd.",
  "Earth spins on its own axis once every 24 hours. When the part of Earth where you live turns to face the Sun, sunlight reaches you and it becomes daytime. As Earth continues spinning, that same part faces away from the Sun and it becomes night.":
    "De Aarde draait elke 24 uur om haar eigen as. Als het deel van de Aarde waar je woont naar de zon draait, bereikt zonlicht je en wordt het overdag. Terwijl de Aarde blijft draaien, keert datzelfde deel zich van de zon af en wordt het nacht.",
  "The Moon moving in front of the Sun and reflecting light downward.":
    "De maan die voor de zon schuift en licht naar beneden weerkaatst.",
  "The Sun does not move around Earth; Earth's spin just makes it look that way from the ground.":
    "De zon beweegt niet om de Aarde; de draaiing van de Aarde laat het er vanaf de grond alleen zo uitzien.",
  "When cooled water vapor becomes liquid droplets, clouds or dew can form.":
    "Als afgekoelde waterdamp vloeibare druppels wordt, kunnen wolken of dauw ontstaan.",
  "Stir until the sand becomes invisible forever": "Roeren tot het zand voor altijd onzichtbaar wordt",
  "Sunlight heats water so some of it evaporates into the air as water vapor.":
    "Zonlicht verwarmt water zodat een deel ervan als waterdamp in de lucht verdampt.",
  "A habitat is the natural environment where a plant or animal lives. It provides everything the organism needs, including food, water, shelter, and space.":
    "Een leefgebied is de natuurlijke omgeving waar een plant of dier leeft. Het biedt alles wat het organisme nodig heeft, inclusief voedsel, water, schuilplaats en ruimte.",
  "People share responsibility for the environment.": "Mensen delen de verantwoordelijkheid voor het milieu.",
  "Water becomes living tissue": "Water wordt levend weefsel",
  "It provides energy that drives evaporation": "Het levert energie die verdamping aandrijft",
};

// ensure all NEED covered
const missing = NEED.filter((s) => !Object.prototype.hasOwnProperty.call(M, s));
if (missing.length) {
  console.error("Missing curated translations:", missing.length, missing.slice(0, 10));
  process.exit(1);
}

for (const [en, nl] of Object.entries(M)) CACHE[en] = nl;
fs.writeFileSync(path.join(__dirname, "_mt-cache-nl-NL.json"), JSON.stringify(CACHE));

const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href + `?t=${Date.now()}`);
const EN = enMod.SCIENCE_EN_OVERLAY;
const overlay = {};
for (const [id, e] of Object.entries(EN)) {
  const map = (s) => (M[s] != null ? M[s] : CACHE[s] != null ? CACHE[s] : s);
  overlay[id] = {
    stem: map(e.stem ?? e.prompt ?? e.question ?? ""),
    options: (e.options || []).map(map),
    explanation: map(e.explanation || ""),
    ...(Array.isArray(e.theoryLines) ? { theoryLines: e.theoryLines.map(map) } : {}),
  };
}
for (const [id, q] of Object.entries(PATCHES)) overlay[id] = q;

fs.writeFileSync(OUT, `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`);

const BAD =
  /\b(The |People |Using old|turns used|instead of|Crushing mixed|Burning is|together met|filter blood|remove waste|make urine|that leaves|have two|work together|covered in|lays eggs|give birth|live young|warm-blooded|cold-blooded|It wilts|becomes weak|material is soft|What is the|What causes|Which |If your|Camouflage helps animals survive|job of|Reviewers |field experiments|forever blocks|not an oracle|later replications|obvious mistakes|critical community|primary source|critical thinking|camouflage pattern|Finding |provides |seeking |Sleep |Digest |cookware|heats food|hydrated|underwater|Feathers|Moving forever|Elasticity is|burning coal|must breathe|variable changed|Wilts|heterogeneous|homogeneous mixture|made of metal|depth perception|boiling point|water vapor|tilted on|travels around|outdoors|rainy or|sunny,|throwing them|paper into|role of peer review in scientific)\b/;
let remain = 0;
const samples = [];
for (const id of Object.keys(EN)) {
  const n = overlay[id];
  const fields = [n.stem, n.explanation, ...(n.options || []), ...(n.theoryLines || [])];
  if (fields.some((f) => BAD.test(String(f || "")))) {
    remain++;
    if (samples.length < 15) samples.push({ id, bad: fields.find((f) => BAD.test(String(f || ""))) });
  }
}
console.log(JSON.stringify({ mapped: Object.keys(M).length, remain, samples, body_2: overlay.body_2.stem, exp_52: overlay.exp_52.stem }, null, 2));
