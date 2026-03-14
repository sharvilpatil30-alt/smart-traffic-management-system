import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   THEME & CONSTANTS
══════════════════════════════════════════════════════════════ */
const C = {
    bg: "#f0ede6", card: "#1c1c1e", cardBord: "rgba(255,255,255,0.07)",
    accent1: "#c8f03a", accent2: "#f5d800", accent3: "#4ade80",
    mint: "#b2f2d6", blush: "#f7c8e0", lemon: "#f5f0a0", sky: "#c0e8f8",
    text: "#111111", mutedCard: "rgba(255,255,255,0.52)", muted: "#888880",
    red: "#ff4444", orange: "#ff8c42", blue: "#60a5fa", purple: "#c084fc",
};

const ZONES = [
    { id: "A", label: "Zone A — Central", value: 38, color: "#d0c8bc", vehicles: 5210, incidents: 3, speed: 34, status: "Moderate", roads: ["FC Road", "JM Road"], desc: "Highest traffic density." },
    { id: "B", label: "Zone B — West", value: 22, color: C.accent1, vehicles: 2980, incidents: 1, speed: 42, status: "Normal", roads: ["Baner Road", "Aundh Road"], desc: "Steady flow." },
];

const WEATHER_ZONES = [
    { city: "PUNE CENTRAL", temp: 38, cond: "Clear & Hot", icon: "☀️", risk: 20, rain: false, humidity: 42, heatIdx: 44 },
    { city: "BANER", temp: 29, cond: "Thunderstorm", icon: "⛈", risk: 78, rain: true, humidity: 88, heatIdx: 33 },
];

const EMERGENCY_UNITS = [
    { id: "AMB-MH-01", type: "ambulance", location: "Near Ruby Hall Clinic", eta: 4, status: "ACTIVE", phone: "9800001111" },
    { id: "POL-PCB-05", type: "police", location: "Shivajinagar Circle", eta: 3, status: "ACTIVE", phone: "9800005555" },
];

/* ══════════════════════════════════════════════════════════════
   REUSABLE UI COMPONENTS
══════════════════════════════════════════════════════════════ */

function Modal({ title, onClose, children }) {
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
            <div style={{ position: "relative", background: C.card, width: "100%", maxWidth: 500, borderRadius: 24, padding: 24, border: `1px solid ${C.cardBord}`, animation: "pageIn .3s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                    <h3 style={{ color: "white", fontFamily: "'DM Serif Display', serif", fontSize: 24 }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function DarkCard({ children, style = {}, onClick }) {
    return <div onClick={onClick} style={{ background: C.card, borderRadius: 22, padding: 22, border: `1px solid ${C.cardBord}`, cursor: onClick ? "pointer" : "default", position: "relative", ...style }}>{children}</div>;
}

function SL({ children, c }) {
    return <div style={{ color: c || "white", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>;
}

function Toggle({ on, onChange, color = C.accent1 }) {
    return (
        <button onClick={() => onChange(!on)} style={{ width: 40, height: 20, borderRadius: 20, background: on ? color : "#444", border: "none", cursor: "pointer", position: "relative" }}>
            <div style={{ position: "absolute", top: 2, left: on ? 22 : 2, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left .2s" }} />
        </button>
    );
}

/* ══════════════════════════════════════════════════════════════
   MAIN APPLICATION
══════════════════════════════════════════════════════════════ */

export default function App() {
    const [auth, setAuth] = useState(null); // { role, userName }
    const [view, setView] = useState("overview"); // overview, weather, emergency, parking, reports, analytics, profile
    const [isMobile, setIsMobile] = useState(false);
    const [sideOpen, setSideOpen] = useState(true);
    const [modal, setModal] = useState(null); // 'time' or null

    // Responsiveness Check
    useEffect(() => {
        const checkSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 1024) setSideOpen(false);
            else setSideOpen(true);
        };
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    if (!auth) return <LoginPage onLogin={(role, userName) => setAuth({ role, userName })} />;

    const isAdmin = auth.role === "admin";

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        @keyframes pageIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (max-width: 768px) { .grid-resp { grid-template-columns: 1fr !important; } }
      `}</style>

            {/* SIDEBAR */}
            <aside style={{
                width: sideOpen ? 240 : (isMobile ? 0 : 70),
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(0,0,0,0.05)",
                transition: "width .3s ease",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                zIndex: 100,
                position: isMobile ? "fixed" : "sticky",
                top: 0, height: "100vh"
            }}>
                <div style={{ padding: 20, fontWeight: 700, fontSize: 18, color: C.text }}>⬡ Urban HQ</div>
                <nav style={{ flex: 1, padding: 10 }}>
                    {[
                        { id: "overview", label: "Overview", icon: "◉" },
                        { id: "weather", label: "Weather", icon: "◈" },
                        { id: "emergency", label: "Emergency", icon: "✦" },
                        { id: "parking", label: "Parking", icon: "⬡" },
                        { id: "reports", label: "Reports", icon: "◇" },
                        ...(isAdmin ? [{ id: "analytics", label: "Analytics", icon: "▣" }] : []),
                    ].map(item => (
                        <div key={item.id} onClick={() => { setView(item.id); if (isMobile) setSideOpen(false); }}
                            style={{
                                padding: "12px 15px", borderRadius: 12, cursor: "pointer", marginBottom: 5,
                                background: view === item.id ? C.card : "transparent",
                                color: view === item.id ? "white" : C.muted,
                                display: "flex", alignItems: "center", gap: 12, transition: ".2s"
                            }}>
                            <span>{item.icon}</span>
                            {sideOpen && <span>{item.label}</span>}
                        </div>
                    ))}
                </nav>
                <button onClick={() => setAuth(null)} style={{ margin: 10, padding: 10, borderRadius: 10, border: "none", background: "#fee", color: C.red, cursor: "pointer" }}>
                    {sideOpen ? "Sign Out" : "⏻"}
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {/* HEADER */}
                <header style={{ padding: "15px 25px", background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 90 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        {isMobile && <button onClick={() => setSideOpen(!sideOpen)} style={{ background: "none", border: "none", fontSize: 20 }}>☰</button>}
                        <h2 style={{ fontSize: 18, textTransform: "capitalize" }}>{view}</h2>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        {/* Clickable Time */}
                        <div onClick={() => setModal('time')} style={{ cursor: "pointer", background: C.card, color: C.accent1, padding: "6px 12px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {/* User Profile */}
                        <div onClick={() => setView("profile")} style={{ width: 35, height: 35, borderRadius: "50%", background: isAdmin ? C.orange : C.accent1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700, color: "white" }}>
                            {auth.userName[0]}
                        </div>
                    </div>
                </header>

                <section style={{ padding: 25, flex: 1, overflowY: "auto" }} className="hide-scroll">
                    {view === "overview" && <Overview isAdmin={isAdmin} />}
                    {view === "parking" && <ParkingPage isAdmin={isAdmin} />}
                    {view === "reports" && <ReportsPage isAdmin={isAdmin} user={auth} />}
                    {view === "analytics" && (isAdmin ? <AnalyticsDashboard /> : <AccessDenied />)}
                    {view === "profile" && <ProfilePage user={auth} onLogout={() => setAuth(null)} />}
                </section>
            </main>

            {/* MODALS */}
            {modal === 'time' && (
                <Modal title="System Time Details" onClose={() => setModal(null)}>
                    <div style={{ color: "white" }}>
                        <p style={{ marginBottom: 10 }}><strong>Current Time:</strong> {new Date().toLocaleString()}</p>
                        <p style={{ color: C.mutedCard, fontSize: 13 }}>All traffic logs and incident timestamps are synced with the Pune Metropolitan Authority NTP servers.</p>
                        <div style={{ marginTop: 20, padding: 15, background: "rgba(255,255,255,0.05)", borderRadius: 12 }}>
                            <SL>Recent Log</SL>
                            <div style={{ fontSize: 12 }}>12:44:02 - CCTV Feed #04 Signal Sync Active</div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   SUB-PAGES (ENHANCED)
══════════════════════════════════════════════════════════════ */

function Overview({ isAdmin }) {
    return (
        <div className="grid-resp" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            <DarkCard>
                <SL>Active Vehicles</SL>
                <h1 style={{ color: "white", fontSize: 32 }}>14,823</h1>
            </DarkCard>
            {/* Revenue hidden for non-admins */}
            {isAdmin && (
                <DarkCard style={{ borderColor: C.accent3 }}>
                    <SL c={C.accent3}>Total Revenue (Daily)</SL>
                    <h1 style={{ color: "white", fontSize: 32 }}>₹54,200</h1>
                </DarkCard>
            )}
        </div>
    );
}

function ParkingPage({ isAdmin }) {
    const [showIssued, setShowIssued] = useState(false);

    return (
        <div>
            <div className="grid-resp" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {isAdmin && (
                    <DarkCard>
                        <SL>Evidence Panel (Admin Only)</SL>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                            <div style={{ height: 80, background: "#333", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>[IMAGE 01: MH-12]</div>
                            <div style={{ height: 80, background: "#333", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>[IMAGE 02: MH-14]</div>
                        </div>
                        <p style={{ fontSize: 10, color: C.mutedCard, marginTop: 10 }}>* High-res images from AI-CCTV Nodes.</p>
                    </DarkCard>
                )}

                <DarkCard onClick={() => setShowIssued(!showIssued)}>
                    <SL>Recent Violations</SL>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "white", fontSize: 20 }}>{showIssued ? "▲ Hide List" : "▼ Show Issued Section"}</span>
                        <span style={{ color: C.red, fontWeight: 700 }}>24 Active</span>
                    </div>
                </DarkCard>
            </div>

            {showIssued && (
                <div style={{ animation: "pageIn .3s ease" }}>
                    <SL c={C.text}>Issued Violations List</SL>
                    {[1, 2, 3].map(i => (
                        <DarkCard key={i} style={{ marginBottom: 10, padding: 15 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "white" }}>
                                <span>MH-12-AX-00{i}</span>
                                <span style={{ color: C.orange }}>₹1,500 Fine</span>
                            </div>
                        </DarkCard>
                    ))}
                </div>
            )}
        </div>
    );
}

function ReportsPage({ isAdmin, user }) {
    const [submitted, setSubmitted] = useState(false);

    if (isAdmin) {
        return (
            <DarkCard>
                <SL>Manage Citizen Reports (Admin)</SL>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", color: "white", textAlign: "left", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ color: C.mutedCard, fontSize: 12 }}>
                                <th style={{ padding: 10 }}>ID</th>
                                <th style={{ padding: 10 }}>Reporter</th>
                                <th style={{ padding: 10 }}>Issue</th>
                                <th style={{ padding: 10 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: 10 }}>#R-882</td>
                                <td style={{ padding: 10 }}>Rahul S.</td>
                                <td style={{ padding: 10 }}>Pothole on FC Road</td>
                                <td style={{ padding: 10 }}><button style={{ color: C.accent1, background: "none", border: "none" }}>Resolve</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </DarkCard>
        );
    }

    return (
        <DarkCard style={{ maxWidth: 600, margin: "0 auto" }}>
            <SL>Submit New Report</SL>
            <p style={{ color: C.mutedCard, fontSize: 12, marginBottom: 20 }}>Logged in as: {user.userName}</p>
            <textarea placeholder="Describe the traffic issue..." style={{ width: "100%", height: 100, background: "rgba(255,255,255,0.05)", border: "1px solid #444", borderRadius: 12, padding: 15, color: "white", outline: "none" }} />
            <button onClick={() => setSubmitted(true)} style={{ width: "100%", marginTop: 15, padding: 12, borderRadius: 10, border: "none", background: C.accent1, fontWeight: 700, cursor: "pointer" }}>
                {submitted ? "Report Sent!" : "Submit Report"}
            </button>
        </DarkCard>
    );
}

function ProfilePage({ user, onLogout }) {
    return (
        <DarkCard style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.cardBord, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>👤</div>
            <h2 style={{ color: "white" }}>{user.userName}</h2>
            <p style={{ color: C.accent1, fontSize: 12, marginBottom: 20, textTransform: "uppercase" }}>{user.role} Access</p>
            <div style={{ textAlign: "left", color: "white", fontSize: 14, marginBottom: 30 }}>
                <div style={{ padding: "10px 0", borderBottom: "1px solid #333" }}>Email: {user.userName.toLowerCase()}@pune.gov.in</div>
                <div style={{ padding: "10px 0", borderBottom: "1px solid #333" }}>ID: UTMS-2026-X99</div>
            </div>
            <button onClick={onLogout} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1px solid ${C.red}`, background: "none", color: C.red, fontWeight: 700, cursor: "pointer" }}>Sign Out</button>
        </DarkCard>
    );
}

function AnalyticsDashboard() {
    return (
        <div style={{ animation: "pageIn .4s ease" }}>
            <SL c={C.text}>System Performance Analytics (Admin)</SL>
            <DarkCard style={{ marginBottom: 20 }}>
                <p style={{ color: "white" }}>System wide average response time: <strong>6.4 mins</strong></p>
                <div style={{ height: 4, background: "#444", marginTop: 10, borderRadius: 2 }}>
                    <div style={{ width: "85%", height: "100%", background: C.accent1, borderRadius: 2 }} />
                </div>
            </DarkCard>
            <div className="grid-resp" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <DarkCard><SL>Violation Trends</SL><div style={{ height: 100, display: "flex", alignItems: "flex-end", gap: 5 }}>{[40, 70, 45, 90, 65].map((h, i) => <div key={i} style={{ flex: 1, background: C.red, height: `${h}%`, borderRadius: "4px 4px 0 0" }} />)}</div></DarkCard>
                <DarkCard><SL>Traffic Inflow</SL><div style={{ height: 100, display: "flex", alignItems: "flex-end", gap: 5 }}>{[30, 50, 85, 60, 40].map((h, i) => <div key={i} style={{ flex: 1, background: C.blue, height: `${h}%`, borderRadius: "4px 4px 0 0" }} />)}</div></DarkCard>
            </div>
        </div>
    );
}

function AccessDenied() {
    return (
        <div style={{ textAlign: "center", padding: 50 }}>
            <div style={{ fontSize: 50 }}>🚫</div>
            <h2 style={{ marginTop: 20 }}>Access Denied</h2>
            <p style={{ color: C.muted }}>This section contains sensitive government analytics and is restricted to administrators only.</p>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   LOGIN PAGE (SIMULATED)
══════════════════════════════════════════════════════════════ */
function LoginPage({ onLogin }) {
    const [u, setU] = useState("");
    const [p, setP] = useState("");
    return (
        <div style={{ height: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <DarkCard style={{ width: "100%", maxWidth: 400, padding: 40 }}>
                <h1 style={{ color: "white", marginBottom: 10, fontFamily: "'DM Serif Display', serif" }}>Urban HQ</h1>
                <p style={{ color: C.mutedCard, fontSize: 12, marginBottom: 30 }}>SMART CITY MANAGEMENT SYSTEM</p>
                <input placeholder="Username" onChange={e => setU(e.target.value)} style={{ width: "100%", padding: 12, marginBottom: 10, borderRadius: 8, border: "1px solid #444", background: "none", color: "white" }} />
                <input type="password" placeholder="Password" onChange={e => setP(e.target.value)} style={{ width: "100%", padding: 12, marginBottom: 20, borderRadius: 8, border: "1px solid #444", background: "none", color: "white" }} />
                <button onClick={() => onLogin(u === "admin" ? "admin" : "user", u || "Guest")} style={{ width: "100%", padding: 12, background: C.accent1, border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Sign In</button>
                <p style={{ color: C.mutedCard, fontSize: 10, marginTop: 20, textAlign: "center" }}>Tip: use 'admin' for admin access</p>
            </DarkCard>
        </div>
    );
}