// ============================================================
//  mystery-score.js  —  Crowsnest Castle
//  Scoring system. Toggle on/off via Bull's Notebook > Notes.
//  Default: OFF
// ============================================================
const MysteryScore = (() => {

  const LS_TOGGLE_KEY = "crowsnest_score";   // "1" = on, anything else = off
  const LS_KEY        = "crowsnest_score_v1";
  const LS_BEST_KEY   = "crowsnest_best_v1";

  const BASE_SCORE    = 1000;
  const TIME_PENALTY  = 1;    // points per 10 seconds
  const WRONG_PENALTY = 200;
  const CLUE_BONUS    = 50;   // per clue under minimum
  const CLUE_PENALTY  = 25;   // per clue over minimum

  let _enabled      = false;
  let _startTime    = null;
  let _wrongGuesses = 0;
  let _cluesUsed    = 0;
  let _cluesMin     = 10;
  let _active       = false;

  function _isOn() { return localStorage.getItem(LS_TOGGLE_KEY) === "1"; }

  function setEnabled(val) { _enabled = !!val; }

  function start(cluesRequired) {
    if (!_isOn()) return;
    _startTime    = Date.now();
    _wrongGuesses = 0;
    _cluesUsed    = 0;
    _cluesMin     = cluesRequired || 10;
    _active       = true;
  }

  function recordWrongGuess() {
    if (!_isOn() || !_active) return;
    _wrongGuesses++;
  }

  function recordClueCollected(totalCollected) {
    if (!_isOn() || !_active) return;
    _cluesUsed = totalCollected;
  }

  function finish(scenario) {
    if (!_isOn() || !_active) return null;
    _active = false;
    const elapsed  = Math.floor((Date.now() - _startTime) / 1000);
    const timePen  = Math.floor(elapsed / 10) * TIME_PENALTY;
    const wrongPen = _wrongGuesses * WRONG_PENALTY;
    const clueBonus   = Math.max(0, _cluesMin - _cluesUsed) * CLUE_BONUS;
    const cluePenalty = Math.max(0, _cluesUsed - _cluesMin) * CLUE_PENALTY;
    const score    = Math.max(0, BASE_SCORE - timePen - wrongPen + clueBonus - cluePenalty);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    const result = { score, elapsed, timeStr: `${mm}:${ss}`, wrongGuesses: _wrongGuesses, cluesUsed: _cluesUsed, breakdown: { base: BASE_SCORE, timePen, wrongPen, clueBonus, cluePenalty } };

    const run = { date: new Date().toLocaleDateString(), score: result.score, timeStr: result.timeStr, wrongGuesses: result.wrongGuesses, cluesUsed: result.cluesUsed, killer: scenario?.killer?.name || "?", weapon: scenario?.weapon || "?", room: scenario?.crimeRoom?.name || "?" };
    try { localStorage.setItem(LS_KEY, JSON.stringify(run)); } catch(e) {}
    try {
      const prev = JSON.parse(localStorage.getItem(LS_BEST_KEY) || "null");
      if (!prev || result.score > prev.score) localStorage.setItem(LS_BEST_KEY, JSON.stringify(run));
    } catch(e) {}

    return result;
  }

  function getBest() {
    try { return JSON.parse(localStorage.getItem(LS_BEST_KEY) || "null"); } catch(e) { return null; }
  }

  function showEndCard(scenario, result) {
    if (!result) return;
    const best = getBest();
    const isNewBest = best && best.score === result.score;
    const card = document.createElement("div");
    card.id = "__scoreCard";
    card.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:system-ui,Arial,sans-serif;color:#f0e6c8;";
    card.innerHTML = `
      <div style="background:#1a1208;border:1px solid #7a5c2a;border-radius:12px;padding:40px 48px;max-width:480px;width:90%;text-align:center;">
        <div style="font-size:13px;letter-spacing:2px;color:#9a7a4a;margin-bottom:8px;">CASE CLOSED</div>
        <div style="font-size:28px;font-weight:bold;margin-bottom:4px;">🏰 Crowsnest Castle</div>
        ${isNewBest ? `<div style="color:#ffdd44;font-size:13px;margin-bottom:16px;">★ NEW BEST SCORE ★</div>` : `<div style="margin-bottom:16px;"></div>`}
        <div style="font-size:52px;font-weight:bold;color:#ffdd44;margin-bottom:4px;">${result.score}</div>
        <div style="font-size:13px;color:#9a7a4a;margin-bottom:24px;">points</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px;font-size:14px;">
          <div style="background:#2a1e0a;border-radius:8px;padding:12px;"><div style="color:#9a7a4a;font-size:11px;margin-bottom:4px;">TIME</div><div>${result.timeStr}</div></div>
          <div style="background:#2a1e0a;border-radius:8px;padding:12px;"><div style="color:#9a7a4a;font-size:11px;margin-bottom:4px;">WRONG GUESSES</div><div>${result.wrongGuesses}</div></div>
          <div style="background:#2a1e0a;border-radius:8px;padding:12px;"><div style="color:#9a7a4a;font-size:11px;margin-bottom:4px;">CLUES USED</div><div>${result.cluesUsed}</div></div>
          <div style="background:#2a1e0a;border-radius:8px;padding:12px;"><div style="color:#9a7a4a;font-size:11px;margin-bottom:4px;">CLUE BONUS</div><div style="color:${result.breakdown.cluePenalty > 0 ? '#ff8888' : '#88dd88'}">${result.breakdown.cluePenalty > 0 ? '-'+result.breakdown.cluePenalty : '+'+result.breakdown.clueBonus}</div></div>
        </div>
        ${best ? `<div style="font-size:12px;color:#7a6a4a;margin-bottom:16px;">Best: ${best.score} pts — ${best.timeStr}</div>` : ""}
        <button id="__scoreCopy" style="background:#7a5c2a;color:#f0e6c8;border:none;border-radius:8px;padding:10px 24px;font-size:14px;cursor:pointer;margin-right:8px;">📋 Copy Result</button>
        <button id="__scoreClose" style="background:#2a1e0a;color:#f0e6c8;border:1px solid #7a5c2a;border-radius:8px;padding:10px 24px;font-size:14px;cursor:pointer;">Close</button>
        <div id="__scoreCopied" style="font-size:12px;color:#88dd88;margin-top:8px;display:none;">Copied to clipboard!</div>
      </div>
    `;
    document.body.appendChild(card);
    document.getElementById("__scoreClose").onclick = () => card.remove();
    document.getElementById("__scoreCopy").onclick = () => {
      const text = `🏰 Crowsnest Castle\nSolved in ${result.timeStr} | ${result.cluesUsed} clues | ${result.wrongGuesses} wrong\n${result.score} pts`;
      navigator.clipboard?.writeText(text).catch(() => {});
      document.getElementById("__scoreCopied").style.display = "block";
    };
  }

  return { start, recordWrongGuess, recordClueCollected, finish, showEndCard, getBest, setEnabled };
})();