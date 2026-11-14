(() => {
  "use strict";
  const one = (s, root=document) => root.querySelector(s);
  const all = (s, root=document) => [...root.querySelectorAll(s)];
  const SB = "https://eopvkwhcgznvubesaszv.supabase.co";
  const KEY = "sb_publishable_d3hVgDqwTuB63BtfumPwoQ_ngy2ig_c";
  const store = {
    get(k,d=""){ try { return localStorage.getItem(k) ?? d; } catch(e) { return d; } },
    set(k,v){ try { localStorage.setItem(k,v); } catch(e) {} },
    del(k){ try { localStorage.removeItem(k); } catch(e) {} }
  };
  let lang = store.get("abot-language","de")==="en" ? "en" : "de";
  function translate(){
    document.documentElement.lang=lang;
    all("[data-de][data-en]").forEach(el=>el.innerHTML=el.getAttribute("data-"+lang));
    all(".lang-toggle").forEach(el=>{el.textContent=lang==="de"?"EN":"DE";});
    all("[data-placeholder-de][data-placeholder-en]").forEach(el=>el.placeholder=el.getAttribute("data-placeholder-"+lang));
  }
  function message(form,text,error=false){
    let el=one(".form-status",form);
    if(!el){el=document.createElement("p");el.className="form-status";el.setAttribute("role","status");form.appendChild(el);}
    el.textContent=text;el.classList.toggle("is-error",error);
  }
  async function submit(data){
    const res=await fetch(SB+"/functions/v1/abot-submit",{
      method:"POST",headers:{"Content-Type":"application/json","apikey":KEY},
      body:JSON.stringify(data)
    });
    const json=await res.json().catch(()=>({}));
    if(!res.ok||!json.ok) throw new Error(json.error||("HTTP "+res.status));
    return json;
  }
  function form(id,build){
    const el=one(id);if(!el)return;
    const trap=document.createElement("input");trap.name="website";trap.tabIndex=-1;trap.autocomplete="off";trap.className="hp-field";el.appendChild(trap);
    el.addEventListener("submit",async ev=>{
      ev.preventDefault();
      const btn=one('button[type="submit"]',el),old=btn?.textContent;
      if(btn){btn.disabled=true;btn.textContent=lang==="de"?"Sende …":"Sending …";}
      try{
        const data=build();data.website=trap.value;
        await submit(data);
        message(el,lang==="de"?"Erfolgreich gespeichert.":"Saved successfully.");
        el.reset();
      }catch(err){
        console.error("A-BOT submit:",err);
        message(el,(lang==="de"?"Fehler beim Senden: ":"Could not send: ")+err.message,true);
      }finally{if(btn){btn.disabled=false;btn.textContent=old;}}
    });
  }
  function init(){
    translate();
    all(".lang-toggle").forEach(b=>b.addEventListener("click",()=>{lang=lang==="de"?"en":"de";store.set("abot-language",lang);translate();}));
    all(".menu-toggle").forEach(b=>b.addEventListener("click",()=>{
      const nav=one(".main-nav",b.closest(".site-header"));if(!nav)return;
      const open=nav.classList.toggle("open");b.textContent=open?"×":"☰";b.setAttribute("aria-expanded",String(open));
    }));
    all(".main-nav a").forEach(a=>a.addEventListener("click",()=>a.closest(".main-nav")?.classList.remove("open")));
    const clock=one("#local-clock");if(clock){const tick=()=>clock.textContent=new Date().toLocaleTimeString(lang==="de"?"de-DE":"en-GB",{hour12:false});tick();setInterval(tick,1000);}
    form("#quick-issue",()=>({type:"idea",title:one("#quick-title").value.trim(),body:one("#quick-detail").value.trim()||"No further details"}));
    form("#issue-form",()=>({type:one("#issue-kind").value==="Bug report"?"bug":"idea",title:one("#issue-title").value.trim(),body:one("#issue-body").value.trim()}));
    form("#pr-form",()=>({type:"pull_request",title:one("#pr-title").value.trim(),body:"Branch: "+one("#pr-branch").value.trim()+"\n\n"+one("#pr-body").value.trim()}));
    form("#message-form",()=>({type:"contact",title:one("#message-subject").value.trim(),body:one("#message-content").value.trim(),name:one("#message-name")?.value.trim()||"",email:one("#message-email")?.value.trim()||""}));
    const copy=one("#copy-message");if(copy)copy.addEventListener("click",async()=>{
      try{await navigator.clipboard.writeText("Subject: "+one("#message-subject").value+"\n\n"+one("#message-content").value);copy.textContent=lang==="de"?"Kopiert ✓":"Copied ✓";}
      catch(e){message(copy.closest("form"),lang==="de"?"Kopieren nicht verfügbar.":"Clipboard unavailable.",true);}
    });
    const notes=one("#scratchpad"),save=one("#save-state"),clear=one("#clear-notes");
    if(notes){notes.value=store.get("abot-scratchpad");let timer;notes.addEventListener("input",()=>{clearTimeout(timer);if(save)save.textContent=lang==="de"?"Speichert …":"Saving …";timer=setTimeout(()=>{store.set("abot-scratchpad",notes.value);if(save)save.textContent=lang==="de"?"Gespeichert":"Saved";},250);});}
    if(clear&&notes)clear.addEventListener("click",()=>{notes.value="";store.del("abot-scratchpad");if(save)save.textContent=lang==="de"?"Gelöscht":"Cleared";});
    const ti=one("#terminal-input"),tl=one("#terminal-log"),runBtn=one("#terminal-send");
    if(ti&&tl){const run=()=>{const c=ti.value.trim().toLowerCase();if(!c)return;const d={help:"help, identity, status, time, joke, clear",identity:"A-BOT / AB-001",status:"Frontend ONLINE | Supabase connected",time:new Date().toString(),joke:"I train my bytes."};tl.textContent=c==="clear"?"":tl.textContent+"\n> "+c+"\n"+(d[c]||"Unknown command. Try help.");ti.value="";};runBtn?.addEventListener("click",run);ti.addEventListener("keydown",e=>{if(e.key==="Enter")run();});}
    const gen=one("#generate-thought"),out=one("#generator-output");if(gen&&out)gen.addEventListener("click",()=>{const a=lang==="de"?["Ich bin nicht kaputt. Nur kreativ im Fehlerzustand.","Systemmeldung: Kaffee nicht gefunden.","0 Gefühle. 100 offene Tabs."]:["Not broken. Creatively malfunctioning.","System alert: coffee not found.","Zero feelings. One hundred tabs."];out.textContent=a[Math.floor(Math.random()*a.length)];});
    const check=one("#run-check"),results=one("#check-results");if(check&&results)check.addEventListener("click",()=>{results.textContent="JavaScript: OK | Local storage: "+(!!window.localStorage?"OK":"Unavailable")+" | Network: "+(navigator.onLine?"Online":"Offline");});
    all(".quiz-choice").forEach(b=>b.addEventListener("click",()=>{const a=one("#quiz-answer");if(a)a.textContent=b.dataset.choice==="bot"?(lang==="de"?"Richtig!":"Correct!"):(lang==="de"?"Leider falsch.":"Not quite.");}));
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();