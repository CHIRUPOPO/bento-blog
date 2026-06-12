/* =========================================
   おべんとう健康ノート プログラム
   （このファイルはさわらなくて大丈夫です）

   記録はすべてこの端末のブラウザ（localStorage）に保存されます。
   写真のAI解析だけ、設定したAPIキーで Anthropic のAPIに接続します。
   ========================================= */

(function () {
  "use strict";

  /* ---------------- 保存まわり ---------------- */
  const KEYS = { profile: "hk_profile", meals: "hk_meals", body: "hk_body", apikey: "hk_apikey" };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  let profile = load(KEYS.profile, null);
  let meals = load(KEYS.meals, {});   // { "2026-06-12": { breakfast: [item,…], … } }
  let body = load(KEYS.body, {});     // { "2026-06-12": { weight, sleep, steps, water, memo } }

  const MEAL_LABELS = { breakfast: "朝食", lunch: "昼食", dinner: "夕食", snack: "間食" };

  /* ---------------- 日付ヘルパー ---------------- */
  function todayStr() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function shiftDate(dateStr, days) {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* ---------------- 栄養計算 ---------------- */
  // item = { name, grams, per: {kcal,p,f,c,salt}, veg, fruit, conf }
  function calcItem(item) {
    const r = item.grams / 100;
    return {
      kcal: item.per.kcal * r,
      p: item.per.p * r,
      f: item.per.f * r,
      c: item.per.c * r,
      salt: item.per.salt * r,
      veg: item.grams * (item.veg || 0),
      fruit: item.grams * (item.fruit || 0),
    };
  }
  function sumItems(items) {
    const total = { grams: 0, kcal: 0, p: 0, f: 0, c: 0, salt: 0, veg: 0, fruit: 0 };
    for (const it of items) {
      const n = calcItem(it);
      total.grams += it.grams;
      total.kcal += n.kcal; total.p += n.p; total.f += n.f; total.c += n.c;
      total.salt += n.salt; total.veg += n.veg; total.fruit += n.fruit;
    }
    return total;
  }
  function dayTotals(dateStr) {
    const day = meals[dateStr] || {};
    const all = [];
    for (const k of Object.keys(MEAL_LABELS)) if (day[k]) all.push(...day[k]);
    return sumItems(all);
  }

  /* ---------------- 目標の計算 ---------------- */
  function calcTargets(p) {
    if (!p) return null;
    // 基礎代謝（ミフリン・セントジョー式）
    const bmr = p.sex === "male"
      ? 10 * p.weight + 6.25 * p.height - 5 * p.age + 5
      : 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;
    const tdee = bmr * Number(p.activity);

    // 目標体重までの1日あたり調整カロリー（体脂肪1kg ≒ 7200kcal）
    let adjust = 0, days = 0;
    if (p.targetDate) {
      days = Math.max(1, Math.round((new Date(p.targetDate) - new Date(todayStr())) / 86400000));
      adjust = ((p.weight - p.target) * 7200) / days; // 減量ならプラス（=差し引く量）
    }
    let kcal = tdee - adjust;
    const floor = Math.max(bmr, p.sex === "male" ? 1500 : 1200);
    let warning = "";
    if (adjust > 500) {
      warning = "1日あたり " + Math.round(adjust) + " kcal の減量ペースはかなり急です。目標日をもう少し先にするのがおすすめです（目安：1日500kcal以内＝月2kg程度まで）。";
    }
    if (kcal < floor) {
      kcal = floor;
      warning += (warning ? "\n" : "") + "計算上の目標カロリーが低すぎるため、安全のため " + Math.round(floor) + " kcal を下限にしています。";
    }

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      kcal: Math.round(kcal),
      days: days,
      salt: p.sex === "male" ? 7.5 : 6.5,   // 食塩相当量の目標（厚労省 2020年版）
      veg: 350,                              // 野菜 350g（健康日本21）
      fruit: 200,                            // 果物 200g
      protein: Math.round((kcal * 0.15) / 4),
      fat: Math.round((kcal * 0.25) / 9),
      carb: Math.round((kcal * 0.60) / 4),
      sleep: 7,                              // 睡眠 7時間以上
      water: 1200,                           // 飲み水 1.2L（「健康のため水を飲もう」推進運動）
      steps: 8000,
      warning: warning,
    };
  }

  /* ---------------- タブ切りかえ ---------------- */
  const tabs = document.querySelectorAll(".hk-tab");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".hk-panel").forEach((p) => p.classList.remove("active"));
      document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "today") renderToday();
      if (btn.dataset.tab === "body") renderBodyTab();
      if (btn.dataset.tab === "goal") renderGoal();
    });
  });

  /* ==========================================================
     きょう（ダッシュボード）
     ========================================================== */
  const todayDateEl = document.getElementById("today-date");
  todayDateEl.value = todayStr();
  todayDateEl.addEventListener("change", renderToday);
  document.getElementById("today-prev").addEventListener("click", () => { todayDateEl.value = shiftDate(todayDateEl.value, -1); renderToday(); });
  document.getElementById("today-next").addEventListener("click", () => { todayDateEl.value = shiftDate(todayDateEl.value, 1); renderToday(); });

  function card(label, value, unit, target, opts) {
    opts = opts || {};
    const pct = target ? Math.min(100, (value / target) * 100) : 0;
    const over = opts.lessIsBetter && target && value > target;
    return '<div class="hk-card">' +
      '<p class="hk-card-label">' + label + "</p>" +
      '<p class="hk-card-value">' + (Math.round(value * 10) / 10) + '<small> / ' + target + " " + unit + "</small></p>" +
      '<div class="hk-bar"><div class="hk-bar-fill' + (over ? " over" : "") + '" style="width:' + pct + '%"></div></div>' +
      (opts.sub ? '<p class="hk-card-sub">' + opts.sub + "</p>" : "") +
      "</div>";
  }

  function renderToday() {
    const date = todayDateEl.value;
    const t = dayTotals(date);
    const targets = calcTargets(profile);
    document.getElementById("today-no-profile").hidden = !!targets;

    const cards = document.getElementById("today-cards");
    if (targets) {
      const rest = Math.round(targets.kcal - t.kcal);
      cards.innerHTML =
        card("カロリー", t.kcal, "kcal", targets.kcal, { sub: rest >= 0 ? "あと " + rest + " kcal 食べられます" : Math.abs(rest) + " kcal オーバーしています", lessIsBetter: true }) +
        card("塩分（食塩相当量）", t.salt, "g", targets.salt, { lessIsBetter: true }) +
        card("野菜", t.veg, "g", targets.veg) +
        card("果物", t.fruit, "g", targets.fruit) +
        card("たんぱく質", t.p, "g", targets.protein) +
        card("脂質", t.f, "g", targets.fat, { lessIsBetter: true }) +
        card("炭水化物", t.c, "g", targets.carb, { lessIsBetter: true });
    } else {
      cards.innerHTML =
        '<div class="hk-card"><p class="hk-card-label">カロリー</p><p class="hk-card-value">' + Math.round(t.kcal) + "<small> kcal</small></p></div>" +
        '<div class="hk-card"><p class="hk-card-label">塩分</p><p class="hk-card-value">' + (Math.round(t.salt * 10) / 10) + "<small> g</small></p></div>" +
        '<div class="hk-card"><p class="hk-card-label">野菜</p><p class="hk-card-value">' + Math.round(t.veg) + "<small> g</small></p></div>" +
        '<div class="hk-card"><p class="hk-card-label">果物</p><p class="hk-card-value">' + Math.round(t.fruit) + "<small> g</small></p></div>";
    }

    // 食事ごとのまとめ
    const day = meals[date] || {};
    let html = "";
    for (const key of Object.keys(MEAL_LABELS)) {
      const items = day[key] || [];
      if (!items.length) continue;
      const s = sumItems(items);
      html += '<div class="hk-meal-block"><h3>' + MEAL_LABELS[key] +
        '<span class="kcal">' + Math.round(s.kcal) + ' kcal</span></h3><p>' +
        items.map((i) => i.name + " " + Math.round(i.grams) + "g").join("、") + "</p></div>";
    }
    document.getElementById("today-meals").innerHTML = html || '<p class="hk-empty">この日の食事記録はまだありません。「食事きろく」タブから入力できます。</p>';

    // からだのまとめ
    const b = body[date] || {};
    const bits = [];
    if (b.weight) bits.push("体重 " + b.weight + " kg");
    if (b.sleep != null && b.sleep !== "") bits.push("睡眠 " + b.sleep + " 時間" + (targets && b.sleep < targets.sleep ? "（目標 " + targets.sleep + " 時間にあと少し）" : ""));
    if (b.steps) bits.push("歩数 " + b.steps + " 歩");
    if (b.water) bits.push("水分 " + b.water + " mL");
    if (b.memo) bits.push("メモ：" + b.memo);
    document.getElementById("today-body").innerHTML = bits.length ? bits.join("　／　") : '<span class="hk-empty">この日のからだ記録はまだありません。</span>';
  }

  /* ==========================================================
     食事きろく
     ========================================================== */
  const mealDateEl = document.getElementById("meal-date");
  const mealTypeEl = document.getElementById("meal-type");
  mealDateEl.value = todayStr();
  mealDateEl.addEventListener("change", renderItems);
  mealTypeEl.addEventListener("change", renderItems);

  function currentItems() {
    const d = mealDateEl.value, m = mealTypeEl.value;
    if (!meals[d]) meals[d] = {};
    if (!meals[d][m]) meals[d][m] = [];
    return meals[d][m];
  }
  function saveMeals() {
    // 空っぽの日・食事は片づけてから保存
    for (const d of Object.keys(meals)) {
      for (const m of Object.keys(meals[d])) if (!meals[d][m].length) delete meals[d][m];
      if (!Object.keys(meals[d]).length) delete meals[d];
    }
    save(KEYS.meals, meals);
  }

  const CONF_LABEL = { high: "", medium: "推定：ふつう", low: "推定：あいまい" };

  function renderItems() {
    const items = currentItems();
    const tbody = document.getElementById("items-body");
    tbody.innerHTML = "";
    items.forEach((item, idx) => {
      const n = calcItem(item);
      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      const nameInput = document.createElement("input");
      nameInput.className = "name-input";
      nameInput.value = item.name;
      nameInput.addEventListener("change", () => { item.name = nameInput.value; saveMeals(); });
      tdName.appendChild(nameInput);
      if (item.conf && CONF_LABEL[item.conf]) {
        const span = document.createElement("span");
        span.className = "hk-conf";
        span.textContent = CONF_LABEL[item.conf];
        tdName.appendChild(span);
      }

      const tdG = document.createElement("td");
      const gInput = document.createElement("input");
      gInput.type = "number"; gInput.min = "0"; gInput.step = "5";
      gInput.className = "g-input";
      gInput.value = Math.round(item.grams);
      gInput.addEventListener("input", () => {
        item.grams = Number(gInput.value) || 0;
        saveMeals();
        refreshRow(tr, item);
        renderTotals();
      });
      tdG.appendChild(gInput);

      const tdKcal = document.createElement("td");
      tdKcal.className = "cell-kcal";
      tdKcal.textContent = Math.round(n.kcal);

      const tdSalt = document.createElement("td");
      tdSalt.className = "cell-salt";
      tdSalt.textContent = (Math.round(n.salt * 10) / 10).toFixed(1);

      const tdDel = document.createElement("td");
      const del = document.createElement("button");
      del.className = "hk-del"; del.textContent = "✕"; del.title = "削除";
      del.addEventListener("click", () => {
        items.splice(idx, 1);
        saveMeals();
        renderItems();
      });
      tdDel.appendChild(del);

      tr.append(tdName, tdG, tdKcal, tdSalt, tdDel);
      tbody.appendChild(tr);
    });
    document.getElementById("items-empty").hidden = items.length > 0;
    renderTotals();
  }

  function refreshRow(tr, item) {
    const n = calcItem(item);
    tr.querySelector(".cell-kcal").textContent = Math.round(n.kcal);
    tr.querySelector(".cell-salt").textContent = (Math.round(n.salt * 10) / 10).toFixed(1);
  }

  function renderTotals() {
    const s = sumItems(currentItems());
    document.getElementById("t-grams").textContent = Math.round(s.grams) + "g";
    document.getElementById("t-kcal").textContent = Math.round(s.kcal);
    document.getElementById("t-salt").textContent = (Math.round(s.salt * 10) / 10).toFixed(1);
    document.getElementById("items-sub").textContent =
      "たんぱく質 " + (Math.round(s.p * 10) / 10) + "g ／ 脂質 " + (Math.round(s.f * 10) / 10) +
      "g ／ 炭水化物 " + (Math.round(s.c * 10) / 10) + "g ／ 野菜 " + Math.round(s.veg) +
      "g ／ 果物 " + Math.round(s.fruit) + "g";
  }

  /* ---------- 食品検索で追加 ---------- */
  const searchEl = document.getElementById("food-search");
  const resultsEl = document.getElementById("food-results");
  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim().toLowerCase();
    resultsEl.innerHTML = "";
    if (!q) return;
    const hits = FOOD_DB.filter((f) => f.name.toLowerCase().includes(q) || f.kana.includes(q)).slice(0, 12);
    for (const f of hits) {
      const div = document.createElement("div");
      div.className = "hk-food-item";
      div.innerHTML = "<span>" + f.name + "</span><small>" + Math.round((f.kcal * f.serv) / 100) + " kcal / " + f.serv + "g</small>";
      div.addEventListener("click", () => {
        currentItems().push({
          name: f.name, grams: f.serv,
          per: { kcal: f.kcal, p: f.p, f: f.f, c: f.c, salt: f.salt },
          veg: f.veg, fruit: f.fruit,
        });
        saveMeals();
        renderItems();
        searchEl.value = ""; resultsEl.innerHTML = "";
      });
      resultsEl.appendChild(div);
    }
    if (!hits.length) resultsEl.innerHTML = '<p class="hk-empty">見つかりませんでした。「自由入力で追加」も使えます。</p>';
  });

  document.getElementById("add-custom").addEventListener("click", () => {
    const name = prompt("食品の名前を入れてください", "");
    if (!name) return;
    const kcal = Number(prompt("100gあたりのカロリー（kcal）", "100")) || 0;
    const salt = Number(prompt("100gあたりの塩分（食塩相当量g）わからなければ0", "0")) || 0;
    currentItems().push({ name: name, grams: 100, per: { kcal: kcal, p: 0, f: 0, c: 0, salt: salt }, veg: 0, fruit: 0 });
    saveMeals();
    renderItems();
  });

  /* ---------- 写真のAI解析 ---------- */
  const photoInput = document.getElementById("photo-input");
  const photoPreview = document.getElementById("photo-preview");
  const analyzeBtn = document.getElementById("analyze-btn");
  const statusEl = document.getElementById("analyze-status");
  const noteEl = document.getElementById("analyze-note");
  let photoBase64 = null;

  photoInput.addEventListener("change", async () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    statusEl.textContent = "写真を読み込んでいます…";
    try {
      photoBase64 = await resizeToJpegBase64(file, 1100, 0.85);
      photoPreview.src = "data:image/jpeg;base64," + photoBase64;
      photoPreview.hidden = false;
      analyzeBtn.disabled = false;
      statusEl.textContent = "";
    } catch (e) {
      statusEl.textContent = "写真を読み込めませんでした：" + e.message;
    }
  });

  function resizeToJpegBase64(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality).split(",")[1]);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("画像の形式に対応していません")); };
      img.src = url;
    });
  }

  // AIに返してもらうデータの形（構造化出力）
  const ANALYZE_SCHEMA = {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "食材・料理の名前（日本語）" },
            grams: { type: "number", description: "写真から推定した重さ（グラム）" },
            kcal_per_100g: { type: "number" },
            protein_per_100g: { type: "number" },
            fat_per_100g: { type: "number" },
            carbs_per_100g: { type: "number" },
            salt_per_100g: { type: "number", description: "食塩相当量(g)/100g" },
            veg_ratio: { type: "number", description: "重量のうち野菜が占める割合 0〜1" },
            fruit_ratio: { type: "number", description: "重量のうち果物が占める割合 0〜1" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["name", "grams", "kcal_per_100g", "protein_per_100g", "fat_per_100g", "carbs_per_100g", "salt_per_100g", "veg_ratio", "fruit_ratio", "confidence"],
          additionalProperties: false,
        },
      },
      note: { type: "string", description: "隠れていそうな食材や、推定の注意点（日本語・1〜2文）" },
    },
    required: ["items", "note"],
    additionalProperties: false,
  };

  const ANALYZE_PROMPT =
    "この写真は日本の食事（お弁当など）です。写っている食材・料理をすべて挙げ、" +
    "それぞれのおおよその重さ（グラム）と、100gあたりの栄養価（カロリー・たんぱく質・脂質・炭水化物・食塩相当量）を" +
    "日本食品標準成分表の知識をもとに推定してください。" +
    "ごはんの下や容器のかげに隠れていそうな食材があれば、それも confidence を low にして含めてください。" +
    "veg_ratio はその料理の重量のうち野菜（いも類を除く）が占める割合、fruit_ratio は果物の割合です。" +
    "調味料・揚げ衣・たれは料理の栄養価に含めてください。";

  analyzeBtn.addEventListener("click", async () => {
    const apiKey = load(KEYS.apikey, "");
    if (!apiKey) {
      statusEl.textContent = "先に「せってい」タブでAPIキーを保存してください。";
      return;
    }
    analyzeBtn.disabled = true;
    statusEl.textContent = "AIが写真を解析しています…（30秒〜1分ほどかかることがあります）";
    noteEl.hidden = true;
    try {
      const { default: Anthropic } = await import("https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk/+esm");
      const client = new Anthropic({ apiKey: apiKey, dangerouslyAllowBrowser: true });
      const response = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 4000,
        output_config: { format: { type: "json_schema", schema: ANALYZE_SCHEMA } },
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: photoBase64 } },
            { type: "text", text: ANALYZE_PROMPT },
          ],
        }],
      });

      if (response.stop_reason === "refusal") {
        throw new Error("AIがこの写真の解析をお断りしました。別の写真で試してください。");
      }
      const textBlock = response.content.find((b) => b.type === "text");
      if (!textBlock) throw new Error("AIから結果が返ってきませんでした。");
      const data = JSON.parse(textBlock.text);

      const items = currentItems();
      for (const it of data.items) {
        items.push({
          name: it.name,
          grams: Math.max(0, Math.round(it.grams)),
          per: {
            kcal: it.kcal_per_100g, p: it.protein_per_100g, f: it.fat_per_100g,
            c: it.carbs_per_100g, salt: it.salt_per_100g,
          },
          veg: Math.min(1, Math.max(0, it.veg_ratio)),
          fruit: Math.min(1, Math.max(0, it.fruit_ratio)),
          conf: it.confidence,
        });
      }
      saveMeals();
      renderItems();
      statusEl.textContent = data.items.length + " 件の食材を追加しました。量や名前を確認して直してください。";
      if (data.note) {
        noteEl.textContent = "💡 AIからのメモ：" + data.note;
        noteEl.hidden = false;
      }
    } catch (e) {
      let msg = e && e.message ? e.message : String(e);
      if (e && e.status === 401) msg = "APIキーが正しくないようです。「せってい」タブで確認してください。";
      if (e && e.status === 429) msg = "アクセスが集中しています。少し待ってからもう一度試してください。";
      statusEl.textContent = "解析に失敗しました：" + msg;
    } finally {
      analyzeBtn.disabled = false;
    }
  });

  /* ==========================================================
     からだ
     ========================================================== */
  const bodyDateEl = document.getElementById("body-date");
  bodyDateEl.value = todayStr();
  bodyDateEl.addEventListener("change", renderBodyTab);

  const bodyFields = { weight: "body-weight", sleep: "body-sleep", steps: "body-steps", water: "body-water", memo: "body-memo" };

  for (const [key, id] of Object.entries(bodyFields)) {
    document.getElementById(id).addEventListener("input", () => {
      const d = bodyDateEl.value;
      if (!body[d]) body[d] = {};
      const v = document.getElementById(id).value;
      body[d][key] = key === "memo" ? v : (v === "" ? "" : Number(v));
      save(KEYS.body, body);
      document.getElementById("body-saved").textContent = "保存しました ✓";
      renderCharts();
    });
  }

  function renderBodyTab() {
    const d = bodyDateEl.value;
    const b = body[d] || {};
    for (const [key, id] of Object.entries(bodyFields)) {
      document.getElementById(id).value = b[key] != null ? b[key] : "";
    }
    document.getElementById("body-saved").textContent = "";
    renderCharts();
  }

  /* ---------- グラフ（SVG） ---------- */
  function renderCharts() {
    // 体重：記録のある日を古い順に折れ線で
    const wDays = Object.keys(body).filter((d) => body[d].weight).sort();
    const wEl = document.getElementById("weight-chart");
    if (wDays.length < 1) {
      wEl.innerHTML = '<p class="empty">体重を記録するとグラフが表示されます。</p>';
    } else {
      const data = wDays.slice(-60).map((d) => ({ d: d, v: body[d].weight }));
      wEl.innerHTML = lineChart(data, profile ? profile.target : null);
    }

    // 睡眠：最近14日を棒グラフで
    const sEl = document.getElementById("sleep-chart");
    const days = [];
    for (let i = 13; i >= 0; i--) days.push(shiftDate(todayStr(), -i));
    const hasSleep = days.some((d) => body[d] && body[d].sleep);
    if (!hasSleep) {
      sEl.innerHTML = '<p class="empty">睡眠時間を記録するとグラフが表示されます。</p>';
    } else {
      sEl.innerHTML = barChart(days.map((d) => ({ d: d, v: (body[d] && body[d].sleep) || 0 })), 7);
    }
  }

  function lineChart(data, targetValue) {
    const W = Math.max(320, data.length * 34), H = 180, pad = 30;
    let vals = data.map((p) => p.v);
    if (targetValue) vals = vals.concat([targetValue]);
    const min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
    const x = (i) => pad + (i * (W - pad * 2)) / Math.max(1, data.length - 1);
    const y = (v) => H - pad - ((v - min) * (H - pad * 2)) / (max - min);
    let svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">';
    if (targetValue) {
      svg += '<line x1="' + pad + '" y1="' + y(targetValue) + '" x2="' + (W - pad) + '" y2="' + y(targetValue) + '" stroke="#a8c8a0" stroke-dasharray="4 4"/>' +
        '<text x="' + (W - pad) + '" y="' + (y(targetValue) - 5) + '" font-size="10" fill="#6f9468" text-anchor="end">目標 ' + targetValue + 'kg</text>';
    }
    svg += '<polyline fill="none" stroke="#8d7bb8" stroke-width="2" points="' +
      data.map((p, i) => x(i) + "," + y(p.v)).join(" ") + '"/>';
    data.forEach((p, i) => {
      svg += '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="3.5" fill="#8d7bb8"/>' +
        '<text x="' + x(i) + '" y="' + (y(p.v) - 8) + '" font-size="10" fill="#5a5560" text-anchor="middle">' + p.v + "</text>" +
        '<text x="' + x(i) + '" y="' + (H - 8) + '" font-size="9" fill="#948f9e" text-anchor="middle">' + p.d.slice(5).replace("-", "/") + "</text>";
    });
    return svg + "</svg>";
  }

  function barChart(data, targetValue) {
    const W = Math.max(320, data.length * 30), H = 170, pad = 26;
    const max = Math.max(targetValue + 2, ...data.map((p) => p.v));
    const bw = (W - pad * 2) / data.length - 6;
    let svg = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">';
    const ty = H - pad - (targetValue / max) * (H - pad * 2);
    svg += '<line x1="' + pad + '" y1="' + ty + '" x2="' + (W - pad) + '" y2="' + ty + '" stroke="#a8c8a0" stroke-dasharray="4 4"/>' +
      '<text x="' + (W - pad) + '" y="' + (ty - 4) + '" font-size="10" fill="#6f9468" text-anchor="end">目標 ' + targetValue + "h</text>";
    data.forEach((p, i) => {
      const h = (p.v / max) * (H - pad * 2);
      const xx = pad + i * ((W - pad * 2) / data.length) + 3;
      if (p.v > 0) {
        svg += '<rect x="' + xx + '" y="' + (H - pad - h) + '" width="' + bw + '" height="' + h + '" rx="3" fill="' + (p.v >= targetValue ? "#a8c8a0" : "#c9bce4") + '"/>' +
          '<text x="' + (xx + bw / 2) + '" y="' + (H - pad - h - 4) + '" font-size="9" fill="#5a5560" text-anchor="middle">' + p.v + "</text>";
      }
      svg += '<text x="' + (xx + bw / 2) + '" y="' + (H - 8) + '" font-size="8" fill="#948f9e" text-anchor="middle">' + p.d.slice(8) + "</text>";
    });
    return svg + "</svg>";
  }

  /* ==========================================================
     もくひょう
     ========================================================== */
  function renderGoal() {
    if (profile) {
      document.getElementById("p-sex").value = profile.sex;
      document.getElementById("p-age").value = profile.age;
      document.getElementById("p-height").value = profile.height;
      document.getElementById("p-weight").value = profile.weight;
      document.getElementById("p-target").value = profile.target;
      document.getElementById("p-date").value = profile.targetDate || "";
      document.getElementById("p-activity").value = profile.activity;
    }
    renderGoalResult();
  }

  document.getElementById("p-save").addEventListener("click", () => {
    const p = {
      sex: document.getElementById("p-sex").value,
      age: Number(document.getElementById("p-age").value),
      height: Number(document.getElementById("p-height").value),
      weight: Number(document.getElementById("p-weight").value),
      target: Number(document.getElementById("p-target").value),
      targetDate: document.getElementById("p-date").value,
      activity: document.getElementById("p-activity").value,
    };
    if (!p.age || !p.height || !p.weight || !p.target) {
      document.getElementById("p-status").textContent = "年齢・身長・体重・目標体重を入れてください。";
      return;
    }
    profile = p;
    save(KEYS.profile, profile);
    document.getElementById("p-status").textContent = "保存しました ✓";
    renderGoalResult();
  });

  function renderGoalResult() {
    const t = calcTargets(profile);
    const box = document.getElementById("goal-result");
    if (!t) { box.hidden = true; return; }
    box.hidden = false;

    function simpleCard(label, value, sub) {
      return '<div class="hk-card"><p class="hk-card-label">' + label + '</p><p class="hk-card-value">' + value + "</p>" +
        (sub ? '<p class="hk-card-sub">' + sub + "</p>" : "") + "</div>";
    }
    const diff = Math.round((profile.weight - profile.target) * 10) / 10;
    document.getElementById("goal-cards").innerHTML =
      simpleCard("1日の目標カロリー", t.kcal + " <small>kcal</small>", "基礎代謝 " + t.bmr + " kcal ／ 消費の目安 " + t.tdee + " kcal") +
      simpleCard("目標体重まで", (diff > 0 ? "あと " + diff + " <small>kg</small>" : diff < 0 ? Math.abs(diff) + " <small>kg 増量</small>" : "達成！"),
        profile.targetDate ? "目標日まで " + t.days + " 日" : "目標日を入れるとペースを計算します") +
      simpleCard("塩分", t.salt + " <small>g 未満</small>", "食塩相当量") +
      simpleCard("野菜・果物", "野菜 " + t.veg + "g ／ 果物 " + t.fruit + "<small>g</small>", "") +
      simpleCard("PFCバランスの目安", "P " + t.protein + "g ／ F " + t.fat + "g ／ C " + t.carb + "<small>g</small>", "たんぱく質15%・脂質25%・炭水化物60%") +
      simpleCard("睡眠・水分・歩数", t.sleep + "時間以上 ／ " + t.water + "mL ／ " + t.steps + "<small>歩</small>", "");

    const warn = document.getElementById("goal-warning");
    warn.hidden = !t.warning;
    warn.textContent = t.warning;
  }

  /* ==========================================================
     せってい
     ========================================================== */
  document.getElementById("api-key").value = load(KEYS.apikey, "");
  document.getElementById("api-save").addEventListener("click", () => {
    save(KEYS.apikey, document.getElementById("api-key").value.trim());
    document.getElementById("api-status").textContent = "保存しました ✓";
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    const data = { profile: profile, meals: meals, body: body, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kenko-note-" + todayStr() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    document.getElementById("backup-status").textContent = "書き出しました ✓";
  });

  document.getElementById("import-input").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.profile) { profile = data.profile; save(KEYS.profile, profile); }
      if (data.meals) { meals = data.meals; save(KEYS.meals, meals); }
      if (data.body) { body = data.body; save(KEYS.body, body); }
      document.getElementById("backup-status").textContent = "読み込みました ✓";
      renderToday(); renderItems(); renderBodyTab(); renderGoal();
    } catch (err) {
      document.getElementById("backup-status").textContent = "読み込めませんでした：ファイルが壊れているかもしれません。";
    }
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    if (!confirm("本当にすべての記録を削除しますか？この操作は元に戻せません。\n（先に「データを書き出す」でバックアップしておくのがおすすめです）")) return;
    localStorage.removeItem(KEYS.profile);
    localStorage.removeItem(KEYS.meals);
    localStorage.removeItem(KEYS.body);
    profile = null; meals = {}; body = {};
    renderToday(); renderItems(); renderBodyTab(); renderGoal();
    alert("削除しました。");
  });

  /* ---------------- 初期表示 ---------------- */
  renderToday();
  renderItems();
  renderBodyTab();
  renderGoal();
})();
