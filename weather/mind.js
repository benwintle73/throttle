/* Mind Reader: a 20-questions game. Think of something; it asks the question that best splits what's left,
   updates the odds after every answer (yes / probably / sometimes / doubtful / no / don't know), guesses when it's
   confident, and learns from every finished game (locally, and shared with everyone when signed in). */
(function(){
// questions: [key, text]
const Q = [
  ['alive','Is it alive?'],['animal','Is it an animal?'],['mammal','Is it a mammal?'],['bird','Is it a bird?'],['fish','Is it a fish or sea creature?'],
  ['insect','Is it an insect or bug?'],['reptile','Is it a reptile or amphibian?'],['pet','Do people keep it as a pet?'],['farm','Would you find it on a farm?'],
  ['zoo','Would you see it at a zoo?'],['water','Does it live in or near water?'],['fly','Can it fly?'],['legs4','Does it have four legs?'],['fur','Does it have fur or hair?'],
  ['big','Is it bigger than a person?'],['small','Is it smaller than your hand?'],['danger','Can it be dangerous?'],['aus','Is it found in Australia?'],['nocturnal','Is it more active at night?'],
  ['plant','Is it a plant?'],['tree','Does it grow on a tree?'],['flower','Is it a flower?'],['food','Is it food or a drink?'],['drink','Is it a drink?'],['fruit','Is it a fruit?'],
  ['veg','Is it a vegetable?'],['sweet','Does it taste sweet?'],['cooked','Is it usually cooked or heated?'],['breakfast','Do people have it for breakfast?'],['meat','Does it contain meat?'],
  ['dairy','Is it made from milk?'],['snack','Is it a snack?'],['manmade','Is it made by people?'],['electric','Does it use electricity or batteries?'],['screen','Does it have a screen?'],
  ['metal','Is it mostly made of metal?'],['wood','Is it made of wood?'],['plastic','Is it mostly plastic?'],['glass','Does it have glass in it?'],['paper','Is it made of paper?'],
  ['soft','Is it soft?'],['hold','Can you hold it in one hand?'],['heavy','Is it heavy?'],['kitchen','Would you find it in a kitchen?'],['bathroom','Would you find it in a bathroom?'],
  ['bedroom','Would you find it in a bedroom?'],['office','Is it used at school or in an office?'],['outdoor','Is it mostly used or found outdoors?'],['sport','Is it used in a sport?'],
  ['gym','Would you find it at a gym?'],['ride','Can you ride in or on it?'],['wheels','Does it have wheels?'],['engine','Does it have an engine?'],['tool','Is it a tool?'],
  ['wear','Do you wear it?'],['toy','Is it a toy or game?'],['sound','Does it make a sound or music?'],['round','Is it round?'],['sharp','Is it sharp or pointy?'],['hot','Does it get hot?'],
  ['cold','Is it cold?'],['liquid','Is it a liquid?'],['colour','Does it come in lots of colours?'],['white','Is it usually white?'],['green','Is it usually green?'],['red','Is it usually red or orange?'],
  ['place','Is it a place?'],['building','Is it a building?'],['nature','Is it part of nature?'],['sky','Is it found in the sky?'],['weather','Is it to do with the weather?'],
  ['old','Has it been around for more than 100 years?'],['pricey','Does it usually cost more than $100?'],['daily','Do most people use it every day?'],['moves','Does it move by itself?'],
  ['light','Does it give off light?'],['open','Can you open it?'],['container','Can you put things inside it?'],['person','Is it a person or job?'],['body','Is it part of the body?'],
  ['clean','Is it used for cleaning?'],['write','Is it used for writing or drawing?'],['communicate','Is it used to talk to people?'],['money','Is it to do with money?'],['legs2','Does it walk on two legs?']];

// things: "name|tags" — a tag means yes; ~tag means sometimes/partly; anything not listed means no
const KB = `
cat|alive animal mammal pet legs4 fur small~ ~nocturnal aus moves ~danger
dog|alive animal mammal pet legs4 fur farm~ aus moves ~danger ~big daily~
horse|alive animal mammal farm legs4 fur big ride aus moves ~pet ~danger
cow|alive animal mammal farm legs4 fur big aus moves food~ ~danger
pig|alive animal mammal farm legs4 ~fur big~ aus moves ~food
sheep|alive animal mammal farm legs4 fur aus moves white
chicken|alive animal bird farm ~fly aus moves legs2 ~pet ~food
duck|alive animal bird farm water fly aus moves legs2
kangaroo|alive animal mammal zoo aus fur moves ~big ~danger ~nocturnal
koala|alive animal mammal zoo aus fur moves tree~ nocturnal
wombat|alive animal mammal zoo aus fur legs4 moves nocturnal
platypus|alive animal mammal zoo aus fur water legs4 moves ~danger
echidna|alive animal mammal zoo aus legs4 moves sharp ~nocturnal
emu|alive animal bird zoo aus big legs2 moves ~danger
kookaburra|alive animal bird aus fly moves sound legs2 small~
magpie|alive animal bird aus fly moves legs2 ~danger sound
cockatoo|alive animal bird aus fly moves white ~pet sound legs2
parrot|alive animal bird fly pet zoo colour moves sound legs2 aus
penguin|alive animal bird zoo water cold legs2 moves white~ aus~
owl|alive animal bird fly nocturnal moves legs2 aus
eagle|alive animal bird fly danger moves legs2 aus sky~
lion|alive animal mammal zoo legs4 fur big danger moves
tiger|alive animal mammal zoo legs4 fur big danger moves red~
elephant|alive animal mammal zoo legs4 big heavy moves ~danger
giraffe|alive animal mammal zoo legs4 fur big moves
bear|alive animal mammal zoo legs4 fur big danger moves
monkey|alive animal mammal zoo fur moves ~tree ~danger
zebra|alive animal mammal zoo legs4 fur big moves white~
crocodile|alive animal reptile zoo water legs4 big danger moves aus
snake|alive animal reptile danger moves aus ~pet ~zoo
lizard|alive animal reptile legs4 small~ moves aus ~pet
turtle|alive animal reptile water legs4 moves aus ~pet zoo
frog|alive animal reptile water legs4 small moves aus green sound
shark|alive animal fish water big danger moves aus zoo~
dolphin|alive animal mammal water big~ moves aus zoo~ sound
whale|alive animal mammal water big heavy moves aus
goldfish|alive animal fish water pet small moves red container~
octopus|alive animal fish water moves ~danger aus
crab|alive animal fish water moves ~danger aus food~ red~
bee|alive animal insect fly small moves danger~ sound
butterfly|alive animal insect fly small moves colour
ant|alive animal insect small moves aus
spider|alive animal insect small moves danger~ aus nocturnal~
mosquito|alive animal insect fly small moves sound ~danger nocturnal
fly|alive animal insect fly small moves sound
mouse|alive animal mammal small fur legs4 moves ~pet nocturnal
rabbit|alive animal mammal pet fur legs4 farm~ moves small~ aus white~
bat|alive animal mammal fly nocturnal fur moves aus
tree|alive plant nature outdoor big green wood old aus
rose|alive plant flower red sharp~ colour outdoor~
sunflower|alive plant flower outdoor big~ ~food
grass|alive plant nature outdoor green aus
cactus|alive plant sharp green outdoor~
apple|alive~ food fruit tree sweet red green~ round hold snack kitchen
banana|alive~ food fruit sweet hold snack breakfast~ kitchen aus
orange|alive~ food fruit tree sweet round hold red kitchen drink~
strawberry|alive~ food fruit sweet red small
watermelon|alive~ food fruit sweet round heavy green red~
grapes|alive~ food fruit sweet small green~ ~red snack
lemon|alive~ food fruit tree round hold
mango|alive~ food fruit tree sweet hold
pineapple|alive~ food fruit sweet sharp~
carrot|alive~ food veg red hold ~cooked snack~
potato|alive~ food veg cooked hold
tomato|alive~ food veg fruit~ red round hold
broccoli|alive~ food veg green cooked~
onion|alive~ food veg round hold cooked~ white~
corn|alive~ food veg cooked~ sweet~
pizza|food cooked hot meat~ dairy round snack~ manmade
burger|food cooked hot meat hold manmade
sausage|food cooked hot meat hold manmade aus
meat pie|food cooked hot meat hold aus manmade
sushi|food meat~ fish~ manmade cold~ hold
pasta|food cooked hot manmade kitchen~
rice|food cooked white small manmade~ kitchen
bread|food manmade breakfast cooked~ kitchen daily~ soft~
toast|food manmade breakfast cooked hot hold
egg|food breakfast cooked~ white round~ hold farm~ kitchen
cereal|food manmade breakfast sweet~ dairy~ kitchen
cheese|food dairy manmade ~snack kitchen
ice cream|food dairy sweet cold manmade snack colour
chocolate|food sweet manmade snack hold colour~
cake|food sweet manmade cooked kitchen~
biscuit|food sweet manmade snack small hold
chips|food snack manmade cooked~ hold
popcorn|food snack manmade cooked white small
vegemite|food manmade breakfast aus kitchen container~
honey|food sweet liquid~ container~ kitchen
milk|food drink dairy liquid white cold kitchen daily breakfast~ farm~
coffee|food drink liquid hot daily breakfast manmade~ kitchen
tea|food drink liquid hot manmade~ kitchen daily~
water|food~ drink liquid nature daily cold~
juice|food drink liquid sweet cold manmade breakfast~ colour
beer|food drink liquid cold manmade old
soft drink|food drink liquid sweet cold manmade container~ colour
phone|manmade electric screen hold daily communicate glass metal~ plastic~ pricey sound light~ bedroom~
laptop|manmade electric screen office pricey open plastic~ metal~ daily~ glass
television|manmade electric screen big~ heavy~ pricey sound light glass bedroom~
tablet|manmade electric screen hold~ pricey glass
computer|manmade electric screen office pricey heavy~
watch|manmade wear hold small metal~ electric~ daily screen~ glass~
headphones|manmade electric sound wear hold plastic~ daily~
camera|manmade electric hold glass pricey~
remote control|manmade electric hold plastic daily~ small~
lamp|manmade electric light bedroom~ office~ glass~
light bulb|manmade electric light glass hold hot~ small
torch|manmade electric light hold metal~ plastic~ outdoor~
fridge|manmade electric kitchen cold big heavy pricey open container daily metal~
oven|manmade electric~ kitchen hot big heavy pricey open container metal~
microwave|manmade electric kitchen hot open container pricey~
toaster|manmade electric kitchen hot metal~ breakfast~ daily~
kettle|manmade electric kitchen hot container metal~ plastic~ daily
washing machine|manmade electric big heavy pricey clean open container
vacuum cleaner|manmade electric clean sound pricey~ wheels~
fan|manmade electric bedroom~ cold~ sound~ weather~
air conditioner|manmade electric cold~ hot~ pricey weather~
clock|manmade electric~ office~ bedroom~ round~ sound~ daily
key|manmade metal small hold daily open~
coin|manmade metal small round hold money old
money|manmade paper~ money hold daily old
credit card|manmade plastic small hold money daily
wallet|manmade hold container money daily~ soft~
book|manmade paper hold open office~ bedroom~ old
newspaper|manmade paper hold old daily~
pen|manmade write hold office plastic~ metal~ sharp~ daily~ small~
pencil|manmade write hold office wood sharp old small~
scissors|manmade sharp metal hold office~ tool kitchen~
knife|manmade sharp metal hold kitchen tool danger daily~
fork|manmade metal hold kitchen sharp~ daily
spoon|manmade metal hold kitchen daily round~
plate|manmade kitchen round daily glass~ white~
cup|manmade kitchen hold container daily round~
bottle|manmade container hold plastic~ glass~ open
bag|manmade container soft~ hold~ open
box|manmade container paper~ open
chair|manmade wood~ metal~ plastic~ office~ heavy~ daily
table|manmade wood~ heavy big~ kitchen~ office~
bed|manmade bedroom soft big heavy daily pricey
pillow|manmade bedroom soft hold~ daily white~
blanket|manmade bedroom soft cold~ ~colour
door|manmade wood~ open big~ heavy~ daily
window|manmade glass open~ daily~
mirror|manmade glass bathroom~ bedroom~
toothbrush|manmade plastic bathroom hold clean daily small~
toothpaste|manmade bathroom clean hold daily container~ white~
soap|manmade bathroom clean hold daily
towel|manmade bathroom soft clean~ daily colour~
toilet|manmade bathroom white heavy daily open~ water~
shower|manmade bathroom water~ hot~ daily clean
umbrella|manmade weather outdoor open hold~ colour~
sunglasses|manmade wear glass weather~ outdoor plastic~
hat|manmade wear soft~ outdoor~ weather~
shoes|manmade wear daily~ outdoor~ colour~
t-shirt|manmade wear soft daily colour
jacket|manmade wear soft~ cold~ weather~
thongs|manmade wear plastic~ aus outdoor weather~
sunscreen|manmade weather outdoor bathroom~ container~ white~ aus
car|manmade ride wheels engine metal heavy pricey big moves~ daily~ outdoor
bicycle|manmade ride wheels metal outdoor sport~ pricey~
motorbike|manmade ride wheels engine metal outdoor pricey danger~ sound
bus|manmade ride wheels engine big heavy outdoor
train|manmade ride wheels engine big heavy metal old
truck|manmade ride wheels engine big heavy metal pricey
aeroplane|manmade ride engine big heavy metal sky fly pricey
helicopter|manmade ride engine sky fly metal pricey sound
boat|manmade ride water outdoor engine~ pricey~ big~
skateboard|manmade ride wheels wood~ sport toy~ outdoor hold~
tractor|manmade ride wheels engine farm big heavy pricey
rocket|manmade engine sky fly metal big pricey danger hot
ball|manmade round sport toy hold~ outdoor~ colour~ soft~ gym~
football|manmade round~ sport outdoor hold~ aus
cricket bat|manmade wood sport hold~ outdoor aus
tennis racquet|manmade sport hold outdoor~
golf club|manmade sport metal~ outdoor
dumbbell|manmade gym sport~ metal heavy hold~
treadmill|manmade gym electric big heavy pricey sport~
barbell|manmade gym metal heavy sport~
yoga mat|manmade gym soft~ sport~ colour
skipping rope|manmade gym sport~ toy~ hold
kettlebell|manmade gym metal heavy round~ hold~
protein shake|food drink gym liquid manmade cold~ sweet~ container~
trampoline|manmade toy outdoor big sport~ round~
lego|manmade toy plastic small colour hold
doll|manmade toy hold soft~ colour~
teddy bear|manmade toy soft hold~ bedroom
kite|manmade toy outdoor sky~ fly weather~ colour
puzzle|manmade toy paper~ small~ colour~
video game|manmade toy electric screen~ sound~ daily~ pricey~
playing cards|manmade toy paper hold small old
guitar|manmade sound wood hold~ pricey~
piano|manmade sound wood~ heavy big pricey old
drum|manmade sound round~ sport~
hammer|manmade tool metal hold heavy~ wood~ outdoor~
screwdriver|manmade tool metal hold sharp~
saw|manmade tool metal sharp danger outdoor~
ladder|manmade tool metal~ wood~ big~ outdoor~
shovel|manmade tool metal outdoor~ wood~
lawn mower|manmade engine~ electric~ outdoor wheels sound danger~
broom|manmade clean wood~ plastic~ hold~
candle|manmade light hot hold~ old
fire|nature hot light danger outdoor~ old
sun|nature sky hot light round big old weather
moon|nature sky light~ round big old nocturnal
star|nature sky light small~ old nocturnal
cloud|nature sky weather white soft~ moves~
rain|nature weather sky~ liquid water outdoor cold~
snow|nature weather cold white outdoor
rainbow|nature weather sky colour outdoor
lightning|nature weather sky light danger hot~ sound~
wind|nature weather outdoor moves sound~ cold~
tornado|nature weather danger moves big
ocean|nature water big place outdoor liquid aus
beach|nature place outdoor water aus weather~ hot~
mountain|nature place outdoor big old heavy
river|nature place water outdoor moves liquid
desert|nature place outdoor hot aus big
rock|nature hold~ heavy~ outdoor old
sand|nature small outdoor water~ hot~
tree house|manmade wood outdoor place~ building~ toy~
house|manmade building place big heavy pricey daily
school|manmade building place office daily~ big
hospital|manmade building place big danger~
gym building|manmade building place gym sport
church|manmade building place old
bridge|manmade place big heavy metal~ outdoor
park|place outdoor nature~ green
playground|manmade place outdoor toy
zoo|manmade place outdoor animal~ zoo
supermarket|manmade building place food~ money~ daily~
airport|manmade building place big sky~
doctor|alive person legs2 moves
teacher|alive person legs2 office moves
police officer|alive person legs2 danger~ moves
firefighter|alive person legs2 hot~ danger moves
chef|alive person legs2 kitchen cooked~ moves
baby|alive person small~ legs2~ moves sound
grandma|alive person legs2 old~ moves
hand|alive~ body hold~
eye|alive~ body small round~
heart|alive~ body red sound~ moves
teeth|alive~ body white small sharp~ hard~
hair|alive~ body soft~
nose|alive~ body small
`;

const KEYS = Q.map(q => q[0]);
const things = KB.trim().split('\n').map(l => { const [name, tags] = l.split('|'); const v = {};
  for (const t of (tags || '').trim().split(/\s+/)) { if (!t) continue; if (t.endsWith('~')) v[t.slice(0, -1)] = 0.15; else if (t.startsWith('~')) v[t.slice(1)] = 0; else v[t] = 1; }
  return { name: name.trim(), v }; });
// sensible implications so the base is consistent
for (const t of things){ const v = t.v;
  if (v.mammal === 1 || v.bird === 1 || v.fish === 1 || v.insect === 1 || v.reptile === 1){ v.animal = 1; v.alive = 1; v.nature = v.nature ?? 1; v.moves = v.moves ?? 1; }
  if (v.animal === 1) v.alive = 1;
  if (v.fruit === 1 || v.veg === 1){ v.food = 1; v.plant = v.plant ?? 0.15; v.nature = v.nature ?? 0.5; }
  if (v.drink === 1){ v.food = v.food ?? 1; v.liquid = v.liquid ?? 1; }
  if (v.plant === 1){ v.alive = 1; v.nature = v.nature ?? 1; }
  if (v.building === 1) v.place = 1;
  if (v.person === 1){ v.alive = 1; v.mammal = v.mammal ?? 0; }
  if (v.screen === 1) v.electric = 1;
  if (v.engine === 1) v.moves = v.moves ?? 0.5;
}
const val = (t, k) => t.v[k] ?? (k === 'manmade' && !t.v.alive && !t.v.nature ? 0.3 : -1);
window.MIND = { Q, KEYS, things, val };
})();
