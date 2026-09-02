/* ==========================================================
   ★ お弁当の記録はこのファイルに追加します ★

   新しいお弁当を追加するときは、下のお手本をコピーして
   「obentoList = [」のすぐ下の行に貼り付けて、
   日付・写真のファイル名・コメントを書きかえてください。

   ─── お手本（この5行をコピー） ───────────────
  {
    date: "2026-06-15",
    photo: "images/2026-06-15.jpg",
    comment: "ここにひとことコメントを書きます",
  },
   ─────────────────────────────

   ※ コメントは空（""）のままでもOK。写真だけ表示されます。
   ========================================================== */

const obentoList = [

  {
    date: "2026-09-03",
    photo: "images/ChatGPT Image 2026年9月3日 07_53_27.png",
    comment: "今日はお魚のお弁当♡　しっかり食べて健康でいてね♡",
  },

  {
    date: "2026-09-02",
    photo: "ChatGPT Image 2026年9月2日 08_25_10.png",
    comment: "紅茶で煮込んだチャーシュー美味しいといいな♡",
  },

  {
    date: "2026-09-01",
    photo: "images/ChatGPT Image 2026年9月1日 08_04_43.png",
    comment: "今日から2学期のお弁当スタート♡",
  },

  {
    date: "2026-07-10",
    photo: "images/2026-07-10.jpg",
    comment: "初パンケーキ弁当　どうかな♡",
  },

  {
    date: "2026-07-09",
    photo: "images/2026-07-09.jpg",
    comment: "娘の好きな銀鱈の煮付け　美味しく召し上がれ♡",
  },

  {
    date: "2026-07-08",
    photo: "images/2026-07-08.jpg",
    comment: "石垣島のパイナップル♡めっちゃ甘〜い♡",
  },

  {
    date: "2026-07-06",
    photo: "images/2026-07-06.jpg",
    comment: "今日は体育祭　食べやすくおにぎりにしたよ♡",
  },

  {
    date: "2026-07-03",
    photo: "",
    comment: "定期テスト4日目",
  },

  {
    date: "2026-07-02",
    photo: "",
    comment: "定期テスト3日目",
  },

  {
    date: "2026-07-01",
    photo: "images/2026-07-01.jpg",
    comment: "定期テスト2日目　今日も頑張れ〜💕 フルーツだけ準備したよ",
  },

  {
    date: "2026-06-30",
    photo: "images/2026-06-30.jpg",
    comment: "定期テスト1日目　頑張ってね",
  },

  {
    date: "2026-06-29",
    photo: "images/2026-06-29.jpg",
    comment: "娘からのリクエストでチキンカツにチェダーチーズをのせてみた♡　Fuuさんのスイカはみずみずしいです",
  },

  {
    date: "2026-06-26",
    photo: "images/2026-06-26.jpg",
    comment: "パスタが大盛りだと言われたけど、そのまま持たせてしまった💦ごめんね💦",
  },

  {
    date: "2026-06-25",
    photo: "images/2026-06-25.jpg",
    comment: "なるべくお魚メニューを増やしたいなぁ",
  },

  {
    date: "2026-06-24",
    photo: "images/2026-06-24.jpg",
    comment: "娘の大好きなヤンニョムチキン💕岩手県の花巻市のはちみつを加えてとっても美味しくできました✌",
  },

  {
    date: "2026-06-23",
    photo: "images/2026-06-23.jpg",
    comment: "ふるさと納税の千葉県銚子市の塩銀鮭は本当に美味しい💕茅乃舎のお出汁でつくるだし巻きたまごも娘のお気に入り💕",
  },

  {
    date: "2026-06-22",
    photo: "images/2026-06-22.jpg",
    comment: "",
  },

  {
    date: "2026-06-19",
    photo: "images/2026-06-19.jpg",
    comment: "",
  },

  {
    date: "2026-06-18",
    photo: "images/2026-06-18.jpg",
    comment: "",
  },

  {
    date: "2026-06-16",
    photo: "images/2026-06-16.jpg",
    comment: "",
  },

  {
    date: "2026-06-15",
    photo: "images/2026-06-15.jpg",
    comment: "",
  },

  {
    date: "2026-06-12",
    photo: "images/2026-06-12.jpg",
    comment: "",
  },

  {
    date: "2026-05-08",
    photo: "images/2026-05-08.jpg",
    comment: "",
  },

  {
    date: "2026-04-30",
    photo: "images/2026-04-30.jpg",
    comment: "",
  },

  {
    date: "2026-04-10",
    photo: "images/2026-04-10.jpg",
    comment: "",
  },

  {
    date: "2026-04-09",
    photo: "images/2026-04-09.jpg",
    comment: "",
  },

  {
    date: "2026-06-11",
    photo: "images/2026-06-11.jpg",
    comment: "おにぎり弁当　ネギ入りたまご焼き　肉きんぴら　フルーツ",
  },

  {
    date: "2026-06-10",
    photo: "images/2026-06-10.jpg",
    comment: "",
  },

  {
    date: "2026-06-09",
    photo: "images/2026-06-09.jpg",
    comment: "",
  },

  {
    date: "2026-06-08",
    photo: "images/2026-06-08.jpg",
    comment: "豚丼　たまご焼き　とうもろこし　フルーツ",
  },

  {
    date: "2026-06-05",
    photo: "images/2026-06-05.jpg",
    comment: "",
  },

  {
    date: "2026-06-04",
    photo: "images/2026-06-04.jpg",
    comment: "雑穀ごはん　ぶり大根　にんじんオムレツ　フルーツ",
  },

  {
    date: "2026-06-02",
    photo: "images/2026-06-02.jpg",
    comment: "",
  },

  {
    date: "2026-06-01",
    photo: "images/2026-06-01.jpg",
    comment: "",
  },

  {
    date: "2026-05-29",
    photo: "images/2026-05-29.jpg",
    comment: "",
  },

  {
    date: "2026-05-27",
    photo: "images/2026-05-27.jpg",
    comment: "",
  },

  {
    date: "2026-05-26",
    photo: "images/2026-05-26.jpg",
    comment: "",
  },

  {
    date: "2026-05-25",
    photo: "images/2026-05-25.jpg",
    comment: "",
  },

  {
    date: "2026-05-22",
    photo: "images/2026-05-22.jpg",
    comment: "",
  },

  {
    date: "2026-05-21",
    photo: "images/2026-05-21.jpg",
    comment: "",
  },

  {
    date: "2026-05-20",
    photo: "images/2026-05-20.jpg",
    comment: "",
  },

  {
    date: "2026-05-19",
    photo: "images/2026-05-19.jpg",
    comment: "",
  },

  {
    date: "2026-05-18",
    photo: "images/2026-05-18.jpg",
    comment: "",
  },

  {
    date: "2026-05-15",
    photo: "images/2026-05-15.jpg",
    comment: "",
  },

  {
    date: "2026-05-14",
    photo: "images/2026-05-14.jpg",
    comment: "",
  },

  {
    date: "2026-05-13",
    photo: "images/2026-05-13.jpg",
    comment: "",
  },

  {
    date: "2026-05-12",
    photo: "images/2026-05-12.jpg",
    comment: "",
  },

  {
    date: "2026-05-11",
    photo: "images/2026-05-11.jpg",
    comment: "",
  },

  {
    date: "2026-05-07",
    photo: "images/2026-05-07.jpg",
    comment: "",
  },

  {
    date: "2026-04-28",
    photo: "images/2026-04-28.jpg",
    comment: "",
  },

  {
    date: "2026-04-27",
    photo: "images/2026-04-27.jpg",
    comment: "",
  },

  {
    date: "2026-04-23",
    photo: "images/2026-04-23.jpg",
    comment: "",
  },

  {
    date: "2026-04-22",
    photo: "images/2026-04-22.jpg",
    comment: "",
  },

  {
    date: "2026-04-21",
    photo: "images/2026-04-21.jpg",
    comment: "",
  },

  {
    date: "2026-04-20",
    photo: "images/2026-04-20.jpg",
    comment: "",
  },

  {
    date: "2026-04-17",
    photo: "images/2026-04-17.jpg",
    comment: "",
  },

  {
    date: "2026-04-16",
    photo: "images/2026-04-16.jpg",
    comment: "",
  },

  {
    date: "2026-04-15",
    photo: "images/2026-04-15.jpg",
    comment: "",
  },

  {
    date: "2026-04-14",
    photo: "images/2026-04-14.jpg",
    comment: "",
  },

  {
    date: "2026-04-13",
    photo: "images/2026-04-13.jpg",
    comment: "",
  },

  {
    date: "2026-04-08",
    photo: "images/2026-04-08.jpg",
    comment: "お弁当初日　お赤飯でお祝い✨入学おめでとう✨",
  },

];

/* ==========================================================
   ★ お弁当がなかった日のメモはこちら ★

   休校・行事などでお弁当がなかった日は、下のお手本のように
   1行追加すると、カレンダーのその日に文字で表示されます。

   ─── お手本① 1日だけのとき（この1行をコピー） ─────────
  { date: "2026-06-03", note: "ここに理由を書きます" },
   ─────────────────────────────────

   ─── お手本② 夏休みなど何日も続くとき ─────────────
  { from: "2026-07-21", to: "2026-08-30", note: "夏休み" },
   ─────────────────────────────────
   「from（はじまりの日）」から「to（おわりの日）」までの毎日に
   同じ文字が表示されます。冬休み・春休みにも使えます。

   ※ 国の祝日（GWや海の日など）は自動で表示されるので
      ここに書かなくて大丈夫です。
   ========================================================== */

const oyasumiList = [

  { date: "2026-08-31", note: "始業式" },

  { from: "2026-07-21", to: "2026-08-30", note: "夏休み" },

  { date: "2026-07-18", note: "終業式" },

  { date: "2026-07-17", note: "自宅学習日" },

  { date: "2026-07-16", note: "自宅学習日" },

  { date: "2026-07-15", note: "自宅学習日" },

  { date: "2026-07-14", note: "自宅学習日" },

  { date: "2026-07-13", note: "自宅学習日" },

  { date: "2026-07-07", note: "休校日" },

  { date: "2026-06-17", note: "午前授業" },

  { date: "2026-06-03", note: "台風のため休校" },

  { date: "2026-05-28", note: "自宅学習日" },

  { date: "2026-04-24", note: "移動教室" },

];

/* ==========================================================
   ▼ ここから下はプログラムです。さわらなくて大丈夫です ▼
   上の「お手本②」で書いた期間（from 〜 to）を、
   1日ずつのメモに自動で変換しています。
   ========================================================== */
(function expandOyasumiRanges() {
  // "2026-7-21" のような書き方でも "2026-07-21" に揃える
  function tidy(dateText) {
    const p = String(dateText).trim().split("-");
    if (p.length !== 3) return null;
    const y = Number(p[0]), m = Number(p[1]), d = Number(p[2]);
    if (!y || !m || !d) return null;
    return y + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  }

  const expanded = [];
  for (const o of oyasumiList) {
    if (!o || !o.note) continue;

    // 1日だけのメモは、そのまま
    if (!o.from || !o.to) { expanded.push(o); continue; }

    // 期間のメモは、はじまりの日からおわりの日まで1日ずつに増やす
    const start = tidy(o.from), end = tidy(o.to);
    if (!start || !end) continue;
    const cur = new Date(start + "T00:00:00");
    const last = new Date(end + "T00:00:00");
    let guard = 0; // 書き間違えても止まるように、最大2年ぶんまで
    while (cur <= last && guard++ < 800) {
      expanded.push({
        date: cur.getFullYear() + "-" +
          String(cur.getMonth() + 1).padStart(2, "0") + "-" +
          String(cur.getDate()).padStart(2, "0"),
        note: o.note,
      });
      cur.setDate(cur.getDate() + 1);
    }
  }

  oyasumiList.length = 0;
  Array.prototype.push.apply(oyasumiList, expanded);
})();
