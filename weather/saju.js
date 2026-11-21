/* Korean fortune (운세): Saju four pillars, 띠 zodiac, today's fortune, a Tojeong-style year outlook, gunghap and dream meanings.
   All worked out on the device from a birthday that never leaves it. Original wording, for fun. */
(function(){
const STEMS = [
  ['갑','甲','wood',1],['을','乙','wood',0],['병','丙','fire',1],['정','丁','fire',0],['무','戊','earth',1],
  ['기','己','earth',0],['경','庚','metal',1],['신','辛','metal',0],['임','壬','water',1],['계','癸','water',0]];
const BRANCHES = [
  ['자','子','water','Rat','쥐','🐭'],['축','丑','earth','Ox','소','🐮'],['인','寅','wood','Tiger','호랑이','🐯'],['묘','卯','wood','Rabbit','토끼','🐰'],
  ['진','辰','earth','Dragon','용','🐲'],['사','巳','fire','Snake','뱀','🐍'],['오','午','fire','Horse','말','🐴'],['미','未','earth','Sheep','양','🐑'],
  ['신','申','metal','Monkey','원숭이','🐵'],['유','酉','metal','Rooster','닭','🐔'],['술','戌','earth','Dog','개','🐶'],['해','亥','water','Pig','돼지','🐷']];
const EL = {
  wood:  { ko:'목', han:'木', name:'Wood',  emoji:'🌳', color:'#3FAE6A', lucky:'green',  nums:[3,8], dir:'East',   season:'spring' },
  fire:  { ko:'화', han:'火', name:'Fire',  emoji:'🔥', color:'#F0643C', lucky:'red',    nums:[2,7], dir:'South',  season:'summer' },
  earth: { ko:'토', han:'土', name:'Earth', emoji:'⛰️', color:'#D8A93A', lucky:'yellow', nums:[5,10], dir:'Centre', season:'late summer' },
  metal: { ko:'금', han:'金', name:'Metal', emoji:'⚔️', color:'#8E9BAE', lucky:'white',  nums:[4,9], dir:'West',   season:'autumn' },
  water: { ko:'수', han:'水', name:'Water', emoji:'💧', color:'#3A8BE0', lucky:'navy',   nums:[1,6], dir:'North',  season:'winter' }};
const ORDER = ['wood','fire','earth','metal','water'];
const gen = e => ORDER[(ORDER.indexOf(e) + 1) % 5];          // e feeds this one
const ctl = e => ORDER[(ORDER.indexOf(e) + 2) % 5];          // e controls this one
function relation(me, other){                                // how `other` meets you
  if (me === other) return 'same';
  if (gen(me) === other) return 'output';                    // you give energy to it: expression, creativity
  if (ctl(me) === other) return 'wealth';                    // you control it: money, gains
  if (gen(other) === me) return 'support';                   // it feeds you: help, learning
  return 'power';                                            // it controls you: duty, pressure, career
}

/* ---------- calendar maths ---------- */
const jdn = (y, m, d) => { const a = Math.floor((14 - m) / 12), Y = y + 4800 - a, M = m + 12 * a - 3;
  return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045; };
const pillar = i => ({ s: ((i % 10) + 10) % 10, b: ((i % 12) + 12) % 12 });
const dayPillar = (y, m, d) => pillar((jdn(y, m, d) + 49) % 60);
// solar-term month starts (절기), close enough to the day for a birth chart: 입춘 starts the saju year
const TERM = [[2,4],[3,6],[4,5],[5,6],[6,6],[7,7],[8,8],[9,8],[10,8],[11,7],[12,7],[1,6]];   // 寅 month … 丑 month
function sajuMonthIndex(m, d){ // 0 = 寅 month
  for (let i = 11; i >= 0; i--){ const [tm, td] = TERM[i]; if (i === 11){ if (m === 1 && d >= td) return 11; continue; }
    if (m > tm || (m === tm && d >= td)) return i; }
  return 10;  // early January: still the 子 month
}
function chart(b){ // b = {y, m, d, h|null}
  const beforeIpchun = b.m < 2 || (b.m === 2 && b.d < 4);
  const sy = beforeIpchun ? b.y - 1 : b.y;
  const year = pillar(sy - 4);
  const mi = sajuMonthIndex(b.m, b.d);
  const month = { s: ((year.s % 5) * 2 + 2 + mi) % 10, b: (2 + mi) % 12 };
  const day = dayPillar(b.y, b.m, b.d);
  let hour = null;
  if (b.h !== null && b.h !== undefined && b.h !== ''){ const hb = Math.floor(((+b.h) + 1) / 2) % 12; hour = { s: ((day.s % 5) * 2 + hb) % 10, b: hb }; }
  const pillars = [hour, day, month, year];
  const count = { wood:0, fire:0, earth:0, metal:0, water:0 };
  for (const p of pillars) if (p){ count[STEMS[p.s][2]]++; count[BRANCHES[p.b][2]]++; }
  return { year, month, day, hour, pillars, count, dm: STEMS[day.s][2], dmStem: day.s };
}

// 띠 follows Seollal (lunar new year): second new moon after the winter solstice, Korean time
let SUN = typeof SunCalc !== 'undefined' ? SunCalc : null;
function seollal(y){
  const known = { 1990:'01-27',1991:'02-15',1992:'02-04',1993:'01-23',1994:'02-10',1995:'01-31',1996:'02-19',1997:'02-08',1998:'01-28',1999:'02-16',
    2000:'02-05',2001:'01-24',2002:'02-12',2003:'02-01',2004:'01-22',2005:'02-09',2006:'01-29',2007:'02-18',2008:'02-07',2009:'01-26',2010:'02-14',
    2011:'02-03',2012:'01-23',2013:'02-10',2014:'01-31',2015:'02-19',2016:'02-08',2017:'01-28',2018:'02-16',2019:'02-05',2020:'01-25',2021:'02-12',
    2022:'02-01',2023:'01-22',2024:'02-10',2025:'01-29',2026:'02-17',2027:'02-07',2028:'01-27',2029:'02-13',2030:'02-03' };
  if (known[y]) { const [m, d] = known[y].split('-').map(Number); return [m, d]; }
  if (!SUN) return [2, 4];
  let t = Date.UTC(y - 1, 11, 22, 15), prev = SUN.getMoonIllumination(new Date(t)).phase, n = 0;
  for (let i = 1; i < 90; i++){ const T = t + i * 864e5, ph = SUN.getMoonIllumination(new Date(T)).phase;
    if (prev > .9 && ph < .1){ n++; if (n === 2){ const k = new Date(T + 9 * 3600e3); return [k.getUTCMonth() + 1, k.getUTCDate()]; } } prev = ph; }
  return [2, 4];
}
function tti(b){ const [sm, sd] = seollal(b.y); const y = (b.m < sm || (b.m === sm && b.d < sd)) ? b.y - 1 : b.y; return pillar(y - 4).b; }

/* ---------- relations between animals ---------- */
const TRINES = [[8,0,4],[5,9,1],[2,6,10],[11,3,7]];                   // 삼합
const SIX = { 0:1,1:0, 2:11,11:2, 3:10,10:3, 4:9,9:4, 5:8,8:5, 6:7,7:6 }; // 육합
const WONJIN = { 0:7,7:0, 1:6,6:1, 2:9,9:2, 3:8,8:3, 4:11,11:4, 5:10,10:5 }; // 원진
function bond(a, b){
  if (a === b) return 'same';
  if (TRINES.some(t => t.includes(a) && t.includes(b))) return 'trine';
  if (SIX[a] === b) return 'six';
  if ((a + 6) % 12 === b) return 'clash';
  if (WONJIN[a] === b) return 'wonjin';
  return 'neutral';
}
function samjae(ttiB, yearB){ // 삼재: the three restless years for your animal's group
  const g = TRINES.find(t => t.includes(ttiB)); if (!g) return 0;
  const start = (g.includes(0) ? 2 : g.includes(9) ? 11 : g.includes(6) ? 8 : 5);   // 申子辰→寅卯辰, 巳酉丑→亥子丑, 寅午戌→申酉戌, 亥卯未→巳午未
  const k = (yearB - start + 12) % 12; return k < 3 ? k + 1 : 0;
}

/* ---------- seeded picks ---------- */
function rng(str){ let h = 1779033703 ^ str.length; for (let i = 0; i < str.length; i++){ h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
  return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];

/* ---------- words ---------- */
const DM = {
  wood:  ['Like a tall tree, you grow steadily towards the light. You are principled, kind and quietly ambitious, and people lean on you.',
          'Like a climbing vine, you are flexible and resourceful. You find a way around obstacles and charm people without trying.'],
  fire:  ['Like the sun, you are warm, open and generous. You light up a room and love to bring people together.',
          'Like candlelight, you are thoughtful and perceptive. You notice what others miss and glow brightest one-on-one.'],
  earth: ['Like a mountain, you are steady and dependable. People trust you, and you rarely rush a decision.',
          'Like a fertile field, you nurture people and projects. You are practical, patient and good with money.'],
  metal: ['Like a sword, you are decisive and fair. You say what you mean and finish what you start.',
          'Like fine jewellery, you have taste and high standards. You are sharp, precise and quietly proud.'],
  water: ['Like the ocean, you are deep and adaptable. You read situations quickly and never stay stuck for long.',
          'Like rain, you are gentle and intuitive. You soften hard edges and see what people really need.']};
const TTI = {
  Rat:'Quick-witted and resourceful — you spot opportunities early.', Ox:'Patient and hardworking — slow and steady wins your race.',
  Tiger:'Brave and magnetic — you lead from the front.', Rabbit:'Gentle and diplomatic — you keep the peace and have great taste.',
  Dragon:'Big-hearted and bold — luck tends to follow your confidence.', Snake:'Wise and calm — you think three moves ahead.',
  Horse:'Free-spirited and energetic — you thrive on movement and new places.', Sheep:'Creative and caring — you make everywhere feel like home.',
  Monkey:'Clever and playful — you solve problems others give up on.', Rooster:'Sharp and hardworking — you notice every detail.',
  Dog:'Loyal and honest — the friend everyone wants.', Pig:'Generous and easy-going — you attract abundance and good company.'};
const TODAY = {
  same:    { stars:3, line:['A steady day with good company — friends and teammates are on your side.','Stand your ground today: your own way works best.','A day for teamwork; share the load and you will move faster.'],
             love:'Easy, comfortable connection — plan something simple together.', money:'Hold steady; avoid splitting costs you have not agreed on.', work:'Collaborate rather than compete.', health:'Good energy — a walk with a friend will lift you.' },
  output:  { stars:4, line:['Your ideas flow today — say them out loud.','A creative, expressive day; make something.','Words come easily — a good day to pitch, post or perform.'],
             love:'Show affection openly; small gestures land well.', money:'Spending on hobbies feels good — set a limit first.', work:'Present your ideas; people are listening.', health:'Burn off extra energy with movement.' },
  wealth:  { stars:5, line:['Money luck is up — a good day for deals and decisions.','Opportunities appear; act on the practical one.','You have the upper hand today — use it kindly.'],
             love:'Attraction is strong; make the first move.', money:'A lucky day for buying, selling or negotiating.', work:'Results come quickly from focused effort.', health:'Do not skip meals in the rush.' },
  power:   { stars:2, line:['A day of duty and responsibility — steady wins.','Pressure may come from above; stay calm and organised.','Follow the rules today and you will earn respect.'],
             love:'Be patient — misunderstandings blow over by evening.', money:'Avoid big purchases; check the fine print.', work:'Deliver what was promised; recognition follows later.', health:'Rest well and stretch tight shoulders.' },
  support: { stars:4, line:['Help arrives — accept it.','A good day to learn, read or ask for advice.','Someone older or wiser has useful words for you.'],
             love:'Warm, caring energy — family time is lucky.', money:'Saving beats spending today.', work:'Study and plan; the payoff comes soon.', health:'Recharge — an early night pays off.' }};
const BONDTXT = { trine:'Your animal is in harmony with today — a lucky boost.', six:'Your animal pairs well with today — doors open easily.',
  clash:'Your animal clashes with today — take it slow and double-check plans.', wonjin:'A touchy day for your animal — let small things go.', same:'Today shares your animal — extra confidence.', neutral:'' };
const MONTHS = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th'];
const YEARTXT = {
  same:'A year of standing on your own feet — friends and peers matter most.', output:'A creative, expressive year — share your talents.',
  wealth:'A year of money and opportunity — make practical moves.', power:'A year of responsibility and promotion — steady effort is rewarded.', support:'A year of learning and support — mentors and family help you rise.'};
const MONTHTXT = {
  good:['Doors open — say yes to new things.','Lucky with money and people.','A smooth month; plans come together.','Good news travels to you.','Helpful people appear.'],
  calm:['Steady progress — keep going.','Quiet but useful; tidy up loose ends.','A good month to save and plan.','Look after your health and routine.','Small wins add up.'],
  care:['Go slowly with big decisions.','Watch your words; avoid arguments.','Check contracts and spending.','Rest more — do not overload yourself.','Travel carefully and keep valuables close.']};

/* ---------- public ---------- */
function parse(b){ if (!b || !b.d) return null; const [y, m, d] = b.d.split('-').map(Number); return { y, m, d, h: b.h === '' || b.h === undefined ? null : b.h }; }
function today(b, date = new Date()){
  const c = chart(b), t = dayPillar(date.getFullYear(), date.getMonth() + 1, date.getDate()), tEl = STEMS[t.s][2];
  const rel = relation(c.dm, tEl), T = TODAY[rel], my = tti(b), bd = bond(my, t.b);
  const r = rng(`${date.toDateString()}|${b.y}-${b.m}-${b.d}`);
  let stars = T.stars + (bd === 'trine' || bd === 'six' ? 1 : bd === 'clash' || bd === 'wonjin' ? -1 : 0);
  stars = Math.max(1, Math.min(5, stars));
  // the lucky element is the one your chart has least of
  const low = ORDER.slice().sort((a, z) => c.count[a] - c.count[z] || (r() - .5))[0], L = EL[low];
  return { pillar: t, el: tEl, rel, stars, line: pick(r, T.line), bond: BONDTXT[bd], love: T.love, money: T.money, work: T.work, health: T.health,
    lucky: { color: L.lucky, num: pick(r, L.nums) + (r() < .5 ? 0 : 10 * (1 + Math.floor(r() * 3))), dir: L.dir, el: low } };
}
function year(b, Y){
  const c = chart(b), yp = pillar(Y - 4), my = tti(b), rel = relation(c.dm, STEMS[yp.s][2]), bd = bond(my, yp.b), sj = samjae(my, yp.b);
  const r = rng(`${Y}|${b.y}-${b.m}-${b.d}`);
  const months = MONTHS.map((n, i) => {
    const mb = (2 + i) % 12, mbnd = bond(my, mb), ms = ((yp.s % 5) * 2 + 2 + i) % 10, mrel = relation(c.dm, STEMS[ms][2]);
    const tone = (mbnd === 'trine' || mbnd === 'six' || mrel === 'wealth' || mrel === 'support') && mbnd !== 'clash' ? 'good' : (mbnd === 'clash' || mbnd === 'wonjin' || mrel === 'power') ? 'care' : 'calm';
    return { n, tone, text: pick(r, MONTHTXT[tone]) };
  });
  return { Y, pillar: yp, rel, bond: bd, samjae: sj, text: YEARTXT[rel], months };
}
function gunghap(a, b){
  const A = chart(a), B = chart(b), ta = tti(a), tb = tti(b), bd = bond(ta, tb);
  let score = { trine: 92, six: 90, same: 78, neutral: 70, wonjin: 52, clash: 45 }[bd];
  const rel = relation(A.dm, B.dm);
  score += rel === 'support' || rel === 'output' ? 6 : rel === 'same' ? 3 : rel === 'wealth' ? 1 : -4;
  // balance: do they fill each other's missing elements?
  const fill = ORDER.filter(e => (A.count[e] === 0 && B.count[e] > 0) || (B.count[e] === 0 && A.count[e] > 0)).length;
  score = Math.max(30, Math.min(99, score + fill * 2));
  const BT = { trine:'Your animals are a natural team (삼합) — shared goals come easily.', six:'Your animals are a classic pair (육합) — you complete each other.',
    same:'Same animal — you understand each other instantly, and can be equally stubborn.', neutral:'A steady match — what you build together depends on effort.',
    wonjin:'Your animals rub each other the wrong way at times (원진) — kindness and patience fix it.', clash:'Opposite animals (충) — sparks fly, both ways. Respect each other\'s space.' };
  const RT = { same:'You share the same element — like-minded partners.', output:'You naturally nourish them — a giving bond.', support:'They naturally nourish you — a supportive bond.',
    wealth:'You lead and they follow — balance who decides.', power:'They challenge you to grow — attraction with some tension.' };
  return { score, ta, tb, bond: bd, a: A, b: B, text: [BT[bd], RT[rel], fill ? 'You fill gaps in each other\'s elements.' : ''].filter(Boolean) };
}
const DREAMS = [
  ['🐷','Pig','돼지꿈','Wealth is coming — the classic lucky dream. Some people buy a lottery ticket after it.'],
  ['💩','Poop','똥꿈','Money luck! The more there is (and the messier), the bigger the windfall.'],
  ['🐲','Dragon','용꿈','A huge success or promotion ahead. Also a famous taemong for a gifted child.'],
  ['🐍','Snake','뱀꿈','Wealth and good fortune; a big snake can be a taemong.'],
  ['🐯','Tiger','호랑이꿈','Power and protection — a strong person helps you, or a brave child is coming.'],
  ['🔥','Fire','불꿈','A blazing fire is lucky: business booms and things go well.'],
  ['💧','Clear water','맑은 물','Clear water means good luck and clarity; muddy water warns of worry.'],
  ['🦷','Teeth falling out','이빨 빠지는 꿈','Worry about someone close, or a change in family. Look after loved ones.'],
  ['🕊️','Flying','나는 꿈','Rising status and freedom — your plans will take off.'],
  ['🏃','Being chased','쫓기는 꿈','Stress you are avoiding; face it and it shrinks.'],
  ['👞','Losing shoes','신발 잃는 꿈','A change in job or relationship — let go of what does not fit.'],
  ['🐟','Fish','물고기꿈','Abundance; catching a big fish is a well-known taemong.'],
  ['🍑','Fruit','과일꿈','Ripe fruit is a taemong and a sign of rewards for your effort.'],
  ['🥇','Gold','금 꿈','Receiving gold or jewels — wealth or an honour is coming.'],
  ['🌕','Full moon','보름달꿈','Wishes coming true; also a taemong for a beautiful daughter.'],
  ['☀️','Sun','해꿈','A bright future and recognition; the sun rising into your arms is a great taemong.'],
  ['🌧️','Rain','비 꿈','Gentle rain brings blessings; a storm means troubles soon pass.'],
  ['❄️','Snow','눈 꿈','Fresh starts and clean slates — good luck is settling on you.'],
  ['💀','Seeing someone who has died','돌아가신 분','If they give you something or smile, luck is coming. They are looking out for you.'],
  ['🤰','Pregnancy','임신 꿈','New beginnings — a project, idea or opportunity is growing.'],
  ['🏠','A new house','새 집 꿈','Stability and a fresh chapter at home or work.'],
  ['💍','Wedding','결혼 꿈','A big change or new partnership — not always romance.'],
  ['🩸','Blood','피 꿈','Surprisingly lucky — often money or energy flowing to you.'],
  ['📝','Failing an exam','시험 꿈','Self-doubt; you are better prepared than you think.'],
  ['🌊','Big waves','파도 꿈','Big emotions or a wave of change; ride it, do not fight it.'],
  ['🐶','Dog','개꿈','A friendly dog means a loyal helper; "개꿈" also means a meaningless dream!'],
  ['🌸','Flowers','꽃 꿈','Love, popularity and happy news.'],
  ['🐄','Cow','소꿈','Steady wealth and hard work paying off.'],
  ['💰','Finding money','돈 줍는 꿈','Funny one — finding money can mean small losses, so watch your wallet.'],
  ['🔑','Keys','열쇠 꿈','A solution or opportunity is in your hands.'],
  ['🌉','Crossing a bridge','다리 꿈','Moving to the next stage of life successfully.'],
  ['🐦','Birds','새 꿈','News is on its way — usually good.']];
window.SAJU = { STEMS, BRANCHES, EL, ORDER, DM, TTI, chart, tti, today, year, gunghap, parse, relation, dayPillar, pillar, bond, samjae, DREAMS };
})();
