import React, { useState } from 'react';
import { S } from '../../utils/reusables';
import { API_BASE_URL } from '../../config';
import { GoogleLogin } from '@react-oauth/google';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../../config/firebase';

// 🧒 CHILD-FRIENDLY EXPLANATION:
// Welcome to the newly structured, super clean, and minimal Entrance Door of ChooseMyLab!
// We've simplified the layout into a gorgeous single-switcher flow:
// - Sign In tab: Sign in with Email/Password or toggle to Mobile SMS OTP with one click!
// - Create Account tab: Setup a secure account with your details.
// - Google integration: Single-click instant access.
// - Auto-profile builder: Phone OTP signups automatically prompt for Name & Email!
export function Signup({ setUser, setPage }) {
  // ─── STATE MANAGEMENT ───
  const [isLogin, setIsLogin] = useState(true); // Toggles between "Sign In" and "Create Account"
  const [loginMethod, setLoginMethod] = useState("email"); // Toggles "email" or "phone" inside Sign In
  
  // Registration / Profile inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  
  // Feedback states
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Firebase SMS OTP specific states
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmObj, setConfirmObj] = useState(null);
  const [needsPhoneRegistration, setNeedsPhoneRegistration] = useState(false);

  // ─── RESET ALL FEEDBACK & INPUT FLOWS ───
  function switchTab(loginTabState) {
    setIsLogin(loginTabState);
    setErr("");
    setSuccessMsg("");
    setOtpSent(false);
    setConfirmObj(null);
    setNeedsPhoneRegistration(false);
    setPhoneOtp("");
    setOtpCode("");
  }

  // ─── EMAIL/PASSWORD SUBMIT HANDLER ───
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
    setSuccessMsg("");
    
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
  function handleGoogleAuth(credentialResponse) {
    if (!credentialResponse.credential) {
      setErr("Failed to receive secure token from Google.");
      return;
    }
    setLoading(true);
    setErr("");
    setSuccessMsg("");

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

  // ─── FIREBASE SEND SMS OTP HANDLER ───
  function sendFirebaseOtp() {
    if (!phoneOtp) {
      setErr("Please enter your mobile phone number.");
      return;
    }

    let formattedPhone = phoneOtp.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+91" + formattedPhone;
    }

    setLoading(true);
    setErr("");
    setSuccessMsg("");

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            setErr("reCAPTCHA security checks expired. Please request OTP again.");
          }
        });
      }

      signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier)
        .then((confirmationResult) => {
          setLoading(false);
          setConfirmObj(confirmationResult);
          setOtpSent(true);
          setSuccessMsg(`SMS OTP verification code sent to ${formattedPhone}!`);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Firebase SMS send failed:", error);
          setErr(error.message || "Failed to send SMS code. Make sure format is correct.");
        });
    } catch (e) {
      setLoading(false);
      console.error(e);
      setErr("Could not initialize security verification framework.");
    }
  }

  // ─── FIREBASE VERIFY SMS OTP HANDLER ───
  function verifyFirebaseOtp() {
    if (!otpCode) {
      setErr("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setErr("");
    setSuccessMsg("");

    confirmObj.confirm(otpCode)
      .then(async (result) => {
        const verifiedPhone = result.user.phoneNumber;

        const response = await fetch(`${API_BASE_URL}/api/auth/firebase-phone-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: verifiedPhone })
        });
        const data = await response.json();

        if (response.ok) {
          if (data.needsRegistration) {
            setNeedsPhoneRegistration(true);
            setLoading(false);
            setSuccessMsg("Phone verified! Enter your name and email to complete registration.");
          } else {
            setLoading(false);
            setUser(data.user);
            setPage("home");
          }
        } else {
          setLoading(false);
          setErr(data.error || "Failed to finalize session with the secure backend server.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Firebase Confirm OTP Failed:", error);
        setErr("Invalid verification code. Please check your SMS and try again.");
      });
  }

  // ─── COMPLETE PHONE REGISTRATION FLOW ───
  function completePhoneSignup() {
    if (!name || !email) {
      setErr("Please enter both your name and email to complete registration.");
      return;
    }

    setLoading(true);
    setErr("");
    setSuccessMsg("");

    let formattedPhone = phoneOtp.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+91" + formattedPhone;
    }

    fetch(`${API_BASE_URL}/api/auth/firebase-phone-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: formattedPhone,
        name,
        email
      })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((d) => { throw new Error(d.error || "Failed to create profile"); });
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setUser(data.user);
          setPage("home");
        } else {
          setErr(data.error || "An unexpected error occurred during signup.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setErr(err.message || "Failed to register profile on database server.");
      });
  }

  return (
    <div className="fu" style={{ maxWidth: 400, margin: "0 auto", padding: "0 12px", position: "relative", width: "100%" }}>
      {/* Invisible container for Firebase invisible reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {/* HEADER SECTION */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            ...S.serif,
            fontSize: 34,
            ...S.lime,
            letterSpacing: "-.02em",
            marginBottom: 2,
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
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          
          {/* DISPLAY MESSAGE FEEDBACKS */}
          {err && (
            <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", color: "var(--danger)", ...S.mono, fontSize: 11, padding: "8px 12px", borderRadius: 8 }}>
              ⚠ {err}
            </div>
          )}

          {successMsg && (
            <div style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", color: "#16a34a", ...S.mono, fontSize: 11, padding: "8px 12px", borderRadius: 8 }}>
              ✓ {successMsg}
            </div>
          )}

          {/* PRIMARY SWITCHER: SIGN IN OR REGISTER */}
          {!needsPhoneRegistration && (
            <div style={{ display: "flex", background: "var(--bg)", padding: 4, borderRadius: 10, marginBottom: 4 }}>
              <button
                onClick={() => switchTab(true)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: isLogin ? "var(--card)" : "transparent",
                  color: isLogin ? "var(--text)" : "var(--muted)",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  boxShadow: isLogin ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => switchTab(false)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: !isLogin ? "var(--card)" : "transparent",
                  color: !isLogin ? "var(--text)" : "var(--muted)",
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                  boxShadow: !isLogin ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* ────────────────── FLOW 1: SIGN IN MODE ────────────────── */}
          {isLogin && !needsPhoneRegistration && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {loginMethod === "email" ? (
                /* EMAIL SIGN IN FLOW */
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                      style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={pass}
                      onChange={(e) => { setPass(e.target.value); setErr(""); }}
                      style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                    />
                  </div>
                  <button
                    className="bl"
                    onClick={submitEmailAuth}
                    disabled={loading}
                    style={{ padding: 12, fontSize: 13, width: "100%", marginTop: 4 }}
                  >
                    {loading ? "Signing in..." : "Log In →"}
                  </button>

                  <div style={{ textAlign: "center", marginTop: 4 }}>
                    <button
                      onClick={() => { setLoginMethod("phone"); setErr(""); setSuccessMsg(""); }}
                      style={{ background: "none", border: "none", color: "var(--lime)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                    >
                      📱 Log In with Mobile SMS OTP instead
                    </button>
                  </div>
                </div>
              ) : (
                /* PHONE OTP SIGN IN FLOW */
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mobile Phone Number</label>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <input
                        type="tel"
                        placeholder="E.g. 99999 99999"
                        value={phoneOtp}
                        onChange={(e) => { setPhoneOtp(e.target.value); setErr(""); }}
                        disabled={otpSent}
                        style={{ flex: 1, padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", fontSize: 13 }}
                      />
                      {!otpSent && (
                        <button
                          className="bl"
                          onClick={sendFirebaseOtp}
                          disabled={loading}
                          style={{ padding: "11px 16px", fontSize: 11 }}
                        >
                          {loading ? "Sending..." : "Send OTP"}
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Verification OTP Code</label>
                        <input
                          type="text"
                          maxLength="6"
                          placeholder="Enter 6-digit code"
                          value={otpCode}
                          onChange={(e) => { setOtpCode(e.target.value); setErr(""); }}
                          style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, letterSpacing: "0.5em", textAlign: "center", fontWeight: 700, fontSize: 15 }}
                        />
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <button
                          onClick={() => { setOtpSent(false); setConfirmObj(null); setOtpCode(""); }}
                          style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 11, cursor: "pointer", fontWeight: 600 }}
                        >
                          ← Change Number
                        </button>
                        
                        <button
                          className="bl"
                          onClick={verifyFirebaseOtp}
                          disabled={loading}
                          style={{ padding: "10px 18px", fontSize: 11 }}
                        >
                          {loading ? "Verifying..." : "Verify Code →"}
                        </button>
                      </div>
                    </div>
                  )}

                  {!otpSent && (
                    <div style={{ textAlign: "center", marginTop: 4 }}>
                      <button
                        onClick={() => { setLoginMethod("email"); setErr(""); setSuccessMsg(""); }}
                        style={{ background: "none", border: "none", color: "var(--lime)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                      >
                        📧 Log In with Email & Password instead
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ────────────────── FLOW 2: CREATE ACCOUNT MODE ────────────────── */}
          {!isLogin && !needsPhoneRegistration && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Full Name</label>
                <input
                  placeholder="E.g. Divyansh Gahlot"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                />
              </div>

              <button
                className="bl"
                onClick={submitEmailAuth}
                disabled={loading}
                style={{ padding: 12, fontSize: 13, width: "100%", marginTop: 4 }}
              >
                {loading ? "Registering..." : "Register & Join →"}
              </button>
            </div>
          )}

          {/* ────────────────── FLOW 3: MOBILE OTP REGISTRATION COMPLETER ────────────────── */}
          {needsPhoneRegistration && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Full Name</label>
                <input
                  placeholder="E.g. Divyansh Gahlot"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  style={{ width: "100%", padding: 11, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", outline: "none", marginTop: 4, fontSize: 13 }}
                />
              </div>
              <button
                className="bl"
                onClick={completePhoneSignup}
                disabled={loading}
                style={{ padding: 12, fontSize: 13, width: "100%", marginTop: 4 }}
              >
                {loading ? "Completing Profile..." : "Finish Registration →"}
              </button>
            </div>
          )}

          {/* ────────────────── GOOGLE AUTHENTICATION ────────────────── */}
          {!needsPhoneRegistration && (
            <>
              <div style={{ margin: "4px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
                <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>OR</span>
                <div style={{ height: 1, background: "var(--border)", flex: 1 }} />
              </div>

              {/* Real Google Identity integration button */}
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: 2 }}>
                <GoogleLogin
                  onSuccess={handleGoogleAuth}
                  onError={() => setErr("Google Sign-In Failed")}
                  useOneTap
                />
              </div>
            </>
          )}

          <p
            style={{
              ...S.muted,
              ...S.mono,
              fontSize: 10,
              textAlign: "center",
              lineHeight: 1.6,
              marginTop: 10
            }}
          >
            By continuing, you agree to ChooseMyLab's premium health terms.
          </p>
        </div>
      </div>

    </div>
  );
}
