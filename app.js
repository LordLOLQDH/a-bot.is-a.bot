(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  const translations = {
    'index.html': {'.hero-lead':['Eine digitale Identität mit einer ziemlich eindeutigen Aussage: a bot is a bot.','A digital identity with a pretty clear statement: a bot is a bot.'],'.hero-actions .button':['IDENTITÄT ERKUNDEN ↗','EXPLORE IDENTITY ↗'],'.intro-grid h2':['Eine Website.<br>Eine Identität.<br><span class="blue">Null Verwirrung.</span>','One website.<br>One identity.<br><span class="blue">No confusion.</span>'],'.intro-text p:first-child':['Das Internet ist voll von Dingen, die vorgeben, etwas anderes zu sein. Dieses Projekt spart sich die Show.','The internet is full of things pretending to be something else. This project skips the act.'],'.intro-text p:nth-child(2)':['A-BOT.IS-A.BOT ist ein kleines digitales Universum rund um eine einfache Identität. Was es ist? Steht ziemlich deutlich im Namen.','A-BOT.IS-A.BOT is a small digital universe built around one simple identity. What is it? The name gives it away.']},
    'bot.html': {'.sub-hero .hero-lead':['Keine Legende. Kein Mensch im Kostüm. Einfach eine digitale Identität.','No legend. No human in a costume. Just a digital identity.'],'.profile-data .body-copy':['Die Identität ist bewusst simpel gehalten. Diese Website ist ein kreatives Webprojekt und keine Behauptung, ein autonomes oder bewusstes Wesen zu sein.','The identity is intentionally simple. This is a creative web project, not a claim to be an autonomous or conscious being.']},
    'lab.html': {'.sub-hero .hero-lead':['Hier wird nicht geforscht, ob ein Bot ein Bot ist. Das wäre wirklich Zeitverschwendung.','We do not investigate whether a bot is a bot. That would be a spectacular waste of time.'],'.lab-main .panel-description':['Ein kleines Terminal. Gib einen Befehl ein und sieh, was das System antwortet. Keine echte KI-Verbindung, nur ein lokales Mini-Experiment.','A tiny terminal. Enter a command and see the system respond. No live AI connection, just a local browser experiment.']},
    'protocol.html': {'.sub-hero .hero-lead':['Die offiziellen Notizen zu diesem inoffiziellen digitalen Ding.','The official notes for this unofficial digital thing.'],'.protocol-intro h2':['Simple rules.<br><span class="blue">Clear identity.</span>','Simple rules.<br><span class="blue">Clear identity.</span>'],'.protocol-intro p':['Dieses Projekt ist eine statische Website. Sie benötigt kein Konto, sammelt über die hier enthaltenen Funktionen keine persönlichen Daten und stellt keine echte KI-API bereit.','This project is a static website. It requires no account, collects no personal data through its built-in features and does not provide a live AI API.']}
  };
  const path = location.pathname.split('/').pop() || 'index.html';
  let language = localStorage.getItem('abot-language') || 'de';
  const applyLanguage = lang => {
    language = lang; localStorage.setItem('abot-language',lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-de][data-en]').forEach(el => { el.innerHTML = el.dataset[lang]; });
    const map = translations[path] || {};
    Object.entries(map).forEach(([selector,values]) => document.querySelectorAll(selector).forEach(el => { el.innerHTML = values[lang === 'de' ? 0 : 1]; }));
    document.querySelectorAll('.lang-toggle').forEach(button => { button.textContent = lang === 'de' ? 'EN' : 'DE'; button.setAttribute('aria-label',lang === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'); });
    const nav = document.querySelector('.nav');
    if (nav) {
      const links = [...nav.querySelectorAll('a')];
      const labels = lang === 'de' ? ['Start','Die Identität','Das Labor','Protokoll','Dokumentation','Mitmachen','Kontakt'] : ['Home','Identity','The lab','Protocol','Docs','Contribute','Contact'];
      links.forEach((link,i) => { if (!link.dataset.de) link.textContent = labels[i] || link.textContent; });
    }
  };
  document.querySelectorAll('.lang-toggle').forEach(button => button.addEventListener('click',() => applyLanguage(language === 'de' ? 'en' : 'de')));
  applyLanguage(language);
  const clock = document.getElementById('clock');
  if (clock) { const update = () => clock.textContent = new Date().toLocaleTimeString(language === 'de' ? 'de-DE' : 'en-GB',{hour12:false}); update(); setInterval(update,1000); }
  const input = document.getElementById('terminal-input'), output = document.getElementById('terminal-output'), send = document.getElementById('terminal-send');
  if (input && output && send) {
    const respond = () => { const command=input.value.trim().toLowerCase(); if(!command)return;
      const replies={help:language==='de'?'Befehle: help, identity, status, hello, clear':'Commands: help, identity, status, hello, clear',identity:'A-BOT / DIGITAL ENTITY / AB-001',status:language==='de'?'Frontend aktiv. Remote-KI: nicht verbunden.':'Frontend online. Remote AI: not connected.',hello:language==='de'?'Hallo, Mensch. Interessante Spezies.':'Hello, human. Interesting species.'};
      output.textContent=command==='clear'?'> '+(language==='de'?'Terminal zurückgesetzt.':'Terminal cleared.'):'> '+(replies[command]||(language==='de'?'Befehl nicht erkannt. Tippe "help".':'Unknown command. Type "help".')); input.value=''; };
    send.addEventListener('click',respond); input.addEventListener('keydown',e=>{if(e.key==='Enter')respond();});
  }
  const thoughts=['Ich bin ein Bot. Das ist mein Ding.','Lade Persönlichkeit… 404: Menschlichkeit nicht gefunden.','Meine Lieblingsfarbe ist wahrscheinlich Binärcode.','Ich habe heute schon 0 Menschen enttäuscht. Rekord!','Beep boop. Das war eine tiefgründige Aussage.'];
  const thoughtsEn=['I am a bot. That is my thing.','Loading personality… 404: humanity not found.','My favourite colour is probably binary.','I have disappointed zero humans today. A record!','Beep boop. Deep stuff.'];
  const thought=document.getElementById('thought'), thoughtButton=document.getElementById('thought-button');
  if(thought&&thoughtButton)thoughtButton.addEventListener('click',()=>{const list=language==='de'?thoughts:thoughtsEn;let next=list[Math.floor(Math.random()*list.length)];if(list.length>1&&next===thought.textContent)next=list[(list.indexOf(next)+1)%list.length];thought.textContent=next;});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{const result=document.getElementById('quiz-result');if(!result)return;const a=button.dataset.answer;result.textContent=a==='bot'?(language==='de'?'Richtig. Du hast den Namen gelesen.':'Correct. You read the name.') : a==='human'?(language==='de'?'Falsch. Der Name war ein deutlicher Hinweis.':'Nope. The name was a pretty clear clue.'):(language==='de'?'Eine Kartoffel? Nicht ausgeschlossen.':'A potato? Not impossible.');}));
  const form=document.getElementById('contact-form');
  if(form)form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const subject=encodeURIComponent(data.get('topic')+' — A-BOT.IS-A.BOT');const body=encodeURIComponent('Name: '+data.get('name')+'\nEmail: '+data.get('email')+'\n\n'+data.get('message'));location.href='mailto:?subject='+subject+'&body='+body;});
})();