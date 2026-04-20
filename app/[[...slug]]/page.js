"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, ArrowRight, HeartPulse, CheckCircle2, AlertCircle, LayoutDashboard, Database, ArrowUpRight, User } from 'lucide-react';

// ─── NAVBAR ───
function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  useEffect(() => { setUsername(localStorage.getItem("username")); }, []);
  const logout = () => { localStorage.removeItem("username"); localStorage.removeItem("name"); setUsername(null); router.push('/'); };

  return (
    <motion.nav initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className="nav glass">
      <Link href="/" style={{display:'flex',alignItems:'center',gap:8,color:'#fff',fontWeight:700,fontSize:'1.25rem'}}>
        <HeartPulse color="#06B6D4"/> Dia<span className="grad">Sense</span>
      </Link>
      <div style={{display:'flex',gap:24,alignItems:'center'}}>
        <Link href="/">Features</Link>
        <Link href="/predict">Predict</Link>
        {username ? (<>
          <Link href="/dashboard" className="btn-p" style={{padding:'8px 20px'}}>Dashboard <ArrowRight size={16}/></Link>
          <button onClick={logout} className="btn-s" style={{padding:'8px 20px'}}>Logout</button>
        </>) : (
          <Link href="/login" className="btn-p" style={{padding:'8px 20px'}}>Login</Link>
        )}
      </div>
    </motion.nav>
  );
}

// ─── LANDING ───
function Landing() {
  return (
    <div style={{paddingTop:120}}>
      <section style={{minHeight:'80vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center',padding:'0 20px'}}>
        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.8}} style={{maxWidth:800}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:999,background:'rgba(6,182,212,0.1)',color:'#06B6D4',fontWeight:600,marginBottom:24}}>
            <Activity size={16}/> Advanced ML Diagnostics
          </div>
          <h1 style={{fontSize:'4rem',fontWeight:800,lineHeight:1.1,marginBottom:24}}>
            Predict Diabetes Risk <br/><span className="grad">Before It Becomes Dangerous</span>
          </h1>
          <p style={{fontSize:'1.25rem',color:'var(--muted)',marginBottom:40,maxWidth:600,marginInline:'auto'}}>
            Transforming preventive healthcare through precision AI models, enabling early intervention with 98% prediction confidence.
          </p>
          <div style={{display:'flex',gap:20,justifyContent:'center'}}>
            <Link href="/predict" className="btn-p" style={{fontSize:'1.1rem'}}>Run Prediction <ArrowRight size={20}/></Link>
            <Link href="/register" className="btn-s" style={{fontSize:'1.1rem'}}>Create Account</Link>
          </div>
        </motion.div>
      </section>
      <section style={{padding:'100px 5%'}}>
        <h2 style={{textAlign:'center',fontSize:'2.5rem',marginBottom:60}}>Platform Capabilities</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:32}}>
          {[
            {title:"AI Powered Prediction",desc:"Deep learning models analyze 8 key metabolic indicators.",icon:<Database color="#06B6D4" size={32}/>},
            {title:"Medical Indicator Analysis",desc:"Real-time parsing of glucose, insulin, and BMI factors.",icon:<Activity color="#06B6D4" size={32}/>},
            {title:"Personalized Insights",desc:"Actionable health suggestions tailored to your risk profile.",icon:<ShieldCheck color="#06B6D4" size={32}/>}
          ].map((f,i)=>(
            <motion.div key={i} className="glass" style={{padding:40}} whileHover={{y:-10,boxShadow:'0 20px 40px rgba(6,182,212,0.1)'}} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
              <div style={{marginBottom:20}}>{f.icon}</div>
              <h3 style={{fontSize:'1.5rem',marginBottom:12}}>{f.title}</h3>
              <p style={{color:'var(--muted)',lineHeight:1.6}}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── PREDICT ───
function Predict() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ pregnancies:0,glucose:120,blood_pressure:80,skin_thickness:20,insulin:80,bmi:25,dpf:0.5,age:30 });
  const handle = e => setForm({...form,[e.target.id]:e.target.value});

  const submit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      const r = await fetch('/api/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d = await r.json();
      router.push(`/result?risk=${d.risk_level}`);
    } catch { router.push('/result?risk=Error'); }
    setLoading(false);
  };

  const fields = [
    {id:'pregnancies',label:'Pregnancies (Count)'},{id:'glucose',label:'Glucose (mg/dL)'},
    {id:'blood_pressure',label:'Blood Pressure (mmHg)'},{id:'skin_thickness',label:'Skin Thickness (mm)'},
    {id:'insulin',label:'Insulin (IU/mL)'},{id:'bmi',label:'BMI'},
    {id:'dpf',label:'Diabetes Pedigree Function'},{id:'age',label:'Age (Years)'}
  ];

  return (
    <div style={{paddingTop:120,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <motion.div className="glass" style={{width:'100%',maxWidth:800,padding:48}} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}>
        <div style={{textAlign:'center',marginBottom:40}}>
          <h2 style={{fontSize:'2.5rem',marginBottom:8}}>Patient Data Entry</h2>
          <p style={{color:'var(--muted)'}}>Input clinical metrics for real-time risk evaluation</p>
        </div>
        <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 24px'}}>
          {fields.map(f=>(
            <div key={f.id} style={{marginBottom:16}}>
              <label style={{display:'block',color:'var(--muted)',fontSize:'0.85rem',marginBottom:6}}>{f.label}</label>
              <input type="number" id={f.id} value={form[f.id]} onChange={handle} className="inp" style={{marginBottom:0}} required step="any"/>
            </div>
          ))}
          <div style={{gridColumn:'1/-1',marginTop:24}}>
            <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16}} disabled={loading}>
              {loading ? <motion.div animate={{rotate:360}} transition={{repeat:Infinity,ease:'linear',duration:1}}><Activity size={24}/></motion.div> : "Analyze Health Metrics"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── RESULT ───
function Result() {
  const params = useSearchParams();
  const risk = params.get('risk') || 'High';
  const isHigh = risk === 'High';

  return (
    <div style={{paddingTop:120,minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <motion.div className="glass" style={{width:'100%',maxWidth:600,padding:48,textAlign:'center'}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,damping:15}}
          style={{width:120,height:120,borderRadius:'50%',background:isHigh?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 32px'}}>
          {isHigh ? <AlertCircle color="#EF4444" size={64}/> : <CheckCircle2 color="#10B981" size={64}/>}
        </motion.div>
        <h2 style={{fontSize:'2rem',marginBottom:16}}>Risk Assessment Complete</h2>
        <div style={{fontSize:'4rem',fontWeight:800,color:isHigh?'#EF4444':'#10B981',marginBottom:24}}>{risk} Risk</div>
        <p style={{color:'var(--muted)',fontSize:'1.1rem',marginBottom:40,lineHeight:1.6}}>
          {isHigh ? "Your metrics indicate a high probability of developing diabetes. We recommend consulting an endocrinologist." : "Your metrics are within normal ranges. Maintain a balanced diet and exercise."}
        </p>
        <div style={{display:'flex',gap:20,justifyContent:'center'}}>
          <Link href="/predict" className="btn-s">Recalculate</Link>
          <Link href="/dashboard" className="btn-p">Go to Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── LOGIN ───
function Login() {
  const router = useRouter();
  const [loginId,setLoginId] = useState(""); const [password,setPassword] = useState(""); const [error,setError] = useState("");
  const submit = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login_id:loginId,password})});
      const d = await r.json();
      if(r.ok){ localStorage.setItem("username",d.username); localStorage.setItem("name",d.name); router.push("/dashboard"); }
      else setError(d.detail);
    } catch { setError("Network error"); }
  };
  return (
    <div style={{display:'flex',minHeight:'100vh',paddingTop:80}}>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} style={{maxWidth:500}}>
          <h1 style={{fontSize:'3rem',fontWeight:800,marginBottom:24}}><span className="grad">Welcome back</span> to DiaSense.</h1>
          <p style={{fontSize:'1.1rem',color:'var(--muted)'}}>Securely access your personalized health intelligence portal.</p>
        </motion.div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
        <motion.form onSubmit={submit} className="glass" style={{width:'100%',maxWidth:450,padding:48}} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}>
          <h2 style={{fontSize:'2rem',marginBottom:32}}>Sign In</h2>
          {error && <p style={{color:'var(--danger)',marginBottom:16}}>{error}</p>}
          <input className="inp" placeholder="Username or Email" value={loginId} onChange={e=>setLoginId(e.target.value)} required/>
          <input className="inp" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16}}>Authenticate</button>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:24}}>
            <Link href="/forgot-password" style={{color:'var(--accent)'}}>Forgot password?</Link>
            <Link href="/register" style={{color:'var(--accent)'}}>Register</Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

// ─── REGISTER ───
function Register() {
  const router = useRouter();
  const [form,setForm] = useState({name:'',father_name:'',mobile:'',email:'',dob:'',username:'',password:'',confirm_password:''});
  const [error,setError] = useState("");
  const handle = e => setForm({...form,[e.target.id]:e.target.value});
  const submit = async e => {
    e.preventDefault();
    if(form.password !== form.confirm_password){ setError("Passwords do not match"); return; }
    try {
      const r = await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d = await r.json();
      if(r.ok) router.push("/login"); else setError(d.detail);
    } catch { setError("Network error"); }
  };
  const fields = [
    {id:'name',label:'Full Name',type:'text'},{id:'father_name',label:"Father's Name",type:'text'},
    {id:'email',label:'Email ID',type:'email'},{id:'mobile',label:'Mobile Number',type:'tel'},
    {id:'dob',label:'Date of Birth',type:'date'},{id:'username',label:'Username',type:'text'},
    {id:'password',label:'Password',type:'password'},{id:'confirm_password',label:'Confirm Password',type:'password'}
  ];
  return (
    <div style={{minHeight:'100vh',paddingTop:120,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <motion.form onSubmit={submit} className="glass" style={{width:'100%',maxWidth:600,padding:48}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h2 style={{fontSize:'2rem',marginBottom:32}}>Register Patient</h2>
        {error && <p style={{color:'var(--danger)',marginBottom:16}}>{error}</p>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 16px'}}>
          {fields.map(f=><input key={f.id} id={f.id} type={f.type} placeholder={f.label} className="inp" value={form[f.id]} onChange={handle} required/>)}
        </div>
        <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16,marginTop:8}}>Complete Registration</button>
        <div style={{textAlign:'center',marginTop:24}}><Link href="/login" style={{color:'var(--accent)'}}>Already registered? Login</Link></div>
      </motion.form>
    </div>
  );
}

// ─── FORGOT PASSWORD ───
function ForgotPassword() {
  const router = useRouter();
  const [recoveryId,setRecoveryId] = useState(""); const [newPw,setNewPw] = useState(""); const [step,setStep] = useState(1);
  const [msg,setMsg] = useState(""); const [error,setError] = useState("");

  const verify = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recovery_id:recoveryId})});
      const d = await r.json();
      if(r.ok){ setMsg(d.message); setError(''); setStep(2); } else { setError(d.detail); setMsg(''); }
    } catch { setError("Network error"); }
  };
  const reset = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recovery_id:recoveryId,new_password:newPw})});
      if(r.ok) router.push('/login'); else { const d = await r.json(); setError(d.detail); }
    } catch { setError("Network error"); }
  };

  return (
    <div style={{minHeight:'100vh',paddingTop:120,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <motion.div className="glass" style={{width:'100%',maxWidth:450,padding:48}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h2 style={{fontSize:'2rem',marginBottom:32}}>Password Recovery</h2>
        {error && <p style={{color:'var(--danger)',marginBottom:16}}>{error}</p>}
        {msg && <p style={{color:'var(--success)',marginBottom:16}}>{msg}</p>}
        {step===1 ? (
          <form onSubmit={verify}>
            <input className="inp" placeholder="Registered Email or Mobile" value={recoveryId} onChange={e=>setRecoveryId(e.target.value)} required/>
            <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16}}>Verify Account</button>
          </form>
        ) : (
          <form onSubmit={reset}>
            <input className="inp" type="password" placeholder="New Password" value={newPw} onChange={e=>setNewPw(e.target.value)} required/>
            <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16}}>Reset Password</button>
          </form>
        )}
        <div style={{textAlign:'center',marginTop:24}}><Link href="/login" style={{color:'var(--accent)'}}>Return to Login</Link></div>
      </motion.div>
    </div>
  );
}

// ─── DASHBOARD ───
function Dashboard() {
  const router = useRouter();
  const [username,setUsername] = useState("Guest");
  useEffect(() => {
    const u = localStorage.getItem("username");
    if(!u) router.push("/login"); else setUsername(u);
  },[]);

  return (
    <div style={{display:'flex',minHeight:'100vh',paddingTop:80}}>
      <div className="glass" style={{width:260,padding:32,borderRadius:0,borderRight:'1px solid var(--border)'}}>
        <h2 style={{marginBottom:40,display:'flex',alignItems:'center',gap:12}}><User size={24}/> {username}</h2>
        <nav style={{display:'flex',flexDirection:'column',gap:16}}>
          <a href="#" style={{color:'var(--accent)',display:'flex',alignItems:'center',gap:12,padding:12,background:'rgba(6,182,212,0.1)',borderRadius:12,textDecoration:'none'}}><LayoutDashboard size={20}/> Overview</a>
          <a href="#" style={{color:'var(--muted)',display:'flex',alignItems:'center',gap:12,padding:12,textDecoration:'none'}}><Activity size={20}/> Reports</a>
          <a href="#" style={{color:'var(--muted)',display:'flex',alignItems:'center',gap:12,padding:12,textDecoration:'none'}}><Database size={20}/> Patient Data</a>
        </nav>
      </div>
      <div style={{flex:1,padding:48}}>
        <h1 style={{fontSize:'2.5rem',marginBottom:40}}>Dashboard Intelligence</h1>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24,marginBottom:40}}>
          {[{title:"Total Predictions",val:"1,248"},{title:"High Risk Detected",val:"342",color:'#EF4444'},{title:"Avg Confidence",val:"97.4%",color:'#10B981'}].map((s,i)=>(
            <motion.div key={i} className="glass" style={{padding:24}} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <p style={{color:'var(--muted)',marginBottom:8}}>{s.title}</p>
              <h3 style={{fontSize:'2.5rem',color:s.color||'white'}}>{s.val}</h3>
            </motion.div>
          ))}
        </div>
        <motion.div className="glass" style={{padding:32}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
          <h3 style={{fontSize:'1.25rem',marginBottom:24}}>Recent Screenings</h3>
          <table style={{width:'100%',textAlign:'left',borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              <th style={{padding:16,color:'var(--muted)'}}>Patient ID</th><th style={{padding:16,color:'var(--muted)'}}>Date</th>
              <th style={{padding:16,color:'var(--muted)'}}>Risk Level</th><th style={{padding:16,color:'var(--muted)'}}>Action</th>
            </tr></thead>
            <tbody>
              {['PT-001','PT-042','PT-105'].map((id,i)=>(
                <tr key={i} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding:16}}>{id}</td>
                  <td style={{padding:16,color:'var(--muted)'}}>Today, 10:24 AM</td>
                  <td style={{padding:16}}><span style={{padding:'4px 12px',borderRadius:999,background:i%2===0?'rgba(239,68,68,0.1)':'rgba(16,185,129,0.1)',color:i%2===0?'#EF4444':'#10B981',fontSize:'0.85rem'}}>{i%2===0?'High':'Low'}</span></td>
                  <td style={{padding:16}}><button className="btn-s" style={{padding:'6px 16px',fontSize:'0.85rem'}}>Review <ArrowUpRight size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}

// ─── ROUTER ───
const pages = {
  '/': Landing, '/predict': Predict, '/result': Result, '/login': Login,
  '/register': Register, '/forgot-password': ForgotPassword, '/dashboard': Dashboard,
};

export default function Page() {
  const pathname = usePathname();
  const Comp = pages[pathname] || Landing;
  return (
    <>
      <div className="bg-mesh"/>
      <Navbar/>
      <AnimatePresence mode="wait"><Comp key={pathname}/></AnimatePresence>
    </>
  );
}
