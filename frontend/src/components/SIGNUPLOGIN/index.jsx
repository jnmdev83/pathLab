import React, { useState } from 'react';
import { S } from '../../utils/reusables';

// SIGNUP / LOGIN
export function Signup({ setUser, setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [err, setErr] = useState("");

  function submit() {
    if (!isLogin && (!name || !email || !phone || !pass)) {
      setErr("Please fill all fields.");
      return;
    }
    if (isLogin && (!email || !pass)) {
      setErr("Please fill all fields.");
      return;
    }
    // Only enforce password length on signup, NOT login
    if (!isLogin && pass.length < 6) {
      setErr("Password needs at least 6 characters.");
      return;
    }

    const endpoint = isLogin ? "login" : "signup";
    const body = isLogin
      ? { email, password: pass }
      : { name, email, phone, password: pass };

    fetch(`http://localhost:5000/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          setPage("home");
        } else {
          setErr(data.error || "Something went wrong.");
        }
      })
      .catch(() => setErr("Could not connect to database server."));
  }

  return (
    <div className="fu" style={{ maxWidth: 400, margin: "36px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div
          style={{
            ...S.serif,
            fontSize: 38,
            ...S.lime,
            letterSpacing: "-.02em",
            marginBottom: 4,
          }}
        >
          PathLab.
        </div>
        <div style={{ ...S.muted, fontSize: 13 }}>
          Find & Book Affordable Lab Tests
        </div>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1.5px solid var(--border)",
        }}
      >
        {/* Toggle */}
        <div
          style={{ display: "flex", borderBottom: "1.5px solid var(--border)" }}
        >
          {[
            ["Create Account", false],
            ["Login", true],
          ].map(([l, v]) => (
            <button
              key={l}
              onClick={() => {
                setIsLogin(v);
                setErr("");
              }}
              style={{
                flex: 1,
                padding: 13,
                background: "none",
                border: "none",
                borderBottom:
                  isLogin === v
                    ? "2px solid var(--lime)"
                    : "2px solid transparent",
                color: isLogin === v ? "var(--lime)" : "var(--muted)",
                fontFamily: "var(--fb)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                transition: "all .15s",
                letterSpacing: ".04em",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        <div
          style={{
            padding: 26,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {err && (
            <div
              style={{
                background: "rgba(255,82,82,.1)",
                border: "1px solid rgba(255,82,82,.3)",
                color: "var(--danger)",
                ...S.mono,
                fontSize: 12,
                padding: "9px 13px",
              }}
            >
              ⚠ {err}
            </div>
          )}

          {!isLogin && (
            <div>
              <label>Full Name *</label>
              <input
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErr("");
                }}
              />
            </div>
          )}
          <div>
            <label>Email *</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr("");
              }}
            />
          </div>
          {!isLogin && (
            <div>
              <label>Phone *</label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErr("");
                }}
              />
            </div>
          )}
          <div>
            <label>Password *</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
                setErr("");
              }}
            />
          </div>
          <button
            className="bl"
            onClick={submit}
            style={{ padding: 13, fontSize: 14, width: "100%", marginTop: 2 }}
          >
            {isLogin ? "Login →" : "Create Account →"}
          </button>
          <p
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}

