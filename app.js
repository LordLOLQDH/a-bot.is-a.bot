(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const SUPABASE_URL = "https://eopvkwhcgznvubesaszv.supabase.co";
  const SUPABASE_KEY = "sb_publishable_d3hVgDqwTuB63BtfumPwoQ_ngy2ig_c";
  let lang = localStorage.getItem("abot-language") || "de";

  function applyLang(next) {
    lang = next;
    localStorage.setItem("abot-language", lang);
    document.documentElement.lang = lang;
    $$("[data-de][data-en]").forEach(el => {
      el.innerHTML = el.dataset[lang];
    });
    $$(".lang-toggle").forEach(button => {
      button.textContent = lang === "de" ? "EN" : "DE";
      button.setAttribute("aria-label", lang === "de" ? "Switch to English" : "Zu Deutsch wechseln");
    });
    $$("[data-placeholder-de][data-placeholder-en]").forEach(el => {
      el.placeholder = el.dataset["placeholder" + (lang === "de" ? "De" : "En")];
    });
  }

  $$(".lang-toggle").forEach(button => button.addEventListener("click", () => applyLang(lang === "de" ? "en" : "de")));
  applyLang(lang);

  const menu = $(".menu-toggle"), nav = $(".main-nav");
  if (menu && nav) menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.textContent = open ? "×" : "☰";
    menu.setAttribute("aria-expanded", String(open));
  });

  const clock = $("#local-clock");
  if (clock) {
    const tick = () => clock.textContent = new Date().toLocaleTimeString(lang === "de" ? "de-DE" : "en-GB", { hour12:false });
    tick(); setInterval(tick, 1000);
  }

  async function submitToBackend(payload) {
    const response = await fetch(SUPABASE_URL + "/functions/v1/abot-submit", {
      method: "POST",
      headers: { "Content-Type":"application/json", "apikey":SUPABASE_KEY, "Authorization":"Bearer " + SUPABASE_KEY },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.error || "Request failed");
    return result;
  }

  function showFormStatus(form, message, error=false) {
    let status = $(".form-status", form);
    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      form.append(status);
    }
    status.textContent = message;
    status.classList.toggle("is-error", error);
  }

  function wireForm(selector, buildPayload, successText) {
    const form = $(selector);
    if (!form) return;
    const honeypot = document.createElement("input");
    honeypot.type = "text"; honeypot.name = "website"; honeypot.tabIndex = -1;
    honeypot.autocomplete = "off"; honeypot.setAttribute("aria-hidden", "true");
    honeypot.className = "hp-field"; form.append(honeypot);

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const button = $('button[type="submit"]', form);
      if (button?.disabled) return;
      const original = button?.textContent || "";
      if (button) { button.disabled = true; button.textContent = lang === "de" ? "Wird gesendet …" : "Sending …"; }
      try {
        const payload = buildPayload();
        payload.website = honeypot.value;
        const result = await submitToBackend(payload);
        showFormStatus(form, (lang === "de" ? "Gespeichert. Referenz: " : "Saved. Reference: ") + String(result.id || "").slice(0,8));
        form.reset();
      } catch (error) {
        showFormStatus(form, lang === "de" ? "Konnte nicht gespeichert werden. Bitte prüfe deine Verbindung und versuche es erneut." : "Could not save. Check your connection and try again.", true);
        console.error(error);
      } finally {
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  }

  wireForm("#quick-issue", () => ({
    type:"idea", title:$("#quick-title").value.trim(),
    body:$("#quick-detail").value.trim() || (lang === "de" ? "Keine weitere Beschreibung." : "No further details.")
  }), "Saved");
  wireForm("#issue-form", () => ({
    type:$("#issue-kind").value === "Bug report" ? "bug" : "idea",
    title:$("#issue-title").value.trim(), body:$("#issue-body").value.trim()
  }));
  wireForm("#pr-form", () => ({
    type:"pull_request",
    title:$("#pr-title").value.trim(),
    body:"Branch: " + $("#pr-branch").value.trim() + "\n\n" + $("#pr-body").value.trim()
  }));
  wireForm("#message-form", () => ({
    type:"contact", title:$("#message-subject").value.trim(),
    body:$("#message-content").value.trim(),
    name:$("#message-name")?.value.trim() || "",
    email:$("#message-email")?.value.trim() || ""
  }));

  const copy = $("#copy-message");
  if (copy) copy.addEventListener("click", async () => {
    const text = "Subject: " + ($("#message-subject")?.value || "") + "\n\n" + ($("#message-content")?.value || "");
    try { await navigator.clipboard.writeText(text); copy.textContent = lang === "de" ? "Kopiert ✓" : "Copied ✓"; }
    catch { showFormStatus(copy.closest("form"), lang === "de" ? "Kopieren nicht verfügbar." : "Clipboard unavailable.", true); }
  });

  const notes=$("#scratchpad"), save=$("#save-state"), clear=$("#clear-notes");
  if (notes) {
    notes.value=localStorage.getItem("abot-scratchpad")||"";
    let timer;
    notes.addEventListener("input",()=>{
      if(save) save.textContent=lang==="de"?"Speichert …":"Saving …";
      clearTimeout(timer);
      timer=setTimeout(()=>{
        localStorage.setItem("abot-scratchpad",notes.value);
        if(save) save.textContent=lang==="de"?"Auf diesem Gerät gespeichert":"Saved on this device";
      },350);
    });
  }
  if(clear&&notes) clear.addEventListener("click",()=>{
    notes.value="";localStorage.removeItem("abot-scratchpad");
    if(save)save.textContent=lang==="de"?"Notizen gelöscht":"Notes cleared";
  });

  const terminalInput=$("#terminal-input"), terminalLog=$("#terminal-log");
  if(terminalInput&&terminalLog){
    const run=()=>{
      const cmd=terminalInput.value.trim().toLowerCase();if(!cmd)return;
      const dict={
        help:lang==="de"?"Befehle: help, identity, status, time, joke, clear":"Commands: help, identity, status, time, joke, clear",
        identity:"A-BOT / AB-001 / DIGITAL ENTITY",
        status:lang==="de"?"Frontend: ONLINE | Supabase: VERBUNDEN":"Frontend: ONLINE | Supabase: CONNECTED",
        time:new Date().toString(),
        joke:lang==="de"?"Warum war der Bot im Fitnessstudio? Er wollte seine Bits trainieren.":"Why did the bot go to the gym? To train its bytes."
      };
      if(cmd==="clear")terminalLog.textContent="";
      else terminalLog.textContent+="\n> "+cmd+"\n"+(dict[cmd]||(lang==="de"?"Unbekannter Befehl. Nutze help.":"Unknown command. Try help."));
      terminalInput.value="";
    };
    $("#terminal-send")?.addEventListener("click",run);
    terminalInput.addEventListener("keydown",e=>{if(e.key==="Enter")run();});
  }

  const gen=$("#generate-thought"), out=$("#generator-output");
  if(gen&&out){
    const ideas=()=>lang==="de"
      ?["Ich bin nicht kaputt. Ich bin nur kreativ im Fehlerzustand.","Wenn ein Bot träumt, ist das dann ein Sleep-Mode?","Systemmeldung: Kaffee nicht gefunden.","0 Gefühle. 100 offene Tabs."]
      :["I am not broken. I am creatively malfunctioning.","If a bot dreams, is that just sleep mode?","System alert: coffee not found.","Zero feelings. One hundred open tabs."];
    gen.addEventListener("click",()=>out.textContent=ideas()[Math.floor(Math.random()*ideas().length)]);
  }

  const check=$("#run-check"), results=$("#check-results");
  if(check&&results)check.addEventListener("click",()=>{
    const tests=[["JavaScript",true],["Local storage",(()=>{try{localStorage.setItem("_abot_test","1");localStorage.removeItem("_abot_test");return true}catch{return false}})()],["Clipboard API",!!navigator.clipboard],["Online connection",navigator.onLine]];
    results.innerHTML="<ul>"+tests.map(([name,ok])=>"<li><b>"+name+"</b> — "+(ok?"AVAILABLE":"NOT AVAILABLE")+"</li>").join("")+"</ul>";
  });
  $$(".quiz-choice").forEach(button=>button.addEventListener("click",()=>{
    const answer=$("#quiz-answer");
    if(answer)answer.textContent=button.dataset.choice==="bot"
      ?(lang==="de"?"Richtig. Der Name war ein ziemlich deutlicher Hinweis.":"Correct. The name was a pretty obvious clue.")
      :(lang==="de"?"Nein. Versuch es nochmal.":"Nope. Try again.");
  }));
})();