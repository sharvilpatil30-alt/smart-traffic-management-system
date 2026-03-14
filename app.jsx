const { useState, useEffect, useRef } = React;

/* ─── THEME — matches the uploaded image exactly ─────────────────────────── */
const C = {
  bg:       "#f0ede6",
  card:     "#1c1c1e",
  cardBord: "rgba(255,255,255,0.06)",
  pill:     "#e8e4dc",
  pillBord: "#d4cfc5",
  accent1:  "#c8f03a",   // lime-yellow
  accent2:  "#f5d800",   // warm yellow
  accent3:  "#4ade80",   // green
  mint:     "#b2f2d6",
  blush:    "#f7c8e0",
  lemon:    "#f5f0a0",
  sky:      "#c0e8f8",
  text:     "#111111",
  textCard: "#ffffff",
  muted:    "#888880",
  mutedCard:"rgba(255,255,255,0.45)",
  red:      "#ff4444",
  orange:   "#ff8c42",
  blue:     "#60a5fa",
};

const NAV = [
  { id:"overview",   icon:"◉", label:"Overview"  },
  { id:"weather",    icon:"◈", label:"Weather"   },
  { id:"emergency",  icon:"✦", label:"Emergency" },
  { id:"parking",    icon:"⬡", label:"Parking"   },
  { id:"reports",    icon:"◇", label:"Reports"   },
  { id:"analytics",  icon:"▣", label:"Analytics" },
];

/* ─── Animated counter ──────────────────────────────────────────────────── */
function useCount(to, ms = 1500) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s;
    const id = requestAnimationFrame(function tick(t) {
      if (!s) s = t;
      const p = Math.min((t - s) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * e));
      if (p < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [to]);
  return v;
}

/* ─── Holographic blob background ───────────────────────────────────────── */
function BlobBg() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", top:"-8%", right:"5%",  width:380, height:380, borderRadius:"50%", background:`radial-gradient(circle, ${C.mint}cc, ${C.sky}88, transparent 70%)`, filter:"blur(60px)", animation:"bfloat 8s ease-in-out infinite" }}/>
      <div style={{ position:"absolute", top:"15%", right:"-5%", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${C.blush}cc, #f9c8f088, transparent 70%)`, filter:"blur(55px)", animation:"bfloat 11s ease-in-out infinite 2s" }}/>
      <div style={{ position:"absolute", bottom:"10%", right:"15%", width:260, height:260, borderRadius:"50%", background:`radial-gradient(circle, ${C.lemon}dd, #fde68a88, transparent 70%)`, filter:"blur(50px)", animation:"bfloat 9s ease-in-out infinite 4s" }}/>
      <div style={{ position:"absolute", top:"45%", right:"30%", width:200, height:200, borderRadius:"50%", background:`radial-gradient(circle, ${C.mint}88, transparent 70%)`, filter:"blur(45px)", animation:"bfloat 13s ease-in-out infinite 1s" }}/>
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────────────────── */
function Toggle({ on, onChange, color = C.accent1, size = "md" }) {
  const w = size==="sm" ? 36 : 44, h = size==="sm" ? 20 : 24, d = h - 4;
  return (
    <button onClick={() => onChange(!on)} style={{
      width:w, height:h, borderRadius:h,
      background: on ? color : "#d4cfc5",
      border:"none", cursor:"pointer", position:"relative", outline:"none", flexShrink:0,
      transition:"background .3s cubic-bezier(0.4,0,0.2,1), box-shadow .3s",
      boxShadow: on ? `0 0 14px ${color}70` : "none",
    }}>
      <span style={{
        position:"absolute", top:2, left: on ? w-d-2 : 2,
        width:d, height:d, borderRadius:"50%",
        background:"white",
        boxShadow:"0 1px 4px rgba(0,0,0,0.25)",
        transition:"left .32s cubic-bezier(0.34,1.56,0.64,1)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{ width:d*.35, height:d*.35, borderRadius:"50%", background:on?color:"transparent", transition:"background .25s, transform .25s", transform:on?"scale(1)":"scale(0)" }}/>
      </span>
    </button>
  );
}

/* ─── Donut chart ────────────────────────────────────────────────────────── */
function Donut({ value, color, label, size=90, stroke=9 }) {
  const [v, setV] = useState(0);
  useEffect(() => { const t = setTimeout(()=>setV(value), 350); return ()=>clearTimeout(t); }, [value]);
  const r = (size/2) - stroke - 2, circ = 2*Math.PI*r;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(v/100)*circ} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition:"stroke-dasharray 1.1s cubic-bezier(0.34,1.4,0.64,1)" }}/>
        <text x={size/2} y={size/2+5} textAnchor="middle" fill="white" fontSize="14" fontFamily="'DM Serif Display',serif" fontWeight="400">{v}%</text>
      </svg>
      <span style={{ color:C.mutedCard, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>{label}</span>
    </div>
  );
}

/* ─── Horizontal progress bar ────────────────────────────────────────────── */
function HBar({ label, value, color, delay=0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(()=>setW(value), delay+300); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:1 }}>{label}</span>
        <span style={{ color:"white", fontFamily:"'DM Serif Display',serif", fontSize:13 }}>{value}%</span>
      </div>
      <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${w}%`, background:`linear-gradient(90deg,${color},${color}cc)`, borderRadius:10, transition:`width 1s cubic-bezier(0.34,1.4,0.64,1) ${delay}ms`, boxShadow:`0 0 8px ${color}60` }}/>
      </div>
    </div>
  );
}

/* ─── Bar chart (dark card version) ─────────────────────────────────────── */
function BarChart({ data, color }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setVis(true), 300); return ()=>clearTimeout(t); }, []);
  const mx = Math.max(...data.map(d=>d.v));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:7, height:80 }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, height:"100%" }}>
          <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
            <div style={{ width:"100%", borderRadius:"5px 5px 0 0", background:color, height: vis?`${Math.max((d.v/mx)*100,5)}%`:"0%", transition:`height .75s cubic-bezier(0.34,1.4,0.64,1) ${i*55}ms`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(255,255,255,.2),transparent)" }}/>
            </div>
          </div>
          <span style={{ color:C.mutedCard, fontSize:9, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

function PieChart({ slices }) {
  const [anim, setAnim] = useState(false);
  useEffect(() => { const t = setTimeout(()=>setAnim(true), 400); return ()=>clearTimeout(t); }, []);
  let angle = -90;
  const cx=70, cy=70, r=55;
  const paths = slices.map(s => {
    const start = angle;
    const sweep = (s.value / 100) * 360;
    angle += sweep;
    const startRad = (start * Math.PI) / 180;
    const endRad = ((start + sweep) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad), y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad),   y2 = cy + r * Math.sin(endRad);
    const large = sweep > 180 ? 1 : 0;
    return { ...s, d:`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z` };
  });
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" style={{ overflow:"visible" }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} stroke="white" strokeWidth="2"
          style={{ opacity: anim?1:0, transform: anim?"none":`scale(0.6)`, transformOrigin:"70px 70px", transition:`all .6s cubic-bezier(0.34,1.4,0.64,1) ${i*80}ms` }}>
          <title>{p.label}: {p.value}%</title>
        </path>
      ))}
      {paths.map((p, i) => {
        const mid = ((() => {
          let a = -90; slices.forEach((s,j) => { if(j<i) a+=s.value/100*360; }); return a + (p.value/100*360/2);
        })()) * Math.PI / 180;
        const lx = cx + (r*0.65)*Math.cos(mid), ly = cy + (r*0.65)*Math.sin(mid);
        return p.value > 8 ? (
          <text key={i} x={lx} y={ly+4} textAnchor="middle" fill="white" fontSize="10" fontFamily="'DM Sans',sans-serif" fontWeight="700">{p.value}%</text>
        ) : null;
      })}
    </svg>
  );
}

function DarkCard({ children, style={} }) {
  return (
    <div style={{ background:C.card, borderRadius:24, padding:22, position:"relative", overflow:"hidden", border:`1px solid ${C.cardBord}`, ...style }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, unit="", color, icon, sub, delay=0 }) {
  const [vis, setVis] = useState(false);
  const num = useCount(parseFloat(String(value).replace(/,/g,""))||0);
  useEffect(() => { const t = setTimeout(()=>setVis(true), delay+80); return ()=>clearTimeout(t); }, []);
  return (
    <DarkCard style={{
      opacity:vis?1:0, transform:vis?"none":"translateY(18px)",
      transition:`opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
      cursor:"default",
    }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 16px 40px rgba(0,0,0,0.2)`;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
    >
      <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:2, background:`linear-gradient(90deg,transparent,${color},transparent)` }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ color:C.mutedCard, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", marginBottom:9 }}>{label}</div>
          <div style={{ color, fontFamily:"'DM Serif Display',serif", fontSize:32, lineHeight:1, letterSpacing:-0.5 }}>
            {vis ? num.toLocaleString() : "0"}{unit}
          </div>
          {sub && <div style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", marginTop:6, fontWeight:400 }}>{sub}</div>}
        </div>
        <div style={{ fontSize:22, opacity:.5 }}>{icon}</div>
      </div>
    </DarkCard>
  );
}

function CityMap() {
  const pins = [
    {x:175,y:115,c:C.red,    lbl:"ACCIDENT",pulse:true },
    {x:308,y:195,c:C.orange, lbl:"FLOOD",   pulse:true },
    {x:425,y:145,c:C.accent1,lbl:"AMBL",    pulse:false},
    {x:260,y:275,c:C.accent2,lbl:"PARK",    pulse:false},
    {x:148,y:240,c:C.accent3,lbl:"CLEAR",   pulse:false},
    {x:484,y:225,c:C.red,    lbl:"BLOCK",   pulse:true },
  ];
  return (
    <DarkCard style={{ padding:0, overflow:"hidden" }}>
      <div style={{ padding:"13px 18px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:9 }}>
        <span style={{ width:8, height:8, borderRadius:"50%", background:C.accent1, display:"inline-block", boxShadow:`0 0 8px ${C.accent1}` }}/>
        <span style={{ color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:2 }}>LIVE MAP — PUNE CENTRAL</span>
        <span style={{ marginLeft:"auto", color:C.mutedCard, fontSize:10, fontFamily:"monospace" }}>{pins.length} PINS</span>
      </div>
      <div style={{ position:"relative", overflow:"hidden" }}>
        <svg viewBox="0 0 640 360" style={{ width:"100%", height:"auto", display:"block" }}>
          <defs>
            <radialGradient id="mb2" cx="50%" cy="50%" r="70%"><stop offset="0%" stopColor="#1e2535"/><stop offset="100%" stopColor="#0e121a"/></radialGradient>
            <pattern id="gr2" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0L0 0 0 28" fill="none" stroke="rgba(200,240,58,.06)" strokeWidth=".5"/></pattern>
          </defs>
          <rect width="640" height="360" fill="url(#mb2)"/>
          <rect width="640" height="360" fill="url(#gr2)"/>
          {[[0,148,640,148],[0,262,640,262],[192,0,192,360],[374,0,374,360],[494,0,494,360]].map(([x1,y1,x2,y2],i)=>(
            <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e3850" strokeWidth="13"/>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(200,240,58,.06)" strokeWidth="13"/>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(245,216,0,.18)" strokeWidth="1" strokeDasharray="15 11"/></g>
          ))}
          {[[212,158,70,78],[394,158,58,85],[212,90,66,46],[394,90,52,46],[94,158,68,78],[534,158,66,82],[94,280,70,70],[212,280,70,70],[394,280,70,70],[534,280,70,70]].map(([x,y,w,h],i)=>(
            <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(8,14,28,.9)" stroke="rgba(200,240,58,.08)" strokeWidth="1" rx="3"/>
          ))}
          {pins.map((p,i)=>(
            <g key={i}>
              {p.pulse&&<><circle cx={p.x} cy={p.y} r="7" fill={p.c} opacity="0"><animate attributeName="r" values="7;20" dur="2s" repeatCount="indefinite" begin={`${i*.4}s`}/><animate attributeName="opacity" values=".5;0" dur="2s" repeatCount="indefinite" begin={`${i*.4}s`}/></circle></>}
              <circle cx={p.x} cy={p.y} r="6" fill={p.c} stroke="white" strokeWidth="1.5"/>
              <circle cx={p.x} cy={p.y} r="2.5" fill="white" opacity=".9"/>
              <rect x={p.x+9} y={p.y-10} width={p.lbl.length*5.8+8} height={13} fill="rgba(0,0,0,.75)" rx="4"/>
              <text x={p.x+13} y={p.y} fill={p.c} fontSize="7.5" fontFamily="monospace" fontWeight="700">{p.lbl}</text>
            </g>
          ))}
        </svg>
        <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
          <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(200,240,58,.2),transparent)", animation:"scan2 5s linear infinite" }}/>
        </div>
      </div>
    </DarkCard>
  );
}

function AlertItem({ text, color, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t=setTimeout(()=>setVis(true),delay); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 13px", background:`${color}14`, border:`1px solid ${color}30`, borderRadius:12, marginBottom:7,
      opacity:vis?1:0, transform:vis?"none":"translateX(-8px)", transition:`all .4s ease ${delay}ms` }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0, boxShadow:`0 0 5px ${color}` }}/>
      <span style={{ color:C.mutedCard, fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:500, lineHeight:1.4 }}>{text}</span>
    </div>
  );
}

function EmUnit({ id, type, location, eta, status, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t=setTimeout(()=>setVis(true),delay); return()=>clearTimeout(t); },[]);
  const sc = status==="ACTIVE"?C.accent1:status==="DELAYED"?C.red:C.accent3;
  const em = type==="ambulance"?"🚑":type==="fire"?"🚒":"🚔";
  return (
    <DarkCard style={{ padding:"13px 16px", marginBottom:8, opacity:vis?1:0, transform:vis?"none":"translateX(12px)", transition:`all .4s ease ${delay}ms` }}>
      <div style={{ position:"absolute", left:0, top:"15%", bottom:"15%", width:3, background:sc, borderRadius:2 }}/>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ fontSize:22 }}>{em}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13 }}>{id}</span>
            <span style={{ color:sc, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, padding:"2px 8px", background:`${sc}20`, borderRadius:20 }}>{status}</span>
          </div>
          <div style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", marginTop:2 }}>📍 {location}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:sc, fontFamily:"'DM Serif Display',serif", fontSize:24, lineHeight:1 }}>{eta}</div>
          <div style={{ color:C.mutedCard, fontSize:9, fontFamily:"'DM Sans',sans-serif", letterSpacing:2 }}>MIN</div>
        </div>
      </div>
    </DarkCard>
  );
}

function ParkRow({ plate, loc, time, fine, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t=setTimeout(()=>setVis(true),delay); return()=>clearTimeout(t); },[]);
  return (
    <DarkCard style={{ padding:"12px 15px", marginBottom:8, opacity:vis?1:0, transform:vis?"none":"translateY(10px)", transition:`all .4s ease ${delay}ms` }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:34, height:34, borderRadius:9, background:"rgba(255,68,68,.15)", border:"1px solid rgba(255,68,68,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🚗</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13 }}>{plate}</div>
          <div style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>📍 {loc} · 🕐 {time}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:C.orange, fontFamily:"'DM Serif Display',serif", fontSize:18 }}>₹{fine}</div>
          <button style={{ marginTop:3, padding:"3px 9px", background:"rgba(255,140,66,.15)", border:"1px solid rgba(255,140,66,.35)", borderRadius:6, color:C.orange, fontSize:9, fontFamily:"'DM Sans',sans-serif", fontWeight:700, cursor:"pointer", letterSpacing:1 }}>ISSUE</button>
        </div>
      </div>
    </DarkCard>
  );
}
function ReportCard({ id, type, desc, reporter, time, upvotes, status, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t=setTimeout(()=>setVis(true),delay); return()=>clearTimeout(t); },[]);
  const sc = status==="RESOLVED"?C.accent1:status==="IN PROGRESS"?C.blue:C.accent2;
  const em = {accident:"💥",flood:"🌊",blockage:"🚧",parking:"📷"}[type]||"📋";
  return (
    <DarkCard style={{ marginBottom:10, opacity:vis?1:0, transform:vis?"none":"translateY(12px)", transition:`all .45s ease ${delay}ms` }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:16 }}>{em}</span>
          <span style={{ color:C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:1 }}>#{id}</span>
        </div>
        <span style={{ color:sc, fontSize:9, fontFamily:"'DM Sans',sans-serif", fontWeight:700, padding:"3px 10px", background:`${sc}20`, border:`1px solid ${sc}35`, borderRadius:20, letterSpacing:1 }}>{status}</span>
      </div>
      <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, fontFamily:"'DM Sans',sans-serif", lineHeight:1.55, marginBottom:9 }}>{desc}</div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>👤 {reporter} · {time}</span>
        <span style={{ color:C.blue, fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>▲ {upvotes}</span>
      </div>
    </DarkCard>
  );
}

function PH({ title, sub }) {
  return (
    <div style={{ marginBottom:24, animation:"pageIn .4s ease both" }}>
      <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, fontWeight:400, color:C.text, letterSpacing:-1, lineHeight:1.1, marginBottom:4 }}>{title}</h2>
      <p style={{ color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:11, letterSpacing:2.5, textTransform:"uppercase" }}>{sub}</p>
    </div>
  );
}

function WeatherCard({ city, temp, cond, icon, risk, delay }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t=setTimeout(()=>setVis(true),delay); return()=>clearTimeout(t); },[]);
  const rc = risk>70?C.red:risk>40?C.orange:C.accent3;
  return (
    <DarkCard style={{ opacity:vis?1:0, transform:vis?"none":"translateY(16px)", transition:`all .5s ease ${delay}ms`, cursor:"default" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";}}
    >
      <div style={{ position:"absolute", bottom:-15, right:-5, fontSize:60, opacity:.07, lineHeight:1 }}>{icon}</div>
      <div style={{ color:C.mutedCard, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:2.5, marginBottom:7 }}>{city}</div>
      <div style={{ display:"flex", alignItems:"flex-end", gap:5, marginBottom:3 }}>
        <span style={{ fontSize:34, fontFamily:"'DM Serif Display',serif", color:"white", lineHeight:1 }}>{temp}°</span>
        <span style={{ fontSize:18, marginBottom:3 }}>{icon}</span>
      </div>
      <div style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", marginBottom:12 }}>{cond}</div>
      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
        <div style={{ flex:1, height:4, background:"rgba(255,255,255,.08)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${risk}%`, background:rc, borderRadius:4, transition:"width 1.2s cubic-bezier(0.34,1.4,0.64,1) .4s" }}/>
        </div>
        <span style={{ color:rc, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>{risk}%</span>
      </div>
    </DarkCard>
  );
}

function SL({ children, c }) {
  return <div style={{ color:c||"white", fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", marginBottom:13 }}>{children}</div>;
}
function KPIBarD({ label, value, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t=setTimeout(()=>setW(value),500); return()=>clearTimeout(t); }, []);
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <span style={{ color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:500 }}>{label}</span>
        <span style={{ color,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:11 }}>{value}%</span>
      </div>
      <div style={{ height:3,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden" }}>
        <div style={{ height:"100%",width:`${w}%`,background:color,borderRadius:3,transition:"width 1.1s cubic-bezier(0.34,1.2,0.64,1) .2s" }}/>
      </div>
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const [time, setTime] = useState(new Date());
  const [notif, setNotif] = useState(false);
  const [hov, setHov] = useState(null);
  const [toggles, setToggles] = useState({
    weatherAlerts:true, emergencyMode:false, autoReroute:true,
    cctv:true, nightMode:false, smsAlerts:false,
    aiPrediction:true, signalSync:true, parkingSensor:true, floods:true,
  });
  const T = k => v => setToggles(p=>({...p,[k]:v}));

  useEffect(()=>{ const id=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(id); },[]);
  const tStr = time.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dStr = time.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"});

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, color:C.text, fontFamily:"'DM Sans',sans-serif", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px}
        @keyframes bfloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-14px) scale(1.04)}}
        @keyframes scan2{0%{top:-4px}100%{top:102%}}
        @keyframes pageIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes glow2{0%,100%{opacity:.5}50%{opacity:1}}
        .page{animation:pageIn .4s cubic-bezier(0.22,1,.36,1) both}
      `}</style>

      <BlobBg/>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width:sideOpen?210:58, flexShrink:0,
        background:"rgba(255,255,255,0.7)", backdropFilter:"blur(28px)",
        borderRight:"1px solid rgba(0,0,0,0.07)",
        display:"flex", flexDirection:"column",
        position:"sticky", top:0, height:"100vh",
        transition:"width .32s cubic-bezier(0.4,0,0.2,1)",
        overflow:"hidden", zIndex:100,
        boxShadow:"4px 0 24px rgba(0,0,0,0.05)",
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 14px 16px", borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:C.card, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0, boxShadow:"0 4px 14px rgba(0,0,0,0.2)" }}>⬡</div>
            {sideOpen && (
              <div style={{ animation:"pageIn .3s ease" }}>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:16, color:C.text, lineHeight:1 }}>Urban HQ</div>
                <div style={{ color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:9, letterSpacing:3, marginTop:2 }}>TRAFFIC CTRL</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
          {NAV.map((item,i) => {
            const active = page===item.id;
            return (
              <div key={item.id} onClick={()=>setPage(item.id)}
                onMouseEnter={()=>setHov(item.id)} onMouseLeave={()=>setHov(null)}
                style={{
                  display:"flex", alignItems:"center", gap:10, padding:"10px 11px",
                  borderRadius:12, cursor:"pointer", marginBottom:3, position:"relative",
                  background: active ? C.card : hov===item.id ? "rgba(0,0,0,0.05)" : "transparent",
                  transition:"all .2s ease",
                  animation:`pageIn .4s ease ${i*45}ms both`,
                }}
              >
                {active && <div style={{ position:"absolute", left:0, top:"18%", bottom:"18%", width:2.5, background:C.accent1, borderRadius:2 }}/>}
                <span style={{ fontSize:14, color:active?"white":C.muted, flexShrink:0, transition:"color .2s" }}>{item.icon}</span>
                {sideOpen && <span style={{ fontSize:13, color:active?"white":C.muted, fontWeight:active?700:500, letterSpacing:.2, whiteSpace:"nowrap", transition:"color .2s" }}>{item.label}</span>}
                {active && sideOpen && <div style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:C.accent1 }}/>}
              </div>
            );
          })}

          {/* Quick controls */}
          {sideOpen && (
            <div style={{ marginTop:18, padding:"13px 11px", background:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.07)", borderRadius:14 }}>
              <div style={{ color:C.muted, fontSize:9, fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:3, marginBottom:11 }}>QUICK CONTROLS</div>
              {[["Weather Alerts","weatherAlerts",C.accent1],["Emergency Mode","emergencyMode",C.red],["Auto Re-route","autoReroute",C.accent3],["Night Mode","nightMode","#818cf8"]].map(([lbl,key,clr])=>(
                <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                  <span style={{ color:toggles[key]?C.text:C.muted, fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:500, transition:"color .3s" }}>{lbl}</span>
                  <Toggle on={toggles[key]} onChange={T(key)} color={clr} size="sm"/>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Collapse */}
        <div style={{ padding:"10px 8px", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
          <button onClick={()=>setSideOpen(p=>!p)}
            style={{ width:"100%", padding:"8px", background:"rgba(0,0,0,0.04)", border:"1px solid rgba(0,0,0,0.08)", borderRadius:10, color:C.muted, cursor:"pointer", fontSize:12, transition:"all .2s" }}>
            {sideOpen?"◀":"▶"}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, position:"relative", zIndex:1 }}>

        {/* Topbar */}
        <header style={{ position:"sticky", top:0, zIndex:50, background:"rgba(240,237,230,0.85)", backdropFilter:"blur(28px)", borderBottom:"1px solid rgba(0,0,0,0.07)", padding:"13px 26px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontWeight:400, fontSize:21, letterSpacing:-.5, color:C.text, lineHeight:1 }}>{NAV.find(n=>n.id===page)?.label}</h1>
            <div style={{ color:C.muted, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:600, letterSpacing:2, marginTop:3 }}>{dStr.toUpperCase()}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Company tag */}
            <div style={{ padding:"6px 14px", background:"rgba(255,255,255,0.8)", border:"1px solid rgba(0,0,0,0.1)", borderRadius:20, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:13, color:C.text }}>Pune Metro Auth.</span>
            </div>
            {/* Clock */}
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 13px", background:C.card, borderRadius:11 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C.accent1, display:"inline-block", animation:"glow2 2s infinite" }}/>
              <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, letterSpacing:.5, color:C.accent1 }}>{tStr}</span>
            </div>
            {/* Notif */}
            <div style={{ position:"relative" }}>
              <button onClick={()=>setNotif(p=>!p)}
                style={{ width:38, height:38, borderRadius:11, background:notif?C.card:"rgba(0,0,0,0.06)", border:"1px solid rgba(0,0,0,0.09)", cursor:"pointer", fontSize:15, position:"relative", transition:"all .25s" }}>
                🔔
                <span style={{ position:"absolute", top:6, right:6, width:7, height:7, borderRadius:"50%", background:C.red, border:`1.5px solid ${C.bg}` }}/>
              </button>
              {notif && (
                <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:280, background:"rgba(255,255,255,0.95)", backdropFilter:"blur(28px)", border:"1px solid rgba(0,0,0,0.1)", borderRadius:16, zIndex:200, padding:14, animation:"pageIn .2s ease", boxShadow:"0 16px 50px rgba(0,0,0,0.12)" }}>
                  <div style={{ color:C.muted, fontSize:9, fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:3, marginBottom:10 }}>NOTIFICATIONS</div>
                  {[[C.red,"Multi-vehicle collision · NH-48 northbound"],[C.orange,"Flash flood warning · Sector 7 underpass"],[C.blue,"Ambulance corridor cleared · Aundh Rd"],[C.accent2,"4 new parking violations · Baner"]].map(([clr,txt],i)=>(
                    <div key={i} style={{ display:"flex", gap:10, padding:"9px 0", borderBottom:i<3?"1px solid rgba(0,0,0,0.06)":"none", alignItems:"flex-start" }}>
                      <div style={{ width:2, height:32, background:clr, borderRadius:1, flexShrink:0 }}/>
                      <span style={{ color:"#333", fontSize:12, fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 }}>{txt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ width:38, height:38, borderRadius:11, background:C.card, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, cursor:"pointer" }}>👤</div>
          </div>
        </header>

        {/* Content */}
        <main className="page" key={page} style={{ flex:1, padding:"26px", overflowY:"auto" }}>

          {/* ══ OVERVIEW ══ */}
          {page==="overview" && <>
            <PH title="Traffic Overview" sub="Real-time · Pune Metropolitan · All zones active"/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))", gap:12, marginBottom:20 }}>
              <StatCard label="Active Vehicles" value={14823} color={C.accent1} icon="🚗" sub="↑ 12% from yesterday" delay={0}/>
              <StatCard label="Avg Speed km/h"  value={38}    color={C.blue}    icon="⚡" sub="Normal flow"           delay={70}/>
              <StatCard label="Active Incidents" value={7}    color={C.red}     icon="🚨" sub="3 critical"            delay={140}/>
              <StatCard label="Congestion %"    value={64}    color={C.accent2} icon="📊" sub="Moderate"              delay={210}/>
              <StatCard label="Emergency Calls"  value={12}   color={C.orange}  icon="🚑" sub="This hour"             delay={280}/>
              <StatCard label="Parking Violations" value={39} color={"#c084fc"} icon="🚫" sub="↑ 8 new"              delay={350}/>
            </div>

            {/* Main layout: map + alerts */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 290px", gap:16, marginBottom:20 }}>
              <CityMap/>
              <div>
                <SL c={C.text}>Active Alerts</SL>
                <AlertItem text="CRITICAL: Multi-vehicle collision NH-48" color={C.red}    delay={0}/>
                <AlertItem text="FLOOD RISK: Sector 7 — avoid route"      color={C.orange} delay={80}/>
                <AlertItem text="AMBULANCE: Priority corridor active"       color={C.accent1} delay={160}/>
                <AlertItem text="ROAD BLOCK: PCMC bridge closed"           color={C.accent2} delay={240}/>
                <AlertItem text="PARKING: Fire lane blocked — Baner"       color={"#c084fc"} delay={320}/>
                <DarkCard style={{ marginTop:12, padding:14 }}>
                  <SL c="white">System Status</SL>
                  {[["Weather Sensors",true],["CCTV Network",true],["Signal Control",false],["Mobile API",true]].map(([l,ok],i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:i<3?"1px solid rgba(255,255,255,.07)":"none" }}>
                      <span style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>{l}</span>
                      <span style={{ color:ok?C.accent1:C.red, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>{ok?"● ONLINE":"● FAULT"}</span>
                    </div>
                  ))}
                </DarkCard>
              </div>
            </div>

            {/* Business performance style row — matching the reference image layout */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              {/* Performance donuts card */}
              <DarkCard>
                <SL c="white">Traffic Performance</SL>
                <div style={{ display:"flex", justifyContent:"space-evenly", marginTop:8 }}>
                  <Donut value={72} color={C.accent1} label="Flow"  size={85}/>
                  <Donut value={55} color={C.accent2} label="Speed" size={85}/>
                </div>
                <p style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", marginTop:12, lineHeight:1.6 }}>Traffic flow index at 72% efficiency. Average corridor speed is moderate at 38 km/h. Peak congestion expected 5–8 PM.</p>
              </DarkCard>

              {/* Value highlight — $ style from reference */}
              <DarkCard style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${C.accent1},${C.accent2})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📊</div>
                  <div style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", fontWeight:700, letterSpacing:2 }}>TODAY'S INDEX</div>
                </div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, color:"white", letterSpacing:-1, lineHeight:1 }}>64 / 100</div>
                <div style={{ color:C.mutedCard, fontSize:12, fontFamily:"'DM Sans',sans-serif", marginTop:8, lineHeight:1.5 }}>Congestion Index — Moderate. 3 critical incidents active. Emergency response time 6.4 min avg.</div>
                <div style={{ marginTop:12 }}>
                  <HBar label="FLOW EFFICIENCY" value={72} color={C.accent1}/>
                  <HBar label="SIGNAL UPTIME"   value={94} color={C.accent3}/>
                </div>
              </DarkCard>

              {/* Region distribution */}
              <DarkCard>
                <SL c="white">Zone Distribution</SL>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
                  <PieChart slices={[{value:38,color:C.card,label:"Zone A"},{value:22,color:C.accent1,label:"Zone B"},{value:18,color:C.accent2,label:"Zone C"},{value:22,color:"#60a5fa",label:"Zone D"}]}/>
                </div>
                {[["Zone A",38,C.card],["Zone B",22,C.accent1],["Zone C",18,C.accent2],["Zone D",22,"#60a5fa"]].map(([l,v,c],i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <span style={{ width:10, height:10, borderRadius:2, background:c, flexShrink:0, border:c===C.card?"1px solid rgba(255,255,255,.2)":"none" }}/>
                    <span style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", flex:1 }}>{l}</span>
                    <span style={{ color:"white", fontFamily:"'DM Serif Display',serif", fontSize:14 }}>{v}%</span>
                  </div>
                ))}
              </DarkCard>
            </div>

            {/* System controls */}
            <DarkCard style={{ marginTop:16, padding:22 }}>
              <SL c="white">System Controls</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
                {[["AI Traffic Prediction","aiPrediction",C.accent1,"Predicts congestion 30 min ahead"],["Signal Sync Network","signalSync",C.accent3,"Coordinates all 142 signals"],["CCTV Monitoring","cctv",C.blue,"240 cameras · 98% uptime"],["SMS Alert Dispatch","smsAlerts",C.accent2,"Pushes to registered numbers"],["Parking Sensors","parkingSensor","#c084fc","IoT grid across 6 zones"],["Flood Detection","floods",C.orange,"River & underpass sensors"]].map(([lbl,key,clr,desc])=>(
                  <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 14px", background:"rgba(255,255,255,.04)", border:`1px solid ${toggles[key]?`${clr}30`:"rgba(255,255,255,.07)"}`, borderRadius:14, transition:"border-color .35s", gap:12 }}>
                    <div>
                      <div style={{ color:toggles[key]?"white":C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, marginBottom:2, transition:"color .3s" }}>{lbl}</div>
                      <div style={{ color:C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontSize:10 }}>{desc}</div>
                    </div>
                    <Toggle on={toggles[key]} onChange={T(key)} color={clr}/>
                  </div>
                ))}
              </div>
            </DarkCard>
          </>}

          {/* ══ WEATHER ══ */}
          {page==="weather" && <>
            <PH title="Weather & Hazards" sub="Live monitoring · 6 zones · Accident risk index"/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))", gap:12, marginBottom:20 }}>
              {[["PUNE CENTRAL",31,"⛅","Partly Cloudy",25],["BANER",29,"⛈","Thunderstorm",78],["AUNDH",30,"🌧","Heavy Rain",85],["HINJEWADI",27,"🌫","Dense Fog",62],["KHADKI",32,"☀️","Clear Sky",15],["PIMPRI",33,"🌤","Haze",40]].map(([c,t,i,cn,r],idx)=>(
                <WeatherCard key={idx} city={c} temp={t} icon={i} cond={cn} risk={r} delay={idx*70}/>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <DarkCard style={{ padding:20 }}><SL c="white">Hourly Rainfall (mm)</SL><BarChart color={C.blue} data={[6,4,8,15,22,18,12,9,5,3,7,11].map((v,i)=>({v,l:`${6+i}h`}))}/></DarkCard>
              <DarkCard style={{ padding:20 }}><SL c="white">Visibility by Zone (%)</SL><BarChart color={C.accent1} data={[85,40,30,70,90,55,45,80].map((v,i)=>({v,l:["C","Ba","Au","Hi","Kh","Pi","Ko","Vi"][i]}))}/></DarkCard>
            </div>
            <DarkCard style={{ padding:20, marginBottom:16 }}>
              <SL c="white">Alert Subscriptions</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))", gap:11 }}>
                {[["Flash Flood Alerts","floods",C.orange],["Fog Visibility Warns","weatherAlerts",C.blue],["Heavy Rain Dispatch","smsAlerts",C.blue],["Wind Speed Alerts","signalSync","#c084fc"]].map(([lbl,key,clr])=>(
                  <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 14px", background:"rgba(255,255,255,.04)", border:`1px solid ${toggles[key]?`${clr}28`:"rgba(255,255,255,.07)"}`, borderRadius:12, transition:"all .35s" }}>
                    <span style={{ color:toggles[key]?"white":C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:12, transition:"color .3s" }}>{lbl}</span>
                    <Toggle on={toggles[key]} onChange={T(key)} color={clr} size="sm"/>
                  </div>
                ))}
              </div>
            </DarkCard>
            <DarkCard style={{ padding:20 }}>
              <SL c="white">Road Advisories</SL>
              {[["Baner-Balewadi Highway","Flash flood — 3 lanes blocked","HIGH",C.red],["Hinjewadi IT Park","Dense fog — speed limit 20 km/h","MED",C.accent2],["Aundh-Ravet Road","Waterlogging — 12 citizen reports","HIGH",C.red],["Pimpri Bridge","Wind advisory — heavy vehicles restricted","LOW",C.accent1]].map(([road,reason,sev,c],i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:i<3?"1px solid rgba(255,255,255,.07)":"none" }}>
                  <div style={{ width:2, height:40, borderRadius:1, background:c, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"white", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13 }}>{road}</div>
                    <div style={{ color:C.mutedCard, fontSize:11, fontFamily:"'DM Sans',sans-serif", marginTop:2 }}>{reason}</div>
                  </div>
                  <span style={{ color:c, fontSize:10, fontFamily:"'DM Sans',sans-serif", fontWeight:700, padding:"3px 11px", background:`${c}18`, borderRadius:20 }}>{sev}</span>
                </div>
              ))}
            </DarkCard>
          </>}

          {/* ══ EMERGENCY ══ */}
          {page==="emergency" && <>
            <PH title="Emergency Control" sub="Real-time tracking · Signal priority management"/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:12, marginBottom:20 }}>
              <StatCard label="Active Units"     value={18} color={C.accent1} icon="🚑" delay={0}/>
              <StatCard label="Avg Response min" value={6}  color={C.accent3} icon="⏱"  delay={70}/>
              <StatCard label="Routes Cleared"   value={11} color={"#c084fc"} icon="🛣"  delay={140}/>
              <StatCard label="Delayed Units"    value={3}  color={C.red}     icon="⚠️" delay={210}/>
            </div>
            <DarkCard style={{ padding:20, marginBottom:16 }}>
              <SL c="white">Emergency Protocols</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:11 }}>
                {[["Emergency Mode","emergencyMode",C.red,"All signals on priority"],["Auto Signal Clear","signalSync",C.accent1,"Clears path automatically"],["AI Route Prediction","aiPrediction",C.accent3,"ML-based ETA calc"],["Auto Re-routing","autoReroute",C.accent2,"Diverts civilian traffic"]].map(([lbl,key,clr,desc])=>(
                  <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:"rgba(255,255,255,.04)", border:`1px solid ${toggles[key]?`${clr}28`:"rgba(255,255,255,.07)"}`, borderRadius:12, transition:"all .35s", gap:12 }}>
                    <div>
                      <div style={{ color:toggles[key]?"white":C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, marginBottom:2, transition:"color .3s" }}>{lbl}</div>
                      <div style={{ color:C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontSize:10 }}>{desc}</div>
                    </div>
                    <Toggle on={toggles[key]} onChange={T(key)} color={clr} size="sm"/>
                  </div>
                ))}
              </div>
            </DarkCard>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div><SL c={C.text}>Ambulance Units</SL><EmUnit id="AMB-MH-01" type="ambulance" location="Near Ruby Hall Clinic" eta="4"  status="ACTIVE"  delay={0}/><EmUnit id="AMB-MH-07" type="ambulance" location="Baner Road — Congested" eta="12" status="DELAYED" delay={100}/><EmUnit id="AMB-MH-12" type="ambulance" location="Wakad Junction"         eta="7"  status="ACTIVE"  delay={200}/></div>
              <div><SL c={C.text}>Fire &amp; Police Units</SL><EmUnit id="FIRE-PMP-02" type="fire"   location="Hadapsar Industrial" eta="9"  status="ACTIVE"  delay={50}/><EmUnit id="POL-PCB-05"  type="police" location="Shivajinagar Circle" eta="3"  status="ACTIVE"  delay={150}/><EmUnit id="FIRE-PMP-08" type="fire"   location="Talegaon Rd — Blocked" eta="18" status="DELAYED" delay={250}/></div>
            </div>
          </>}

          {/* ══ PARKING ══ */}
          {page==="parking" && <>
            <PH title="Illegal Parking" sub="Automated CCTV detection · Fine management"/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:12, marginBottom:20 }}>
              <StatCard label="Violations Today" value={39}    color={C.red}     icon="🚫" delay={0}/>
              <StatCard label="Fines Issued"      value={27}   color={C.accent2} icon="📋" delay={70}/>
              <StatCard label="Revenue ₹"         value={54000} color={C.accent3} icon="💰" delay={140}/>
              <StatCard label="Fire Lane Blocks"  value={6}    color={C.orange}  icon="🔥" delay={210}/>
            </div>
            <DarkCard style={{ padding:20, marginBottom:16 }}>
              <SL c="white">Detection Settings</SL>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))", gap:11 }}>
                {[["IoT Parking Sensors","parkingSensor","#c084fc","Smart sensor grid"],["CCTV Auto-detect","cctv",C.accent1,"AI plate recognition"],["Auto Fine Issue","smsAlerts",C.accent2,"Instant SMS to owner"],["Fire Lane Watch","floods",C.red,"Priority zone monitoring"]].map(([lbl,key,clr,desc])=>(
                  <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 14px", background:"rgba(255,255,255,.04)", border:`1px solid ${toggles[key]?`${clr}28`:"rgba(255,255,255,.07)"}`, borderRadius:12, transition:"all .35s", gap:12 }}>
                    <div>
                      <div style={{ color:toggles[key]?"white":C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, marginBottom:2, transition:"color .3s" }}>{lbl}</div>
                      <div style={{ color:C.mutedCard, fontFamily:"'DM Sans',sans-serif", fontSize:10 }}>{desc}</div>
                    </div>
                    <Toggle on={toggles[key]} onChange={T(key)} color={clr} size="sm"/>
                  </div>
                ))}
              </div>
            </DarkCard>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <div><SL c={C.text}>Recent Violations</SL><ParkRow plate="MH-12-AB-7890" loc="FC Road, No-Parking Zone" time="10:24 AM" fine="1,000" delay={0}/><ParkRow plate="MH-14-CD-3421" loc="Baner Rd, Fire Lane"      time="11:02 AM" fine="2,000" delay={80}/><ParkRow plate="MH-20-GH-5678" loc="JM Rd, Bus Stop"          time="11:45 AM" fine="1,500" delay={160}/><ParkRow plate="MH-12-XY-1100" loc="Kothrud, Double Parking"  time="12:10 PM" fine="500"   delay={240}/></div>
              <div>
                <DarkCard style={{ marginBottom:14 }}><SL c="white">Violations by Zone</SL><BarChart color={C.red} data={[12,7,5,8,3,4,6,4].map((v,i)=>({v,l:["FC","Ban","Koth","Shiv","Aun","Wak","Pi","Nig"][i]}))}/></DarkCard>
                <DarkCard><SL c="white">Violation Types</SL>
                  {[["No-Parking Zone",14,C.red],["Bus Stop Obstruction",9,C.accent2],["Double Parking",7,"#c084fc"],["Fire Lane Block",6,C.orange],["Footpath Encroach",3,C.blue]].map(([l,v,c],i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}>
                      <span style={{ width:6,height:6,borderRadius:"50%",background:c,flexShrink:0 }}/>
                      <span style={{ color:C.mutedCard,fontSize:11,fontFamily:"'DM Sans',sans-serif",flex:1 }}>{l}</span>
                      <div style={{ width:70,height:3,background:"rgba(255,255,255,.08)",borderRadius:3,overflow:"hidden" }}><div style={{ height:"100%",width:`${(v/14)*100}%`,background:c,transition:"width 1s ease .3s" }}/></div>
                      <span style={{ color:"white",fontFamily:"'DM Serif Display',serif",fontSize:13,width:20,textAlign:"right" }}>{v}</span>
                    </div>
                  ))}
                </DarkCard>
              </div>
            </div>
          </>}

          {/* ══ REPORTS ══ */}
          {page==="reports" && <>
            <PH title="Citizen Reports" sub="Crowdsourced real-time incident reporting"/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:12, marginBottom:20 }}>
              <StatCard label="Total Reports"  value={284} color={"#c084fc"}  icon="📱" delay={0}/>
              <StatCard label="Verified"       value={201} color={C.accent1}  icon="✅" delay={70}/>
              <StatCard label="Pending Review" value={47}  color={C.accent2}  icon="⏳" delay={140}/>
              <StatCard label="Resolved Today" value={36}  color={C.blue}     icon="🎯" delay={210}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16 }}>
              <div><SL c={C.text}>Latest Reports</SL>
                <ReportCard id="R-2841" type="accident"  desc="Two-wheeler collision near Baner Rd overpass, one injured, traffic blocked both lanes." reporter="Ravi K."   time="12 min ago" upvotes={42} status="IN PROGRESS" delay={0}/>
                <ReportCard id="R-2840" type="flood"     desc="Underpass completely flooded at Wakad junction, vehicles stranded in 2 ft water."          reporter="Sneha M."  time="35 min ago" upvotes={87} status="RESOLVED"    delay={90}/>
                <ReportCard id="R-2838" type="blockage"  desc="Tree fallen across Pashan-Sus road, one lane completely blocked since morning."              reporter="Aditya P." time="1 hr ago"   upvotes={23} status="PENDING"     delay={180}/>
                <ReportCard id="R-2835" type="parking"   desc="Truck on emergency lane near Ruby Hall blocking ambulance access corridor."                   reporter="Priya S."  time="2 hr ago"   upvotes={64} status="RESOLVED"    delay={270}/>
              </div>
              <div>
                <DarkCard style={{ marginBottom:14 }}><SL c="white">Distribution</SL><div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginTop:4 }}><Donut value={42} color={C.red} label="Accidents" size={80} stroke={7}/><Donut value={71} color={C.accent1} label="Verified" size={80} stroke={7}/><Donut value={28} color={C.orange} label="Hazards" size={80} stroke={7}/><Donut value={13} color={"#c084fc"} label="Resolved" size={80} stroke={7}/></div></DarkCard>
                <DarkCard><SL c="white">Top Reporters</SL>
                  {[["Ravi K.",18,"🏅"],["Sneha M.",14,"🥈"],["Aditya P.",11,"🥉"],["Priya S.",9,""],["Rohan T.",7,""]].map(([n,c,b],i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<4?"1px solid rgba(255,255,255,.07)":"none" }}>
                      <span style={{ color:C.mutedCard,fontSize:12,fontFamily:"'DM Sans',sans-serif" }}>{b} {n}</span>
                      <span style={{ color:"#c084fc",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:11 }}>{c} reports</span>
                    </div>
                  ))}
                </DarkCard>
              </div>
            </div>
          </>}

          {/* ══ ANALYTICS ══ */}
          {page==="analytics" && <>
            <PH title="Analytics" sub="Performance metrics · Weekly trends · KPIs"/>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:12, marginBottom:20 }}>
              <StatCard label="Incidents/Week" value={143} color={C.red}     icon="📉" delay={0}/>
              <StatCard label="Avg Clearance"  value={22}  color={C.blue}    icon="⏱"  delay={70}/>
              <StatCard label="Signal Effic. %" value={78} color={C.accent1} icon="🚦" delay={140}/>
              <StatCard label="Engagement %"   value={92}  color={"#c084fc"} icon="📲" delay={210}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <DarkCard style={{ padding:20 }}><SL c="white">Daily Incident Trend</SL><BarChart color={"#c084fc"} data={[28,35,22,41,38,29,24].map((v,i)=>({v,l:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}))}/></DarkCard>
              <DarkCard style={{ padding:20 }}><SL c="white">Peak Hour Traffic</SL><BarChart color={C.accent1} data={[1200,3400,4200,2800,1900,3600,4800,3200].map((v,i)=>({v,l:`${7+i}h`}))}/></DarkCard>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
              <DarkCard><SL c="white">KPI Overview</SL><KPIBarD label="Emergency Response" value={87} color={C.accent1}/><KPIBarD label="Weather Accuracy" value={92} color={C.blue}/><KPIBarD label="Parking Enforce." value={69} color={C.red}/><KPIBarD label="Report Resolution" value={78} color={"#c084fc"}/><KPIBarD label="Signal Uptime" value={94} color={C.accent2}/></DarkCard>
              <DarkCard style={{ display:"flex", flexDirection:"column" }}>
                <SL c="white">Incident Breakdown</SL>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", flex:1, alignItems:"center" }}>
                  <Donut value={35} color={C.red}     label="Accidents" size={78} stroke={7}/>
                  <Donut value={22} color={C.orange}  label="Weather"   size={78} stroke={7}/>
                  <Donut value={18} color={C.accent2} label="Parking"   size={78} stroke={7}/>
                  <Donut value={25} color={"#c084fc"} label="Blockage"  size={78} stroke={7}/>
                </div>
              </DarkCard>
              <DarkCard><SL c="white">Monthly Summary</SL>
                {[["Total Incidents","1,847","−12%",C.accent1],["Avg Response","8.2 min","−18%",C.accent1],["Clearances","412","+5%",C.blue],["Fines (₹)","₹6.4L","+22%",C.accent2],["Reports","3,290","+34%","#c084fc"],["Signal Faults","23","−41%",C.accent1]].map(([l,v,d,c],i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<5?"1px solid rgba(255,255,255,.07)":"none" }}>
                    <span style={{ color:C.mutedCard,fontSize:11,fontFamily:"'DM Sans',sans-serif" }}>{l}</span>
                    <div style={{ textAlign:"right" }}><div style={{ color:"white",fontFamily:"'DM Serif Display',serif",fontSize:13 }}>{v}</div><div style={{ color:c,fontSize:10,fontFamily:"'DM Sans',sans-serif",fontWeight:700 }}>{d}</div></div>
                  </div>
                ))}
              </DarkCard>
            </div>
          </>}

        </main>

        {/* Footer */}
        <footer style={{ borderTop:"1px solid rgba(0,0,0,0.07)", padding:"9px 26px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(240,237,230,0.85)", backdropFilter:"blur(20px)" }}>
          <span style={{ color:C.muted, fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:10, letterSpacing:1.5 }}>URBAN TRAFFIC MANAGEMENT SYSTEM · v3.1 · PUNE METROPOLITAN AUTHORITY</span>
          <div style={{ display:"flex", gap:14 }}>
            {[[C.accent1,"SENSORS"],[C.blue,"API"],[C.accent2,"ALERTS"]].map(([clr,lbl],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:clr,display:"inline-block" }}/>
                <span style={{ color:C.muted,fontSize:9,fontFamily:"'DM Sans',sans-serif",fontWeight:600,letterSpacing:2 }}>{lbl}</span>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
