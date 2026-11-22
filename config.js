// ============================================================
//  Instellingen voor de surprise — pas deze gerust aan.
// ============================================================
window.SURPRISE_CONFIG = {
  naam: "Lars",

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
