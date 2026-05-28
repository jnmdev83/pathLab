import React, { useState } from 'react';
import { API_BASE_URL } from '../../config';
import { GoogleLogin } from '@react-oauth/google';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../../config/firebase';

export function Signup({ setUser, setPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginMethod, setLoginMethod] = useState("email");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  
  const [err, setErr] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmObj, setConfirmObj] = useState(null);
  const [needsPhoneRegistration, setNeedsPhoneRegistration] = useState(false);

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
    <div className="max-w-md mx-auto py-14 px-4 font-body relative w-full flex flex-col justify-center min-h-[calc(100vh-80px)]">
      <div id="recaptcha-container"></div>

      {/* HEADER SECTION */}
      <div className="text-center mb-10">
        <div className="font-headline text-[38px] font-extrabold text-primary tracking-tight leading-none mb-2">
          ChooseMyLab
        </div>
        <p className="text-sm font-semibold text-on-surface-variant/80">
          Find & book direct, affordable pathology tests.
        </p>
      </div>

      {/* MAIN AUTHENTICATION CARD */}
      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-xl overflow-hidden border-white">
        <div className="space-y-6">
          {/* FEEDBACK STATUS BUBBLES */}
          {err && (
            <div className="bg-red-50 border border-red-200 text-error text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
              <span>⚠</span> {err}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-secondary text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
              <span>✓</span> {successMsg}
            </div>
          )}

          {/* TAB HEADER TABS */}
          {!needsPhoneRegistration && (
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => switchTab(true)}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                  isLogin ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant/70"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchTab(false)}
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                  !isLogin ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant/70"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* 1. SIGN IN FORMS */}
          {isLogin && !needsPhoneRegistration && (
            <div className="space-y-4">
              {loginMethod === "email" ? (
                /* EMAIL LOGIN */
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                      className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={pass}
                      onChange={(e) => { setPass(e.target.value); setErr(""); }}
                      className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                    />
                  </div>
                  <button
                    onClick={submitEmailAuth}
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm mt-2"
                  >
                    {loading ? "Signing in..." : "Log In"}
                  </button>
                  <button
                    onClick={() => { setLoginMethod("phone"); setErr(""); setSuccessMsg(""); }}
                    className="w-full text-center text-xs text-primary font-bold hover:underline py-1 mt-2"
                  >
                    📱 Sign In with Mobile SMS OTP instead
                  </button>
                </div>
              ) : (
                /* PHONE OTP */
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Mobile Phone Number</label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="E.g. 99999 99999"
                        value={phoneOtp}
                        onChange={(e) => { setPhoneOtp(e.target.value); setErr(""); }}
                        disabled={otpSent}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                      />
                      {!otpSent && (
                        <button
                          onClick={sendFirebaseOtp}
                          disabled={loading}
                          className="px-4 py-3 bg-primary text-on-primary text-xs font-bold rounded-2xl hover:bg-primary-container active:scale-95 transition-all flex-shrink-0"
                        >
                          {loading ? "..." : "Send OTP"}
                        </button>
                      )}
                    </div>
                  </div>

                  {otpSent && (
                    <div className="space-y-4 animate-slide-up">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">SMS Code</label>
                        <input
                          type="text"
                          maxLength="6"
                          placeholder="Enter 6-digit code"
                          value={otpCode}
                          onChange={(e) => { setOtpCode(e.target.value); setErr(""); }}
                          className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none tracking-[0.5em] text-center font-bold text-lg"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <button
                          onClick={() => { setOtpSent(false); setConfirmObj(null); setOtpCode(""); }}
                          className="text-xs text-on-surface-variant hover:text-primary font-bold"
                        >
                          Change Phone
                        </button>
                        <button
                          onClick={verifyFirebaseOtp}
                          disabled={loading}
                          className="px-6 py-3 bg-primary text-on-primary text-xs font-bold rounded-2xl active:scale-95 transition-all shadow-md shadow-primary/10"
                        >
                          {loading ? "Verifying..." : "Verify Code"}
                        </button>
                      </div>
                    </div>
                  )}

                  {!otpSent && (
                    <button
                      onClick={() => { setLoginMethod("email"); setErr(""); setSuccessMsg(""); }}
                      className="w-full text-center text-xs text-primary font-bold hover:underline py-1 mt-2"
                    >
                      📧 Sign In with Email & Password
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. REGISTRATION FORM */}
          {!isLogin && !needsPhoneRegistration && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Full Name</label>
                <input
                  placeholder="E.g. Divyansh Gahlot"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                />
              </div>
              <button
                onClick={submitEmailAuth}
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm mt-4"
              >
                {loading ? "Registering..." : "Register & Join"}
              </button>
            </div>
          )}

          {/* 3. PHONE REGISTRATION OVERLAY */}
          {needsPhoneRegistration && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Full Name</label>
                <input
                  placeholder="E.g. Divyansh Gahlot"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 block font-headline mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-outline-variant/30 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-semibold"
                />
              </div>
              <button
                onClick={completePhoneSignup}
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl shadow-md transition-all active:scale-95 text-sm mt-4"
              >
                {loading ? "Saving Profile..." : "Complete Registration"}
              </button>
            </div>
          )}

          {/* GOOGLE FEDERATION */}
          {!needsPhoneRegistration && (
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant/40 justify-center">
                <div className="h-px bg-outline-variant/20 flex-1" />
                <span>OR SIGN IN WITH</span>
                <div className="h-px bg-outline-variant/20 flex-1" />
              </div>

              <div className="flex justify-center w-full shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden bg-white py-1">
                <GoogleLogin
                  onSuccess={handleGoogleAuth}
                  onError={() => setErr("Google Sign-In Failed")}
                  useOneTap
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
