// ============================================================
//  Instellingen voor de surprise — pas deze gerust aan.
// ============================================================
window.SURPRISE_CONFIG = {
  naam: "Lars",

  // Openingsdialoog: [wie, tekst, seconden]. Wordt rustig na elkaar afgespeeld,
  // en is opnieuw af te spelen met de knop "Herhaal".
  intro: [
    ["sint", "Ho ho ho! Daar ben je dan, Lars.", 3.5],
    ["lars", "Huh? Sinterklaas? In mijn browser?", 3.0],
    ["sint", "Ik heb in mijn grote boek gelezen... dat jij denkt dat je alles kan.", 4.5],
    ["sint", "GTA, Fortnite, rappen... en dan ook nog fan van Ye!", 4.5],
    ["lars", "Ye is de GOAT, Sint.", 3.0],
    ["sint", "Dat zullen we nog wel eens zien. Ik heb 5 opdrachten voor je.", 4.5],
    ["sint", "Haal je ze alle 5, dan geeft de Sint toe dat jij de beste bent.", 4.5],
    ["lars", "Deal. Makkelijk.", 2.5],
    ["sint", "Klik op vakje 1. Succes... je gaat het nodig hebben!", 4.0],
  ],

  // Wat Sint en Lars zeggen als een opdracht opent (ook te herhalen)
  levelIntro: {
    1: [["sint", "GTA ken jij als je broekzak? Bewijzen maar!", 4.0],
        ["lars", "GTA 5? Dat speel ik al sinds dag 1!", 3.5]],
    2: [["sint", "Rap battle! Jij en ik, allebei een disrap.", 3.5],
        ["lars", "Rappen? Oké... Ye, kijk en leer!", 3.0]],
    3: [["sint", "Piet snapt helemaal niks van jouw studie.", 3.5],
        ["sint", "Leg het hem uit, Lars. Langzaam. Het is Piet.", 3.5],
        ["lars", "Technische Bedrijfskunde? Makkie... denk ik.", 3.0]],
    4: [["sint", "Zoek het briefje. Het ligt ergens waar jij nooit kijkt...", 4.5],
        ["lars", "Waar ik nooit kijk? Dat is overal.", 3.0]],
    5: [["sint", "Laatste kans! Fortnite is jouw wereld. Bewijzen!", 4.0],
        ["lars", "Victory Royale incoming.", 3.0]],
  },

  // Level 4: de code die op het verstopte briefje staat (hoofdletters maakt niet uit)
  briefjeCode: "PEPERNOOT",
  briefjeHint: "Het ligt ergens waar jij nooit kijkt... (tip van Piet: denk aan je huiswerk)",

  // Level 2: zet de rap als mp3 in website/audio/rap.mp3.
  // Zonder mp3 leest de Sint de tekst zelf voor in zijn tekstballon.
  rapAudio: "audio/rap.mp3",

  // Rap-tekst (uit rap.docx). Elke regel verschijnt als karaoke.
  rapTekst: [
    "Yo.. Yo..",
    "Het is de man met de mijter en een pen vol venijn.",
    "Ik kom dit keer niet met pepernoten maar met een vette dope rijm",
    "Mijn staf is van goud, maar mijn rijms zijn van staal",
    "Sinterklaas domineert de beat, wereldwijd en asociaal",
    "Mijn pieten droppen beats die de vloer laten trillen",
    "Dus zet je volume op 10 en zie mij eens chillen",
    "(Wacht even... DJ, houd die beat heel even vast.)",
    "(Ik blader hier door mijn grote boek, er stond iets over Lars en de rare kwast...)",
    "(Hahahaha) Kijk, dit keer gaan we er geen doekjes om winden.",
    "Lars is fan van Ye, a.k.a. Kanye, de gekke mafklapper.",
    "Hij denkt dat hij koning is, maar kan niet eens rappen",
    "Hij roept maar heil Hitler en heeft een rassen obsessie",
    "Vandaag geeft de Sint hem een keiharde repressie",
    "Hij is gewoon gek en heeft last van hersenleed",
    "Dus aanbid hem niet of ik steek mijn staf in je reet",
    "Dus Lars, gooi die platen van Kanye maar snel in de open haard",
    "Want de troep in je oren is geen pepernoten waard!",
    "Ja Lars, laat het rappen maar aan de old skool mannen over.",
    "Deze oude Reus is uit van hier.",
    "Zie je later…. Ha jen tooo",
  ],

  // Level 1: GTA-quiz
  gta: [
    { q: "Hoe heten de drie hoofdpersonen in GTA V?",
      a: ["Michael, Franklin & Trevor", "Tommy, Carl & Niko", "Claude, Victor & Luis", "Lamar, Lester & Dave"], ok: 0 },
    { q: "In welke stad speelt GTA V zich af?",
      a: ["Vice City", "Liberty City", "Los Santos", "San Fierro"], ok: 2 },
    { q: "Hoe heet de hond van Franklin?",
      a: ["Rex", "Chop", "Bobby", "Max"], ok: 1 },
    { q: "In welk jaar kwam GTA V voor het eerst uit?",
      a: ["2011", "2015", "2008", "2013"], ok: 3 },
    { q: "Hoe heet de staat waarin Los Santos ligt?",
      a: ["San Andreas", "Leonida", "Liberty State", "Vice County"], ok: 0 },
  ],

  // Level 5: Fortnite-quiz
  fortnite: [
    { q: "Welk bedrijf maakt Fortnite?",
      a: ["Ubisoft", "Epic Games", "EA", "Rockstar"], ok: 1 },
    { q: "Hoe heet de bus waarmee je naar het eiland vliegt?",
      a: ["Party Bus", "Sky Bus", "Battle Bus", "Loot Bus"], ok: 2 },
    { q: "Hoe heet het geld in Fortnite?",
      a: ["V-Bucks", "Robux", "Coins", "F-Bucks"], ok: 0 },
    { q: "Wat staat er in beeld als je als laatste overblijft?",
      a: ["Winner Winner Chicken Dinner", "Game Over", "Ace!", "Victory Royale"], ok: 3 },
    { q: "Met welke drie materialen kun je bouwen?",
      a: ["Hout, glas en ijs", "Hout, steen en metaal", "Steen, zand en klei", "Metaal, plastic en hout"], ok: 1 },
  ],

  // Level 3: termen uit Technische Bedrijfskunde die Lars moet uitleggen
  jargon: [
    { term: "Supply chain", tip: "Van grondstof tot pakketje bij de deur — en wie er allemaal aan verdient." },
    { term: "Bottleneck", tip: "Het smalste stukje van de fles. Waar loopt alles vast?" },
    { term: "KPI", tip: "Key Performance Indicator. Hoe meet je of iets goed gaat?" },
  ],

  // Wat de Sint zegt bij een fout antwoord (willekeurig gekozen)
  roasts: [
    "Fout! Schaam\nje je? De Sint\nschaamt zich ook!",
    "Nee! Zelfs Piet\nwist dit, en die\nzit in de schoorsteen.",
    "Au. Dat staat\nin het grote boek.\nMet rode inkt.",
    "Fout! Nog één\nzo en je krijgt\neen zak zout.",
  ],
};
