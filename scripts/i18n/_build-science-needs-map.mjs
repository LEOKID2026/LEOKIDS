/**
 * Build + apply full-sentence NL map for remaining science EN strings.
 * No partial word salad — exact keys only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const needs = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-needs-nl-en.json"), "utf8"));
const remain = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-nl-NL-remain-map.json"), "utf8"));

/** Full Netherlands-Dutch sentences for every remaining EN key. */
const NEEDS = {
  "Recycling helps protect the environment.": "Recyclen helpt het milieu te beschermen.",
  "What is an organic material?": "Wat is een organisch materiaal?",
  "The entire population with no filtering": "De hele populatie zonder filtering",
  "Experiments help us learn about the world, test ideas, understand how things work, and discover new things.":
    "Experimenten helpen ons de wereld te leren kennen, ideeën te testen, te begrijpen hoe dingen werken en nieuwe dingen te ontdekken.",
  "They help students think like scientists.": "Ze helpen leerlingen denken als wetenschappers.",
  "Tiny water droplets": "Kleine waterdruppels",
  "What is an adaptation to the environment?": "Wat is een aanpassing aan de omgeving?",
  "Clouds are tiny water droplets or ice crystals in the air. When they get heavy, rain or snow can fall.":
    "Wolken zijn kleine waterdruppels of ijskristallen in de lucht. Als ze zwaar worden, kan regen of sneeuw vallen.",
  "Tiny water droplets or ice crystals in the atmosphere":
    "Kleine waterdruppels of ijskristallen in de atmosfeer",
  "A control group is left unchanged so you can compare results and see what made the difference.":
    "Een controlegroep blijft onveranderd, zodat je resultaten kunt vergelijken en zien wat het verschil maakte.",
  "Earth spins on its axis, making one full turn every 24 hours. When the side of Earth where you live faces the Sun, it is daytime. When that side faces away from the Sun, it is nighttime.":
    "De Aarde draait om haar as en maakt elke 24 uur één volledige draai. Wanneer de kant van de Aarde waar jij woont naar de Zon gericht is, is het overdag. Wanneer die kant van de Zon afgericht is, is het nacht.",
  "Carry oxygen and nutrients and help remove waste from cells":
    "Zuurstof en voedingsstoffen vervoeren en helpen afval uit cellen te verwijderen",
  "Roots and soil structure support mechanical filtering and some chemical uptake":
    "Wortels en bodemstructuur ondersteunen mechanische filtering en enige chemische opname",
  "Ecosystem services include natural filtering.": "Ecosysteemdiensten omvatten natuurlijke filtering.",
  "It has no link to prey numbers": "Het heeft geen verband met het aantal prooidieren",
  "A healthy habitat supports biodiversity.": "Een gezond leefgebied ondersteunt biodiversiteit.",
  "Repeating improves reliability.": "Herhalen verbetert de betrouwbaarheid.",
  "Protecting habitats protects biodiversity.": "Het beschermen van leefgebieden beschermt biodiversiteit.",
  "For making oxygen": "Om zuurstof te maken",
  "One made with no experiment": "Eentje gemaakt zonder experiment",
  "The exact same conditions that repeat every single day throughout the year.":
    "Precies dezelfde omstandigheden die elke dag van het jaar hetzelfde blijven.",
  "Recycling means collecting used materials so they can be made into new products.":
    "Recyclen betekent gebruikte materialen verzamelen zodat er nieuwe producten van gemaakt kunnen worden.",
  "Sorting materials helps recycling work.": "Materialen scheiden helpt bij recyclen.",
  "Clouds are made of many tiny water droplets or ice crystals in the air.":
    "Wolken bestaan uit veel kleine waterdruppels of ijskristallen in de lucht.",
  "Tiny water droplets or ice crystals floating in the air":
    "Kleine waterdruppels of ijskristallen die in de lucht zweven",
  "Producers make food using sunlight.": "Producenten maken voedsel met behulp van zonlicht.",
  "What is a basic explanation of pulmonary circulation?":
    "Wat is een eenvoudige uitleg van de longcirculatie?",
  "In pulmonary circulation, blood travels between the heart and lungs for gas exchange.":
    "Bij de longcirculatie stroomt bloed tussen hart en longen voor gaswisseling.",
  "Covering up and staying in shade help protect skin from strong sunlight.":
    "Bedekking en schaduw helpen de huid te beschermen tegen fel zonlicht.",
  "Make red blood from ready-made material": "Rood bloed maken van kant-en-klaar materiaal",
  "Gas exchange in the lungs changes the oxygen in blood, which then travels to tissues.":
    "Gaswisseling in de longen verandert de zuurstof in het bloed, dat daarna naar weefsels stroomt.",
  "Make sure there is no planned variable": "Zorg dat er geen geplande variabele is",
  "Clear variables make repeats meaningful.": "Duidelijke variabelen maken herhalingen zinvol.",
  "Earth also spins daily to make day and night.": "De Aarde draait ook dagelijks, waardoor dag en nacht ontstaan.",
  "Producer plants make organic material that feeds many levels of a food web.":
    "Producentenplanten maken organisch materiaal dat veel niveaus van een voedselweb voedt.",
  "Components can be separated by density and particle size using settling and filtering.":
    "Bestanddelen kunnen worden gescheiden op dichtheid en deeltjesgrootte door bezinken en filteren.",
  "Repeating improves reliability and helps show how much results vary.":
    "Herhalen verbetert de betrouwbaarheid en laat zien hoeveel resultaten uiteenlopen.",
  "Repeats help reveal spread and measurement mistakes":
    "Herhalingen helpen spreiding en meetfouten te laten zien",
  "They make oxygen for blood": "Ze maken zuurstof voor bloed",
  "They replace the lungs in gas exchange": "Ze vervangen de longen bij gaswisseling",
  "Regular, balanced meals help keep energy more stable through the day.":
    "Regelmatige, evenwichtige maaltijden helpen je energie over de dag stabieler te houden.",
  "The Moon does not make its own light.": "De Maan maakt zelf geen licht.",
  "Only the number of classroom windows": "Alleen het aantal ramen in het klaslokaal",
  "Logs help spot patterns over days.": "Logboeken helpen patronen over dagen te zien.",
  "Clean hands help keep you healthier.": "Schone handen helpen je gezonder te blijven.",
  "Rest helps the body and brain.": "Rust helpt het lichaam en de hersenen.",
  "Your body is made of a lot of water. Drinking water helps you stay cool, move nutrients, and feel well.":
    "Je lichaam bestaat voor een groot deel uit water. Water drinken helpt je koel te blijven, voedingsstoffen te vervoeren en je goed te voelen.",
  "How can you help keep your teeth healthy?": "Hoe kun je je tanden gezond houden?",
  "Brushing removes food and germs that can hurt teeth. Limiting sugary snacks also helps prevent cavities.":
    "Poetsen verwijdert voedsel en bacteriën die tanden kunnen beschadigen. Minder suikerrijke snacks helpt ook gaatjes te voorkomen.",
  "Teeth help you chew food.": "Tanden helpen je voedsel te kauwen.",
  "A helmet helps protect your brain if you fall.": "Een helm helpt je hersenen te beschermen als je valt.",
  "Safety gear helps prevent injuries.": "Veiligheidsuitrusting helpt blessures te voorkomen.",
  "Fish live in water. Gills help them take oxygen from the water.":
    "Vissen leven in water. Kieuwen helpen hen zuurstof uit het water te halen.",
  "They carry pollen from flower to flower.": "Ze brengen stuifmeel van bloem naar bloem.",
  "Pollination helps plants reproduce.": "Bestuiving helpt planten zich voort te planten.",
  "Gills help fish take oxygen from water.": "Kieuwen helpen vissen zuurstof uit water te halen.",
  "Gills help fish bark like dogs.": "Kieuwen helpen vissen blaffen als honden.",
  "Gills help fish make honey.": "Kieuwen helpen vissen honing te maken.",
  "Bats are often nocturnal. Night activity can help them hunt insects and avoid some dangers.":
    "Vleermuizen zijn vaak nachtactief. 's Nachts actief zijn kan hen helpen insecten te jagen en sommige gevaren te vermijden.",
  "They help the plant make food using sunlight.": "Ze helpen de plant voedsel te maken met zonlicht.",
  "Food made in leaves feeds the whole plant.": "Voedsel dat in bladeren wordt gemaakt, voedt de hele plant.",
  "Bees and other animals notice bright flowers. When they visit, they can move pollen and help plants make seeds.":
    "Bijen en andere dieren zien felle bloemen. Als ze langskomen, kunnen ze stuifmeel verplaatsen en planten helpen zaden te maken.",
  "Flowers help plants reproduce.": "Bloemen helpen planten zich voort te planten.",
  "Fruit helps protect and spread seeds.": "Vruchten helpen zaden te beschermen en te verspreiden.",
  "It may grow weak, turn pale, and stop making enough food.":
    "Hij kan zwak worden, bleek kleuren en stoppen met genoeg voedsel maken.",
  "Clouds made of sugar": "Wolken van suiker",
  "Leaves fall to make the sun colder.": "Bladeren vallen om de zon kouder te maken.",
  "Bones give shape and support. The skull protects the brain, and the rib cage helps protect the heart and lungs.":
    "Botten geven vorm en steun. De schedel beschermt de hersenen, en de ribbenkast helpt het hart en de longen te beschermen.",
  "Nutrients include proteins, vitamins, minerals, and more. A balanced diet helps growth, energy, and health.":
    "Voedingsstoffen zijn onder meer eiwitten, vitaminen, mineralen en meer. Een evenwichtig eetpatroon helpt bij groei, energie en gezondheid.",
  "Fruits, vegetables, grains, and proteins each help in different ways.":
    "Fruit, groenten, granen en eiwitten helpen elk op een andere manier.",
  "Digestion starts in the mouth and continues in the stomach and intestines. Nutrients then move into the blood.":
    "Spijsvertering begint in de mond en gaat verder in de maag en darmen. Daarna gaan voedingsstoffen naar het bloed.",
  "Teeth help begin digestion by chewing.": "Tanden helpen de spijsvertering te beginnen door te kauwen.",
  "Why can breakfast help many kids at school?": "Waarom kan ontbijt veel kinderen op school helpen?",
  "One trial might be a lucky accident. Similar results across repeats make findings more trustworthy.":
    "Eén poging kan toeval zijn. Vergelijkbare resultaten bij herhalingen maken bevindingen betrouwbaarder.",
  "Repeating helps check whether results are reliable.": "Herhalen helpt te controleren of resultaten betrouwbaar zijn.",
  "A control is a comparison that helps show what the change caused.":
    "Een controle is een vergelijking die helpt te laten zien wat de verandering veroorzaakte.",
  "Controls make tests fairer.": "Controles maken proeven eerlijker.",
  "Units make numbers unnecessary.": "Eenheden maken getallen overbodig.",
  "Controlled conditions make comparisons fair. Then you can better link the changed variable to the outcome.":
    "Gecontroleerde omstandigheden maken vergelijkingen eerlijk. Dan kun je de veranderde variabele beter koppelen aan het resultaat.",
  "Labels and units make graphs clear.": "Labels en eenheden maken grafieken duidelijk.",
  "Pollen sticks to bees and moves between flowers. Pollination helps plants make fruits and seeds.":
    "Stuifmeel blijft aan bijen plakken en verplaatst zich tussen bloemen. Bestuiving helpt planten vruchten en zaden te maken.",
  "Bees help pollinate flowers as they collect nectar.": "Bijen helpen bloemen te bestuiven terwijl ze nectar verzamelen.",
  "Protecting bees helps ecosystems.": "Bijen beschermen helpt ecosystemen.",
  "Healthy habitats support biodiversity.": "Gezonde leefgebieden ondersteunen biodiversiteit.",
  "Animals depend on plant-made food energy.": "Dieren hangen af van voedselenergie die planten maken.",
  "Make pollen for bees only": "Alleen stuifmeel maken voor bijen",
  "Chlorophyll is key to making food from light.": "Chlorofyl is belangrijk om voedsel uit licht te maken.",
  "A powdery material from flowers that helps plants reproduce":
    "Een poederachtig materiaal van bloemen dat planten helpt zich voort te planten",
  "Producers start food chains by making energy-rich food. Herbivores eat plants, then other animals may eat those herbivores.":
    "Producenten starten voedselketens door energierijk voedsel te maken. Planteneters eten planten, daarna kunnen andere dieren die planteneters eten.",
  "In the lungs, gas exchange occurs. Blood gains oxygen for the body and releases carbon dioxide to be exhaled.":
    "In de longen vindt gaswisseling plaats. Bloed neemt zuurstof op voor het lichaam en geeft koolstofdioxide af om uit te ademen.",
  "Drinking enough water helps body systems, including the kidneys.":
    "Genoeg water drinken helpt lichaamsstelsels, ook de nieren.",
  "Circulation links lungs, digestive nutrients, and body cells.":
    "De bloedsomloop verbindt longen, opgenomen voedingsstoffen en lichaamscellen.",
  "Dates help you track when observations were made and compare changes over time.":
    "Datums helpen je bij te houden wanneer waarnemingen zijn gedaan en veranderingen in de tijd te vergelijken.",
  "Dates make plants grow faster by themselves.": "Datums laten planten vanzelf sneller groeien.",
  "Details make data useful later.": "Details maken gegevens later bruikbaar.",
  "Comparison is how patterns appear. Side-by-side results show whether a change made a real difference.":
    "Door te vergelijken zie je patronen. Resultaten naast elkaar laten zien of een verandering echt verschil maakte.",
  "Add made-up points until it matches.": "Verzonnen punten toevoegen tot het klopt.",
  "Bees visit flowers for nectar to make food. While doing so, they often move pollen between flowers.":
    "Bijen bezoeken bloemen voor nectar om voedsel te maken. Daarbij verplaatsen ze vaak stuifmeel tussen bloemen.",
  "Capture light and help make food for the plant": "Licht opvangen en helpen voedsel voor de plant te maken",
  "Making nectar for its own stomach": "Nectar maken voor de eigen maag",
  "Reproduction—helping the plant make seeds": "Voortplanting — de plant helpen zaden te maken",
  "Gas exchange in the lungs loads red blood cells with oxygen. Circulation then delivers that oxygen throughout the body.":
    "Gaswisseling in de longen laadt rode bloedcellen met zuurstof. De bloedsomloop brengt die zuurstof daarna door het hele lichaam.",
  "Oxygen is digested in the large intestine first.": "Zuurstof wordt eerst in de dikke darm verteerd.",
  "Exercise shuts down the heart's pumping.": "Bewegen zet het pompen van het hart stil.",
  "Circulation adjusts to activity level.": "De bloedsomloop past zich aan het activiteiteniveau aan.",
  "Blood composition stays within healthy ranges partly thanks to kidneys.":
    "De samenstelling van het bloed blijft deels dankzij de nieren binnen gezonde waarden.",
  "Mixed units make comparisons and graphs misleading or confusing.":
    "Gemengde eenheden maken vergelijkingen en grafieken misleidend of verwarrend.",
  "How do bees help plants reproduce?": "Hoe helpen bijen planten zich voort te planten?",
  "Predator–prey pairs appear throughout food webs.": "Roofdier–prooi-paren komen overal in voedselwebben voor.",
  "Making chlorophyll for skin": "Chlorofyl maken voor de huid",
  "Filtering blood like a kidney": "Bloed filteren zoals een nier",
  "The heart routes blood to the lungs for gas exchange, then sends oxygen-rich blood out to body tissues.":
    "Het hart stuurt bloed naar de longen voor gaswisseling en stuurt daarna zuurstofrijk bloed naar de lichaamsweefsels.",
  "Circulation has pulmonary and systemic pathways.": "De bloedsomloop heeft long- en lichaamstrajecten.",
  "Gas exchange keeps cells supplied with oxygen.": "Gaswisseling houdt cellen van zuurstof voorzien.",
  "Sweating cools you but reduces body water. Replacing fluids helps circulation, temperature control, and performance.":
    "Zweten koelt je af maar vermindert lichaamsvocht. Vocht aanvullen helpt bloedsomloop, temperatuurregeling en prestaties.",
  "Blood vessels that transport blood throughout the body":
    "Bloedvaten die bloed door het hele lichaam vervoeren",
  "Gas exchange structures fit the environment.": "Structuren voor gaswisseling passen bij de omgeving.",
  "Producers such as plants capture sunlight and make food. That food energy then moves to animals that eat plants and to animals that eat other animals.":
    "Producenten zoals planten vangen zonlicht op en maken voedsel. Die voedselenergie gaat daarna naar dieren die planten eten en naar dieren die andere dieren eten.",
  "Food energy made from sunlight": "Voedselenergie gemaakt van zonlicht",
  "The body is made of a large amount of water.": "Het lichaam bestaat voor een groot deel uit water.",
  "Drinking water supports healthy body function.": "Water drinken ondersteunt een gezonde lichaamsfunctie.",
  "Oxygen enters the blood in the lungs. Circulating blood then delivers that oxygen to cells throughout the body.":
    "Zuurstof komt in de longen in het bloed. Circulerend bloed brengt die zuurstof daarna naar cellen in het hele lichaam.",
  "Kidneys are part of the excretory system.": "Nieren horen bij het uitscheidingsstelsel.",
  "Healthy kidneys help keep blood chemistry balanced.": "Gezonde nieren helpen de bloedsamenstelling in balans te houden.",
  "Skin is a protective covering. It also helps with touch sensing and helps control body temperature.":
    "Huid is een beschermende bedekking. Ze helpt ook bij voelen en bij het regelen van de lichaamstemperatuur.",
  "Protect the body and help sense touch": "Het lichaam beschermen en helpen aanraking te voelen",
  "Make light for night vision": "Licht maken voor nachtzicht",
  "A clear log helps you remember and share results": "Een duidelijk logboek helpt je resultaten te onthouden en te delen",
  "Notes make the equipment heavier": "Aantekeningen maken de apparatuur zwaarder",
  "Good notes make experiments easier to repeat.": "Goede aantekeningen maken experimenten makkelijker te herhalen.",
  "Repeating a test helps show whether results happen again and are not just a lucky accident.":
    "Een proef herhalen helpt te laten zien of resultaten opnieuw gebeuren en geen toeval zijn.",
  "Standard units make measurements meaningful to others.":
    "Standaardeenheden maken metingen betekenisvol voor anderen.",
  "To make experiments finish faster only": "Alleen om experimenten sneller te laten eindigen",
  "As bees visit flowers for nectar, pollen sticks to them and moves to other flowers, helping plants make seeds.":
    "Als bijen bloemen bezoeken voor nectar, blijft stuifmeel aan hen plakken en gaat het naar andere bloemen, zodat planten zaden kunnen maken.",
  "They carry pollen from flower to flower": "Ze brengen stuifmeel van bloem naar bloem",
  "A shadow made by the moon": "Een schaduw gemaakt door de maan",
  "Predators help control prey numbers. With fewer predators, prey can increase until food or space runs short.":
    "Roofdieren helpen het aantal prooidieren te beheersen. Met minder roofdieren kan prooi toenemen tot voedsel of ruimte tekortschiet.",
  "A beating heart keeps circulation going.": "Een kloppend hart houdt de bloedsomloop op gang.",
  "Grow teeth made of wood": "Tanden van hout laten groeien",
  "Bones form the skeleton, which holds you up and helps protect parts such as the brain and heart.":
    "Botten vormen het skelet, dat je overeind houdt en delen zoals hersenen en hart helpt beschermen.",
  "Make rain clouds form": "Regenwolken laten ontstaan",
  "Bees visit flowers and carry pollen, which helps plants reproduce.":
    "Bijen bezoeken bloemen en dragen stuifmeel, wat planten helpt zich voort te planten.",
  "They move pollen so plants can make seeds": "Ze verplaatsen stuifmeel zodat planten zaden kunnen maken",
  "A variety of living things helps keep nature systems healthier":
    "Een verscheidenheid aan levende wezens helpt natuursystemen gezonder te houden",
  "A bone made of glass": "Een bot van glas",
  "The lungs are responsible for gas exchange: they take in oxygen from the air and release carbon dioxide as a waste product. The oxygen passes into the blood.":
    "De longen zorgen voor gaswisseling: ze nemen zuurstof uit de lucht op en geven koolstofdioxide als afvalstof af. De zuurstof gaat over in het bloed.",
  "To make your teeth grow longer and stronger more quickly.":
    "Om je tanden sneller langer en sterker te laten groeien.",
  "To help your lungs breathe better throughout the day.":
    "Om je longen de hele dag beter te laten ademen.",
  "To help the heart pump blood more easily to the rest of the body.":
    "Om het hart makkelijker bloed naar de rest van het lichaam te laten pompen.",
  "It helps your body rest and recover": "Het helpt je lichaam te rusten en te herstellen",
  "Clear labels make science communication easier.": "Duidelijke labels maken wetenschapscommunicatie makkelijker.",
  "Making shadows disappear": "Schaduwen laten verdwijnen",
  "Habitats are useful only for making noise": "Leefgebieden zijn alleen nuttig om lawaai te maken",
  "Flowers help plants reproduce. Taking too many can hurt plant populations and animals that use them.":
    "Bloemen helpen planten zich voort te planten. Te veel plukken kan plantpopulaties en dieren die ze gebruiken schaden.",
  "Ignore every measurement you made": "Negeer elke meting die je deed",
  "To make every trial identical by magic": "Om elke poging magisch identiek te maken",
  "Controls help scientists trust their conclusions.": "Controles helpen wetenschappers hun conclusies te vertrouwen.",
  "Consumers depend on plant-made food energy.": "Consumenten hangen af van voedselenergie die planten maken.",
  "Repeating trials helps show whether findings are reliable.":
    "Proeven herhalen helpt te laten zien of bevindingen betrouwbaar zijn.",
  "So you can tell exactly which change caused the result, making the experiment fair.":
    "Zodat je precies kunt zien welke verandering het resultaat veroorzaakte, waardoor het experiment eerlijk is.",
  "It helps plants reproduce by reaching other flowers":
    "Het helpt planten zich voort te planten door andere bloemen te bereiken",
  "Why does exercise help the heart stay healthy?": "Waarom helpt bewegen het hart gezond te houden?",
  "Kidneys help keep blood balanced.": "Nieren helpen het bloed in balans te houden.",
  "A balanced diet includes a variety of foods that supply energy, vitamins, minerals, and other nutrients.":
    "Een evenwichtig eetpatroon bevat verschillende voedingsmiddelen die energie, vitaminen, mineralen en andere voedingsstoffen leveren.",
  "Conservation helps protect ecosystems.": "Natuurbescherming helpt ecosystemen te beschermen.",
  "Fins help fish swim, turn, and keep steady in the water.":
    "Vinnen helpen vissen zwemmen, draaien en evenwicht houden in het water.",
  "Filtering blood like kidneys": "Bloed filteren zoals nieren",
  "Traits help scientists sort animals into groups.": "Kenmerken helpen wetenschappers dieren in groepen te indelen.",
  "Brushing removes bacteria and food particles that cause tooth decay and gum disease":
    "Poetsen verwijdert bacteriën en voedselresten die gaatjes en tandvleesproblemen veroorzaken",
  "Brushing helps the digestive system break down food faster in the stomach":
    "Poetsen helpt het spijsverteringsstelsel voedsel sneller in de maag af te breken",
  "Circulation permanently stops": "De bloedsomloop stopt voorgoed",
  "Nutrients are unrelated to growth": "Voedingsstoffen hebben niets met groei te maken",
  "They break food into smaller pieces, creating more surface area so digestive juices can work more efficiently throughout the digestive system.":
    "Ze breken voedsel in kleinere stukken, zodat er meer oppervlak is en spijsvertersappen efficiënter door het hele spijsverteringsstelsel kunnen werken.",
  "Breaking food into smaller pieces increases surface area, making it easier for digestive enzymes in the stomach and small intestine to do their work.":
    "Voedsel in kleinere stukken breken vergroot het oppervlak, zodat spijsverteringsenzymen in maag en dunne darm hun werk makkelijker kunnen doen.",
  "Fins are swimming adaptations that help fish move through water.":
    "Vinnen zijn zwemaanpassingen die vissen helpen door water te bewegen.",
  "Movement helps fish find food and escape danger.": "Beweging helpt vissen voedsel te vinden en gevaar te ontvluchten.",
  "It is needed for plants to reproduce and make seeds":
    "Het is nodig zodat planten zich kunnen voortplanten en zaden maken",
  "Why is biodiversity valuable in an ecosystem?": "Waarom is biodiversiteit waardevol in een ecosysteem?",
  "A rich mix of species supports food webs, recycling, and healthier habitats.":
    "Een rijke mix van soorten ondersteunt voedselwebben, recycling en gezondere leefgebieden.",
  "Biodiversity removes all food webs": "Biodiversiteit verwijdert alle voedselwebben",
  "Biodiversity means variety of life.": "Biodiversiteit betekent verscheidenheid van leven.",
  "Skin covers and protects the body. Nerve endings in skin help you sense touch, heat, and pain.":
    "Huid bedekt en beschermt het lichaam. Zenuwuiteinden in de huid helpen je aanraking, warmte en pijn te voelen.",
  "It protects the body and helps you feel touch": "Het beschermt het lichaam en helpt je aanraking te voelen",
  "Brushing removes food bits and plaque that can harm teeth and gums.":
    "Poetsen verwijdert voedselresten en plaque die tanden en tandvlees kunnen beschadigen.",
  "Faster breathing helps bring in more air.": "Sneller ademen helpt meer lucht binnen te krijgen.",
  "The stomach helps break food down so nutrients can be absorbed later.":
    "De maag helpt voedsel af te breken zodat voedingsstoffen later kunnen worden opgenomen.",
  "To help remove germs that could make you sick": "Om bacteriën te verwijderen die je ziek kunnen maken",
  "To make food taste colder": "Om voedsel kouder te laten smaken",
  "Soap and water help remove dirt and germs.": "Zeep en water helpen vuil en bacteriën te verwijderen.",
  "Variety helps cover nutrient needs.": "Variatie helpt voedingsbehoeften te dekken.",
  "Gas exchange happens in the lungs.": "Gaswisseling gebeurt in de longen.",
  "A helmet cushions the head if you fall and helps prevent serious injuries.":
    "Een helm dempt de klap op het hoofd als je valt en helpt ernstige verwondingen te voorkomen.",
  "To help protect your head from injury": "Om je hoofd te beschermen tegen letsel",
  "To make hearing louder": "Om het gehoor harder te maken",
  "Protecting eyes from strain and bright glare helps keep vision comfortable and safer.":
    "Ogen beschermen tegen inspanning en fel licht helpt het zicht comfortabeler en veiliger te houden.",
  "Wastes that leave the body as urine": "Afvalstoffen die het lichaam als urine verlaten",
  "Calcium helps build and maintain strong bones and teeth.":
    "Calcium helpt sterke botten en tanden op te bouwen en te behouden.",
  "Exercise is part of a healthy lifestyle.": "Bewegen hoort bij een gezonde leefstijl.",
  "Which organs are a major part of the body's waste-filtering system?":
    "Welke organen horen bij het afvalfilterende stelsel van het lichaam?",
  "Absorb digested nutrients into the blood": "Verteerde voedingsstoffen in het bloed opnemen",
  "Make all of the body's bones": "Alle botten van het lichaam maken",
  "Rest and fluids help your body recover. Clean hands help stop germs from spreading.":
    "Rust en vocht helpen je lichaam te herstellen. Schone handen helpen bacteriën niet te verspreiden.",
  "Hygiene helps protect you and others.": "Hygiëne helpt jou en anderen te beschermen.",
  "Fruits and vegetables supply nutrients that support health and growth.":
    "Fruit en groenten leveren voedingsstoffen die gezondheid en groei ondersteunen.",
  "Fiber helps digestion.": "Vezels helpen de spijsvertering.",
  "Sitting and standing tall helps the backbone carry your body weight more comfortably.":
    "Recht zitten en staan helpt de ruggengraat je lichaamsgewicht comfortabeler te dragen.",
  "Strong core muscles also help posture.": "Sterke rompspieren helpen ook bij de houding.",
  "A man-made material created from chemicals, not found naturally.":
    "Een door mensen gemaakt materiaal van chemicaliën, dat niet van nature voorkomt.",
  "Most plastics are made from petroleum, a type of fossil fuel.":
    "De meeste plastics worden gemaakt van aardolie, een soort fossiele brandstof.",
  "Because plastic does not break down easily in nature, it can pollute the environment for hundreds of years.":
    "Omdat plastic in de natuur niet makkelijk afbreekt, kan het het milieu honderden jaren vervuilen.",
  "A raincoat and a sponge are made for different needs.":
    "Een regenjas en een spons zijn voor verschillende behoeften gemaakt.",
  "Block some light and make the ground look dimmer":
    "Wat licht tegenhouden en de grond er donkerder uit laten zien",
  "Make shadows impossible forever": "Schaduwen voor altijd onmogelijk maken",
  "Clouds are made of tiny water droplets or ice crystals.":
    "Wolken bestaan uit kleine waterdruppels of ijskristallen.",
  "To make rain fall more slowly and gently.": "Om regen langzamer en zachter te laten vallen.",
  "Waterproof materials make water run off instead of soaking in.":
    "Waterdichte materialen laten water aflopen in plaats van intrekken.",
  "Throwing trash in a bin keeps the environment clean, prevents animals from eating harmful waste, and stops litter from polluting soil and water.":
    "Afval in een bak gooien houdt het milieu schoon, voorkomt dat dieren schadelijk afval eten, en stopt zwerfvuil dat grond en water vervuilt.",
  "Trash bins are only decoration and do not actually help the environment":
    "Afvalbakken zijn alleen versiering en helpen het milieu niet echt",
  "Plants need water and sunlight to carry out photosynthesis, the process they use to make their own food and grow.":
    "Planten hebben water en zonlicht nodig voor fotosynthese, het proces waarmee ze hun eigen voedsel maken en groeien.",
  "Trees provide shade, shelter, and oxygen while making parks nicer places to visit.":
    "Bomen geven schaduw, beschutting en zuurstof en maken parken prettiger om te bezoeken.",
  "Windows are often made of transparent material.": "Ramen zijn vaak van doorzichtig materiaal gemaakt.",
  "Clouds are made of tiny water droplets or ice crystals. When clouds become dark and thick, they hold a lot of water. That is a sign that the water may fall as rain. Watching cloud shapes and colors is one way to predict the weather.":
    "Wolken bestaan uit kleine waterdruppels of ijskristallen. Als wolken donker en dik worden, bevatten ze veel water. Dat is een teken dat het water als regen kan vallen. Naar vorm en kleur van wolken kijken is een manier om het weer te voorspellen.",
  "Why do we experience different seasons throughout the year?":
    "Waarom beleven we verschillende seizoenen in het jaar?",
  "It is made of pure melted sugar": "Het is gemaakt van puur gesmolten suiker",
  "Clouds are made of tiny water droplets or ice crystals floating in the air. When enough droplets collect together, they become heavy and fall as rain or snow. Clouds also block sunlight, which can make a day feel cooler and darker — an important part of Earth's weather system.":
    "Wolken bestaan uit kleine waterdruppels of ijskristallen die in de lucht zweven. Als genoeg druppels samenkomen, worden ze zwaar en vallen als regen of sneeuw. Wolken houden ook zonlicht tegen, waardoor een dag koeler en donkerder kan aanvoelen — een belangrijk deel van het weersysteem van de Aarde.",
  "Recycling keeps useful materials in use and can reduce trash that harms the environment.":
    "Recyclen houdt nuttige materialen in gebruik en kan afval verminderen dat het milieu schaadt.",
  "Recycling helps reuse materials and reduce waste":
    "Recyclen helpt materialen opnieuw te gebruiken en afval te verminderen",
  "Reduce, reuse, and recycle help the planet.": "Verminderen, hergebruiken en recyclen helpen de planeet.",
  "Trees help the environment by making oxygen, giving shade, and supporting animals.":
    "Bomen helpen het milieu door zuurstof te maken, schaduw te geven en dieren te ondersteunen.",
  "Producers such as plants capture sunlight and provide food energy for consumers.":
    "Producenten zoals planten vangen zonlicht op en leveren voedselenergie voor consumenten.",
  "Recycling is one way to care for the environment.": "Recyclen is een manier om voor het milieu te zorgen.",
  "Protecting forests helps biodiversity.": "Bossen beschermen helpt biodiversiteit.",
  "Sand does not dissolve in water. Filtering can catch the sand while water passes through.":
    "Zand lost niet op in water. Filteren kan het zand tegenhouden terwijl water doorloopt.",
  "Rain clouds covering the Sun and making everything dark.":
    "Regenwolken die de Zon bedekken en alles donker maken.",
  "It reduces waste and helps reuse valuable materials":
    "Het vermindert afval en helpt waardevolle materialen opnieuw te gebruiken",
  "What does biodiversity mean?": "Wat betekent biodiversiteit?",
  "Biodiversity is the mix of plants, animals, and other organisms that share a habitat.":
    "Biodiversiteit is de mix van planten, dieren en andere organismen die een leefgebied delen.",
  "Protecting habitats helps protect biodiversity.": "Leefgebieden beschermen helpt biodiversiteit te beschermen.",
  "It increases biodiversity automatically": "Het vergroot biodiversiteit automatisch",
};

const missing = needs.filter((k) => !(k in NEEDS));
if (missing.length) {
  console.error("Missing translations:", missing.length, missing.slice(0, 10));
  process.exit(1);
}

const MAP = { ...remain, ...NEEDS };
fs.writeFileSync(path.join(__dirname, "_science-nl-NL-needs-map.json"), JSON.stringify(NEEDS, null, 2));

const { SCIENCE_EN_OVERLAY: EN } = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
const { SCIENCE_NL_NL_OVERLAY: NL } = await import(pathToFileURL(OUT).href + "?t=" + Date.now());

let patched = 0;
const out = structuredClone(NL);
for (const id of Object.keys(EN)) {
  const en = EN[id];
  const nl = out[id];
  if (!nl) continue;
  const apply = (enVal, get, set) => {
    const key = String(enVal ?? "");
    if (key in MAP) {
      if (get() !== MAP[key]) {
        set(MAP[key]);
        patched++;
      }
    }
  };
  apply(en.stem, () => nl.stem, (v) => { nl.stem = v; });
  apply(en.explanation, () => nl.explanation, (v) => { nl.explanation = v; });
  (en.options || []).forEach((o, i) => apply(o, () => nl.options[i], (v) => { nl.options[i] = v; }));
  (en.theoryLines || []).forEach((t, i) => apply(t, () => nl.theoryLines[i], (v) => { nl.theoryLines[i] = v; }));
}

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(out, null, 2)};\n`,
  "utf8"
);
console.log({ needs: needs.length, mapKeys: Object.keys(NEEDS).length, patched });
