import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ckaprfsaaivcreswgppr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYXByZnNhYWl2Y3Jlc3dncHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzA2MzMsImV4cCI6MjA5NTU0NjYzM30._qrFkoM6-CQBOH9KgFSa7NxuPncRtISKC09-iNWKD44";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  }
});
const FINNHUB = "d0r9h1pr01qgdatuj9agd0r9h1pr01qgdatuj9b0";

// -- DESIGN: DEEP SPACE PREMIUM --------------------------------
const D = {
  bg:       "#080B14",
  panel:    "#0D1117",
  panel2:   "#111827",
  panel3:   "#1a2235",
  border:   "#1F2937",
  border2:  "#2D3748",
  glow:     "rgba(99,102,241,0.15)",
  text:     "#F1F5F9",
  text2:    "#CBD5E1",
  text3:    "#64748B",
  text4:    "#374151",
  indigo:   "#6366F1",
  indigoBg: "rgba(99,102,241,0.1)",
  indigoBd: "rgba(99,102,241,0.3)",
  green:    "#10B981",
  greenBg:  "rgba(16,185,129,0.1)",
  greenBd:  "rgba(16,185,129,0.25)",
  red:      "#F43F5E",
  redBg:    "rgba(244,63,94,0.1)",
  redBd:    "rgba(244,63,94,0.25)",
  amber:    "#F59E0B",
  amberBg:  "rgba(245,158,11,0.1)",
  amberBd:  "rgba(245,158,11,0.25)",
  purple:   "#8B5CF6",
  purpleBg: "rgba(139,92,246,0.1)",
  purpleBd: "rgba(139,92,246,0.25)",
  cyan:     "#06B6D4",
  cyanBg:   "rgba(6,182,212,0.1)",
  cyanBd:   "rgba(6,182,212,0.25)",
  s1: "0 1px 3px rgba(0,0,0,0.4)",
  s2: "0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)",
  s3: "0 8px 24px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)",
  glow1: "0 0 20px rgba(99,102,241,0.15)",
  mono: "IBM Plex Mono, monospace",
  sans: "Inter, system-ui, sans-serif",
};

const ACCT_TYPES = ["ISA","Invest","SIPP","GIA","Crypto","Other"];
const ACCT_COLORS = {ISA:D.green, Invest:D.amber, SIPP:D.cyan, GIA:D.indigo, Crypto:D.purple, Other:D.text3};

const fmt = (n,d=2) => Math.abs(n).toLocaleString("en-GB",{minimumFractionDigits:d,maximumFractionDigits:d});
const gbp = n => "£"+fmt(n);
const gbpD = n => (n<0?"-":"")+gbp(n);
const pct = n => (n>=0?"+":"")+n.toFixed(2)+"%";
const FX = 1.3465;

// -- AUTH SCREEN -----------------------------------------------
function AuthScreen(){
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);

  const signInGoogle=async()=>{
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider:"google",
      options:{redirectTo:window.location.origin}
    });
  };

  const signInEmail=async()=>{
    if(!email)return;
    setLoading(true);
    const {error}=await supabase.auth.signInWithOtp({email});
    setLoading(false);
    if(!error)setSent(true);
  };

  return(
    <div style={{minHeight:"100vh",background:D.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:D.sans}}>
      <style>{`
        @import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap);
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#080B14;}
        input{font-family:'Inter',sans-serif;}
        button:focus{outline:none;}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse-ring{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2);opacity:0}}
      `}</style>

      {/* Background orbs */}
      <div style={{position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",top:"10%",left:"20%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",bottom:"10%",right:"15%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.03) 0%,transparent 70%)",transform:"translate(-50%,-50%)"}}/>
      </div>

      <div style={{width:"100%",maxWidth:420,position:"relative",zIndex:1}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{position:"relative",display:"inline-block",marginBottom:20,animation:"float 4s ease-in-out infinite"}}>
            <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 40px rgba(99,102,241,0.4)"}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div style={{fontSize:28,fontWeight:700,color:D.text,letterSpacing:"-0.5px",marginBottom:8}}>Portfolio Analytics</div>
          <div style={{fontSize:14,color:D.text3,lineHeight:1.5}}>Track, analyse and grow your investments</div>
        </div>

        {/* Card */}
        <div style={{background:D.panel,borderRadius:20,padding:36,border:"1px solid "+D.border,boxShadow:D.s3}}>
          {sent?(
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:16}}>-</div>
              <div style={{fontSize:18,fontWeight:600,color:D.text,marginBottom:8}}>Check your inbox</div>
              <div style={{fontSize:13,color:D.text3,lineHeight:1.7}}>Magic link sent to <strong style={{color:D.indigo}}>{email}</strong>. Click it to sign in instantly.</div>
            </div>
          ):(
            <>
              <div style={{fontSize:16,fontWeight:600,color:D.text,marginBottom:4}}>Welcome back</div>
              <div style={{fontSize:13,color:D.text3,marginBottom:28}}>Sign in to your portfolio dashboard</div>

              <button onClick={signInGoogle} disabled={loading}
                style={{width:"100%",padding:"13px 0",borderRadius:12,border:"1px solid "+D.border2,background:D.panel2,color:D.text,fontSize:14,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20,transition:"all .2s"}}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
                <div style={{flex:1,height:1,background:D.border}}/>
                <span style={{fontSize:11,color:D.text4}}>or</span>
                <div style={{flex:1,height:1,background:D.border}}/>
              </div>

              <input value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="your@email.com" type="email"
                onKeyDown={e=>e.key==="Enter"&&signInEmail()}
                style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,marginBottom:10,outline:"none",transition:"border .2s"}}
                onFocus={e=>e.target.style.borderColor=D.indigo}
                onBlur={e=>e.target.style.borderColor=D.border}/>

              <button onClick={signInEmail} disabled={!email||loading}
                style={{width:"100%",padding:"13px 0",borderRadius:12,border:"none",background:email?"linear-gradient(135deg,#6366F1,#8B5CF6)":D.panel2,color:email?D.text:D.text4,fontSize:14,fontWeight:600,cursor:email?"pointer":"default",transition:"all .2s",boxShadow:email?"0 0 20px rgba(99,102,241,0.3)":"none"}}>
                {loading?"Sending...":"Send magic link"}
              </button>
            </>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:D.text4}}>Your data is private and only visible to you</div>
      </div>
    </div>
  );
}

// -- SPARKLINE -------------------------------------------------
function Spark({data,color,h=60}){
  if(!data||data.length<2)return null;
  const W=400,PX=2,PY=4;
  const vals=data.map(d=>d.v);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const xp=i=>PX+(i/(data.length-1))*(W-PX*2);
  const yp=v=>h-PY-((v-mn)/rng)*(h-PY*2);
  const pts=data.map((d,i)=>({x:xp(i),y:yp(d.v),v:d.v,m:d.m}));
  const lp=pts.map((p,i)=>(i===0?"M":"L")+p.x.toFixed(1)+" "+p.y.toFixed(1)).join(" ");
  const fp=lp+" L "+pts[pts.length-1].x+" "+h+" L "+pts[0].x+" "+h+" Z";
  const [hov,setHov]=useState(null);
  const uid="sp"+Math.abs(color.charCodeAt(1)||0);
  return(
    <svg viewBox={"0 0 "+W+" "+h} style={{width:"100%",overflow:"visible"}}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      <path d={fp} fill={"url(#"+uid+")"}/>
      <path d={lp} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
          <rect x={xp(i)-16} y={0} width={32} height={h} fill="transparent"/>
          {hov===i&&<>
            <line x1={p.x} y1={0} x2={p.x} y2={h} stroke={D.border2} strokeWidth="1" strokeDasharray="3 2"/>
            <circle cx={p.x} cy={p.y} r={4} fill={D.panel} stroke={color} strokeWidth="2"/>
            <rect x={Math.min(p.x-44,W-90)} y={p.y-30} width={86} height={22} rx={6} fill={D.panel2} stroke={D.border2}/>
            <text x={Math.min(p.x-44,W-90)+43} y={p.y-15} textAnchor="middle" fontSize="10" fontWeight="600" fill={color} fontFamily={D.mono}>{gbp(p.v)}</text>
          </>}
        </g>
      ))}
    </svg>
  );
}

// -- DONUT -----------------------------------------------------
function Donut({data,size=150}){
  const [hov,setHov]=useState(null);
  const total=data.reduce((s,d)=>s+Math.abs(d.value),0)||1;
  let angle=-90;
  const cx=size/2,cy=size/2,r=size/2-14,inner=r-24;
  const slices=data.map((d,i)=>{
    const a=(Math.abs(d.value)/total)*360;
    const s=angle,e=angle+a;
    angle+=a;
    const sr=s*Math.PI/180,er=e*Math.PI/180;
    const x1=cx+r*Math.cos(sr),y1=cy+r*Math.sin(sr);
    const x2=cx+r*Math.cos(er),y2=cy+r*Math.sin(er);
    const xi1=cx+inner*Math.cos(sr),yi1=cy+inner*Math.sin(sr);
    const xi2=cx+inner*Math.cos(er),yi2=cy+inner*Math.sin(er);
    const large=a>180?1:0;
    return{...d,i,path:`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`,pct:(Math.abs(d.value)/total*100).toFixed(1)};
  });
  return(
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg width={size} height={size} style={{flexShrink:0}}>
        {slices.map((s,i)=>(
          <path key={i} d={s.path} fill={s.color}
            opacity={hov!==null&&hov!==i?0.25:1}
            style={{cursor:"default",transition:"opacity .15s"}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}/>
        ))}
        {hov!==null?(
          <>
            <text x={cx} y={cy-7} textAnchor="middle" fontSize="13" fontWeight="700" fill={slices[hov].color} fontFamily={D.mono}>{slices[hov].pct}%</text>
            <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill={D.text3} fontFamily={D.sans}>{slices[hov].name}</text>
          </>
        ):(
          <text x={cx} y={cy+5} textAnchor="middle" fontSize="11" fontWeight="600" fill={D.text3} fontFamily={D.sans}>Total</text>
        )}
      </svg>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
        {slices.map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",opacity:hov!==null&&hov!==i?0.25:1,transition:"opacity .15s",cursor:"default"}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{width:8,height:8,borderRadius:2,background:s.color,flexShrink:0}}/>
              <span style={{fontSize:11,color:D.text2}}>{s.name}</span>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:10,color:D.text3,fontFamily:D.mono}}>{s.pct}%</span>
              <span style={{fontFamily:D.mono,fontSize:11,fontWeight:600,color:D.text}}>{gbp(Math.abs(s.value))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -- BAR CHART -------------------------------------------------
function Bars({data,vk,lk,neg,ck,h=100}){
  const vals=data.map(d=>d[vk]);
  const mx=Math.max(...vals.map(Math.abs))||1;
  const [hov,setHov]=useState(null);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:h+36,paddingBottom:20,position:"relative"}}>
      {data.map((d,i)=>{
        const v=d[vk],bh=Math.max(2,(Math.abs(v)/mx)*(h-4));
        const col=d[ck]||(neg?(v>=0?D.green:D.red):D.indigo);
        return(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%",gap:1}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            {hov===i&&<div style={{position:"absolute",top:0,background:D.panel2,border:"1px solid "+D.border2,borderRadius:8,padding:"3px 9px",fontSize:10,fontWeight:600,fontFamily:D.mono,color:col,whiteSpace:"nowrap",zIndex:10,boxShadow:D.s2}}>
              {v>=0?"+":""}{Math.abs(v)<10?v.toFixed(3):gbp(v)}
            </div>}
            <div style={{fontSize:7,color:col,fontFamily:D.mono,fontWeight:500,marginBottom:2,transform:"rotate(-40deg)",whiteSpace:"nowrap",opacity:0.8}}>{Math.abs(v)<10?v.toFixed(2):(v>=0?"+":"")+gbp(Math.abs(v))}</div>
            <div style={{width:"100%",height:bh,background:col,borderRadius:"3px 3px 2px 2px",opacity:hov===i?1:0.7,transition:"opacity .15s",boxShadow:hov===i?"0 0 10px "+col+"60":"none"}}/>
            <div style={{fontSize:8,color:D.text4,textAlign:"center",marginTop:4,lineHeight:1.2,fontFamily:D.sans}}>{d[lk]}</div>
          </div>
        );
      })}
    </div>
  );
}

// -- STAT CARD -------------------------------------------------
function Kpi({label,value,sub,color,accent,size,glow}){
  return(
    <div style={{background:D.panel,borderRadius:12,border:"1px solid "+(accent?accent+"40":D.border),padding:"14px 18px",
      borderTop:"2px solid "+(accent||D.border),
      boxShadow:glow?"0 0 20px "+(accent||D.indigo)+"20, "+D.s1:D.s1,
      transition:"all .2s"}}>
      <div style={{fontSize:10,color:D.text3,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600,fontFamily:D.sans,marginBottom:7}}>{label}</div>
      <div style={{fontFamily:D.mono,fontWeight:700,fontSize:size||15,color:color||D.text,letterSpacing:"-0.2px",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:D.text3,marginTop:5,fontFamily:D.sans}}>{sub}</div>}
    </div>
  );
}

// -- TRADE LOG MODAL -------------------------------------------
function TradeModal({onSave,onCancel}){
  const [form,setForm]=useState({ticker:"",acct:"ISA",act:"BUY",shares:"",price:"",currency:"USD",date:new Date().toISOString().slice(0,10),notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const cost=form.shares&&form.price?(parseFloat(form.shares)*parseFloat(form.price)).toFixed(2):"--";
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}>
      <div style={{background:D.panel,borderRadius:20,padding:28,width:"100%",maxWidth:460,boxShadow:D.s3,border:"1px solid "+D.border}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontSize:16,fontWeight:700,color:D.text}}>Log Trade</div>
          <div style={{display:"flex",gap:6}}>
            {["BUY","SELL"].map(a=>(
              <button key={a} onClick={()=>set("act",a)}
                style={{padding:"6px 16px",borderRadius:8,border:"1px solid "+(form.act===a?(a==="BUY"?D.green:D.red):D.border),
                  background:form.act===a?(a==="BUY"?D.greenBg:D.redBg):"transparent",
                  color:form.act===a?(a==="BUY"?D.green:D.red):D.text3,
                  fontSize:12,fontWeight:600,cursor:"pointer"}}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Ticker *</div>
            <input value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}
              placeholder="SOFI" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,fontFamily:D.mono,fontWeight:600,outline:"none"}}
              onFocus={e=>e.target.style.borderColor=D.indigo} onBlur={e=>e.target.style.borderColor=D.border}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Account *</div>
            <select value={form.acct} onChange={e=>set("acct",e.target.value)}
              style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,outline:"none"}}>
              {ACCT_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Shares *</div>
            <input value={form.shares} onChange={e=>set("shares",e.target.value)}
              placeholder="100" type="number" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,fontFamily:D.mono,outline:"none"}}
              onFocus={e=>e.target.style.borderColor=D.indigo} onBlur={e=>e.target.style.borderColor=D.border}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Price *</div>
            <input value={form.price} onChange={e=>set("price",e.target.value)}
              placeholder="16.17" type="number" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,fontFamily:D.mono,outline:"none"}}
              onFocus={e=>e.target.style.borderColor=D.indigo} onBlur={e=>e.target.style.borderColor=D.border}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Currency</div>
            <select value={form.currency} onChange={e=>set("currency",e.target.value)}
              style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,outline:"none"}}>
              {["USD","GBP","EUR"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Date</div>
            <input value={form.date} onChange={e=>set("date",e.target.value)} type="date"
              style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Total Cost</div>
            <div style={{padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel3,fontFamily:D.mono,fontSize:13,color:D.indigo,fontWeight:600}}>
              {cost!=="--"?((form.currency==="GBP"?"£":"$")+cost):"--"}
            </div>
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Notes</div>
          <input value={form.notes} onChange={e=>set("notes",e.target.value)}
            placeholder="Reason for trade, thesis..." style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid "+D.border,background:D.panel2,color:D.text,fontSize:13,outline:"none"}}
            onFocus={e=>e.target.style.borderColor=D.indigo} onBlur={e=>e.target.style.borderColor=D.border}/>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"11px 0",borderRadius:10,border:"1px solid "+D.border,background:"transparent",color:D.text3,fontSize:13,fontWeight:500,cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>onSave(form)} disabled={!form.ticker||!form.shares||!form.price}
            style={{flex:2,padding:"11px 0",borderRadius:10,border:"none",
              background:form.ticker&&form.shares&&form.price?(form.act==="BUY"?"linear-gradient(135deg,"+D.green+",#059669)":"linear-gradient(135deg,"+D.red+",#E11D48)"):D.panel2,
              color:form.ticker&&form.shares&&form.price?D.text:D.text4,
              fontSize:13,fontWeight:600,cursor:"pointer",
              boxShadow:form.ticker&&form.shares&&form.price?"0 0 20px "+(form.act==="BUY"?D.green:D.red)+"30":"none"}}>
            Log {form.act} - {form.ticker||"?"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -- MAIN APP --------------------------------------------------
export default function App(){
  const [session,setSession]=useState(null);
  const [loading,setLoading]=useState(true);
  const [trades,setTrades]=useState([]);
  const [tab,setTab]=useState("common");
  const [showTrade,setShowTrade]=useState(false);
  const [livePrices,setLivePrices]=useState({});
  const [priceStatus,setPriceStatus]=useState("loading");
  const [lastUpdated,setLastUpdated]=useState(null);
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const [goalR,setGoalR]=useState(20);
  const [goalY,setGoalY]=useState(20);

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>{setSession(s);setLoading(false);});
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{if(session)loadTrades();},[session]);

  const loadTrades=async()=>{
    const {data}=await supabase.from("trades").select("*").eq("user_id",session.user.id).order("date",{ascending:true});
    setTrades(data||[]);
  };

  // Auto P&L calculation on SELL
  const saveTrade=async(form)=>{
    const shares=parseFloat(form.shares);
    const price=parseFloat(form.price);
    const toGBP=form.currency==="GBP"?1:form.currency==="USD"?1/FX:1/FX;
    const total=shares*price*toGBP;
    let pnl=null;

    if(form.act==="SELL"){
      // Get all BUY trades for this ticker+acct to calculate avg cost
      const buys=trades.filter(t=>t.ticker===form.ticker&&t.acct===form.acct&&t.act==="BUY");
      const sells=trades.filter(t=>t.ticker===form.ticker&&t.acct===form.acct&&t.act==="SELL"&&t.pnl!=null);
      // Total bought shares and cost
      const totalBuyShares=buys.reduce((s,t)=>s+t.shares,0);
      const totalBuyCost=buys.reduce((s,t)=>s+(t.shares*t.price*(t.currency==="GBP"?1:1/FX)),0);
      // Subtract already sold shares
      const totalSoldShares=sells.reduce((s,t)=>s+t.shares,0);
      const remainingShares=totalBuyShares-totalSoldShares;
      if(remainingShares>0&&totalBuyShares>0){
        const avgCostGBP=totalBuyCost/totalBuyShares;
        const sellPriceGBP=price*toGBP;
        pnl=(sellPriceGBP-avgCostGBP)*shares;
      }
    }

    await supabase.from("trades").insert({
      user_id:session.user.id,
      ticker:form.ticker,
      acct:form.acct,
      act:form.act,
      shares,
      price,
      currency:form.currency,
      total:total,
      pnl,
      date:form.date,
      notes:form.notes||"",
    });
    setShowTrade(false);
    loadTrades();
  };

  const deleteTrade=async(id)=>{
    await supabase.from("trades").delete().eq("id",id);
    loadTrades();
  };

  // Live prices
  const isMarketOpen=()=>{
    const et=new Date(new Date().toLocaleString("en-US",{timeZone:"America/New_York"}));
    const d=et.getDay(),m=et.getHours()*60+et.getMinutes();
    return d>=1&&d<=5&&m>=570&&m<960;
  };

  const fetchPrices=useCallback(async()=>{
    const tickers=[...new Set(trades.map(t=>t.ticker))];
    if(!tickers.length)return;
    const results={};
    await Promise.all(tickers.map(async tk=>{
      // Crypto via Kraken
      if(["SOL","BTC","ETH"].includes(tk)){
        try{
          const pair=tk==="SOL"?"SOLGBP":tk==="BTC"?"XBTGBP":"ETHGBP";
          const r=await fetch("https://api.kraken.com/0/public/Ticker?pair="+pair,{signal:AbortSignal.timeout(5000)});
          const d=await r.json();
          const p=Object.values(d.result||{})[0];
          if(p){const pr=parseFloat(p.c[0]),op=parseFloat(p.o);results[tk]={price:pr,prev:op,changePct:(pr-op)/op*100,gbp:true};}
        }catch(e){}
        return;
      }
      // Stocks via Finnhub
      try{
        const r=await fetch("https://finnhub.io/api/v1/quote?symbol="+tk+"&token="+FINNHUB,{signal:AbortSignal.timeout(8000)});
        const d=await r.json();
        if(d&&d.c>0)results[tk]={price:d.c,prev:d.pc,changePct:d.dp,gbp:false};
      }catch(e){}
    }));
    if(Object.keys(results).length){setLivePrices(results);setLastUpdated(new Date());setPriceStatus(isMarketOpen()?"live":"closed");}
    else setPriceStatus("error");
  },[trades]);

  useEffect(()=>{
    if(trades.length){fetchPrices();const id=setInterval(fetchPrices,30000);return()=>clearInterval(id);}
  },[trades,fetchPrices]);

  // -- ANALYTICS (auto-calculated from trades) ------------------
  const analytics=useMemo(()=>{
    // Build open positions from trade history
    const pos={};
    trades.forEach(t=>{
      const key=t.ticker+"|"+t.acct;
      if(!pos[key])pos[key]={ticker:t.ticker,acct:t.acct,currency:t.currency,shares:0,totalCostGBP:0,buys:[],sells:[]};
      const toGBP=t.currency==="GBP"?1:1/FX;
      if(t.act==="BUY"){
        pos[key].shares+=t.shares;
        pos[key].totalCostGBP+=t.shares*t.price*toGBP;
        pos[key].buys.push(t);
      } else {
        pos[key].shares-=t.shares;
        pos[key].sells.push(t);
      }
    });

    // Open positions with live prices
    const openPos=Object.values(pos).filter(p=>p.shares>0.001).map(p=>{
      const live=livePrices[p.ticker];
      const avgCostGBP=p.shares>0?p.totalCostGBP/p.buys.reduce((s,b)=>s+b.shares,0):0;
      const livePrice=live?live.price:p.buys[p.buys.length-1]?.price||0;
      const toGBP=p.currency==="GBP"?1:1/FX;
      const liveValueGBP=p.shares*livePrice*toGBP;
      const costBasisGBP=p.shares*avgCostGBP;
      const openPnL=liveValueGBP-costBasisGBP;
      const openPct=costBasisGBP>0?openPnL/costBasisGBP*100:0;
      const changePct=live?.changePct||0;
      return{...p,avgCostGBP,livePrice,liveValueGBP,costBasisGBP,openPnL,openPct,changePct};
    });

    // Closed P&L from trade history
    const sells=trades.filter(t=>t.act==="SELL"&&t.pnl!=null);
    const wins=sells.filter(t=>t.pnl>0);
    const losses=sells.filter(t=>t.pnl<0);
    const totalRealisedPnL=sells.reduce((s,t)=>s+(t.pnl||0),0);
    const winRate=sells.length?wins.length/sells.length*100:0;
    const avgWin=wins.length?wins.reduce((s,t)=>s+t.pnl,0)/wins.length:0;
    const avgLoss=losses.length?losses.reduce((s,t)=>s+t.pnl,0)/losses.length:0;
    const profitFactor=avgLoss!==0?Math.abs(avgWin/avgLoss):null;

    // Totals
    const totalValue=openPos.reduce((s,p)=>s+p.liveValueGBP,0);
    const totalCost=openPos.reduce((s,p)=>s+p.costBasisGBP,0);
    const totalOpenPnL=openPos.reduce((s,p)=>s+p.openPnL,0);
    const totalOpenPct=totalCost>0?totalOpenPnL/totalCost*100:0;
    const totalInvested=trades.filter(t=>t.act==="BUY").reduce((s,t)=>s+t.total,0);
    const totalPnL=totalOpenPnL+totalRealisedPnL;

    // By account
    const byAcct={};
    openPos.forEach(p=>{
      if(!byAcct[p.acct])byAcct[p.acct]={value:0,cost:0,pnl:0,positions:[]};
      byAcct[p.acct].value+=p.liveValueGBP;
      byAcct[p.acct].cost+=p.costBasisGBP;
      byAcct[p.acct].pnl+=p.openPnL;
      byAcct[p.acct].positions.push(p);
    });

    // Monthly P&L
    const monthly={};
    trades.filter(t=>t.pnl!=null).forEach(t=>{
      const m=t.date.slice(0,7);
      monthly[m]=(monthly[m]||0)+(t.pnl||0);
    });
    const monthlyArr=Object.entries(monthly).sort().map(([m,v])=>({m:m.slice(5),v}));

    // Best/worst trade
    const best=sells.reduce((b,t)=>(!b||t.pnl>b.pnl)?t:b,null);
    const worst=sells.reduce((b,t)=>(!b||t.pnl<b.pnl)?t:b,null);

    return{openPos,byAcct,sells,wins,losses,totalRealisedPnL,winRate,avgWin,avgLoss,profitFactor,totalValue,totalCost,totalOpenPnL,totalOpenPct,totalInvested,totalPnL,monthlyArr,best,worst};
  },[trades,livePrices]);

  const css=`
    @import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap);
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;overflow:hidden;}
    body{background:#080B14;font-family:'Inter',system-ui,sans-serif;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}
    input,select{font-family:'Inter',sans-serif;}
    button:focus{outline:none;}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(99,102,241,0.3)}50%{box-shadow:0 0 20px rgba(99,102,241,0.6)}}
    .nav-item{display:flex;align-items:center;padding:9px 12px;border-radius:8px;cursor:pointer;transition:all .15s;margin-bottom:2px;}
    .nav-item:hover{background:rgba(255,255,255,0.05);}
    .nav-item.active{background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.2);}
    .tab-btn{background:transparent;border:none;padding:10px 16px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;color:#64748B;transition:all .15s;white-space:nowrap;}
    .tab-btn.active{color:#6366F1;border-bottom-color:#6366F1;font-weight:600;}
    .tab-btn:hover{color:#F1F5F9;}
    .tr-row:hover{background:rgba(255,255,255,0.03);}
  `;

  if(loading)return<div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:D.bg}}><div style={{color:D.indigo,fontFamily:D.sans,fontSize:14}}>Loading...</div></div>;
  if(!session)return<AuthScreen/>;

  const user=session.user;
  const userName=user.user_metadata?.full_name||user.email?.split("@")[0]||"Investor";
  const initials=userName.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);

  const TABS=["common","diversification","performance","growth","metrics","transactions"];

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:D.bg,fontFamily:D.sans}}>
      <style>{css}</style>

      {/* -- SIDEBAR -- */}
      <div style={{width:sidebarCollapsed?60:220,background:D.panel,borderRight:"1px solid "+D.border,display:"flex",flexDirection:"column",flexShrink:0,transition:"width .2s",overflow:"hidden"}}>
        <div style={{padding:"18px 14px",borderBottom:"1px solid "+D.border,display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 0 12px rgba(99,102,241,0.4)"}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          {!sidebarCollapsed&&<div>
            <div style={{fontSize:12,fontWeight:700,color:D.text}}>Portfolio</div>
            <div style={{fontSize:10,color:D.text3,marginTop:1}}>Analytics</div>
          </div>}
          <button onClick={()=>setSidebarCollapsed(v=>!v)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:D.text3,padding:2,display:"flex",borderRadius:4}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={sidebarCollapsed?"M9 18l6-6-6-6":"M15 18l-6-6 6-6"}/></svg>
          </button>
        </div>

        {/* Portfolio summary in sidebar */}
        {!sidebarCollapsed&&analytics.totalValue>0&&(
          <div style={{padding:"14px 14px",borderBottom:"1px solid "+D.border}}>
            <div style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:8}}>Portfolio</div>
            <div style={{fontFamily:D.mono,fontWeight:700,fontSize:18,color:D.text,letterSpacing:"-0.3px",marginBottom:4}}>{gbp(analytics.totalValue)}</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontFamily:D.mono,fontSize:11,fontWeight:600,color:analytics.totalOpenPnL>=0?D.green:D.red}}>{analytics.totalOpenPnL>=0?"+":""}{gbp(analytics.totalOpenPnL)}</span>
              <span style={{fontSize:9,padding:"1px 6px",borderRadius:20,fontWeight:600,background:analytics.totalOpenPct>=0?D.greenBg:D.redBg,color:analytics.totalOpenPct>=0?D.green:D.red,border:"1px solid "+(analytics.totalOpenPct>=0?D.greenBd:D.redBd)}}>{pct(analytics.totalOpenPct)}</span>
            </div>
          </div>
        )}

        <div style={{padding:"12px 8px",flex:1,overflowY:"auto"}}>
          {!sidebarCollapsed&&<div style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,padding:"0 8px 8px"}}>Navigation</div>}
          {[
            {icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",label:"Dashboard",t:"common"},
            {icon:"M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z",label:"Diversification",t:"diversification"},
            {icon:"M7 12l3-3 3 3 4-4",label:"Performance",t:"performance"},
            {icon:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",label:"Growth",t:"growth"},
            {icon:"M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M16 5l3 3m0 0l-3 3m3-3H9",label:"Metrics",t:"metrics"},
            {icon:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",label:"Transactions",t:"transactions"},
          ].map(item=>(
            <div key={item.t} className={"nav-item"+(tab===item.t?" active":"")} onClick={()=>setTab(item.t)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tab===item.t?D.indigo:"rgba(255,255,255,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <path d={item.icon}/>
              </svg>
              {!sidebarCollapsed&&<span style={{marginLeft:9,fontSize:12,color:tab===item.t?D.text:"rgba(255,255,255,0.45)",fontWeight:tab===item.t?500:400}}>{item.label}</span>}
              {!sidebarCollapsed&&tab===item.t&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:D.indigo,boxShadow:"0 0 6px "+D.indigo}}/>}
            </div>
          ))}
        </div>

        <div style={{padding:"12px 14px",borderTop:"1px solid "+D.border}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,fontWeight:700,color:"white"}}>{initials}</span>
            </div>
            {!sidebarCollapsed&&<div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:500,color:D.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div>
              <button onClick={()=>supabase.auth.signOut()} style={{fontSize:10,color:D.text3,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:D.sans}}>Sign out</button>
            </div>}
          </div>
        </div>
      </div>

      {/* -- MAIN -- */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:D.panel,borderBottom:"1px solid "+D.border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,flexShrink:0}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:D.text,letterSpacing:"-0.2px"}}>
              {tab==="common"?"Dashboard":tab==="diversification"?"Diversification":tab==="performance"?"Performance":tab==="growth"?"Growth":tab==="metrics"?"Metrics":"Transactions"}
            </div>
            <div style={{fontSize:10,color:D.text3,marginTop:1,display:"flex",alignItems:"center",gap:8}}>
              <span>{lastUpdated?lastUpdated.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"--"}</span>
              <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"1px 7px",borderRadius:20,fontSize:9,fontWeight:600,
                background:priceStatus==="live"?D.greenBg:D.panel2,
                border:"1px solid "+(priceStatus==="live"?D.greenBd:D.border),
                color:priceStatus==="live"?D.green:D.text3}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:priceStatus==="live"?D.green:D.text3,display:"inline-block",animation:priceStatus==="live"?"pulse 2s infinite":"none"}}/>
                {priceStatus==="live"?"LIVE":priceStatus==="closed"?"CLOSED":"--"}
              </span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            {analytics.totalValue>0&&<>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Portfolio</div>
                <div style={{fontFamily:D.mono,fontWeight:700,fontSize:16,color:D.text}}>{gbp(analytics.totalValue)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Open P&L</div>
                <div style={{fontFamily:D.mono,fontWeight:700,fontSize:13,color:analytics.totalOpenPnL>=0?D.green:D.red}}>{analytics.totalOpenPnL>=0?"+":""}{gbp(analytics.totalOpenPnL)}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Closed P&L</div>
                <div style={{fontFamily:D.mono,fontWeight:700,fontSize:13,color:analytics.totalRealisedPnL>=0?D.green:D.red}}>{analytics.totalRealisedPnL>=0?"+":""}{gbp(analytics.totalRealisedPnL)}</div>
              </div>
            </>}
            <button onClick={()=>setShowTrade(true)}
              style={{padding:"8px 18px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"white",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:"0 0 20px rgba(99,102,241,0.3)",animation:"glow 3s ease-in-out infinite"}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Log Trade
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{background:D.panel,borderBottom:"1px solid "+D.border,padding:"0 24px",display:"flex",overflowX:"auto",flexShrink:0}}>
          {TABS.map(t=><button key={t} className={"tab-btn"+(tab===t?" active":"")} onClick={()=>setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</button>)}
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"24px"}}>

          {/* Empty state */}
          {trades.length===0&&(
            <div style={{background:D.panel,borderRadius:16,border:"1px solid "+D.border,padding:"80px 40px",textAlign:"center",boxShadow:D.s2}}>
              <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",boxShadow:"0 0 30px rgba(99,102,241,0.4)"}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div style={{fontSize:20,fontWeight:700,color:D.text,marginBottom:8}}>Start tracking your portfolio</div>
              <div style={{fontSize:13,color:D.text3,marginBottom:28,lineHeight:1.6}}>Log your first trade and we'll automatically calculate your P&L,<br/>open positions, and performance analytics.</div>
              <button onClick={()=>setShowTrade(true)}
                style={{padding:"12px 32px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"white",fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 0 20px rgba(99,102,241,0.4)"}}>
                Log First Trade
              </button>
            </div>
          )}

          {trades.length>0&&<>

          {/* ===== COMMON ===== */}
          {tab==="common"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                <Kpi label="Portfolio Value" value={gbp(analytics.totalValue)} color={D.indigo} accent={D.indigo} size={18} glow/>
                <Kpi label="Open P&L" value={(analytics.totalOpenPnL>=0?"+":"")+gbp(analytics.totalOpenPnL)} sub={pct(analytics.totalOpenPct)} color={analytics.totalOpenPnL>=0?D.green:D.red} accent={analytics.totalOpenPnL>=0?D.green:D.red}/>
                <Kpi label="Closed P&L" value={(analytics.totalRealisedPnL>=0?"+":"")+gbp(analytics.totalRealisedPnL)} sub={analytics.sells.length+" closed trades"} color={analytics.totalRealisedPnL>=0?D.green:D.red} accent={analytics.totalRealisedPnL>=0?D.green:D.red}/>
                <Kpi label="Total P&L" value={(analytics.totalPnL>=0?"+":"")+gbp(analytics.totalPnL)} sub="open + closed" color={analytics.totalPnL>=0?D.green:D.red} accent={analytics.totalPnL>=0?D.green:D.red}/>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16,marginBottom:16}}>
                {/* Open positions */}
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16,display:"flex",justifyContent:"space-between"}}>
                    <span>Open Positions</span>
                    <span style={{fontSize:10,color:D.text3,fontFamily:D.mono}}>{analytics.openPos.length} holdings</span>
                  </div>
                  {analytics.openPos.length===0?(
                    <div style={{fontSize:12,color:D.text3,textAlign:"center",padding:"20px 0"}}>No open positions</div>
                  ):(
                    analytics.openPos.map(p=>(
                      <div key={p.ticker+p.acct} style={{padding:"10px 0",borderBottom:"1px solid "+D.border}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <div style={{width:34,height:34,borderRadius:8,background:D.indigoBg,border:"1px solid "+D.indigoBd,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              <span style={{fontSize:9,fontWeight:700,color:D.indigo}}>{p.ticker.slice(0,4)}</span>
                            </div>
                            <div>
                              <div style={{fontSize:12,fontWeight:500,color:D.text}}>{p.ticker}</div>
                              <div style={{fontSize:9,color:D.text3,marginTop:1}}>{p.shares.toFixed(2)} sh / {p.acct}</div>
                            </div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:D.mono,fontWeight:600,fontSize:13,color:D.text}}>{gbp(p.liveValueGBP)}</div>
                            <div style={{fontFamily:D.mono,fontSize:10,color:p.openPnL>=0?D.green:D.red,marginTop:1}}>{p.openPnL>=0?"+":""}{gbp(p.openPnL)} ({pct(p.openPct)})</div>
                          </div>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontFamily:D.mono,fontSize:10,color:D.text2}}>{p.currency==="GBP"?"£":"$"}{p.livePrice.toFixed(2)}</span>
                            <span style={{fontSize:8,padding:"1px 6px",borderRadius:20,fontWeight:600,background:p.changePct>=0?D.greenBg:D.redBg,color:p.changePct>=0?D.green:D.red,border:"1px solid "+(p.changePct>=0?D.greenBd:D.redBd)}}>
                              {p.changePct>=0?"+":""}{p.changePct.toFixed(2)}%
                            </span>
                          </div>
                          <span style={{fontSize:9,color:D.text3,fontFamily:D.mono}}>Avg {p.currency==="GBP"?"£":"$"}{p.avgCostGBP.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Monthly P&L */}
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>Monthly Closed P&L</div>
                  {analytics.monthlyArr.length>0?(
                    <Bars data={analytics.monthlyArr} vk="v" lk="m" neg h={120}/>
                  ):(
                    <div style={{fontSize:12,color:D.text3,textAlign:"center",padding:"20px 0"}}>Log sell trades to see monthly P&L</div>
                  )}
                </div>
              </div>

              {/* Account breakdown */}
              {Object.keys(analytics.byAcct).length>0&&(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
                  {Object.entries(analytics.byAcct).map(([acct,data])=>{
                    const ac=ACCT_COLORS[acct]||D.indigo;
                    const pct2=data.cost>0?data.pnl/data.cost*100:0;
                    return(
                      <div key={acct} style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,borderLeft:"3px solid "+ac,padding:"14px 18px",boxShadow:D.s1}}>
                        <div style={{fontSize:9,color:ac,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>{acct}</div>
                        <div style={{fontFamily:D.mono,fontWeight:700,fontSize:17,color:D.text,marginBottom:4}}>{gbp(data.value)}</div>
                        <div style={{fontFamily:D.mono,fontSize:11,color:data.pnl>=0?D.green:D.red}}>{data.pnl>=0?"+":""}{gbp(data.pnl)} ({pct(pct2)})</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===== DIVERSIFICATION ===== */}
          {tab==="diversification"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>By Security</div>
                  <Donut size={150} data={analytics.openPos.map((p,i)=>({name:p.ticker,value:p.liveValueGBP,color:[D.indigo,D.green,D.amber,D.purple,D.cyan,D.red][i%6]}))}/>
                </div>
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>By Account</div>
                  <Donut size={150} data={Object.entries(analytics.byAcct).map(([k,v])=>({name:k,value:v.value,color:ACCT_COLORS[k]||D.indigo}))}/>
                </div>
              </div>
              <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:14}}>Holdings Detail</div>
                {analytics.openPos.map((p,i)=>{
                  const col=[D.indigo,D.green,D.amber,D.purple,D.cyan,D.red][i%6];
                  const weight=analytics.totalValue>0?p.liveValueGBP/analytics.totalValue*100:0;
                  return(
                    <div key={p.ticker+p.acct} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid "+D.border}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:8,height:8,borderRadius:2,background:col,flexShrink:0}}/>
                        <span style={{fontSize:12,fontWeight:500,color:D.text}}>{p.ticker}</span>
                        <span style={{fontSize:10,color:D.text3}}>{p.acct}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:16}}>
                        <div style={{width:80,height:4,background:D.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:weight+"%",background:col,borderRadius:2}}/></div>
                        <span style={{fontFamily:D.mono,fontSize:10,color:D.text3,minWidth:36}}>{weight.toFixed(1)}%</span>
                        <span style={{fontFamily:D.mono,fontWeight:600,fontSize:12,color:D.text,minWidth:80,textAlign:"right"}}>{gbp(p.liveValueGBP)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== PERFORMANCE ===== */}
          {tab==="performance"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                <Kpi label="Win Rate" value={analytics.winRate.toFixed(1)+"%"} sub={analytics.wins.length+"W / "+analytics.losses.length+"L"} color={analytics.winRate>=50?D.green:D.red} accent={analytics.winRate>=50?D.green:D.red} size={22}/>
                <Kpi label="Profit Factor" value={analytics.profitFactor?analytics.profitFactor.toFixed(2):"N/A"} sub=">1.0 is profitable" color={analytics.profitFactor>1?D.green:D.red} accent={analytics.profitFactor>1?D.green:D.red} size={22}/>
                <Kpi label="Total Closed P&L" value={(analytics.totalRealisedPnL>=0?"+":"")+gbp(analytics.totalRealisedPnL)} sub="all closed positions" color={analytics.totalRealisedPnL>=0?D.green:D.red} accent={analytics.totalRealisedPnL>=0?D.green:D.red} size={22}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:16,marginBottom:16}}>
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>P&L by Security</div>
                  {(()=>{
                    const byTk={};
                    analytics.sells.forEach(t=>{byTk[t.ticker]=(byTk[t.ticker]||0)+(t.pnl||0);});
                    const data=Object.entries(byTk).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({ticker:k,pnl:v}));
                    return data.length>0?<Bars data={data} vk="pnl" lk="ticker" neg h={120}/>:<div style={{fontSize:12,color:D.text3,textAlign:"center",padding:"20px 0"}}>No closed trades yet</div>;
                  })()}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <Kpi label="Avg Win" value={gbp(analytics.avgWin)} color={D.green} accent={D.green}/>
                    <Kpi label="Avg Loss" value={gbp(analytics.avgLoss)} color={D.red} accent={D.red}/>
                  </div>
                  {analytics.best&&<div style={{background:D.panel,borderRadius:10,border:"1px solid "+D.greenBd,padding:"14px 16px",boxShadow:"0 0 15px "+D.green+"15"}}>
                    <div style={{fontSize:9,color:D.green,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:5}}>Best Trade</div>
                    <div style={{fontFamily:D.mono,fontWeight:700,fontSize:20,color:D.green}}>+{gbp(analytics.best.pnl)}</div>
                    <div style={{fontSize:10,color:D.text3,marginTop:4}}>{analytics.best.ticker} / {analytics.best.date}</div>
                  </div>}
                  {analytics.worst&&<div style={{background:D.panel,borderRadius:10,border:"1px solid "+D.redBd,padding:"14px 16px",boxShadow:"0 0 15px "+D.red+"15"}}>
                    <div style={{fontSize:9,color:D.red,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:5}}>Worst Trade</div>
                    <div style={{fontFamily:D.mono,fontWeight:700,fontSize:20,color:D.red}}>{gbp(analytics.worst.pnl)}</div>
                    <div style={{fontSize:10,color:D.text3,marginTop:4}}>{analytics.worst.ticker} / {analytics.worst.date}</div>
                  </div>}
                </div>
              </div>
              {/* Open positions performance */}
              <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:14}}>Open Positions Performance</div>
                <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 1fr 1fr 1fr 1fr",padding:"8px 0",borderBottom:"1px solid "+D.border}}>
                  {["Security","Account","Value","Open P&L","% Return","Today"].map(h=>(
                    <div key={h} style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{h}</div>
                  ))}
                </div>
                {analytics.openPos.map(p=>(
                  <div key={p.ticker+p.acct} className="tr-row" style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 1fr 1fr 1fr 1fr",padding:"10px 0",borderBottom:"1px solid "+D.border,transition:"background .1s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:D.indigo}}/>
                      <div>
                        <div style={{fontSize:12,fontWeight:500,color:D.text}}>{p.ticker}</div>
                        <div style={{fontSize:9,color:D.text3}}>{p.shares.toFixed(2)} sh</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center"}}><span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:D.panel2,border:"1px solid "+D.border,color:D.text3}}>{p.acct}</span></div>
                    <div style={{display:"flex",alignItems:"center",fontFamily:D.mono,fontSize:12,fontWeight:600,color:D.text}}>{gbp(p.liveValueGBP)}</div>
                    <div style={{display:"flex",alignItems:"center",fontFamily:D.mono,fontSize:11,color:p.openPnL>=0?D.green:D.red}}>{p.openPnL>=0?"+":""}{gbp(p.openPnL)}</div>
                    <div style={{display:"flex",alignItems:"center",fontFamily:D.mono,fontSize:11,color:p.openPct>=0?D.green:D.red}}>{pct(p.openPct)}</div>
                    <div style={{display:"flex",alignItems:"center"}}>
                      <span style={{fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:600,background:p.changePct>=0?D.greenBg:D.redBg,color:p.changePct>=0?D.green:D.red,border:"1px solid "+(p.changePct>=0?D.greenBd:D.redBd)}}>
                        {p.changePct>=0?"+":""}{p.changePct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== GROWTH ===== */}
          {tab==="growth"&&(
            <div>
              {/* Milestones */}
              <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:4}}>Wealth Milestones</div>
                <div style={{fontSize:11,color:D.text3,marginBottom:20}}>Based on current portfolio value of {gbp(analytics.totalValue)}</div>
                {[["£10,000",10000],["£50,000",50000],["£100,000",100000],["£250,000",250000],["£500,000",500000],["£1,000,000",1000000]].map(([lbl,target])=>{
                  const progress=Math.min(100,analytics.totalValue/target*100);
                  const reached=analytics.totalValue>=target;
                  return(
                    <div key={lbl} style={{marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                        <span style={{fontSize:12,fontWeight:500,color:reached?D.green:D.text2}}>{lbl}</span>
                        <span style={{fontFamily:D.mono,fontSize:11,color:reached?D.green:D.text3,fontWeight:reached?700:400}}>{reached?"Achieved!":gbp(target-analytics.totalValue)+" remaining"}</span>
                      </div>
                      <div style={{height:8,background:D.panel2,borderRadius:4,overflow:"hidden",border:"1px solid "+D.border}}>
                        <div style={{height:"100%",width:progress+"%",background:reached?"linear-gradient(90deg,"+D.green+",#059669)":"linear-gradient(90deg,"+D.indigo+","+D.purple+")",borderRadius:4,transition:"width 0.8s ease",boxShadow:reached?"0 0 10px "+D.green+"40":"0 0 10px "+D.indigo+"40"}}/>
                      </div>
                      <div style={{fontSize:9,color:D.text3,marginTop:3,fontFamily:D.mono}}>{progress.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>

              {/* Compound projector */}
              <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2,marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>Compound Growth Projector</div>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                  <span style={{fontSize:11,color:D.text3,minWidth:80}}>Annual return</span>
                  <input type="range" min={5} max={50} value={goalR} onChange={e=>setGoalR(parseInt(e.target.value))} style={{flex:1,accentColor:D.indigo}}/>
                  <span style={{fontFamily:D.mono,fontSize:14,fontWeight:700,color:D.indigo,minWidth:44}}>{goalR}%</span>
                  {[10,20,30].map(y=>(
                    <button key={y} onClick={()=>setGoalY(y)} style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+(goalY===y?D.indigo:D.border),background:goalY===y?D.indigoBg:"transparent",color:goalY===y?D.indigo:D.text3,fontSize:10,cursor:"pointer",fontFamily:D.mono,fontWeight:goalY===y?600:400}}>{y}Y</button>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[["Conservative",10,D.text3],["Moderate",20,D.amber],["Aggressive",35,D.indigo],["Custom "+goalR+"%",goalR,D.green]].slice(0,3).concat([["Custom "+goalR+"%",goalR,D.green]]).map(([l,r,c])=>{
                    const fv=analytics.totalValue*Math.pow(1+r/100,goalY);
                    return(
                      <div key={l} style={{background:D.panel2,borderRadius:10,border:"1px solid "+D.border,padding:"14px 16px",borderTop:"2px solid "+c}}>
                        <div style={{fontSize:10,color:D.text3,marginBottom:8}}>{l} ({r}%)</div>
                        <div style={{fontFamily:D.mono,fontWeight:700,fontSize:16,color:c,letterSpacing:"-0.2px"}}>{gbp(fv)}</div>
                        <div style={{fontSize:9,color:D.text3,marginTop:4,fontFamily:D.mono}}>+{gbp(fv-analytics.totalValue)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===== METRICS ===== */}
          {tab==="metrics"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
                <Kpi label="Total Invested" value={gbp(analytics.totalInvested)} sub="all buy trades" color={D.text2}/>
                <Kpi label="Current Value" value={gbp(analytics.totalValue)} color={D.indigo} accent={D.indigo}/>
                <Kpi label="Open P&L" value={(analytics.totalOpenPnL>=0?"+":"")+gbp(analytics.totalOpenPnL)} color={analytics.totalOpenPnL>=0?D.green:D.red} accent={analytics.totalOpenPnL>=0?D.green:D.red}/>
                <Kpi label="Realised P&L" value={(analytics.totalRealisedPnL>=0?"+":"")+gbp(analytics.totalRealisedPnL)} color={analytics.totalRealisedPnL>=0?D.green:D.red} accent={analytics.totalRealisedPnL>=0?D.green:D.red}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>Trade Statistics</div>
                  {[
                    {l:"Total Trades",v:String(trades.length),c:D.text},
                    {l:"Buy Orders",v:String(trades.filter(t=>t.act==="BUY").length),c:D.green},
                    {l:"Sell Orders",v:String(trades.filter(t=>t.act==="SELL").length),c:D.red},
                    {l:"Win Rate",v:analytics.winRate.toFixed(1)+"%",c:analytics.winRate>=50?D.green:D.red},
                    {l:"Profit Factor",v:analytics.profitFactor?analytics.profitFactor.toFixed(2):"N/A",c:analytics.profitFactor>1?D.green:D.red},
                    {l:"Avg Win",v:gbp(analytics.avgWin),c:D.green},
                    {l:"Avg Loss",v:gbp(analytics.avgLoss),c:D.red},
                  ].map(s=>(
                    <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid "+D.border}}>
                      <span style={{fontSize:11,color:D.text2}}>{s.l}</span>
                      <span style={{fontFamily:D.mono,fontWeight:500,fontSize:11,color:s.c}}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,padding:"20px 22px",boxShadow:D.s2}}>
                  <div style={{fontSize:13,fontWeight:600,color:D.text,marginBottom:16}}>Position Metrics</div>
                  {analytics.openPos.map(p=>(
                    <div key={p.ticker+p.acct} style={{marginBottom:16,paddingBottom:16,borderBottom:"1px solid "+D.border}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:12,fontWeight:600,color:D.indigo}}>{p.ticker}</span>
                        <span style={{fontSize:10,color:D.text3}}>{p.acct}</span>
                      </div>
                      {[
                        {l:"Shares",v:p.shares.toFixed(2)},
                        {l:"Avg Cost",v:(p.currency==="GBP"?"£":"$")+p.avgCostGBP.toFixed(2)},
                        {l:"Live Price",v:(p.currency==="GBP"?"£":"$")+p.livePrice.toFixed(2)},
                        {l:"Open P&L",v:(p.openPnL>=0?"+":"")+gbp(p.openPnL),c:p.openPnL>=0?D.green:D.red},
                      ].map(m=>(
                        <div key={m.l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0"}}>
                          <span style={{fontSize:10,color:D.text3}}>{m.l}</span>
                          <span style={{fontFamily:D.mono,fontSize:10,color:m.c||D.text2,fontWeight:m.c?600:400}}>{m.v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== TRANSACTIONS ===== */}
          {tab==="transactions"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                <Kpi label="Total Trades" value={String(trades.length)} color={D.text2}/>
                <Kpi label="Realised P&L" value={(analytics.totalRealisedPnL>=0?"+":"")+gbp(analytics.totalRealisedPnL)} color={analytics.totalRealisedPnL>=0?D.green:D.red} accent={analytics.totalRealisedPnL>=0?D.green:D.red}/>
                <Kpi label="Win Rate" value={analytics.winRate.toFixed(1)+"%"} color={analytics.winRate>=50?D.green:D.red} accent={analytics.winRate>=50?D.green:D.red}/>
              </div>
              <div style={{background:D.panel,borderRadius:14,border:"1px solid "+D.border,boxShadow:D.s2,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"90px 60px 50px 55px 80px 90px 90px 1fr",padding:"10px 20px",background:D.panel2,borderBottom:"1px solid "+D.border}}>
                  {["Date","Ticker","Acct","Side","Shares","Price","P&L","Notes"].map(h=>(
                    <div key={h} style={{fontSize:9,color:D.text3,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{h}</div>
                  ))}
                </div>
                <div style={{maxHeight:520,overflowY:"auto"}}>
                  {[...trades].reverse().map((t,i)=>(
                    <div key={t.id} className="tr-row" style={{display:"grid",gridTemplateColumns:"90px 60px 50px 55px 80px 90px 90px 1fr",padding:"9px 20px",borderBottom:"1px solid "+D.border,background:i%2?D.panel2:D.panel,transition:"background .1s",alignItems:"center"}}>
                      <div style={{fontFamily:D.mono,fontSize:10,color:D.text3}}>{t.date}</div>
                      <div style={{fontWeight:600,fontSize:12,color:D.text}}>{t.ticker}</div>
                      <div style={{fontSize:10,color:D.text3}}>{t.acct}</div>
                      <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:600,width:"fit-content",background:t.act==="BUY"?D.greenBg:D.redBg,color:t.act==="BUY"?D.green:D.red,border:"1px solid "+(t.act==="BUY"?D.greenBd:D.redBd)}}>{t.act}</span>
                      <div style={{fontFamily:D.mono,fontSize:10,color:D.text2}}>{t.shares?.toLocaleString()}</div>
                      <div style={{fontFamily:D.mono,fontSize:10,color:D.text2}}>{t.currency==="GBP"?"£":"$"}{t.price?.toFixed(2)}</div>
                      <div style={{fontFamily:D.mono,fontSize:10,fontWeight:t.pnl!=null?600:400,color:t.pnl!=null?t.pnl>=0?D.green:D.red:D.text3}}>
                        {t.pnl!=null?(t.pnl>=0?"+":"")+gbp(t.pnl):t.act==="BUY"?"open":"-"}
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:10,color:D.text3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{t.notes||"-"}</span>
                        <button onClick={()=>{if(confirm("Delete this trade?"))deleteTrade(t.id);}}
                          style={{background:"none",border:"none",cursor:"pointer",color:D.text3,padding:"2px 6px",borderRadius:4,fontSize:10,flexShrink:0,marginLeft:8}}
                          onMouseEnter={e=>e.target.style.color=D.red} onMouseLeave={e=>e.target.style.color=D.text3}>
                          x
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          </>}
        </div>
      </div>

      {showTrade&&<TradeModal onSave={saveTrade} onCancel={()=>setShowTrade(false)}/>}
    </div>
  );
}
