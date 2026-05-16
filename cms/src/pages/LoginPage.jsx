import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { isAuthenticated } from '../services/auth';

const LoginPage = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="bg-primary p-6 text-center">
          <h1 className="text-3xl font-bold text-white font-serif tracking-wide">PathLab CMS</h1>
          <p className="text-indigo-100 mt-2 text-sm font-medium opacity-90">Secure Administration Portal</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-bold text-text-main mb-6">Sign In to Continue</h2>
          <LoginForm />
        </div>
      </div>
      
      <p className="mt-8 text-sm text-text-muted">
        &copy; {new Date().getFullYear()} PathLab. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
