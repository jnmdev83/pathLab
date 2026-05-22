import React, { useState } from 'react';
import { S } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';
import { GoogleLogin } from '@react-oauth/google';

// 🧒 CHILD-FRIENDLY EXPLANATION:
// Welcome to the Magic Entrance Door of ChooseMyLab!
// Here, we have three different keys to open the door and join our club:
// 1. 📧 Email & Password Key (Write down your details and secure it with a passcode)
// 2. 📱 OTP Mobile Key (Send a temporary secret message code to your phone)
// 3. 🌐 Google Badge Key (One click and you show us your Google badge to login instantly!)
// Let's implement these three methods beautifully and explain them with cute steps!
export function Signup({ setUser, setPage }) {
  // ─── STATE MANAGEMENT ───
  // Imagine these variables are little buckets where we keep what the kid types!
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  
  // 🧒 CHANGE: isLogin is now TRUE by default so kids see the Login button first!
  const [isLogin, setIsLogin] = useState(true); 
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── EMAIL/PASSWORD SUBMIT HANDLER ───
  // 🧒 CHILD-FRIENDLY EXPLANATION:
  // When a kid clicks the "Login" or "Create Account" button using email,
  // we first check if they filled everything, then tell the server database to save or check it!
  function submitEmailAuth() {
    if (!isLogin && (!name || !email || !phone || !pass)) {
      setErr("Please fill all required fields.");
      return;
    }
    if (isLogin && (!email || !pass)) {
      setErr("Please enter your email and password.");
      return;
    }
    if (!isLogin && pass.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setErr("");
    
    const endpoint = isLogin ? "login" : "signup";
    const body = isLogin
      ? { email, password: pass }
      : { name, email, phone, password: pass };

    fetch(`${API_BASE_URL}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          // If the status is bad (like 400 or 401), parse the custom duplicate error!
          return res.json().then((d) => { throw new Error(d.error || "Failed"); });
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          setPage("home");
        } else {
          setErr(data.error || "An unexpected error occurred.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setErr(err.message || "Could not connect to database server.");
      });
  }

  // ─── GOOGLE SIGN-IN HANDLER ───
  // 🧒 CHILD-FRIENDLY EXPLANATION:
  // This sends the verified Google Credential token (ID Token) to our backend server
  // where it is validated securely before creating a session!
  function handleGoogleAuth(credentialResponse) {
    if (!credentialResponse.credential) {
      setErr("Failed to receive secure token from Google.");
      return;
    }
    setLoading(true);
    setErr("");

    fetch(`${API_BASE_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          setPage("home");
        } else {
          setErr(data.error || "Google authentication failed.");
        }
      })
      .catch(() => {
        setLoading(false);
        setErr("Could not connect to Google auth services.");
      });
  }

  return (
    <div className="fu" style={{ maxWidth: 420, margin: "36px auto", padding: "0 12px", position: "relative" }}>
      
      {/* 📡 FLOATING SIMULATED SMS PUSH NOTIFICATION */}
      {simulatedSms && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            borderRadius: 16,
            padding: "16px 20px",
            color: "#fff",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            width: "90%",
            maxWidth: 380,
            animation: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--lime)", letterSpacing: "0.05em" }}>
              💬 Incoming Message
            </span>
            <button
              onClick={() => setSimulatedSms("")}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14 }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>
            {simulatedSms}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textAlign: "right" }}>
            Just now • simulated SMS service
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            ...S.serif,
            fontSize: 36,
            ...S.lime,
            letterSpacing: "-.02em",
            marginBottom: 4,
          }}
        >
          ChooseMyLab.
        </div>
        <div style={{ ...S.muted, fontSize: 13, fontWeight: 500 }}>
          Find & Book Affordable Lab Tests
        </div>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* DISPLAY MESSAGE FEEDBACKS */}
          {err && (
            <div
              style={{
                background: "rgba(239,68,68,.08)",
                border: "1px solid rgba(239,68,68,.2)",
                color: "var(--danger)",
                ...S.mono,
                fontSize: 12,
                padding: "10px 14px",
                borderRadius: 10,
              }}
            >
              ⚠ {err}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                background: "rgba(34,197,94,.08)",
                border: "1px solid rgba(34,197,94,.2)",
                color: "#16a34a",
                ...S.mono,
                fontSize: 12,
                padding: "10px 14px",
                borderRadius: 10,
              }}
            >
              ✓ {successMsg}
            </div>
          )}

          {/* ────────────────── METHOD 1: EMAIL & PASSWORD ────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              {/* Secondary switch to toggle Sign Up and Login */}
              <div style={{ display: "flex", background: "var(--bg)", padding: 4, borderRadius: 10, marginBottom: 4 }}>
                <button
                  onClick={() => { setIsLogin(true); setErr(""); setSuccessMsg(""); }}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: isLogin ? "var(--card)" : "transparent",
                    color: isLogin ? "var(--text)" : "var(--muted)",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: isLogin ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsLogin(false); setErr(""); setSuccessMsg(""); }}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: !isLogin ? "var(--card)" : "transparent",
                    color: !isLogin ? "var(--text)" : "var(--muted)",
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: "pointer",
                    boxShadow: !isLogin ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                  }}
                >
                  Create Account
                </button>
              </div>

              {!isLogin && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Full Name</label>
                  <input
                    placeholder="E.g. Divyansh Gahlot"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErr(""); }}
                    style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4 }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4 }}
                />
              </div>

              {!isLogin && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErr(""); }}
                    style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4 }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4 }}
                />
              </div>

              <button
                className="bl"
                onClick={submitEmailAuth}
                disabled={loading}
                style={{ padding: 14, fontSize: 14, width: "100%", marginTop: 8 }}
              >
                {loading ? "Authenticating..." : isLogin ? "Log In →" : "Register →"}
              </button>
            </div>

          {/* ────────────────── METHOD 3: GOOGLE AUTHENTICATION ────────────────── */}
          <div style={{ margin: "8px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
            <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>OR</span>
            <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
          </div>

          {/* Real Google Identity integration button */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 8 }}>
            <GoogleLogin
              onSuccess={handleGoogleAuth}
              onError={() => setErr("Google Sign-In Failed")}
              useOneTap
            />
          </div>

          <p
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textAlign: "center",
              lineHeight: 1.6,
              marginTop: 16
            }}
          >
            By continuing, you agree to ChooseMyLab's premium health terms.
          </p>
        </div>
      </div>

    </div>
  );
}
