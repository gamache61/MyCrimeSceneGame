const EvidenceSystem = (() => {

  const PICK_RADIUS = 200;
  const ARM_HIDDEN = new THREE.Vector3( 0.14, -0.62, -0.30);
  const ARM_REACH  = new THREE.Vector3( 0.05, -0.28, -0.48);
  const ARM_SPEED  = 6.0;

  let _cam, _scene, _renderer, _zoneId;
  let _hotspots = [];
  let _customPositions = null;
  let _orbSize = 14;
  let _pickRadius = 200;
  let _nearIdx  = -1;
  let _fDown    = false;
  let _anim     = null;
  let _hintEl   = null;
  let _ready    = false;

  let _handScene = null;
  let _handCam   = null;
  let _armGroup  = null;
  let _armPos    = new THREE.Vector3().copy(ARM_HIDDEN);

  function _scatterPositions(count) {
    const positions = [];
    const radius = 100;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.6);
      positions.push({ x: Math.cos(angle) * r, y: 0, z: Math.sin(angle) * r });
    }
    return positions;
  }

  function _buildArm() {
    _handScene = new THREE.Scene();
    _handCam   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10);
    _handScene.add(new THREE.AmbientLight(0xffffff, 1.0));

    const skin   = new THREE.MeshLambertMaterial({ color: 0xc8a47a });
    const sleeve = new THREE.MeshLambertMaterial({ color: 0x2a2a35 });
    _armGroup = new THREE.Group();
    _handScene.add(_armGroup);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.22, 10), sleeve);
    forearm.rotation.x = -0.3;
    _armGroup.add(forearm);

    const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.022, 0.06, 10), skin);
    wrist.rotation.x = -0.3;
    wrist.position.set(0, -0.14, 0.02);
    _armGroup.add(wrist);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.018, 0.088), skin);
    palm.rotation.x = -0.3;
    palm.position.set(0, -0.19, 0.045);
    _armGroup.add(palm);

    for (let i = 0; i < 4; i++) {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.008, 0.06, 8), skin);
      f.rotation.x = -0.5;
      f.position.set((i - 1.5) * 0.018, -0.225, 0.078);
      _armGroup.add(f);
    }

    const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.010, 0.048, 8), skin);
    thumb.rotation.z = 0.6;
    thumb.rotation.x = -0.3;
    thumb.position.set(-0.042, -0.200, 0.055);
    _armGroup.add(thumb);

    _armGroup.position.copy(ARM_HIDDEN);
    _armGroup.visible = false;
  }

  function _buildHint() {
    const existing = document.getElementById("evidenceHint");
    if (existing) { _hintEl = existing; return; }
    if (document.getElementById("__esHint")) { _hintEl = document.getElementById("__esHint"); return; }
    const el = document.createElement("div");
    el.id = "__esHint";
    el.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.82);color:#ffdd88;font:15px/1 system-ui,Arial;padding:10px 22px;border-radius:8px;display:none;z-index:400;pointer-events:none;white-space:nowrap;";
    el.textContent = "Press F to examine";
    document.body.appendChild(el);
    _hintEl = el;
  }

  function _placeHotspots(clues) {
    if (!_scene) return;
    const positions = _customPositions && _customPositions.length >= clues.length
      ? _customPositions.slice(0, clues.length)
      : _scatterPositions(clues.length);
    _hotspots = clues.map((clue, i) => {
      const pos = positions[i];
      // Visible bright orb
      const mat  = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
      const orbSize = _orbSize;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(orbSize, 12, 12), mat);
      const orbY = pos.y !== undefined ? pos.y : 50;
      mesh.position.set(pos.x, orbY, pos.z);
      mesh.userData.pulseOffset = Math.random() * Math.PI * 2;
      _scene.add(mesh);
      return { wx: pos.x, wy: orbY, wz: pos.z, clue, mesh, collected: false };
    });

    // On-screen notification
    const st = document.createElement('div');
    st.style.cssText = 'position:fixed;top:50px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#ffdd88;font:13px system-ui;padding:8px 18px;border-radius:8px;z-index:500;pointer-events:none;';
    st.textContent = `🔍 ${clues.length} clue${clues.length > 1 ? 's' : ''} in this room`;
    document.body.appendChild(st);
    setTimeout(() => st.remove(), 5000);
  }

  function _checkProximity() {
    if (_anim) return;
    const cam = window.camera || _cam;
    if (!cam) return;
    let best = -1, bestDist = Infinity;
    _hotspots.forEach((h, i) => {
      if (h.collected) return;
      const dx = cam.position.x - h.wx;
      const dz = cam.position.z - h.wz;
      const d  = Math.sqrt(dx * dx + dz * dz);
      if (d < _pickRadius && d < bestDist) { bestDist = d; best = i; }
    });
    _nearIdx = best;
    if (_hintEl) _hintEl.style.display = best >= 0 ? "block" : "none";
    // Debug: log every 120 frames
    if (!window._esDebugFrame) window._esDebugFrame = 0;
    window._esDebugFrame++;
    if (window._esDebugFrame % 120 === 0) {
      console.log("ES check: hotspots="+_hotspots.length+" cam=("+Math.round(cam.position.x)+","+Math.round(cam.position.y)+","+Math.round(cam.position.z)+") nearIdx="+_nearIdx+" pickRadius="+_pickRadius);
      if (_hotspots.length > 0) console.log("  first orb: wx="+Math.round(_hotspots[0].wx)+" wz="+Math.round(_hotspots[0].wz)+" collected="+_hotspots[0].collected);
    }
  }

  function _startPickup() {
    if (_nearIdx < 0 || _hotspots[_nearIdx].collected) return;
    const h = _hotspots[_nearIdx];
    const itemMesh = new THREE.Mesh(
      new THREE.BoxGeometry(16, 4, 22),
      new THREE.MeshLambertMaterial({ color: 0xe8d8a0 })
    );
    itemMesh.position.set(h.wx, h.wy, h.wz);
    _scene.add(itemMesh);
    if (_armGroup) _armGroup.visible = true;
    _anim = {
      phase: "reaching", startTime: performance.now(),
      hotspotIdx: _nearIdx, itemMesh,
      itemStart: new THREE.Vector3(h.wx, h.wy, h.wz)
    };
    if (_hintEl) _hintEl.style.display = "none";
  }

  function _finishPickup() {
    if (!_anim) return;
    const { hotspotIdx, itemMesh } = _anim;
    const h = _hotspots[hotspotIdx];
    h.collected = true;
    h.mesh.visible = false;
    _scene.remove(itemMesh);

    let notebookClue = null;
    if (window._scenario && typeof MysteryEngine !== 'undefined') {
      notebookClue = MysteryEngine.collectClue(window._scenario, h.clue);
      window._scenario.clues.push(notebookClue);
      if (typeof MysteryState !== 'undefined') MysteryState.saveOnEvent(window._scenario);
    }
    if (typeof MysteryUI !== 'undefined') {
      MysteryUI.showCluePopup(notebookClue || h.clue);
      MysteryUI.updateHUDCount();
    }
    if (_armGroup) { _armGroup.visible = false; _armGroup.position.copy(ARM_HIDDEN); }
    _anim = null;
  }

  function _handWorldPos() {
    const dir = new THREE.Vector3(0, -0.18, -0.45);
    dir.applyQuaternion(_cam.quaternion);
    return _cam.position.clone().add(dir);
  }

  function update() {
    if (!_ready) return;
    _checkProximity();

    // Pulse orbs
    const t = performance.now() / 1000;
    _hotspots.forEach(h => {
      if (h.collected || !h.mesh) return;
      h.mesh.scale.setScalar(1 + 0.2 * Math.sin(t * 3 + h.mesh.userData.pulseOffset));
    });

    // Pickup animation
    if (_anim) {
      const elapsed = (performance.now() - _anim.startTime) / 1000;
      if (_anim.phase === "reaching") {
        const prog = Math.min(elapsed / 0.5, 1);
        _anim.itemMesh.position.lerpVectors(_anim.itemStart, _handWorldPos(), prog);
        _anim.itemMesh.rotation.y += 0.04;
        if (prog >= 1) { _anim.phase = "holding"; _anim.startTime = performance.now(); }
      }
      if (_anim.phase === "holding") {
        _anim.itemMesh.position.copy(_handWorldPos());
        _anim.itemMesh.rotation.y += 0.02;
        if (!_fDown) _finishPickup();
      }
    }

    // Render arm overlay — only during pickup
    if (_renderer && _handScene && _handCam && _armGroup && _armGroup.visible) {
      _handCam.aspect = _cam.aspect;
      _handCam.fov = _cam.fov;
      _handCam.updateProjectionMatrix();
      _renderer.autoClear = false;
      _renderer.clearDepth();
      _renderer.render(_handScene, _handCam);
      _renderer.autoClear = true;
    }
  }

  function _onKeyDown(e) {
    if (e.code !== "KeyF" || e.repeat) return;
    _fDown = true;
    if (_nearIdx >= 0 && !_hotspots[_nearIdx]?.collected && !_anim) _startPickup();
  }
  function _onKeyUp(e) {
    if (e.code === "KeyF") _fDown = false;
  }

  function init(opts) {
    _cam      = opts.camera;
    _scene    = opts.scene;
    _renderer = opts.renderer;
    _zoneId   = opts.zoneId || "unknown";
    _customPositions = opts.positions || null;
    _orbSize = opts.orbSize || 14;
    _pickRadius = opts.pickRadius || PICK_RADIUS;

    _buildHint();
    _buildArm();

    document.addEventListener("keydown", _onKeyDown);
    document.addEventListener("keyup",   _onKeyUp);
    _ready = true;

    // If clues passed directly, use them immediately
    if (opts.clues && opts.clues.length > 0) {
      setTimeout(() => _placeHotspots(opts.clues), 500);
      return;
    }

    // Place clues after short delay to ensure scene is built
    setTimeout(() => {
      if (!window._scenario || typeof MysteryEngine === 'undefined') {
        setTimeout(() => {
          if (window._scenario && typeof MysteryEngine !== 'undefined') {
            const clues = MysteryEngine.getRoomClues(window._scenario, _zoneId);
            if (clues.length > 0) _placeHotspots(clues);
          }
        }, 1000);
        return;
      }
      if (typeof MysteryEngine !== 'undefined') {
        const clues = MysteryEngine.getRoomClues(window._scenario, _zoneId);
        if (clues.length > 0) _placeHotspots(clues);
      }
    }, 500);
  }

  return { init, update, getHotspots: () => _hotspots, getNearIdx: () => _nearIdx };
})();