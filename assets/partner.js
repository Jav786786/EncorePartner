/* Encore Partner app. Cue is a scripted onboarding agent: it reads free text and suggestion chips and builds one event config (P.cfg).
   Every change is saved to localStorage, which the Member app reads live (see core.js). The app always opens on Cue. */

function psave(){try{localStorage.setItem(KEYS.partner,JSON.stringify(P));}catch(e){}}
var STEP_IDS=['hello','show','listing','inventory','pricing','rules','split','audience','reporting','review'];
var SEC={hello:'Partner and connection',show:'Event and race days',listing:'Listing',inventory:'Inventory',pricing:'Pricing',rules:'Go-live and close rules',
         split:'Revenue split',audience:'Audience and campaigns',reporting:'Reporting',review:'Review and publish'};
function stepIdx(id){return STEP_IDS.indexOf(id);}
function curId(){return P.step>=STEP_IDS.length?'live':STEP_IDS[P.step];}
function isWide(){return window.matchMedia('(min-width:1240px)').matches;}

/* ---------------------------------------------------------------- chat engine */
var Q=[],busy=false,lastCount=0,GEN=0;
function say(html,w){Q.push({who:'a',html:html,w:w||null});pump();}
function sys(html){Q.push({who:'s',html:html});pump();}
function userSay(t){P.chat.push({id:++P.mid,who:'u',html:esc(t),fresh:1});psave();renderChat(true);}
function pump(){
  if(busy||!Q.length){if(!busy)renderComposer();return;}
  busy=true;var m=Q.shift(),g=GEN;P.typing=m.who==='a';renderChat(true);renderComposer();
  var delay=m.who==='a'?Math.min(1000,360+m.html.replace(/<[^>]+>/g,'').length*2.6):160;
  if(window._fast)delay=5;
  setTimeout(function(){if(g!==GEN)return;P.typing=false;m.id=++P.mid;m.fresh=1;P.chat.push(m);psave();renderChat(true);renderSheet();renderNav();busy=false;pump();},delay);}
function freezeAll(){P.chat.forEach(function(m){if(m.w&&!m.frozen){try{m.frozen=WIDGETS[m.w]()||' ';}catch(e){m.frozen=' ';}}});}
function renderMsg(m){
  var f=m.fresh?' fresh':'';delete m.fresh;
  if(m.who==='u')return '<div class="msg u'+f+'"><div class="bub">'+m.html+'</div></div>';
  if(m.who==='s')return '<div class="msg sys'+f+'"><div class="bub">'+m.html+'</div></div>';
  var wh='';if(m.w){var w='';try{w=m.frozen?m.frozen:WIDGETS[m.w]();}catch(e){w='';}wh='<div class="w">'+w+'</div>';}
  return '<div class="msg a'+f+(m.frozen?' past':'')+'"><div class="cueav sm" aria-hidden="true"></div><div class="bub">'+m.html+wh+'</div></div>';}
function renderChat(toEnd){
  var log=$('chatlog');if(!log)return;var st=log.scrollTop;
  log.innerHTML=P.chat.map(renderMsg).join('')+(P.typing?'<div class="msg a fresh"><div class="cueav sm" aria-hidden="true"></div><div class="typing" aria-label="Cue is typing"><i></i><i></i><i></i></div></div>':'');
  if(toEnd||P.chat.length!==lastCount){log.scrollTop=log.scrollHeight;requestAnimationFrame(function(){log.scrollTop=log.scrollHeight;});}else log.scrollTop=st;
  lastCount=P.chat.length;renderProgress();observeVideos();}
function refresh(){renderChat(false);renderSheet();renderNav();renderHeads();psave();}
function flash(id){P._flash=id;renderSheet();setTimeout(function(){P._flash=null;renderSheet();},1300);}

/* ---------------------------------------------------------------- widgets */
function tgl(k,on,title,sub,lock){return '<button class="tgl'+(on?' on':'')+'" '+(lock?'disabled':'data-pa="tg" data-k="'+k+'"')+' role="switch" aria-checked="'+on+'"><span class="sw"></span><span><b>'+title+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span></button>';}
function seg(k,opts,cur,multi){var h='<div class="seg">';opts.forEach(function(o){var v=o[0],l=o[1];var on=multi?cur.indexOf(v)>-1:String(cur)===String(v);
  h+='<button class="'+(on?'on':'')+'" data-pa="'+(multi?'mt':'set')+'" data-k="'+k+'" data-v="'+v+'" aria-pressed="'+on+'">'+l+'</button>';});return h+'</div>';}
function row(k,v,cls){return '<div class="wrow"><span>'+k+'</span><span class="v '+(cls||'')+'">'+v+'</span></div>';}
function ops(html){return P.ops?'<div class="opsnote"><b class="h">ENCORE OPS LENS · NOT SHOWN TO PARTNER</b>'+html+'</div>':'';}
function draftEvent(){var s=show()||SHOWS[0],ps=perfsSel(),pe=partnerEventForMember();
  return {vid:s.vid,cr:C().cr,title:C().title||s.title,leftTxt:(pe?pe.left:C().seats*Math.max(1,releasable().length))+' left',
    when:(ps.length?ps.map(function(p){return p.l.split(' · ')[1];}).join(' or '):'Sat or Sun')+', '+raceWhen()};}
function tileHtml(e){
  return '<span class="vt tall" style="display:block;--cat:#3C8B0B;cursor:default"><span class="vart">'+clipTag(e.vid)+'<span class="vshape"></span>'+
    '<span class="vprog"><i></i></span><span class="scrim tl">Sports</span><span class="scrim tr">'+e.cr+' cr</span><span class="scrim bl">'+e.leftTxt+'</span></span>'+
    '<span class="vcap"><span class="vtitle">'+esc(e.title)+'</span><span class="vmeta">'+esc(e.when)+' · '+PARTNER.venue+'</span></span></span>';}

var OUT={
  tile:function(){return '<div class="miniphone"><div class="in">'+tileHtml(draftEvent())+'</div></div>';},
  seats:function(){return C().seats;},
  seatsNote:function(){var n=releasable().length,cap=(show()||SHOWS[0]).cap;return C().seats*n+' seats across '+n+' race day'+(n===1?'':'s')+' · '+(C().seats/cap*100).toFixed(1)+'% of grandstand capacity';},
  cr:function(){return C().cr;},
  crNotes:function(){var c=C(),f=fill(c.cr);return row('You receive per seat used',gbp(c.cr*c.settle),'g')+row('An empty seat earns you','£0.00','r')+
    row('Forecast fill',forecastSeats()+' of '+c.seats+' a race day · '+pct(f),f>.7?'g':'gold')+
    '<div class="meter'+(f<.6?' warn':'')+'"><i style="width:'+pct(f)+'"></i></div>'+
    ops('Encore contribution about <b>'+gbp(c.cr*(BLENDED-c.settle))+'</b> a seat at the blended '+gbp(BLENDED)+'/credit.');},
  settle:function(){return gbp(C().settle);},
  settleNotes:function(){var c=C(),seat=c.cr*c.settle,night=seat*forecastSeats();
    return row('Per seat used ('+c.cr+' credits)',gbp(seat),'g')+row('Forecast per race day',gbp0(night),'g')+row('Forecast for the weekend ('+releasable().length+' race days)',gbp0(night*releasable().length),'g')+
      row('Same seats left empty','£0','r')+(c.settle>0.95?'<div class="opsnote"><b class="h">NEEDS SIGN-OFF</b>Rates above £0.95 go to Encore partnerships for approval, usually the same day. I\'ve flagged it.</div>':'')+
      ops('Contribution per seat <b>'+gbp(c.cr*(BLENDED-c.settle))+'</b>. Rule of thumb from the model: every 15p off the settle rate adds about £5.50 of contribution per member per month.');},
  reach:function(){return reach().toLocaleString('en-GB');}
};
function updateOuts(){var els=document.querySelectorAll('[data-o]');for(var i=0;i<els.length;i++){var k=els[i].getAttribute('data-o');if(OUT[k])els[i].innerHTML=OUT[k]();}observeVideos();}

var WIDGETS={
 connectors:function(){var L=[['Ticketmaster','#17130F'],['AXS','#0A70B0'],['Upload a CSV','#F2C418'],['Type it in','#3F384E']],h='<div class="wcards">';
   L.forEach(function(x){h+='<button class="wcard'+(C().connector===x[0]?' on':'')+'" data-pa="say" data-v="'+x[0]+'"><span class="lg" style="background:'+x[1]+'">'+x[0].slice(0,2).toUpperCase()+'</span><b>'+x[0]+'</b><small>'+(x[0]==='Upload a CSV'?'Race days and grandstand counts, any format':x[0]==='Type it in'?'I will ask a few questions':'Read-only API · about 30 seconds')+'</small></button>';});
   return h+'</div>';},
 terms:function(){return '<div class="wbox">'+row('Joining','Free. No listing or monthly fees')+row('You are paid','A settle rate per credit, only for seats that are used')+
   row('Payouts','Weekly bank transfer, with a statement')+row('Control','You set every seat, rule and price. Pause any time')+row('Price integrity','Members see credits, never a public discount')+'</div>';},
 shows:function(){var h='<div class="wcards">';SHOWS.forEach(function(s){
   var avg=0;s.perfs.forEach(function(p){avg+=p.sold;});avg=Math.round(avg/s.perfs.length);
   h+='<button class="wcard'+(C().show===s.id?' on':'')+'" data-pa="say" data-v="'+s.title+'"><span class="lg" style="background:'+s.c1+'">'+PARTNER.short+'</span><b>'+s.title+'</b><small>'+s.kind+' · '+s.space+'<br>'+s.perfs.length+' race days · in 3 weeks · '+avg+'% sold on average</small><div class="meter'+(avg<75?' warn':'')+'"><i style="width:'+avg+'%"></i></div></button>';});
   return h+'</div>';},
 perfs:function(){var s=show();if(!s)return '';var h='<div class="wcards">';s.perfs.forEach(function(p){var on=C().perfs.indexOf(p.k)>-1;
   h+='<button class="wcard'+(on?' on':'')+'" data-pa="perf" data-v="'+p.k+'" aria-pressed="'+on+'"><b>'+p.l+'</b><small>'+p.sold+'% sold · about '+unsold(p).toLocaleString('en-GB')+' grandstand seats unsold'+(p.sold<80?'<br><span style="color:var(--warning)">✦ Suggested: needs help</span>':'<br>Selling well on its own')+'</small><div class="meter'+(p.sold<80?' warn':'')+'"><i style="width:'+p.sold+'%"></i></div></button>';});
   return h+'</div>';},
 listing:function(){var c=C();
   return '<div class="prevrow"><div data-o="tile">'+OUT.tile()+'</div><div style="flex:1;min-width:220px">'+
   '<p class="lab">Title</p><input class="field serif" data-pi="title" value="'+esc(c.title)+'" aria-label="Title">'+
   '<p class="lab" style="margin-top:12px">What the day feels like</p><textarea class="field" data-pi="blurb" rows="4" aria-label="Description">'+esc(c.blurb)+'</textarea>'+
   '<p class="lab" style="margin-top:12px">Why you are seeing this (personalised per member)</p><textarea class="field" data-pi="why" rows="2" aria-label="Why you are seeing this">'+esc(c.why)+'</textarea>'+
   '<p class="lab" style="margin-top:12px">The day, roughly</p>'+c.plan.map(function(x){return '<p class="sub" style="font-size:12.5px;margin-top:5px"><span class="mono" style="color:var(--ink)">'+x[0]+'</span> &nbsp;'+esc(x[1])+'</p>';}).join('')+
   '</div></div>';},
 inventory:function(){var c=C();
   return '<div class="wbox"><div class="slab"><span class="lab">Seats per race day</span><span class="big" data-o="seats">'+c.seats+'</span></div>'+
   '<input type="range" class="pr" min="10" max="120" step="5" value="'+c.seats+'" data-pi="seats" aria-label="Seats per race day"><p class="hintline" data-o="seatsNote">'+OUT.seatsNote()+'</p>'+
   '<p class="lab" style="margin-top:14px">From which grandstands</p><div style="margin-top:8px">'+seg('sections',[['North grandstand','North grandstand'],['South grandstand','South grandstand'],['East grandstand','East grandstand'],['General admission','General admission']],c.sections,true)+'</div></div>'+
   '<div class="wcards" style="margin-top:8px">'+
   '<button class="wcard'+(c.alloc==='engine'?' on':'')+'" data-pa="set" data-k="alloc" data-v="engine"><b>Empty Seat Engine</b><small>Recommended. Encore only takes seats that are still unsold at release, and hands back any it can\'t fill.</small></button>'+
   '<button class="wcard'+(c.alloc==='fixed'?' on':'')+'" data-pa="set" data-k="alloc" data-v="fixed"><b>Fixed allocation</b><small>Ring-fence seats for Encore now. Simple, but they come off sale in your own ticketing today.</small></button></div>'+
   '<div class="wbox" style="margin-top:8px">'+tgl('plusOne',c.plusOne,'Allow plus-ones','Members can bring a non-member at the member price. Encore pays you for the seat either way.')+'</div>';},
 pricing:function(){var c=C();
   return '<div class="wbox"><div class="slab"><span class="lab">Member price</span><span class="big"><span data-o="cr">'+c.cr+'</span> credits</span></div>'+
   '<input type="range" class="pr" min="30" max="90" step="1" value="'+c.cr+'" data-pi="cr" aria-label="Member price in credits"><div data-o="crNotes">'+OUT.crNotes()+'</div></div>'+
   '<div class="wbox">'+tgl('dyn',c.dyn,'Smart step-down','If a race day is under 50% booked 24 hours before the race, drop 5 credits. Never below '+c.floor+'.')+
   tgl('showRrp',false,'Show my grandstand price, struck through','Available once your grandstand prices sync from your ticketing. Members see credits only.',true)+'</div>';},
 rules:function(){var c=C(),p=releasable()[0]||perfsSel()[0],tl='';
   if(p){var s0=TODAY.getTime(),e0=perfDate(p).getTime()+3600e3,span=e0-s0;function x(d){return Math.max(0,Math.min(100,(d.getTime()-s0)/span*100));}
     var r=releaseAt(p),cl=closeAt(p),dr=perfDate(p),rl=c.act==='0'?'Live on publish':'Live '+actLabel(c.act);
     tl='<div class="timeline"><div class="ln"></div><div class="live" style="left:'+x(r)+'%;width:'+(x(cl)-x(r))+'%"></div>'+
      '<div class="mk up" style="left:0%"><i style="border-color:var(--mut)"></i><span>Today</span></div>'+
      (c.act==='0'?'':'<div class="mk" style="left:'+x(r)+'%"><i style="border-color:var(--green)"></i><span>'+rl+'</span></div>')+
      '<div class="mk up" style="left:'+x(cl)+'%"><i style="border-color:var(--ink)"></i><span>Closes '+c.closeH+'h before</span></div>'+
      '<div class="mk" style="left:'+x(dr)+'%"><i></i><span>Race · in '+daysTo(dr,TODAY)+' days</span></div></div>'+
      '<p class="hintline" style="text-align:center">'+p.l+' as the example · each race day runs on its own clock</p>';}
   return '<div class="wbox"><p class="lab">Go live</p><div style="margin-top:8px">'+seg('act',ACTS,c.act)+'</div>'+
   tgl('threshold',c.threshold,'Only release a race day that is under '+c.thr+'% sold','Race days your own ticketing is already selling never reach Encore.')+
   tgl('early',c.early,'First look for Rock Star and Icon','Higher-tier members see it 12 hours before everyone else.')+
   '<p class="lab" style="margin-top:12px">Who can book</p><div style="margin-top:8px">'+seg('tiers',[['all','All plans'],['plus','Rock Star and Icon only']],c.tiers)+'</div></div>'+
   '<div class="wbox"><p class="lab">Seats come back to you</p>'+tgl('x',true,'When the allocation is filled','The listing closes itself. Always on.',true)+
   '<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b style="font-size:13px">Close before the race</b><div style="margin-top:8px">'+seg('closeH',[['1','1 hour'],['2','2 hours'],['4','4 hours']],c.closeH)+'</div></div>'+
   tgl('pullback',c.pullback,'Pull back if public sales pass '+c.pull+'%','Unbooked member seats return to your own ticketing automatically.')+'</div>'+tl;},
 split:function(){var c=C();
   return '<div class="wbox"><div class="slab"><span class="lab">Settle rate per credit</span><span class="big" style="color:var(--green)" data-o="settle">'+gbp(c.settle)+'</span></div>'+
   '<input type="range" class="pr" min="0.80" max="1.10" step="0.01" value="'+c.settle+'" data-pi="settle" aria-label="Settle rate per credit">'+
   '<div style="margin:6px 0 8px">'+seg('settle',[['0.85','£0.85 deep fill'],['0.9','£0.90 released seats'],['1','£1.00 standard']],c.settle)+'</div><div data-o="settleNotes">'+OUT.settleNotes()+'</div></div>'+
   '<div class="wbox">'+tgl('latePay',c.latePay,'Late cancellations paid in full','If a member cancels inside 24 hours, you are paid as if they came.')+
   '<div style="padding:10px 0;border-bottom:1px solid var(--line)"><b style="font-size:13px">No-shows paid at</b><div style="margin-top:8px">'+seg('noShow',[['0','0%'],['50','50%'],['100','100%']],c.noShow)+'</div></div>'+
   '<div style="padding:10px 0"><b style="font-size:13px">Payouts</b><div style="margin-top:8px">'+seg('payout',[['Weekly','Weekly'],['Fortnightly','Fortnightly'],['Monthly','Monthly']],c.payout)+'</div></div>'+
   '<p class="hintline">Free monthly plus-ones are paid to you at the same rate. Encore funds the perk.</p></div>';},
 audience:function(){var c=C(),h='<div class="wcards">';SEGMENTS.forEach(function(s){var on=c.segs.indexOf(s.k)>-1;
   h+='<button class="wcard'+(on?' on':'')+'" data-pa="mt" data-k="segs" data-v="'+s.k+'" aria-pressed="'+on+'"><b>'+s.l+'</b><small>'+s.n.toLocaleString('en-GB')+' members<br>'+s.d+'</small></button>';});
   return h+'</div><div class="wbox" style="margin-top:8px"><div class="slab"><span class="lab">Unique reach</span><span class="big" data-o="reach">'+OUT.reach()+'</span></div><p class="hintline">Members, de-duplicated. Only members who opted in to recommendations.</p></div>'+
   '<div class="wbox"><p class="lab">Campaign Studio</p>'+tgl('camp.drop',c.camp.drop,'Member drop','A slot in the weekly edit, plus one push to the audience above when it goes live.')+
   tgl('camp.bring',c.camp.bring,'Bring-a-friend','The member\'s free plus-one is highlighted on this event.')+
   tgl('camp.nudge',c.camp.nudge,'Stack nudge','"No live sport in your Stack this season", shown to lapsed sport-goers.')+
   tgl('camp.group',c.camp.group,'Group plans','Offered as an option when friends are voting on a night out.')+'</div>';},
 reporting:function(){var c=C();var K=['Seats filled','Revenue recovered','New to Formula E','Repeat bookers','No-shows','Audience taste mix','Age bands'];
   return '<div class="wbox"><p class="lab">How often</p><div style="margin-top:8px">'+seg('freq',[['Live only','Live only'],['Daily digest','Daily digest'],['Weekly','Weekly']],c.freq)+'</div>'+
   '<p class="lab" style="margin-top:14px">Numbers that matter to you</p><div style="margin-top:8px">'+seg('kpis',K.map(function(k){return [k,k];}),c.kpis,true)+'</div></div>'+
   '<div class="wbox"><p class="lab">Where</p>'+tgl('chan.console',c.chan.console,'Partner app','Live Stats and Payouts pages.')+
   tgl('chan.email',c.chan.email,'Email digest','To your ticketing team.')+tgl('chan.slack',c.chan.slack,'Slack or Teams','Post the digest and alerts to a channel.')+
   tgl('chan.sync',c.chan.sync,'Write sales back to '+(c.connector||'your ticketing'),'Encore bookings appear as their own sales channel, so your reports stay whole.')+'</div>'+
   '<div class="wbox"><p class="lab">Tell me when</p>'+tgl('alerts.eighty',c.alerts.eighty,'A race day is 80% filled','So you can add seats while demand is there.')+
   tgl('alerts.noshow',c.alerts.noshow,'No-shows go above 10%','I will suggest tightening the cancellation window.')+'</div>';},
 mpreview:function(){return '<div class="miniphone"><div class="in">'+tileHtml(draftEvent())+'</div></div>';},
 review:function(){var c=C(),s=show(),ps=perfsSel(),r=releasable();var allocPct=c.seats/s.cap*100;
   var chk=[[true,'Price integrity: '+(c.showRrp?'public price shown struck through (allowed, not recommended)':'credits only, no public discount anywhere')],
     [allocPct<=15,'Allocation is '+allocPct.toFixed(1)+'% of grandstand capacity'+(allocPct<=15?', inside the 15% guideline':', above the 15% guideline')],
     [c.act!=='0'||c.pullback,c.act==='0'?'Goes live on publish, three weeks out'+(c.pullback?'. Pull-back returns seats if your own sales pick up':', with pull-back off, so member seats could cost you full-price sales'):'Goes live '+actLabel(c.act)+' the race, so your full-price buyers come first'],
     [c.settle<=0.95,'Settle '+gbp(c.settle)+'/credit'+(c.settle<=0.95?' is within the standard band':' needs partnerships sign-off (flagged)')],
     [true,'Listing copy passed the brand and accessibility check (clip has captions and alt text)'],
     [true,'Entry: Encore stubs carry a QR code that scans at your existing gates through '+(c.connector||'your system')]];
   if(ps.length>r.length)chk.push([false,(ps.length-r.length)+' selected race day'+(ps.length-r.length>1?'s are':' is')+' already above '+c.thr+'% sold, so '+(ps.length-r.length>1?'they':'it')+' won\'t release unless sales stall']);
   return '<div class="wbox">'+row('Event',esc(c.title)+' · '+s.space)+row('Race days',perfList()+' · in 3 weeks')+row('Allocation',c.seats+' a race day · '+alloc()+' total · '+(c.alloc==='engine'?'Empty Seat Engine':'Fixed'))+
   row('Member price',c.cr+' credits'+(c.dyn?' · smart step-down':''),'gold')+row('Goes live',c.act==='0'?'On publish':actLabel(c.act)+' the race'+(c.threshold?' if under '+c.thr+'% sold':''))+
   row('Closes',c.closeH+'h before the race, when full'+(c.pullback?', or if public sales pass '+c.pull+'%':''))+row('Settle',gbp(c.settle)+' per credit · '+c.payout.toLowerCase()+' payouts','g')+
   row('Audience',reach().toLocaleString('en-GB')+' members · '+Object.keys(c.camp).filter(function(k){return c.camp[k];}).length+' campaigns')+row('Reporting',c.freq+' · '+c.kpis.length+' metrics')+
   row('Forecast','~'+forecastSeats()*r.length+' seats filled · '+gbp0(forecastSeats()*r.length*c.cr*c.settle)+' to you','g')+'</div>'+
   '<div class="wbox checks" style="margin-top:8px">'+chk.map(function(x){return '<p><i class="'+(x[0]?'':'w')+'">'+(x[0]?'✓':'!')+'</i><span>'+x[1]+'</span></p>';}).join('')+'</div>';},
 pulse:function(){var t=totals(),c=C(),a=alloc()||1,after=P.clock==='after';
   var h='<div class="wbox"><p class="lab" style="margin-bottom:4px">'+phase(P.clock).long+'</p>'+row('Seats booked',t.seats+' of '+a+' · '+pct(t.seats/a))+
     (after?row('Scanned at the gates',t.scanned+' seats · '+(t.seats?pct(t.scanned/t.seats):'—')):'')+
     row(after?'To you on the next payout':'To you if every seat scans',gbp0(t.pay),'g')+row('New to Formula E',t.seats?pct(t.newV/t.seats):'—')+'</div><div class="bars">';
   perfsSel().forEach(function(p){var b=booked(p.k);h+='<div class="br"><p>'+p.l+'</p><div class="trk"><i style="width:'+Math.min(100,b/c.seats*100)+'%"></i></div><span class="num">'+(held(p)?'held':b+'/'+c.seats)+'</span></div>';});
   return h+'</div>';}
};

/* ---------------------------------------------------------------- steps */
function agree(t){return /^(yes|yep|yeah|ok|okay|sure|fine|good|great|perfect|lovely|go|next|continue|sounds good|looks (good|great|right|fine)|do it|confirm|agree|agreed|that works|works|done|happy|👍)/i.test(t)||
  (/\b(works|fine|good|great|perfect|fair|happy|spot on|lovely|is right)\b/i.test(t)&&!/\b(not|no|isn't|doesn't)\b/i.test(t));}
var FAQ=[
 [/explain pull.?back|what.*pull.?back/i,function(){return 'If your own sales on a race day pass '+C().pull+'%, any member seats that aren\'t booked yet go straight back to your own ticketing. Members who already booked keep their seats. You never lose a full-price sale to Encore.';}],
 [/stack nudge/i,function(){return 'The Stack is a member\'s ticket wallet. When a lapsed sport-goer opens it, they see one line: "No live sport in the Stack this season. The London E-Prix has grandstand seats at '+C().cr+' credits, shall I hold two?" It converts better than a push because it arrives when they\'re already planning.';}],
 [/empty seat engine|what.*engine/i,function(){return 'The Empty Seat Engine watches your live availability. At the release time you set, it offers members up to your allocation of seats that are still unsold, at a credit price only they see. It closes the moment the allocation fills, and hands seats back if your own sales pick up.';}],
 [/what is encore/i,function(){return 'Encore is a paid membership for going out. Members pay monthly for credits and spend them on gigs, theatre, sport and exhibitions. For you it\'s a private channel: unsold seats go to members who fit, at a credit price only they see, and you\'re paid when they turn up.';}],
 [/how does encore make money|encore make|your cut|margin/i,function(){return 'Members pre-pay for credits. Encore keeps the difference between what a credit earned us and the settle rate we pay you, and only on seats that are actually used. If your seat stays empty, neither of us is paid.'+(P.ops?' <i>(Ops lens: about '+gbp(C().cr*(BLENDED-C().settle))+' a seat at the current settings.)</i>':'');}],
 [/when.*(get )?paid|how.*paid/i,function(){return 'You\'re paid '+C().payout.toLowerCase()+', by bank transfer, for the seats scanned in the period before. The statement lists every race day, scan and no-show, and you can export it as CSV.';}],
 [/credit (worth|value)|what.*a credit/i,function(){return 'Members pay between £1.06 (the biggest credit pack) and £2.00 (Access) per credit, depending on plan or pack. Explorer members are free and buy packs as they go. For you, a credit is worth exactly the settle rate, '+gbp(C().settle)+', paid when the seat is used.';}]
];
function faq(t){for(var i=0;i<FAQ.length;i++){if(FAQ[i][0].test(t)){say(FAQ[i][1]());return true;}}return false;}
var STEPS={
 hello:{
  enter:function(){if(!C().connector){
      say('Hi, I\'m <b>Cue</b>, Encore\'s partner agent. I\'ll get your first event in front of members in about five minutes. Talk to me like you would a colleague. Nothing goes live until you say <b>publish</b>.');
      say('I\'ve matched your account to <b>Formula E</b>: the <b>London E-Prix</b> at ExCeL London, Royal Victoria Dock. Which ticketing system should I connect to? I only need read access to your race-day inventory, grandstand maps and live availability.','connectors');}
    else termsMsg();},
  chips:function(){return !C().connector?['Ticketmaster','Upload a CSV','Type it in','What is Encore?']:(P._termsAsk?[{l:'Agree and continue',c:'pri'}]:[{l:'Agree and continue',c:'pri'},'What does it cost me?','Who sees my prices?','How do I get paid?']);},
  text:function(t){var m=t.match(/ticketmaster|\baxs\b|csv|type it in|manual/i);
    if(m&&!C().connector){var n={ticketmaster:'Ticketmaster',axs:'AXS',csv:'Upload a CSV','type it in':'Type it in',manual:'Type it in'}[m[0].toLowerCase()];connectTo(n);return true;}
    if(/what is encore/i.test(t)){say(FAQ[3][1]());return true;}
    if(/cost/i.test(t)){say('Nothing up front, and nothing monthly. Encore earns the difference between what members pay for credits and the settle rate it pays you, so we only make money when your seat is filled too.');return true;}
    if(/who sees|price/i.test(t)){say('Only signed-in members, and only in credits. There\'s no public listing and no struck-through discount unless you switch it on, so your full-price buyers have no reason to wait.');return true;}
    if(/paid|payout/i.test(t)){say('For every seat a member uses, you get the settle rate times the credits spent. Payouts are weekly by bank transfer, with a statement you can export.');return true;}
    if(C().connector&&(agree(t)||/agree/i.test(t))){C().terms=true;sys('Partner terms accepted · '+fmtToday());complete('hello');return true;}
    if(!C().connector&&agree(t)){say('Which one is it? If you\'re not sure, <b>Upload a CSV</b> always works.');return true;}
    return false;}},
 show:{
  enter:function(){say('Your London E-Prix came through from '+C().connector.replace('Upload a CSV','your CSV').replace('Type it in','what you told me')+': two race days, three weeks from today.','shows');if(C().show)perfsMsg();},
  chips:function(){return !C().show?['London E-Prix']:['Looks right','Both race days','Just Saturday','Just Sunday'];},
  text:function(t){
    if(!C().show&&/e-?prix|london|formula|race/i.test(t)){pickShow('eprix');return true;}
    if(/switch/i.test(t)){C().show=null;C().perfs=[];say('Sure, which one?','shows');return true;}
    if(!C().show)return false;
    var s=show();
    if(/just|only/i.test(t)&&/sat|sun/i.test(t)){C().perfs=s.perfs.filter(function(p){return new RegExp(p.l.split(' · ')[1],'i').test(t);}).map(function(p){return p.k;});refresh();flash('show');say('Just '+perfList()+'. The other race day stays with your own ticketing.');return true;}
    if(/all|every|whole|both/i.test(t)){C().perfs=s.perfs.map(function(p){return p.k;});refresh();var hot=s.perfs.filter(function(p){return p.sold>=C().thr;});say('Both race days are in.'+(hot.length?' Heads-up: '+hot.map(function(p){return p.l;}).join(' and ')+' '+(hot.length>1?'are':'is')+' already selling well, so with the default rules it only releases if sales stall.':''));return true;}
    if(/as suggested|suggest/i.test(t)){C().perfs=s.perfs.filter(function(p){return p.sold<80;}).map(function(p){return p.k;});refresh();say('Done, the race days that need help.');return true;}
    var rm=/remove|drop|without|not |no /i.test(t),hit=[];
    s.perfs.forEach(function(p){if(new RegExp('\\b'+p.l.split(' · ')[1],'i').test(t))hit.push(p.k);});
    if(hit.length){hit.forEach(function(k){var i=C().perfs.indexOf(k);if(rm&&i>-1)C().perfs.splice(i,1);else if(!rm&&i<0)C().perfs.push(k);});
      C().perfs.sort(function(x,y){return (x==='sat'?0:1)-(y==='sat'?0:1);});
      refresh();flash('show');say((rm?'Removed. ':'Added. ')+'You now have '+(perfList()||'no race days')+'.');return true;}
    if(agree(t)){if(!C().perfs.length){say('Pick at least one race day first.');return true;}complete('show');return true;}
    return false;}},
 listing:{
  enter:function(){say('I\'ve drafted the listing in Encore\'s voice from your event copy, and placed a short race clip on the tile. Members see exactly this. Edit anything inline, or tell me what to change.<span class="why">Encore listings lead with what the day feels like, not the entry list. "Why you are seeing this" is rewritten for each member by the recommender: you give the hook, we personalise it.</span>','listing');},
  chips:function(){return ['Looks great','Make it punchier','Shorter','More formal','Rename to London E-Prix: grandstand day'];},
  text:function(t){var s=show(),c=C(),m;
    if((m=t.match(/(?:title|call it|rename(?: it)?(?: to)?)\s*[:\-]?\s*["“]?(.{3,60}?)["”]?$/i))&&!/^rename it$/i.test(t.trim())){c.title=m[1].trim();refresh();flash('listing');updateOuts();say('Renamed to <b>'+esc(c.title)+'</b>. The preview is updated.');return true;}
    if(/rename/i.test(t)){say('What should it be called? Type <b>title: </b> followed by the name.');return true;}
    var v=/punch|bold|exciting|fun/i.test(t)?1:/short|tight|brief/i.test(t)?2:/formal|serious|classic/i.test(t)?3:/original|first version|go back to/i.test(t)?0:-1;
    if(v>-1){c.bv=v;c.blurb=s.blurbs[v];refresh();flash('listing');say(['Back to the original.','Punchier version is in. It\'s the one I\'d run for the sport crowd.','Shorter. It works well on the tile, a little thin on the event page.','More formal. Fine, but members respond better to how the day feels than to how it\'s billed.'][v]);return true;}
    if(agree(t)){complete('listing');return true;}
    return false;}},
 inventory:{
  enter:function(){var ps=releasable(),avg=0;ps.forEach(function(p){avg+=unsold(p);});avg=ps.length?Math.round(avg/ps.length):0;
    say('How many grandstand seats a race day can members have? Across '+ps.length+' race day'+(ps.length===1?'':'s')+' you have about <b>'+avg.toLocaleString('en-GB')+' unsold</b> on average right now. I\'d start with <b>40</b>, from the North and South grandstands.<span class="why">40 seats is about 1% of grandstand capacity: enough to fill visibly, small enough that nobody notices a channel. With the Empty Seat Engine, Encore only ever takes seats that are genuinely unsold at release time.</span>','inventory');},
  chips:function(){return ['40 is fine','Make it 60','Fixed allocation instead','Why not more?'];},
  text:function(t){var c=C(),n=t.match(/(\d{2,3})/);
    if(/why not more/i.test(t)){say('You can, and I\'d raise it once we see the fill rate. Starting small keeps Encore from cutting into seats you\'d have sold yourself, and I\'ll tell you the moment a race day hits 80%, so you can add more while demand is there.');return true;}
    if(n&&!/credit|cr\b|hour|day|%|p\b|£/i.test(t)){c.seats=Math.max(10,Math.min(120,Math.round(parseInt(n[1],10)/5)*5));refresh();flash('inventory');updateOuts();
      if(agree(t)){complete('inventory');return true;}say(c.seats+' seats a race day: '+OUT.seatsNote()+'.');return true;}
    if(/fixed/i.test(t)){c.alloc='fixed';refresh();flash('inventory');say('Switched to a fixed allocation. Those seats come off sale in your own ticketing now. I\'d still suggest the engine for a race weekend, but it\'s your call.');return true;}
    if(/engine/i.test(t)){c.alloc='engine';refresh();say('Back on the Empty Seat Engine.');return true;}
    if(/no plus|without plus/i.test(t)){c.plusOne=false;refresh();say('Plus-ones are off.');return true;}
    if(/grandstand|north|south|east|general/i.test(t)){['North grandstand','South grandstand','East grandstand','General admission'].forEach(function(x){if(new RegExp(x.split(' ')[0],'i').test(t)){var i=c.sections.indexOf(x);if(i<0)c.sections.push(x);}});refresh();say('Grandstands: '+c.sections.join(', ')+'.');return true;}
    if(agree(t)||/fine/i.test(t)){complete('inventory');return true;}
    return false;}},
 pricing:{
  enter:function(){say('Your grandstand prices stay hidden from members. I\'d list it at <b>'+C().cr+' credits</b>.<span class="why">Big-ticket days on Encore clear at 40–65 credits: F1 DRIVE go-karting at 40, Manon at the Royal Ballet and Opera at 65. '+C().cr+' sits between them, so it reads as a proper day out, not a discount. Slide it and watch the fill forecast move.</span>','pricing');},
  chips:function(){return ['55 works','Try 45','Try 65','What do similar events go for?'];},
  text:function(t){var c=C(),n=t.match(/(\d{1,2})/);
    if(/similar|compar|go for/i.test(t)){say('On Encore right now: F1 DRIVE go-karting at 40, the rooftop climb at Up at The O2 at 35, London City Lionesses at 20, and Manon at the Royal Ballet and Opera at 65. Big days out that book a week or more ahead tend to sit at 40–65.');return true;}
    if(/dynamic|step.?down/i.test(t)){c.dyn=!/off|no|disable/i.test(t);refresh();say('Smart step-down is '+(c.dyn?'on':'off')+'.');return true;}
    if(/public price|struck|rrp/i.test(t)){c.showRrp=false;refresh();say('Members only see credits for now. Once your grandstand prices sync from your ticketing, I can show them struck through, though I\'d still recommend credits only.');return true;}
    if(n&&/hour|day|seat|%|£|\dp\b/i.test(t))n=null;
    if(n&&agree(t)&&!/try/i.test(t)){c.cr=Math.max(30,Math.min(90,parseInt(n[1],10)));complete('pricing');return true;}
    if(n){c.cr=Math.max(30,Math.min(90,parseInt(n[1],10)));refresh();flash('pricing');updateOuts();var f=fill(c.cr);
      say(c.cr+' credits. Forecast <b>'+forecastSeats()+' of '+c.seats+'</b> a race day ('+pct(f)+'), and <b>'+gbp(c.cr*c.settle)+'</b> to you per seat used.'+(f<.55?' That\'s on the high side. I\'d expect some empty member seats.':f>.92?' That will clear fast. You could hold a few credits back.':''));return true;}
    if(agree(t)||/works/i.test(t)){complete('pricing');return true;}
    return false;}},
 rules:{
  enter:function(){var hs=perfsSel().filter(held);
    say('Now the rules: when your seats go live on Encore, and when they come back to you. I\'d release them <b>as soon as you publish</b>.<span class="why">Three weeks out, grandstand sales on both race days have flattened. Members plan race weekends a few weeks ahead, so an early release fills seats your own sales won\'t reach. Pull-back hands unbooked seats straight back if your public sales pick up.</span>'+(hs.length?'<br><br>Note: '+hs.map(function(p){return p.l;}).join(' and ')+' '+(hs.length>1?'are':'is')+' already above '+C().thr+'% sold, so with these rules '+(hs.length>1?'they stay':'it stays')+' with your own ticketing.':''),'rules');},
  chips:function(){return ['Defaults are good','Release 2 weeks before','Release 72h before','Explain pull-back'];},
  text:function(t){var c=C(),m;
    if(/explain|what.*pull/i.test(t)){say(FAQ[0][1]());return true;}
    if(/\bnow\b|immediate|on publish|as soon/i.test(t)){c.act='0';refresh();flash('rules');say('Live as soon as you publish.');return true;}
    if((m=t.match(/close[^\d]*(\d)/i))){c.closeH=[1,2,4].reduce(function(a,b){return Math.abs(b-m[1])<Math.abs(a-m[1])?b:a;});refresh();flash('rules');say('Closes '+c.closeH+'h before the race.');return true;}
    if((m=t.match(/(\d+)\s*(h|hour|day|week)/i))){var h=parseInt(m[1],10)*(/day/i.test(m[2])?24:/week/i.test(m[2])?168:1);var o=['72','168','336'];var best=o.reduce(function(a,b){return Math.abs(b-h)<Math.abs(a-h)?b:a;});c.act=best;refresh();flash('rules');
      say('Go-live is '+actLabel(best)+' the race. Each race day follows its own clock, and members can\'t see it before then.');return true;}
    if(/(plus|rock ?star) and icon|top tier|icon only/i.test(t)){c.tiers='plus';refresh();say('Only Rock Star and Icon members can book it.');return true;}
    if(/pull ?back/i.test(t)){c.pullback=!/no|off/i.test(t);refresh();say('Pull-back is '+(c.pullback?'on':'off')+'.');return true;}
    if(agree(t)||/defaults/i.test(t)){complete('rules');return true;}
    return false;}},
 split:{
  enter:function(){say('Revenue split. Encore pays you a <b>settle rate for every credit</b> a member spends on your seats, but only when the seat is scanned at the door.<span class="why">Members pay between £1.09 and £2.00 a credit depending on their plan. £0.90 is the band for released unsold seats: high enough that a grandstand seat earns you '+gbp(C().cr*0.9)+' instead of nothing, low enough to keep the member price that fills it.</span>','split');},
  chips:function(){return ['£0.90 is fair','Can you do £1.00?','How does Encore make money?','When do I get paid?'];},
  text:function(t){var c=C(),m;
    if(/make money|encore earn|your cut/i.test(t)){say(FAQ[4][1]());return true;}
    if(/when.*paid|payout/i.test(t)){say('Every '+c.payout.toLowerCase().replace('ly','')+', for the seats scanned the week before, by bank transfer. The statement lists every race day, scan and no-show, and you can export it as CSV.');return true;}
    if(/1\.00|£1\b|a pound|one pound/i.test(t)&&/can you|could you|do/i.test(t)){c.settle=1;c.approval=true;refresh();flash('split');updateOuts();
      say('I can put £1.00 in. Two things, though: rates above £0.95 go to Encore partnerships for sign-off, usually the same day, so I\'ve flagged it. And at '+c.cr+' credits it makes the day less likely to get pushed in the weekly edit. If you\'d rather skip the approval, <b>£0.95 at '+c.cr+' credits</b> gets you '+gbp(c.cr*0.95)+' a seat straight away.');return true;}
    if((m=t.match(/(\d{2})\s*p\b/i))||(m=t.match(/£?\s*(0?\.\d{1,2}|1\.\d{1,2})/))){var v=parseFloat(m[1].indexOf('.')>-1?m[1]:'0.'+m[1]);if(m[1].length===2&&m[1].indexOf('.')<0)v=parseInt(m[1],10)/100;
      c.settle=Math.max(0.8,Math.min(1.1,Math.round(v*100)/100));c.approval=c.settle>0.95;refresh();flash('split');updateOuts();
      if(agree(t)){complete('split');return true;}say('Settle rate set to <b>'+gbp(c.settle)+'</b>: '+gbp(c.settle*c.cr)+' to you per seat used.'+(c.approval?' Flagged for sign-off.':''));return true;}
    if(/monthly|fortnight|weekly/i.test(t)){c.payout=/monthly/i.test(t)?'Monthly':/fortnight/i.test(t)?'Fortnightly':'Weekly';refresh();say(c.payout+' payouts it is.');return true;}
    if(agree(t)||/fair/i.test(t)){complete('split');return true;}
    return false;}},
 audience:{
  enter:function(){say('Who should hear about it first? I\'ve pulled the members most likely to say yes from Encore\'s taste graph, all within an hour of ExCeL London.<span class="why">In Encore\'s October survey of 1,041 people, last-minute access to unsold seats ranked among the most valued features. The lapsed sport-goers and never-been groups are where your new audience comes from.</span>','audience');},
  chips:function(){return ['Send it to all of them','Just the motorsport fans','What is a Stack nudge?','Looks good'];},
  text:function(t){var c=C();
    if(/stack nudge/i.test(t)){say(FAQ[1][1]());return true;}
    if(/all of them|everyone|\ball\b/i.test(t)){c.segs=SEGMENTS.map(function(s){return s.k;});refresh();flash('audience');updateOuts();say('Everyone it is: <b>'+reach().toLocaleString('en-GB')+'</b> unique members.');return true;}
    if(/just|only/i.test(t)&&/motor|fans/i.test(t)){c.segs=['motor'];refresh();flash('audience');updateOuts();say('Just the motorsport fans, '+reach().toLocaleString('en-GB')+' members. Safe, but you\'ll mostly reach people who already know you.');return true;}
    var hit=0;SEGMENTS.forEach(function(s){var kw={motor:/motor|racing|fans/i,sports:/sport|regular/i,lapsed:/lapsed/i,groups:/group/i,new:/never|new/i}[s.k];if(kw.test(t)&&c.segs.indexOf(s.k)<0){c.segs.push(s.k);hit++;}});
    if(hit){refresh();flash('audience');updateOuts();say('Added. Reach is now <b>'+reach().toLocaleString('en-GB')+'</b>.');return true;}
    if(agree(t)){complete('audience');return true;}
    return false;}},
 reporting:{
  enter:function(){say('Last bit of setup: what you\'d like to hear from me, and how often.<span class="why">Most partners need two numbers: seats that would have been empty, and how many of those people were new to you. Everything else is there when you want it.</span>','reporting');},
  chips:function(){return ['Daily digest is perfect','Weekly is enough','Add Slack'];},
  text:function(t){var c=C();
    if(/weekly/i.test(t)){c.freq='Weekly';refresh();say('Weekly digest, every Monday at 9.');return true;}
    if(/live only/i.test(t)){c.freq='Live only';refresh();say('No digests. Stats are always live.');return true;}
    if(/slack|teams/i.test(t)){c.chan.slack=true;refresh();say('Slack is on. I\'ll ask for the channel name when we connect it after publishing.');return true;}
    if(/daily|perfect/i.test(t)){c.freq='Daily digest';complete('reporting');return true;}
    if(agree(t)){complete('reporting');return true;}
    return false;}},
 review:{
  enter:function(){say('Here\'s everything in one place. I\'ve run the pre-flight checks:','review');say('Ready when you are. Say <b>publish</b> and it goes out under your go-live rule. You can change anything afterwards, just by asking me.');},
  chips:function(){return [{l:'Publish',c:'grad'},'Preview, then publish'];},
  text:function(t){
    if(/publish|go live|ship|launch/i.test(t)){publish();return true;}
    if(/preview/i.test(t)){say('Here\'s the tile exactly as members will see it in Discover:','mpreview');publish();return true;}
    return false;}}
};
function termsMsg(){say('Before we build anything, here\'s the deal in plain English:','terms');}
function connectTo(n){C().connector=n;refresh();sys('Connected to '+n+' · read-only · 1 event, 2 race days imported');
  say('Connected. I can see availability and seat maps. I can\'t change your prices or sell anything outside the allocation you give me.<span class="why">Live availability is what lets the Empty Seat Engine release only genuinely unsold seats, and hand them back the moment your own sales pick up again.</span>');termsMsg();}
function pickShow(id){var c=C();c.show=id;var s=show();c.perfs=s.perfs.filter(function(p){return p.sold<80;}).map(function(p){return p.k;});
  c.title=s.title;c.bv=0;c.blurb=s.blurbs[0];c.why=s.why;c.plan=s.plan.slice();c.tag=s.tag;refresh();flash('show');perfsMsg();}
function perfsMsg(){var s=show(),hot=s.perfs.filter(function(p){return p.sold>=80;});
  say('Here\'s how the <b>London E-Prix</b> is selling. Both race days have grandstand seats going spare, so I\'ve picked both.'+(hot.length?'<span class="why">'+hot.map(function(p){return p.l;}).join(' and ')+' '+(hot.length>1?'are':'is')+' at '+hot.map(function(p){return p.sold+'%';}).join(' and ')+'. Your own ticketing will sell those without help.</span>':'<span class="why">Race 1 is 62% sold and Race 2 is 71%. Both have room, and neither is close to the 85% point where I\'d leave it to your own ticketing.</span>'),'perfs');}
function complete(id){P.done[id]=true;flash(id);freezeAll();
  var nx=-1;for(var i=0;i<STEP_IDS.length;i++){if(!P.done[STEP_IDS[i]]){nx=i;break;}}
  if(P.published){P.step=STEP_IDS.length;say('Saved. The change is <b>live in the member app</b> already.');psave();renderComposer();return;}
  if(nx<0)nx=stepIdx('review');P.step=nx;psave();renderProgress();STEPS[STEP_IDS[nx]].enter();}
function gotoStep(i,silent){freezeAll();P.step=i;if(P.done[STEP_IDS[i]])delete P.done[STEP_IDS[i]];psave();renderProgress();
  if(!silent)say('Sure, back to <b>'+SEC[STEP_IDS[i]].toLowerCase()+'</b>.');STEPS[STEP_IDS[i]].enter();}

function publish(){if(P.published){say('It\'s already published.');return;}
  P.published=true;P.done.review=true;P._termsAsk=false;P.clock='today';freezeAll();P.step=STEP_IDS.length;confetti();
  var ps=releasable(),st=overall();sys('Published · '+esc(C().title)+' · '+ps.length+' race day'+(ps.length===1?'':'s')+' · '+alloc()+' seats · '+fmtToday());
  if(st==='live'){say('🎉 It\'s <b>live</b>. Members in your audience can see it right now, at the top of their Discover grid.');
    say('Open the member app to see it as Maya does, or move the timeline to <b>2 weeks before</b> the race to watch bookings build.');}
  else{var p=ps[0];say('🎉 Published. It\'s <b>scheduled</b>: '+(p?p.l+' seats go live <b>'+actLabel(C().act)+' the race</b>, and each race day follows its own clock.':'')+' Members can\'t see it yet. That\'s the rule working.');
    say('Move the timeline forward to watch it go live and fill.');}
  refresh();renderApp();}
function confetti(){var el=$('confetti'),cols=['#FF4FA3','#0A70B0','#F2C418','#3FB57A','#F23D0F'],h='';
  for(var i=0;i<70;i++)h+='<i style="left:'+(Math.random()*100)+'%;background:'+cols[i%5]+';animation-delay:'+(Math.random()*.6)+'s;transform:rotate('+(Math.random()*360)+'deg)"></i>';
  el.innerHTML=h;setTimeout(function(){el.innerHTML='';},3400);}

/* ---------------------------------------------------------------- after publish: Cue runs the event */
var NEXTPH={today:'w2',w2:'w1',w1:'after'};
function liveChips(){var st=overall(),k=P.clock;
  if(st==='paused')return [{l:'Resume it',c:'pri'},'How is it selling?'];
  if(k==='after')return [{l:'Show my payouts',c:'grad'},'How did it do?','Back to today'];
  var out=[{l:'Jump to '+phase(NEXTPH[k]).l,c:'grad'}];
  if(st==='live')out.push('Open the member app','How is it selling?','Add 10 seats');
  else if(st==='sched')out.push('Open the member app','Change the price');
  else out.push('How is it selling?');
  out.push('Pause it');return out;}
function jumpClock(k){P.clock=k;psave();
  sys('Timeline → '+phase(k).long);
  var st=overall(),t=totals(),a=alloc()||1;
  if(k==='today')say('Back to publish day, '+fmtToday()+'. '+(t.seats?'Bookings from the member app are kept.':'No bookings yet.'));
  else if(k==='after')say('The race weekend is over. <b>'+t.seats+'</b> member seats booked, <b>'+t.scanned+'</b> scanned at the gates, and <b>'+gbp0(t.pay)+'</b> heading your way on Friday\'s payout. All of it from grandstand seats that would have been empty.','pulse');
  else if(st==='sched'||!t.seats)say((k==='w2'?'Two weeks to go. ':'One week to go. ')+(st==='sched'?'Nothing has released yet under your go-live rule, so members can\'t see it.':'It\'s live, but no bookings yet.'));
  else{var lead=perfsSel().filter(function(p){return !held(p);}).map(function(p){return [p,booked(p.k)];}).sort(function(x,y){return y[1]-x[1];});
    say((k==='w2'?'Two weeks to go. <b>'+t.seats+' of '+a+'</b> member seats are booked ('+pct(t.seats/a)+'), most of them from the launch drop.':
      'One week to go. <b>'+t.seats+' of '+a+'</b> booked ('+pct(t.seats/a)+'). The weekly edit and the Stack nudge are doing the work now.')+
      (lead.length>1?' '+lead[0][0].l+' is pacing ahead of '+lead[1][0].l+'.':''),'pulse');
    if(C().alerts.eighty)perfsSel().forEach(function(p){if(!held(p)&&booked(p.k)>=.8*C().seats)say('🔔 <b>'+p.l+'</b> is '+pct(booked(p.k)/C().seats)+' filled. Want me to add 10 more seats while demand is there? Say <b>"add 10 seats"</b>.');});}
  refresh();renderApp();}
function liveText(t){var c=C(),m;
  if(/jump|fast.?forward|timeline|clock|skip|simulate/i.test(t)){
    var k=/after|end|finish|over/i.test(t)?'after':/(2|two) weeks?/i.test(t)?'w2':/(1|one) week|week before/i.test(t)?'w1':/today|back|publish/i.test(t)?'today':(NEXTPH[P.clock]||'after');jumpClock(k);return true;}
  if(/back to today/i.test(t)){jumpClock('today');return true;}
  if(/member app|open (it|the app)|see it|show me/i.test(t)){openMember(true);return true;}
  if(/resume|unpause|switch it back on/i.test(t)){P.paused=false;sys('Resumed');say('Back on sale in the member app.');refresh();renderApp();return true;}
  if(/pause|stop selling|kill|take it down/i.test(t)){P.paused=true;sys('Paused by partner');say('Paused. It\'s gone from the member app. Members who already booked keep their seats. Say <b>resume</b> to put it back.');refresh();renderApp();return true;}
  if((m=t.match(/add\s*(\d+)/i))&&/seat/i.test(t)){c.seats=Math.min(150,c.seats+parseInt(m[1],10));sys('Allocation → '+c.seats+' a race day');say('Done: <b>'+c.seats+'</b> seats a race day. The extra seats are on sale in the member app now.');refresh();return true;}
  if((m=t.match(/(\d{2,3})\s*seats/i))){c.seats=Math.max(10,Math.min(150,parseInt(m[1],10)));sys('Allocation → '+c.seats+' a race day');say('Allocation is now '+c.seats+' a race day.');refresh();return true;}
  if((m=t.match(/(\d{1,2})\s*(credits|cr)\b/i))||(/price/i.test(t)&&(m=t.match(/(\d{1,2})/)))){c.cr=Math.max(30,Math.min(90,parseInt(m[1],10)));sys('Price → '+c.cr+' credits');say('Price is now <b>'+c.cr+' credits</b>. New bookings pay that; existing bookings keep theirs.');refresh();return true;}
  if(/change the price/i.test(t)){say('To what? For example, "50 credits".');return true;}
  if(/payout|statement|paid/i.test(t)){setView('payouts');return true;}
  if(/sell|doing|how did|report|numbers|performance|stats/i.test(t)){var tt=totals();say(tt.seats?'Here\'s where it stands, '+phase(P.clock).long.toLowerCase()+':':'No bookings yet. '+(overall()==='sched'?'It hasn\'t gone live.':'Move the timeline forward, or book it yourself in the member app.'),tt.seats?'pulse':null);return true;}
  if(/another|next show|new event/i.test(t)){say('In the full product I\'d start your next event right here, with everything I\'ve learnt carried over. To run onboarding again, use <b>Reset partner view</b>.');return true;}
  return false;}
/* the member app sits next to this page; a host that serves it elsewhere sets window.ENCORE_MEMBER_URL in the page */
var MEMBER_URL=window.ENCORE_MEMBER_URL||'member.html';
function openMember(fromChat){var w=null;try{w=window.open(MEMBER_URL,'encore-member');}catch(e){}
  if(!fromChat)return;
  var pe=partnerEventForMember();
  var tail=pe?'It\'s first in Discover, with '+pe.left+' member seats left.':(P.published?(overall()==='sched'?'It isn\'t visible to members yet: it goes live '+actLabel(C().act)+' the race.':'It isn\'t visible to members right now.'):'Nothing of yours is published yet.');
  say((w?'The member app is open in another tab. ':'Your browser blocked the new tab. <a href="'+MEMBER_URL+'" target="encore-member">Open the member app</a>. ')+tail);}

var CROSS=[['pricing',/\d{1,2}\s*(credits|cr)\b/i],['inventory',/\d{2,3}\s*seats/i],['rules',/\d+\s*(h|hours?|days?|weeks?)\b|close.*\d|pull ?back/i],['split',/\d{2}\s*p\b|£\s*0?\.\d|settle/i]];
function crossStep(t){for(var i=0;i<CROSS.length;i++){var id=CROSS[i][0];if(id!==curId()&&P.done[id]&&CROSS[i][1].test(t)){
  var keep=P.done[id];var r=STEPS[id].text(t.replace(/\b(fine|good|great|works)\b/gi,''));P.done[id]=keep;if(r){say('Updated '+SEC[id].toLowerCase()+'. Back to '+SEC[curId()].toLowerCase()+'.');renderSheet();return true;}}}return false;}

/* ---------------------------------------------------------------- router */
function handle(raw){var t=(raw||'').trim();if(!t)return;userSay(t);setTimeout(function(){route(t);},120);}
function advanceAfter(id,before){
  if(P.published||curId()!==id||P.done[id])return;
  var c=C();
  if(id==='hello'){
    if(!c.connector){say('I\'ll connect <b>Ticketmaster</b> so we keep moving. You can switch it later.');connectTo('Ticketmaster');return;}
    if(!before.connector)return;
    if(!c.terms){P._termsAsk=true;renderComposer();return;}}
  if(id==='show'){if(!c.show){pickShow('eprix');return;}if(!before.show)return;if(!c.perfs.length)c.perfs=show().perfs.map(function(p){return p.k;});}
  if(id==='review'){publish();return;}
  sys('✓ '+SEC[id]+' saved');complete(id);}
function route(t){
  if(/^(back|go back|undo|previous)\b/i.test(t)&&P.step>0&&!P.published){gotoStep(Math.min(P.step,STEP_IDS.length)-1);return;}
  if(/^(reset|start over|start again)/i.test(t)){askReset();return;}
  if(/^(help|what can you do|\?)/i.test(t)){say('I can set up and run events for you. Try: <b>"make it punchier"</b>, <b>"change price to 50"</b>, <b>"release 2 weeks before"</b>, <b>"92p"</b>, <b>"go back"</b>, <b>"how is it selling?"</b>, <b>"pause it"</b> or <b>"add 10 seats"</b>. You can also tap Edit on any section of the event sheet.');return;}
  var em=t.match(/(?:edit|change|go (?:back )?to|revisit|open)\s+(?:the\s+)?(listing|copy|seats|inventory|allocation|pricing|price|rules?|activation|split|settle|revenue|audience|campaigns?|reporting|reports?|dates|race days|show)/i);
  if(em&&!/\d/.test(t)){var map={listing:'listing',copy:'listing',seats:'inventory',inventory:'inventory',allocation:'inventory',pricing:'pricing',price:'pricing',rule:'rules',rules:'rules',activation:'rules',split:'split',settle:'split',revenue:'split',audience:'audience',campaign:'audience',campaigns:'audience',reporting:'reporting',report:'reporting',reports:'reporting',dates:'show','race days':'show',show:'show'};
    var id=map[em[1].toLowerCase()];if(id&&!P.published){gotoStep(stepIdx(id));return;}}
  var id2=curId(),before={connector:!!C().connector,show:!!C().show};
  if(/margin|encore make|how does encore make/i.test(t)&&id2!=='split'){say(FAQ[4][1]());if(id2!=='live')advanceAfter(id2,before);return;}
  if(id2!=='live'){
    if(STEPS[id2].text(t)){advanceAfter(id2,before);return;}
    if(faq(t)){advanceAfter(id2,before);return;}
    if(crossStep(t)){advanceAfter(id2,before);return;}
    if(id2==='hello'&&C().connector&&!C().terms){say('Before I set anything up I need your OK on the terms above.');P._termsAsk=true;renderComposer();return;}
    say('Noted. I\'ll keep my suggestion for '+SEC[id2].toLowerCase()+' so we keep moving. You can change anything later.');advanceAfter(id2,before);return;}
  if(faq(t))return;
  if(liveText(t))return;
  say('I didn\'t quite catch that. Try "how is it selling?", "add 10 seats", "pause it" or "open the member app".');}

/* ---------------------------------------------------------------- layout */
function setView(v){P.view=v;if(v==='perf')P.unseen=0;psave();renderApp();}
function navItems(){var it=[['agent','Cue','cue'],['sheet','Sheet','sheet'],['events','Events','events'],['perf','Stats','stats'],['payouts','Payouts','payouts']];
  return isWide()?it.filter(function(x){return x[0]!=='sheet';}):it;}
function connTxt(){return 'London E-Prix · '+(C().connector?C().connector+' connected':'not connected yet');}
function renderHeads(){var a=$('pconn'),b=$('pconn2'),c=$('cuesub');if(a)a.textContent=connTxt();if(b)b.textContent=connTxt();
  if(c)c.textContent=P.published?(P.paused?'Event paused':'Running your event'):'Setting up Formula E';}
function renderNav(){var items=navItems();
  function btn(x,sz){var on=P.view===x[0],badge=x[0]==='perf'&&P.unseen?'<span class="nbadge">'+P.unseen+'</span>':'';
    return '<button class="'+(on?'on':'')+'" data-pa="nav" data-v="'+x[0]+'"'+(on?' aria-current="page"':'')+'>'+ico(x[2],sz)+'<span>'+x[1]+'</span>'+badge+'</button>';}
  var n=$('pnav');if(n)n.innerHTML=items.map(function(x){return btn(x,24);}).join('');
  var s=$('psnav');if(s)s.innerHTML=items.map(function(x){return btn(x,20);}).join('');}
function renderApp(){
  var wide=isWide();if(wide&&P.view==='sheet')P.view='agent';
  $('phead').innerHTML='<div class="plogo" aria-hidden="true">'+PARTNER.short+'</div><div class="pname"><b>'+PARTNER.name+'</b><small id="pconn"></small></div>'+
    '<button class="iconbtn" data-pa="menu" aria-label="More">'+ico('more',22)+'</button>';
  $('pside').innerHTML='<div class="who"><div class="plogo" aria-hidden="true">'+PARTNER.short+'</div><div class="pname"><b>'+PARTNER.name+'</b><small id="pconn2"></small></div></div>'+
    '<nav id="psnav" aria-label="Partner app"></nav>'+
    '<div class="sfoot"><button class="linkbtn" data-pa="openMember">'+ico('ext',18)+'Open member app</button>'+
    '<button class="linkbtn" data-pa="ops" aria-pressed="'+P.ops+'" title="Show Encore\'s own margin next to partner numbers. Internal review only.">'+ico('eye',18)+'Ops lens<span class="tag'+(P.ops?' on':'')+'">'+(P.ops?'On':'Off')+'</span></button>'+
    '<button class="linkbtn danger" data-pa="resetAsk">'+ico('reset',18)+'Reset partner view</button>'+
    '<div class="wm">'+logoMark(40)+'<span>Partner</span></div></div>';
  var v=P.view,body;
  if(v==='agent')body='<section class="chatcol"><div class="chathead"><div class="cueav" aria-hidden="true"></div><div><b>Cue</b><small id="cuesub"></small></div><div class="prog" id="prog"></div></div>'+
    '<div id="resumeSlot"></div><div class="chatlog" id="chatlog"></div>'+
    '<div class="composer"><div class="sugg" id="sugg"></div><div class="inrow"><textarea id="pin" rows="1" placeholder="Message Cue" aria-label="Message Cue" enterkeyhint="send"></textarea>'+
    '<button class="send" data-pa="send" aria-label="Send">'+ico('send',20)+'</button></div></div></section>';
  else if(v==='sheet')body='<aside class="sheet" id="sheet"></aside>';
  else body='<section class="view" id="view"></section>';
  $('pmain').innerHTML=body;
  var sc=$('psheetcol');
  if(wide&&v==='agent'){sc.className='psheetcol on';sc.innerHTML='<aside class="sheet" id="sheet" aria-label="Event sheet"></aside>';}else{sc.className='psheetcol';sc.innerHTML='';}
  renderNav();renderHeads();
  if(v==='agent'){lastCount=-1;renderChat(true);renderComposer();
    if(!P.started){P.started=true;psave();STEPS.hello.enter();}
    else if(P.resumeAsk&&!P.published)$('resumeSlot').innerHTML='<div class="resume"><span>Welcome back. Everything is saved. We were on <b>'+(SEC[curId()]||'set-up').toLowerCase()+'</b>.</span><button data-pa="resume">Pick up</button><button class="x" data-pa="resumeX" aria-label="Dismiss">✕</button></div>';}
  renderSheet();renderView();observeVideos();}
function renderProgress(){var el=$('prog');if(!el)return;var d=0;STEP_IDS.forEach(function(s){if(P.done[s])d++;});
  var left=STEP_IDS.length-d;el.innerHTML='<div class="bar"><i style="width:'+(d/STEP_IDS.length*100)+'%"></i></div><p>'+(P.published?'LIVE OPERATIONS':'STEP '+Math.min(P.step+1,STEP_IDS.length)+' OF '+STEP_IDS.length+' · ~'+Math.max(1,Math.ceil(left*0.5))+' MIN')+'</p>';}
function renderComposer(){var el=$('sugg');if(!el)return;if(busy||Q.length){el.innerHTML='';return;}
  var ch=curId()==='live'?liveChips():STEPS[curId()].chips();
  el.innerHTML=ch.map(function(x){var o=typeof x==='string'?{l:x}:x;return '<button class="'+(o.c||'')+'" data-pa="say" data-v="'+esc(o.l)+'">'+esc(o.l)+'</button>';}).join('');}

/* clips in previews play only while visible */
var _io=null;
function observeVideos(){var vids=document.querySelectorAll('.papp video');
  if(!('IntersectionObserver' in window)){vids.forEach(function(v){v.muted=true;v.play().catch(function(){});});return;}
  if(!_io)_io=new IntersectionObserver(function(es){es.forEach(function(en){var v=en.target;if(en.isIntersecting){v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:0.2});
  vids.forEach(function(v){if(!v._obs){v._obs=1;v.muted=true;_io.observe(v);}});}

/* ---------------------------------------------------------------- event sheet */
function kv(k,v){return '<div class="kv"><span>'+k+'</span><span>'+v+'</span></div>';}
function sheetBody(id){var c=C(),s=show();switch(id){
  case 'hello':return c.connector?kv('Partner',PARTNER.name)+kv('Ticketing',c.connector+' · read-only')+kv('Terms',c.terms?'Accepted':'Pending'):'';
  case 'show':return s?kv('Event',esc(s.title))+kv('Venue',s.space)+kv('Race days',perfList()||'—'):'';
  case 'listing':return c.blurb?kv('Title',esc(c.title))+'<p class="sub" style="font-size:12px;margin-top:4px">'+esc(c.blurb)+'</p>':'';
  case 'inventory':return P.done.show?kv('Seats a race day',c.seats)+kv('Total',alloc())+kv('Mode',c.alloc==='engine'?'Empty Seat Engine':'Fixed')+kv('Grandstands',c.sections.join(', ')):'';
  case 'pricing':return P.done.inventory||P.step>=4?kv('Member price',c.cr+' credits')+kv('Step-down',c.dyn?'On · floor '+c.floor:'Off')+kv('Public price shown',c.showRrp?'Yes':'No'):'';
  case 'rules':return P.step>=5||P.done.rules?kv('Goes live',c.act==='0'?'On publish':actLabel(c.act)+' the race')+kv('Threshold',c.threshold?'Under '+c.thr+'% sold':'None')+kv('Closes',c.closeH+'h before the race · when full')+kv('Pull-back',c.pullback?'At '+c.pull+'% public sales':'Off'):'';
  case 'split':return P.step>=6||P.done.split?kv('Settle',gbp(c.settle)+' / credit')+kv('Per seat',gbp(c.settle*c.cr))+kv('No-shows',c.noShow+'%')+kv('Payouts',c.payout):'';
  case 'audience':return P.step>=7||P.done.audience?kv('Reach',reach().toLocaleString('en-GB'))+kv('Segments',c.segs.length)+kv('Campaigns',Object.keys(c.camp).filter(function(k){return c.camp[k];}).length+' on'):'';
  case 'reporting':return P.step>=8||P.done.reporting?kv('Cadence',c.freq)+kv('Metrics',c.kpis.join(', ')):'';
  case 'review':return P.published?kv('Published',fmtToday())+kv('Forecast',gbp0(forecastSeats()*releasable().length*c.cr*c.settle)):'';}return '';}
function clockCtl(short){return '<div class="segctl" role="group" aria-label="Timeline">'+PHASES.map(function(p){var on=P.clock===p.k;return '<button class="'+(on?'on':'')+'" data-pa="clock" data-v="'+p.k+'" aria-pressed="'+on+'" title="'+p.long+'">'+(short?p.s:p.l)+'</button>';}).join('')+'</div>';}
function statusCard(){var st=overall();var lbl={draft:'Draft · not visible to members',live:'Live in the member app',sched:'Scheduled',paused:'Paused',full:'Sold out to members',ended:'Run finished'}[st];
  var t=totals();
  var sub=st==='draft'?'Cue saves every change as you go':st==='sched'?(function(){var p=releasable()[0];return p?'Goes live '+actLabel(C().act)+' the race':'';})():
    st==='live'?t.seats+' of '+alloc()+' seats booked':st==='ended'||st==='full'?gbp0(t.pay)+' to you':'Members can\'t see it';
  var h='<div class="statusbig '+(st==='ended'||st==='full'?'live':st)+'"><div><b>'+lbl+'</b><small>'+sub+'</small></div>'+(st==='live'||st==='sched'?'<button data-pa="openMember">Member app '+ico('ext',14)+'</button>':'')+'</div>';
  if(P.published)h+='<div class="clockbox"><p class="lab">Timeline · '+phase(P.clock).long+'</p>'+clockCtl(true)+'</div>';
  return h;}
function renderSheet(){var el=$('sheet');if(!el)return;var cur=curId();
  var h=statusCard()+'<div class="segctl sheettabs" role="tablist"><button class="'+(P.sheetTab==='sheet'?'on':'')+'" data-pa="sheettab" data-v="sheet" role="tab" aria-selected="'+(P.sheetTab==='sheet')+'">Event sheet</button><button class="'+(P.sheetTab==='preview'?'on':'')+'" data-pa="sheettab" data-v="preview" role="tab" aria-selected="'+(P.sheetTab==='preview')+'">Member preview</button></div>';
  if(P.sheetTab==='preview'){var e=draftEvent(),c=C();
    h+='<div class="ssec" style="display:flex;gap:12px;align-items:flex-start"><div class="miniphone" style="width:164px"><div class="in">'+tileHtml(e)+'</div></div><div style="flex:1"><p class="lab">In Discover</p><p class="sub" style="font-size:12px;margin-top:6px">Top of the grid for '+reach().toLocaleString('en-GB')+' matched members, with the clip playing muted.</p></div></div>'+
      '<div class="ssec"><p class="lab">Event page</p><p style="font:italic 400 24px/1.1 var(--font-serif);margin-top:8px">'+esc(c.title||'Untitled')+'</p>'+
      '<div style="display:flex;gap:18px;align-items:flex-end;margin-top:10px"><div><p style="font:800 26px/1 var(--font-display)">'+c.cr+'</p><p class="lab">credits · member price</p></div></div>'+
      '<p class="sub" style="font-size:12.5px;margin-top:10px">'+esc(c.blurb||'Your listing copy appears here.')+'</p>'+
      '<div class="ssec" style="margin-top:10px;padding:10px 12px;border-left:10px solid var(--theatre)"><p class="lab" style="color:var(--ink)">Why you are seeing this</p><p class="sub" style="font-size:12px;margin-top:5px">'+esc(c.why||'—')+'</p></div></div>';}
  else STEP_IDS.forEach(function(id,i){var done=!!P.done[id],isCur=id===cur&&!P.published,b=sheetBody(id);
    h+='<div class="ssec'+(done?' done':'')+(isCur?' cur':'')+(P._flash===id?' flash':'')+'"><h6><span class="st">'+(done?'✓':'')+'</span>'+(i+1)+' · '+SEC[id]+
      (done&&id!=='review'&&id!=='hello'?'<button class="ed" data-pa="edit" data-v="'+i+'">EDIT</button>':'')+'</h6>'+(b?'<div class="body">'+b+'</div>':(isCur?'<p class="empty">Cue is on this now…</p>':''))+'</div>';});
  var st=el.scrollTop;el.innerHTML=h;el.scrollTop=st;observeVideos();}

/* ---------------------------------------------------------------- views */
function renderView(){var el=$('view');if(!el)return;var st=el.scrollTop;
  el.innerHTML='<div class="vin">'+(P.view==='events'?viewEvents():P.view==='perf'?viewPerf():viewPayouts())+'</div>';el.scrollTop=st;observeVideos();}
function emptyView(lab,title,txt){return '<div class="emptyv"><div class="cueav" aria-hidden="true"></div><p class="lab">'+lab+'</p><h1 class="t" style="margin-top:8px">'+title+'</h1><p class="sub" style="margin-top:10px">'+txt+'</p><button class="btn sm" style="margin-top:16px" data-pa="nav" data-v="agent">Back to Cue</button></div>';}
function viewClock(){return P.published?'<div class="viewclock">'+clockCtl(window.innerWidth<560)+'</div>':'';}
function atClock(k,fn){var o=P.clock;P.clock=k;var r=fn();P.clock=o;return r;}
function prevPhase(){var i=PHASES.findIndex(function(p){return p.k===P.clock;});return i>0?PHASES[i-1]:null;}
function viewEvents(){var c=C(),s=show(),st=overall();
  var pill=function(x){var L={live:'Live',sched:'Scheduled',draft:'Draft',paused:'Paused',ended:'Finished',full:'Sold out',none:'Not on Encore'};return '<span class="pill2 '+(x==='ended'||x==='full'?'ok':x==='none'?'draft':x)+'">'+L[x]+'</span>';};
  var h='<div class="vhead"><div><p class="lab">'+PARTNER.name+'</p><h1 class="t">Events</h1></div></div>'+viewClock()+
    '<p class="sub" style="margin-top:12px">Everything of yours that\'s on Encore. Ask Cue to change anything, or flip a switch here.</p><div class="panel" style="margin-top:14px;padding:4px 16px">';
  if(s)h+='<div class="evrow"><div class="th vart" style="--cat:'+s.c1+';height:52px">'+clipTag(s.vid)+'</div><div style="min-width:0"><b>'+esc(c.title)+'</b><p class="sub" style="font-size:12px">'+s.space+' · '+(perfList()||'no race days')+' · '+raceWhen()+' · '+c.seats+' seats a race day · '+c.cr+' credits</p></div>'+pill(st)+
    '<div class="act">'+(P.published?'<button class="btn ghost sm" data-pa="say2" data-v="'+(P.paused?'Resume it':'Pause it')+'">'+(P.paused?'Resume':'Pause')+'</button>':'')+'<button class="btn sm" data-pa="nav" data-v="agent">'+(P.published?'Ask Cue':'Continue set-up')+'</button></div></div>';
  else h+='<div class="evrow"><div class="th" style="background:'+SHOWS[0].c1+'"></div><div><b>'+SHOWS[0].title+'</b><p class="sub" style="font-size:12px">'+SHOWS[0].space+' · 2 race days · in 3 weeks · from your '+(c.connector||'ticketing')+' feed</p></div>'+pill('none')+'<div class="act"><button class="btn ghost sm" data-pa="nav" data-v="agent">Set up with Cue</button></div></div>';
  return h+'</div>';}

/* booking pace: cumulative member seats from publish day to race day; solid so far, dashed for Cue's forecast */
function paceSvg(){
  var ps=releasable();if(!ps.length)return '';
  var vw=window.innerWidth,W=Math.round(Math.max(300,Math.min(1060,vw-(vw>=900?256+80+36:32+36)))),narrow=W<520,H=narrow?200:240,L=34,R=narrow?70:96,T=20,B=30;
  var t0=TODAY.getTime(),t1=RACE.getTime()+DAY,now=Math.min(nowD().getTime(),t1),a=alloc(),mem=memberBookings();
  var mAll={};mem.forEach(function(b){mAll[b.perf]=(mAll[b.perf]||0)+b.seats;});
  function seatsAt(t){var n=0;ps.forEach(function(p){var ms=0;mem.forEach(function(b){if(b.perf===p.k&&(b.at||t0)<=t)ms+=b.seats;});n+=Math.round(curve(windowX(p,t))*perfTarget(p,mAll[p.k]||0))+ms;});return n;}
  function X(t){return L+(t-t0)/(t1-t0)*(W-L-R);}function Y(v){return T+(1-v/Math.max(a,1))*(H-T-B);}
  function path(fromT,toT){var d='',N=48;for(var i=0;i<=N;i++){var t=fromT+(toT-fromT)*i/N;d+=(i?'L':'M')+X(t).toFixed(1)+' '+Y(seatsAt(t)).toFixed(1);}return d;}
  var g='';[0,.5,1].forEach(function(f){var v=Math.round(a*f),y=Y(v).toFixed(1);g+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'" stroke="#E0D6C4" stroke-width="1"'+(f===1?' stroke-dasharray="3 3"':'')+'/><text x="'+(L-6)+'" y="'+(+y+3)+'" text-anchor="end">'+v+'</text>';});
  g+='<text x="'+(W-R+6)+'" y="'+(Y(a)+3).toFixed(1)+'">Allocation</text>';
  var ticks=[[t0,'Publish'],[RACE.getTime()-14*DAY,'2 wks'],[RACE.getTime()-7*DAY,'1 wk'],[RACE.getTime(),'Race']];
  ticks.forEach(function(k){g+='<line x1="'+X(k[0]).toFixed(1)+'" x2="'+X(k[0]).toFixed(1)+'" y1="'+(H-B)+'" y2="'+(H-B+4)+'" stroke="#665F55" stroke-width="1"/><text x="'+X(k[0]).toFixed(1)+'" y="'+(H-B+16)+'" text-anchor="middle">'+k[1]+'</text>';});
  var solid=now>t0?'<path d="'+path(t0,now)+'" fill="none" stroke="#17130F" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>':'';
  var dash=now<t1?'<path d="'+path(now,t1)+'" fill="none" stroke="#665F55" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>':'';
  var mk='';PHASES.forEach(function(p){var t=p.k==='after'?t1:p.t.getTime();if(t>now+1)return;var v=p.k===P.clock?totals().seats:seatsAt(t),x=X(t).toFixed(1),y=Y(v).toFixed(1),cur=p.k===P.clock;
    mk+='<g data-tip="'+p.long+': '+v+' of '+a+' seats booked"><circle cx="'+x+'" cy="'+y+'" r="14" class="hit"/><circle cx="'+x+'" cy="'+y+'" r="'+(cur?6:4.5)+'" fill="'+(cur?'#FF4FA3':'#17130F')+'" stroke="#FFFDF8" stroke-width="2"/></g>';
    if(cur)mk+='<text x="'+(+x+10)+'" y="'+(+y-10)+'" style="font-weight:700;fill:#17130F;font-size:11px">'+v+' seats</text>';});
  var fin=seatsAt(t1);if(now<t1)mk+='<text x="'+(X(t1)+6).toFixed(1)+'" y="'+(Y(fin)+4).toFixed(1)+'">~'+fin+' forecast</text>';
  return '<svg class="pace" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Booking pace: '+totals().seats+' of '+a+' member seats booked, forecast '+fin+' by race day">'+g+dash+solid+mk+'</svg>';}
function viewPerf(){var c=C(),t=totals(),a=alloc(),after=P.clock==='after';
  if(!P.published)return emptyView('Stats','Nothing to report yet','Publish with Cue first. Live numbers show up here the moment members book.');
  var pp=prevPhase(),pt=pp?atClock(pp.k,totals):null;
  function dlt(n,fmt){return pt&&n>0?'<span class="delta">+'+(fmt?fmt(n):n)+'</span>':'';}
  var dLeft=daysTo(RACE);
  var h='<div class="vhead"><div><p class="lab">Stats · '+esc(c.title)+'</p><h1 class="t">Seats that would have been empty</h1></div>'+
     '<button class="btn ghost sm" data-pa="csv" data-v="bookings">Export CSV</button></div>'+viewClock()+
   '<div class="kpis"><div class="kpi hero"><p class="lab">'+(after?'Revenue recovered':'Revenue forecast')+'</p><p class="n">'+gbp0(t.pay)+dlt(Math.round(t.pay-(pt?pt.pay:0)),gbp0)+'</p><p class="d">'+(after?'scanned seats, plus no-shows at '+c.noShow+'%':'if every booked seat scans')+'</p></div>'+
   '<div class="kpi"><p class="lab">Seats booked</p><p class="n">'+t.seats+'<span style="font-size:14px;color:var(--mut)"> / '+a+'</span>'+dlt(t.seats-(pt?pt.seats:0))+'</p><p class="d">'+pct(a?t.seats/a:0)+' of the allocation</p></div>'+
   '<div class="kpi"><p class="lab">New to Formula E</p><p class="n">'+(t.seats?pct(t.newV/t.seats):'—')+'</p><p class="d">'+t.newV+' seats from people who never booked you</p></div>'+
   '<div class="kpi"><p class="lab">'+(after?'Turned up':'Race weekend')+'</p><p class="n">'+(after?(t.seats?pct(t.scanned/t.seats):'—'):(dLeft+' days'))+'</p><p class="d">'+(after?t.scanned+' scanned · '+t.noshow+' no-show seats':'to go · sales close '+c.closeH+'h before')+'</p></div></div>';
  var bars='';perfsSel().forEach(function(p){var b=booked(p.k),stt=perfState(p);bars+='<div class="br" data-tip="'+p.l+': '+b+' of '+c.seats+' booked · '+stt+'"><p>'+p.l+'</p><div class="trk"><i style="width:'+Math.min(100,b/c.seats*100)+'%"></i></div><span class="num">'+(stt==='held'?'held':b+'/'+c.seats)+'</span></div>';});
  var segCount={},ageCount={'18–34':0,'35–54':0,'55+':0},bk=allBookings();bk.forEach(function(x){segCount[x.seg]=(segCount[x.seg]||0)+x.seats;ageCount[x.age]=(ageCount[x.age]||0)+x.seats;});
  var sb='';SEGMENTS.forEach(function(s){var n=segCount[s.k]||0;if(!n&&c.segs.indexOf(s.k)<0)return;sb+='<div class="br" data-tip="'+s.l+': '+n+' seats"><p>'+s.l.split(' ').slice(0,2).join(' ')+'</p><div class="trk"><i class="b" style="width:'+(t.seats?n/t.seats*100:0)+'%"></i></div><span class="num">'+(t.seats?pct(n/t.seats):'0%')+'</span></div>';});
  var ab='';for(var k in ageCount){ab+='<div class="br" data-tip="Age '+k+': '+ageCount[k]+' seats"><p>'+k+'</p><div class="trk"><i class="b" style="width:'+(t.seats?ageCount[k]/t.seats*100:0)+'%"></i></div><span class="num">'+(t.seats?pct(ageCount[k]/t.seats):'0%')+'</span></div>';}
  var xs=releasable().map(function(p){return curve(windowX(p,nowD().getTime()));}),xa=xs.length?xs.reduce(function(s,v){return s+v;},0)/xs.length:0,live=overall()!=='sched';
  var saw=live?Math.round(reach()*Math.min(.92,.08+.84*xa)):0,opened=Math.round(saw*.18);
  var fun=[['Reached',reach()],['Saw it',saw],['Opened',opened],['Booked',t.count],['Turned up',after?t.scannedCount:0]];
  var fmax=fun[0][1]||1,fh='';fun.forEach(function(f){fh+='<div style="height:'+Math.max(3,Math.sqrt(f[1]/fmax)*100)+'%" data-tip="'+f[0]+': '+f[1].toLocaleString('en-GB')+'"><span>'+f[1].toLocaleString('en-GB')+'</span></div>';});
  var rows=bk.slice(-8).reverse().map(function(x){return '<div class="bi'+(x.src==='member'?' mine':'')+'" role="listitem"><div style="min-width:0"><p class="who">'+esc(x.who)+(x.src==='member'?' <span class="pill2 live">member app</span>':'')+'</p><p class="sm">'+perfLabel(x.perf)+' · '+agoLabel(x.at)+(after?' · '+(x.scanned?'scanned':'no-show'):'')+'</p></div>'+
    '<div style="flex:none"><p class="cr">'+(x.seats*x.cr)+' cr</p><p class="sm" style="text-align:right">'+x.seats+(x.seats===1?' seat':' seats')+'</p></div></div>';}).join('');
  h+='<div class="panel" style="margin-top:12px"><div class="row-b" style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><p class="lab">Booking pace</p><p class="lab">'+(after?'final':'solid: booked · dotted: forecast')+'</p></div>'+paceSvg()+'</div>'+
    '<div class="grid2"><div class="panel"><p class="lab">Booked by race day</p><div class="bars">'+bars+'</div><p class="hintline">"Held" race days stay with your own ticketing under the threshold rule.</p></div>'+
     '<div class="panel"><p class="lab">From reach to the door</p><div class="funnel">'+fh+'</div><div class="funnel-l">'+fun.map(function(f){return '<p>'+f[0]+'</p>';}).join('')+'</div><p class="hintline">People, not seats: one booking can include a plus-one. Bar height is on a square-root scale, so small steps stay visible.</p></div>'+
     '<div class="panel"><p class="lab">Who came · audience</p><div class="bars">'+(sb||'<p class="sub">No bookings yet.</p>')+'</div></div>'+
     '<div class="panel"><p class="lab">Who came · age</p><div class="bars">'+ab+'</div><p class="hintline">Aggregated, from members who consented to sharing.</p></div></div>'+
    '<div class="panel" style="margin-top:12px"><p class="lab">Latest bookings</p>'+(rows?'<div class="blist" role="list" style="margin-top:6px">'+rows+'</div>':'<p class="sub" style="margin-top:8px">No bookings yet. Move the timeline forward, or book it yourself in the member app.</p>')+'</div>'+
    ops('Encore contribution so far ≈ <b>'+gbp0(t.credits*BLENDED-t.pay)+'</b> on '+t.credits.toLocaleString('en-GB')+' credits. New-to-venue share is the number that sells the next partner.');
  return h;}
function viewPayouts(){var c=C(),t=totals(),after=P.clock==='after';
  if(!P.published)return emptyView('Payouts','No payouts yet','You\'re paid '+gbp(c.settle)+' per credit for every seat a member uses, '+c.payout.toLowerCase()+'.');
  var stL={live:['ok','On sale'],sched:['sched','Scheduled'],full:['live','Sold out'],closed:['draft','Closed'],done:['draft','Raced'],held:['draft','Held'],paused:['paused','Paused']};
  var rows='',bk=allBookings(),scCr=0,nsCr=0;
  perfsSel().forEach(function(p){var seats=0,sc=0,ns=0,cr=0,amt=0;
    bk.forEach(function(x){if(x.perf!==p.k)return;seats+=x.seats;cr+=x.seats*x.cr;
      if(after&&x.scanned){sc+=x.seats;scCr+=x.seats*x.cr;amt+=x.seats*x.cr*c.settle;}else if(after){ns+=x.seats;nsCr+=x.seats*x.cr;amt+=x.seats*x.cr*c.settle*c.noShow/100;}else amt+=x.seats*x.cr*c.settle;});
    var s=perfState(p),pl=held(p)?stL.held:after?['sched','Pays Friday']:(stL[s]||['draft',s]);
    rows+='<div class="pcard"><div class="hd"><b>'+p.l+'</b><span class="amt">'+gbp2(amt)+'</span></div><div style="margin-top:6px"><span class="pill2 '+pl[0]+'">'+pl[1]+'</span></div>'+
      '<div class="gr"><div><p class="lab">Booked</p><b>'+seats+'</b></div><div><p class="lab">Scanned</p><b>'+(after?sc:'—')+'</b></div><div><p class="lab">No-shows</p><b>'+(after?ns:'—')+'</b></div><div><p class="lab">Credits</p><b>'+cr.toLocaleString('en-GB')+'</b></div></div></div>';});
  var calc=after?row('Scanned · '+t.scanned+' seats · '+scCr.toLocaleString('en-GB')+' credits × '+gbp(c.settle),gbp2(scCr*c.settle))+
      row('No-shows · '+t.noshow+' seats · paid at '+c.noShow+'%',gbp2(nsCr*c.settle*c.noShow/100))+row('<b style="color:var(--ink)">Friday\'s payout</b>',gbp2(t.pay),'g'):
    row('Booked · '+t.seats+' seats · '+t.credits.toLocaleString('en-GB')+' credits × '+gbp(c.settle),gbp2(t.credits*c.settle))+
      row('Unbooked member seats','Back to your ticketing '+c.closeH+'h before')+row('<b style="color:var(--ink)">Forecast if every seat scans</b>',gbp2(t.pay),'g');
  return '<div class="vhead"><div><p class="lab">Payouts · settle '+gbp(c.settle)+' per credit</p><h1 class="t">Statement</h1></div><button class="btn ghost sm" data-pa="csv" data-v="payouts">Export CSV</button></div>'+viewClock()+
   '<div class="kpis"><div class="kpi hero"><p class="lab">'+(after?'Next payout':'Forecast for the run')+'</p><p class="n">'+gbp0(t.pay)+'</p><p class="d">'+(after?'Friday · bank transfer':'paid once seats are scanned')+'</p></div>'+
   '<div class="kpi"><p class="lab">Paid to date</p><p class="n">£0</p><p class="d">'+(after?'first payout this Friday':'first payout the Friday after the race')+'</p></div>'+
   '<div class="kpi"><p class="lab">'+(after?'Credits redeemed':'Credits committed')+'</p><p class="n">'+(after?scCr:t.credits).toLocaleString('en-GB')+'</p><p class="d">'+(after?'scanned at the gates':'on booked seats, paid when scanned')+'</p></div>'+
   '<div class="kpi"><p class="lab">Payout account</p><p class="n" style="font-size:20px">•••• 21</p><p class="d">verified · '+c.payout.toLowerCase()+'</p></div></div>'+
   '<div class="grid2"><div class="panel"><p class="lab">By race day</p><div class="pcards">'+rows+'</div></div>'+
   '<div class="panel"><p class="lab">How this is calculated</p><div style="margin-top:8px">'+calc+'</div>'+
   '<p class="hintline" style="margin-top:12px">No-shows paid at '+c.noShow+'%. Late cancellations '+(c.latePay?'paid in full':'not paid')+'. Free plus-ones paid at the same rate, funded by Encore.</p></div></div>'+
   ops('Encore keeps ≈ '+gbp0(t.credits*BLENDED-t.pay)+' on this run, before processing.');}
function csv(kind){var c=C(),lines;
  if(kind==='bookings'){lines=[['member','race_day','seats','credits','new_to_formula_e','segment','age','source','status']];allBookings().forEach(function(x){lines.push([x.who,perfLabel(x.perf),x.seats,x.seats*x.cr,x.newV,x.seg,x.age,x.src,P.clock==='after'?(x.scanned?'scanned':'no-show'):'booked']);});}
  else{lines=[['race_day','booked_seats','credits','settle_rate','amount_gbp']];perfsSel().forEach(function(p){var b=booked(p.k);lines.push([p.l,b,b*c.cr,c.settle,(b*c.cr*c.settle).toFixed(2)]);});}
  var blob=new Blob([lines.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n')],{type:'text/csv'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='encore_formula_e_'+kind+'_'+P.clock+'.csv';document.body.appendChild(a);a.click();a.remove();}

/* ---------------------------------------------------------------- menu and reset */
function sheetOpen(html){$('overlay').innerHTML='<div class="overlay" data-pa="sheetClose"><div class="asheet" role="dialog" aria-modal="true">'+html+'</div></div>';
  var b=$('overlay').querySelector('.asheet button');if(b)b.focus();}
function sheetClose(){$('overlay').innerHTML='';}
function openMenu(){sheetOpen('<div class="grp"><div class="hd"><b>'+PARTNER.name+' · Encore Partner</b><p>'+connTxt()+'</p></div>'+
  '<button class="plain" data-pa="openMember">'+ico('ext',18)+'Open member app</button>'+
  '<button class="plain" data-pa="ops">'+ico('eye',18)+'Ops lens: '+(P.ops?'on':'off')+'</button>'+
  '<button class="danger" data-pa="resetAsk">'+ico('reset',18)+'Reset partner view</button></div>'+
  '<div class="grp cancel"><button data-pa="sheetClose">Cancel</button></div>');}
function askReset(){sheetOpen('<div class="grp"><div class="hd"><b>Reset partner view?</b><p>This clears the Formula E set-up and its bookings, removes the event from the member app, and starts Cue again.</p></div>'+
  '<button class="danger" data-pa="resetGo">Reset partner view</button></div><div class="grp cancel"><button data-pa="sheetClose">Cancel</button></div>');}
function resetPartner(){GEN++;Q=[];busy=false;var ops=P.ops;P=pdefaults();P.ops=ops;lsDel(KEYS.inbox);lsSet(KEYS.epoch,String(Date.now()));psave();sheetClose();renderApp();}

/* ---------------------------------------------------------------- member-app bookings arrive here */
function ingestInbox(){var ids={},added=0;(P.member||[]).forEach(function(b){ids[b.id]=1;});
  readInbox().forEach(function(b){if(ids[b.id])return;P.member.push(b);added++;
    sys('🎟 New booking from the member app: <b>'+esc(b.who||'Member')+'</b>, '+b.seats+' seat'+(b.seats>1?'s':'')+' for '+perfLabel(b.perf)+' · '+(b.cr*b.seats)+' credits');
    if(P.view!=='perf')P.unseen++;});
  if(added){psave();if(P.published)say('That booking is already in Stats and on the payout forecast.');renderNav();renderSheet();renderView();}}
window.addEventListener('storage',function(e){if(e.key===KEYS.inbox)ingestInbox();});

/* ---------------------------------------------------------------- input */
document.addEventListener('click',function(ev){
  var el=ev.target.closest('[data-pa]');if(!el)return;var a=el.getAttribute('data-pa'),v=el.getAttribute('data-v'),k=el.getAttribute('data-k');
  if(a==='sheetClose'){if(ev.target===el||el.tagName==='BUTTON')sheetClose();return;}
  if(a==='say')handle(v);
  else if(a==='say2'){setView('agent');setTimeout(function(){handle(v);},60);}
  else if(a==='send'){var i=$('pin');var t=i.value;i.value='';i.style.height='';handle(t);}
  else if(a==='perf'){var c=C(),ix=c.perfs.indexOf(v);if(ix>-1)c.perfs.splice(ix,1);else{c.perfs.push(v);c.perfs.sort(function(x,y){return (x==='sat'?0:1)-(y==='sat'?0:1);});}refresh();flash('show');}
  else if(a==='tg'){var parts=k.split('.'),o=C();if(parts.length===2)o=o[parts[0]];o[parts[parts.length-1]]=!o[parts[parts.length-1]];refresh();flash(curId());}
  else if(a==='set'){var val=/^-?\d+(\.\d+)?$/.test(v)&&k!=='act'?parseFloat(v):v;C()[k]=val;if(k==='settle')C().approval=val>0.95;refresh();flash(curId());updateOuts();}
  else if(a==='mt'){var arr=C()[k],j=arr.indexOf(v);if(j>-1){if(arr.length>1)arr.splice(j,1);}else arr.push(v);refresh();flash(curId());updateOuts();}
  else if(a==='nav')setView(v);
  else if(a==='edit'){var n=parseInt(v,10);if(P.view!=='agent')setView('agent');userSay('Let\'s change '+SEC[STEP_IDS[n]].toLowerCase());
    setTimeout(function(){if(P.published){P.done[STEP_IDS[n]]=false;freezeAll();P.step=n;STEPS[STEP_IDS[n]].enter();}else gotoStep(n,true);},120);}
  else if(a==='clock'){if(v===P.clock)return;if(P.view==='agent'){userSay('Jump to '+phase(v).l.toLowerCase());setTimeout(function(){jumpClock(v);},100);}else{P.clock=v;psave();renderApp();}}
  else if(a==='sheettab'){P.sheetTab=v;psave();renderSheet();}
  else if(a==='ops'){P.ops=!P.ops;psave();sheetClose();renderApp();}
  else if(a==='menu')openMenu();
  else if(a==='resetAsk')askReset();
  else if(a==='resetGo')resetPartner();
  else if(a==='resume'){$('resumeSlot').innerHTML='';P.resumeAsk=false;freezeAll();say('Welcome back. Everything you set is saved. We were on <b>'+SEC[curId()].toLowerCase()+'</b>:');STEPS[curId()].enter();}
  else if(a==='resumeX'){$('resumeSlot').innerHTML='';P.resumeAsk=false;psave();}
  else if(a==='openMember'){sheetClose();openMember(false);}
  else if(a==='csv')csv(v);
});
document.addEventListener('input',function(ev){var el=ev.target;if(el.id==='pin'){el.style.height='';el.style.height=Math.min(120,el.scrollHeight+3)+'px';return;}
  var k=el.getAttribute&&el.getAttribute('data-pi');if(!k)return;
  var c=C();if(k==='seats'||k==='cr')c[k]=parseInt(el.value,10);else if(k==='settle'){c.settle=parseFloat(el.value);c.approval=c.settle>0.95;}else c[k]=el.value;
  if(k==='title'){var tiles=document.querySelectorAll('.vtitle');tiles.forEach(function(x){x.textContent=c.title;});}
  else updateOuts();
  renderSheet();psave();});
document.addEventListener('change',function(ev){var el=ev.target;if(el.getAttribute&&el.getAttribute('data-pi')&&el.type==='range'){refresh();flash(curId());}});
document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape'&&$('overlay').innerHTML){sheetClose();return;}
  if(ev.target&&ev.target.id==='pin'&&ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();var t=ev.target.value;ev.target.value='';ev.target.style.height='';handle(t);}});
var _tipT;
function showTip(el,x,y){var tip=$('tipEl');tip.textContent=el.getAttribute('data-tip');tip.hidden=false;
  var w=tip.offsetWidth,h=tip.offsetHeight;tip.style.left=Math.min(window.innerWidth-w-8,x+14)+'px';tip.style.top=Math.min(window.innerHeight-h-8,y+14)+'px';}
document.addEventListener('mousemove',function(ev){var el=ev.target.closest&&ev.target.closest('[data-tip]');if(!el){if(!_tipT)$('tipEl').hidden=true;return;}showTip(el,ev.clientX,ev.clientY);});
document.addEventListener('touchstart',function(ev){var el=ev.target.closest&&ev.target.closest('[data-tip]');if(!el)return;var t=ev.touches[0];showTip(el,t.clientX,t.clientY-40);
  clearTimeout(_tipT);_tipT=setTimeout(function(){$('tipEl').hidden=true;_tipT=null;},1800);},{passive:true});
var _wide=isWide();
window.addEventListener('resize',function(){var w=isWide();if(w!==_wide){_wide=w;renderApp();}});

/* ---------------------------------------------------------------- start: always on Cue */
(function(){P.view='agent';P.typing=false;
  if(P.started&&P.chat.length&&!P.published)P.resumeAsk=true;
  psave();renderApp();ingestInbox();})();
