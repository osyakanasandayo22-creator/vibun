  
  // ====== 状態 ======
  let currentUnit = [];
  let currentIndex = 0;
  let wrongWords = [];
  let isRandom = false;
  /** "word" | "full" | "partialJp" */
  let inputMode = "word";
  let consecutiveCorrect = 0;
  let inputStartTime = null;
  let animSerial = 0;
  let animMode = "simple";
  /** 音声: true のとき次は単語、false のとき次は例文（交互） */
  let speechNextIsWord = true;

  // ====== DOM ======
  const home = document.getElementById("home");
  const quiz = document.getElementById("quiz");
  const resultScreen = document.getElementById("resultScreen");
  const themeToggle = document.getElementById("themeToggle");
  
  const sentenceEl = document.getElementById("sentence");
  const jpEl = document.getElementById("jp");
  const input = document.getElementById("answerInput");
  const resultEl = document.getElementById("result");
  const progress = document.getElementById("progress");
  
  const judgeBtn = document.getElementById("judgeBtn");
  const nextBtn = document.getElementById("nextBtn");
  const speakBtn = document.getElementById("speakBtn");
  const reviewBtn = document.getElementById("reviewBtn");
  const backHomeBtn = document.getElementById("backHome");
  const meaningEl = document.getElementById("meaning");
  const rangeStartInput = document.getElementById("rangeStart");
  const rangeEndInput = document.getElementById("rangeEnd");
  const rangeTestBtn = document.getElementById("rangeTestBtn");
  const appModal = document.getElementById("appModal");
  const appModalBackdrop = document.getElementById("appModalBackdrop");
  const appModalTitle = document.getElementById("appModalTitle");
  const appModalMessage = document.getElementById("appModalMessage");
  const appModalCancel = document.getElementById("appModalCancel");
  const appModalOk = document.getElementById("appModalOk");


  // ====== Word Animation DOM ======
  const animModeEl = document.getElementById("animMode");
  const matchRateEl = document.getElementById("matchRate");
  const wordStageEl = document.getElementById("wordStage");
  const wordSilhouetteEl = document.getElementById("wordSilhouette");
  const wordRippleEl = document.getElementById("wordRipple");
  const wordFallingEl = document.getElementById("wordFalling");
  const wordBreakLayerEl = document.getElementById("wordBreakLayer");
  const quizCardEl = document.querySelector("#quiz .card");
  const globalFxEl = document.getElementById("globalFx");
  const comboDisplayEl = document.getElementById("comboDisplay");
  let appModalResolve = null;
  let appModalIsConfirm = false;

  function closeAppModal(result) {
    if (!appModal || !appModalResolve) return;
    appModal.classList.add("hidden");
    const resolve = appModalResolve;
    appModalResolve = null;
    appModalIsConfirm = false;
    resolve(result);
  }

  function openAppModal({
    title = "お知らせ",
    message = "",
    okText = "はい",
    cancelText = "キャンセル",
    isConfirm = false
  }) {
    if (!appModal || !appModalTitle || !appModalMessage || !appModalOk || !appModalCancel) {
      return Promise.resolve(isConfirm ? false : true);
    }

    appModalTitle.textContent = title;
    appModalMessage.textContent = message;
    appModalOk.textContent = okText;
    appModalCancel.textContent = cancelText;
    appModalCancel.classList.toggle("hidden", !isConfirm);
    appModal.classList.remove("hidden");
    appModalIsConfirm = isConfirm;

    return new Promise(resolve => {
      appModalResolve = resolve;
      setTimeout(() => appModalOk.focus(), 0);
    });
  }

  function showAppAlert(message, title = "お知らせ") {
    return openAppModal({ title, message, isConfirm: false, okText: "はい" });
  }

  function showAppConfirm(message, title = "確認") {
    return openAppModal({
      title,
      message,
      isConfirm: true,
      okText: "はい",
      cancelText: "いいえ"
    });
  }

  appModalOk?.addEventListener("click", () => closeAppModal(true));
  appModalCancel?.addEventListener("click", () => closeAppModal(false));
  appModalBackdrop?.addEventListener("click", () => {
    if (!appModalIsConfirm) closeAppModal(true);
  });
  document.addEventListener(
    "keydown",
    e => {
      if (!appModal || appModal.classList.contains("hidden")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeAppModal(appModalIsConfirm ? false : true);
        return;
      }
      if (e.key === "Enter" || e.key === "NumpadEnter") {
        e.preventDefault();
        e.stopPropagation();
        closeAppModal(true);
      }
    },
    true
  );


  
  // ====== Unit一覧生成 ======
  const unitList = document.getElementById("unitList");
  Object.keys(units).forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = key.toUpperCase();
    btn.className = "unit-btn";
    btn.onclick = () => startUnit(key);
    unitList.appendChild(btn);
  });
  
  // ====== 設定 ======
  const randomToggleEl = document.getElementById("randomToggle");
  const savedRandom = localStorage.getItem("quizRandom") === "1";
  isRandom = savedRandom;
  if (randomToggleEl) randomToggleEl.checked = savedRandom;

  if (randomToggleEl) {
    randomToggleEl.onchange = e => {
      isRandom = e.target.checked;
      localStorage.setItem("quizRandom", isRandom ? "1" : "0");
    };
  }

  const inputModeSelectEl = document.getElementById("inputModeSelect");
  const savedMode = localStorage.getItem("grammarInputMode");
  if (savedMode === "word" || savedMode === "full" || savedMode === "partialJp") {
    inputMode = savedMode;
  } else {
    inputMode = "word";
  }
  if (inputModeSelectEl) inputModeSelectEl.value = inputMode;

  if (inputModeSelectEl) {
    inputModeSelectEl.addEventListener("change", e => {
      const v = e.target.value;
      inputMode = v === "full" || v === "partialJp" ? v : "word";
      localStorage.setItem("grammarInputMode", inputMode);
    });
  }

  const persistRangeInputs = () => {
    if (rangeStartInput) localStorage.setItem("quizRangeStart", rangeStartInput.value);
    if (rangeEndInput) localStorage.setItem("quizRangeEnd", rangeEndInput.value);
  };

  if (rangeStartInput) {
    const s = localStorage.getItem("quizRangeStart");
    if (s !== null) rangeStartInput.value = s;
    rangeStartInput.addEventListener("change", persistRangeInputs);
    rangeStartInput.addEventListener("input", persistRangeInputs);
    rangeStartInput.addEventListener("blur", persistRangeInputs);
  }
  if (rangeEndInput) {
    const s = localStorage.getItem("quizRangeEnd");
    if (s !== null) rangeEndInput.value = s;
    rangeEndInput.addEventListener("change", persistRangeInputs);
    rangeEndInput.addEventListener("input", persistRangeInputs);
    rangeEndInput.addEventListener("blur", persistRangeInputs);
  }

  // アニメ演出モード
  if (animModeEl) {
    animMode = localStorage.getItem("animMode") || "simple";
    animModeEl.value = animMode;
    animModeEl.onchange = e => {
      animMode = e.target.value;
      localStorage.setItem("animMode", animMode);
    };
  }

  // テーマ切り替え
  if (themeToggle) {
    const moonIconPath = "images/月のアイコン.png";
    const setThemeIcon = isDark => {
      if (isDark) {
        themeToggle.textContent = "☀";
        return;
      }
      themeToggle.innerHTML = `<img src="${moonIconPath}" alt="月アイコン" class="theme-icon">`;
    };

    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }
    setThemeIcon(savedTheme === "dark");

    themeToggle.onclick = () => {
      const isDark = document.body.classList.toggle("dark");
      setThemeIcon(isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    };
  }
  
  const homeBtn = document.getElementById("homeBtn");

  homeBtn.style.display = "none";

homeBtn.onclick = async () => {
  const shouldGoHome = await showAppConfirm("Unitを中断してホームに戻りますか？", "確認");
  if (shouldGoHome) {
    quiz.classList.add("hidden");
    resultScreen.classList.add("hidden");
    home.classList.remove("hidden");
    document.body.classList.remove("mode-full-sentence", "mode-partial-jp");

    currentUnit = [];
    currentIndex = 0;
    wrongWords = [];

    homeBtn.style.display = "none";
  }
};
  
  // ====== 開始 ======
  function startUnit(key) {
    const unitWords = units[key].map(entry => ({ ...entry }));
    startQuizWithWords(unitWords);
  }

  function startQuizWithWords(words) {
    currentUnit = [...words];
    if (isRandom) shuffle(currentUnit);
  
    currentIndex = 0;
    wrongWords = [];
    consecutiveCorrect = 0;
    inputStartTime = null;
  
    home.classList.add("hidden");
    quiz.classList.remove("hidden");
  
    homeBtn.style.display = "block";

    showCard();
  }

  // ====== 表示 ======
  function showCard() {
    const q = currentUnit[currentIndex];

    speechNextIsWord = true;

    document.body.classList.remove("mode-full-sentence", "mode-partial-jp");
    if (inputMode === "full") document.body.classList.add("mode-full-sentence");
    if (inputMode === "partialJp") document.body.classList.add("mode-partial-jp");

    if (inputMode === "full") {
      sentenceEl.textContent = q.jp;
      sentenceEl.style.whiteSpace = "pre-wrap";
      jpEl.textContent =
        "この和訳に合う英文を、全文で入力してください。文末のピリオドの有無は問いません。";
      jpEl.style.whiteSpace = "normal";
      input.rows = 4;
      input.placeholder = "英文を全文で入力…";
    } else if (inputMode === "partialJp") {
      sentenceEl.textContent = q.sentence;
      sentenceEl.style.whiteSpace = "";
      jpEl.textContent = `括弧 (   ) に対応する部分の日本語訳を入力してください。\n\n【全体の和訳（参考）】\n${q.jp}`;
      jpEl.style.whiteSpace = "pre-wrap";
      input.rows = 3;
      input.placeholder = "日本語の訳を入力…";
    } else {
      sentenceEl.textContent = q.sentence;
      sentenceEl.style.whiteSpace = "";
      jpEl.textContent = q.jp;
      jpEl.style.whiteSpace = "";
      input.rows = 2;
      input.placeholder = "";
    }
  
    input.value = "";
    input.disabled = false;
    judgeBtn.disabled = false;
    inputStartTime = null;
  
    resultEl.textContent = "";
    resultEl.className = "";
  
    meaningEl.innerHTML = "";
    meaningEl.classList.add("hidden");
  
    matchRateEl?.classList.add("hidden");

    // レイヤー状態リセット
    wordStageEl?.classList.add("hidden");
    wordStageEl?.classList.remove("state-correct", "state-incorrect");
    wordFallingEl?.classList.remove("anim-correct", "anim-wrong-shift", "anim-wrong-rotate", "anim-wrong-drift", "anim-wrong-ugly");
    wordRippleEl?.classList.remove("play");
    if (wordBreakLayerEl) {
      wordBreakLayerEl.innerHTML = "";
      wordBreakLayerEl.classList.remove("play");
    }

    // コンボ表示リセット
    if (comboDisplayEl) {
      comboDisplayEl.classList.add("hidden");
      comboDisplayEl.classList.remove("tier-1", "tier-2", "play");
      comboDisplayEl.textContent = "";
    }

    // 全画面FX状態リセット
    document.body.classList.remove(
      "scene-correct",
      "scene-incorrect",
      "scene-hold",
      "scene-audio-pulse",
      "fx-combo-1",
      "fx-combo-2"
    );
    if (globalFxEl) {
      globalFxEl.classList.add("hidden");
      globalFxEl.classList.remove("scene-hold");
      const particlesWrap = globalFxEl.querySelector(".fx-particles");
      if (particlesWrap) particlesWrap.innerHTML = "";
    }

    nextBtn.classList.add("hidden");
    speakBtn.classList.add("hidden");
  
    const numberLabel = q.number ? `No.${q.number} ` : "";
    const modeTag =
      inputMode === "full" ? "全文 " : inputMode === "partialJp" ? "部分訳 " : "";
    progress.textContent = `${modeTag}${numberLabel}${currentIndex + 1} / ${currentUnit.length}`;
    input.focus();
  }
  
  // ====== Word Animation helpers ======
  function normalizeWord(str) {
    return (str || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  // 文字位置ベースの一致率（完全一致なら100%）
  function calcMatchRate(userStr, targetStr) {
    const u = normalizeWord(userStr);
    const t = normalizeWord(targetStr);

    const maxLen = Math.max(u.length, t.length);
    if (maxLen === 0) return 100;

    const minLen = Math.min(u.length, t.length);
    let match = 0;
    for (let i = 0; i < minLen; i++) {
      if (u[i] === t[i]) match++;
    }

    return Math.max(0, Math.min(100, Math.round((match / maxLen) * 100)));
  }

  /** 日本語など大小文字を変えない一致率 */
  function calcMatchRateChars(userStr, targetStr) {
    const u = userStr || "";
    const t = targetStr || "";
    const maxLen = Math.max(u.length, t.length);
    if (maxLen === 0) return 100;
    const minLen = Math.min(u.length, t.length);
    let match = 0;
    for (let i = 0; i < minLen; i++) {
      if (u[i] === t[i]) match++;
    }
    return Math.max(0, Math.min(100, Math.round((match / maxLen) * 100)));
  }

  function expectedFullSentence(q) {
    return (q.sentence || "").replace(/\(\s+\)/g, (q.word || "").trim());
  }

  /** 全文モード比較用：末尾句読点の有無などを吸収 */
  function normalizeSentenceAnswer(s) {
    let t = normalizeWord(s);
    t = t.replace(/\u2019/g, "'").replace(/\u2018/g, "'").replace(/\u201c/g, '"').replace(/\u201d/g, '"');
    while (/[.,!?;:…]+$/u.test(t)) {
      t = t.replace(/[.,!?;:…]+$/u, "").trim();
    }
    return t;
  }

  function normalizeJp(s) {
    let t = (s || "").normalize("NFKC").trim().replace(/\s+/g, "");
    t = t.replace(/\u3000/g, "");
    while (/[。．、，!?！？]+$/.test(t)) {
      t = t.replace(/[。．、，!?！？]+$/g, "");
    }
    return t;
  }

  function clipAnimText(text, maxLen) {
    const s = (text || "").trim();
    const shouldClip = inputMode === "full" || inputMode === "partialJp";
    if (!shouldClip || s.length <= maxLen) return s;
    return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
  }

  function getComboTier(count) {
    if (count >= 5) return 2;
    if (count >= 3) return 1;
    return 0;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function randBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  // --- Audio (WebAudio) ---
  let audioCtx = null;
  function ensureAudioCtx() {
    if (audioCtx) return audioCtx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      audioCtx = new Ctx();
    } catch {
      return null;
    }
    return audioCtx;
  }

  // スマホ対策：AudioContextはユーザー操作直後にresumeしないと無音になりがち
  function primeAudio() {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    try {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    } catch {
      // ignore
    }
  }

  function playTone(freq, durationMs, type = "sine", gainValue = 0.03) {
    const ctx = ensureAudioCtx();
    if (!ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;

      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, gainValue), now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + durationMs / 1000 + 0.02);
    } catch {
      // 音が鳴らなくても学習体験は止めない
    }
  }

  let correct2AudioEl = null;
  function playCorrect2Sound() {
    primeAudio();
    try {
      if (!correct2AudioEl) {
        correct2AudioEl = new Audio("クイズ正解2.mp3");
        correct2AudioEl.preload = "auto";
      }
      correct2AudioEl.pause();
      correct2AudioEl.currentTime = 0;
      void correct2AudioEl.play().catch(() => {});
    } catch {
      // ignore
    }
  }

  function playJudgeSound(kind) {
    // kind: fall / click / wrong / correct2（correct2 はクイズ正解2.mp3）
    // 正解時：刺さりにくい（低め・サイン寄り・音量控えめ）
    if (kind === "fallCorrect") playTone(560, 45, "sine", 0.012);
    if (kind === "fallWrong") playTone(190, 65, "triangle", 0.012);
    if (kind === "fall") playTone(520, 55, "sine", 0.012);

    // 正解時クリック：高音域より「ふわっとした短い音」（2音）
    if (kind === "click") {
      playTone(880, 75, "sine", 0.018);
      setTimeout(() => playTone(1320, 55, "sine", 0.009), 12);
    }
    if (kind === "correct2") playCorrect2Sound();
    if (kind === "wrong") playTone(180, 140, "triangle", 0.018);
  }

  function scheduleFallingRhythm(serial, fallDurationMs, isExact) {
    if (!fallDurationMs || fallDurationMs < 1) return;
    const beats = isExact ? 3 : 4;
    const baseAt = Math.round(fallDurationMs * 0.22);
    for (let i = 0; i < beats; i++) {
      const t = baseAt + Math.round((fallDurationMs * 0.58) * (i / (beats - 1)));
      setTimeout(() => {
        if (serial !== animSerial) return;
        playJudgeSound(isExact ? "fallCorrect" : "fallWrong");
        triggerAudioPulse();
      }, t);
    }
  }

  function createBreakdown(userDisplay, matchRate) {
    if (!wordBreakLayerEl) return;
    wordBreakLayerEl.innerHTML = "";

    const text = normalizeWord(userDisplay);
    const chars = text.split("");
    const mismatch = 1 - matchRate / 100;

    // mismatchが大きいほど飛び散る（違和感増幅）
    const scatterX = 10 + mismatch * 18;
    const scatterY = 20 + mismatch * 35;
    const scatterRot = 45 + mismatch * 120;
    const baseDelay = 60 + mismatch * 90;

    chars.forEach(ch => {
      const span = document.createElement("span");
      span.className = "break-char" + (ch === " " ? " space" : "");
      span.textContent = ch === " " ? " " : ch;

      const dx = randBetween(-scatterX, scatterX);
      const dy = randBetween(-scatterY * 0.9, -scatterY * 0.2);
      const dr = randBetween(-scatterRot, scatterRot);
      const delay = Math.round(Math.random() * baseDelay);

      span.style.setProperty("--dx", `${dx.toFixed(1)}px`);
      span.style.setProperty("--dy", `${dy.toFixed(1)}px`);
      span.style.setProperty("--dr", `${dr.toFixed(1)}deg`);
      span.style.setProperty("--delay", `${delay}ms`);

      wordBreakLayerEl.appendChild(span);
    });
  }

  function runWordAnimation({
    userDisplay,
    userNorm,
    correctDisplay,
    correctNorm,
    isExact,
    matchRate,
    comboTier,
    elapsedMs
  }) {
    const serial = ++animSerial;

    if (!wordStageEl || !wordFallingEl || !wordSilhouetteEl) return 700;

    // Stage位置合わせ（カード内で入力位置と重ねる）
    if (quizCardEl) {
      const cardRect = quizCardEl.getBoundingClientRect();
      const inputRect = input.getBoundingClientRect();
      const stageY = (inputRect.top - cardRect.top) + inputRect.height * 0.55;
      wordStageEl.style.top = `${stageY}px`;
    }

    // mode + combo
    wordStageEl.classList.remove("anim-mode-simple", "anim-mode-neon", "anim-mode-pop");
    wordStageEl.classList.add(`anim-mode-${animMode}`);

    wordStageEl.classList.remove("combo-tier-0", "combo-tier-1", "combo-tier-2");
    wordStageEl.classList.add(`combo-tier-${comboTier}`);

    // コンボ上位は色で気持ちよさを強化
    if (comboTier >= 2) {
      if (animMode === "simple") wordStageEl.style.setProperty("--glow", "rgba(124, 58, 237, 0.95)");
      if (animMode === "neon") wordStageEl.style.setProperty("--glow", "rgba(217, 70, 239, 0.95)");
      if (animMode === "pop") wordStageEl.style.setProperty("--glow", "rgba(249, 115, 22, 0.95)");
      wordStageEl.style.setProperty("--rippleBoost", "1.55");
    } else if (comboTier === 1) {
      wordStageEl.style.setProperty("--rippleBoost", "1.25");
    }

    // speed連動（速いほど短く・ズレにくく）
    const elapsedClamped = Math.max(0, Math.min(2500, elapsedMs || 0));
    const fastness = Math.max(0, Math.min(1, 1 - elapsedClamped / 2500)); // 1=超速い
    const fallDuration = Math.round(lerp(900, 560, fastness));

    wordStageEl.style.setProperty("--fallDuration", `${fallDuration}ms`);
    wordStageEl.style.setProperty("--startY", `${Math.round(-140 - (1 - fastness) * 20)}px`);

    // 影の濃さ（不正解ほど徐々に濃く、かつ一致率が低いほど濃く）
    const mismatch = 1 - matchRate / 100;
    const silhEnd = Math.min(0.9, 0.58 + mismatch * 0.36);
    wordStageEl.style.setProperty("--silhEndOpacity", silhEnd.toFixed(2));

    // テキスト更新（全文モードは落下アニメ用に短く切り詰め）
    wordSilhouetteEl.textContent = clipAnimText(correctDisplay, 40);
    wordFallingEl.textContent = clipAnimText(
      isExact ? correctDisplay : userDisplay.trim().length > 0 ? userDisplay : correctDisplay,
      40
    );
    wordRippleEl?.classList.remove("play");
    if (wordBreakLayerEl) {
      wordBreakLayerEl.innerHTML = "";
      wordBreakLayerEl.classList.remove("play");
    }

    // 初期状態クラス
    wordStageEl.classList.remove("state-correct", "state-incorrect");
    wordFallingEl.classList.remove("anim-correct", "anim-wrong-shift", "anim-wrong-rotate", "anim-wrong-drift", "anim-wrong-ugly");

    // --- 正解 ---
    if (isExact) {
      wordStageEl.classList.add("state-correct");
      wordFallingEl.classList.add("anim-correct");

      wordStageEl.classList.remove("state-incorrect");

      // リズム音（落下中）
      scheduleFallingRhythm(serial, fallDuration, true);

      // 波紋（余韻）
      const rippleAt = Math.round(fallDuration * 0.78);
      setTimeout(() => {
        if (serial !== animSerial) return;
        if (!wordRippleEl) return;
        wordRippleEl.classList.remove("play");
        void wordRippleEl.offsetWidth; // 再生を確実にする
        wordRippleEl.classList.add("play");
        // 正解音2は judge 側で読み上げに合わせて再生
      }, rippleAt);

      // 表示開始
      wordStageEl.classList.remove("hidden");
      return fallDuration;
    }

    // --- 不正解 ---
    wordStageEl.classList.add("state-incorrect");

    // ランダム演出（少しズレ / 回転 / 横にズレ続ける）
    // 不一致が大きいほど「歪み拒否（ugly）」に寄せる
    const variants = ["shift", "rotate", "drift", "ugly"];
    let variant = variants[Math.floor(Math.random() * variants.length)];
    if (mismatch >= 0.18 && Math.random() < 0.55 + mismatch * 0.25) variant = "ugly";
    if (matchRate < 75 && Math.random() < 0.75) variant = "ugly";

    // 速いほどズレを減らす（ぴったり一致しやすく）
    const driftFactor = 0.85 + (1 - fastness) * 0.55;
    const driftBase = (mismatch * 20 + 6) * driftFactor;

    const endX = randBetween(-driftBase, driftBase);
    const endRot = randBetween(-driftBase * 0.12, driftBase * 0.12);
    const driftX = randBetween(-driftBase, driftBase);

    // "気持ち悪い"ほど、ズレを強める（歪み拒否）
    if (variant === "ugly") {
      const uglyEndX = endX * randBetween(1.25, 1.9);
      const uglyEndRot = endRot * randBetween(1.35, 2.1);
      const jitterX = randBetween(-Math.abs(uglyEndX) * 0.35, Math.abs(uglyEndX) * 0.35);
      const jitterY = randBetween(-14 - mismatch * 22, -4 - mismatch * 10);
      const jitterRot = randBetween(-Math.abs(uglyEndRot) * 0.75, Math.abs(uglyEndRot) * 0.75);

      wordStageEl.style.setProperty("--startY", `${Math.round(-190 - (1 - fastness) * 30)}px`);
      wordStageEl.style.setProperty("--endX", `${uglyEndX.toFixed(1)}px`);
      wordStageEl.style.setProperty("--endRot", `${uglyEndRot.toFixed(2)}deg`);
      wordStageEl.style.setProperty("--jitterX", `${jitterX.toFixed(1)}px`);
      wordStageEl.style.setProperty("--jitterY", `${jitterY.toFixed(1)}px`);
      wordStageEl.style.setProperty("--jitterRot", `${jitterRot.toFixed(2)}deg`);

      wordFallingEl.classList.add("anim-wrong-ugly");
    } else if (variant === "shift") {
      wordStageEl.style.setProperty("--endX", `${endX.toFixed(1)}px`);
      wordStageEl.style.setProperty("--endRot", `${endRot.toFixed(2)}deg`);
      wordFallingEl.classList.add("anim-wrong-shift");
    } else if (variant === "rotate") {
      wordStageEl.style.setProperty("--endX", `${endX.toFixed(1)}px`);
      wordStageEl.style.setProperty("--endRot", `${endRot.toFixed(2)}deg`);
      wordFallingEl.classList.add("anim-wrong-rotate");
    } else {
      wordStageEl.style.setProperty("--endX", `0px`);
      wordStageEl.style.setProperty("--endRot", `${endRot.toFixed(2)}deg`);
      wordStageEl.style.setProperty("--driftX", `${driftX.toFixed(1)}px`);
      wordFallingEl.classList.add("anim-wrong-drift");
    }

    // （不正解）落下中のリズム音を鈍く
    // ※ズレ/歪み演出は別で強制されるので、ここは気持ち悪さの質感に寄せる
    scheduleFallingRhythm(serial, fallDuration, false);

    // 入力単語の崩壊（分解して消える）
    const breakAt = Math.round(fallDuration * 0.64);
    setTimeout(() => {
      if (serial !== animSerial) return;
      if (!wordBreakLayerEl) return;
      createBreakdown(clipAnimText(userDisplay || "", 120) || "", matchRate);
      wordBreakLayerEl.classList.remove("play");
      void wordBreakLayerEl.offsetWidth;
      wordBreakLayerEl.classList.add("play");
      playJudgeSound("wrong");
    }, breakAt);

    wordStageEl.classList.remove("hidden");
    return fallDuration;
  }

  // ====== Global scene FX helpers ======
  let sceneSerial = 0;
  let audioPulseSerial = 0;

  function setComboClass(comboTier) {
    document.body.classList.remove("fx-combo-1", "fx-combo-2");
    if (comboTier >= 2) document.body.classList.add("fx-combo-2");
    else if (comboTier === 1) document.body.classList.add("fx-combo-1");
  }

  function showGlobalFx() {
    if (!globalFxEl) return;
    globalFxEl.classList.remove("hidden");
  }

  function hideGlobalFxLater(serial, ms) {
    if (!globalFxEl) return;
    setTimeout(() => {
      if (serial !== sceneSerial) return;
      globalFxEl.classList.add("hidden");
      const particlesWrap = globalFxEl.querySelector(".fx-particles");
      if (particlesWrap) particlesWrap.innerHTML = "";
    }, ms);
  }

  function triggerAudioPulse() {
    const body = document.body;
    const serial = ++audioPulseSerial;
    body.classList.remove("scene-audio-pulse");
    // 小さな揺れは毎回付け直す
    body.classList.add("scene-audio-pulse");
    setTimeout(() => {
      if (serial !== audioPulseSerial) return;
      body.classList.remove("scene-audio-pulse");
    }, 90);
  }

  function createParticles(comboTier) {
    if (!globalFxEl) return;
    const wrap = globalFxEl.querySelector(".fx-particles");
    if (!wrap) return;
    wrap.innerHTML = "";

    const count = comboTier >= 2 ? 52 : (comboTier === 1 ? 36 : 24);
    const spread = comboTier >= 2 ? 340 : (comboTier === 1 ? 280 : 220);
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.42;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "p";

      // start/end: center -> random direction
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.7) * spread;
      const ex = Math.cos(a) * r;
      const ey = Math.sin(a) * r;

      // ほぼ中心開始
      p.style.left = `${centerX}px`;
      p.style.top = `${centerY}px`;
      p.style.setProperty("--sx", "0px");
      p.style.setProperty("--sy", "0px");
      p.style.setProperty("--ex", `${ex.toFixed(1)}px`);
      p.style.setProperty("--ey", `${ey.toFixed(1)}px`);

      const delay = Math.round(Math.random() * 90);
      const dur = Math.round(650 + Math.random() * 220);
      p.style.setProperty("--ptDelay", `${delay}ms`);
      p.style.setProperty("--ptDur", `${dur}ms`);

      if (comboTier >= 1) {
        // コンボほど色を増やす
        const hue = comboTier >= 2 ? 265 : 206;
        const sat = comboTier >= 2 ? 95 : 85;
        p.style.background = `hsla(${hue}, ${sat}%, 75%, 0.95)`;
        p.style.boxShadow = `0 0 18px hsla(${hue}, ${sat}%, 55%, 0.45)`;
      }

      wrap.appendChild(p);
    }
  }

  function triggerScene(isExact, comboTier) {
    sceneSerial++;
    const serial = sceneSerial;

    document.body.classList.remove(
      "scene-correct",
      "scene-incorrect",
      "scene-hold",
      "scene-audio-pulse",
      "fx-combo-1",
      "fx-combo-2"
    );

    document.body.classList.add(isExact ? "scene-correct" : "scene-incorrect");
    setComboClass(comboTier);

    if (globalFxEl) {
      showGlobalFx();
      if (isExact) {
        createParticles(comboTier);
      }
    }

    // 不正解の場合はユーザーが「次へ」を押すまで待つので、ぼかし等が残り続けないように一定時間で解除
    const cleanupMs = isExact ? 1100 : 720;
    setTimeout(() => {
      if (serial !== sceneSerial) return;
      document.body.classList.remove(
        "scene-correct",
        "scene-incorrect",
        "scene-hold",
        "scene-audio-pulse",
        "fx-combo-1",
        "fx-combo-2"
      );
    }, cleanupMs);

    // 余韻で隠す
    hideGlobalFxLater(serial, isExact ? 1200 : 800);
  }

  function showComboText(consecutiveCount, comboTier) {
    if (!comboDisplayEl) return;

    if (comboTier < 1 || consecutiveCount < 3) {
      comboDisplayEl.classList.add("hidden");
      comboDisplayEl.classList.remove("tier-1", "tier-2", "play");
      return;
    }

    comboDisplayEl.textContent = `COMBO x${consecutiveCount}`;
    comboDisplayEl.classList.remove("hidden", "tier-1", "tier-2", "play");
    comboDisplayEl.classList.add(`tier-${comboTier}`);

    // アニメ再生を確実にする
    void comboDisplayEl.offsetWidth;
    comboDisplayEl.classList.add("play");
  }

  function setGrammarPointsPanel(q) {
    meaningEl.classList.remove("hidden");
    meaningEl.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "grammar-meaning";

    const head = document.createElement("div");
    head.className = "grammar-meaning-head";
    head.textContent = "文法ポイント";

    const fullAns = expectedFullSentence(q);

    const ans = document.createElement("div");
    ans.className = "grammar-meaning-answer";
    if (inputMode === "full") {
      ans.textContent = `模範解答（全文）：${fullAns}`;
    } else if (inputMode === "partialJp") {
      const jpP = (q.jpPartial || "").trim();
      ans.textContent = jpP ? `模範（括弧の和訳）：${jpP}` : `正解：${q.word}`;
    } else {
      ans.textContent = `正解：${q.word}`;
    }

    const sum = document.createElement("div");
    sum.className = "grammar-meaning-summary";
    sum.textContent = q.meaning || "";

    wrap.appendChild(head);
    wrap.appendChild(ans);
    wrap.appendChild(sum);

    const det = (q.detail || "").trim();
    if (det) {
      const pre = document.createElement("pre");
      pre.className = "grammar-meaning-detail";
      pre.textContent = det;
      wrap.appendChild(pre);
    }

    meaningEl.appendChild(wrap);
  }

  // ====== 判定 ======
  function judge() {
    if (input.disabled) return;
  
    // ユーザー操作（判定ボタン/Enter）直後にSE用AudioContextを起こす
    primeAudio();

    const q = currentUnit[currentIndex];
    const userDisplay = input.value.trim();
    const expectedFull = expectedFullSentence(q);

    let userNorm;
    let correctDisplay;
    let correctNorm;
    let isExact;
    let matchRate;

    if (inputMode === "full") {
      userNorm = normalizeSentenceAnswer(userDisplay);
      correctDisplay = expectedFull;
      correctNorm = normalizeSentenceAnswer(expectedFull);
      isExact = userNorm === correctNorm && userNorm.length > 0;
      matchRate = calcMatchRate(userNorm, correctNorm);
    } else if (inputMode === "partialJp") {
      const jpRef = (q.jpPartial || "").trim();
      userNorm = normalizeJp(userDisplay);
      correctDisplay = jpRef || q.jp;
      correctNorm = normalizeJp(jpRef);
      isExact = jpRef.length > 0 && userNorm === correctNorm;
      matchRate = calcMatchRateChars(userNorm, correctNorm);
    } else {
      userNorm = normalizeWord(userDisplay);
      correctDisplay = q.word;
      correctNorm = normalizeWord(correctDisplay);
      isExact = userNorm === correctNorm;
      matchRate = calcMatchRate(userNorm, correctNorm);
    }
    const nextComboCount = isExact ? consecutiveCorrect + 1 : 0;
    const comboTier = getComboTier(nextComboCount);
    const elapsedMs = inputStartTime ? (performance.now() - inputStartTime) : 0;
  
    input.disabled = true;
    judgeBtn.disabled = true;
  
    // 文法ポイント（要約＋詳細）
    setGrammarPointsPanel(q);
  
    matchRateEl && (matchRateEl.textContent = `${matchRate}% match`);
    matchRateEl?.classList.remove("hidden");

    // アニメ中は誤操作防止
    speakBtn.disabled = true;
    nextBtn.disabled = true;
    speakBtn.classList.add("hidden");
    nextBtn.classList.add("hidden");

    // ====== 全画面シーン演出 ======
    triggerScene(isExact, comboTier);
    if (isExact) {
      if (globalFxEl) {
        globalFxEl.classList.add("scene-hold");
        setTimeout(() => globalFxEl.classList.remove("scene-hold"), 120);
      }
    }

    const fallDuration = runWordAnimation({
      userDisplay,
      userNorm,
      correctDisplay,
      correctNorm,
      isExact,
      matchRate,
      comboTier,
      elapsedMs
    });

    if (isExact) {
      consecutiveCorrect = nextComboCount;
      resultEl.textContent = "⭕ 正解";
      resultEl.className = "correct";

      // コンボ表示（3連続以上）
      showComboText(nextComboCount, comboTier);

      // 正解音2 → わずかに先行してから読み上げ（同時感を出しつつ先に入る）
      playJudgeSound("correct2");
      setTimeout(() => {
        const toSpeak =
          inputMode === "full"
            ? sentenceForSpeech(q)
            : inputMode === "partialJp"
              ? (q.jpPartial || "").trim() || q.word
              : q.word;
        speakWord(toSpeak);
        speechNextIsWord = false;
      }, 36);

      setTimeout(() => {
        next();
      }, fallDuration + 120);
    } else {
      consecutiveCorrect = 0;
      if (comboDisplayEl) {
        comboDisplayEl.classList.add("hidden");
        comboDisplayEl.classList.remove("play");
      }
      resultEl.textContent =
        inputMode === "full"
          ? `❌ 不正解（模範全文は下のポイント欄）`
          : inputMode === "partialJp"
            ? `❌ 不正解（模範の和訳は下のポイント欄）`
            : `❌ 不正解：${q.word}`;
      resultEl.className = "wrong";
      wrongWords.push(q);

      // 正解と同様、判定直後に読み上げ（落下リズム・不正解SEと時間が重なりやすくなる）
      const toSpeakWrong =
        inputMode === "full"
          ? sentenceForSpeech(q)
          : inputMode === "partialJp"
            ? (q.jpPartial || "").trim() || q.word
            : q.word;
      speakWord(toSpeakWrong);
      speechNextIsWord = false;

      setTimeout(() => {
        if (input.disabled === false) return;
        speakBtn.disabled = false;
        nextBtn.disabled = false;
        speakBtn.classList.remove("hidden");
        nextBtn.classList.remove("hidden");
      }, fallDuration + 40);
    }
  }
  // ====== 次 ======
  function next() {
    currentIndex++;
    if (currentIndex >= currentUnit.length) {
      endUnit();
    } else {
      showCard();
    }
  }
  
  // ====== 終了 ======
  function endUnit() {
    quiz.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    homeBtn.style.display = "none";
  
    if (wrongWords.length > 0) {
      reviewBtn.classList.remove("hidden");
    } else {
      reviewBtn.classList.add("hidden");
    }
  }
  
  // ====== 復習 ======
  reviewBtn.onclick = () => {
    currentUnit = [...wrongWords];
    wrongWords = [];
    currentIndex = 0;
    consecutiveCorrect = 0;
    inputStartTime = null;
  
    resultScreen.classList.add("hidden");
    quiz.classList.remove("hidden");

    homeBtn.style.display = "block";

    showCard();
  };
  
  // ====== ホーム ======
  backHomeBtn.onclick = () => {
    resultScreen.classList.add("hidden");
    home.classList.remove("hidden");
  };
  
// ====== 発音（スマホ対応 改良版） ======
function isLikelyFemaleVoiceName(name) {
  if (!name) return false;
  const n = name.toLowerCase();
  if (n.includes("female")) return true;
  const hints = [
    "zira",
    "jenny",
    "aria",
    "samantha",
    "victoria",
    "karen",
    "tessa",
    "moira",
    "fiona",
    "serena",
    "veena",
    "emma",
    "amy",
    "olivia",
    "sarah",
    "hazel",
    "martha",
    "catherine",
    "google us english female",
    "google uk english female"
  ];
  return hints.some(h => n.includes(h));
}

function resolveEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices?.length) return null;

  const langNorm = s => (s || "").toLowerCase().replace("_", "-");

  function rankGoogleUsFemale(v) {
    const name = (v.name || "").toLowerCase();
    const lang = langNorm(v.lang);
    if (!name.includes("google")) return -1;
    if (lang !== "en-us" && !lang.startsWith("en-us")) return -1;
    let r = 0;
    if (name.includes("female")) r += 120;
    else if (/wavenet-f|neural2-f|neural-f|[-_]f\b|_f_/i.test(name)) r += 100;
    if (name.includes("journey")) r += 55;
    if (name.includes("generative")) r += 50;
    if (name.includes("premium")) r += 42;
    if (name.includes("neural2")) r += 38;
    if (name.includes("wavenet")) r += 35;
    if (name.includes("neural")) r += 32;
    if (name.includes("studio")) r += 28;
    if (name.includes("polyglot")) r += 22;
    if (name.includes("us english")) r += 18;
    if (name.includes("en-us")) r += 8;
    return r;
  }

  /** 同スコア時は「明るい／高めになりやすい」エンジンを優先 */
  function tieBreakGoogleFemale(a, b) {
    const key = v => {
      const n = (v.name || "").toLowerCase();
      let k = 0;
      if (n.includes("journey")) k += 80;
      if (n.includes("generative")) k += 70;
      if (n.includes("neural2")) k += 60;
      if (n.includes("premium")) k += 50;
      if (n.includes("wavenet")) k += 40;
      if (n.includes("neural")) k += 35;
      if (n.includes("studio")) k += 30;
      if (n.includes("female")) k += 25;
      return k;
    };
    return key(b) - key(a);
  }

  const googleUsFemaleCandidates = voices
    .map(v => ({ v, r: rankGoogleUsFemale(v) }))
    .filter(x => x.r >= 100)
    .sort((a, b) => {
      if (b.r !== a.r) return b.r - a.r;
      return tieBreakGoogleFemale(a.v, b.v);
    });
  if (googleUsFemaleCandidates.length > 0) return googleUsFemaleCandidates[0].v;

  const englishVoices = voices.filter(v => langNorm(v.lang).startsWith("en"));
  if (englishVoices.length === 0) return null;

  const femaleVoices = englishVoices.filter(v => isLikelyFemaleVoiceName(v.name));

  const femalePriority = [
    "Google US English Female",
    "Google UK English Female",
    "Microsoft Jenny",
    "Microsoft Aria",
    "Microsoft Zira",
    "Samantha",
    "Victoria",
    "Karen",
    "Tessa",
    "Moira",
    "Fiona"
  ];
  for (const name of femalePriority) {
    const found = femaleVoices.find(v => v.name.indexOf(name) !== -1);
    if (found) return found;
  }
  if (femaleVoices.length > 0) return femaleVoices[0];

  const softFemaleNames = ["Samantha", "Victoria", "Karen", "Moira", "Tessa", "Fiona", "Serena"];
  for (const name of softFemaleNames) {
    const found = englishVoices.find(v => v.name.indexOf(name) !== -1);
    if (found) return found;
  }

  const googleUs = englishVoices.find(
    v => /google/i.test(v.name) && /us english/i.test(v.name.toLowerCase())
  );
  if (googleUs) return googleUs;

  return englishVoices[0];
}

function speakWord(word) {
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const isJpText = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(word || "");

  const doSpeak = () => {
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = isJpText ? "ja-JP" : "en-US";
    utter.rate = isJpText ? 1.0 : 1.05;
    utter.pitch = isJpText ? 1.0 : 1.26;
    if (!isJpText) {
      const v = resolveEnglishVoice();
      if (v) utter.voice = v;
    }
    synth.speak(utter);
  };

  if (isJpText) {
    doSpeak();
    return;
  }

  if (resolveEnglishVoice()) {
    doSpeak();
    return;
  }

  // voiceschanged はブラウザによって複数回飛ぶ。毎回 speak すると二重読み上げになるので1回だけ実行する
  let spoken = false;
  const fireOnce = () => {
    if (spoken) return;
    spoken = true;
    synth.removeEventListener("voiceschanged", onVoicesChanged);
    clearTimeout(fallbackTimer);
    doSpeak();
  };
  const onVoicesChanged = () => fireOnce();
  const fallbackTimer = setTimeout(fireOnce, 800);
  synth.addEventListener("voiceschanged", onVoicesChanged);
  void synth.getVoices();
}

function sentenceForSpeech(q) {
  return (q.sentence || "").replace(/\(\s+\)/g, q.word);
}

function playAlternatingSpeech() {
  if (!("speechSynthesis" in window)) return;
  const q = currentUnit[currentIndex];
  if (!q) return;
  primeAudio();
  const text = speechNextIsWord ? q.word : sentenceForSpeech(q);
  speakWord(text);
  speechNextIsWord = !speechNextIsWord;
}

speakBtn.onclick = () => {
  playAlternatingSpeech();
};
  
  // ====== イベント ======
  judgeBtn.onclick = judge;
  nextBtn.onclick = next;
  
  input.addEventListener("focus", () => {
    if (inputStartTime === null) inputStartTime = performance.now();
  });

  input.addEventListener("input", () => {
    if (inputStartTime === null && input.value.trim().length > 0) inputStartTime = performance.now();
  });

  input.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    if (!input.disabled) {
      judge();
      return;
    }

    const canGoNextAfterJudge =
      !nextBtn.disabled && !nextBtn.classList.contains("hidden");
    if (canGoNextAfterJudge) next();
  });

  // inputがdisabled中はinput自身でkeydownを受け取れないため、画面全体でもEnterを監視
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (appModal && !appModal.classList.contains("hidden")) return;
    if (quiz.classList.contains("hidden")) return;
    if (!input.disabled) return;

    const canGoNextAfterJudge =
      !nextBtn.disabled && !nextBtn.classList.contains("hidden");
    if (!canGoNextAfterJudge) return;

    e.preventDefault();
    next();
  });

  // V: 判定後のみ。単語と例文を交互に読み上げ（判定前は v を英文に打てるようにする）
  document.addEventListener("keydown", e => {
    if (e.key !== "v" && e.key !== "V") return;
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (appModal && !appModal.classList.contains("hidden")) return;
    if (quiz.classList.contains("hidden")) return;
    if (!input.disabled) return;

    e.preventDefault();
    playAlternatingSpeech();
  });

  // Unit終了画面: Enter で「間違えた単語を復習」（表示中なら）／なければホームへ
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (e.repeat) return;
    if (appModal && !appModal.classList.contains("hidden")) return;
    if (resultScreen.classList.contains("hidden")) return;

    e.preventDefault();
    if (!reviewBtn.classList.contains("hidden")) {
      reviewBtn.click();
    } else {
      backHomeBtn.click();
    }
  });

  // Alt+H: クイズ中はホームボタン（🏠）と同じ／Unit終了画面ならホームへ戻る
  document.addEventListener("keydown", e => {
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key !== "h" && e.key !== "H") return;
    if (e.repeat) return;
    if (appModal && !appModal.classList.contains("hidden")) return;

    const appEl = document.getElementById("app");
    if (!appEl || appEl.style.display === "none") return;

    if (!quiz.classList.contains("hidden") && homeBtn.style.display === "block") {
      e.preventDefault();
      homeBtn.click();
      return;
    }
    if (!resultScreen.classList.contains("hidden")) {
      e.preventDefault();
      backHomeBtn?.click();
    }
  });
  
  // ====== シャッフル ======
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  function login() {
    const password = document.getElementById("pw").value;
    const correctPassword = ""; // 好きなパスワード
  
    if (password === correctPassword) {
      document.getElementById("login").style.display = "none";
      document.getElementById("app").style.display = "block";
    } else {
      showAppAlert("パスワードが違います", "入力エラー");
    }
  }
  function getAllWords() {
    let all = [];
    Object.values(units).forEach(arr => {
      arr.forEach(entry => {
        all.push({ ...entry, number: entry.wordNo ?? 0 });
      });
    });
    return all;
  }
  const random10Btn = document.getElementById("random10Btn");

  random10Btn.onclick = () => {
    let allWords = getAllWords();
  
    shuffle(allWords);         // 既存のシャッフル関数使う
    startQuizWithWords(allWords.slice(0, 10)); // 先頭10個だけ取る
  };

  rangeTestBtn?.addEventListener("click", async () => {
    const allWords = getAllWords();
    const maxNumber = allWords.reduce((max, entry) => Math.max(max, entry.number || 0), 0);
    const start = Number.parseInt(rangeStartInput?.value || "", 10);
    const end = Number.parseInt(rangeEndInput?.value || "", 10);

    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      await showAppAlert(`開始番号と終了番号を入力してください（1〜${maxNumber}）。`, "入力エラー");
      return;
    }
    if (start < 1 || end < 1 || start > maxNumber || end > maxNumber) {
      await showAppAlert(`番号は1〜${maxNumber}の範囲で入力してください。`, "入力エラー");
      return;
    }
    if (start > end) {
      await showAppAlert("開始番号は終了番号以下にしてください。", "入力エラー");
      return;
    }

    const selectedWords = allWords.filter(entry => entry.number >= start && entry.number <= end);
    if (selectedWords.length === 0) {
      await showAppAlert("指定範囲に単語がありません。", "お知らせ");
      return;
    }

    startQuizWithWords(selectedWords);
  });
    
  