import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, ArrowRight, User, HeartPulse, LogIn, CheckCircle2, AlertCircle, LayoutDashboard, Database, ArrowUpRight } from 'lucide-react';

const CursorGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const updateCursor = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <motion.div 
      className="cursor-glow"
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
    />
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate('/');
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel" 
      style={{ position: 'fixed', top: 20, left: '5%', right: '5%', zIndex: 100, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: '1.25rem' }}>
        <HeartPulse color="#06B6D4" /> Dia<span className="text-gradient">Sense</span>
      </Link>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
        <Link to="/predict" style={{ color: '#94A3B8', textDecoration: 'none', fontWeight: 500 }}>Predict</Link>
        {username ? (
            <>
                <Link to="/dashboard" className="btn-primary" style={{ padding: '8px 20px' }}>Dashboard <ArrowRight size={16}/></Link>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 20px' }}>Logout</button>
            </>
        ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 20px' }}>Login</Link>
        )}
      </div>
    </motion.nav>
  );
};

// --- Pages ---

const LandingPage = () => {
  return (
    <div style={{ paddingTop: '120px' }}>
      <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: 800 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4', fontWeight: 600, marginBottom: 24 }}>
            <Activity size={16} /> Advanced ML Diagnostics
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Predict Diabetes Risk <br/> <span className="text-gradient">Before It Becomes Dangerous</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94A3B8', marginBottom: 40, maxWidth: 600, marginInline: 'auto' }}>
            Transforming preventive healthcare through precision top-tier AI models, enabling early intervention with 98% prediction confidence.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <Link to="/predict" className="btn-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              Run Prediction <ArrowRight size={20}/>
            </Link>
            <Link to="/register" className="btn-secondary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features ... */}
      <section style={{ padding: '100px 5%' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 60 }}>Platform Capabilities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { title: "AI Powered Prediction", desc: "Our deep learning models analyze 8 key metabolic indicators.", icon: <Database color="#06B6D4" size={32}/> },
              { title: "Medical Indicator Analysis", desc: "Real-time parsing of glucose, insulin, and BMI factors.", icon: <Activity color="#06B6D4" size={32}/> },
              { title: "Personalized Insights", desc: "Actionable health suggestions tailored to your risk profile.", icon: <ShieldCheck color="#06B6D4" size={32}/> }
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                className="glass-panel" 
                style={{ padding: 40 }}
                whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ marginBottom: 20 }}>{feat.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 12 }}>{feat.title}</h3>
                <p style={{ color: '#94A3B8', lineHeight: 1.6 }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
    </div>
  );
};

const PredictPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      pregnancies: 0, glucose: 120, blood_pressure: 80, skin_thickness: 20, insulin: 80, bmi: 25.0, dpf: 0.5, age: 30
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        navigate('/result', { state: { risk: data.risk_level } });
    } catch(err) {
        console.error(err);
        navigate('/result', { state: { risk: "Error" } });
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: 800, padding: 48 }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 8 }}>Patient Data Entry</h2>
          <p style={{ color: '#94A3B8' }}>Input clinical metrics for real-time risk evaluation</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          {[
            { id: 'pregnancies', label: 'Pregnancies (Count)' },
            { id: 'glucose', label: 'Glucose (mg/dL)' },
            { id: 'blood_pressure', label: 'Blood Pressure (mmHg)' },
            { id: 'skin_thickness', label: 'Skin Thickness (mm)' },
            { id: 'insulin', label: 'Insulin (IU/mL)' },
            { id: 'bmi', label: 'BMI' },
            { id: 'dpf', label: 'Diabetes Pedigree Function' },
            { id: 'age', label: 'Age (Years)' },
          ].map(field => (
            <div className="input-group" key={field.id}>
              <input type="number" id={field.id} value={formData[field.id]} onChange={handleChange} className="input-field" placeholder=" " required step="any" />
              <label htmlFor={field.id} className="input-label">{field.label}</label>
            </div>
          ))}
          
          <div style={{ gridColumn: '1 / -1', marginTop: 24 }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} disabled={loading}>
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                  <Activity size={24}/>
                </motion.div>
              ) : "Analyze Health Metrics"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ResultPage = () => {
  const location = useLocation();
  const risk = location.state?.risk || 'High';
  const isHigh = risk === 'High';

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: 600, padding: 48, textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{ width: 120, height: 120, borderRadius: '50%', background: isHigh ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}
        >
          {isHigh ? <AlertCircle color="#EF4444" size={64}/> : <CheckCircle2 color="#10B981" size={64} />}
        </motion.div>

        <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>Risk Assessment Complete</h2>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: isHigh ? '#EF4444' : '#10B981', marginBottom: 24 }}>
          {risk} Risk
        </div>

        <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: 40, lineHeight: 1.6 }}>
          {isHigh 
            ? "Your clinical metrics indicate a high probability of developing diabetes. We recommend scheduling a consultation with an endocrinologist."
            : "Your metrics are currently within normal ranges. Maintain a balanced diet and regular exercise routine to stay healthy."}
        </p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <Link to="/predict" className="btn-secondary">Recalculate</Link>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
};

// --- AUTHENTICATION ---
const LoginPage = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
      e.preventDefault();
      try {
          const res = await fetch("http://localhost:8000/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ login_id: loginId, password })
          });
          const data = await res.json();
          if(res.ok) {
              localStorage.setItem("username", data.username);
              localStorage.setItem("name", data.name);
              navigate("/dashboard");
          } else {
              setError(data.detail);
          }
      } catch(e) {
          setError("Network error");
      }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ maxWidth: 500 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 24 }}><span className="text-gradient">Welcome back</span> to DiaSense.</h1>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8' }}>Securely access your personalized health intelligence portal.</p>
        </motion.div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <motion.form onSubmit={handleLogin} className="glass-panel" style={{ width: '100%', maxWidth: 450, padding: 48 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 32 }}>Sign In</h2>
          {error && <p style={{ color: '#EF4444', marginBottom: 16 }}>{error}</p>}
          
          <div className="input-group">
            <input type="text" id="email" className="input-field" placeholder=" " value={loginId} onChange={e=>setLoginId(e.target.value)} required />
            <label htmlFor="email" className="input-label">Username or Email</label>
          </div>
          
          <div className="input-group" style={{ marginBottom: 32 }}>
            <input type="password" id="pass" className="input-field" placeholder=" " value={password} onChange={e=>setPassword(e.target.value)} required />
            <label htmlFor="pass" className="input-label">Password</label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>Authenticate</button>
          
          <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/forgot-password" style={{ color: '#06B6D4', textDecoration: 'none' }}>Forgot password?</Link>
            <Link to="/register" style={{ color: '#06B6D4', textDecoration: 'none' }}>Register New User</Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      name: "", father_name: "", mobile: "", email: "", dob: "", username: "", password: "", confirm_password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRegister = async (e) => {
      e.preventDefault();
      if(formData.password !== formData.confirm_password) {
          setError("Passwords do not match"); return;
      }
      try {
          const res = await fetch("http://localhost:8000/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
          });
          const data = await res.json();
          if(res.ok) {
              navigate("/login");
          } else {
              setError(data.detail);
          }
      } catch(e) {
          setError("Network error");
      }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 80, justifyContent: 'center', alignItems: 'center' }}>
        <motion.form onSubmit={handleRegister} className="glass-panel" style={{ width: '100%', maxWidth: 600, padding: 48 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 32 }}>Register Patient</h2>
          {error && <p style={{ color: '#EF4444', marginBottom: 16 }}>{error}</p>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div className="input-group">
                <input type="text" id="name" className="input-field" placeholder=" " value={formData.name} onChange={handleChange} required />
                <label htmlFor="name" className="input-label">Full Name</label>
              </div>
              <div className="input-group">
                <input type="text" id="father_name" className="input-field" placeholder=" " value={formData.father_name} onChange={handleChange} required />
                <label htmlFor="father_name" className="input-label">Father's Name</label>
              </div>
              <div className="input-group">
                <input type="email" id="email" className="input-field" placeholder=" " value={formData.email} onChange={handleChange} required />
                <label htmlFor="email" className="input-label">Email ID</label>
              </div>
              <div className="input-group">
                <input type="tel" id="mobile" className="input-field" placeholder=" " value={formData.mobile} onChange={handleChange} required />
                <label htmlFor="mobile" className="input-label">Mobile Number</label>
              </div>
              <div className="input-group">
                <input type="date" id="dob" className="input-field" placeholder=" " value={formData.dob} onChange={handleChange} required />
                <label htmlFor="dob" className="input-label" style={{ top: -12, left: 12, fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '0 4px', color: 'var(--accent)' }}>Date of Birth</label>
              </div>
              <div className="input-group">
                <input type="text" id="username" className="input-field" placeholder=" " value={formData.username} onChange={handleChange} required />
                <label htmlFor="username" className="input-label">Username</label>
              </div>
              <div className="input-group">
                <input type="password" id="password" className="input-field" placeholder=" " value={formData.password} onChange={handleChange} required />
                <label htmlFor="password" className="input-label">Password</label>
              </div>
              <div className="input-group">
                <input type="password" id="confirm_password" className="input-field" placeholder=" " value={formData.confirm_password} onChange={handleChange} required />
                <label htmlFor="confirm_password" className="input-label">Confirm Password</label>
              </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 16 }}>Complete Registration</button>
          
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/login" style={{ color: '#06B6D4', textDecoration: 'none' }}>Already registered? Login</Link>
          </div>
        </motion.form>
    </div>
  );
};

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [recoveryId, setRecoveryId] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
  
    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/forgot-password", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recovery_id: recoveryId })
            });
            const data = await res.json();
            if(res.ok) {
                setMsg(data.message); setError(""); setStep(2);
            } else { setError(data.detail); setMsg(""); }
        } catch(e) { setError("Network error"); }
    };
  
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/reset-password", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recovery_id: recoveryId, new_password: newPassword })
            });
            const data = await res.json();
            if(res.ok) { navigate('/login'); } 
            else { setError(data.detail); }
        } catch(e) { setError("Network error"); }
    };
  
    return (
      <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 80, justifyContent: 'center', alignItems: 'center' }}>
          <motion.div className="glass-panel" style={{ width: '100%', maxWidth: 450, padding: 48 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: 32 }}>Password Recovery</h2>
            {error && <p style={{ color: '#EF4444', marginBottom: 16 }}>{error}</p>}
            {msg && <p style={{ color: '#10B981', marginBottom: 16 }}>{msg}</p>}
            
            {step === 1 ? (
                <form onSubmit={handleVerify}>
                    <div className="input-group" style={{ marginBottom: 32 }}>
                        <input type="text" id="rec" className="input-field" placeholder=" " value={recoveryId} onChange={e=>setRecoveryId(e.target.value)} required />
                        <label htmlFor="rec" className="input-label">Registered Email / Mobile</label>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>Verify Account</button>
                </form>
            ) : (
                <form onSubmit={handleReset}>
                     <div className="input-group" style={{ marginBottom: 32 }}>
                        <input type="password" id="newp" className="input-field" placeholder=" " value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
                        <label htmlFor="newp" className="input-label">New Password</label>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>Reset Password</button>
                </form>
            )}
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login" style={{ color: '#06B6D4', textDecoration: 'none' }}>Return to Login</Link>
            </div>
          </motion.div>
      </div>
    );
};
// -------------------------------------

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "Guest";
  const navigate = useNavigate();

  React.useEffect(() => {
     if(!localStorage.getItem("username")) { navigate("/login"); }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 80 }}>
      {/* ... [Sidebar content unchanged] */}
      <div className="sidebar">
        <h2 style={{ marginBottom: 40, color: 'white', display: 'flex', alignItems: 'center', gap: 12 }}>
          <User size={24}/> {username}
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="#" style={{ color: '#06B6D4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(6, 182, 212, 0.1)', borderRadius: 12 }}><LayoutDashboard size={20}/> Overview</a>
          <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}><Activity size={20}/> Reports</a>
          <a href="#" style={{ color: '#94A3B8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}><Database size={20}/> Patient Data</a>
        </nav>
      </div>

      <div className="dashboard-content" style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 40 }}>Dashboard Intelligence</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
          {[
            { title: "Total Predictions", val: "1,248" },
            { title: "High Risk Detected", val: "342", color: '#EF4444' },
            { title: "Avg Confidence", val: "97.4%", color: '#10B981' }
          ].map((stat, i) => (
            <motion.div key={i} className="glass-panel" style={{ padding: 24 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }}>
              <p style={{ color: '#94A3B8', marginBottom: 8 }}>{stat.title}</p>
              <h3 style={{ fontSize: '2.5rem', color: stat.color || 'white' }}>{stat.val}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div className="glass-panel" style={{ padding: 32 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: 24 }}>Recent Screenings</h3>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: 16, color: '#94A3B8' }}>Patient ID</th>
                <th style={{ padding: 16, color: '#94A3B8' }}>Date</th>
                <th style={{ padding: 16, color: '#94A3B8' }}>Risk Level</th>
                <th style={{ padding: 16, color: '#94A3B8' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {['PT-001', 'PT-042', 'PT-105'].map((id, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>{id}</td>
                  <td style={{ padding: 16, color: '#94A3B8' }}>Today, 10:24 AM</td>
                  <td style={{ padding: 16 }}><span style={{ padding: '4px 12px', borderRadius: 999, background: i%2===0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: i%2===0 ? '#EF4444' : '#10B981', fontSize: '0.85rem' }}>{i%2===0 ? 'High' : 'Low'}</span></td>
                  <td style={{ padding: 16 }}><button className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>Review <ArrowUpRight size={14}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="bg-mesh" />
      <CursorGlow />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
