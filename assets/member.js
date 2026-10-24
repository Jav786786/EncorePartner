/* Encore Member app. Reads the Partner app's live state (core.js) and lists a published partner event at the top of Discover. */

/* ---------------------------------------------------------------- catalogue */
var BASE_EVENTS=[
 {id:'mystery', title:'Mystery night', cat:'Surprise', tag:'Revealed 24h before', cr:15, rrp:'—', myst:1,
  meta:'Zone 1, on foot from Old Street · Thu 20:30', art:BLUE,
  why:'You said yes to three things this year you had never heard of. This is the fourth.',
  blurb:'Fifteen credits, one address sent the day before, and no menu, line-up or programme until you are inside. Small room, forty people, always a good one.',
  plan:[['20:00','Address lands on your stub'],['20:30','Doors — say the word on the stub'],['23:00','The reveal, then the pub']]},
 {id:'amapiano', title:'Amapianoland day party', cat:'Music', tag:'Amapiano & Afrobeats', cr:14, rrp:'£17.03',
  meta:'Boxpark Croydon · Sun 16:00', art:PINK,
  why:'You book live music most months, and Sunday afternoons are when you actually go out.',
  blurb:'Amapiano and Afrobeats from four till eight at Boxpark Croydon. A day groove, not a late night: home by nine. 18+.',
  plan:[['16:00','Doors, Boxpark Croydon on George Street'],['18:00','Peak groove'],['20:00','Doors close, East Croydon station is next door']]},
 {id:'lionesses', title:'London City Lionesses v Everton', cat:'Sports', tag:'WSL home match', cr:20, rrp:'—', wave:1,
  meta:'London City Lionesses · Sun 14:00', art:SPORTS,
  why:'You picked sport at sign-up and have never been to a WSL game. Sunday afternoon, home by six.',
  blurb:'Women\'s Super League: London City Lionesses at home to Everton. Encore members sit together.',
  plan:[['13:15','Meet at the member gate'],['14:00','Kick-off'],['16:00','Full time, then the pub']]},
 {id:'o2climb', title:'Rooftop climb, Snow Globe edition', cat:'Outdoors', tag:'Guided climb', cr:35, rrp:'—', wave:1,
  meta:'Up at The O2 · Sat 17:30', art:GREENB,
  why:'You keep saving things with a view. This one you climb to.',
  blurb:'A guided, harnessed climb over the roof of The O2, with the river below. In winter it becomes the Snow Globe climb.',
  plan:[['17:00','Check in and harness up'],['17:30','Up and over the roof'],['19:00','Down, and dinner on the peninsula']]},
 {id:'skating', title:'Ice skating at the Palace', cat:'Sports', tag:'Skate session', cr:14, rrp:'—', wave:1,
  meta:'Alexandra Palace · Fri 19:00', art:SPORTS,
  why:'Friday nights with friends suit you. Skates are included, so nobody needs a plan.',
  blurb:'An evening session on the ice at Alexandra Palace. Skate hire included; wobbling optional.',
  plan:[['18:45','Collect your skates'],['19:00','On the ice'],['20:30','The view over London from the terrace']]},
 {id:'magic', title:'Close-up magic, at the table', cat:'Theatre', tag:'Immersive show', cr:30, rrp:'—', wave:1,
  meta:'The Magicians Table · Fri 20:00', art:THEATRE,
  why:'You said yes to three things this year you had never heard of. This one happens a foot from your face.',
  blurb:'An immersive close-up magic show: a small table, a few guests, and tricks you will still be arguing about on the way home.',
  plan:[['19:45','Doors, drinks at the bar'],['20:00','Seated at the table'],['21:30','Out, still arguing about the cards']]},
 {id:'salsa', title:'Salsa class, then the social', cat:'Music', tag:'Beginners welcome', cr:12, rrp:'—', wave:1,
  meta:'Funky Mambo · Tonight 19:30', art:PINK,
  why:'You book live music most months. This time you are the one moving.',
  blurb:'An hour\'s salsa class for all levels, then the social: the floor stays open and so does the bar.',
  plan:[['19:30','Class, all levels'],['20:30','The social starts'],['22:30','Last song']]},
 {id:'knock2bag', title:'Knock2Bag with Ivo Graham', cat:'Comedy', tag:'Comedy night', cr:15, rrp:'—', wave:1,
  meta:'MOTH Club · Wed 18 Nov', art:THEATRE,
  why:'Cheap, close to Hackney, and you have never once regretted a comedy late.',
  blurb:'Knock2Bag\'s comedy night at MOTH Club in Hackney, with Ivo Graham on the bill.',
  plan:[['—','Doors time on your stub'],['—','The bar is the point between acts'],['—','Mare Street for the bus home']]},
 {id:'karting', title:'Go-karting under the stadium', cat:'Sports', tag:'F1 DRIVE', cr:40, rrp:'—', wave:1,
  meta:'Tottenham Hotspur Stadium · Sat 12:00', art:SPORTS,
  why:'You saved a race weekend last year. This is the closest you will get on a Saturday.',
  blurb:'F1 DRIVE London: electric go-karts on a track that runs through Tottenham Hotspur Stadium.',
  plan:[['11:30','Briefing and helmets'],['12:00','Practice, then the race'],['13:30','Podium photo']]},
 {id:'quilt', title:'Victorian crazy quilt workshop', cat:'Art', tag:'Workshop', cr:22, rrp:'—', wave:1,
  meta:'Museum of the Home · Sun 11:00', art:YEL,
  why:'You always book something gentle on the Sunday after a big night. This is that thing.',
  blurb:'A hands-on workshop in Victorian crazy quilting at the Museum of the Home. Materials provided; you leave with your own piece.',
  plan:[['11:00','Materials and a short history'],['11:30','Stitching'],['13:00','Coffee in the gardens']]},
 {id:'cooking', title:'Malaysian cooking, guest chef', cat:'Food', tag:'Cook school', cr:32, rrp:'—', wave:2,
  meta:'Borough Kitchen Cook School · Thu 18:30', art:RED,
  why:'Two food things in six weeks. This time you cook it.',
  blurb:'A guest chef teaches a Malaysian menu at Borough Kitchen Cook School. You cook, then you eat what you made.',
  plan:[['18:30','Aprons on'],['19:00','Cook with the guest chef'],['20:30','Sit down and eat it']]},
 {id:'qbtalk', title:'Illustration and public art', cat:'Art', tag:'Talk', cr:10, rrp:'—', wave:2,
  meta:'Quentin Blake Centre · Tue 19:00', art:YEL,
  why:'You go to galleries more than anywhere else. This one talks back.',
  blurb:'A talk on illustration and public art at the Quentin Blake Centre for Illustration.',
  plan:[['18:45','Doors'],['19:00','The talk'],['20:00','Questions, then the galleries']]},
 {id:'terrarium', title:'Build your own terrarium', cat:'Outdoors', tag:'Workshop', cr:24, rrp:'—', wave:2,
  meta:'Repot, Hackney Wick · Sat 14:00', art:GREENB,
  why:'Ten minutes from home, and you leave with something alive.',
  blurb:'A terrarium-making workshop at Repot in Hackney Wick. Glass, plants and soil provided; you take yours home.',
  plan:[['14:00','Pick your glass and plants'],['14:30','Build it'],['16:00','Canal walk home']]},
 {id:'manon', title:'Manon', cat:'Theatre', tag:'Ballet', cr:65, rrp:'—', wave:2,
  meta:'Royal Ballet and Opera · Thu 19:30', art:THEATRE,
  why:'No theatre in your Stack this season. This is the big one.',
  blurb:'Manon, the ballet, at the Royal Ballet and Opera in Covent Garden.',
  plan:[['19:00','Drinks in the Paul Hamlyn Hall'],['19:30','Curtain'],['22:15','Covent Garden, two minutes away']]},
 {id:'tatetour', title:'Discovery tour', cat:'Art', tag:'Guided tour', cr:12, rrp:'—', wave:2,
  meta:'Tate Modern · Sun 10:30', art:YEL,
  why:'You go to Tate more than anywhere else. A guide shows you the rooms you skip.',
  blurb:'A guided discovery tour of the Tate Modern collection, in a small group.',
  plan:[['10:30','Meet in the Turbine Hall'],['11:30','Tour ends on level 4'],['12:00','Bankside for lunch']]}
];
var EVENTS=BASE_EVENTS.slice(), PE=null;
var TIERS=[
 {k:'access',name:'Encore Access',price:'£9.99',cr:5,badge:'Entry',rate:'£2.00 a credit',
  sub:'Member pricing and the weekly edit. Credits for a cheap Tuesday.',
  perks:['Personalised weekly edit','Member pricing, no booking fees','Member-only releases']},
 {k:'select',name:'Encore Select',price:'£39.99',cr:25,badge:'Regular',rate:'£1.60 a credit',
  sub:'One proper night out a month, or three small ones.',
  perks:['Everything in Access','25 credits a month, rolling over','One free plus-one a month']},
 {k:'plus',name:'Encore Plus',price:'£89.99',cr:70,badge:'Most popular',rate:'£1.29 a credit',
  sub:'Two gigs and a play, or six smaller things across the month.',
  perks:['Everything in Select','70 credits a month, rolling over','Group planning and shared plans','First window on member-only releases']},
 {k:'icon',name:'Encore Icon',price:'£119.99',cr:110,badge:'Best rate',rate:'£1.09 a credit',
  sub:'The best rate we do, and the ballot for the things money alone will not get you.',
  perks:['Everything in Plus','110 credits a month, rolling over','Formula E paddock ballot, twice a season','Opening nights and two plus-ones']}
];
var CHIPS=[{k:'all',l:'All events'},{k:'tonight',l:'Tonight'},{k:'weekend',l:'This weekend'},{k:'Sports',l:'Sports'},{k:'Art',l:'Art'},{k:'Outdoors',l:'Outdoors'},
           {k:'Theatre',l:'Theatre'},{k:'Comedy',l:'Comedy'},{k:'Food',l:'Food'},{k:'Music',l:'Music'},{k:'Surprise',l:'Surprise me'},{k:'cheap',l:'Under 20 credits'}];
var INTERESTS=['Live music','Art & exhibitions','Fashion','Theatre & dance','Comedy','Food & drink','Sport','Wellness','Family'];
var ONBOARD=['landing','connect','taste','plans'];
var WIDTH={landing:'w-wide',connect:'w-narrow',taste:'w-narrow',plans:'w-wide',discover:'w-wide',event:'w-wide',checkout:'w-narrow',stub:'w-narrow',
  ticket:'w-narrow',stack:'w-wide',group:'w-mid',wallet:'w-wide',profile:'w-narrow',status:'w-mid'};

/* ---------------------------------------------------------------- state (kept per tab, so a refresh keeps your place) */
var SKEY='encore.member.session.v3';
function sdefaults(){return {screen:'landing',picked:['Art & exhibitions','Fashion','Live music'],radius:2,plan:'plus',q:'',chip:'all',eventId:'lionesses',
  credits:70,spent:0,plusOne:true,stack:[],votes:{karting:3,salsa:2,magic:1},myVote:null,locked:false,topUp:1,dview:'list',mapSel:null,ticketId:null,peBook:null,epoch:epoch()};}
function sload(){try{var o=JSON.parse(sessionStorage.getItem(SKEY)||'null');if(o&&o.screen){var d=sdefaults();for(var k in o)d[k]=o[k];return d;}}catch(e){}return sdefaults();}
function ssave(){try{sessionStorage.setItem(SKEY,JSON.stringify(S));}catch(e){}}
var S=sload();
function tier(){for(var i=0;i<TIERS.length;i++)if(TIERS[i].k===S.plan)return TIERS[i];return TIERS[2];}
function bal(){return S.credits-S.spent;}

function syncEvents(){P=pload();PE=partnerEventForMember();EVENTS=(PE?[PE]:[]).concat(BASE_EVENTS);}
function byId(id){for(var i=0;i<EVENTS.length;i++)if(EVENTS[i].id===id)return EVENTS[i];
  if(String(id).indexOf('pe_')===0){var pe=partnerEventForMember(true);if(pe)return pe;}
  return BASE_EVENTS[2];}
function vidOf(e){return e.vid||e.id;}
function clip(e){return clipTag(vidOf(e));}
function venue(e){return e.meta.split('·')[0].trim();}
function when(e){return e.meta.split('·').slice(1).join('·').trim()||e.tag;}

/* ---------------------------------------------------------------- shared bits */
function ul(items){return '<div class="ul">'+items.map(function(t){return '<div><span>✦</span><p class="sub">'+t+'</p></div>';}).join('')+'</div>';}
function obar(back,step){return '<div class="obar">'+(back?'<button class="backb" data-act="go" data-v="'+back+'">'+ico('back',20)+'Back</button>':'<span></span>')+
  (step?'<p class="lab">'+step+'</p>':'')+'</div>';}
function stubHtml(e,n,extra){
  return '<div class="stub '+(STUBCOL[e.cat]||'music')+' '+(extra||'')+'"><span class="no"><span>'+esc(e.cat).toUpperCase()+'</span></span>'+
   '<p class="serial">№ '+n+'</p><h5>'+esc(e.title)+'</h5><p>'+esc(e.meta)+' · '+e.cr+' cr</p></div>';}

/* ---------------------------------------------------------------- onboarding */
function scrLanding(){
  function reel(id,lab,l,top,rot){return '<div class="reel" style="left:'+l+'%;top:'+top+'%;transform:rotate('+rot+'deg)">'+clipTag(id)+'<span class="scrim">'+lab+'</span></div>';}
  function f3(k,v){return '<div><p class="lab">'+k+'</p><p>'+v+'</p></div>';}
  return '<div class="landing">'+
    '<div class="l-head"><div class="logo-row">'+logoMark(128)+'</div>'+
      '<p class="fr">Another one.</p>'+
      '<h1 class="t hero-t">Discover great<br>experiences.<br>Again and again.</h1></div>'+
    '<div class="l-reels"><div class="reels">'+reel('amapiano','Day party · Sun',0,8,-5)+reel('lionesses','Match · Sun 2pm',34,1,3)+reel('tatetour','Gallery · Sun',67,9,-2)+'</div></div>'+
    '<div class="l-body"><p class="sub lead">Gigs, exhibitions, matches, plays and daft ideas, on weeknights and weekends. One membership, monthly credits, and recommendations that know you.</p>'+
      '<div class="facts">'+f3('Membership','From £9.99 a month')+f3('Credits','Roll over')+f3('Booking fees','None')+'</div>'+
      '<div class="ctas"><button class="btn" data-act="go" data-v="connect">Create your account</button>'+
      '<button class="btn ghost" data-act="go" data-v="connect">I already have an account</button></div>'+
      '<p class="sub" style="margin-top:14px;font-size:11.5px">Monthly membership, cancel any time. Credits roll over. No booking fees on top.</p></div>'+
  '</div>';}
function scrConnect(){
  return obar('landing','Step 1 of 3')+
   '<h1 class="t">Create your account.</h1>'+
   '<p class="sub" style="margin-top:12px">It takes a minute. You only pay once you pick a plan.</p>'+
   '<div style="margin-top:22px;display:flex;flex-direction:column;gap:10px">'+
     '<button class="btn" data-act="signup">Continue with Apple</button>'+
     '<button class="btn ghost" data-act="signup">Continue with Google</button>'+
     '<button class="btn ghost" data-act="signup">Continue with email</button></div>'+
   '<div class="card" style="margin-top:20px">'+ul(['Credits that roll over, month to month','No booking fees on top','One free plus-one a month','Pause or cancel any time'])+'</div>'+
   '<p class="sub" style="margin-top:12px;font-size:11.5px">By continuing you agree to Encore’s terms and privacy policy. Encore is open to everyone in the UK.</p>';}
var RADIUS=['Walkable','2 miles','City-wide','Anywhere'], RCOUNT=[41,126,318,540];
function radiusTxt(){return RADIUS[S.radius]+' · '+RCOUNT[S.radius]+' experiences this month';}
function scrTaste(){
  var chips=INTERESTS.map(function(t){var on=S.picked.indexOf(t)>-1;return '<button class="chip'+(on?' on':'')+'" data-act="pick" data-v="'+t+'" aria-pressed="'+on+'">'+t+'</button>';}).join('');
  function ava(i,n){return '<div class="ava"><i>'+i+'</i><p>'+n+'</p></div>';}
  return obar('connect','Step 2 of 3')+
   '<h1 class="t">What makes you say yes?</h1>'+
   '<p class="sub" style="margin-top:10px">We only suggest things you would actually turn up to.</p>'+
   '<div class="chips" style="margin-top:16px">'+chips+'</div>'+
   '<hr class="hair" style="margin:24px 0">'+
   '<h2 class="t" style="font-size:20px">How far will you travel for a good night?</h2>'+
   '<p class="sub" style="margin-top:8px">Be honest — a Tuesday and a Saturday can be different answers. It changes everything we show you.</p>'+
   '<input type="range" min="0" max="3" value="'+S.radius+'" data-act="radius" aria-label="Travel distance" style="margin-top:14px">'+
   '<p class="mono" id="radTxt" style="margin-top:6px;font-size:12px;color:var(--mut)">'+radiusTxt()+'</p>'+
   '<hr class="hair" style="margin:24px 0">'+
   '<h2 class="t" style="font-size:20px">Who are you dragging along?</h2>'+
   '<div class="avas" style="margin-top:12px">'+ava('JW','Jonah')+ava('EL','Ellis')+ava('PR','Priya')+ava('+','Invite')+'</div>'+
   '<p class="sub" style="margin-top:12px;font-size:11.5px">Every member gets one free plus-one a month. Your friends do not need Encore to come out.</p>'+
   '<button class="btn" style="margin-top:22px" data-act="go" data-v="plans">Continue</button>';}
function scrPlans(){
  var h=obar('taste','Step 3 of 3')+
   '<h1 class="t">Pick your appetite.</h1>'+
   '<p class="sub" style="margin-top:10px;max-width:620px">Credits are Encore\'s currency — roughly £1.20 of experience each. The bigger the plan, the further every pound stretches.</p>'+
   '<div class="tiers">';
  TIERS.forEach(function(t){var on=t.k===S.plan;
    h+='<div class="tiercard'+(on?' on':'')+'">'+(t.k==='plus'?'<span class="enbadge">'+t.badge+'</span>':'')+
      '<button type="button" class="tierpick" data-act="plan" data-v="'+t.k+'" aria-pressed="'+on+'">'+
      '<div class="row-b"><span class="name">'+t.name.replace('Encore ','')+'</span>'+(t.k==='plus'?'':'<span class="lab">'+t.badge+'</span>')+'</div>'+
      '<div class="row-b" style="margin-top:10px"><span style="font:800 24px/1 var(--font-display)">'+t.price+'<span class="sub" style="font-size:11px"> /month</span></span>'+
      '<span class="mono" style="font-size:12px;font-weight:700">'+t.cr+' credits</span></div>'+
      '<p class="sub" style="margin-top:8px;font-size:12.5px">'+t.sub+'</p>'+
      '<p class="mono" style="margin-top:6px;font-size:10.5px;color:var(--mut)">'+t.rate+'</p></button>'+
      '<div class="perks">'+ul(t.perks)+(on?'<button class="btn join-in" style="margin-top:14px" data-act="join">Join '+t.name+' · '+t.price+' a month</button>':'')+'</div>'+
    '</div>';});
  var t=tier();
  return h+'</div><button class="btn join-out" data-act="join">Join '+t.name+' · '+t.price+' a month</button>'+
   '<p class="sub" style="margin-top:14px;font-size:11.5px;text-align:center">Unused credits roll over. Pause any month. Cancel in two taps.</p>';}

/* ---------------------------------------------------------------- discover */
function filtered(){var q=S.q.toLowerCase().trim();
  return EVENTS.filter(function(e){var ok=true;
    if(S.chip==='tonight')ok=/Tonight/i.test(e.meta);else if(S.chip==='weekend')ok=/Sat|Sun/i.test(e.meta);
    else if(S.chip==='cheap')ok=e.cr<20;else if(S.chip!=='all')ok=e.cat===S.chip;
    var okQ=!q||(e.title+' '+e.cat+' '+e.meta+' '+e.tag+' '+e.blurb).toLowerCase().indexOf(q)>-1;
    return ok&&okQ;});}
function gridCols(){var w=window.innerWidth;return w>=1360?4:w>=960?3:2;}
function tileHtml(e,i){
  return '<button class="vt'+(i%3===0?' tall':'')+(e.partner?' newp':'')+'" data-act="open" data-v="'+e.id+'" style="--cat:'+(CAT[e.cat]||PINK)+'" aria-label="'+esc(e.title)+', '+e.cr+' credits">'+
    '<span class="vart'+(e.myst?' myst':'')+'">'+(e.myst?'<span class="vq" aria-hidden="true">???</span>':clip(e)+'<span class="vshape"></span>')+
      '<span class="vprog"><i style="animation-delay:-'+(i*1.3)+'s"></i></span>'+
      '<span class="scrim tl">'+esc(e.myst?'Surprise':e.cat)+'</span><span class="scrim tr">'+e.cr+' cr</span>'+
      (e.partner?'<span class="scrim bl">'+e.left+' left</span>':(e.myst?'<span class="scrim bl">'+esc(e.tag)+'</span>':''))+
    '</span><span class="vcap"><span class="vtitle">'+esc(e.title)+'</span><span class="vmeta">'+esc(when(e))+' · '+esc(venue(e))+'</span></span></button>';}
function discoverResults(){var list=filtered();
  var head='<div class="dviewrow"><p class="lab" id="dcount">'+list.length+(list.length===1?' event':' events')+(S.dview==='map'?' on the map':'')+'</p>'+
    '<div class="segctl" role="group" aria-label="View" style="width:auto"><button class="'+(S.dview!=='map'?'on':'')+'" data-act="dview" data-v="list" aria-pressed="'+(S.dview!=='map')+'">List</button>'+
    '<button class="'+(S.dview==='map'?'on':'')+'" data-act="dview" data-v="map" aria-pressed="'+(S.dview==='map')+'">Map</button></div></div>';
  if(S.dview==='map')return head+mapView(list);
  if(!list.length)return head+'<div class="empty"><p class="fr">Nothing matches that yet.</p><p class="sub" style="margin-top:6px">Try “sport”, “art” or “workshop”.</p></div>';
  var n=gridCols(),cols=[];for(var c=0;c<n;c++)cols.push('');
  list.forEach(function(e,i){cols[i%n]+=tileHtml(e,i);});
  return head+'<div class="vgrid">'+cols.map(function(x){return '<div class="vcol">'+x+'</div>';}).join('')+'</div>';}
function chipSelect(){var GROUPS=[['',['all']],['When',['tonight','weekend']],['Category',['Sports','Art','Outdoors','Theatre','Comedy','Food','Music']],['More',['Surprise','cheap']]],h='';
  GROUPS.forEach(function(g){var o='';CHIPS.forEach(function(c){if(g[1].indexOf(c.k)>-1)o+='<option value="'+c.k+'"'+(S.chip===c.k?' selected':'')+'>'+c.l+'</option>';});h+=g[0]?'<optgroup label="'+g[0]+'">'+o+'</optgroup>':o;});
  return '<div class="dsel"><select id="chipsel" aria-label="Show events">'+h+'</select>'+ico('down',18)+'</div>';}
function scrDiscover(){
  return '<div class="dhead"><div><p class="lab">Wednesday, Hackney</p><h1 class="t" style="margin-top:6px">Alright Maya — what are we doing?</h1></div>'+
      '<div class="crnum"><b>'+bal()+'</b><p class="lab">credits</p></div></div>'+
    '<div class="dtools"><label class="search">'+ico('search',18)+'<span class="sr">Search</span>'+
      '<input id="q" type="search" placeholder="Search London — sport, art, tonight…" value="'+esc(S.q)+'" data-act="q" autocomplete="off"></label>'+chipSelect()+'</div>'+
    '<div id="dres">'+discoverResults()+'</div>';}

/* simulated London map: equirectangular box, lon -0.16..0.045, lat 51.478..51.612; venue positions approximate */
var MAPBOX={w:-0.16,e:0.045,s:51.478,n:51.612,vw:353,vh:370};
var MAPPOS={mystery:[-0.0875,51.5257],amapiano:[-0.0755,51.3745],lionesses:[0.237,51.443],o2climb:[0.003,51.503],skating:[-0.130,51.594],
  magic:[-0.142,51.518],salsa:[-0.105,51.522],knock2bag:[-0.052,51.546],karting:[-0.066,51.604],quilt:[-0.072,51.535],cooking:[-0.083,51.498],
  qbtalk:[-0.123,51.534],terrarium:[-0.024,51.543],manon:[-0.122,51.513],tatetour:[-0.099,51.508],pe_eprix:[0.029,51.508]};
var MAPEDGE={amapiano:['Croydon ↓',58,93],lionesses:['Dartford →',90,93]};
function mapXY(ll){var b=MAPBOX;return [(ll[0]-b.w)/(b.e-b.w)*100,(b.n-ll[1])/(b.n-b.s)*100];}
function mapPath(pts){var b=MAPBOX,d='';for(var i=0;i<pts.length;i++){var p=mapXY(pts[i]);d+=(i?' L':'M')+(p[0]*b.vw/100).toFixed(1)+' '+(p[1]*b.vh/100).toFixed(1);}return d;}
function mapBase(list){var b=MAPBOX,s='',i;
  function el(ll,rx,ry){var p=mapXY(ll);return '<ellipse cx="'+(p[0]*b.vw/100).toFixed(1)+'" cy="'+(p[1]*b.vh/100).toFixed(1)+'" rx="'+rx+'" ry="'+ry+'"/>';}
  function lab(ll,txt,anchor){var p=mapXY(ll);return '<text x="'+(p[0]*b.vw/100).toFixed(1)+'" y="'+(p[1]*b.vh/100).toFixed(1)+'" text-anchor="'+(anchor||'middle')+'">'+txt+'</text>';}
  s+='<rect width="'+b.vw+'" height="'+b.vh+'" fill="#EDE5D6"/>';
  s+='<g fill="#DDF0E5" stroke="#3FB57A" stroke-width="1">'+el([-0.160,51.507],24,11)+el([-0.155,51.528],14,10)+el([-0.165,51.563],20,14)+el([-0.040,51.536],15,8)+el([0.000,51.477],14,9)+el([-0.016,51.546],10,12)+el([-0.130,51.592],16,8)+'</g>';
  s+='<g fill="none" stroke="#E0D6C4" stroke-width="1.5" stroke-linecap="round">'+
     '<path d="'+mapPath([[-0.20,51.555],[-0.13,51.533],[-0.08,51.530],[-0.02,51.548],[0.07,51.560]])+'"/>'+
     '<path d="'+mapPath([[-0.12,51.62],[-0.115,51.56],[-0.11,51.513],[-0.10,51.47]])+'"/>'+
     '<path d="'+mapPath([[-0.066,51.62],[-0.072,51.56],[-0.085,51.515],[-0.075,51.47]])+'"/>'+
     '<path d="'+mapPath([[-0.20,51.50],[-0.14,51.512],[-0.08,51.515],[0.07,51.512]])+'"/></g>';
  s+='<path d="'+mapPath([[-0.20,51.468],[-0.175,51.478],[-0.15,51.482],[-0.125,51.497],[-0.120,51.508],[-0.100,51.509],[-0.078,51.507],[-0.055,51.502],[-0.035,51.497],[-0.020,51.488],[-0.008,51.492],[-0.002,51.505],[0.010,51.507],[0.025,51.501],[0.040,51.498],[0.070,51.503]])+'" fill="none" stroke="#9CC3DE" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>';
  var z=mapXY([-0.105,51.513]);s+='<circle cx="'+(z[0]*b.vw/100).toFixed(1)+'" cy="'+(z[1]*b.vh/100).toFixed(1)+'" r="92" fill="none" stroke="#17130F" stroke-opacity=".35" stroke-width="1"/>';
  for(i=0;i<list.length;i++)if(list[i].myst&&MAPPOS[list[i].id]){var m=mapXY(MAPPOS[list[i].id]);
    s+='<circle cx="'+(m[0]*b.vw/100).toFixed(1)+'" cy="'+(m[1]*b.vh/100).toFixed(1)+'" r="24" fill="#FF4FA3" fill-opacity=".22" stroke="#17130F" stroke-width="1"/>';}
  s+='<g font-family="Space Mono, Courier New, monospace" font-size="8" letter-spacing=".08em" fill="#665F55">'+
     lab([-0.105,51.4995],'ZONE 1')+lab([-0.125,51.4875],'THE THAMES','end')+lab([-0.040,51.552],'HACKNEY')+lab([-0.142,51.545],'CAMDEN')+lab([-0.060,51.592],'TOTTENHAM')+lab([0.000,51.484],'GREENWICH')+lab([-0.150,51.497],'HYDE PARK')+'</g>';
  return '<svg viewBox="0 0 '+b.vw+' '+b.vh+'" aria-hidden="true">'+s+'</svg>';}
function mapView(list){
  var pins='',sel=null,i;
  for(i=0;i<list.length;i++)if(list[i].id===S.mapSel)sel=list[i];
  if(!sel&&list.length)sel=list[0];
  for(i=0;i<list.length;i++){var e=list[i],ll=MAPPOS[e.id]||[-0.11,51.515],p=mapXY(ll),ed=MAPEDGE[e.id];
    var x=ed?ed[1]:Math.max(6,Math.min(94,p[0])),y=ed?ed[2]:Math.max(12,Math.min(90,p[1]));
    var dark=['Sports','Sport','Theatre','Comedy','Surprise'].indexOf(e.cat)>-1&&!e.myst;
    pins+='<button class="mpin'+(dark?' lt':'')+(e.myst?' myst':'')+(e.partner?' newp':'')+(sel&&sel.id===e.id?' on':'')+'" data-act="mpin" data-v="'+e.id+'" '+
      'style="left:'+x.toFixed(1)+'%;top:'+y.toFixed(1)+'%;--cat:'+(CAT[e.cat]||PINK)+'" aria-label="'+esc(e.title)+', '+e.cr+' credits">'+
      '<span class="hd">'+e.cr+'</span><span class="tl"></span>'+(ed?'<span class="el">'+ed[0]+'</span>':'')+'</button>';}
  var you=mapXY([-0.045,51.537]),card;
  if(sel)card='<div class="mapcard'+(sel.myst?' myst':'')+'" style="--cat:'+(CAT[sel.cat]||PINK)+'"><span class="sw"></span><div class="bd">'+
      '<p class="lab">'+esc(sel.myst?'Surprise · exact spot sent on the day':sel.cat)+'</p><p class="nm">'+esc(sel.title)+'</p>'+
      '<p class="mt">'+esc(when(sel))+' · '+esc(venue(sel))+' · '+sel.cr+' cr</p>'+
      '<button class="btn" style="margin-top:10px" data-act="open" data-v="'+sel.id+'">See the event</button></div></div>';
  else card='<p class="sub" style="padding:16px 0">Nothing on the map for that. Try another filter.</p>';
  return '<div class="mapwrap"><div class="dmap" role="group" aria-label="Map of events">'+mapBase(list)+
    '<span class="mapyou" style="left:'+you[0].toFixed(1)+'%;top:'+you[1].toFixed(1)+'%"><i></i><b>You</b></span>'+pins+'</div>'+card+'</div>';}

/* ---------------------------------------------------------------- event and booking */
function scrEvent(){
  var e=byId(S.eventId),c=CAT[e.cat]||PINK;
  var plan=(e.plan||[]).map(function(x){return '<div><span>'+x[0]+'</span><p class="sub" style="flex:1">'+esc(x[1])+'</p></div>';}).join('');
  var side=e.partner?'<div><p style="font:700 14px/1.2 var(--font-sans);color:var(--green)">'+e.left+' member seats left</p><p class="lab" style="margin-top:4px">members-only allocation</p></div>':
    (e.rrp&&e.rrp!=='—'?'<div><p style="font:800 22px/1 var(--font-display);color:var(--mut);text-decoration:line-through">'+e.rrp+'</p><p class="lab" style="margin-top:4px">public price</p></div>':
    (e.wave?'<div><p style="font:700 13px/1.2 var(--font-mono)">Wave '+e.wave+' partner</p><p class="lab" style="margin-top:4px">member allocation</p></div>':''));
  var avail=!e.partner||e.live;
  return '<div class="evgrid"><div class="evmedia">'+
    '<div class="vart hero'+(e.myst?' myst':'')+'" style="--cat:'+c+'">'+(e.myst?'<span class="vq" aria-hidden="true">???</span>':clip(e)+'<span class="vshape"></span>')+
      '<button class="scrim tl backbtn" data-act="go" data-v="discover" aria-label="Back to Discover">← Back</button>'+
      '<span class="scrim bl">'+esc(e.myst?'Surprise':e.cat)+' · '+esc(e.tag)+'</span></div></div>'+
   '<div class="evbody"><p class="lab" style="margin-top:4px">'+esc(e.meta)+'</p><h1 class="evname">'+esc(e.title)+'</h1>'+
    '<div class="prices"><div><p class="big">'+e.cr+'</p><p class="lab" style="margin-top:4px">credits · member price</p></div>'+side+'</div>'+
    (e.partner?'<div class="nudge" style="margin-top:16px"><p class="sub" style="font-size:12.5px;color:var(--ink)"><b>Straight from '+PARTNER.name+'.</b> Grandstand seats released to members only. Your stub scans at the gates.</p></div>':'')+
    '<p class="sub" style="margin-top:16px;font-size:14px">'+esc(e.blurb)+'</p>'+
    '<div class="whycard" style="margin-top:16px;--cat:'+c+'"><p class="lab" style="color:var(--ink)">Why you are seeing this</p><p class="sub" style="margin-top:7px;color:var(--ink)">'+esc(e.why)+'</p></div>'+
    '<p class="lab" style="margin-top:20px">The night, roughly</p><div class="plan">'+plan+'</div>'+
    '<div class="sticky-cta"><div class="duo"><button class="btn ghost" data-act="go" data-v="group">Plan together</button>'+
      '<button class="btn" data-act="go" data-v="checkout"'+(avail?'':' disabled')+'>'+(avail?'Use '+e.cr+' credits':'Not on sale')+'</button></div></div>'+
   '</div></div>';}
function scrCheckout(){
  var e=byId(S.eventId),b=bal(),over=Math.max(0,e.cr-b);
  return '<div class="obar"><button class="backb" data-act="go" data-v="event">'+ico('back',20)+'Event</button></div>'+
   '<h1 class="t">Confirm</h1>'+
   '<div class="card" style="margin-top:14px">'+
     '<div style="display:flex;gap:12px;align-items:center"><span class="vart thumb" style="--cat:'+(CAT[e.cat]||PINK)+';height:56px">'+(e.myst?'':clip(e))+'</span>'+
     '<div style="flex:1;min-width:0"><p style="font:italic 400 19px/1.2 var(--font-serif)">'+esc(e.title)+'</p><p class="sub" style="font-size:11.5px;margin-top:2px">'+esc(e.meta)+'</p></div></div>'+
     '<hr class="hair" style="margin:14px 0">'+
     '<div class="row-b"><p class="sub">You · '+tier().name+'</p><p class="mono" style="font-size:12px">'+e.cr+' cr</p></div>'+
     '<div class="row-b" style="margin-top:8px"><p class="sub">Jonah · free monthly plus-one</p><p class="mono" style="font-size:12px;color:var(--green)">'+(S.plusOne?'0 cr':'—')+'</p></div>'+
     '<button class="chip'+(S.plusOne?' on':'')+'" style="margin-top:12px" data-act="plusone" aria-pressed="'+S.plusOne+'">'+(S.plusOne?'Plus-one added':'Add plus-one')+'</button></div>'+
   '<p class="lab" style="margin-top:20px">Paying with</p>'+
   '<div class="card" style="margin-top:8px;display:flex;align-items:center;gap:12px">'+
     '<div aria-hidden="true" style="width:36px;height:36px;flex:none;border-radius:8px;border:1.5px solid var(--ink);display:flex;align-items:center;justify-content:center;font:700 11px/1 var(--font-mono)">'+(over?'£':'CR')+'</div>'+
     '<div><p style="font-weight:700;font-size:13.5px">'+(over?'Card ending 4417':'Your credits')+'</p>'+
     '<p class="sub" style="font-size:11.5px">'+(over?('Credits cover '+Math.min(b,e.cr)+' cr; '+over+' cr topped up at £1.15'):'Credits only, nothing to pay tonight')+'</p></div></div>'+
   '<div class="row-b" style="margin-top:20px"><p class="lab">Total tonight</p><p style="font:800 24px/1 var(--font-display)">'+(over?gbp(over*1.15):e.cr+' credits')+'</p></div>'+
   '<button class="btn" style="margin-top:16px" data-act="confirm">Confirm booking</button>'+
   '<p class="sub" style="margin-top:12px;font-size:11px;text-align:center">Free cancellation up to 24 hours before — credits return in full. No booking fee, ever.</p>';}
function serialFor(id){var i=S.stack.indexOf(id);return '00'+(413+(i<0?0:i));}
function scrStub(){var e=byId(S.eventId);
  return '<p class="lab" style="color:var(--green);margin-top:8px">You are going</p>'+
   '<h1 class="t" style="margin-top:10px">'+(S.plusOne?'Two of you. Sorted.':'Sorted.')+'</h1>'+
   '<div style="margin-top:20px;transform:rotate(-1.4deg);cursor:pointer" data-act="ticket" data-v="'+e.id+'">'+stubHtml(e,serialFor(e.id))+'</div>'+
   '<p class="sub" style="margin-top:18px">This is your ticket. Screenshot it, or find it under Upcoming in your Stack. Entry, meeting point and the way home travel with the stub.</p>'+
   '<div class="card" style="margin-top:16px"><div class="row-b"><p class="sub">Admits</p><p class="mono" style="font-size:12px">'+(S.plusOne?'2 people':'1 person')+'</p></div>'+
     '<div class="row-b" style="margin-top:8px"><p class="sub">Paid with</p><p class="mono" style="font-size:12px">Credits</p></div></div>'+
   '<div class="duo" style="margin-top:18px"><button class="btn ghost" data-act="share">Share the plan</button><button class="btn" data-act="go" data-v="stack">Add to the Stack</button></div>';}

/* QR code (version 2, byte mode, error correction M), drawn on the phone so it works with no signal */
function qrMatrix(text){
  var SIZE=25,DCW=28,ECW=16,i,j,x,y;
  var s=unescape(encodeURIComponent(text)),bytes=[];for(i=0;i<s.length&&i<26;i++)bytes.push(s.charCodeAt(i)&255);
  var bits=[];function put(v,n){for(var k=n-1;k>=0;k--)bits.push((v>>>k)&1);}
  put(4,4);put(bytes.length,8);for(i=0;i<bytes.length;i++)put(bytes[i],8);
  put(0,Math.min(4,DCW*8-bits.length));while(bits.length%8)bits.push(0);
  var data=[];for(i=0;i<bits.length;i+=8){var b=0;for(j=0;j<8;j++)b=(b<<1)|bits[i+j];data.push(b);}
  for(var pd=0xEC;data.length<DCW;pd^=0xEC^0x11)data.push(pd);
  function mul(a,b){var z=0;for(var k=7;k>=0;k--){z=(z<<1)^((z>>>7)*0x11D);z^=((b>>>k)&1)*a;}return z;}
  var dv=[];for(i=0;i<ECW-1;i++)dv.push(0);dv.push(1);var root=1;
  for(i=0;i<ECW;i++){for(j=0;j<ECW;j++){dv[j]=mul(dv[j],root);if(j+1<ECW)dv[j]^=dv[j+1];}root=mul(root,2);}
  var rem=[];for(i=0;i<ECW;i++)rem.push(0);
  for(i=0;i<data.length;i++){var f=data[i]^rem.shift();rem.push(0);for(j=0;j<ECW;j++)rem[j]^=mul(dv[j],f);}
  var cw=data.concat(rem),M=[],F=[];
  for(y=0;y<SIZE;y++){M.push([]);F.push([]);for(x=0;x<SIZE;x++){M[y].push(false);F[y].push(false);}}
  function set(x,y,d){M[y][x]=d;F[y][x]=true;}
  for(i=0;i<SIZE;i++){set(6,i,i%2===0);set(i,6,i%2===0);}
  function finder(cx,cy){for(var dy=-4;dy<=4;dy++)for(var dx=-4;dx<=4;dx++){var d=Math.max(Math.abs(dx),Math.abs(dy)),xx=cx+dx,yy=cy+dy;
    if(xx>=0&&xx<SIZE&&yy>=0&&yy<SIZE)set(xx,yy,d!==2&&d!==4);}}
  finder(3,3);finder(SIZE-4,3);finder(3,SIZE-4);
  for(var ay=-2;ay<=2;ay++)for(var ax=-2;ax<=2;ax++)set(18+ax,18+ay,Math.max(Math.abs(ax),Math.abs(ay))!==1);
  function fmt(mask){var d=mask,r=d;for(var k=0;k<10;k++)r=(r<<1)^((r>>>9)*0x537);var fb=((d<<10)|r)^0x5412;
    function g(k){return ((fb>>>k)&1)!==0;}
    for(k=0;k<=5;k++)set(8,k,g(k));set(8,7,g(6));set(8,8,g(7));set(7,8,g(8));for(k=9;k<15;k++)set(14-k,8,g(k));
    for(k=0;k<8;k++)set(SIZE-1-k,8,g(k));for(k=8;k<15;k++)set(8,SIZE-15+k,g(k));set(8,SIZE-8,true);}
  fmt(0);
  var n=0;
  for(var right=SIZE-1;right>=1;right-=2){if(right===6)right=5;
    for(var vert=0;vert<SIZE;vert++)for(j=0;j<2;j++){x=right-j;var up=((right+1)&2)===0;y=up?SIZE-1-vert:vert;
      if(!F[y][x]&&n<cw.length*8){M[y][x]=((cw[n>>>3]>>>(7-(n&7)))&1)!==0;n++;}}}
  function mk(m,x,y){switch(m){case 0:return (x+y)%2===0;case 1:return y%2===0;case 2:return x%3===0;case 3:return (x+y)%3===0;
    case 4:return (Math.floor(x/3)+Math.floor(y/2))%2===0;case 5:return x*y%2+x*y%3===0;case 6:return (x*y%2+x*y%3)%2===0;default:return ((x+y)%2+x*y%3)%2===0;}}
  function apply(m){for(var yy=0;yy<SIZE;yy++)for(var xx=0;xx<SIZE;xx++)if(!F[yy][xx]&&mk(m,xx,yy))M[yy][xx]=!M[yy][xx];}
  var P1=[true,false,true,true,true,false,true,false,false,false,false],P2=P1.slice().reverse();
  function score(){var p=0,dark=0,a,b,run;
    for(var pass=0;pass<2;pass++)for(a=0;a<SIZE;a++){run=1;
      for(b=1;b<SIZE;b++){var c=pass?M[b][a]:M[a][b],pr=pass?M[b-1][a]:M[a][b-1];if(c===pr)run++;else{if(run>=5)p+=run-2;run=1;}}
      if(run>=5)p+=run-2;
      for(b=0;b+11<=SIZE;b++){var m1=true,m2=true;for(var q=0;q<11;q++){var v=pass?M[b+q][a]:M[a][b+q];if(v!==P1[q])m1=false;if(v!==P2[q])m2=false;}if(m1)p+=40;if(m2)p+=40;}}
    for(a=0;a<SIZE-1;a++)for(b=0;b<SIZE-1;b++){var c0=M[a][b];if(c0===M[a][b+1]&&c0===M[a+1][b]&&c0===M[a+1][b+1])p+=3;}
    for(a=0;a<SIZE;a++)for(b=0;b<SIZE;b++)if(M[a][b])dark++;
    p+=Math.floor(Math.abs(dark*100/(SIZE*SIZE)-50)/5)*10;return p;}
  var best=0,min=1e9;
  for(var m=0;m<8;m++){apply(m);fmt(m);var sc=score();if(sc<min){min=sc;best=m;}apply(m);}
  apply(best);fmt(best);return M;}
function qrSvg(text){var M=qrMatrix(text),n=M.length,q=4,s=n+2*q,d='';
  for(var y=0;y<n;y++)for(var x=0;x<n;x++)if(M[y][x])d+='M'+(x+q)+' '+(y+q)+'h1v1h-1z';
  return '<svg class="qr" viewBox="0 0 '+s+' '+s+'" role="img" aria-label="Ticket QR code" shape-rendering="crispEdges"><rect width="'+s+'" height="'+s+'" fill="#FFFDF8"/><path d="'+d+'" fill="#17130F"/></svg>';}

function scrTicket(){
  var id=S.ticketId||S.stack[S.stack.length-1]||'lionesses',e=byId(id);
  var n=serialFor(e.id),adm=S.plusOne?2:1,code='ENC-'+n+'-'+e.id.slice(0,10).toUpperCase()+'-'+adm;
  var plan=(e.plan||[]).map(function(x){return '<div><span>'+x[0]+'</span><p class="sub" style="flex:1">'+esc(x[1])+'</p></div>';}).join('');
  function kv(k,v){return '<div class="kvrow"><p class="sub">'+k+'</p><p>'+v+'</p></div>';}
  return '<div class="obar"><button class="backb" data-act="go" data-v="stack" aria-label="Back to the Stack">'+ico('back',20)+'Stack</button></div>'+
   '<p class="lab" style="color:var(--green)">Your ticket · confirmed</p>'+
   '<h1 class="t" style="margin-top:8px">Show this at the door.</h1>'+
   '<div class="ticket'+(e.myst?' myst':'')+'" style="--cat:'+(CAT[e.cat]||PINK)+'"><div class="band"></div>'+
     '<p class="eyebrow">Encore · '+esc(e.myst?'Surprise':e.cat)+'</p><h5>'+esc(e.title)+'</h5>'+
     '<p class="meta">'+esc(when(e))+' · '+esc(venue(e))+'</p><div class="tear"></div>'+qrSvg(code)+
     '<p class="serial">№ '+n+' · admits '+adm+'</p></div>'+
   '<p class="sub" style="margin-top:12px;font-size:11.5px;text-align:center">Turn your brightness up at the door. The code is drawn on your phone, so it works with no signal.</p>'+
   '<div class="card" style="margin-top:16px">'+kv('When',esc(when(e)))+kv('Where',esc(venue(e)))+kv('Admits',adm===2?'2 people':'1 person')+kv('Paid with','Credits · '+e.cr+' cr')+'</div>'+
   (plan?'<p class="lab" style="margin-top:20px">The night, roughly</p><div class="plan">'+plan+'</div>':'')+
   '<div class="duo" style="margin-top:18px"><button class="btn ghost" data-act="map">Map</button><button class="btn" data-act="cal">Add to calendar</button></div>'+
   '<button class="btn ghost" style="margin-top:9px" data-act="share">Share the plan</button>';}

/* ---------------------------------------------------------------- stack, group, wallet, profile, status */
function scrStack(){
  var cats={},up=S.stack.length?S.stack.slice():['lionesses'],done=['knock2bag','cooking','tatetour'];
  up.concat(done).forEach(function(id){var c=byId(id).cat;cats[c]=(cats[c]||0)+1;});
  var nxt=byId(up[up.length-1]);
  var upcoming='<div class="stackcard tilt3" data-act="ticket" data-v="'+nxt.id+'" role="button" tabindex="0" style="--cat:'+(CAT[nxt.cat]||PINK)+'">'+
    '<div class="vart'+(nxt.myst?' myst':'')+'" style="height:150px;border-radius:0">'+(nxt.myst?'<span class="vq">???</span>':clip(nxt)+'<span class="vshape"></span>')+
      '<span class="scrim tl">'+up.length+' upcoming</span></div>'+
    '<div style="padding:14px 16px 16px"><p style="font:italic 400 21px/26px var(--font-serif)">'+esc(nxt.title)+'</p>'+
      '<p class="sub" style="font-size:12px;margin-top:3px">'+esc(nxt.meta)+'</p>'+
      '<p class="mono" style="font-size:11px;margin-top:6px;color:var(--green)">№ '+serialFor(nxt.id)+' · admits '+(S.plusOne?'2':'1')+' · '+nxt.cr+' cr</p>'+
      '<div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap"><button class="chip on" data-act="ticket" data-v="'+nxt.id+'">Show ticket</button>'+
      '<button class="chip" data-act="share">＋ Bring a friend</button><button class="chip" data-act="map">Map</button><button class="chip" data-act="cal">Add to calendar</button></div></div></div>';
  var others=up.slice(0,-1).reverse().map(function(id){var e=byId(id);return '<div style="margin-top:10px;cursor:pointer" data-act="ticket" data-v="'+id+'">'+stubHtml(e,serialFor(id))+'</div>';}).join('');
  var past=done.map(function(id,k){return '<div style="margin-top:-4px;transform:rotate('+((k%2?1:-1)*1.3)+'deg)">'+stubHtml(byId(id),'00'+(408+k),'past')+'</div>';}).join('');
  var bars=['Sports','Art','Outdoors','Theatre','Comedy','Food','Music'].map(function(c){var n=cats[c]||0;
    return '<div style="display:flex;align-items:center;gap:10px;margin-top:9px"><p class="sub" style="width:76px;font-size:12px">'+c+'</p>'+
      '<div class="catbar" style="flex:1"><i style="width:'+Math.min(100,n*22)+'%;background:'+(CAT[c]||PINK)+'"></i></div>'+
      '<p class="mono" style="font-size:11px;color:var(--mut);width:22px;text-align:right">'+n+'</p></div>';}).join('');
  return '<div class="row-b" style="align-items:flex-start"><div><p class="lab">Your tickets</p><h1 class="t" style="margin-top:8px">The Stack</h1></div><span class="pill">'+bal()+' credits</span></div>'+
   '<p class="sub" style="margin-top:8px;max-width:620px">Every booking you make lives here: what is coming up, with the practical bits, and the stubs you have already used.</p>'+
   '<div class="cols2" style="margin-top:6px"><div>'+
     '<p class="lab" style="margin-top:18px">Upcoming</p><div style="margin-top:10px">'+upcoming+others+'</div>'+
     '<p class="lab" style="margin-top:24px">Past stubs · '+done.length+'</p><div style="margin-top:12px;display:flex;flex-direction:column;gap:6px">'+past+'</div></div>'+
   '<div><p class="lab" style="margin-top:18px">What you have tried</p>'+bars+
     '<div class="nudge tilt2" style="margin-top:18px"><p class="sub" style="color:var(--ink)"><b>Nothing outdoors in the Stack yet.</b> Up at The O2 has a rooftop climb on Saturday at 35 credits — shall I hold two?</p>'+
     '<button class="chip" style="margin-top:10px" data-act="open" data-v="o2climb">See the climb</button></div>'+
     '<button class="btn ghost" style="margin-top:16px" data-act="go" data-v="group">Rally the group instead</button></div></div>';}
function scrGroup(){
  var h=['karting','salsa','magic'].map(function(id){var e=byId(id),v=S.votes[id]||0,mine=S.myVote===id;
    return '<div class="vote'+(mine?' mine':'')+'"><div style="display:flex;gap:12px;align-items:center"><span class="vart" style="width:56px;height:56px;flex:none;border-radius:8px;--cat:'+(CAT[e.cat]||PINK)+'">'+clip(e)+'</span>'+
      '<div style="flex:1;min-width:0"><p style="font:italic 400 19px/24px var(--font-serif)">'+esc(e.title)+'</p><p class="mono" style="font-size:11px;color:var(--mut);margin-top:2px">'+esc(e.meta)+' · '+e.cr+' cr</p></div>'+
      '<p style="font:800 22px/1 var(--font-display)" aria-label="'+v+' votes">'+v+'</p></div>'+
      '<button class="chip'+(mine?' on':'')+'" style="margin-top:10px" data-act="vote" data-v="'+id+'" aria-pressed="'+mine+'">'+(mine?'Your vote':'I\'m in for this')+'</button></div>';}).join('');
  return '<p class="lab">Saturday 14th · The Usual Idiots</p><h1 class="t" style="margin-top:8px">Three ideas. Five of you.</h1>'+
   '<p class="sub" style="margin-top:10px">Votes close Thursday at 18:00. Credits leave nobody\'s balance until the plan locks — which is why groups actually commit.</p>'+h+
   '<button class="btn'+(S.locked?' ghost':'')+'" style="margin-top:16px" data-act="lock"'+(S.myVote||S.locked?'':' disabled')+'>'+(S.locked?'Locked — everyone notified':(S.myVote?'Lock it in':'Vote to lock it in'))+'</button>'+
   '<p class="sub" style="margin-top:12px;font-size:11px">Non-members pay your member price as a plus-one. They do not need Encore to come out.</p>';}
var TOPS=[['10','£14','£1.40 a credit'],['25','£32','£1.28 a credit'],['60','£69','£1.15 a credit'],['150','£159','£1.06 a credit · best rate']];
function scrWallet(){
  var t=tier(),nextT=null;for(var i=0;i<TIERS.length-1;i++)if(TIERS[i].k===S.plan)nextT=TIERS[i+1];
  var tops=TOPS.map(function(x,i){return '<div class="up'+(S.topUp===i?' on':'')+'"><div><b>'+x[0]+' credits</b><small>'+x[2]+' · '+x[1]+'</small></div>'+
    '<button class="buy" data-act="top" data-v="'+i+'" aria-pressed="'+(S.topUp===i)+'">'+(S.topUp===i?'Selected':'Select')+'</button></div>';}).join('');
  return '<div class="row-b"><h1 class="t">Credits</h1><span class="pill">'+bal()+' credits</span></div>'+
   '<div class="cols2"><div>'+
   '<div class="balcard tilt3"><div class="row-b" style="align-items:flex-end">'+
       '<div><p style="font:800 52px/1 var(--font-display)">'+bal()+'</p><p class="mono" style="font-size:12px;margin-top:4px">of '+t.cr+' this month</p></div>'+
       '<div style="text-align:right"><p class="lab" style="color:var(--ink)">'+t.name.replace('Encore ','')+' · monthly</p><p class="mono" style="font-size:10.5px;margin-top:5px">renews 9 Nov · '+t.rate+'</p></div></div>'+
     '<div style="display:flex;gap:18px;margin-top:14px;padding-top:12px;border-top:1.5px solid rgba(23,19,15,.5)">'+
       '<div><p class="lab" style="color:var(--ink)">Rolled over</p><p style="font-weight:700;font-size:13px;margin-top:3px">18 credits</p></div>'+
       '<div><p class="lab" style="color:var(--ink)">Public value used</p><p style="font-weight:700;font-size:13px;margin-top:3px">£1,240 this year</p></div></div></div>'+
   (nextT?'<p class="lab" style="margin-top:24px">Upgrade</p><p class="sub" style="margin-top:8px">We found a plan that gives you more nights per pound. Move up and secure the better rate from next month.</p>'+
     '<div class="stackcard tilt2" style="margin-top:12px;cursor:default"><p class="mono" style="background:var(--ink);color:var(--paper);font-size:10px;font-weight:700;letter-spacing:.1em;text-align:center;padding:7px">SUGGESTED FOR YOU</p>'+
       '<div style="padding:14px 16px 16px"><div class="row-b"><div><p style="font:800 24px/1 var(--font-display)">'+nextT.cr+' credits</p><p class="mono" style="font-size:11px;color:var(--mut);margin-top:5px">'+nextT.rate+'</p></div>'+
         '<p style="font:800 22px/1 var(--font-display)">'+nextT.price+'<span class="sub" style="font-size:11px">/mo</span></p></div>'+
       '<button class="btn" style="margin-top:12px" data-act="plan" data-v="'+nextT.k+'">Upgrade to '+nextT.name+'</button></div></div>'
     :'<div class="nudge" style="margin-top:18px"><p class="sub" style="color:var(--ink)"><b>You are on Icon</b> — the best rate we do. Top up if you need more this month.</p></div>')+
   '</div><div>'+
   '<p class="lab" style="margin-top:22px">Buy one-time credits</p>'+
   '<p class="sub" style="margin-top:8px;font-size:12.5px">Without changing your monthly plan. Unused credits roll over while you are a member, up to two months\' worth.</p>'+
   '<div style="margin-top:6px">'+tops+'</div>'+
   '<button class="btn" style="margin-top:14px" data-act="buytop">Buy '+TOPS[S.topUp][0]+' credits · '+TOPS[S.topUp][1]+'</button>'+
   '<p class="sub" style="margin-top:12px;font-size:11px">Top-ups are one-off. Nothing recurring is added to your plan.</p></div></div>';}
function scrProfile(){
  var t=tier();
  var rows=[['👤','Account and plan',t.name.replace('Encore ',''),'go','wallet'],['🎟','Tickets · The Stack',(S.stack.length||1)+' upcoming','go','stack'],['♡','Saved','5','saved',''],
            ['🎁','Bring your crew, get 20 credits','','go','group'],['👥','Friends and group plans','3','go','group'],['✦','Status and perks','Insider','go','status'],
            ['⚙','Settings','','settings',''],['↩','Sign out','','signout','']];
  var h=rows.map(function(r){return '<button class="mrow'+(r[3]==='signout'?' danger':'')+'" data-act="'+r[3]+'"'+(r[4]?' data-v="'+r[4]+'"':'')+'><span class="ic" aria-hidden="true">'+r[0]+'</span>'+
    '<span class="tx">'+r[1]+'</span><span class="ct">'+r[2]+'</span><span class="ch">'+ico('chev',16)+'</span></button>';}).join('');
  return '<div style="text-align:center;margin-top:10px"><div class="avatar">MK</div><h1 class="t" style="margin-top:14px">Maya Kaur</h1>'+
     '<p class="mono" style="font-size:11px;color:var(--mut);margin-top:6px">Insider · member since Sept 2026 · Hackney</p></div>'+
   '<div class="statrow"><div><b>'+bal()+' credits</b><p class="sub" style="font-size:11.5px">Remaining</p></div><div><b>9 Nov</b><p class="sub" style="font-size:11.5px">Cycle renewal</p></div></div>'+
   '<div style="margin-top:6px">'+h+'</div>';}
function scrStatus(){
  var levels=['Explorer','Insider','Headliner','Icon'];
  var h=levels.map(function(l,i){return '<div style="flex:1;text-align:center"><div style="height:6px;border-radius:6px;background:'+(i<=1?'var(--green)':'var(--paper-sunk)')+'"></div>'+
    '<p class="mono" style="font-size:10px;margin-top:7px;color:'+(i<=1?'var(--ink)':'var(--mut)')+'">'+l+'</p></div>';}).join('');
  var perks=[['48-hour early access','On every member-only release','Unlocked',GREENB],['20 bonus credits a month','From Headliner onwards','3 nights away',YEL],
             ['Formula E paddock ballot','Two entries a season, from partner allocations','Headliner',BLUE],['Opening night invitations','West End and Southbank','Icon',PINK]];
  var p=perks.map(function(x,j){return '<div class="card '+['tilt3','tilt2','tilt1','tilt4'][j]+'" style="margin-top:10px;display:flex;gap:12px;align-items:flex-start">'+
    '<div style="width:34px;height:34px;flex:none;border-radius:10px;background:'+x[3]+';transform:rotate(-8deg)"></div>'+
    '<div style="flex:1"><p style="font-weight:700;font-size:13.5px">'+x[0]+'</p><p class="sub" style="font-size:11.5px;margin-top:3px">'+x[1]+'</p></div>'+
    (j===0?'<span class="enbadge">'+x[2]+'</span>':'<p class="mono" style="font-size:10px;color:var(--mut)">'+x[2]+'</p>')+'</div>';}).join('');
  return '<div class="obar"><button class="backb" data-act="go" data-v="profile">'+ico('back',20)+'Profile</button><p class="lab">Status</p></div>'+
   '<h1 class="t">Insider</h1><p class="sub" style="margin-top:8px">62% of the way to Headliner. It is tenure and curiosity, not spend.</p>'+
   '<div style="display:flex;gap:7px;margin-top:16px">'+h+'</div><p class="lab" style="margin-top:22px">Waiting at Headliner</p>'+p;}

/* ---------------------------------------------------------------- navigation */
var NAV=[['discover','Discover','discover'],['stack','Stack','stack'],['group','Group','group'],['wallet','Credits','credits'],['profile','Profile','profile']];
function curTab(){var s=S.screen;return s==='status'?'profile':s==='ticket'?'stack':(s==='event'||s==='checkout'||s==='stub')?'discover':s;}
function renderNav(){var cur=curTab();
  $('tabs').innerHTML=NAV.map(function(n){return '<button data-act="go" data-v="'+n[0]+'" class="'+(cur===n[0]?'on':'')+'"'+(cur===n[0]?' aria-current="page"':'')+'>'+ico(n[2],24)+'<span>'+n[1]+'</span></button>';}).join('');
  $('side').innerHTML='<div class="brand">'+logoMark(72)+'<small>Another one.</small></div>'+
    '<nav aria-label="Encore">'+NAV.map(function(n){return '<button data-act="go" data-v="'+n[0]+'" class="'+(cur===n[0]?'on':'')+'"'+(cur===n[0]?' aria-current="page"':'')+'>'+ico(n[2],20)+n[1]+'</button>';}).join('')+'</nav>'+
    '<div class="foot"><div class="crbox"><p class="lab" style="margin:0 0 8px">Balance</p><b>'+bal()+'</b><p>credits · '+tier().name.replace('Encore ','')+' · renews 9 Nov</p></div>'+
    '<button class="me" data-act="go" data-v="profile"><span class="av">MK</span><span><b>Maya Kaur</b><small>Insider · Hackney</small></span></button></div>';}

var SCREENS={landing:scrLanding,connect:scrConnect,taste:scrTaste,plans:scrPlans,discover:scrDiscover,event:scrEvent,checkout:scrCheckout,stub:scrStub,
  stack:scrStack,ticket:scrTicket,group:scrGroup,wallet:scrWallet,profile:scrProfile,status:scrStatus};
function render(anim){
  syncEvents();
  var scr=$('scr'),fn=SCREENS[S.screen]||scrLanding;
  $('app').className='mapp'+(ONBOARD.indexOf(S.screen)>-1?' nonav':'');
  scr.className='screen '+(WIDTH[S.screen]||'w-mid')+(anim?' enter':'');
  scr.innerHTML=fn();
  renderNav();
  observeVideos();
  document.title=({landing:'Encore',discover:'Discover · Encore',event:byId(S.eventId).title+' · Encore',stack:'The Stack · Encore',wallet:'Credits · Encore',profile:'Profile · Encore'})[S.screen]||'Encore';
  ssave();}
function go(s){S.screen=s;render(true);window.scrollTo(0,0);}
function rerenderKeepScroll(){var y=window.scrollY;render(false);window.scrollTo(0,y);}
var _tt;function toast(t,b){$('toast').innerHTML='<div class="toast" role="status"><b>'+t+'</b>'+(b?'<p>'+b+'</p>':'')+'</div>';clearTimeout(_tt);_tt=setTimeout(function(){$('toast').innerHTML='';},3600);}

/* clips play only while on screen: smooth on phones, and no 15 videos decoding at once */
var _io=null;
function observeVideos(){var vids=document.querySelectorAll('#scr video');
  if(!('IntersectionObserver' in window)){vids.forEach(function(v){v.muted=true;v.play().catch(function(){});});return;}
  if(!_io)_io=new IntersectionObserver(function(es){es.forEach(function(en){var v=en.target;
    if(en.isIntersecting){v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:0.2});
  vids.forEach(function(v){v.muted=true;_io.observe(v);});}

/* ---------------------------------------------------------------- live sync with the Partner app */
var _ps;
function schedulePartnerSync(){clearTimeout(_ps);_ps=setTimeout(partnerSync,180);}
function partnerSync(){
  var before=PE;P=pload();
  if(S.epoch!==epoch())handleReset();
  var after=partnerEventForMember();
  var sb=before?before.sig:'',sa=after?after.sig:'';
  if(sb===sa)return;
  var onboarding=ONBOARD.indexOf(S.screen)>-1;
  if(!before&&after&&!onboarding)toast('New from '+PARTNER.name,esc(after.title)+' · '+after.cr+' credits · '+after.left+' member seats');
  if(before&&!after&&['event','checkout'].indexOf(S.screen)>-1&&S.eventId===before.id){S.screen='discover';toast('No longer on sale',esc(before.title)+' isn\'t available to members right now.');}
  if(S.screen==='discover'&&document.activeElement&&document.activeElement.id==='q'){syncEvents();$('dres').innerHTML=discoverResults();observeVideos();renderNav();return;}
  rerenderKeepScroll();}
function handleReset(){
  S.epoch=epoch();
  if(S.peBook){S.spent=Math.max(0,S.spent-S.peBook.cr);S.peBook=null;}
  S.stack=S.stack.filter(function(id){return String(id).indexOf('pe_')!==0;});
  if(String(S.eventId).indexOf('pe_')===0&&['event','checkout','stub'].indexOf(S.screen)>-1)S.screen='discover';
  if(S.screen==='ticket'&&String(S.ticketId).indexOf('pe_')===0)S.screen='stack';
  if(String(S.eventId).indexOf('pe_')===0)S.eventId='lionesses';
  ssave();}
window.addEventListener('storage',function(e){if(e.key===KEYS.partner||e.key===KEYS.epoch||e.key===null)schedulePartnerSync();});

/* ---------------------------------------------------------------- input */
document.addEventListener('click',function(ev){
  var el=ev.target.closest('[data-act]');if(!el)return;
  var a=el.getAttribute('data-act'),v=el.getAttribute('data-v');
  if(a==='go')go(v);
  else if(a==='signup')go('taste');
  else if(a==='pick'){var i=S.picked.indexOf(v);if(i>-1)S.picked.splice(i,1);else S.picked.push(v);el.classList.toggle('on');el.setAttribute('aria-pressed',i<0);ssave();}
  else if(a==='plan'){S.plan=v;if(S.screen==='wallet'){S.credits=tier().cr;render(false);toast('Upgrade scheduled','You move to '+tier().name+' on 9 Nov. Nothing changes until then.');}else rerenderKeepScroll();}
  else if(a==='join'){S.credits=tier().cr;S.spent=0;go('discover');toast('Welcome to '+tier().name,tier().cr+' credits are in your balance.');}
  else if(a==='open'){S.eventId=v;go('event');}
  else if(a==='ticket'){S.ticketId=v;go('ticket');}
  else if(a==='dview'){S.dview=v;$('dres').innerHTML=discoverResults();observeVideos();ssave();}
  else if(a==='mpin'){S.mapSel=v;$('dres').innerHTML=discoverResults();ssave();}
  else if(a==='plusone'){S.plusOne=!S.plusOne;rerenderKeepScroll();}
  else if(a==='confirm'){var e=byId(S.eventId);
    if(e.partner){P=pload();var pe=partnerEventForMember();if(!pe){go('discover');toast('No longer on sale','These seats were just taken off sale.');return;}e=pe;}
    S.spent=Math.min(S.credits,S.spent+e.cr);if(S.stack.indexOf(e.id)<0)S.stack.push(e.id);
    if(e.partner){var seats=S.plusOne?2:1;S.peBook={id:e.id,cr:e.cr,seats:seats};
      pushInbox({id:'m'+Date.now(),perf:e.perf,seats:seats,cr:e.cr,who:'Maya K. · Hackney',at:nowD().getTime()});}
    go('stub');}
  else if(a==='share')toast('Plan shared','Jonah and Ellis can see the meeting point, doors and the way home.');
  else if(a==='map')toast('Map opened','Doors, the nearest station and the route home, from the stub.');
  else if(a==='cal')toast('Added to calendar','Doors time, with a nudge 90 minutes before.');
  else if(a==='vote'){if(S.locked)return;if(S.myVote)S.votes[S.myVote]=Math.max(0,(S.votes[S.myVote]||1)-1);S.myVote=v;S.votes[v]=(S.votes[v]||0)+1;rerenderKeepScroll();}
  else if(a==='lock'){S.locked=true;rerenderKeepScroll();toast('Plan locked','Credits come out now. Non-members pay your member price as a plus-one.');}
  else if(a==='top'){S.topUp=parseInt(v,10);rerenderKeepScroll();}
  else if(a==='buytop'){var n=parseInt(TOPS[S.topUp][0],10);S.credits+=n;rerenderKeepScroll();toast('Top-up added',n+' credits are in your balance now. One-off — nothing recurring.');}
  else if(a==='saved')toast('Saved','Five events saved. We will nudge you before they sell out.');
  else if(a==='settings')toast('Settings','Notifications, payment and privacy live here.');
  else if(a==='signout'){var keep={epoch:epoch()};S=sdefaults();S.epoch=keep.epoch;go('landing');}
});
document.addEventListener('keydown',function(ev){if((ev.key==='Enter'||ev.key===' ')&&ev.target.matches&&ev.target.matches('[role=button][data-act]')){ev.preventDefault();ev.target.click();}});
document.addEventListener('input',function(ev){var el=ev.target;var a=el.getAttribute&&el.getAttribute('data-act');
  if(a==='radius'){S.radius=parseInt(el.value,10);$('radTxt').textContent=radiusTxt();ssave();}
  else if(a==='q'){S.q=el.value;$('dres').innerHTML=discoverResults();observeVideos();ssave();}});
document.addEventListener('change',function(ev){var el=ev.target;if(el&&el.id==='chipsel'){S.chip=el.value;$('dres').innerHTML=discoverResults();observeVideos();ssave();}});
var _cols=gridCols();
window.addEventListener('resize',function(){var n=gridCols();if(n!==_cols){_cols=n;if(S.screen==='discover'&&S.dview!=='map'){$('dres').innerHTML=discoverResults();observeVideos();}}});

/* ---------------------------------------------------------------- start */
(function(){if(S.epoch!==epoch())handleReset();render(true);})();
