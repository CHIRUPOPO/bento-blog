/* ==========================================================
   ★ 食品データベース ★

   100gあたりの栄養価データです（日本食品標準成分表をもとにした概算値）。
   kcal=カロリー / p=たんぱく質g / f=脂質g / c=炭水化物g / salt=食塩相当量g
   veg=重量のうち野菜の割合(0〜1) / fruit=果物の割合(0〜1)
   serv=よく使う1人前のグラム数（追加したときの初期値）

   自分で食品を増やしたいときは、お手本をコピーして1行追加してください。
   ─── お手本 ───────────────────────────
  { name: "食品の名前", kana: "ひらがなよみ", kcal: 100, p: 5, f: 3, c: 12, salt: 0.5, veg: 0, fruit: 0, serv: 100 },
   ─────────────────────────────────
   ========================================================== */

const FOOD_DB = [

  /* ---- ごはん・パン・めん ---- */
  { name: "白ごはん", kana: "しろごはん ごはん はくまい", kcal: 156, p: 2.5, f: 0.3, c: 37.1, salt: 0, veg: 0, fruit: 0, serv: 150 },
  { name: "玄米ごはん", kana: "げんまいごはん", kcal: 152, p: 2.8, f: 1.0, c: 35.6, salt: 0, veg: 0, fruit: 0, serv: 150 },
  { name: "雑穀ごはん", kana: "ざっこくごはん", kcal: 158, p: 3.5, f: 1.0, c: 33.5, salt: 0, veg: 0, fruit: 0, serv: 150 },
  { name: "お赤飯", kana: "おせきはん せきはん", kcal: 186, p: 4.3, f: 0.6, c: 41.9, salt: 0, veg: 0, fruit: 0, serv: 150 },
  { name: "おにぎり（鮭）", kana: "おにぎり さけ しゃけ", kcal: 170, p: 4.5, f: 1.5, c: 35.0, salt: 0.9, veg: 0, fruit: 0, serv: 110 },
  { name: "おにぎり（梅）", kana: "おにぎり うめ", kcal: 165, p: 3.0, f: 0.5, c: 37.0, salt: 1.0, veg: 0, fruit: 0, serv: 110 },
  { name: "もち", kana: "もち おもち", kcal: 223, p: 4.0, f: 0.6, c: 50.8, salt: 0, veg: 0, fruit: 0, serv: 50 },
  { name: "食パン", kana: "しょくぱん ぱん", kcal: 248, p: 8.9, f: 4.1, c: 46.4, salt: 1.2, veg: 0, fruit: 0, serv: 60 },
  { name: "ロールパン", kana: "ろーるぱん", kcal: 309, p: 10.1, f: 9.0, c: 48.6, salt: 1.2, veg: 0, fruit: 0, serv: 30 },
  { name: "メロンパン", kana: "めろんぱん", kcal: 349, p: 8.0, f: 10.5, c: 59.9, salt: 0.5, veg: 0, fruit: 0, serv: 90 },
  { name: "サンドイッチ（ハム）", kana: "さんどいっち はむ", kcal: 240, p: 9.0, f: 11.0, c: 26.0, salt: 1.3, veg: 0.1, fruit: 0, serv: 130 },
  { name: "うどん（ゆで）", kana: "うどん", kcal: 95, p: 2.6, f: 0.4, c: 21.6, salt: 0.3, veg: 0, fruit: 0, serv: 230 },
  { name: "そば（ゆで）", kana: "そば", kcal: 130, p: 4.8, f: 1.0, c: 26.0, salt: 0, veg: 0, fruit: 0, serv: 200 },
  { name: "中華めん（ゆで）", kana: "ちゅうかめん らーめん", kcal: 133, p: 4.9, f: 0.6, c: 27.9, salt: 0.2, veg: 0, fruit: 0, serv: 200 },
  { name: "スパゲッティ（ゆで）", kana: "すぱげってぃ ぱすた", kcal: 150, p: 5.8, f: 0.9, c: 30.3, salt: 0.5, veg: 0, fruit: 0, serv: 220 },
  { name: "焼きそば", kana: "やきそば", kcal: 160, p: 5.0, f: 6.0, c: 22.0, salt: 1.0, veg: 0.15, fruit: 0, serv: 250 },
  { name: "チャーハン", kana: "ちゃーはん", kcal: 180, p: 5.0, f: 6.5, c: 25.0, salt: 1.2, veg: 0.05, fruit: 0, serv: 250 },
  { name: "カレーライス", kana: "かれーらいす かれー", kcal: 145, p: 3.5, f: 4.5, c: 22.5, salt: 0.9, veg: 0.1, fruit: 0, serv: 450 },

  /* ---- 肉・魚のおかず ---- */
  { name: "鶏のからあげ", kana: "からあげ とりにく", kcal: 290, p: 24.0, f: 18.0, c: 13.0, salt: 1.1, veg: 0, fruit: 0, serv: 90 },
  { name: "鶏の照り焼き", kana: "てりやき とりにく", kcal: 220, p: 19.0, f: 13.0, c: 6.0, salt: 1.2, veg: 0, fruit: 0, serv: 90 },
  { name: "とんかつ", kana: "とんかつ", kcal: 350, p: 19.0, f: 25.0, c: 14.0, salt: 0.7, veg: 0, fruit: 0, serv: 100 },
  { name: "豚の生姜焼き", kana: "しょうがやき ぶたにく", kcal: 240, p: 19.0, f: 17.0, c: 6.0, salt: 1.2, veg: 0.05, fruit: 0, serv: 90 },
  { name: "豚丼の具", kana: "ぶたどん", kcal: 180, p: 10.0, f: 12.0, c: 7.0, salt: 1.3, veg: 0.1, fruit: 0, serv: 120 },
  { name: "牛丼の具", kana: "ぎゅうどん", kcal: 190, p: 10.0, f: 13.0, c: 8.0, salt: 1.3, veg: 0.15, fruit: 0, serv: 120 },
  { name: "ハンバーグ", kana: "はんばーぐ", kcal: 223, p: 13.0, f: 17.0, c: 12.0, salt: 1.0, veg: 0.05, fruit: 0, serv: 100 },
  { name: "ミートボール", kana: "みーとぼーる にくだんご", kcal: 200, p: 11.0, f: 12.0, c: 12.0, salt: 1.2, veg: 0, fruit: 0, serv: 60 },
  { name: "ウインナー", kana: "ういんなー そーせーじ", kcal: 320, p: 11.5, f: 30.0, c: 3.3, salt: 1.9, veg: 0, fruit: 0, serv: 40 },
  { name: "ベーコン", kana: "べーこん", kcal: 400, p: 12.9, f: 39.1, c: 0.3, salt: 2.0, veg: 0, fruit: 0, serv: 20 },
  { name: "ハム", kana: "はむ", kcal: 115, p: 18.6, f: 3.9, c: 2.0, salt: 2.3, veg: 0, fruit: 0, serv: 20 },
  { name: "肉きんぴら", kana: "にくきんぴら きんぴら", kcal: 150, p: 6.0, f: 8.0, c: 13.0, salt: 1.0, veg: 0.5, fruit: 0, serv: 60 },
  { name: "鮭の塩焼き", kana: "さけ しゃけ しおやき", kcal: 170, p: 23.0, f: 8.0, c: 0.1, salt: 1.4, veg: 0, fruit: 0, serv: 70 },
  { name: "さばの塩焼き", kana: "さば しおやき", kcal: 260, p: 21.0, f: 19.0, c: 0.3, salt: 1.1, veg: 0, fruit: 0, serv: 80 },
  { name: "さばの味噌煮", kana: "さば みそに", kcal: 220, p: 17.0, f: 14.0, c: 7.0, salt: 1.3, veg: 0, fruit: 0, serv: 90 },
  { name: "ぶり大根", kana: "ぶりだいこん", kcal: 110, p: 8.0, f: 5.0, c: 8.0, salt: 1.1, veg: 0.4, fruit: 0, serv: 130 },
  { name: "ぶりの照り焼き", kana: "ぶり てりやき", kcal: 260, p: 19.0, f: 16.0, c: 7.0, salt: 1.3, veg: 0, fruit: 0, serv: 80 },
  { name: "エビフライ", kana: "えびふらい", kcal: 240, p: 16.0, f: 12.0, c: 16.0, salt: 0.9, veg: 0, fruit: 0, serv: 40 },
  { name: "アジフライ", kana: "あじふらい", kcal: 270, p: 16.0, f: 17.0, c: 13.0, salt: 0.8, veg: 0, fruit: 0, serv: 80 },
  { name: "ちくわ", kana: "ちくわ", kcal: 119, p: 12.2, f: 2.0, c: 13.5, salt: 2.1, veg: 0, fruit: 0, serv: 30 },
  { name: "かまぼこ", kana: "かまぼこ", kcal: 93, p: 12.0, f: 0.9, c: 9.7, salt: 2.5, veg: 0, fruit: 0, serv: 25 },
  { name: "餃子", kana: "ぎょうざ", kcal: 200, p: 7.0, f: 10.0, c: 21.0, salt: 1.2, veg: 0.2, fruit: 0, serv: 100 },
  { name: "シュウマイ", kana: "しゅうまい", kcal: 190, p: 9.0, f: 9.0, c: 19.0, salt: 1.3, veg: 0.05, fruit: 0, serv: 75 },

  /* ---- 卵・大豆・乳製品 ---- */
  { name: "卵焼き", kana: "たまごやき だしまき", kcal: 146, p: 10.5, f: 9.0, c: 6.4, salt: 1.2, veg: 0, fruit: 0, serv: 60 },
  { name: "ゆで卵", kana: "ゆでたまご", kcal: 134, p: 12.5, f: 10.4, c: 0.3, salt: 0.3, veg: 0, fruit: 0, serv: 50 },
  { name: "目玉焼き", kana: "めだまやき", kcal: 180, p: 13.0, f: 14.0, c: 0.3, salt: 0.5, veg: 0, fruit: 0, serv: 55 },
  { name: "オムレツ", kana: "おむれつ にんじんおむれつ", kcal: 170, p: 10.0, f: 13.0, c: 2.5, salt: 0.8, veg: 0.1, fruit: 0, serv: 90 },
  { name: "納豆", kana: "なっとう", kcal: 190, p: 16.5, f: 10.0, c: 12.1, salt: 0, veg: 0, fruit: 0, serv: 45 },
  { name: "豆腐", kana: "とうふ", kcal: 56, p: 5.3, f: 3.5, c: 2.0, salt: 0, veg: 0, fruit: 0, serv: 100 },
  { name: "厚揚げ", kana: "あつあげ", kcal: 143, p: 10.7, f: 11.3, c: 0.9, salt: 0, veg: 0, fruit: 0, serv: 60 },
  { name: "枝豆（ゆで）", kana: "えだまめ", kcal: 118, p: 11.5, f: 6.1, c: 8.9, salt: 0.3, veg: 0, fruit: 0, serv: 40 },
  { name: "牛乳", kana: "ぎゅうにゅう みるく", kcal: 61, p: 3.3, f: 3.8, c: 4.8, salt: 0.1, veg: 0, fruit: 0, serv: 200 },
  { name: "ヨーグルト（無糖）", kana: "よーぐると むとう ぷれーん", kcal: 56, p: 3.6, f: 3.0, c: 4.9, salt: 0.1, veg: 0, fruit: 0, serv: 100 },
  { name: "ヨーグルト（加糖）", kana: "よーぐると かとう", kcal: 65, p: 3.5, f: 0.2, c: 11.9, salt: 0.1, veg: 0, fruit: 0, serv: 100 },
  { name: "チーズ", kana: "ちーず", kcal: 313, p: 22.7, f: 24.7, c: 1.3, salt: 2.8, veg: 0, fruit: 0, serv: 18 },

  /* ---- 野菜のおかず ---- */
  { name: "ブロッコリー（ゆで）", kana: "ぶろっこりー", kcal: 30, p: 3.9, f: 0.4, c: 5.2, salt: 0, veg: 1, fruit: 0, serv: 40 },
  { name: "ミニトマト", kana: "みにとまと ぷちとまと とまと", kcal: 30, p: 1.1, f: 0.1, c: 7.2, salt: 0, veg: 1, fruit: 0, serv: 30 },
  { name: "トマト", kana: "とまと", kcal: 20, p: 0.7, f: 0.1, c: 4.7, salt: 0, veg: 1, fruit: 0, serv: 80 },
  { name: "にんじん（ゆで）", kana: "にんじん", kcal: 35, p: 0.8, f: 0.2, c: 8.7, salt: 0, veg: 1, fruit: 0, serv: 30 },
  { name: "ほうれん草のおひたし", kana: "ほうれんそう おひたし", kcal: 25, p: 2.6, f: 0.5, c: 4.0, salt: 0.3, veg: 1, fruit: 0, serv: 50 },
  { name: "小松菜の煮びたし", kana: "こまつな にびたし", kcal: 25, p: 1.8, f: 0.3, c: 3.5, salt: 0.5, veg: 1, fruit: 0, serv: 50 },
  { name: "キャベツ（生）", kana: "きゃべつ せんぎゃべつ", kcal: 23, p: 1.3, f: 0.2, c: 5.2, salt: 0, veg: 1, fruit: 0, serv: 40 },
  { name: "きゅうり", kana: "きゅうり", kcal: 14, p: 1.0, f: 0.1, c: 3.0, salt: 0, veg: 1, fruit: 0, serv: 40 },
  { name: "レタス", kana: "れたす", kcal: 12, p: 0.6, f: 0.1, c: 2.8, salt: 0, veg: 1, fruit: 0, serv: 20 },
  { name: "かぼちゃの煮物", kana: "かぼちゃ にもの", kcal: 80, p: 1.6, f: 0.1, c: 18.0, salt: 0.5, veg: 1, fruit: 0, serv: 60 },
  { name: "きんぴらごぼう", kana: "きんぴら ごぼう", kcal: 120, p: 1.5, f: 5.0, c: 17.0, salt: 1.0, veg: 0.85, fruit: 0, serv: 50 },
  { name: "ひじきの煮物", kana: "ひじき にもの", kcal: 85, p: 2.5, f: 4.0, c: 10.0, salt: 1.2, veg: 0.3, fruit: 0, serv: 50 },
  { name: "切り干し大根の煮物", kana: "きりぼしだいこん", kcal: 90, p: 2.5, f: 3.0, c: 13.5, salt: 1.0, veg: 0.7, fruit: 0, serv: 50 },
  { name: "筑前煮", kana: "ちくぜんに にしめ", kcal: 85, p: 5.0, f: 3.0, c: 9.0, salt: 0.9, veg: 0.5, fruit: 0, serv: 100 },
  { name: "肉じゃが", kana: "にくじゃが", kcal: 100, p: 4.0, f: 3.0, c: 13.0, salt: 0.8, veg: 0.25, fruit: 0, serv: 150 },
  { name: "野菜炒め", kana: "やさいいため", kcal: 75, p: 2.5, f: 5.0, c: 5.5, salt: 0.8, veg: 0.8, fruit: 0, serv: 130 },
  { name: "ピーマンの炒め物", kana: "ぴーまん いため", kcal: 50, p: 1.0, f: 3.5, c: 4.5, salt: 0.5, veg: 0.95, fruit: 0, serv: 40 },
  { name: "とうもろこし（ゆで）", kana: "とうもろこし こーん", kcal: 95, p: 3.5, f: 1.7, c: 18.6, salt: 0, veg: 1, fruit: 0, serv: 90 },
  { name: "ポテトサラダ", kana: "ぽてとさらだ", kcal: 120, p: 1.7, f: 7.0, c: 13.0, salt: 0.9, veg: 0.2, fruit: 0, serv: 60 },
  { name: "マカロニサラダ", kana: "まかろにさらだ", kcal: 180, p: 3.5, f: 11.0, c: 16.0, salt: 0.9, veg: 0.1, fruit: 0, serv: 60 },
  { name: "コールスロー", kana: "こーるすろー", kcal: 90, p: 1.2, f: 6.5, c: 7.0, salt: 0.7, veg: 0.85, fruit: 0, serv: 60 },
  { name: "グリーンサラダ", kana: "さらだ ぐりーんさらだ", kcal: 18, p: 0.9, f: 0.1, c: 3.5, salt: 0, veg: 1, fruit: 0, serv: 70 },
  { name: "アスパラガス（ゆで）", kana: "あすぱらがす", kcal: 25, p: 2.6, f: 0.1, c: 4.6, salt: 0, veg: 1, fruit: 0, serv: 30 },
  { name: "さつまいも（ふかし）", kana: "さつまいも", kcal: 131, p: 0.9, f: 0.2, c: 31.9, salt: 0, veg: 0, fruit: 0, serv: 60 },

  /* ---- 汁もの ---- */
  { name: "味噌汁", kana: "みそしる おみそしる", kcal: 25, p: 1.8, f: 0.8, c: 2.8, salt: 1.2, veg: 0.15, fruit: 0, serv: 180 },
  { name: "豚汁", kana: "とんじる ぶたじる", kcal: 50, p: 2.8, f: 2.5, c: 4.0, salt: 1.0, veg: 0.25, fruit: 0, serv: 200 },
  { name: "コーンスープ", kana: "こーんすーぷ", kcal: 60, p: 1.5, f: 2.5, c: 8.0, salt: 0.7, veg: 0.1, fruit: 0, serv: 180 },

  /* ---- 果物 ---- */
  { name: "りんご", kana: "りんご", kcal: 56, p: 0.2, f: 0.3, c: 15.5, salt: 0, veg: 0, fruit: 1, serv: 80 },
  { name: "バナナ", kana: "ばなな", kcal: 93, p: 1.1, f: 0.2, c: 22.5, salt: 0, veg: 0, fruit: 1, serv: 90 },
  { name: "いちご", kana: "いちご", kcal: 31, p: 0.9, f: 0.1, c: 8.5, salt: 0, veg: 0, fruit: 1, serv: 75 },
  { name: "みかん", kana: "みかん", kcal: 49, p: 0.7, f: 0.1, c: 12.0, salt: 0, veg: 0, fruit: 1, serv: 80 },
  { name: "オレンジ", kana: "おれんじ", kcal: 48, p: 1.0, f: 0.1, c: 11.8, salt: 0, veg: 0, fruit: 1, serv: 100 },
  { name: "ぶどう", kana: "ぶどう", kcal: 58, p: 0.4, f: 0.1, c: 15.7, salt: 0, veg: 0, fruit: 1, serv: 75 },
  { name: "キウイ", kana: "きうい きういふるーつ", kcal: 51, p: 1.0, f: 0.2, c: 13.4, salt: 0, veg: 0, fruit: 1, serv: 85 },
  { name: "パイナップル", kana: "ぱいなっぷる", kcal: 54, p: 0.6, f: 0.1, c: 13.7, salt: 0, veg: 0, fruit: 1, serv: 80 },
  { name: "メロン", kana: "めろん", kcal: 40, p: 1.1, f: 0.1, c: 10.3, salt: 0, veg: 0, fruit: 1, serv: 100 },
  { name: "すいか", kana: "すいか", kcal: 41, p: 0.6, f: 0.1, c: 9.5, salt: 0, veg: 0, fruit: 1, serv: 150 },
  { name: "柿", kana: "かき", kcal: 63, p: 0.4, f: 0.2, c: 15.9, salt: 0, veg: 0, fruit: 1, serv: 90 },
  { name: "梨", kana: "なし", kcal: 38, p: 0.3, f: 0.1, c: 11.3, salt: 0, veg: 0, fruit: 1, serv: 100 },
  { name: "もも", kana: "もも", kcal: 38, p: 0.6, f: 0.1, c: 10.2, salt: 0, veg: 0, fruit: 1, serv: 100 },
  { name: "さくらんぼ", kana: "さくらんぼ", kcal: 64, p: 1.0, f: 0.2, c: 15.2, salt: 0, veg: 0, fruit: 1, serv: 50 },

  /* ---- おやつ・飲みもの ---- */
  { name: "プリン", kana: "ぷりん", kcal: 126, p: 5.7, f: 5.5, c: 14.0, salt: 0.2, veg: 0, fruit: 0, serv: 90 },
  { name: "ゼリー", kana: "ぜりー", kcal: 70, p: 0.5, f: 0, c: 17.0, salt: 0, veg: 0, fruit: 0.2, serv: 100 },
  { name: "アイスクリーム", kana: "あいすくりーむ あいす", kcal: 180, p: 3.9, f: 8.0, c: 23.2, salt: 0.2, veg: 0, fruit: 0, serv: 100 },
  { name: "クッキー", kana: "くっきー びすけっと", kcal: 510, p: 5.7, f: 27.6, c: 62.6, salt: 0.6, veg: 0, fruit: 0, serv: 20 },
  { name: "チョコレート", kana: "ちょこれーと ちょこ", kcal: 550, p: 6.9, f: 34.1, c: 55.8, salt: 0.2, veg: 0, fruit: 0, serv: 15 },
  { name: "ポテトチップス", kana: "ぽてとちっぷす ぽてち", kcal: 540, p: 4.7, f: 35.2, c: 54.7, salt: 1.0, veg: 0, fruit: 0, serv: 30 },
  { name: "せんべい", kana: "せんべい", kcal: 370, p: 7.8, f: 1.0, c: 83.9, salt: 1.7, veg: 0, fruit: 0, serv: 20 },
  { name: "シュークリーム", kana: "しゅーくりーむ", kcal: 210, p: 6.0, f: 11.4, c: 22.3, salt: 0.2, veg: 0, fruit: 0, serv: 70 },
  { name: "ショートケーキ", kana: "けーき しょーとけーき", kcal: 315, p: 4.6, f: 15.2, c: 42.7, salt: 0.2, veg: 0, fruit: 0.05, serv: 110 },
  { name: "オレンジジュース", kana: "おれんじじゅーす じゅーす", kcal: 45, p: 0.8, f: 0, c: 11.0, salt: 0, veg: 0, fruit: 0, serv: 200 },
  { name: "コーラ", kana: "こーら", kcal: 46, p: 0, f: 0, c: 11.4, salt: 0, veg: 0, fruit: 0, serv: 350 },
  { name: "スポーツドリンク", kana: "すぽーつどりんく", kcal: 21, p: 0, f: 0, c: 5.1, salt: 0.1, veg: 0, fruit: 0, serv: 350 },
  { name: "カフェオレ（加糖）", kana: "かふぇおれ こーひー", kcal: 50, p: 1.8, f: 1.8, c: 6.5, salt: 0.1, veg: 0, fruit: 0, serv: 200 },
  { name: "緑茶・麦茶・水", kana: "おちゃ りょくちゃ むぎちゃ みず", kcal: 0, p: 0, f: 0, c: 0, salt: 0, veg: 0, fruit: 0, serv: 200 },

];
