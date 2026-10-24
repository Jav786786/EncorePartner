/* Encore · shared core for the Member app (member.html) and the Partner app (partner.html).
   The two apps are separate pages on the same host. They share one live state through localStorage:
   - the Partner app owns the partner state (KEYS.partner) and writes it on every change;
   - the Member app reads it, and writes its bookings to an inbox (KEYS.inbox) the Partner app ingests;
   - "Reset partner view" bumps KEYS.epoch, which tells the Member app to drop the partner event and its booking.
   Both pages listen to the storage event, so a change in one tab shows up in the other within a moment. */

/* ---------------------------------------------------------------- brand */
var PINK='#FF4FA3', BLUE='#0A70B0', YEL='#F2C418', RED='#F23D0F', GREEN='#1B6E4C', INK='#17130F', GREENB='#3FB57A', THEATRE='#3F384E', SPORTS='#3C8B0B';
var CAT={Art:YEL,Music:PINK,Food:RED,Comedy:THEATRE,Theatre:THEATRE,Fashion:YEL,Sport:SPORTS,Sports:SPORTS,Outdoors:GREENB,Wellness:GREENB,Surprise:BLUE};
var STUBCOL={Art:'art',Music:'music',Food:'food',Comedy:'theatre',Theatre:'theatre',Fashion:'art',Sport:'sports',Sports:'sports',Outdoors:'outdoors',Wellness:'outdoors',Surprise:'surprise'};
var CLIPS=['amapiano','formulae','lionesses','o2climb','skating','magic','salsa','knock2bag','karting','quilt','cooking','qbtalk','terrarium','manon','tatetour'];
function clipSrc(vid){return CLIPS.indexOf(vid)>-1?'media/'+vid+'.mp4':'';}
function clipTag(vid,cls){var s=clipSrc(vid);if(!s)return '';
  return '<video class="'+(cls||'clip')+'" src="'+s+'" muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1"></video>';}

function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function pad(n){return (n<10?'0':'')+n;}
var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function gbp(n){return '£'+n.toFixed(2);}
function gbp0(n){return '£'+Math.round(n).toLocaleString('en-GB');}
function gbp2(n){return '£'+n.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});}
function pct(n){return Math.round(n*100)+'%';}

/* line icons, 24px grid, stroke follows currentColor */
var ICO={
  discover:'<circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z"/>',
  stack:'<path d="M4 7.5A1.5 1.5 0 015.5 6h13A1.5 1.5 0 0120 7.5v2.2a2.3 2.3 0 000 4.6v2.2a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 16.5v-2.2a2.3 2.3 0 000-4.6z"/><path d="M14.5 6.5v11" stroke-dasharray="1.6 2"/>',
  group:'<circle cx="9" cy="9" r="3"/><path d="M3.8 19a5.2 5.2 0 0110.4 0"/><circle cx="16.8" cy="9.8" r="2.4"/><path d="M15.6 14.6A4.4 4.4 0 0120.6 19"/>',
  credits:'<circle cx="12" cy="12" r="8.5"/><path d="M14.9 9.3a3.6 3.6 0 100 5.4"/>',
  profile:'<circle cx="12" cy="8.6" r="3.6"/><path d="M5 19.6a7 7 0 0114 0"/>',
  cue:'<path d="M5.4 18.6l1.1-3.1A7.2 7.2 0 1112 19.2a7.2 7.2 0 01-3.3-.8z"/><path d="M9 11.5h6M9 14h3.5"/>',
  sheet:'<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5"/>',
  events:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  stats:'<path d="M5.5 19v-7M12 19V5.5M18.5 19v-9.5"/>',
  payouts:'<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17M7.5 14.5h3.5"/>',
  more:'<circle cx="5.8" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.2" cy="12" r="1.2" fill="currentColor"/>',
  reset:'<path d="M4.8 12a7.2 7.2 0 102.1-5.1"/><path d="M4.8 4.6v3.7h3.7"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
  back:'<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  chev:'<path d="M9.5 6l6 6-6 6"/>',
  down:'<path d="M6 9l6 6 6-6"/>',
  send:'<path d="M12 19V5.5M6 11l6-6 6 6"/>',
  ext:'<path d="M14 5h5v5M19 5l-8 8M17 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V8a1 1 0 011-1h4"/>',
  eye:'<path d="M2.8 12S6.2 5.8 12 5.8 21.2 12 21.2 12 17.8 18.2 12 18.2 2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.8"/>'
};
function ico(k,size){var s=size||22;return '<svg class="ico" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICO[k]||'')+'</svg>';}

/* the overprint mark: Music pink square, Outdoors green square, ENCORE in white */
function logoMark(w){var k=(w||84)/84;function n(v){return (v*k).toFixed(1)+'px';}
  return '<span class="logo" role="img" aria-label="Encore" style="position:relative;display:inline-block;flex:none;width:'+n(84)+';height:'+n(58)+';isolation:isolate">'+
    '<span style="position:absolute;left:'+n(3)+';top:'+n(3)+';width:'+n(55)+';height:'+n(50)+';border-radius:'+n(8)+';background:var(--music);transform:rotate(-14deg);mix-blend-mode:multiply"></span>'+
    '<span style="position:absolute;left:'+n(26)+';top:'+n(13)+';width:'+n(56)+';height:'+n(38)+';border-radius:'+n(7)+';background:var(--outdoors);transform:rotate(-3deg);mix-blend-mode:multiply"></span>'+
    '<span style="position:absolute;left:'+n(14)+';top:'+n(23)+';font:800 '+n(14.5)+'/1 var(--font-display);letter-spacing:-.01em;color:#FFFFFF">ENCORE</span></span>';}

/* ---------------------------------------------------------------- storage */
var KEYS={partner:'encore.partner.v3',inbox:'encore.inbox.v3',epoch:'encore.epoch.v3'};
function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
function readInbox(){try{var a=JSON.parse(lsGet(KEYS.inbox)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
function pushInbox(b){var a=readInbox();a.push(b);lsSet(KEYS.inbox,JSON.stringify(a));}
function epoch(){return lsGet(KEYS.epoch)||'0';}

/* ---------------------------------------------------------------- partner model */
var PARTNER={name:'Formula E',short:'FE',venue:'ExCeL London',area:'Royal Victoria Dock, E16'};
var SHOWS=[
 {id:'eprix',title:'London E-Prix, race day',kind:'Formula E · two races, one weekend',space:'ExCeL London',cap:4000,rrp:0,h:15,m:0,c1:'#3C8B0B',c2:'#3FB57A',vid:'formulae',
  perfs:[{k:'sat',l:'Race 1 · Sat',off:0,sold:62,pull:1.08},{k:'sun',l:'Race 2 · Sun',off:1,sold:71,pull:0.92}],
  tag:'Two races, one weekend',
  blurbs:['Electric single-seaters on a circuit that runs in and around ExCeL London. Pick Saturday or Sunday: each day is its own race.',
          'Silent until they pass you, then very much not. Electric racing in and out of ExCeL. One race a day: pick yours.',
          'Electric single-seater racing at ExCeL London. One race a day.',
          'The London E-Prix, a round of the FIA Formula E World Championship, raced on a circuit inside and around ExCeL London.'],
  why:'You saved last year\'s race weekend, and you book sport most months.',
  plan:[['—','Gates and fan village, times on your stub'],['—','The race'],['—','Podium, then the DLR from Custom House']]}
];
var SEGMENTS=[
 {k:'motor',l:'Motorsport fans',n:6240,d:'Saved or booked racing, karting or motorsport in the last year'},
 {k:'sports',l:'Sports regulars',n:9310,d:'Booked live sport in the last 6 months'},
 {k:'lapsed',l:'Lapsed sport-goers',n:3480,d:'No live sport in 90 days, so the Stack nudge applies'},
 {k:'groups',l:'Group planners',n:4150,d:'Usually book for three or more, so a grandstand row suits them'},
 {k:'new',l:'Never been to an E-Prix',n:12600,d:'Within an hour of ExCeL London, never booked Formula E'}
];
var AREAS=['Newham','Canning Town','Stratford','Greenwich','Hackney','Tower Hamlets','Lewisham','Ilford','Bow','Walthamstow'];
var BLENDED=1.29; /* Encore revenue per redeemed credit at Plus rate */

/* Demo timeline. Today is publish day, three weeks before the race weekend. The app only ever shows relative race timing
   ("in 3 weeks", "1 week before"); the anchor dates below exist to run the clock. */
var DAY=864e5;
var TODAY=new Date(2026,9,24,10,0);   /* Sat 24 Oct 2026 */
var RACE=new Date(2026,10,14,15,0);   /* Race 1, Sat, three weeks later */
var PHASES=[
  {k:'today',l:'Today',s:'Today',long:'Today · publish day',t:TODAY},
  {k:'w2',l:'2 weeks before',s:'2 wks',long:'2 weeks before the race',t:new Date(2026,9,31,18,0)},
  {k:'w1',l:'1 week before',s:'1 wk',long:'1 week before the race',t:new Date(2026,10,7,18,0)},
  {k:'after',l:'After the race',s:'After',long:'After the race weekend',t:new Date(2026,10,16,10,0)}
];
function phase(k){for(var i=0;i<PHASES.length;i++)if(PHASES[i].k===k)return PHASES[i];return PHASES[0];}
function nowD(){return phase(P.clock).t;}
function fmtToday(){return DOW[TODAY.getDay()]+' '+TODAY.getDate()+' '+MON[TODAY.getMonth()];}
function daysTo(d,from){return Math.round(((d.getTime())-(from||nowD()).getTime())/DAY);}
function raceWhen(){var d=(RACE.getTime()-nowD().getTime())/DAY;
  if(d>=10)return 'in '+Math.round(d/7)+' weeks';if(d>=5)return 'next weekend';if(d>=0)return 'this weekend';return 'last weekend';}
var ACTS=[['0','On publish'],['336','2 weeks before'],['168','1 week before'],['72','72h before']];
function actLabel(a){for(var i=0;i<ACTS.length;i++)if(ACTS[i][0]===String(a))return ACTS[i][1];return a+'h before';}

function pdefaults(){return {v:3,view:'agent',sheetTab:'sheet',ops:false,step:0,done:{},chat:[],mid:0,
  published:false,paused:false,clock:'today',member:[],notes:[],unseen:0,started:false,resumeAsk:false,
  cfg:{connector:null,terms:false,show:null,perfs:[],title:'',tag:'',bv:0,blurb:'',why:'',plan:[],
    seats:40,sections:['North grandstand','South grandstand'],alloc:'engine',plusOne:true,
    cr:55,dyn:true,floor:45,showRrp:false,
    act:'0',threshold:true,thr:85,early:true,prioTag:false,tiers:'all',closeH:2,pullback:true,pull:95,
    settle:0.90,latePay:true,noShow:50,payout:'Weekly',approval:false,
    segs:['motor','sports','new'],camp:{drop:true,bring:true,nudge:true,group:true},
    freq:'Daily digest',chan:{console:true,email:true,slack:false,sync:true},alerts:{eighty:true,noshow:true},kpis:['Seats filled','Revenue recovered','New to Formula E']}};}
function pload(){try{var s=lsGet(KEYS.partner);if(s){var o=JSON.parse(s);if(o&&o.v===3){o.typing=false;if(!o.member)o.member=[];return o;}}}catch(e){}return pdefaults();}
var P=pload();
function C(){return P.cfg;}

function show(){for(var i=0;i<SHOWS.length;i++)if(SHOWS[i].id===C().show)return SHOWS[i];return null;}
function perfsSel(){var s=show();if(!s)return [];return s.perfs.filter(function(p){return C().perfs.indexOf(p.k)>-1;});}
function perfLabel(k){var s=show()||SHOWS[0];for(var i=0;i<s.perfs.length;i++)if(s.perfs[i].k===k)return s.perfs[i].l;return k;}
function perfList(){return perfsSel().map(function(p){return p.l;}).join(', ');}
function unsold(p){return Math.round((show()||SHOWS[0]).cap*(1-p.sold/100));}
function perfDate(p){return new Date(RACE.getTime()+p.off*DAY);}
function releaseAt(p){return C().act==='0'?TODAY:new Date(perfDate(p).getTime()-parseInt(C().act,10)*3600e3);}
function closeAt(p){return new Date(perfDate(p).getTime()-C().closeH*3600e3);}
function held(p){var c=C();return (c.threshold&&p.sold>=c.thr)||(c.pullback&&p.sold>=c.pull);}
function releasable(){return perfsSel().filter(function(p){return !held(p);});}
function alloc(){return C().seats*releasable().length;}
function reach(){var n=0;SEGMENTS.forEach(function(s){if(C().segs.indexOf(s.k)>-1)n+=s.n;});return Math.round(n*0.62);}
function fill(cr){var c=C();var f=1/(1+Math.exp((cr-60)/8));f+=c.dyn?0.05:0;f*=(0.82+0.06*Math.min(3,c.segs.length));return Math.max(0.05,Math.min(0.97,f));}
function forecastSeats(){return Math.round(fill(C().cr)*C().seats);}

/* booking curve: a spike from the launch drop, then a build towards race day (share of final demand vs share of the sales window) */
function curve(x){if(x<=0)return 0;if(x>=1)return 1;return Math.min(1,0.25*Math.min(1,x/0.1)+0.75*Math.pow(x,1.6));}
function invCurve(y){var lo=0,hi=1;for(var i=0;i<28;i++){var m=(lo+hi)/2;if(curve(m)<y)lo=m;else hi=m;}return hi;}
function hrand(a,b){var h=Math.imul(a^0x9E3779B9,0x85EBCA6B)^Math.imul((b+0x632BE5AB)|0,0xC2B2AE35);
  h^=h>>>16;h=Math.imul(h,0x85EBCA6B);h^=h>>>13;h=Math.imul(h,0xC2B2AE35);h^=h>>>16;return (h>>>0)/4294967296;}
function windowX(p,t){var rel=releaseAt(p).getTime(),cl=closeAt(p).getTime();if(cl<=rel)return t>=cl?1:0;return Math.max(0,Math.min(1,(t-rel)/(cl-rel)));}
function perfTarget(p,mseats){var c=C();return Math.max(0,Math.min(c.seats-(mseats||0),Math.round(fill(c.cr)*c.seats*p.pull)));}

/* member-app bookings: the ones the Partner app has ingested, plus any still waiting in the inbox */
function memberBookings(){var out=(P.member||[]).slice(),ids={};out.forEach(function(b){ids[b.id]=1;});
  readInbox().forEach(function(b){if(!ids[b.id]){out.push(b);ids[b.id]=1;}});return out;}

/* every booking at the current point on the demo clock. Deterministic: the same settings and clock give the same list,
   and each later point on the clock contains every booking of the earlier one. */
var _bk={key:null,val:[]};
function allBookings(){var c=C(),s=show();if(!s||!P.published)return [];
  var mem=memberBookings();
  var key=JSON.stringify([P.clock,c.seats,c.cr,c.dyn,c.segs,c.perfs,c.act,c.closeH,c.threshold,c.thr,c.pullback,c.pull,mem.map(function(b){return b.id;})]);
  if(_bk.key===key)return _bk.val;
  var t=nowD().getTime(),after=P.clock==='after',list=[],segs=c.segs.length?c.segs:['sports'];
  perfsSel().forEach(function(p){if(held(p))return;var pi=p.k==='sat'?1:2;
    var ms=0;mem.forEach(function(b){if(b.perf===p.k)ms+=b.seats;});
    var T=perfTarget(p,ms),have=Math.round(curve(windowX(p,t))*T),cum=0,i=0;
    var rel=releaseAt(p).getTime(),cl=closeAt(p).getTime();
    while(cum<have&&i<400){var sd=pi*1009+i,n=hrand(sd,1)<.45?2:1;if(cum+n>have)n=have-cum;cum+=n;
      var r=hrand(sd,3);
      list.push({id:'s'+pi+'_'+i,perf:p.k,seats:n,cr:c.cr,src:'sim',who:'Member · '+AREAS[Math.floor(hrand(sd,2)*AREAS.length)],
        newV:hrand(sd,4)<.71,seg:segs[Math.floor(hrand(sd,5)*segs.length)],age:r<.58?'18–34':r<.9?'35–54':'55+',
        at:rel+invCurve(cum/T)*(cl-rel),scanned:after?((i+pi*5)%14!==9):null});i++;}});
  mem.forEach(function(b){list.push({id:b.id,perf:b.perf,seats:b.seats,cr:b.cr,src:'member',who:b.who||'Maya K. · Hackney',newV:true,seg:'sports',age:'18–34',at:b.at||TODAY.getTime(),scanned:after?true:null});});
  list.sort(function(a,b){return a.at-b.at;});
  _bk={key:key,val:list};return list;}
function booked(k){var n=0;allBookings().forEach(function(b){if(b.perf===k)n+=b.seats;});return n;}
function agoLabel(at){var d=nowD().getTime()-at;if(d<3600e3)return 'just now';if(d<DAY)return Math.round(d/3600e3)+'h ago';var n=Math.round(d/DAY);return n+(n===1?' day ago':' days ago');}

function perfState(p){
  if(!P.published)return 'draft';if(P.paused)return 'paused';if(held(p))return 'held';
  var t=nowD();if(t>=perfDate(p))return 'done';if(t>=closeAt(p))return 'closed';if(t<releaseAt(p))return 'sched';
  if(booked(p.k)>=C().seats)return 'full';return 'live';}
function overall(){if(!P.published)return 'draft';if(P.paused)return 'paused';var st=perfsSel().map(perfState);
  if(st.indexOf('live')>-1)return 'live';if(st.indexOf('sched')>-1)return 'sched';if(st.indexOf('full')>-1)return 'full';return 'ended';}

function totals(){var b=0,cr=0,sc=0,ns=0,nv=0,cnt=0,pay=0,scCnt=0,c=C(),after=P.clock==='after';
  allBookings().forEach(function(x){b+=x.seats;cr+=x.seats*x.cr;cnt++;if(x.newV)nv+=x.seats;
    if(after&&x.scanned){sc+=x.seats;scCnt++;pay+=x.seats*x.cr*c.settle;}
    else if(after){ns+=x.seats;pay+=x.seats*x.cr*c.settle*c.noShow/100;}
    else pay+=x.seats*x.cr*c.settle;});
  return {seats:b,credits:cr,scanned:sc,noshow:ns,newV:nv,count:cnt,scannedCount:scCnt,pay:pay};}

/* ---------------------------------------------------------------- what the Member app shows */
function partnerEventForMember(force){
  var s=show();if(!s||!P.published)return null;
  var live=perfsSel().filter(function(p){return perfState(p)==='live';});
  if(!live.length&&!force)return null;
  var use=live.length?live:perfsSel();if(!use.length)return null;
  var c=C(),left=0;use.forEach(function(p){left+=Math.max(0,c.seats-booked(p.k));});
  var when=use.map(function(p){return p.l.split(' · ')[1];}).join(' or ')+', '+raceWhen();
  var e={id:'pe_'+s.id,title:c.title||s.title,cat:'Sports',tag:left<=12?'Last '+left+' member seats':'New · member allocation',
    cr:c.cr,rrp:'—',real:0,meta:PARTNER.venue+' · '+when,
    art:s.c1,prio:c.prioTag?1:0,why:c.why,blurb:c.blurb,plan:c.plan,
    partner:1,left:left,perf:use[0].k,vid:s.vid,showRrp:c.showRrp,live:live.length>0};
  e.sig=JSON.stringify([e.title,e.tag,e.cr,e.meta,e.why,e.blurb,e.left,e.perf,e.live]);
  return e;}
