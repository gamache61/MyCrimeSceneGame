// ============================================================
//  mystery-state.js  —  Crowsnest Castle
//  Persists scenario across rooms via localStorage
// ============================================================
const MysteryState = (() => {

  const LS_KEY = "crowsnest_scenario_v2";

  async function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || data.version !== 2) { localStorage.removeItem(LS_KEY); return null; }
      return data;
    } catch (e) {
      console.warn("MysteryState.load failed — clearing:", e);
      localStorage.removeItem(LS_KEY);
      return null;
    }
  }

  async function save(scenario) {
    try {
      // Strip clue text from cluePool to keep size small
      // Text is regenerated from the engine on demand via getRoomClues()
      const slim = JSON.parse(JSON.stringify(scenario));
      slim.cluePool = slim.cluePool.map(c => ({
        poolIndex:    c.poolIndex,
        assignedRoom: c.assignedRoom,
        collected:    c.collected,
        type:         c.type,
        text:         c.text,   // keep text — needed for notebook display
      }));
      // Rebuild roomClues from slim cluePool
      slim.roomClues = {};
      slim.cluePool.forEach(c => {
        if (!slim.roomClues[c.assignedRoom]) slim.roomClues[c.assignedRoom] = [];
        slim.roomClues[c.assignedRoom].push(c);
      });

      const json = JSON.stringify(slim);
      localStorage.setItem(LS_KEY, json);

      // Verify it was saved
      const verify = localStorage.getItem(LS_KEY);
      if (!verify) console.warn("MysteryState: save verification failed");
    } catch (e) {
      console.warn("MysteryState.save failed:", e);
    }
  }

  function saveOnEvent(scenario) { save(scenario); }
  function clear() { localStorage.removeItem(LS_KEY); }

  return { load, save, saveOnEvent, clear };
})();