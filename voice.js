// Gedeeld door de site en de inspreekpagina: koppelt een zin aan een opname.
// Een opname hoort bij (wie + de tekst), ongeacht regelafbrekingen of hoofdletters.
window.VOICE = (() => {
  const norm = (t) => String(t).toLowerCase().replace(/\s+/g, " ").trim();
  // FNV-1a 32-bit
  const hash = (s) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(16).padStart(8, "0");
  };
  const key = (who, text) => `${who === "lars" ? "lars" : "sint"}_${hash(norm(text))}`;

  // Alle zinnen die ingesproken kunnen worden, gegroepeerd (zelfde tekst als op de site).
  function allLines(C) {
    const n = C.naam;
    const groups = [];
    groups.push({ titel: "Opening", lines: C.intro.map(([who, text]) => ({ who, text })) });
    for (const id of Object.keys(C.levelIntro)) {
      groups.push({ titel: `Opdracht ${id} · begin`, lines: C.levelIntro[id].map(([who, text]) => ({ who, text })) });
    }
    groups.push({ titel: "Rap battle", lines: [
      { who: "sint", text: "Ha! De Sint begint. Natuurlijk." },
      { who: "lars", text: "Dat is doorgestoken kaart!" },
      { who: "sint", text: "Stil jij. DJ Piet, drop die beat!" },
      { who: "sint", text: `Boem. Jouw beurt, ${n}. Als je durft.` },
      { who: "lars", text: "Mic drop." },
    ] });
    groups.push({ titel: "Piet snapt het niet", lines: [
      { who: "sint", text: "Piet: 'Ahhh... nee.'" },
      { who: "sint", text: "Piet: 'Dus... pepernoten?'" },
      { who: "sint", text: "Piet: 'Ik snap het! ...denk ik.'" },
    ] });
    groups.push({ titel: "Fout antwoord (Sint roast)", lines: [
      ...C.roasts.map((text) => ({ who: "sint", text })),
      { who: "sint", text: "Nee nee nee! Zoek beter, Piet ziet alles!" },
    ] });
    groups.push({ titel: "Reacties van Lars", lines: [
      { who: "lars", text: "AU!" },
      { who: "lars", text: "BAH! Sint!!" },
      { who: "lars", text: "Wacht even... dat wist ik echt wel..." },
    ] });
    groups.push({ titel: "Opdracht gehaald", lines: [
      { who: "sint", text: "Niet slecht! Maar ik kom al 50 jaar aangezet!" },
      { who: "lars", text: "Haha! Makkelijk. Volgende level!" },
      { who: "sint", text: "Oké, niet slecht... maar mijn flow is beter." },
      { who: "sint", text: "Haha! Niemand snapt het! Ook Piet niet!" },
      { who: "sint", text: "Gevonden! Je hebt ogen als een Zwarte Piet!" },
      { who: "sint", text: "Victory Royale! Zelfs de Sint is onder de indruk..." },
    ] });
    groups.push({ titel: "Gewonnen", lines: [
      { who: "sint", text: "Lars wint! De Sint geeft toe... jij bent de beste!" },
      { who: "lars", text: "YESSSS!! Alle vakjes open! Bier halen!!" },
    ] });
    for (const g of groups) for (const l of g.lines) l.key = key(l.who, l.text);
    return groups;
  }

  return { norm, hash, key, allLines };
})();
