// ============================================================
//  mystery-ui.js  —  Crowsnest Castle
//  Detective Jim "Bull" Smart's Notebook & Case UI
// ============================================================
const MysteryUI = (() => {

  let _scenario = null;
  let _zone     = "unknown";

  // ── INJECT STYLES ────────────────────────────────────────
  function _injectStyles() {
    if (document.getElementById("__mysteryStyles")) return;
    const s = document.createElement("style");
    s.id = "__mysteryStyles";
    s.textContent = `
      /* ── HUD counter ── */
      #bullHUD {
        position: fixed; top: 14px; right: 14px;
        background: rgba(10,8,4,0.88);
        border: 1px solid rgba(200,170,80,0.5);
        border-radius: 10px;
        padding: 8px 14px;
        color: #d4b96a;
        font: 700 13px/1.4 system-ui, Arial;
        z-index: 200;
        cursor: pointer;
        user-select: none;
        display: flex; gap: 10px; align-items: center;
        transition: background 0.2s;
      }
      #bullHUD:hover { background: rgba(30,22,8,0.95); }
      #newGameBtn {
        position: fixed; top: 14px; left: 14px;
        background: rgba(10,8,4,0.88);
        border: 1px solid rgba(200,170,80,0.4);
        border-radius: 10px; padding: 8px 14px;
        color: #d4b96a; font: 700 12px/1.4 system-ui, Arial;
        z-index: 200; cursor: pointer; user-select: none;
        transition: background 0.2s;
      }
      #newGameBtn:hover { background: rgba(80,20,20,0.95); color:#ff9090; border-color:rgba(200,80,80,0.5); }
      #newGameConfirm {
        display:none; position:fixed; inset:0;
        background:rgba(0,0,0,0.88); z-index:2000;
        align-items:center; justify-content:center;
      }
      #newGameConfirm.open { display:flex; }
      #newGameBox {
        background:#13100a; border:1px solid rgba(200,170,80,0.4);
        border-radius:14px; padding:32px 36px; max-width:400px;
        text-align:center; box-shadow:0 8px 40px rgba(0,0,0,0.8);
      }
      #newGameBox h3 { margin:0 0 12px; font:700 18px Georgia,serif; color:#d4b96a; }
      #newGameBox p { font:13px/1.6 Georgia,serif; color:#c8b890; margin:0 0 22px; }
      #newGameBox .ng-btns { display:flex; gap:10px; justify-content:center; }
      #newGameBox .ng-btns button { padding:10px 24px; border-radius:8px; border:none; font:700 13px system-ui; cursor:pointer; }
      #confirmNewGame { background:linear-gradient(135deg,#6a1a1a,#8a2020); color:#ffaaaa; }
      #confirmNewGame:hover { opacity:0.85; }
      #cancelNewGame { background:rgba(255,255,255,0.06); border:1px solid rgba(200,170,80,0.25)!important; color:#d4b96a; }
      #cancelNewGame:hover { background:rgba(255,255,255,0.1); }
      #bullHUD .hud-icon { font-size: 17px; }
      #bullHUD .hud-count { font-size: 12px; color: #a08840; }

      /* ── Notebook overlay ── */
      #bullNotebook {
        display: none;
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.82);
        z-index: 1000;
        align-items: center; justify-content: center;
      }
      #bullNotebook.open { display: flex; }
      #bullNotebookInner {
        background: #13100a;
        border: 1px solid rgba(200,170,80,0.4);
        border-radius: 14px;
        width: min(700px, 94vw);
        max-height: 88vh;
        display: flex; flex-direction: column;
        overflow: hidden;
        box-shadow: 0 8px 40px rgba(0,0,0,0.7);
      }

      /* ── Notebook header ── */
      #nbHeader {
        padding: 18px 22px 14px;
        border-bottom: 1px solid rgba(200,170,80,0.2);
        display: flex; justify-content: space-between; align-items: flex-start;
      }
      #nbTitle {
        font: 700 17px/1.2 Georgia, serif;
        color: #d4b96a;
        letter-spacing: 0.5px;
      }
      #nbSubtitle {
        font: 12px/1.5 system-ui, Arial;
        color: #7a6a40;
        margin-top: 3px;
      }
      #nbClose {
        background: none; border: none;
        color: #7a6a40; font-size: 22px;
        cursor: pointer; padding: 0 4px;
        line-height: 1;
      }
      #nbClose:hover { color: #d4b96a; }
      #nbScoreToggleRow {
        display:flex; align-items:center; gap:10px;
        padding:8px 22px; border-bottom:1px solid rgba(200,170,80,0.12);
        background:rgba(0,0,0,0.2);
      }
      #nbScoreToggleRow span { font:12px system-ui; color:#7a6a40; flex:1; }
      #nbScoreToggleRow .score-best { font:11px system-ui; color:#5a4a28; }
      .nb-score-switch { position:relative; width:38px; height:20px; flex-shrink:0; }
      .nb-score-switch input { opacity:0; width:0; height:0; }
      .nb-score-slider {
        position:absolute; inset:0; background:#2a2018;
        border:1px solid rgba(200,170,80,0.25); border-radius:20px; cursor:pointer;
        transition:background 0.2s;
      }
      .nb-score-slider:before {
        content:''; position:absolute; width:14px; height:14px;
        left:2px; top:2px; background:#7a6a40; border-radius:50%;
        transition:transform 0.2s, background 0.2s;
      }
      .nb-score-switch input:checked + .nb-score-slider { background:rgba(80,160,80,0.3); border-color:rgba(80,200,80,0.4); }
      .nb-score-switch input:checked + .nb-score-slider:before { transform:translateX(18px); background:#70c080; }

      /* ── Tabs ── */
      #nbTabs {
        display: flex; border-bottom: 1px solid rgba(200,170,80,0.15);
      }
      .nb-tab {
        flex: 1; padding: 8px 0;
        background: none; border: none;
        color: #7a6a40; font: 600 10px/1 system-ui, Arial;
        cursor: pointer; letter-spacing: 0.5px;
        text-transform: uppercase; transition: color 0.2s;
        border-bottom: 2px solid transparent;
      }
      .nb-tab:hover { color: #b09040; }
      .nb-tab.active { color: #d4b96a; border-bottom-color: #d4b96a; }

      /* ── Tab body ── */
      #nbBody {
        flex: 1; overflow-y: auto; padding: 18px 22px;
      }
      #nbBody::-webkit-scrollbar { width: 4px; }
      #nbBody::-webkit-scrollbar-track { background: transparent; }
      #nbBody::-webkit-scrollbar-thumb { background: rgba(200,170,80,0.3); border-radius: 4px; }

      /* ── Clue entries ── */
      .nb-clue {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(200,170,80,0.12);
        border-radius: 8px;
        padding: 12px 14px;
        margin-bottom: 10px;
        display: flex; gap: 10px; align-items: flex-start;
        cursor: pointer;
      }
      .nb-clue:hover { border-color: rgba(200,170,80,0.35); }
      #clueZoomOverlay {
        display: none; position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.92); align-items: center; justify-content: center;
      }
      #clueZoomOverlay.open { display: flex; }
      #clueZoomBox {
        background: #12100a; border: 1px solid rgba(200,170,80,0.45);
        border-radius: 16px; width: min(680px,92vw); max-height: 80vh;
        overflow-y: auto; padding: 40px 48px; position: relative;
        box-shadow: 0 12px 80px rgba(0,0,0,0.95);
      }
      #clueZoomClose {
        position: absolute; top: 16px; right: 20px; background: none; border: none;
        color: #7a6a40; font-size: 28px; cursor: pointer;
      }
      #clueZoomClose:hover { color: #d4b96a; }
      #clueZoomType { font: 700 12px system-ui; color: #7a6a40; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
      #clueZoomText { font: 20px/1.8 Georgia,serif; color: #e8d5b0; }
      .nb-clue-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
      .nb-clue-body { flex: 1; }
      .nb-clue-type {
        font: 700 10px/1 system-ui, Arial;
        color: #7a6a40; text-transform: uppercase;
        letter-spacing: 0.8px; margin-bottom: 5px;
      }
      .nb-clue-text {
        font: 13px/1.6 Georgia, serif;
        color: #c8b890;
      }
      .nb-clue-del {
        background: none; border: none;
        color: #4a3a20; font-size: 16px;
        cursor: pointer; padding: 0; line-height: 1;
        flex-shrink: 0;
      }
      .nb-clue-del:hover { color: #c05030; }
      .nb-empty {
        color: #5a4a28; font: italic 13px/2 Georgia, serif;
        text-align: center; padding: 30px 0;
      }

      /* ── Dossier ── */
      .nb-suspect {
        border-bottom: 1px solid rgba(200,170,80,0.1);
        padding: 10px 0;
      }
      .nb-suspect:last-child { border-bottom: none; }
      .nb-suspect-name { font: 700 13px/1.3 system-ui, Arial; color: #d4b96a; }
      .nb-suspect-role { font: 11px/1.4 system-ui, Arial; color: #7a6a40; }
      .nb-suspect-motive { font: italic 12px/1.5 Georgia, serif; color: #a09060; margin-top: 3px; }

      /* ── Accusation panel ── */
      #nbAccuse select {
        display: block; width: 100%;
        background: #ffffff;
        border: 1px solid rgba(200,170,80,0.25);
        border-radius: 6px; color: #000000;
        padding: 8px 10px; margin-bottom: 12px;
        font: 13px system-ui, Arial;
      }
      #nbAccuse label {
        display: block; font: 700 11px system-ui, Arial;
        color: #7a6a40; text-transform: uppercase;
        letter-spacing: 0.6px; margin-bottom: 4px;
      }
      #nbAccuseBtn {
        width: 100%; padding: 12px;
        background: linear-gradient(135deg, #8a6820, #b08830);
        border: none; border-radius: 8px;
        color: #ffe8a0; font: 700 14px system-ui, Arial;
        cursor: pointer; letter-spacing: 0.5px;
        margin-top: 6px; transition: opacity 0.2s;
      }
      #nbAccuseBtn:disabled { opacity: 0.4; cursor: not-allowed; }
      #nbAccuseBtn:not(:disabled):hover { opacity: 0.85; }
      #nbAccuseNote {
        font: italic 12px/1.5 Georgia, serif;
        color: #7a6a40; text-align: center;
        margin-top: 10px;
      }
      #nbAccuseResult {
        margin-top: 14px; padding: 14px;
        border-radius: 8px; display: none;
        font: 13px/1.6 Georgia, serif;
      }
      #nbAccuseResult.correct {
        background: rgba(40,100,40,0.3);
        border: 1px solid rgba(80,180,80,0.4);
        color: #90e090; display: block;
      }
      #nbAccuseResult.wrong {
        background: rgba(100,30,20,0.3);
        border: 1px solid rgba(200,60,40,0.4);
        color: #e09080; display: block;
      }

      /* ── Clue popup ── */
      #cluePopup {
        display: none;
        position: fixed; bottom: 80px; left: 50%;
        transform: translateX(-50%);
        background: rgba(10,8,4,0.96);
        border: 1px solid rgba(200,170,80,0.5);
        border-radius: 12px;
        padding: 18px 22px;
        max-width: 480px; width: 90vw;
        z-index: 500;
        box-shadow: 0 4px 24px rgba(0,0,0,0.6);
        animation: popIn 0.25s ease;
      }
      @keyframes popIn {
        from { opacity:0; transform: translateX(-50%) translateY(12px); }
        to   { opacity:1; transform: translateX(-50%) translateY(0); }
      }
      #cluePopup.open { display: block; }
      #cluePopupType {
        font: 700 10px system-ui, Arial;
        color: #7a6a40; text-transform: uppercase;
        letter-spacing: 0.8px; margin-bottom: 8px;
      }
      #cluePopupText {
        font: 13px/1.6 Georgia, serif; color: #c8b890;
        margin-bottom: 14px;
      }
      #cluePopupBtns { display: flex; gap: 8px; }
      #cluePopupAdd {
        flex: 1; padding: 9px;
        background: linear-gradient(135deg, #8a6820, #b08830);
        border: none; border-radius: 7px;
        color: #ffe8a0; font: 700 12px system-ui, Arial;
        cursor: pointer;
      }
      #cluePopupAdd:hover { opacity: 0.85; }
      #cluePopupDiscard {
        padding: 9px 14px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 7px;
        color: #7a6a40; font: 12px system-ui, Arial;
        cursor: pointer;
      }
      #cluePopupDiscard:hover { color: #c05030; }

      /* ── Bull intro ── */
      #bullIntro {
        display: none;
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.95);
        z-index: 2000;
        align-items: center; justify-content: center;
      }
      #bullIntro.open { display: flex; }
      #bullIntroBox {
        background: #0e0c08;
        border: 1px solid rgba(200,170,80,0.35);
        border-radius: 16px;
        padding: 36px 40px;
        max-width: 620px; width: 92vw;
        text-align: center;
        box-shadow: 0 12px 60px rgba(0,0,0,0.8);
      }
      #bullIntroBox h1 {
        font: 700 38px/1.2 Georgia, serif;
        color: #d4b96a; margin: 0 0 6px;
        letter-spacing: 2px;
      }
      #bullIntroBox .intro-sub {
        font: 700 15px system-ui, Arial;
        color: #7a6a40; text-transform: uppercase;
        letter-spacing: 2px; margin-bottom: 22px;
      }
      #bullIntroBox p {
        font: 16px/1.8 Georgia, serif;
        color: #b0a078; margin-bottom: 16px;
      }
      #bullIntroBox .intro-detail {
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(200,170,80,0.15);
        border-radius: 8px; padding: 14px 18px;
        margin-bottom: 22px;
        font: 15px/1.8 Georgia, serif; color: #8a7a50;
      }
      #bullIntroBtn {
        padding: 12px 36px;
        background: linear-gradient(135deg, #8a6820, #b08830);
        border: none; border-radius: 9px;
        color: #ffe8a0; font: 700 14px system-ui, Arial;
        cursor: pointer; letter-spacing: 0.5px;
      }
      #bullIntroBtn:hover { opacity: 0.85; }
    `;
    document.head.appendChild(s);
  }

  // ── BUILD DOM ────────────────────────────────────────────
  function _buildDOM() {
    if (document.getElementById("bullHUD")) return;

    // HUD button
    const hud = document.createElement("div");
    hud.id = "bullHUD";
    hud.innerHTML = `<span class="hud-icon">📓</span> Bull's Notebook <span class="hud-count" id="bullClueCount">0 / 40</span>`;
    hud.addEventListener("click", openNotebook);
    document.body.appendChild(hud);

    // New Game button
    const ngBtn = document.createElement("div");
    ngBtn.id = "newGameBtn";
    ngBtn.textContent = "🔄 New Game";
    ngBtn.addEventListener("click", () => document.getElementById("newGameConfirm").classList.add("open"));
    document.body.appendChild(ngBtn);

    // New Game confirm dialog
    const ngConfirm = document.createElement("div");
    ngConfirm.id = "newGameConfirm";
    ngConfirm.innerHTML = `
      <div id="newGameBox">
        <h3>Start a New Case?</h3>
        <p>This will generate a brand new murder scenario.<br>All current clues and progress will be lost.</p>
        <div class="ng-btns">
          <button id="confirmNewGame">Start New Case</button>
          <button id="cancelNewGame">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(ngConfirm);
    document.getElementById("cancelNewGame").addEventListener("click", () => ngConfirm.classList.remove("open"));
    document.getElementById("confirmNewGame").addEventListener("click", () => {
      localStorage.removeItem("crowsnest_scenario_v2");
      localStorage.removeItem("crowsnest_intro_seen");
      localStorage.removeItem("crowsnest_board_v1");
      localStorage.removeItem("crowsnest_bench_v1");
      localStorage.removeItem("crowsnest_ev_notes");
      ngConfirm.classList.remove("open");
      // Reload current page to start fresh
      window.location.reload();
    });

    // Notebook overlay
    const nb = document.createElement("div");
    nb.id = "bullNotebook";
    nb.innerHTML = `
      <div id="bullNotebookInner">
        <div id="nbHeader">
          <div>
            <div id="nbTitle">📓 Bull's Notebook</div>
            <div id="nbSubtitle">Detective Jim "Bull" Smart — Crowsnest Castle</div>
          </div>
          <button id="nbClose" title="Close">✕</button>
        </div>
        <div id="nbScoreToggleRow">
          <span>🏆 Scoring</span>
          <span class="score-best" id="nbScoreBest"></span>
          <label class="nb-score-switch" title="Toggle scoring on/off">
            <input type="checkbox" id="nbScoreCheck">
            <span class="nb-score-slider"></span>
          </label>
        </div>
        <div id="nbTabs">
          <button class="nb-tab active" data-tab="clues">Evidence</button>
          <button class="nb-tab" data-tab="victim">👻 Victim</button>
          <button class="nb-tab" data-tab="dossier">Suspects</button>
          <button class="nb-tab" data-tab="weapons">⚔ Weapons</button>
          <button class="nb-tab" data-tab="accuse">Accuse</button>
          <button class="nb-tab" data-tab="notes">Notes</button>
        </div>
        <div id="nbBody"></div>
      </div>
    `;
    document.body.appendChild(nb);

    // Clue zoom modal
    const zoomEl = document.createElement('div');
    zoomEl.id = 'clueZoomOverlay';
    zoomEl.innerHTML = `<div id="clueZoomBox"><button id="clueZoomClose">✕</button><div id="clueZoomType"></div><div id="clueZoomText"></div></div>`;
    document.body.appendChild(zoomEl);
    document.getElementById('clueZoomClose').onclick = () => zoomEl.classList.remove('open');
    zoomEl.addEventListener('click', e => { if (e.target === zoomEl) zoomEl.classList.remove('open'); });
    document.getElementById("nbClose").addEventListener("click", closeNotebook);

    // Score toggle switch
    const _scoreCheck = document.getElementById("nbScoreCheck");
    const _scoreBest  = document.getElementById("nbScoreBest");
    const _scoreOn    = localStorage.getItem("crowsnest_score") === "1";
    _scoreCheck.checked = _scoreOn;
    if (typeof MysteryScore !== 'undefined') {
      const best = MysteryScore.getBest();
      if (best) _scoreBest.textContent = `Best: ${best.score} pts`;
    }
    _scoreCheck.addEventListener("change", () => {
      localStorage.setItem("crowsnest_score", _scoreCheck.checked ? "1" : "0");
      if (_scoreCheck.checked && typeof MysteryScore !== 'undefined') {
        MysteryScore.start(_scenario?.cluesRequired || 10);
      }
    });
    nb.addEventListener("click", e => { if (e.target === nb) closeNotebook(); });
    nb.querySelectorAll(".nb-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        nb.querySelectorAll(".nb-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        _renderTab(btn.dataset.tab);
      });
    });

    // Clue popup
    const popup = document.createElement("div");
    popup.id = "cluePopup";
    popup.innerHTML = `
      <div id="cluePopupType"></div>
      <div id="cluePopupText"></div>
      <div id="cluePopupBtns">
        <button id="cluePopupAdd">Add to Notebook</button>
        <button id="cluePopupDiscard">Discard</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Bull intro
    const intro = document.createElement("div");
    intro.id = "bullIntro";
    document.body.appendChild(intro);
  }

  // ── TAB RENDERING ────────────────────────────────────────
  function _renderTab(tab) {
    const body = document.getElementById("nbBody");
    if (!body) return;
    if (!_scenario && tab !== "weapons") return;

    if (tab === "clues") {
      const found = (_scenario.clues || []).filter(c => c.found);
      if (found.length === 0) {
        body.innerHTML = `<div class="nb-empty">No evidence collected yet.<br>Explore the castle and press <b>F</b> to examine items.</div>`;
        return;
      }
      const icons = { document: "📄", physical: "🔍", witness: "💬", coroner: "🔬" };
      body.innerHTML = found.map((c, i) => `
        <div class="nb-clue" data-idx="${i}">
          <div class="nb-clue-icon">${icons[c.type] || "📌"}</div>
          <div class="nb-clue-body">
            <div class="nb-clue-type">${c.type}</div>
            <div class="nb-clue-text">${c.text}</div>
          </div>
          <button class="nb-clue-del" data-idx="${i}" title="Remove">✕</button>
        </div>
      `).join("");
      body.querySelectorAll(".nb-clue").forEach((card, i) => {
        card.addEventListener("click", e => {
          if (e.target.classList.contains("nb-clue-del")) return;
          const c = found[i];
          const typeLabels = { document: "📄 Document", physical: "🔍 Physical Evidence", witness: "💬 Witness Account", coroner: "🔬 Coroner's Report" };
          document.getElementById('clueZoomType').textContent = typeLabels[c.type] || c.type;
          document.getElementById('clueZoomText').textContent = c.text;
          document.getElementById('clueZoomOverlay').classList.add('open');
        });
      });
      body.querySelectorAll(".nb-clue-del").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx);
          _scenario.clues.splice(idx, 1);
          MysteryState.saveOnEvent(_scenario);
          updateHUDCount();
          _renderTab("clues");
        });
      });
    }

    if (tab === "dossier") {
      const bench = JSON.parse(localStorage.getItem("crowsnest_bench_v1") || "{}");
      body.innerHTML = MysteryEngine.SUSPECTS.map(p => {
        const isSuspect = bench['suspect_' + p.id] === true;
        const isInnocent = bench['innocent_suspect_' + p.id] === true;
        return `
        <div class="nb-suspect" data-suspect-id="${p.id}" style="cursor:pointer;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
            <div class="nb-suspect-name">${p.name}</div>
            <div style="display:flex; gap:8px; font:11px system-ui; color:#7a6a40;">
              <label style="display:flex; align-items:center; gap:3px; cursor:pointer; white-space:nowrap;">
                <input type="checkbox" class="nb-suspect-cb" data-id="${p.id}" data-type="suspect" ${isSuspect ? 'checked' : ''} style="width:14px; height:14px; accent-color:#d4a820; margin:0;">
                <span>Suspect</span>
              </label>
              <label style="display:flex; align-items:center; gap:3px; cursor:pointer; white-space:nowrap;">
                <input type="checkbox" class="nb-innocent-cb" data-id="${p.id}" data-type="innocent" ${isInnocent ? 'checked' : ''} style="width:14px; height:14px; accent-color:#4a8a4a; margin:0;">
                <span>Innocent</span>
              </label>
            </div>
          </div>
          <div class="nb-suspect-role">${p.role}</div>
          <div class="nb-suspect-motive">Possible motive: ${p.motive}</div>
          <div style="margin-top:8px; font:12px system-ui; color:#d4b96a;">📋 Click to interview</div>
        </div>
      `;
      }).join("");
      
      // Add listeners to checkboxes
      body.querySelectorAll('.nb-suspect-cb').forEach(cb => {
        cb.addEventListener('change', e => {
          const b = JSON.parse(localStorage.getItem("crowsnest_bench_v1") || "{}");
          b['suspect_' + e.target.dataset.id] = e.target.checked;
          localStorage.setItem("crowsnest_bench_v1", JSON.stringify(b));
        });
        cb.addEventListener('mousedown', e => e.stopPropagation());
      });
      
      body.querySelectorAll('.nb-innocent-cb').forEach(cb => {
        cb.addEventListener('change', e => {
          const b = JSON.parse(localStorage.getItem("crowsnest_bench_v1") || "{}");
          b['innocent_suspect_' + e.target.dataset.id] = e.target.checked;
          localStorage.setItem("crowsnest_bench_v1", JSON.stringify(b));
        });
        cb.addEventListener('mousedown', e => e.stopPropagation());
      });
      
      // Add interview click handler
      body.querySelectorAll('.nb-suspect').forEach(card => {
        card.addEventListener('click', e => {
          if(e.target.tagName === 'INPUT') return;
          const suspectId = card.dataset.suspectId;
          const suspect = MysteryEngine.SUSPECTS.find(s => s.id === suspectId);
          if(suspect) _openSuspectInterview(suspect);
        });
      });
    }

    if (tab === "weapons") {
      const bench = JSON.parse(localStorage.getItem("crowsnest_bench_v1") || "{}");
      const selectedWeapon = bench['selected_weapon'] || '';
      
      const weaponOptions = MysteryEngine.WEAPON_NAMES.map(w => 
        `<option value="${w}" ${selectedWeapon === w ? 'selected' : ''}>${w}</option>`
      ).join('');
      
      body.innerHTML = `
        <div style="margin-bottom:20px;">
          <label style="font:13px system-ui; color:#d4b96a; display:block; margin-bottom:8px;">Select weapon:</label>
          <select id="weaponSelect" style="width:100%; padding:10px; background:#2a2620; color:#d4b96a; border:1px solid rgba(180,150,60,0.3); border-radius:6px; font:13px system-ui;">
            <option value="">— Choose a weapon —</option>
            ${weaponOptions}
          </select>
        </div>
        
        <div id="weaponInfo" style="display:${selectedWeapon ? 'block' : 'none'}; margin-bottom:20px; padding:16px; background:rgba(180,150,60,0.08); border:1px solid rgba(180,150,60,0.2); border-radius:8px;">
          <div style="font:700 14px system-ui; color:#d4b96a; margin-bottom:12px;">🗡 ${selectedWeapon}</div>
          <div id="weaponMotive" style="font:12px system-ui; color:#a09060; margin-bottom:12px;"></div>
          <label style="display:flex; align-items:center; gap:8px; cursor:pointer; margin-top:12px; padding-top:12px; border-top:1px solid rgba(180,150,60,0.2);">
            <input type="checkbox" id="weaponCheckbox" style="width:18px; height:18px; cursor:pointer; accent-color:#d4a820;">
            <span style="font:12px system-ui; color:#d4b96a;">Mark as confirmed weapon</span>
          </label>
        </div>
      `;
      
      const select = document.getElementById('weaponSelect');
      const weaponInfo = document.getElementById('weaponInfo');
      const weaponMotive = document.getElementById('weaponMotive');
      const weaponCheckbox = document.getElementById('weaponCheckbox');
      
      function updateWeapon() {
        const weapon = select.value;
        if(weapon) {
          const motiveText = weapon.includes('Poison') || weapon.includes('Arsenic') || weapon.includes('Strychnine') || weapon.includes('Cyanide') 
            ? '💀 Premeditated — required planning and preparation'
            : '⚡ Opportunistic — weapon seized in the moment';
          weaponMotive.textContent = motiveText;
          const isChecked = bench['weapon_' + weapon] === true;
          weaponCheckbox.checked = isChecked;
          weaponInfo.style.display = 'block';
        } else {
          weaponInfo.style.display = 'none';
        }
      }
      
      select.addEventListener('change', () => {
        const b = JSON.parse(localStorage.getItem("crowsnest_bench_v1") || "{}");
        b['selected_weapon'] = select.value;
        localStorage.setItem("crowsnest_bench_v1", JSON.stringify(b));
        bench['selected_weapon'] = select.value;
        updateWeapon();
      });
      
      weaponCheckbox.addEventListener('change', () => {
        const b = JSON.parse(localStorage.getItem("crowsnest_bench_v1") || "{}");
        b['weapon_' + select.value] = weaponCheckbox.checked;
        localStorage.setItem("crowsnest_bench_v1", JSON.stringify(b));
        bench['weapon_' + select.value] = weaponCheckbox.checked;
      });
      
      updateWeapon();
      return;
    }

    if (tab === "victim") {
      if (!_scenario) { body.innerHTML = "No case loaded."; return; }
      const v = _scenario.victim;
      const coronerClues = (_scenario.clues || []).filter(c => c.found && c.type === 'coroner');
      body.innerHTML = `
        <div class="nb-suspect" style="margin-bottom:20px;">
          <div class="nb-suspect-name">👻 ${v.name}</div>
          <div class="nb-suspect-role">${v.role}</div>
          <div style="margin-top:12px; font:13px Georgia,serif; color:#c8b890; line-height:1.6;">
            <div style="margin-bottom:8px;"><span style="color:#7a6a40;">📍 Found in:</span> ${_scenario.crimeRoom?.name || 'Unknown'}</div>
            <div style="margin-bottom:8px;"><span style="color:#7a6a40;">🕐 Approx. time of death:</span> ${_scenario.timeOfDeath || 'Unknown'}</div>
            ${_scenario.weaponVerified ? `<div><span style="color:#7a6a40;">🔪 Weapon:</span> <b style="color:#88dd88;">${_scenario.weapon}</b></div>` : ''}
          </div>
        </div>
        <div style="border-top:1px solid rgba(200,170,80,0.15); padding-top:16px;">
          <div style="font:700 14px Georgia,serif; color:#d4b96a; margin-bottom:12px;">Autopsy Findings</div>
          ${coronerClues.length === 0 
            ? '<div style="font:13px system-ui; color:#7a6a40;">No findings yet. Find 🔬 coroner clues in the castle.</div>'
            : coronerClues.map(c => `<div style="margin-bottom:10px; font:13px Georgia,serif; color:#c8b890;">• ${c.text}</div>`).join('')
          }
        </div>
        ${_scenario.solved ? `
          <div style="border-top:1px solid rgba(200,170,80,0.15); padding-top:16px; margin-top:16px;">
            <div style="font:700 14px Georgia,serif; color:#d4b96a; margin-bottom:12px;">✅ Case Solved</div>
            <div style="font:13px Georgia,serif; color:#c8b890; line-height:1.6;">
              <div style="margin-bottom:8px;"><span style="color:#7a6a40;">👤 Perpetrator:</span> ${_scenario.killer.name}</div>
            </div>
          </div>
        ` : ''}
      `;
    }

    if (tab === "notes") {
      const NOTES_KEY = "crowsnest_bull_notes";
      const savedNotes = localStorage.getItem(NOTES_KEY) || "";
      body.innerHTML = `
        <div style="display:flex;flex-direction:column;height:100%;gap:8px;padding:4px 0;">
          <textarea id="bullNotesArea" placeholder="Write your notes here..." style="flex:1;width:100%;box-sizing:border-box;background:rgba(255,248,220,0.07);color:#e8ddb0;border:1px solid rgba(180,150,60,0.35);border-radius:8px;padding:12px;font:14px/1.6 Georgia,serif;resize:none;outline:none;min-height:320px;"></textarea>
          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <span id="bullNotesSaved" style="font-size:11px;color:#70a870;align-self:center;opacity:0;transition:opacity 0.5s;">Saved</span>
            <button id="bullNotesClear" style="padding:5px 14px;border-radius:7px;border:1px solid rgba(255,80,80,0.35);background:rgba(80,20,20,0.6);color:#ffaaaa;cursor:pointer;font-size:12px;">Clear</button>
          </div>
        </div>
      `;
      const area = document.getElementById("bullNotesArea");
      area.value = savedNotes;
      const savedLbl = document.getElementById("bullNotesSaved");
      let _saveTimer;
      area.addEventListener("input", () => {
        clearTimeout(_saveTimer);
        _saveTimer = setTimeout(() => {
          localStorage.setItem(NOTES_KEY, area.value);
          savedLbl.style.opacity = "1";
          setTimeout(() => { savedLbl.style.opacity = "0"; }, 1500);
        }, 600);
      });
      document.getElementById("bullNotesClear").addEventListener("click", () => {
        if (confirm("Clear all notes?")) { area.value = ""; localStorage.removeItem(NOTES_KEY); }
      });
    }

    if (tab === "accuse") {
      const found = Math.min((_scenario.clues || []).filter(c => c.found).length, _scenario.cluesRequired || 40);
      const ready = found >= _scenario.cluesRequired;
      const note  = ready
        ? "You have gathered enough evidence. Make your accusation carefully — you only expose your wrong fields, not the answer."
        : `You need <b>${_scenario.cluesRequired - found}</b> more piece${_scenario.cluesRequired - found !== 1 ? "s" : ""} of evidence before you can accuse.`;

      const suspectOptions = MysteryEngine.SUSPECTS.map(p =>
        `<option value="${p.id}">${p.name} — ${p.role}</option>`
      ).join("");
      const roomOptions = MysteryEngine.ROOMS.map(r =>
        `<option value="${r.id}">${r.name} (Floor ${r.floor})</option>`
      ).join("");
      const weaponOptions = MysteryEngine.WEAPON_NAMES.map(w =>
        `<option value="${w}">${w}</option>`
      ).join("");
      const coronerFound = (_scenario.clues || []).filter(c => c.found && c.type === 'coroner');
      const coronerSummary = coronerFound.length > 0
        ? coronerFound.map(c => `<div style="margin-bottom:5px;padding:5px 8px;background:rgba(100,200,200,0.06);border-left:2px solid rgba(100,200,200,0.3);border-radius:3px;font:italic 11px Georgia,serif;color:#7aadad;">🔬 ${c.text.slice(0,120)}</div>`).join('')
        : '<div style="color:#5a4a28;font:italic 12px Georgia,serif;padding:4px 0;">No autopsy findings collected yet.</div>';
      body.innerHTML = `
        <div id="nbAccuse">
          <label>Weapon <span style="font-size:11px;color:#7a6a40;font-weight:normal;">(check this first based on coroner findings)</span></label>
          <div style="margin-bottom:8px;">${coronerSummary}</div>
          <div style="display:flex;gap:8px;margin-bottom:16px;">
            <select id="accWeapon" style="flex:1;background:#2a2620;border:1px solid rgba(200,170,80,0.25);border-radius:6px;color:#d4b96a;padding:8px 10px;font:13px system-ui,Arial;box-sizing:border-box;">
              <option value="">— Select weapon —</option>
              ${weaponOptions}
            </select>
            <button id="nbCheckWeapon" style="padding:8px 14px;background:rgba(100,140,100,0.3);color:#99ff99;border:1px solid rgba(100,140,100,0.5);border-radius:6px;cursor:pointer;font-size:12px;white-space:nowrap;">✓ Check</button>
          </div>
          <div id="nbWeaponResult" style="margin-bottom:16px;"></div>
          
          <label>Suspect</label>
          <select id="accSuspect">${suspectOptions}</select>
          <label>Crime Scene</label>
          <select id="accRoom">${roomOptions}</select>
          
          <button id="nbAccuseBtn" ${ready ? "" : "disabled"}>Make Full Accusation</button>
          <div id="nbAccuseNote">${note}</div>
          <div id="nbAccuseResult"></div>
        </div>
      `;

      // Weapon check button
      document.getElementById("nbCheckWeapon").addEventListener("click", () => {
        const wep = document.getElementById("accWeapon").value.trim();
        if (!wep) {
          document.getElementById("nbWeaponResult").innerHTML = `<div style="color:#cc8844;">Select a weapon first.</div>`;
          return;
        }
        const isCorrect = wep.toLowerCase() === _scenario.weapon.toLowerCase();
        const resultEl = document.getElementById("nbWeaponResult");
        if (isCorrect) {
          // Save weapon to scenario
          _scenario.weaponVerified = true;
          if (typeof MysteryState !== 'undefined') MysteryState.saveOnEvent(_scenario);
          resultEl.innerHTML = `✅ <b>Weapon is correct!</b> The murder weapon was a <b>${_scenario.weapon}</b>. Saved to Victim card.`;
          resultEl.style.color = '#88dd88';
          // Force refresh of Victim tab if visible
          const victimTab = document.querySelector('.nb-tab[data-tab="victim"]');
          if (victimTab && victimTab.classList.contains('active')) {
            _renderTab('victim');
          }
        } else {
          resultEl.innerHTML = `❌ Incorrect weapon. Keep investigating.`;
          resultEl.style.color = '#ff8888';
        }
        resultEl.style.font = '13px Georgia,serif';
      });

      if (ready) {
        document.getElementById("nbAccuseBtn").addEventListener("click", () => {
          const sid = document.getElementById("accSuspect").value;
          const rid = document.getElementById("accRoom").value;
          const wep = document.getElementById("accWeapon").value.trim();
          const result = MysteryEngine.accuse(_scenario, sid, rid, wep);
          const el = document.getElementById("nbAccuseResult");
          if (result.correct) {
            _scenario.solved = true;
            MysteryState.saveOnEvent(_scenario);
            el.className = "correct";
            el.innerHTML = `✅ <b>Case closed.</b> Well done, Bull.<br>
              The murderer was <b>${_scenario.killer.name}</b>, in the <b>${_scenario.crimeRoom.name}</b>, with a <b>${_scenario.weapon}</b>.<br><br>
              <em>"${_scenario.killer.motive}"</em>`;
            if (typeof MysteryScore !== 'undefined') {
              const cluesFound = (_scenario.clues || []).filter(c => c.found).length;
              MysteryScore.recordClueCollected(cluesFound);
              const scoreResult = MysteryScore.finish(_scenario);
              MysteryScore.showEndCard(_scenario, scoreResult);
            }
          } else {
            el.className = "wrong";
            const wrong = result.wrongFields.map(f => `<b>${f}</b>`).join(", ");
            el.innerHTML = `❌ Incorrect. Wrong: ${wrong}. Keep investigating.`;
            if (typeof MysteryScore !== 'undefined') MysteryScore.recordWrongGuess();
          }
        });
      }
    }
  }


  function _openSuspectInterview(suspect) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:2000;';
    
    const interviewQuestions = [
      `Where were you at approximately ${_scenario?.timeOfDeath || '11:00 PM'} on the night of the murder?`,
      `What was your relationship with ${_scenario?.victim?.name || 'the victim'}?`,
      `Do you know of anyone who had reason to harm ${_scenario?.victim?.name || 'the victim'}?`,
      `Have you noticed anything unusual in the castle recently?`,
      `Can anyone confirm your whereabouts that evening?`,
      `Did you have any dealings with ${_scenario?.victim?.name || 'the victim'} regarding money or personal matters?`,
      `Have you seen anyone acting suspiciously in the days before the murder?`,
      `What do you know about the ${_scenario?.weapon || 'murder weapon'} that was used?`,
    ];
    
    const answers = {
      [interviewQuestions[0]]: `I was in my room reading. I retire early — I heard nothing unusual.`,
      [interviewQuestions[1]]: `A casual acquaintance, nothing more. We exchanged pleasantries at meals.`,
      [interviewQuestions[2]]: `I have no idea. ${suspect.name} seemed well-liked, though I kept to myself.`,
      [interviewQuestions[3]]: `Nothing that I noticed. The castle runs smoothly enough.`,
      [interviewQuestions[4]]: `My... companion can vouch for me. We were together that night.`,
      [interviewQuestions[5]]: `None whatsoever. I barely knew them.`,
      [interviewQuestions[6]]: `Several guests seemed on edge lately. Whispers in corridors. Nothing concrete.`,
      [interviewQuestions[7]]: `I know nothing of weapons. Such matters are not my concern.`,
    };
    
    let currentQuestion = 0;
    
    modal.innerHTML = `
      <div style="background:#0d0b07;border:1px solid rgba(200,170,80,0.4);border-radius:14px;padding:32px;max-width:500px;color:#d4b96a;font:14px Georgia,serif;">
        <div style="font:700 20px Georgia,serif;margin-bottom:8px;">${suspect.name}</div>
        <div style="font:13px system-ui;color:#7a6a40;margin-bottom:20px;">${suspect.role}</div>
        
        <div id="interviewQuestion" style="margin-bottom:20px;color:#c8b890;line-height:1.6;min-height:60px;"></div>
        <div id="interviewAnswer" style="margin-bottom:20px;padding:12px;background:rgba(180,150,60,0.08);border-left:2px solid rgba(180,150,60,0.3);border-radius:6px;color:#a09060;display:none;line-height:1.6;font-style:italic;"></div>
        
        <div style="display:flex;gap:8px;">
          <button id="prevBtn" style="padding:8px 16px;background:rgba(100,100,100,0.3);color:#999;border:1px solid rgba(100,100,100,0.5);border-radius:6px;cursor:pointer;">← Previous</button>
          <button id="nextBtn" style="padding:8px 16px;background:rgba(100,140,100,0.3);color:#99ff99;border:1px solid rgba(100,140,100,0.5);border-radius:6px;cursor:pointer;">Next →</button>
          <button id="closeInterviewBtn" style="padding:8px 16px;background:rgba(100,100,100,0.3);color:#999;border:1px solid rgba(100,100,100,0.5);border-radius:6px;cursor:pointer;margin-left:auto;">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    function showQuestion(idx) {
      currentQuestion = Math.max(0, Math.min(idx, interviewQuestions.length - 1));
      document.getElementById('interviewQuestion').textContent = interviewQuestions[currentQuestion];
      document.getElementById('interviewAnswer').textContent = answers[interviewQuestions[currentQuestion]];
      document.getElementById('interviewAnswer').style.display = 'block';
      document.getElementById('prevBtn').disabled = currentQuestion === 0;
      document.getElementById('nextBtn').disabled = currentQuestion === interviewQuestions.length - 1;
    }
    
    showQuestion(0);
    
    document.getElementById('prevBtn').addEventListener('click', () => showQuestion(currentQuestion - 1));
    document.getElementById('nextBtn').addEventListener('click', () => showQuestion(currentQuestion + 1));
    document.getElementById('closeInterviewBtn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if(e.target === modal) modal.remove(); });
  }

  // ── NOTEBOOK OPEN / CLOSE ────────────────────────────────
  function openNotebook() {
    document.getElementById("bullNotebook").classList.add("open");
    // Reset to clues tab
    document.querySelectorAll(".nb-tab").forEach(b => b.classList.remove("active"));
    const first = document.querySelector('.nb-tab[data-tab="clues"]');
    if (first) first.classList.add("active");
    _renderTab("clues");
  }

  function closeNotebook() {
    document.getElementById("bullNotebook").classList.remove("open");
  }

  // ── CLUE POPUP ───────────────────────────────────────────
  let _pendingClue = null;

  function showCluePopup(clue) {
    _pendingClue = clue;
    const icons = { document: "📄", physical: "🔍", witness: "💬" };
    document.getElementById("cluePopupType").textContent =
      (icons[clue.type] || "📌") + "  " + (clue.type || "evidence").toUpperCase();
    document.getElementById("cluePopupText").textContent = clue.text;

    const popup = document.getElementById("cluePopup");
    popup.classList.add("open");

    const addBtn  = document.getElementById("cluePopupAdd");
    const discard = document.getElementById("cluePopupDiscard");

    const doAdd = () => {
      if (_pendingClue && _scenario) {
        // Avoid duplicates
        const already = _scenario.clues.some(c => c.id === _pendingClue.id);
        if (!already) {
          _scenario.clues.push(_pendingClue);
          MysteryState.saveOnEvent(_scenario);
        }
        updateHUDCount();
      }
      popup.classList.remove("open");
      _pendingClue = null;
    };
    const doDiscard = () => {
      popup.classList.remove("open");
      _pendingClue = null;
    };

    // Re-attach fresh listeners
    addBtn.replaceWith(addBtn.cloneNode(true));
    discard.replaceWith(discard.cloneNode(true));
    document.getElementById("cluePopupAdd").addEventListener("click", doAdd);
    document.getElementById("cluePopupDiscard").addEventListener("click", doDiscard);
  }

  // ── HUD COUNT ────────────────────────────────────────────
  function updateHUDCount() {
    const el = document.getElementById("bullClueCount");
    if (!el || !_scenario) return;
    const found = (_scenario.clues || []).filter(c => c.found).length;
    const req   = _scenario.cluesRequired || 40;
    el.textContent = `${found} / ${req}`;
    el.style.color = found >= req ? "#70d070" : "#a08840";
  }

  // ── ZONE ─────────────────────────────────────────────────
  function setZone(zoneId) {
    _zone = zoneId;
  }

  // ── INTRO SCREEN ─────────────────────────────────────────
  function _showIntro() {
    const intro = document.getElementById("bullIntro");
    if (!intro || !_scenario) return;
    // Only show once per scenario — track by generatedAt timestamp
    const seenKey = "crowsnest_intro_seen";
    const seenAt  = localStorage.getItem(seenKey);
    if (seenAt === String(_scenario.generatedAt)) return;

    const v = _scenario.victim;
    intro.innerHTML = `
      <div id="bullIntroBox">
        <h1>Crowsnest Castle</h1>
        <div class="intro-sub">A Crowsnest Castle Mystery</div>
        <p>You are <b>Detective Jim "Bull" Smart</b>.<br>
        A body has been found inside the castle walls. The local constabulary has stepped aside. This one's yours.</p>
        <div class="intro-detail">
          <b>Victim:</b> ${v.name}<br>
          <b>Known as:</b> ${v.role}<br>
          <b>Time of death:</b> approximately ${_scenario.timeOfDeath}<br>
          <b>Scene of the crime:</b> ${_scenario.crimeRoom.name}<br>
          <b>Evidence required before accusation:</b> ${_scenario.cluesRequired} clues
        </div>
        <p style="font-size:12px;color:#6a5a38">The body has been removed. What remains are photographs, contradictions, and the weight of secrets.<br>Find the evidence. Open the notebook. Make your case.</p>
        <button id="bullIntroBtn">Begin Investigation</button>
      </div>
    `;
    intro.classList.add("open");
    document.getElementById("bullIntroBtn").addEventListener("click", () => {
      intro.classList.remove("open");
      localStorage.setItem(seenKey, String(_scenario.generatedAt));
    });
  }

  // ── INIT ─────────────────────────────────────────────────
  function init(scenario, showIntro = true) {
    _scenario = scenario;
    _injectStyles();
    _buildDOM();
    updateHUDCount();
    if (showIntro) _showIntro();
    // Start scoring timer on new game
    if (typeof MysteryScore !== 'undefined') {
      MysteryScore.start(scenario.cluesRequired || 10);
    }
  }

  return {
    init,
    setZone,
    openNotebook,
    closeNotebook,
    showCluePopup,
    updateHUDCount,
  };
})();