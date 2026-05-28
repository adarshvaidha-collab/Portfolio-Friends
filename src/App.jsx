import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// -- SUPABASE --------------------------------------------------
const SUPABASE_URL = "https://ckaprfsaaivcreswgppr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYXByZnNhYWl2Y3Jlc3dncHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NzA2MzMsImV4cCI6MjA5NTU0NjYzM30._qrFkoM6-CQBOH9KgFSa7NxuPncRtISKC09-iNWKD44";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// -- DESIGN TOKENS ---------------------------------------------
const D = {
  nav:"#0F172A", navHover:"#1E293B", navActive:"#1E293B",
  bg:"#F8FAFC", panel:"#FFFFFF", panel2:"#F1F5F9",
  border:"#E2E8F0", border2:"#CBD5E1",
  text:"#0F172A", text2:"#334155", text3:"#64748B", text4:"#94A3B8",
  teal:"#0D9488", tealBg:"#F0FDFA", tealBd:"#99F6E4",
  green:"#16A34A", greenBg:"#F0FDF4", greenBd:"#BBF7D0",
  red:"#DC2626", redBg:"#FEF2F2", redBd:"#FECACA",
  amber:"#D97706", amberBg:"#FFFBEB", amberBd:"#FDE68A",
  blue:"#2563EB", blueBg:"#EFF6FF", blueBd:"#BFDBFE",
  purple:"#7C3AED", purpleBg:"#F5F3FF", purpleBd:"#DDD6FE",
  s1:"0 1px 2px rgba(0,0,0,0.05)",
  s2:"0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  s3:"0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)",
  s4:"0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)",
  mono:"IBM Plex Mono, monospace", sans:"Inter, system-ui, sans-serif",
};

const ACCOUNT_TYPES = ["ISA","Invest","SIPP","GIA","Crypto","Other"];
const FINNHUB_KEY = "d0r9h1pr01qgdatuj9agd0r9h1pr01qgdatuj9b0";

const gbp = (n) => "£" + Math.abs(n).toLocaleString("en-GB", {minimumFractionDigits:2, maximumFractionDigits:2});
const gbpD = (n) => (n < 0 ? "-" : "") + gbp(n);
const pct = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

// -- AUTH SCREEN -----------------------------------------------
function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const signInGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  };

  const signInEmail = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (!error) setSent(true);
  };

  const css = `
    @import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap);
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0F172A;font-family:'Inter',system-ui,sans-serif;}
    input{font-family:'Inter',sans-serif;}
    button:focus{outline:none;}
  `;

  return (
    <div style={{minHeight:"100vh",background:"#0F172A",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{css}</style>
      <div style={{width:"100%",maxWidth:400}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:52,height:52,borderRadius:14,background:D.teal,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{fontSize:22,fontWeight:700,color:"white",letterSpacing:"-0.3px"}}>Portfolio Analytics</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:6}}>Track your investments in one place</div>
        </div>

        {/* Card */}
        <div style={{background:"#1E293B",borderRadius:16,padding:32,border:"1px solid rgba(255,255,255,0.07)"}}>
          {sent ? (
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:12}}>-</div>
              <div style={{fontSize:16,fontWeight:600,color:"white",marginBottom:8}}>Check your email</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>We sent a magic link to <strong style={{color:"white"}}>{email}</strong>. Click it to sign in - no password needed.</div>
            </div>
          ) : (
            <>
              <div style={{fontSize:15,fontWeight:600,color:"white",marginBottom:6}}>Sign in</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:24}}>New here? An account is created automatically.</div>

              {/* Google */}
              <button onClick={signInGoogle} disabled={loading}
                style={{width:"100%",padding:"12px 0",borderRadius:10,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",color:"white",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16,transition:"all .15s"}}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>or</span>
                <div style={{flex:1,height:1,background:"rgba(255,255,255,0.08)"}}/>
              </div>

              {/* Email */}
              <input value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="your@email.com" type="email"
                onKeyDown={e=>e.key==="Enter"&&signInEmail()}
                style={{width:"100%",padding:"11px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"white",fontSize:13,marginBottom:10,outline:"none"}}/>
              <button onClick={signInEmail} disabled={loading||!email}
                style={{width:"100%",padding:"12px 0",borderRadius:10,border:"none",background:D.teal,color:"white",fontSize:13,fontWeight:600,cursor:email?"pointer":"not-allowed",opacity:email?1:0.5}}>
                {loading?"Sending...":"Send magic link"}
              </button>
            </>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:11,color:"rgba(255,255,255,0.2)"}}>Private. Your data is only visible to you.</div>
      </div>
    </div>
  );
}

// -- TRADE FORM ------------------------------------------------
function TradeForm({onSave, onCancel, initial}){
  const [form, setForm] = useState(initial || {ticker:"",name:"",acct:"ISA",shares:"",avgPrice:"",currency:"USD",notes:""});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:D.panel,borderRadius:16,padding:28,width:"100%",maxWidth:440,boxShadow:D.s4}}>
        <div style={{fontSize:15,fontWeight:700,color:D.text,marginBottom:20}}>{initial?"Edit Position":"Add Position"}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Ticker *</div>
            <input value={form.ticker} onChange={e=>set("ticker",e.target.value.toUpperCase())}
              placeholder="SOFI" style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,fontFamily:D.mono,fontWeight:600,outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Account *</div>
            <select value={form.acct} onChange={e=>set("acct",e.target.value)}
              style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none",background:D.panel}}>
              {ACCOUNT_TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{marginBottom:10}}>
          <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Company Name</div>
          <input value={form.name} onChange={e=>set("name",e.target.value)}
            placeholder="SoFi Technologies" style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none"}}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Shares *</div>
            <input value={form.shares} onChange={e=>set("shares",e.target.value)}
              placeholder="100" type="number" style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,fontFamily:D.mono,outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Avg Price *</div>
            <input value={form.avgPrice} onChange={e=>set("avgPrice",e.target.value)}
              placeholder="16.17" type="number" style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,fontFamily:D.mono,outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Currency</div>
            <select value={form.currency} onChange={e=>set("currency",e.target.value)}
              style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none",background:D.panel}}>
              {["USD","GBP","EUR"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Notes</div>
          <input value={form.notes} onChange={e=>set("notes",e.target.value)}
            placeholder="Investment thesis..." style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none"}}/>
        </div>

        <div style={{display:"flex",gap:10}}>
          <button onClick={onCancel} style={{flex:1,padding:"10px 0",borderRadius:8,border:"1px solid "+D.border,background:"transparent",color:D.text3,fontSize:13,fontWeight:500,cursor:"pointer"}}>Cancel</button>
          <button onClick={()=>onSave(form)} disabled={!form.ticker||!form.shares||!form.avgPrice}
            style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:D.teal,color:"white",fontSize:13,fontWeight:600,cursor:"pointer",opacity:form.ticker&&form.shares&&form.avgPrice?1:0.5}}>
            {initial?"Save Changes":"Add Position"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -- MAIN APP --------------------------------------------------
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [trades, setTrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editPos, setEditPos] = useState(null);
  const [tab, setTab] = useState("overview");
  const [livePrices, setLivePrices] = useState({});
  const [priceStatus, setPriceStatus] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [tradeForm, setTradeForm] = useState({ticker:"",acct:"ISA",act:"BUY",shares:"",price:"",date:new Date().toISOString().slice(0,10),notes:""});

  // Auth
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      setLoading(false);
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,session)=>{
      setSession(session);
      setLoading(false);
    });
    return ()=>subscription.unsubscribe();
  },[]);

  // Load data
  useEffect(()=>{
    if(!session)return;
    loadPositions();
    loadTrades();
  },[session]);

  const loadPositions = async()=>{
    const {data} = await supabase.from("positions").select("*").eq("user_id",session.user.id).order("created_at",{ascending:false});
    setPositions(data||[]);
  };

  const loadTrades = async()=>{
    const {data} = await supabase.from("trades").select("*").eq("user_id",session.user.id).order("date",{ascending:false});
    setTrades(data||[]);
  };

  const savePosition = async(form)=>{
    const payload={
      user_id:session.user.id,
      ticker:form.ticker,
      name:form.name||form.ticker,
      acct:form.acct,
      shares:parseFloat(form.shares),
      avg_price:parseFloat(form.avgPrice),
      currency:form.currency||"USD",
      notes:form.notes||"",
    };
    if(editPos){
      await supabase.from("positions").update(payload).eq("id",editPos.id);
    } else {
      await supabase.from("positions").insert(payload);
    }
    setShowForm(false);
    setEditPos(null);
    loadPositions();
  };

  const deletePosition = async(id)=>{
    await supabase.from("positions").delete().eq("id",id);
    loadPositions();
  };

  const saveTrade = async()=>{
    await supabase.from("trades").insert({
      user_id:session.user.id,
      ticker:tradeForm.ticker,
      acct:tradeForm.acct,
      act:tradeForm.act,
      shares:parseFloat(tradeForm.shares),
      price:parseFloat(tradeForm.price),
      total:parseFloat(tradeForm.shares)*parseFloat(tradeForm.price),
      date:tradeForm.date,
      notes:tradeForm.notes||"",
    });
    setShowTradeForm(false);
    setTradeForm({ticker:"",acct:"ISA",act:"BUY",shares:"",price:"",date:new Date().toISOString().slice(0,10),notes:""});
    loadTrades();
  };

  // Live prices
  const isMarketOpen=()=>{
    const now=new Date();
    const et=new Date(now.toLocaleString("en-US",{timeZone:"America/New_York"}));
    const day=et.getDay(),h=et.getHours(),m=et.getMinutes(),mins=h*60+m;
    return day>=1&&day<=5&&mins>=570&&mins<960;
  };

  const fetchPrices=async()=>{
    const tickers=[...new Set(positions.map(p=>p.ticker))];
    if(tickers.length===0)return;
    const results={};
    await Promise.all(tickers.map(async(ticker)=>{
      try{
        const res=await fetch("https://finnhub.io/api/v1/quote?symbol="+ticker+"&token="+FINNHUB_KEY,{signal:AbortSignal.timeout(8000)});
        const data=await res.json();
        if(data&&data.c>0)results[ticker]={price:data.c,prev:data.pc,change:data.d,changePct:data.dp};
      }catch(e){}
      // Kraken for crypto
      if(ticker==="SOL"||ticker==="BTC"||ticker==="ETH"){
        try{
          const pair=ticker==="SOL"?"SOLGBP":ticker==="BTC"?"XBTGBP":"ETHGBP";
          const res=await fetch("https://api.kraken.com/0/public/Ticker?pair="+pair,{signal:AbortSignal.timeout(5000)});
          const data=await res.json();
          const p=Object.values(data.result||{})[0];
          if(p){const pr=parseFloat(p.c[0]),op=parseFloat(p.o);results[ticker]={price:pr,prev:op,change:pr-op,changePct:(pr-op)/op*100};}
        }catch(e){}
      }
    }));
    if(Object.keys(results).length>0){setLivePrices(results);setLastUpdated(new Date());setPriceStatus(isMarketOpen()?"live":"closed");}
    else setPriceStatus("error");
  };

  useEffect(()=>{
    if(positions.length>0){fetchPrices();const id=setInterval(fetchPrices,30000);return()=>clearInterval(id);}
  },[positions]);

  // Analytics
  const analytics = useMemo(()=>{
    const lp=(ticker,avgPrice,currency)=>{
      const live=livePrices[ticker];
      if(live)return{price:live.price,changePct:live.changePct||0};
      return{price:avgPrice,changePct:0};
    };
    const fx=1.3465;
    const posData=positions.map(p=>{
      const {price:livePrice,changePct}=lp(p.ticker,p.avg_price,p.currency);
      const toGBP=p.currency==="GBP"?1:p.currency==="USD"?1/fx:1/fx;
      const liveValue=p.shares*livePrice*toGBP;
      const costBasis=p.shares*p.avg_price*toGBP;
      const pnl=liveValue-costBasis;
      const pnlPct=costBasis>0?pnl/costBasis*100:0;
      return{...p,livePrice,liveValue,costBasis,pnl,pnlPct,changePct};
    });
    const totalValue=posData.reduce((s,p)=>s+p.liveValue,0);
    const totalCost=posData.reduce((s,p)=>s+p.costBasis,0);
    const totalPnL=totalValue-totalCost;
    const totalPct=totalCost>0?totalPnL/totalCost*100:0;

    // By account
    const byAcct={};
    posData.forEach(p=>{
      if(!byAcct[p.acct])byAcct[p.acct]={value:0,cost:0,positions:[]};
      byAcct[p.acct].value+=p.liveValue;
      byAcct[p.acct].cost+=p.costBasis;
      byAcct[p.acct].positions.push(p);
    });

    // Trade analytics
    const sells=trades.filter(t=>t.act==="SELL"&&t.pnl!=null);
    const wins=sells.filter(t=>t.pnl>0);
    const losses=sells.filter(t=>t.pnl<0);
    const winRate=sells.length?wins.length/sells.length*100:0;
    const totalRealised=sells.reduce((s,t)=>s+(t.pnl||0),0);

    return{posData,totalValue,totalCost,totalPnL,totalPct,byAcct,winRate,totalRealised,sells,wins,losses};
  },[positions,livePrices,trades]);

  const css=`
    @import url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap);
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;overflow:hidden;}
    body{background:#F8FAFC;font-family:'Inter',system-ui,sans-serif;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.1);border-radius:2px;}
    input,select{font-family:'Inter',sans-serif;}
    input:focus,select:focus{outline:none;border-color:#0D9488 !important;box-shadow:0 0 0 3px rgba(13,148,136,0.1);}
    button:focus{outline:none;}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
    .tab-btn{background:transparent;border:none;padding:10px 16px;font-family:'Inter',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border-bottom:2px solid transparent;color:#64748B;transition:all .15s;white-space:nowrap;}
    .tab-btn.active{color:#0D9488;border-bottom-color:#0D9488;font-weight:600;}
    .tab-btn:hover{color:#0F172A;}
    .nav-item{display:flex;align-items:center;padding:9px 12px;border-radius:8px;cursor:pointer;transition:all .15s;margin-bottom:2px;}
    .nav-item:hover{background:rgba(255,255,255,0.08);}
    .nav-item.active{background:rgba(255,255,255,0.12);}
    .pos-row:hover{background:#F8FAFC;}
    .action-btn{background:transparent;border:1px solid #E2E8F0;border-radius:6px;padding:4px 10px;font-size:11px;cursor:pointer;font-family:'Inter',sans-serif;color:#64748B;transition:all .15s;}
    .action-btn:hover{border-color:#0D9488;color:#0D9488;}
    .action-btn.danger:hover{border-color:#DC2626;color:#DC2626;}
  `;

  if(loading)return(<div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:D.nav}}><div style={{color:"white",fontSize:14,fontFamily:"Inter,sans-serif"}}>Loading...</div></div>);
  if(!session)return <AuthScreen/>;

  const user=session.user;
  const userName=user.user_metadata?.full_name||user.email?.split("@")[0]||"Investor";
  const userInitials=userName.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
  const TABS=["overview","positions","trades","growth"];

  return(
    <div style={{display:"flex",height:"100vh",overflow:"hidden",background:D.bg,fontFamily:D.sans}}>
      <style>{css}</style>

      {/* -- SIDEBAR -- */}
      <div style={{width:sidebarCollapsed?64:220,background:D.nav,display:"flex",flexDirection:"column",flexShrink:0,transition:"width .2s",overflow:"hidden"}}>
        {/* Logo */}
        <div style={{padding:"18px 14px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:8,background:D.teal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          {!sidebarCollapsed&&<div>
            <div style={{fontSize:12,fontWeight:700,color:"white"}}>Portfolio</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",marginTop:1}}>Analytics</div>
          </div>}
          <button onClick={()=>setSidebarCollapsed(v=>!v)} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",padding:2,display:"flex",borderRadius:4}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={sidebarCollapsed?"M9 18l6-6-6-6":"M15 18l-6-6 6-6"}/></svg>
          </button>
        </div>

        {/* Nav */}
        <div style={{padding:"12px 8px",flex:1,overflowY:"auto"}}>
          {!sidebarCollapsed&&<div style={{fontSize:9,color:"rgba(255,255,255,0.28)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,padding:"0 8px 8px"}}>Menu</div>}
          {[
            {icon:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",label:"Overview",t:"overview"},
            {icon:"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",label:"Positions",t:"positions"},
            {icon:"M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",label:"Trades",t:"trades"},
            {icon:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",label:"Growth",t:"growth"},
          ].map(item=>(
            <div key={item.t} className={"nav-item"+(tab===item.t?" active":"")} onClick={()=>setTab(item.t)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tab===item.t?D.teal:"rgba(255,255,255,0.4)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <path d={item.icon}/>
              </svg>
              {!sidebarCollapsed&&<span style={{marginLeft:9,fontSize:12,color:tab===item.t?"white":"rgba(255,255,255,0.5)",fontWeight:tab===item.t?500:400}}>{item.label}</span>}
              {!sidebarCollapsed&&tab===item.t&&<div style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:D.teal}}/>}
            </div>
          ))}
        </div>

        {/* User */}
        <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#0D9488,#0891B2)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,fontWeight:700,color:"white"}}>{userInitials}</span>
            </div>
            {!sidebarCollapsed&&<div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:500,color:"white",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{userName}</div>
              <button onClick={()=>supabase.auth.signOut()} style={{fontSize:10,color:"rgba(255,255,255,0.3)",background:"none",border:"none",cursor:"pointer",padding:0,marginTop:1,fontFamily:D.sans}}>Sign out</button>
            </div>}
          </div>
        </div>
      </div>

      {/* -- MAIN -- */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

        {/* Header */}
        <div style={{background:D.panel,borderBottom:"1px solid "+D.border,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,flexShrink:0,boxShadow:D.s2}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:D.text,letterSpacing:"-0.2px"}}>
              {tab==="overview"?"Portfolio Overview":tab==="positions"?"Open Positions":tab==="trades"?"Trade History":"Growth Projector"}
            </div>
            <div style={{fontSize:10,color:D.text4,marginTop:1,display:"flex",alignItems:"center",gap:7}}>
              <span>Updated {lastUpdated?lastUpdated.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"--:--"}</span>
              <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"1px 7px",borderRadius:20,fontSize:9,fontWeight:600,
                background:priceStatus==="live"?D.greenBg:D.panel2,
                border:"1px solid "+(priceStatus==="live"?D.greenBd:D.border),
                color:priceStatus==="live"?D.green:D.text4}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:priceStatus==="live"?D.green:D.text4,display:"inline-block",animation:priceStatus==="live"?"pulse 2s infinite":"none"}}/>
                {priceStatus==="live"?"LIVE":priceStatus==="closed"?"CLOSED":"--"}
              </span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:D.text4,marginBottom:2}}>Total Value</div>
              <div style={{fontFamily:D.mono,fontWeight:700,fontSize:17,color:D.text,letterSpacing:"-0.3px"}}>{gbpD(analytics.totalValue)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:D.text4,marginBottom:2}}>Total Return</div>
              <div style={{fontFamily:D.mono,fontWeight:700,fontSize:14,color:analytics.totalPnL>=0?D.teal:D.red}}>{analytics.totalPnL>=0?"+":""}{gbpD(analytics.totalPnL)}</div>
            </div>
            <div style={{padding:"5px 12px",borderRadius:20,background:analytics.totalPct>=0?D.tealBg:D.redBg,border:"1px solid "+(analytics.totalPct>=0?D.tealBd:D.redBd)}}>
              <span style={{fontFamily:D.mono,fontWeight:700,fontSize:12,color:analytics.totalPct>=0?D.teal:D.red}}>{pct(analytics.totalPct)}</span>
            </div>
            <button onClick={()=>setShowForm(true)}
              style={{padding:"8px 16px",borderRadius:8,border:"none",background:D.teal,color:"white",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              Add Position
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"24px"}}>

          {/* ===== OVERVIEW ===== */}
          {tab==="overview"&&(
            <div>
              {analytics.posData.length===0?(
                <div style={{background:D.panel,borderRadius:16,border:"1px solid "+D.border,boxShadow:D.s2,padding:"60px 40px",textAlign:"center"}}>
                  <div style={{fontSize:40,marginBottom:16}}>-</div>
                  <div style={{fontSize:18,fontWeight:600,color:D.text,marginBottom:8}}>No positions yet</div>
                  <div style={{fontSize:13,color:D.text4,marginBottom:24}}>Add your first position to start tracking your portfolio</div>
                  <button onClick={()=>setShowForm(true)} style={{padding:"10px 24px",borderRadius:8,border:"none",background:D.teal,color:"white",fontSize:13,fontWeight:600,cursor:"pointer"}}>Add Position</button>
                </div>
              ):(
                <>
                  {/* KPI row */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                    {[
                      {l:"Portfolio Value",v:gbpD(analytics.totalValue),c:D.teal,acc:D.teal},
                      {l:"Total Return",v:(analytics.totalPnL>=0?"+":"")+gbpD(analytics.totalPnL),c:analytics.totalPnL>=0?D.teal:D.red,acc:analytics.totalPnL>=0?D.teal:D.red},
                      {l:"Return %",v:pct(analytics.totalPct),c:analytics.totalPct>=0?D.teal:D.red,acc:analytics.totalPct>=0?D.teal:D.red},
                      {l:"Positions",v:String(analytics.posData.length),c:D.text2},
                    ].map(s=>(
                      <div key={s.l} style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,boxShadow:D.s2,padding:"14px 18px",borderTop:"2px solid "+(s.acc||D.border)}}>
                        <div style={{fontSize:10,color:D.text4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:7}}>{s.l}</div>
                        <div style={{fontFamily:D.mono,fontWeight:700,fontSize:18,color:s.c,letterSpacing:"-0.3px"}}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* By account */}
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:16}}>
                    {Object.entries(analytics.byAcct).map(([acct,data])=>{
                      const acctPnL=data.value-data.cost;
                      const acctPct=data.cost>0?acctPnL/data.cost*100:0;
                      const acctColor=acct==="ISA"?D.teal:acct==="Crypto"?D.purple:acct==="Invest"?D.amber:D.blue;
                      return(
                        <div key={acct} style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,boxShadow:D.s2,padding:"16px 20px",borderLeft:"3px solid "+acctColor}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                            <div>
                              <div style={{fontSize:10,color:acctColor,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{acct}</div>
                              <div style={{fontFamily:D.mono,fontWeight:700,fontSize:18,color:D.text,letterSpacing:"-0.3px"}}>{gbpD(data.value)}</div>
                            </div>
                            <div style={{padding:"3px 9px",borderRadius:20,background:acctPct>=0?D.tealBg:D.redBg,border:"1px solid "+(acctPct>=0?D.tealBd:D.redBd)}}>
                              <span style={{fontFamily:D.mono,fontSize:11,fontWeight:700,color:acctPct>=0?D.teal:D.red}}>{pct(acctPct)}</span>
                            </div>
                          </div>
                          {data.positions.map(p=>(
                            <div key={p.ticker} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid "+D.border}}>
                              <div style={{display:"flex",alignItems:"center",gap:7}}>
                                <div style={{width:6,height:6,borderRadius:"50%",background:acctColor}}/>
                                <span style={{fontSize:11,fontWeight:600,color:D.text}}>{p.ticker}</span>
                                <span style={{fontSize:10,color:D.text4}}>{p.shares.toLocaleString()} sh</span>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div style={{fontFamily:D.mono,fontSize:11,fontWeight:600,color:D.text}}>{gbpD(p.liveValue)}</div>
                                <div style={{fontFamily:D.mono,fontSize:10,color:p.pnl>=0?D.teal:D.red}}>{p.pnl>=0?"+":""}{gbpD(p.pnl)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {/* All positions summary */}
                  <div style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,boxShadow:D.s2,overflow:"hidden"}}>
                    <div style={{padding:"14px 20px",borderBottom:"1px solid "+D.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:13,fontWeight:600,color:D.text}}>All Positions</div>
                      <div style={{fontSize:11,color:D.text4,fontFamily:D.mono}}>{analytics.posData.length} holdings</div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 1fr 1fr 1fr 0.8fr",padding:"8px 20px",background:D.panel2,borderBottom:"1px solid "+D.border}}>
                      {["Security","Account","Value","P&L","Today","Price"].map(h=>(
                        <div key={h} style={{fontSize:10,color:D.text4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</div>
                      ))}
                    </div>
                    {analytics.posData.map((p,i)=>(
                      <div key={p.id} className="pos-row" style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 1fr 1fr 1fr 0.8fr",padding:"10px 20px",borderBottom:"1px solid "+D.border,transition:"background .1s"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:28,height:28,borderRadius:6,background:D.teal+"15",border:"1px solid "+D.teal+"25",display:"flex",alignItems:"center",justifyContent:"center"}}>
                            <span style={{fontSize:8,fontWeight:700,color:D.teal}}>{p.ticker.slice(0,4)}</span>
                          </div>
                          <div>
                            <div style={{fontSize:12,fontWeight:500,color:D.text}}>{p.name||p.ticker}</div>
                            <div style={{fontSize:10,color:D.text4}}>{p.shares.toLocaleString()} shares</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center"}}>
                          <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:D.panel2,border:"1px solid "+D.border,color:D.text3,fontWeight:500}}>{p.acct}</span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",fontFamily:D.mono,fontSize:12,fontWeight:600,color:D.text}}>{gbpD(p.liveValue)}</div>
                        <div style={{display:"flex",alignItems:"center",fontFamily:D.mono,fontSize:11,color:p.pnl>=0?D.teal:D.red,fontWeight:500}}>{p.pnl>=0?"+":""}{gbpD(p.pnl)} ({p.pnlPct>=0?"+":""}{p.pnlPct.toFixed(1)}%)</div>
                        <div style={{display:"flex",alignItems:"center"}}>
                          <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:600,background:p.changePct>=0?D.greenBg:D.redBg,color:p.changePct>=0?D.green:D.red,border:"1px solid "+(p.changePct>=0?D.greenBd:D.redBd)}}>
                            {p.changePct>=0?"+":""}{p.changePct.toFixed(2)}%
                          </span>
                        </div>
                        <div style={{display:"flex",alignItems:"center",fontFamily:D.mono,fontSize:11,color:D.text2}}>{p.currency==="GBP"?"£":"$"}{p.livePrice.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===== POSITIONS ===== */}
          {tab==="positions"&&(
            <div>
              {analytics.posData.length===0?(
                <div style={{background:D.panel,borderRadius:16,border:"1px solid "+D.border,padding:"60px",textAlign:"center"}}>
                  <div style={{fontSize:13,color:D.text4,marginBottom:16}}>No positions yet</div>
                  <button onClick={()=>setShowForm(true)} style={{padding:"9px 20px",borderRadius:8,border:"none",background:D.teal,color:"white",fontSize:12,fontWeight:600,cursor:"pointer"}}>Add First Position</button>
                </div>
              ):(
                analytics.posData.map(p=>(
                  <div key={p.id} style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,borderLeft:"3px solid "+(p.pnl>=0?D.teal:D.red),boxShadow:D.s2,padding:"16px 20px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:40,height:40,borderRadius:8,background:D.teal+"12",border:"1px solid "+D.teal+"20",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <span style={{fontSize:10,fontWeight:700,color:D.teal}}>{p.ticker.slice(0,4)}</span>
                        </div>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:D.text}}>{p.name||p.ticker}</div>
                          <div style={{fontSize:10,color:D.text4,marginTop:2}}>{p.shares.toLocaleString()} shares / {p.acct} / {p.currency}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <button className="action-btn" onClick={()=>{setEditPos(p);setShowForm(true);}}>Edit</button>
                        <button className="action-btn danger" onClick={()=>{if(confirm("Delete "+p.ticker+"?"))deletePosition(p.id);}}>Delete</button>
                        <div style={{textAlign:"right",marginLeft:8}}>
                          <div style={{fontFamily:D.mono,fontWeight:700,fontSize:17,color:D.text}}>{gbpD(p.liveValue)}</div>
                          <div style={{fontFamily:D.mono,fontSize:11,color:p.pnl>=0?D.teal:D.red,marginTop:2}}>{p.pnl>=0?"+":""}{gbpD(p.pnl)} ({p.pnlPct>=0?"+":""}{p.pnlPct.toFixed(2)}%)</div>
                        </div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:D.border,borderRadius:8,overflow:"hidden"}}>
                      {[
                        ["Avg Cost",(p.currency==="GBP"?"£":"$")+p.avg_price.toFixed(2),D.text2],
                        ["Live Price",(p.currency==="GBP"?"£":"$")+p.livePrice.toFixed(2),p.livePrice>=p.avg_price?D.teal:D.red],
                        ["Today",pct(p.changePct),p.changePct>=0?D.teal:D.red],
                        ["Break-even",(p.currency==="GBP"?"£":"$")+p.avg_price.toFixed(2),p.livePrice>=p.avg_price?D.teal:D.amber],
                      ].map(([l,v,c])=>(
                        <div key={l} style={{padding:"9px 14px",background:D.panel}}>
                          <div style={{fontSize:9,color:D.text4,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{l}</div>
                          <div style={{fontFamily:D.mono,fontWeight:600,fontSize:13,color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {p.notes&&<div style={{fontSize:11,color:D.text3,marginTop:10,lineHeight:1.6}}>{p.notes}</div>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== TRADES ===== */}
          {tab==="trades"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,flex:1,marginRight:16}}>
                  {[
                    {l:"Win Rate",v:analytics.winRate.toFixed(1)+"%",c:analytics.winRate>=50?D.teal:D.red},
                    {l:"Realised P&L",v:(analytics.totalRealised>=0?"+":"")+gbpD(analytics.totalRealised),c:analytics.totalRealised>=0?D.teal:D.red},
                    {l:"Total Trades",v:String(trades.length),c:D.text2},
                  ].map(s=>(
                    <div key={s.l} style={{background:D.panel,borderRadius:10,border:"1px solid "+D.border,padding:"12px 16px",boxShadow:D.s1}}>
                      <div style={{fontSize:10,color:D.text4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:5}}>{s.l}</div>
                      <div style={{fontFamily:D.mono,fontWeight:700,fontSize:16,color:s.c}}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setShowTradeForm(true)}
                  style={{padding:"10px 16px",borderRadius:8,border:"none",background:D.teal,color:"white",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                  Log Trade
                </button>
              </div>
              <div style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,boxShadow:D.s2,overflow:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"90px 70px 50px 60px 90px 90px 1fr",padding:"8px 20px",background:D.panel2,borderBottom:"1px solid "+D.border}}>
                  {["Date","Ticker","Acct","Side","Shares","Price","Notes"].map(h=>(
                    <div key={h} style={{fontSize:10,color:D.text4,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</div>
                  ))}
                </div>
                {trades.length===0?(
                  <div style={{padding:"40px",textAlign:"center",fontSize:13,color:D.text4}}>No trades logged yet</div>
                ):(
                  trades.map((t,i)=>(
                    <div key={t.id} style={{display:"grid",gridTemplateColumns:"90px 70px 50px 60px 90px 90px 1fr",padding:"9px 20px",borderBottom:"1px solid "+D.border,background:i%2?D.panel2:D.panel}}>
                      <div style={{fontFamily:D.mono,fontSize:10,color:D.text3}}>{t.date}</div>
                      <div style={{fontWeight:600,fontSize:12,color:D.text}}>{t.ticker}</div>
                      <div style={{fontSize:10,color:D.text4}}>{t.acct}</div>
                      <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:20,fontSize:9,fontWeight:600,height:"fit-content",background:t.act==="BUY"?D.greenBg:D.redBg,color:t.act==="BUY"?D.green:D.red,border:"1px solid "+(t.act==="BUY"?D.greenBd:D.redBd)}}>{t.act}</span>
                      <div style={{fontFamily:D.mono,fontSize:11,color:D.text2}}>{t.shares?.toLocaleString()}</div>
                      <div style={{fontFamily:D.mono,fontSize:11,color:D.text2}}>${t.price?.toFixed(2)}</div>
                      <div style={{fontSize:10,color:D.text4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.notes||"-"}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ===== GROWTH ===== */}
          {tab==="growth"&&(
            <div>
              <div style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,boxShadow:D.s2,padding:"20px 24px",marginBottom:16}}>
                <div style={{fontSize:14,fontWeight:600,color:D.text,marginBottom:4}}>Wealth Milestones</div>
                <div style={{fontSize:11,color:D.text4,marginBottom:20}}>Based on your current portfolio value of {gbpD(analytics.totalValue)}</div>
                {[["£50,000",50000],["£100,000",100000],["£250,000",250000],["£500,000",500000],["£1,000,000",1000000]].map(([lbl,target])=>{
                  const progress=Math.min(100,analytics.totalValue/target*100);
                  const reached=analytics.totalValue>=target;
                  return(
                    <div key={lbl} style={{marginBottom:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:12,fontWeight:500,color:reached?D.teal:D.text2}}>{lbl}</span>
                        <span style={{fontFamily:D.mono,fontSize:11,color:reached?D.teal:D.text4,fontWeight:reached?600:400}}>{reached?"Achieved!":gbpD(target-analytics.totalValue)+" to go"}</span>
                      </div>
                      <div style={{height:8,background:D.border,borderRadius:4,overflow:"hidden"}}>
                        <div style={{height:"100%",width:progress+"%",background:reached?"linear-gradient(90deg,"+D.teal+",#06B6D4)":D.teal,borderRadius:4,transition:"width 0.5s"}}/>
                      </div>
                      <div style={{fontSize:10,color:D.text4,marginTop:3}}>{progress.toFixed(1)}% there</div>
                    </div>
                  );
                })}
              </div>
              <div style={{background:D.panel,borderRadius:12,border:"1px solid "+D.border,boxShadow:D.s2,padding:"20px 24px"}}>
                <div style={{fontSize:14,fontWeight:600,color:D.text,marginBottom:16}}>Compound Projections</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                  {[10,20,35].map(rate=>{
                    const v10=analytics.totalValue*Math.pow(1+rate/100,10);
                    const v20=analytics.totalValue*Math.pow(1+rate/100,20);
                    return(
                      <div key={rate} style={{background:D.panel2,borderRadius:10,border:"1px solid "+D.border,padding:"14px 16px"}}>
                        <div style={{fontSize:11,fontWeight:600,color:D.text3,marginBottom:12}}>{rate}% CAGR</div>
                        <div style={{marginBottom:8}}>
                          <div style={{fontSize:9,color:D.text4,marginBottom:3}}>10 years</div>
                          <div style={{fontFamily:D.mono,fontWeight:700,fontSize:15,color:D.teal}}>{gbpD(v10)}</div>
                        </div>
                        <div>
                          <div style={{fontSize:9,color:D.text4,marginBottom:3}}>20 years</div>
                          <div style={{fontFamily:D.mono,fontWeight:700,fontSize:15,color:D.teal}}>{gbpD(v20)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* -- ADD/EDIT POSITION MODAL -- */}
      {showForm&&(
        <TradeForm
          onSave={savePosition}
          onCancel={()=>{setShowForm(false);setEditPos(null);}}
          initial={editPos?{ticker:editPos.ticker,name:editPos.name,acct:editPos.acct,shares:String(editPos.shares),avgPrice:String(editPos.avg_price),currency:editPos.currency,notes:editPos.notes}:null}
        />
      )}

      {/* -- LOG TRADE MODAL -- */}
      {showTradeForm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:D.panel,borderRadius:16,padding:28,width:"100%",maxWidth:420,boxShadow:D.s4}}>
            <div style={{fontSize:15,fontWeight:700,color:D.text,marginBottom:20}}>Log Trade</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              {[["Ticker","ticker","text","SOFI"],["Shares","shares","number","100"],["Price","price","number","16.17"]].map(([l,k,t,ph])=>(
                <div key={k}>
                  <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>{l} *</div>
                  <input value={tradeForm[k]} onChange={e=>setTradeForm(f=>({...f,[k]:t==="text"?e.target.value.toUpperCase():e.target.value}))}
                    placeholder={ph} type={t} style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,fontFamily:D.mono,outline:"none"}}/>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Side</div>
                <select value={tradeForm.act} onChange={e=>setTradeForm(f=>({...f,act:e.target.value}))}
                  style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none",background:D.panel}}>
                  <option>BUY</option><option>SELL</option>
                </select>
              </div>
              <div>
                <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Account</div>
                <select value={tradeForm.acct} onChange={e=>setTradeForm(f=>({...f,acct:e.target.value}))}
                  style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none",background:D.panel}}>
                  {ACCOUNT_TYPES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Date</div>
                <input value={tradeForm.date} onChange={e=>setTradeForm(f=>({...f,date:e.target.value}))}
                  type="date" style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none"}}/>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:11,color:D.text3,marginBottom:5,fontWeight:500}}>Notes</div>
              <input value={tradeForm.notes} onChange={e=>setTradeForm(f=>({...f,notes:e.target.value}))}
                placeholder="Reason for trade..." style={{width:"100%",padding:"9px 12px",borderRadius:7,border:"1px solid "+D.border,fontSize:13,outline:"none"}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowTradeForm(false)} style={{flex:1,padding:"10px 0",borderRadius:8,border:"1px solid "+D.border,background:"transparent",color:D.text3,fontSize:13,fontWeight:500,cursor:"pointer"}}>Cancel</button>
              <button onClick={saveTrade} disabled={!tradeForm.ticker||!tradeForm.shares||!tradeForm.price}
                style={{flex:2,padding:"10px 0",borderRadius:8,border:"none",background:tradeForm.act==="BUY"?D.teal:D.red,color:"white",fontSize:13,fontWeight:600,cursor:"pointer",opacity:tradeForm.ticker&&tradeForm.shares&&tradeForm.price?1:0.5}}>
                Log {tradeForm.act}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
