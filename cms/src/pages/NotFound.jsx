import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-bold text-primary font-serif mb-4">404</h1>
      <h2 className="text-3xl font-bold text-text-main mb-4">Page Not Found</h2>
      <p className="text-text-muted mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/dashboard" 
        className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
