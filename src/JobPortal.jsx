import { useState, useEffect } from "react";

const ROLES     = ["Frontend Developer","Backend Engineer","UI/UX Designer","DevOps Engineer","Data Scientist","Product Manager","React Developer","Node.js Engineer","Python Developer","Cloud Architect","Mobile Developer","QA Engineer","Full Stack Developer","Machine Learning Engineer","Scrum Master","Business Analyst","Cybersecurity Analyst","Database Administrator","AI Engineer","Tech Lead"];
const COMPANIES = ["Google","Microsoft","Amazon","Meta","Apple","Netflix","Spotify","Airbnb","Uber","Twitter","Stripe","Notion","Figma","Atlassian","Salesforce","Adobe","Shopify","Slack","Zoom","LinkedIn"];
const LOCATIONS = ["San Francisco, CA","New York, NY","Austin, TX","Seattle, WA","Boston, MA","Chicago, IL","Los Angeles, CA","Denver, CO","Atlanta, GA","Remote"];
const TYPES     = ["Full-time","Part-time","Contract","Remote","Hybrid"];
const TAGS      = [["React","TypeScript","CSS"],["Node.js","Python","AWS"],["Figma","Prototyping","Research"],["Docker","Kubernetes","CI/CD"],["Python","TensorFlow","SQL"],["Agile","Roadmap","OKRs"],["React","Redux","GraphQL"],["Node.js","Express","MongoDB"],["Django","FastAPI","PostgreSQL"],["AWS","Azure","Terraform"]];
const SALARIES  = ["$80k–$100k","$100k–$130k","$120k–$150k","$90k–$120k","$130k–$160k","$110k–$140k","$95k–$125k","$140k–$180k","$85k–$115k","$150k–$200k"];
const ICONS     = ["💻","⚙️","🎨","🚀","📊","📋","⚛️","🟢","🐍","☁️","📱","🧪","🔥","🤖","🏃","📈","🔒","🗄️","✨","👑"];

// Map a JSONPlaceholder post → Job object
function mapToJob(post) {
  const i = (post.id - 1) % 10;
  return {
    id:          post.id,
    role:        ROLES[post.id - 1]     || ROLES[i],
    company:     COMPANIES[post.id - 1] || COMPANIES[i],
    location:    LOCATIONS[i],
    type:        TYPES[i % TYPES.length],
    salary:      SALARIES[i],
    tags:        TAGS[i],
    icon:        ICONS[post.id - 1]     || "💼",
    description: post.body.replace(/\n/g, " ").slice(0, 120) + "...",
    posted:      `${post.id} day${post.id === 1 ? "" : "s"} ago`,
  };
}

// ── Badge ────────────────────────────────────────────────────
function Badge({ text, color = "#4f8ef7" }) {
  return (
    <span style={{
      background: color + "18", color, border: `1px solid ${color}33`,
      borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700,
    }}>{text}</span>
  );
}

// ── Job Card ─────────────────────────────────────────────────
function JobCard({ job, saved, onSave, onRemove }) {
  return (
    <div
      style={{
        background: "#fff", border: "1px solid #eef0f4", borderRadius: 16,
        padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14,
        boxShadow: "0 2px 12px #0000000a", transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px #0000001a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px #0000000a"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top row */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: `hsl(${job.id * 37}, 70%, 94%)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>{job.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{job.role}</div>
          <div style={{ color: "#888", fontSize: 13 }}>{job.company} · {job.location}</div>
        </div>
        <button
          onClick={() => saved ? onRemove(job.id) : onSave(job)}
          style={{
            background: saved ? "#ff6b6b15" : "#f5f5f5",
            color: saved ? "#ff6b6b" : "#bbb",
            border: `1px solid ${saved ? "#ff6b6b33" : "#eee"}`,
            borderRadius: 10, padding: "7px 10px", cursor: "pointer",
            fontSize: 16, transition: "all 0.2s", flexShrink: 0,
          }}
        >{saved ? "❤️" : "🤍"}</button>
      </div>

      {/* Description */}
      <p style={{ margin: 0, color: "#666", fontSize: 13, lineHeight: 1.6 }}>{job.description}</p>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {job.tags.map(t => <Badge key={t} text={t} color="#4f8ef7" />)}
        <Badge text={job.type} color="#00c9a7" />
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
        <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 14 }}>{job.salary}</span>
        <span style={{ color: "#ccc", fontSize: 12 }}>🕐 {job.posted}</span>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const [jobs, setJobs]           = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode]   = useState("all"); // "all" | "saved"
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // ── Real API call using useEffect ──
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((posts) => {
        // Take first 20 posts and map them to job listings
        const mappedJobs = posts.slice(0, 20).map(mapToJob);
        setJobs(mappedJobs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty array = runs once on mount

  // ── Save / Remove handlers ──
  const handleSave   = (job) => setSavedJobs(prev => [...prev, job]);
  const handleRemove = (id)  => setSavedJobs(prev => prev.filter(j => j.id !== id));

  // ── Search + filter logic ──
  const sourceList = viewMode === "saved" ? savedJobs : jobs;
  const filtered   = sourceList.filter(job =>
    job.role.toLowerCase().includes(searchText.toLowerCase())     ||
    job.company.toLowerCase().includes(searchText.toLowerCase())  ||
    job.location.toLowerCase().includes(searchText.toLowerCase()) ||
    job.tags.some(t => t.toLowerCase().includes(searchText.toLowerCase()))
  );

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fc", fontFamily: "'Georgia', serif" }}>

      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        padding: "48px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "#ffffff08" }} />
        <div style={{ position: "absolute", bottom: -60, right: -20, width: 260, height: 260, borderRadius: "50%", background: "#ffffff05" }} />

        <p style={{ margin: "0 0 10px", color: "#a78bfa", fontSize: 12, letterSpacing: 4, textTransform: "uppercase" }}>
          💼 Live Jobs via JSONPlaceholder API
        </p>
        <h1 style={{ margin: "0 0 10px", fontSize: 38, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
          Find Your Dream Job
        </h1>
        <p style={{ margin: "0 0 32px", color: "#a0a0c0", fontSize: 15 }}>
          {loading ? "Fetching jobs..." : `${jobs.length} opportunities loaded from API`}
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by role, company, skill, location..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "16px 20px 16px 50px",
              borderRadius: 14, border: "none", fontSize: 15,
              outline: "none", background: "#fff",
              boxShadow: "0 8px 32px #0000003a",
              fontFamily: "inherit", color: "#111",
            }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* Stats + View Toggle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[["Total Jobs", jobs.length, "#302b63"], ["❤️ Saved", savedJobs.length, "#ff6b6b"], ["Showing", filtered.length, "#4f8ef7"]].map(([label, val, color]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color }}>{val}</div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* All / Saved Toggle */}
          <div style={{ display: "flex", gap: 6, background: "#fff", padding: 4, borderRadius: 12, border: "1px solid #eee", boxShadow: "0 2px 8px #0000000a" }}>
            {[["all", "🌐 All Jobs"], ["saved", `❤️ Saved (${savedJobs.length})`]].map(([mode, label]) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                background: viewMode === mode ? "#302b63" : "transparent",
                color: viewMode === mode ? "#fff" : "#aaa",
                border: "none", borderRadius: 9, padding: "8px 18px",
                cursor: "pointer", fontWeight: 700, fontSize: 13,
                transition: "all 0.2s", fontFamily: "inherit",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 48, display: "inline-block", animation: "bounce 0.8s ease infinite" }}>💼</div>
            <p style={{ color: "#aaa", letterSpacing: 3, fontSize: 13, textTransform: "uppercase", marginTop: 16 }}>
              Fetching jobs from API...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 16, border: "1px solid #ffe0e0" }}>
            <span style={{ fontSize: 40 }}>⚠️</span>
            <p style={{ color: "#ff4757", marginTop: 12, fontWeight: 700 }}>Failed to load jobs</p>
            <p style={{ color: "#aaa", fontSize: 13 }}>Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: 16, background: "#302b63", color: "#fff",
                border: "none", borderRadius: 10, padding: "10px 24px",
                cursor: "pointer", fontWeight: 700, fontSize: 14,
              }}
            >🔄 Retry</button>
          </div>
        )}

        {/* Empty — no saved jobs */}
        {!loading && !error && viewMode === "saved" && savedJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 56 }}>🤍</div>
            <h3 style={{ color: "#302b63", marginTop: 16 }}>No saved jobs yet</h3>
            <p style={{ color: "#aaa", fontSize: 14 }}>Click the heart ❤️ on any job card to save it here.</p>
          </div>
        )}

        {/* Empty — no search results */}
        {!loading && !error && filtered.length === 0 && !(viewMode === "saved" && savedJobs.length === 0) && (
          <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 56 }}>🔍</div>
            <h3 style={{ color: "#302b63", marginTop: 16 }}>No jobs match your search</h3>
            <p style={{ color: "#aaa", fontSize: 14 }}>Try searching for a different role, company or skill.</p>
          </div>
        )}

        {/* Job Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                saved={savedJobs.some(s => s.id === job.id)}
                onSave={handleSave}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>

      <p style={{ textAlign: "center", color: "#ccc", fontSize: 11, paddingBottom: 32, letterSpacing: 2, textTransform: "uppercase" }}>
        Job Portal • API: jsonplaceholder.typicode.com
      </p>

      <style>{`
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        input::placeholder { color: #bbb; }
      `}</style>
    </div>
  );
}
