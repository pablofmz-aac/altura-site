/* ============================================================
   ALTURA ATHLETICS — Calendario
   Lógica de cliente: i18n, expansión de reglas, grilla, panel de día
   ============================================================ */
(function(){
'use strict';

/* ---------- Tipos de EVENTO (de aquí sale el color de la grilla) ---------- */
var TYPES = {
  comunidad: {c:'var(--orange)', es:'Comunidad', en:'Community'},
  especial:  {c:'var(--green)',  es:'Especial',  en:'Special'},
  club:      {c:'var(--navy)',   es:'Club',      en:'Club'}
};
var TYPE_ORDER = ['comunidad','especial','club'];

/* ---------- Fases de un bloque de entrenamiento ----------
   Rampa monocroma a propósito: los colores de marca ya significan
   "tipo de evento", y una fase no es un tipo. La fase la comunica
   la intensidad del tono; la carrera, su forma de rombo. */
var PHASES = {
  base:         {c:'var(--fase-base)',  es:'Base',         en:'Base'},
  construccion: {c:'var(--fase-build)', es:'Construcción', en:'Build'},
  afinamiento:  {c:'var(--fase-peak)',  es:'Afinamiento',  en:'Taper'},
  recuperacion: {c:'var(--fase-rec)',   es:'Recuperación',  en:'Recovery'}
};

/* ---------- Diccionario ---------- */
var I18N = {
  es:{
    'nav.next':'Próximos','nav.cal':'Calendario','nav.info':'Cómo funciona',
    'cta.join':'Únete al grupo',
    'hero.sub':'Running club · Antigua Guatemala',
    'hero.slogan':'Corre alto, corre en comunidad',
    'hero.cta1':'Ver el calendario','hero.cta2':'Entrar al grupo de WhatsApp',
    'fact.alt':'Altura de Antigua','fact.week':'Entrenos por semana',
    'fact.freeN':'Gratis','fact.free':'Los de comunidad',
    'fact.clubL':'Al mes · entrenos del club',
    'next.kicker':'Lo que viene','next.title':'Próximos entrenamientos',
    'next.sub':'Llega unos minutos antes al punto de encuentro. No hace falta avisar.',
    'cal.kicker':'El mes completo','cal.title':'Calendario',
    'cal.tz':'Hora de Guatemala · GMT-6','cal.today':'Hoy',
    'cal.note':'Toca un día para ver los detalles y el punto de encuentro.',
    'how.kicker':'Primera vez','how.title':'Cómo funciona',
    'how.1t':'Entrenos de comunidad',
    'how.1p':'Miércoles a las 5 pm, el primer domingo de cada mes a las 6:30 am y el último martes del mes. Gratis y abierto a todos: no hay que inscribirse ni avisar. Cada fecha muestra su punto de encuentro en el calendario.',
    'how.2t':'Entrenos del club',
    'how.2p':'Lunes y viernes a las 5 pm. Entreno estructurado con plan y seguimiento, por 250 Q al mes. El punto de encuentro de cada día está en el calendario.',
    'how.3t':'Qué llevar',
    'how.3p':'Agua, tenis que aguanten adoquín y algo de abrigo: a las 5 pm ya baja el sol. Para los domingos largos, algo de comer.',
    'foot.club':'El club','foot.contact':'Contacto',
    'foot.wa':'Grupo de WhatsApp',
    'load':'Cargando entrenamientos…',
    'today':'Hoy','tomorrow':'Mañana',
    'l.time':'Hora','l.place':'Punto de encuentro','l.dist':'Distancia',
    'l.pace':'Ritmos','l.cost':'Costo',
    'l.route':'Ver el punto en el mapa','l.join':'Entrar al grupo de WhatsApp',
    'free':'Gratis',
    'st.tent':'Fecha tentativa — se confirma en el grupo de WhatsApp.',
    'st.canc':'Entrenamiento cancelado.',
    'empty.day':'No hay entrenamiento programado este día.',
    'empty.next':'No hay entrenamientos programados por ahora. Escríbenos en el grupo.',
    'empty.month':'Sin entrenamientos este mes.',
    'err':'No pudimos cargar el calendario. Recarga la página o escríbenos en el grupo.',
    'updated':'Actualizado',
    'nav.road':'El camino',
    'road.kicker':'Rumbo a las carreras','road.title':'El camino',
    'road.sub':'Los próximos seis meses: las carreras objetivo y el bloque de entrenamiento que lleva a cada una.',
    'road.banner':'Las carreras marcadas como ejemplo son una propuesta de estructura. Las fechas reales las confirma el club.',
    'road.sessions':'entrenos','road.signup':'Inscripción',
    'road.nothing':'Sin carreras programadas en este período.',
    'race.pill':'Carrera','race.example':'Ejemplo',
    'race.today':'¡Es hoy!','race.days':'Faltan {n} días','race.weeks':'Faltan {n} semanas',
    'race.toward':'Rumbo a','race.focus':'Enfoque del bloque',
    'st.example':'Fecha de ejemplo. Pendiente de confirmar con el club.',
    'cal.subscribe':'Agregar el calendario del club al mío',
    'l.addcal':'Agregar a mi calendario'
  },
  en:{
    'nav.next':'Up next','nav.cal':'Calendar','nav.info':'How it works',
    'cta.join':'Join the group',
    'hero.sub':'Running club · Antigua Guatemala',
    'hero.slogan':'Run high, run together',
    'hero.cta1':'See the calendar','hero.cta2':'Join the WhatsApp group',
    'fact.alt':"Antigua's elevation",'fact.week':'Sessions per week',
    'fact.freeN':'Free','fact.free':'Community sessions',
    'fact.clubL':'Per month · club sessions',
    'next.kicker':'Up next','next.title':'Upcoming sessions',
    'next.sub':'Show up a few minutes early at the meeting point. No need to RSVP.',
    'cal.kicker':'The full month','cal.title':'Calendar',
    'cal.tz':'Guatemala time · GMT-6','cal.today':'Today',
    'cal.note':'Tap a day for details and the meeting point.',
    'how.kicker':'First time','how.title':'How it works',
    'how.1t':'Community sessions',
    'how.1p':'Wednesdays at 5 pm, the first Sunday of every month at 6:30 am, and the last Tuesday of the month. Free and open to everyone — no sign-up, no need to RSVP. Every date shows its own meeting point on the calendar.',
    'how.2t':'Club sessions',
    'how.2p':'Mondays and Fridays at 5 pm. Structured training with a plan and follow-up, for 250 Q a month. Each day shows its meeting point on the calendar.',
    'how.3t':'What to bring',
    'how.3p':'Water, shoes that handle cobblestone, and a layer — the sun is already going down at 5 pm. Bring a snack for the long Sundays.',
    'foot.club':'The club','foot.contact':'Contact',
    'foot.wa':'WhatsApp group',
    'load':'Loading sessions…',
    'today':'Today','tomorrow':'Tomorrow',
    'l.time':'Time','l.place':'Meeting point','l.dist':'Distance',
    'l.pace':'Paces','l.cost':'Cost',
    'l.route':'View the spot on the map','l.join':'Join the WhatsApp group',
    'free':'Free',
    'st.tent':'Tentative date — confirmed in the WhatsApp group.',
    'st.canc':'Session cancelled.',
    'empty.day':'No session scheduled on this day.',
    'empty.next':'Nothing scheduled right now. Message us in the group.',
    'empty.month':'No sessions this month.',
    'err':'We could not load the calendar. Reload the page or message us in the group.',
    'updated':'Updated',
    'nav.road':'The road',
    'road.kicker':'Toward the races','road.title':'The road ahead',
    'road.sub':'The next six months: the target races and the training block that leads into each one.',
    'road.banner':'Races marked as examples are a proposed structure. The club confirms the real dates.',
    'road.sessions':'sessions','road.signup':'Sign up',
    'road.nothing':'No races scheduled in this period.',
    'race.pill':'Race','race.example':'Example',
    'race.today':'Race day!','race.days':'{n} days to go','race.weeks':'{n} weeks to go',
    'race.toward':'Building toward','race.focus':'Block focus',
    'st.example':'Example date. To be confirmed with the club.',
    'cal.subscribe':'Add the club calendar to mine',
    'l.addcal':'Add to my calendar'
  }
};

var MONTHS = {
  es:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  en:['January','February','March','April','May','June','July','August','September','October','November','December']
};
var MON3 = {
  es:['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'],
  en:['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
};
/* Semana de lunes a domingo (convención local) */
var DOW_SHORT = {es:['L','M','M','J','V','S','D'], en:['M','T','W','T','F','S','S']};
var DOW_LONG = {
  es:['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],
  en:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
};

/* ---------- Estado ---------- */
var S = {
  lang:'es',
  rules:[],
  races:[],           // carreras objetivo: las anclas del semestre
  blocks:[],          // bloques de Yuc; unen un rango de fechas con una carrera
  events:[],          // reglas expandidas + eventos puntuales + carreras, mezclados
  config:{},
  cursor:null,        // primer día del mes visible
  filters:null,       // Set de tipos activos
  openIso:null
};

/* ---------- Utilidades ---------- */
function $(s,r){return (r||document).querySelector(s)}
function el(tag,cls,txt){var n=document.createElement(tag); if(cls)n.className=cls; if(txt!=null)n.textContent=txt; return n}
function t(k){var d=I18N[S.lang]; return (d&&d[k]!=null)?d[k]:(I18N.es[k]||k)}
function slug(s){
  var o=String(s==null?'':s);
  if(o.normalize) o=o.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return o.toLowerCase().trim().replace(/[\s\-]+/g,'_');
}

/* 'YYYY-MM-DD' -> Date local (sin corrimiento de zona horaria) */
function parseIso(iso){
  var p=String(iso).slice(0,10).split('-');
  return new Date(+p[0], +p[1]-1, +p[2]);
}
function toIso(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function todayIso(){return toIso(new Date())}
/* Lunes = 0 … Domingo = 6 */
function dowMon(d){return (d.getDay()+6)%7}
function daysInMonth(y,m){return new Date(y,m+1,0).getDate()}

function fmtTime(hhmm){
  if(!hhmm) return '';
  var p=String(hhmm).split(':'); var h=+p[0]; var m=p[1]||'00';
  var ap = h<12 ? (S.lang==='es'?'a.m.':'AM') : (S.lang==='es'?'p.m.':'PM');
  var h12 = h%12; if(h12===0) h12=12;
  return h12+':'+m+' '+ap;
}
/* Versión compacta para el chip de la grilla. El sufijo a/p es obligatorio:
   el club entrena a las 17:00 y a las 6:30, y "5:00" solo sería ambiguo. */
function fmtTimeShort(hhmm){
  if(!hhmm) return '';
  var p=String(hhmm).split(':'); var h=+p[0]; var m=p[1]||'00';
  var h12=h%12; if(h12===0) h12=12;
  return h12 + (m==='00' ? '' : ':'+m) + (h<12 ? 'a' : 'p');
}
/* El costo es una sola columna en el Sheet: se traduce el caso común */
function fmtCost(c){
  if(!c) return '';
  if(/^(gratis|free|sin_costo|0)$/.test(slug(c))) return t('free');
  if(S.lang==='en') return String(c).replace(/\/\s*mes\b/i,'/month').replace(/\bal\s+mes\b/i,'per month');
  return c;
}
function txt(ev,base){
  /* Toma el campo del idioma activo, con el otro como respaldo */
  return ev[base+'_'+S.lang] || ev[base+'_es'] || ev[base+'_en'] || '';
}
function typeOf(ev){return TYPES[ev.type] ? ev.type : 'comunidad'}
function typeLabel(ev){var k=typeOf(ev); return TYPES[k][S.lang]||TYPES[k].es}
function typeColor(ev){return TYPES[typeOf(ev)].c}

function relLabel(iso){
  var today=todayIso();
  if(iso===today) return t('today');
  var tm=new Date(); tm.setDate(tm.getDate()+1);
  if(iso===toIso(tm)) return t('tomorrow');
  return null;
}

/* ============================================================
   GOOGLE CALENDAR
   Dos cosas distintas: suscribirse al calendario del club (todos los
   eventos, para siempre) y agregar un evento suelto.
   ============================================================ */
var DEFAULT_MIN = 90;   // duración asumida cuando el Sheet no la trae

/** Acepta un ID de calendario o una URL ya armada: lo que pongan en Config. */
function clubCalendarUrl(){
  var v=(S.config.calendario_google||'').trim();
  if(!v) return null;
  if(/^https?:\/\//i.test(v)) return v;
  return 'https://calendar.google.com/calendar/render?cid='+encodeURIComponent(v);
}

function stamp(d){
  return d.getFullYear()
    + String(d.getMonth()+1).padStart(2,'0')
    + String(d.getDate()).padStart(2,'0');
}
function stampTime(d){
  return stamp(d)+'T'
    + String(d.getHours()).padStart(2,'0')
    + String(d.getMinutes()).padStart(2,'0')+'00';
}

/** Link "plantilla" de Google Calendar. No necesita el calendario del club. */
function addToCalendarUrl(ev){
  var d=parseIso(ev.date);
  var range;
  if(ev.time){
    var p=String(ev.time).split(':');
    var ini=new Date(d.getFullYear(),d.getMonth(),d.getDate(),+p[0],+(p[1]||0));
    var fin=new Date(ini.getTime()+DEFAULT_MIN*60000);
    range=stampTime(ini)+'/'+stampTime(fin);
  } else {
    /* Sin hora se agrega como evento de día completo (las carreras) */
    var sig=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
    range=stamp(d)+'/'+stamp(sig);
  }

  var detalle=[txt(ev,'desc')];
  if(ev.distance) detalle.push(t('l.dist')+': '+ev.distance);
  if(ev.paces)    detalle.push(t('l.pace')+': '+ev.paces);
  if(ev.cost)     detalle.push(t('l.cost')+': '+fmtCost(ev.cost));

  var q=[
    'action=TEMPLATE',
    'text='+encodeURIComponent('Altura Athletics — '+txt(ev,'title')),
    'dates='+range,
    'ctz=America/Guatemala'
  ];
  var det=detalle.filter(Boolean).join('\n');
  if(det)      q.push('details='+encodeURIComponent(det));
  if(ev.place) q.push('location='+encodeURIComponent(ev.place));

  return 'https://calendar.google.com/calendar/render?'+q.join('&');
}

/* ============================================================
   CARRERAS Y BLOQUES
   El bloque es el puente: un entreno no apunta a una carrera, apunta al
   bloque en cuyo rango de fechas cae, y el bloque sí apunta a la carrera.
   Así Yuc define siete bloques en vez de etiquetar 26 miércoles.
   ============================================================ */
function daysBetween(aIso,bIso){
  return Math.round((parseIso(bIso)-parseIso(aIso))/86400000);
}
function raceById(id){
  for(var i=0;i<S.races.length;i++) if(S.races[i].id===id) return S.races[i];
  return null;
}
function blockOn(iso){
  for(var i=0;i<S.blocks.length;i++){
    var b=S.blocks[i];
    if(iso>=b.from && iso<=b.to) return b;
  }
  return null;
}
function phaseOf(b){return PHASES[b && b.phase] ? b.phase : 'base'}
function phaseLabel(b){var k=phaseOf(b); return PHASES[k][S.lang]||PHASES[k].es}

/** '{n}' se sustituye para no partir la frase en dos strings de i18n. */
function untilLabel(fromIso,raceIso){
  var d=daysBetween(fromIso,raceIso);
  if(d<0) return null;
  if(d===0) return t('race.today');
  if(d<7)  return t('race.days').replace('{n}',d);
  return t('race.weeks').replace('{n}',Math.round(d/7));
}

/** Contexto de carrera de un entreno: en qué bloque cae y hacia qué va. */
function raceContext(iso){
  var b=blockOn(iso);
  if(!b) return null;
  var r=b.race ? raceById(b.race) : null;
  return {block:b, race:r, until:r ? untilLabel(iso,r.date) : null};
}

/** Las carreras también son eventos del calendario, no solo hitos. */
function racesAsEvents(){
  return S.races.map(function(r){
    return {
      date:r.date, rule:'', time:'', type:'especial',
      title_es:r.name, title_en:r.name,
      desc_es:r.notes_es, desc_en:r.notes_en,
      place:r.place, mapUrl:'', distance:r.distances,
      paces:'', cost:'',
      status:r.status, isRace:true, raceId:r.id, signup:r.signup
    };
  });
}

/* ============================================================
   EXPANSIÓN DE REGLAS RECURRENTES
   Cinco filas en el Sheet se convierten aquí en las fechas del año.
   ============================================================ */
function expandRules(rules,from,to){
  var out=[];
  var d=new Date(from.getFullYear(),from.getMonth(),from.getDate());
  while(d<=to){
    var dw=dowMon(d);
    var dom=d.getDate();
    var nth=Math.floor((dom-1)/7)+1;                                  // 1º…5º de ese día
    var isLast=(dom+7)>daysInMonth(d.getFullYear(),d.getMonth());     // no cabe otro igual
    for(var i=0;i<rules.length;i++){
      var r=rules[i];
      if(!r.active || r.dow!==dw) continue;
      var hit = r.freq==='semanal' ? true
              : r.freq==='ultimo'  ? isLast
              : r.freq===('n'+nth);
      if(!hit) continue;
      out.push({
        date:toIso(d), rule:r.id, time:r.time, type:r.type,
        title_es:r.title_es, title_en:r.title_en,
        desc_es:r.desc_es,   desc_en:r.desc_en,
        place:r.place, mapUrl:r.mapUrl, distance:r.distance,
        paces:r.paces, cost:r.cost,
        status:'confirmado', recurring:true
      });
    }
    d.setDate(d.getDate()+1);
  }
  return out;
}

var OVERRIDABLE = ['time','type','title_es','title_en','desc_es','desc_en',
                   'place','mapUrl','distance','paces','cost'];

/** Una fila de "Eventos" con Regla + Fecha sobrescribe esa ocurrencia;
    solo lo que trae lleno, el resto lo hereda de la regla. */
function applyOverride(base,m){
  var out={};
  for(var k in base) out[k]=base[k];
  OVERRIDABLE.forEach(function(f){ if(m[f]) out[f]=m[f] });
  out.status = m.status || 'confirmado';
  out.overridden = true;
  return out;
}

function mergeEvents(generated,manual){
  var byKey={}, order=[];
  generated.forEach(function(e){
    var k=e.date+'|'+e.rule;
    if(!(k in byKey)) order.push(k);
    byKey[k]=e;
  });

  var extras=[];
  manual.forEach(function(m){
    var k=m.date+'|'+m.rule;
    if(m.rule && (k in byKey)){
      byKey[k]=applyOverride(byKey[k],m);
    } else if(m.title_es || m.title_en){
      /* Evento puntual, o una regla que no cae ese día: va como extra */
      extras.push(m);
    }
  });

  return order.map(function(k){return byKey[k]}).concat(extras)
    .sort(function(a,b){
      return a.date===b.date ? String(a.time).localeCompare(String(b.time))
                             : a.date.localeCompare(b.date);
    });
}

/* ---------- i18n ---------- */
function applyI18n(){
  document.documentElement.lang = S.lang;
  var nodes=document.querySelectorAll('[data-i18n]');
  for(var i=0;i<nodes.length;i++){
    var k=nodes[i].getAttribute('data-i18n');
    var v=I18N[S.lang][k];
    if(v!=null) nodes[i].textContent=v;
  }
  var btns=document.querySelectorAll('.lang button');
  for(var j=0;j<btns.length;j++){
    btns[j].setAttribute('aria-pressed', String(btns[j].getAttribute('data-lang')===S.lang));
  }
}
function setLang(l){
  if(l!==S.lang){
    S.lang=l;
    try{localStorage.setItem('altura.lang',l)}catch(e){}
  }
  applyI18n();
  renderAll();
}

/* ---------- Enlaces del club ---------- */
/** Prefiere el enlace del grupo; si no hay, usa el número directo. */
function waLink(msg){
  var g=(S.config.whatsapp_grupo||'').trim();
  if(g) return g;
  var num=(S.config.whatsapp||'').replace(/[^0-9]/g,'');
  if(!num) return null;
  var base='https://wa.me/'+num;
  return msg ? base+'?text='+encodeURIComponent(msg) : base;
}
function wireJoin(){
  var link=waLink(S.lang==='es'
    ? 'Hola Altura Athletics, quiero unirme a un entrenamiento.'
    : 'Hi Altura Athletics, I would like to join a session.');
  var nodes=document.querySelectorAll('[data-join]');
  for(var i=0;i<nodes.length;i++){
    if(link){nodes[i].href=link; nodes[i].target='_blank'; nodes[i].rel='noopener'}
    else nodes[i].href='#calendario';
  }
}
function renderFootLinks(){
  var ul=$('#footLinks'); if(!ul) return;
  ul.innerHTML='';
  var items=[
    {label:t('foot.wa'), href:waLink()},
    {label:'Instagram',  href:S.config.instagram},
    {label:'Strava',     href:S.config.strava},
    {label:S.config.email, href:S.config.email?('mailto:'+S.config.email):null}
  ];
  for(var i=0;i<items.length;i++){
    var it=items[i]; if(!it.href||!it.label) continue;
    var li=el('li'), a=el('a',null,it.label);
    a.href=it.href; a.target='_blank'; a.rel='noopener';
    li.appendChild(a); ul.appendChild(li);
  }
  if(!ul.children.length){
    ul.appendChild(el('li')).appendChild(el('span',null,'Antigua Guatemala'));
  }
}

/* ============================================================
   PRÓXIMOS ENTRENAMIENTOS
   ============================================================ */
function renderUpNext(){
  var box=$('#upnext'); if(!box) return;
  box.innerHTML='';
  var today=todayIso();
  var next=S.events.filter(function(e){return e.date>=today && e.status!=='cancelado'}).slice(0,3);

  if(!next.length){
    var em=el('div','skel',t('empty.next'));
    em.style.gridColumn='1/-1';
    box.appendChild(em);
    return;
  }

  next.forEach(function(ev,idx){
    var d=parseIso(ev.date);
    var card=el('button','ucard'+(idx===0?' feat':''));
    card.type='button';
    card.style.setProperty('--tc', typeColor(ev));
    card.setAttribute('aria-label', txt(ev,'title'));

    var top=el('div','u-top');
    var dt=el('div','u-date');
    dt.appendChild(el('div','u-date-d', String(d.getDate())));
    dt.appendChild(el('div','u-date-m', MON3[S.lang][d.getMonth()]));
    top.appendChild(dt);

    var hd=el('div','u-headings');
    var tags=el('div','u-tags');
    var pill=el('span','pill');
    pill.appendChild(el('i','pill-dot'));
    pill.appendChild(el('span',null,typeLabel(ev)));
    tags.appendChild(pill);
    var rel=relLabel(ev.date);
    if(rel) tags.appendChild(el('span','badge-today',rel));
    hd.appendChild(tags);
    hd.appendChild(el('h3',null,txt(ev,'title')));
    top.appendChild(hd);
    card.appendChild(top);

    var desc=txt(ev,'desc');
    if(desc) card.appendChild(el('p','u-desc',desc));

    if(!ev.isRace){
      var uctx=raceContext(ev.date);
      if(uctx && uctx.race && uctx.until){
        var strip=el('div','u-toward');
        strip.appendChild(el('span','u-toward-lbl', t('race.toward')));
        strip.appendChild(el('span','u-toward-race', uctx.race.name));
        strip.appendChild(el('span','u-toward-until', uctx.until));
        card.appendChild(strip);
      }
    }

    var rows=el('div','u-rows');
    rows.appendChild(row('i-clock', DOW_LONG[S.lang][dowMon(d)], ev.time ? fmtTime(ev.time) : ''));
    if(ev.place)    rows.appendChild(row('i-pin', ev.place, ''));
    if(ev.distance) rows.appendChild(row('i-dist', t('l.dist'), ev.distance));
    if(ev.paces)    rows.appendChild(row('i-pace', t('l.pace'), ev.paces));
    if(ev.cost)     rows.appendChild(row('i-tag',  t('l.cost'), fmtCost(ev.cost)));
    card.appendChild(rows);

    card.addEventListener('click', function(){openDay(ev.date)});
    box.appendChild(card);
  });
}
function icon(name,size){
  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  var use=document.createElementNS('http://www.w3.org/2000/svg','use');
  use.setAttribute('href','#'+name);
  svg.appendChild(use);
  svg.setAttribute('aria-hidden','true');
  if(size){svg.setAttribute('width',size); svg.setAttribute('height',size)}
  return svg;
}
function row(ic,label,meta){
  var r=el('div','u-row');
  r.appendChild(icon(ic));
  r.appendChild(el('span',null,label));
  if(meta) r.appendChild(el('span','u-meta',meta));
  return r;
}

/* ============================================================
   EL CAMINO — vista de seis meses
   Un carril vertical por mes: la fase que se trabaja y las carreras
   como hitos. Vertical a propósito: casi todo el club lo abre en el
   teléfono, y así también sirve como captura para redes.
   ============================================================ */
var ROAD_MONTHS = 6;

function renderRoad(){
  var sect=$('#camino'), wrap=$('#road'), note=$('#roadNote');
  if(!sect || !wrap) return;

  /* Sin carreras la sección no aporta nada: se oculta completa. */
  if(!S.races.length){ sect.hidden=true; return; }
  sect.hidden=false;
  wrap.innerHTML='';

  if(note){
    var hayEjemplo=S.races.some(function(r){return r.status==='ejemplo'});
    note.hidden=!hayEjemplo;
    if(hayEjemplo) note.textContent=t('road.banner');
  }

  var now=new Date();
  var pintadas=0;

  for(var m=0;m<ROAD_MONTHS;m++){
    var first=new Date(now.getFullYear(), now.getMonth()+m, 1);
    var last =new Date(now.getFullYear(), now.getMonth()+m+1, 0);
    var a=toIso(first), z=toIso(last);

    var races=S.races.filter(function(r){return r.date>=a && r.date<=z});
    var blocks=S.blocks.filter(function(b){return b.from<=z && b.to>=a});
    var sessions=S.events.filter(function(e){
      return e.date>=a && e.date<=z && !e.isRace && e.status!=='cancelado';
    }).length;

    var mo=el('div','mo'+(races.length?' has-race':''));

    var rail=el('div','mo-rail');
    var dot=el('i','mo-dot');
    if(blocks.length) dot.style.setProperty('--pc', PHASES[phaseOf(blocks[0])].c);
    rail.appendChild(dot);
    mo.appendChild(rail);

    var card=el('div','mo-card');

    var top=el('div','mo-top');
    var h=el('h3');
    h.appendChild(document.createTextNode(MONTHS[S.lang][first.getMonth()]+' '));
    h.appendChild(el('em',null,String(first.getFullYear())));
    top.appendChild(h);
    if(sessions) top.appendChild(el('div','mo-tally', sessions+' '+t('road.sessions')));
    card.appendChild(top);

    if(blocks.length){
      var ph=el('div','phases');
      blocks.forEach(function(b){
        var chip=el('span','phase');
        chip.style.setProperty('--pc', PHASES[phaseOf(b)].c);
        chip.appendChild(el('i'));
        chip.appendChild(el('span',null, txt(b,'name') || phaseLabel(b)));
        chip.title=txt(b,'focus')||'';
        ph.appendChild(chip);
      });
      card.appendChild(ph);
    }

    races.forEach(function(r){ card.appendChild(raceCard(r)); pintadas++; });
    mo.appendChild(card);
    wrap.appendChild(mo);
  }

  if(!pintadas) wrap.appendChild(el('p','road-empty', t('road.nothing')));
}

function raceCard(r){
  var d=parseIso(r.date);
  var card=el('button','race');
  card.type='button';
  card.setAttribute('aria-label', r.name);

  var dt=el('div','race-date');
  dt.appendChild(el('b',null,String(d.getDate())));
  dt.appendChild(el('span',null,MON3[S.lang][d.getMonth()]));
  card.appendChild(dt);

  var main=el('div','race-main');

  var tags=el('div','race-tags');
  var pill=el('span','pill');
  pill.style.setProperty('--tc','var(--green)');
  pill.appendChild(el('i','pill-dot'));
  pill.appendChild(el('span',null,t('race.pill')));
  tags.appendChild(pill);
  if(r.status==='ejemplo') tags.appendChild(el('span','badge-ex',t('race.example')));
  main.appendChild(tags);

  main.appendChild(el('h4',null,r.name));

  var meta=[r.place, r.distances].filter(Boolean).join(' · ');
  if(meta) main.appendChild(el('p','race-meta',meta));

  var u=untilLabel(todayIso(), r.date);
  if(u) main.appendChild(el('p','race-until',u));

  card.appendChild(main);
  card.addEventListener('click',function(){openDay(r.date)});
  return card;
}

/* ============================================================
   LEYENDA + FILTROS
   ============================================================ */
function renderLegend(){
  var box=$('#legend'); if(!box) return;
  box.innerHTML='';
  TYPE_ORDER.forEach(function(k){
    if(!S.events.some(function(e){return typeOf(e)===k})) return;
    var b=el('button','leg');
    b.type='button';
    b.style.setProperty('--tc', TYPES[k].c);
    b.setAttribute('aria-pressed', String(S.filters.has(k)));
    b.appendChild(el('i'));
    b.appendChild(el('span',null,TYPES[k][S.lang]||TYPES[k].es));
    b.addEventListener('click',function(){
      if(S.filters.has(k)) S.filters.delete(k); else S.filters.add(k);
      if(!S.filters.size) TYPE_ORDER.forEach(function(x){S.filters.add(x)}); // nunca todo apagado
      renderLegend(); renderGrid();
    });
    box.appendChild(b);
  });
}

/* ============================================================
   GRILLA MENSUAL
   ============================================================ */
function renderDow(){
  var box=$('#dow'); if(!box) return;
  box.innerHTML='';
  DOW_SHORT[S.lang].forEach(function(d){box.appendChild(el('span',null,d))});
}

function eventsOn(iso){
  return S.events.filter(function(e){
    return e.date===iso && S.filters.has(typeOf(e));
  });
}

function renderGrid(){
  var box=$('#grid'); if(!box) return;
  box.innerHTML='';

  var c=S.cursor;
  $('#calMonth').textContent = MONTHS[S.lang][c.getMonth()]+' '+c.getFullYear();

  var first=new Date(c.getFullYear(), c.getMonth(), 1);
  var offset=dowMon(first);                                     // relleno al inicio
  var dim=daysInMonth(c.getFullYear(), c.getMonth());
  var total=Math.ceil((offset+dim)/7)*7;                        // siempre semanas completas
  var start=new Date(c.getFullYear(), c.getMonth(), 1-offset);
  var today=todayIso();

  for(var i=0;i<total;i++){
    var d=new Date(start.getFullYear(), start.getMonth(), start.getDate()+i);
    var iso=toIso(d);
    var outside = d.getMonth()!==c.getMonth() || d.getFullYear()!==c.getFullYear();
    var evs=eventsOn(iso);

    var cell=el(evs.length?'button':'div','cell'+(outside?' out':'')+(evs.length?' has':'')+(iso===today?' today':''));
    if(evs.length){cell.type='button'; cell.setAttribute('aria-label', d.getDate()+' — '+evs.length)}

    cell.appendChild(el('div','cell-n', String(d.getDate())));

    var dots=el('div','dots');
    evs.forEach(function(ev){
      var e1=el('div','ev'+(ev.status==='cancelado'?' off':'')+(ev.isRace?' is-race':''));
      e1.style.setProperty('--tc', typeColor(ev));
      /* Las carreras no llevan hora: en su lugar va el rombo que las marca */
      e1.appendChild(ev.time ? el('span','ev-t', fmtTimeShort(ev.time))
                             : el('span','ev-flag','◆'));
      e1.appendChild(el('span','ev-n', txt(ev,'title')));
      cell.appendChild(e1);

      var dot=el('i'); dot.style.setProperty('--tc', typeColor(ev)); dots.appendChild(dot);
    });
    cell.appendChild(dots);

    if(evs.length){
      (function(iso){cell.addEventListener('click',function(){openDay(iso)})})(iso);
    }
    box.appendChild(cell);
  }

  var any=S.events.some(function(e){
    var d=parseIso(e.date);
    return d.getMonth()===c.getMonth() && d.getFullYear()===c.getFullYear();
  });
  var note=$('#calNote');
  if(note) note.textContent = any ? t('cal.note') : t('empty.month');
}

function shiftMonth(n){
  S.cursor=new Date(S.cursor.getFullYear(), S.cursor.getMonth()+n, 1);
  renderGrid();
}

/* ============================================================
   PANEL DE DÍA
   ============================================================ */
function openDay(iso){
  var evs=S.events.filter(function(e){return e.date===iso});
  var d=parseIso(iso);
  S.openIso=iso;

  $('#sheetDow').textContent = DOW_LONG[S.lang][dowMon(d)];
  $('#sheetTitle').textContent = d.getDate()+' '+MONTHS[S.lang][d.getMonth()];

  var body=$('#sheetBody');
  body.innerHTML='';

  if(!evs.length) body.appendChild(el('p','dev',t('empty.day')));

  evs.forEach(function(ev){
    var w=el('div','dev');
    var pill=el('span','pill');
    pill.style.setProperty('--tc', typeColor(ev));
    pill.appendChild(el('i','pill-dot'));
    pill.appendChild(el('span',null,typeLabel(ev)));
    w.appendChild(pill);

    w.appendChild(el('h4',null,txt(ev,'title')));

    if(ev.status==='tentativo') w.appendChild(el('div','status-note tent',t('st.tent')));
    if(ev.status==='cancelado') w.appendChild(el('div','status-note canc',t('st.canc')));
    if(ev.status==='ejemplo')   w.appendChild(el('div','status-note tent',t('st.example')));

    var desc=txt(ev,'desc');
    if(desc) w.appendChild(el('p',null,desc));

    /* Un entreno dentro de un bloque muestra hacia dónde va */
    if(!ev.isRace){
      var ctx=raceContext(ev.date);
      if(ctx && ctx.race){
        var box=el('div','toward');
        box.style.setProperty('--pc', PHASES[phaseOf(ctx.block)].c);
        var line=el('div','toward-line');
        line.appendChild(el('span','toward-lbl', t('race.toward')));
        line.appendChild(el('strong',null, ctx.race.name));
        if(ctx.until) line.appendChild(el('span','toward-until', ctx.until));
        box.appendChild(line);
        var focus=txt(ctx.block,'focus');
        if(focus) box.appendChild(el('p','toward-focus', focus));
        w.appendChild(box);
      }
    }

    var g=el('div','dev-grid');
    if(ev.time) g.appendChild(info(t('l.time'), fmtTime(ev.time)));
    if(ev.cost)     g.appendChild(info(t('l.cost'), fmtCost(ev.cost)));
    if(ev.distance) g.appendChild(info(t('l.dist'), ev.distance));
    if(ev.paces)    g.appendChild(info(t('l.pace'), ev.paces));
    if(ev.place)    g.appendChild(info(t('l.place'), ev.place));
    w.appendChild(g);

    if(ev.isRace && ev.signup){
      var sg=el('a','btn btn-primary');
      sg.href=ev.signup; sg.target='_blank'; sg.rel='noopener';
      sg.appendChild(el('span',null,t('road.signup')));
      w.appendChild(sg);
    }

    if(ev.status!=='cancelado'){
      var ac=el('a','btn btn-ghost');
      ac.href=addToCalendarUrl(ev); ac.target='_blank'; ac.rel='noopener';
      ac.appendChild(icon('i-cal',15));
      ac.appendChild(el('span',null,t('l.addcal')));
      w.appendChild(ac);
    }

    if(ev.mapUrl){
      var a=el('a','btn btn-ghost');
      a.href=ev.mapUrl; a.target='_blank'; a.rel='noopener';
      a.appendChild(icon('i-map',15));
      a.appendChild(el('span',null,t('l.route')));
      w.appendChild(a);
    }
    body.appendChild(w);
  });

  /* Un solo CTA al final del panel */
  var link=waLink();
  if(link && evs.length){
    var cta=el('div','dev');
    var a2=el('a','btn btn-primary');
    a2.href=link; a2.target='_blank'; a2.rel='noopener';
    a2.appendChild(icon('i-wa',15));
    a2.appendChild(el('span',null,t('l.join')));
    cta.appendChild(a2);
    body.appendChild(cta);
  }

  var scrim=$('#scrim');
  scrim.hidden=false;
  requestAnimationFrame(function(){scrim.classList.add('on')});
  document.body.style.overflow='hidden';
  $('#sheetClose').focus();
}
function info(label,val){
  var dl=el('dl','dinfo');
  dl.appendChild(el('dt',null,label));
  dl.appendChild(el('dd',null,val));
  return dl;
}
function closeDay(){
  var scrim=$('#scrim');
  scrim.classList.remove('on');
  document.body.style.overflow='';
  S.openIso=null;
  setTimeout(function(){if(!scrim.classList.contains('on')) scrim.hidden=true},220);
}

/* ============================================================
   RENDER GENERAL
   ============================================================ */
/** Botón de suscripción: solo existe si hay un calendario en Config. */
function renderSubscribe(){
  var box=$('#calSub'); if(!box) return;
  box.innerHTML='';
  var url=clubCalendarUrl();
  if(!url){ box.hidden=true; return; }
  box.hidden=false;
  var a=el('a','btn btn-ghost');
  a.href=url; a.target='_blank'; a.rel='noopener';
  a.appendChild(icon('i-cal',15));
  a.appendChild(el('span',null,t('cal.subscribe')));
  box.appendChild(a);
}

function renderAll(){
  wireJoin();
  renderSubscribe();
  renderFootLinks();
  renderUpNext();
  renderRoad();
  renderLegend();
  renderDow();
  renderGrid();
  if(S.openIso) openDay(S.openIso);
  var st=$('#stamp');
  if(st && S.config.updated) st.textContent=t('updated')+' · '+S.config.updated;
}

function showError(){
  var box=$('#upnext');
  if(box){box.innerHTML=''; var e=el('div','err',t('err')); e.style.gridColumn='1/-1'; box.appendChild(e)}
}

/* ============================================================
   CARGA DE DATOS
   ============================================================ */
function boot(payload){
  S.config = payload.config||{};
  S.rules  = payload.rules||[];
  S.races  = payload.races||[];
  S.blocks = payload.blocks||[];

  /* Ventana de expansión: un mes atrás y un año adelante */
  var now=new Date();
  var from=new Date(now.getFullYear(), now.getMonth()-1, 1);
  var to  =new Date(now.getFullYear(), now.getMonth()+13, 0);
  S.events = mergeEvents(expandRules(S.rules, from, to), payload.events||[])
    .concat(racesAsEvents())
    .sort(function(a,b){
      return a.date===b.date ? String(a.time).localeCompare(String(b.time))
                             : a.date.localeCompare(b.date);
    });

  S.filters = new Set(TYPE_ORDER);

  /* Abre en el mes del próximo entrenamiento; si no hay, en el actual */
  var today=todayIso();
  var nx=S.events.filter(function(e){return e.date>=today})[0];
  var base = nx ? parseIso(nx.date) : now;
  S.cursor = new Date(base.getFullYear(), base.getMonth(), 1);

  applyI18n();
  renderAll();
}

/* URL de la implementación de Apps Script. Se usa en modo API (?api=1):
   el Sheet sigue siendo la fuente, este sitio solo lo pinta. */
var API_URL='https://script.google.com/macros/s/AKfycbwoCZINWGcmsM2ES6EzBxMhEBU6V74RRzZzriXYfWye_REcOnvTc7-MhepGKgGMh3qFTg/exec';

/** JSONP: respaldo si el navegador bloquea el fetch por CORS. */
function loadJsonp(){
  var cb='alturaCb'+Date.now();
  var s=document.createElement('script');
  var timer=setTimeout(fail,15000);
  function cleanup(){clearTimeout(timer); try{delete window[cb]}catch(e){window[cb]=undefined} if(s.parentNode) s.parentNode.removeChild(s)}
  function fail(){cleanup(); showError()}
  window[cb]=function(data){cleanup(); boot(data)};
  s.onerror=fail;
  s.src=API_URL+'?api=1&callback='+cb;
  document.body.appendChild(s);
}

function load(){
  if(typeof google!=='undefined' && google.script && google.script.run){
    /* Sigue funcionando si alguien abre la versión servida por Apps Script */
    google.script.run
      .withSuccessHandler(boot)
      .withFailureHandler(function(err){console.error(err); showError()})
      .getCalendarData();
  } else if(window.ALTURA_MOCK){
    boot(window.ALTURA_MOCK);
  } else {
    fetch(API_URL+'?api=1')
      .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json() })
      .then(boot)
      .catch(function(err){ console.warn('fetch falló, probando JSONP', err); loadJsonp() });
  }
}

/* ============================================================
   INICIO
   ============================================================ */
document.addEventListener('DOMContentLoaded', function(){
  try{
    var saved=localStorage.getItem('altura.lang');
    if(saved==='es'||saved==='en') S.lang=saved;
    else if((navigator.language||'').toLowerCase().indexOf('es')!==0) S.lang='en';
  }catch(e){}

  var yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();

  var lb=document.querySelectorAll('.lang button');
  for(var i=0;i<lb.length;i++){
    (function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-lang'))})})(lb[i]);
  }
  $('#prevM').addEventListener('click',function(){shiftMonth(-1)});
  $('#nextM').addEventListener('click',function(){shiftMonth(1)});
  $('#todayM').addEventListener('click',function(){
    var n=new Date(); S.cursor=new Date(n.getFullYear(),n.getMonth(),1); renderGrid();
  });
  $('#sheetClose').addEventListener('click',closeDay);
  $('#scrim').addEventListener('click',function(e){if(e.target===this)closeDay()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDay()});

  applyI18n();
  load();
});
})();
