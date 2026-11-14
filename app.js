(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  const clock = document.getElementById('clock');
  if (clock) {
    const update = () => clock.textContent = new Date().toLocaleTimeString('de-DE', {hour12:false});
    update(); setInterval(update, 1000);
  }
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const send = document.getElementById('terminal-send');
  if (input && output && send) {
    const respond = () => {
      const command = input.value.trim().toLowerCase();
      if (!command) return;
      const replies = {
        help: 'Verfügbare Befehle: help, identity, status, hello, clear',
        identity: 'A-BOT / DIGITAL ENTITY / AB-001',
        status: 'Frontend aktiv. Remote-KI: nicht verbunden.',
        hello: 'Hallo, Mensch. Interessante Spezies.'
      };
      if (command === 'clear') output.textContent = '> Terminal zurückgesetzt.';
      else output.textContent = '> ' + (replies[command] || 'Befehl nicht erkannt. Tippe "help".');
      input.value = '';
    };
    send.addEventListener('click', respond);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') respond(); });
  }
  const thoughts = ['Ich bin ein Bot. Das ist mein Ding.','Lade Persönlichkeit… 404: Menschlichkeit nicht gefunden.','Meine Lieblingsfarbe ist wahrscheinlich Binärcode.','Ich habe heute schon 0 Menschen enttäuscht. Rekord!','Beep boop. Das war eine tiefgründige Aussage.'];
  const thought = document.getElementById('thought');
  const thoughtButton = document.getElementById('thought-button');
  if (thought && thoughtButton) thoughtButton.addEventListener('click', () => {
    let next = thoughts[Math.floor(Math.random()*thoughts.length)];
    if (thoughts.length > 1 && next === thought.textContent) next = thoughts[(thoughts.indexOf(next)+1)%thoughts.length];
    thought.textContent = next;
  });
  document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
    const result = document.getElementById('quiz-result');
    if (!result) return;
    const answer = button.dataset.answer;
    result.textContent = answer === 'bot' ? 'Richtig. Du hast den Namen gelesen. Exzellente Detektivarbeit.' : answer === 'human' ? 'Falsch. Der Name war eigentlich ein ziemlich deutlicher Hinweis.' : 'Eine Kartoffel? Nicht ausgeschlossen. Aber heute nicht.';
  }));
})();