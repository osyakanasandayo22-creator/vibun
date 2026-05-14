import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DETAIL } from "./points-detail.mjs";
import { JP_PARTIAL } from "./jp-partial.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {{ unit: string; wordNo: number; word: string; meaning: string; detail: string; sentence: string; jp: string; jpPartial: string }[]} */
const rows = [];

function add(unit, wordNo, word, meaning, sentence, jp) {
  const detail = DETAIL[wordNo] ?? "";
  const jpPartial = JP_PARTIAL[wordNo] ?? "";
  rows.push({ unit, wordNo, word, meaning, detail, sentence, jp, jpPartial });
}

// ----- Option 14 形容詞・副詞 -----
const U14 = "14 形容詞・副詞";
add(U14, 1, "red", "Point A-1〜3: 形容詞の限定用法（名詞を前後から修飾）", "I bought a (   ) sweater.", "私は赤いセーターを買った。");
add(U14, 2, "full", "Point A-1〜3: 限定用法（後ろから修飾）", "We got on a train (   ) of people.", "私たちは人でいっぱいの列車に乗った。");
add(U14, 3, "new", "Point A-1〜3: 限定用法", "I want to try something (   ).", "私は何か新しいことをやってみたい。");
add(U14, 4, "hungry", "Point A-4: 叙述用法［SVC］補語としての形容詞", "I'm (   ).", "私はお腹がすいている。");
add(U14, 5, "open", "Point A-5: 叙述用法［SVOC］O=Cの関係", "He left the door (   ).", "彼はドアを開けたままにしておいた。");
add(U14, 6, "elder", "Point A-6: 限定用法しかない形容詞（elder など）", "My (   ) sister is a college student.", "私の姉は大学生だ。");
add(U14, 7, "alive", "Point A-7: 叙述用法しかない形容詞（alive など）", "My grandmother is still (   ) and well.", "私の祖母はまだ存命で、元気です。");
add(U14, 8, "present", "Point A-8: 限定用法「現在の～」", "What do you think of the (   ) situation?", "現在の状況についてあなたはどう思いますか。");
add(U14, 9, "present", "Point A-9: 叙述用法「出席した」", "He was not (   ) at the meeting.", "彼はその会合に出席していなかった。");
add(U14, 10, "convenient", "Point A-10: 人が主語にならない形容詞（convenient など）", "My house is (   ) for commuting.", "私の家は通勤に便利だ。");
add(U14, 11, "quickly", "Point B-11: 様態を表す副詞", "I ate my breakfast (   ).", "私は急いで朝食をとった。");
add(U14, 12, "here", "Point B-12: 場所を表す副詞", "We arrived (   ) this morning.", "私たちは今朝ここに着きました。");
add(U14, 13, "tomorrow", "Point B-12・13: 時を表す副詞", "I'm going to see a doctor (   ).", "明日、医者に診てもらう予定です。");
add(U14, 14, "always", "Point B-14: 頻度を表す副詞", "My mother is (   ) busy.", "母はいつも忙しい。");
add(U14, 15, "almost", "Point B-15: 程度を表す副詞", "I fell asleep (   ) immediately.", "私はほとんど一瞬で眠りに落ちた。");
add(U14, 16, "probably", "Point B-16: 文全体を修飾する副詞（確信度）", "It will (   ) rain tomorrow.", "明日はたぶん雨が降るだろう。");

// ----- Option 4 比較③ -----
const U4 = "4 比較③";
add(U4, 17, "soon", "Point A: as ＋原級＋ as possible（できるだけ～）", "Please let me know as (   ) as possible.", "できるだけすぐに私に知らせてください。");
add(U4, 18, "ever", "Point A: as ＋原級＋ as ever（相変わらず～）", "The band is as popular as (   ).", "そのバンドは相変わらず人気がある。");
add(U4, 19, "as", "Point A: as many [much] as ＋数詞＋名詞", "(   ) many as five thousand people took part in the campaign.", "5千人もの人たちがそのキャンペーンに参加した。");
add(U4, 20, "harder", "Point B: (all) the ＋比較級 (for ～)", "I need to study all the (   ) for the next exam.", "次の試験があるのでいっそう勉強する必要がある。");
add(U4, 21, "less", "Point B: none the less (for ～)", "I like Mike none the (   ) for his faults.", "マイクには欠点があるが、それでも私は彼が好きだ。");
add(U4, 22, "much", "Point B: much less ～（まして～ない）", "I can't afford to buy a used car, (   ) less a new one.", "私は中古車を買う余裕はないし、まして新車は買えない。");
add(U4, 23, "most", "Point C: at (the) most", "There were at the (   ) 50 people in the concert hall.", "コンサートホールには多くても50人しかいなかった。");
add(U4, 24, "best", "Point C: at best", "The game will end in a draw at (   ).", "その試合はせいぜい引き分けだろう。");
add(U4, 25, "best", "Point C: at one's best", "It was a tough match, and I wasn't at my (   ).", "それは厳しい試合だったし、私は最高の状態というわけではなかった。");
add(U4, 26, "most", "Point C: make the most of ～", "We must make the (   ) of this chance.", "私たちはこの機会を最大限に利用しなければならない。");
add(U4, 27, "not", "Point D: not more than ～（多くても～ ≦）", "Tom has (   ) more than 10 dollars.", "トムは多くても10ドルしか持っていない。");
add(U4, 28, "not", "Point D: not less than ～（少なくとも～ ≧）", "Tom has (   ) less than 10 dollars.", "トムは少なくとも10ドルは持っている。");
add(U4, 29, "no", "Point D: no more than ～（～だけ／少ない気持ち）", "Tom has (   ) more than 10 dollars.", "トムはたった10ドルしか持っていない。");
add(U4, 30, "no", "Point D: no less than ～（～も／多い気持ち）", "Tom has (   ) less than 10 dollars.", "トムは10ドルも持っている。");

// ----- Option 7 -----
const U7 = "7 同格・無生物主語・名詞構文";
add(U7, 31, "that", "Point A: 同格の that（fact, news, idea など）", "He faced the fact (   ) he would have to try again.", "もう一度挑戦しなければならないという事実に彼は直面した。");
add(U7, 32, "makes", "Point B: S make O do → 日本語では副詞的に", "This picture (   ) me laugh.", "この写真を見ると私は笑ってしまう。");
add(U7, 33, "reminds", "Point B: S remind O of ～", "This song (   ) me of my childhood.", "この歌を聞くと私は自分の子ども時代を思い出す。");
add(U7, 34, "allows", "Point B: S allow O to do", "The internet (   ) us to connect with people all over the world.", "インターネットのおかげで世界中の人々とつながることができる。");
add(U7, 35, "enables", "Point B: S enable O to do", "This software (   ) you to create websites easily.", "このソフトのおかげで簡単にウェブサイトを作成することができる。");
add(U7, 36, "prevented", "Point B: S prevent O from doing", "The rain (   ) us from going to the beach.", "雨のために私たちはビーチに行けなかった。");
add(U7, 37, "takes", "Point B: S take O to ～", "The school bus (   ) children to school.", "スクールバスに乗って子どもたちは学校へ行く。");
add(U7, 38, "tells", "Point B: S tell O ～", "The map (   ) you how to get to the station.", "地図を見れば駅への行き方がわかる。");
add(U7, 39, "rest", "Point C: take [have] a/an ＋名詞", "\"Why don't you take a (   )?\" \"All right.\"", "「ひと休みしたらどうですか。」「わかりました。」");
add(U7, 40, "singer", "Point C: a/an ＋形容詞＋～する人", "She is a good (   ).", "彼女は歌が上手だ。");
add(U7, 41, "of", "Point C: 〈所有格＋名詞〉意味上の主語・目的語", "I was shocked at the news (   ) his death.", "彼の死の知らせに私は衝撃を受けた。");

// ----- Option 9-1 -----
const U91 = "9-1 前置詞①";
add(U91, 42, "at", "Point A: at［場所の一点］", "We were waiting (   ) the bus stop.", "私たちはバス停で待っていた。");
add(U91, 43, "at", "Point A: at［時の一点］", "I'll see you (   ) three.", "3時にお会いしましょう。");
add(U91, 44, "in", "Point A: in［空間の中］", "There was no one (   ) the room.", "部屋には誰もいなかった。");
add(U91, 45, "in", "Point A: in［幅のある時間］", "I first met him (   ) 2015.", "2015年に初めて彼に会った。");
add(U91, 46, "in", "Point A: in［所要時間・後に］", "I'll be back (   ) ten minutes.", "10分後に戻ってきます。");
add(U91, 47, "on", "Point A: on［接触］", "He put the book (   ) the table.", "彼は本をテーブルに置いた。");
add(U91, 48, "on", "Point A: on［曜日など］", "I'll see you (   ) Monday.", "月曜日にお会いしましょう。");
add(U91, 49, "from", "Point B: from［起点］", "It takes about two hours (   ) Tokyo to Kyoto.", "東京から京都まで約2時間かかります。");
add(U91, 50, "from", "Point B: from〜to〜", "I'm at school (   ) 8:30 a.m. to 5:00 p.m.", "私は午前8時30分から午後5時まで学校にいます。");
add(U91, 51, "for", "Point B: for［方向］", "He left (   ) London yesterday.", "彼は昨日ロンドンへたちました。");
add(U91, 52, "for", "Point B: for［期間］", "I studied (   ) two hours last night.", "私は昨夜、2時間勉強した。");
add(U91, 53, "into", "Point C: into", "A frog jumped (   ) the box.", "カエルが箱の中へ飛び込んだ。");
add(U91, 54, "out of", "Point C: out of", "A frog jumped (   ) the box.", "カエルが箱の中から飛び出した。");
add(U91, 55, "along", "Point C: along", "They walked (   ) the street toward the park.", "彼らは通りに沿って歩いた。");
add(U91, 56, "across", "Point C: across", "They walked (   ) the street to the other side.", "彼らは通りを歩いて横切った。");
add(U91, 57, "through", "Point C: through", "The train went (   ) the tunnel.", "列車はトンネルを通り抜けた。");
add(U91, 58, "over", "Point D: over", "The cat jumped (   ) the table.", "その猫がテーブルを跳び越えた。");
add(U91, 59, "under", "Point D: under", "The boy was hiding (   ) the table.", "その少年はテーブルの下に隠れていた。");
add(U91, 60, "above", "Point D: above", "The sun rose (   ) the horizon.", "太陽が地平線の上に昇った。");
add(U91, 61, "below", "Point D: below", "This place is (   ) sea level.", "この場所は海面より低い。");

// ----- Option 9-2 -----
const U92 = "9-2 前置詞②";
add(U92, 62, "in front of", "Point A: in front of", "She was waiting (   ) the station.", "彼女は駅の前で待っていた。");
add(U92, 63, "behind", "Point A: behind", "There is a small park (   ) the station.", "駅の裏に小さな公園がある。");
add(U92, 64, "near", "Point A: near", "I went to the supermarket (   ) my house.", "私は家の近くのスーパーに行った。");
add(U92, 65, "around", "Point A: around", "The earth goes (   ) the sun.", "地球は太陽の周りを回る。");
add(U92, 66, "between", "Point A: between（2つの間）", "There is a small house (   ) the trees.", "（2本の）木の間に小さな家がある。");
add(U92, 67, "among", "Point A: among（3つ以上の間）", "There is a small house (   ) the trees.", "（3本以上の）木々の間に小さな家がある。");
add(U92, 68, "before", "Point B: before", "I finished my homework (   ) dinner.", "私は夕食前に宿題を終えた。");
add(U92, 69, "after", "Point B: after", "I'll do my homework (   ) dinner.", "私は夕食後に宿題をするつもりだ。");
add(U92, 70, "since", "Point B: since", "It has been raining (   ) this morning.", "今朝からずっと雨が降り続いている。");
add(U92, 71, "until", "Point B: until [till]", "The store is open (   ) 10 p.m.", "その店は夜10時まで開いている。");
add(U92, 72, "during", "Point B: during", "We visited Korea (   ) the summer vacation.", "私たちは夏休みの間に韓国を訪れた。");
add(U92, 73, "by", "Point C: by［そばに］", "Come and sit (   ) me.", "こっちへ来て私のそばに座りなさい。");
add(U92, 74, "by", "Point C: by［期限までに］", "I have to be home (   ) nine.", "私は9時までに家に帰らなければならない。");
add(U92, 75, "with", "Point C: with［同伴］", "I went camping (   ) my friends last weekend.", "先週末、友人たちとキャンプに行った。");
add(U92, 76, "of", "Point C: of［所属］", "He is a member (   ) the soccer team.", "彼はサッカーチームの一員です。");
add(U92, 77, "because of", "Point D: because of ～", "The game was postponed (   ) the rain.", "雨のためにその試合は延期された。");
add(U92, 78, "instead of", "Point D: instead of ～", "Can I go to the party (   ) my sister?", "姉の代わりに私がパーティーに行ってもいいですか。");
add(U92, 79, "in spite of", "Point D: in spite of ～", "(   ) the rain, they went to the beach.", "雨にもかかわらず、彼らは海辺へ行った。");
add(U92, 80, "according to", "Point D: according to ～", "(   ) the weather forecast, it will be fine tomorrow.", "天気予報によると、明日は晴れるだろう。");

// ----- Option 10 -----
const U10 = "10 群動詞";
add(U10, 81, "out", "Point A: break out", "The Second World War broke (   ) in 1939.", "第二次世界大戦は1939年に起こった。");
add(U10, 82, "away", "Point A: pass away", "Steve Jobs passed (   ) on October 5, 2011.", "スティーブ・ジョブズは2011年10月5日に亡くなった。");
add(U10, 83, "up", "Point A: show [turn] up", "The leading actor showed (   ) at the press conference.", "主演俳優が記者会見に現れた。");
add(U10, 84, "up", "Point B: bring up", "She brought (   ) three children.", "彼女は3人の子どもを育て上げた。");
add(U10, 85, "off", "Point B: call off", "My family called (   ) the trip.", "私の家族は旅行を中止した。");
add(U10, 86, "for", "Point B: call for", "They called (   ) the release of the hostages.", "彼らは人質の解放を求めた。");
add(U10, 87, "across", "Point B: come across", "I came (   ) Tom on the train.", "私は列車でトムと偶然出会った。");
add(U10, 88, "into", "Point B: look into", "He is looking (   ) the murder case.", "彼はその殺人事件を調査している。");
add(U10, 89, "up with", "Point B: catch up with", "I caught (   ) him at last.", "私はようやく彼に追いついた。");
add(U10, 90, "with", "Point B: get along with", "John will get along (   ) her.", "ジョンは彼女と仲良くやっていくでしょう。");
add(U10, 91, "for", "Point B: make up for", "He tried to make up (   ) the loss.", "彼は損失の埋め合わせをしようとした。");
add(U10, 92, "fault", "Point B: find fault with", "He finds (   ) with everything.", "彼は何でもあら探しをする。");
add(U10, 93, "use of", "Point B: make use of", "She made (   ) her experience.", "彼女は自分の経験を生かした。");

// ----- Option 12 -----
const U12 = "12 名詞・冠詞";
add(U12, 94, "five", "Point A: 数えられる名詞 C", "There were (   ) cats in the box.", "箱の中に猫が5匹いた。");
add(U12, 95, "families", "Point A: 数えられる集合名詞 C", "A lot of (   ) visit the zoo on weekends.", "多くの家族が週末に動物園を訪れる。");
add(U12, 96, "police", "Point A: 数えられない集合名詞 U", "The (   ) are looking for the man.", "警察はその男を捜している。");
add(U12, 97, "meat", "Point A: 物質名詞 U", "This (   ) is very tender.", "この肉はとても柔らかい。");
add(U12, 98, "Honesty", "Point A: 抽象名詞 U", "(   ) is the best policy.", "正直は最善の策。（ことわざ）");
add(U12, 99, "piece", "Point A: a piece of などで数える", "He gave me a (   ) of advice.", "彼は私に助言を1つしてくれた。");
add(U12, 100, "watch", "Point B-7: 初出の名詞に a/an", "I bought a new (   ) today.", "今日は新しい腕時計を買った。");
add(U12, 101, "week", "Point B-8: one と同じ意味の a/an", "I stayed in Hokkaido for a (   ).", "私は北海道に1週間、滞在した。");
add(U12, 102, "hour", "Point B-9: 単位ごとの a/an", "She runs for an (   ) three days a week.", "彼女は週に3日、1時間走っている。");
add(U12, 103, "a", "Point B-10: 初出 a → 再出 the", "If you pet (   ) dog, the dog will like you.", "犬を優しくなでれば、その犬はあなたを気に入るでしょう。");
add(U12, 104, "the", "Point B-11: 状況から特定される the", "\"Open (   ) door, please.\" \"OK.\"", "「ドアを開けてください。」「いいですよ。」");
add(U12, 105, "the", "Point B-12: 唯一のものに the", "(   ) sun is strong today.", "今日は日差しが強い。");
add(U12, 106, "coffee", "Point C-13: 不可算名詞に a/an は付かない", "Do you like (   )?", "コーヒーは好きですか。");
add(U12, 107, "school", "Point C-14: 機能としての学校は無冠詞", "I have to go to (   ) tomorrow.", "明日、学校へ行かなければなりません。");
add(U12, 108, "car", "Point C-15: 手段としての交通は無冠詞", "We went there by (   ).", "私たちはそこへ車で行きました。");

const units = {};
for (const r of rows) {
  if (!units[r.unit]) units[r.unit] = [];
  units[r.unit].push({
    wordNo: r.wordNo,
    word: r.word,
    meaning: r.meaning,
    detail: r.detail,
    sentence: r.sentence,
    jp: r.jp,
    jpPartial: r.jpPartial
  });
}

const unitsStr = `const units = ${JSON.stringify(units, null, 2)};\n`;

const tailPath = path.join(__dirname, "_tail.js");
const tail = fs.readFileSync(tailPath, "utf8");
const outPath = path.join(__dirname, "script.js");
fs.writeFileSync(outPath, unitsStr + "\n" + tail, "utf8");

console.log("Wrote", outPath, "units keys:", Object.keys(units).length, "rows:", rows.length);
