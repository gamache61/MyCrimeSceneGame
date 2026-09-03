// ============================================================
//  help-system.js — Crowsnest Castle
//  Press H or click ? button for room-specific help
//  Usage: HelpSystem.init('ballroom');
// ============================================================
const HelpSystem = (() => {

  const ROOM_HELP = {
    default: {
      title: "How to Play",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Move forward", "S / ↓ — Move backward", "← → — Turn left / right"] },
        { heading: "Investigation", items: ["F — Examine item (hold to pick up, release to log)", "E — Interact with doors and objects"] },
        { heading: "Notebook", items: ["Click Bull's Notebook (top right) to review clues", "Find 10 clues to unlock the accusation"] },
      ]
    },
    ballroom: {
      title: "Grand Ballroom",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Forward  ·  S / ↓ — Back  ·  ← → — Turn"] },
        { heading: "Evidence", items: ["Walk near a glowing item — Press F to examine", "Hold F to bring it to hand, release to log it in Bull's notebook"] },
        { heading: "Exit", items: ["Walk to the door and press E to return to the corridor"] },
      ]
    },
    library: {
      title: "The Library — Interview Room",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Forward  ·  S / ↓ — Back  ·  ← → — Turn"] },
        { heading: "Evidence Board", items: ["Walk up to the board and press E to open it", "The board shows the victim, all suspects, and their connections", "Click any card to read their profile and interview them"] },
        { heading: "Interviews", items: ["Select a suspect on the board to see their interview questions", "More clues found = more questions unlocked", "Pay attention — the killer's answers are evasive"] },
        { heading: "Evidence", items: ["Press F near a glowing item to pick up a clue"] },
        { heading: "Edit Mode", items: ["Press M to enter edit mode", "Click any furniture to select it", "Arrow keys to move, R to rotate, Ctrl+S to save"] },
        { heading: "Exit", items: ["Walk to the door and press E to return to the corridor"] },
      ]
    },
    chapel: {
      title: "The Chapel",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Forward  ·  S / ↓ — Back  ·  ← → — Turn"] },
        { heading: "Evidence", items: ["Press F near a glowing item to examine and log it"] },
        { heading: "Exit", items: ["Walk to the door and press E to return to the corridor"] },
      ]
    },
    floor1: {
      title: "Floor 1 — Castle Corridor",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Forward  ·  S / ↓ — Back  ·  ← → — Turn"] },
        { heading: "Rooms", items: ["Walk up to a door — Press E to enter", "Each room may contain evidence from the current case"] },
        { heading: "Floors", items: ["Find the stairs or elevator to reach Floor 2", "The basement can be accessed from the stairwell"] },
        { heading: "Evidence", items: ["Some clues are placed in the corridors — press F to examine"] },
        { heading: "Notebook", items: ["Click Bull's Notebook (top right) to review all collected clues", "Find 10 clues to unlock the accusation panel"] },
      ]
    },
    floor2: {
      title: "Floor 2 — Upper Corridor",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Forward  ·  S / ↓ — Back  ·  ← → — Turn"] },
        { heading: "Rooms", items: ["Walk up to any door — Press E to enter"] },
        { heading: "Elevator", items: ["Use the elevator to return to Floor 1", "Press E at the elevator door to call it"] },
        { heading: "Tower", items: ["The rooftop towers are accessible from the elevator platform"] },
      ]
    },
    basement_tunnels: {
      title: "Basement Tunnels",
      sections: [
        { heading: "Movement", items: ["W / ↑ — Forward  ·  S / ↓ — Back  ·  ← → — Turn"] },
        { heading: "Navigation", items: ["The tunnels are dark — follow the walls", "The prison is at the far end of the tunnel network"] },
        { heading: "Evidence", items: ["Press F near a glowing item to examine it"] },
        { heading: "Exit", items: ["Press E at the stairwell to return to Floor 1"] },
      ]
    },
  };

  function _injectStyles() {
    if (document.getElementById('__helpStyles')) return;
    const s = document.createElement('style');
    s.id = '__helpStyles';
    s.textContent = `
      #helpBtn {
        position:fixed; bottom:20px; right:20px;
        width:38px; height:38px; border-radius:50%;
        background:rgba(10,8,4,0.88); border:1px solid rgba(200,170,80,0.5);
        color:#d4b96a; font:700 18px/38px Georgia,serif;
        text-align:center; cursor:pointer; z-index:400;
        user-select:none; transition:background 0.2s;
      }
      #helpBtn:hover { background:rgba(30,22,8,0.95); }
      #helpOverlay {
        display:none; position:fixed; inset:0;
        background:rgba(0,0,0,0.85); z-index:1000;
        align-items:center; justify-content:center;
      }
      #helpOverlay.open { display:flex; }
      #helpBox {
        background:#13100a; border:1px solid rgba(200,170,80,0.4);
        border-radius:14px; width:min(560px,92vw);
        max-height:85vh; overflow-y:auto;
        padding:28px 32px; box-shadow:0 8px 40px rgba(0,0,0,0.7);
      }
      #helpBox::-webkit-scrollbar { width:4px; }
      #helpBox::-webkit-scrollbar-thumb { background:rgba(200,170,80,0.3); border-radius:4px; }
      #helpBox h2 {
        margin:0 0 20px; font:700 20px Georgia,serif;
        color:#d4b96a; letter-spacing:0.5px;
        padding-bottom:12px; border-bottom:1px solid rgba(200,170,80,0.2);
      }
      .help-section { margin-bottom:18px; }
      .help-section h3 {
        margin:0 0 8px; font:700 11px system-ui;
        color:#7a6a40; text-transform:uppercase; letter-spacing:0.8px;
      }
      .help-section ul {
        margin:0; padding:0 0 0 16px; list-style:none;
      }
      .help-section li {
        font:13px/1.8 Georgia,serif; color:#c8b890;
        padding-left:14px; position:relative;
      }
      .help-section li::before {
        content:'·'; position:absolute; left:0; color:#7a6a40;
      }
      #helpClose {
        display:block; width:100%; margin-top:20px; padding:11px;
        background:linear-gradient(135deg,#6a4a10,#8a6820);
        border:none; border-radius:8px; color:#ffe8a0;
        font:700 13px system-ui; cursor:pointer;
      }
      #helpClose:hover { opacity:0.85; }
      #helpHint {
        position:fixed; bottom:65px; right:14px;
        background:rgba(10,8,4,0.88); border:1px solid rgba(200,170,80,0.3);
        border-radius:6px; padding:5px 10px;
        color:#7a6a40; font:11px system-ui;
        pointer-events:none; opacity:0; transition:opacity 0.3s;
      }
      #helpHint.show { opacity:1; }
    `;
    document.head.appendChild(s);
  }

  function _buildDOM(zoneId) {
    // Help button
    const btn = document.createElement('div');
    btn.id = 'helpBtn';
    btn.textContent = '?';
    btn.title = 'Help (H)';
    document.body.appendChild(btn);

    // Hint label
    const hint = document.createElement('div');
    hint.id = 'helpHint';
    hint.textContent = 'Press H for help';
    document.body.appendChild(hint);

    // Show hint briefly on load
    setTimeout(() => { hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 3000); }, 1500);

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'helpOverlay';
    document.body.appendChild(overlay);

    const data = ROOM_HELP[zoneId] || ROOM_HELP.default;
    const sectionsHTML = data.sections.map(sec => `
      <div class="help-section">
        <h3>${sec.heading}</h3>
        <ul>${sec.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    `).join('');

    overlay.innerHTML = `
      <div id="helpBox">
        <h2>📖 ${data.title}</h2>
        ${sectionsHTML}
        <button id="helpClose">Got it</button>
      </div>
    `;

    btn.addEventListener('click', open);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.getElementById('helpClose').addEventListener('click', close);
  }

  function open() {
    document.getElementById('helpOverlay').classList.add('open');
  }

  function close() {
    document.getElementById('helpOverlay').classList.remove('open');
  }

  function init(zoneId) {
    _injectStyles();
    _buildDOM(zoneId);

    // H key
    document.addEventListener('keydown', e => {
      if (e.code === 'KeyH') {
        if (document.getElementById('helpOverlay').classList.contains('open')) close();
        else open();
      }
    });
  }

  return { init, open, close };
})();