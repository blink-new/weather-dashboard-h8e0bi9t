
import React from 'react';

interface WeatherMetricProps {
  title: string;
  value: string;
  icon: string;
}

export const WeatherMetric: React.FC<WeatherMetricProps> = ({ title, value, icon }) => {
  return (
    <div className="glass p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <h3 className="text-gray-200 text-sm uppercase tracking-wider mb-3">{title}</h3>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
};