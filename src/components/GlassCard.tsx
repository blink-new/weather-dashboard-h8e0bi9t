
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};