
import React from 'react';
import { useWeather } from '../hooks/useWeather';
import { WeatherMetric } from './WeatherMetric';
import { format } from 'date-fns';

export const WeatherDashboard: React.FC = () => {
  const { weather, loading, error } = useWeather();

  if (loading) return <div className="text-white text-center mt-10 animate-pulse">Loading...</div>;
  if (error) return <div className="text-white text-center mt-10 bg-red-500/20 p-4 rounded-lg">{error}</div>;
  if (!weather) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Main Weather Card */}
      <div className="glass p-8 mb-8 hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold mb-3">{weather.city}</h1>
            <p className="text-xl text-gray-200 capitalize">{weather.description}</p>
          </div>
          <div className="flex items-center">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-20 h-20"
            />
            <span className="text-7xl ml-4 font-light">{Math.round(weather.temp)}°C</span>
          </div>
        </div>
      </div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <WeatherMetric
          title="Humidity"
          value={`${weather.humidity}%`}
          icon="💧"
        />
        <WeatherMetric
          title="Wind Speed"
          value={`${weather.windSpeed} km/h`}
          icon="🌬️"
        />
        <WeatherMetric
          title="Pressure"
          value={`${weather.pressure} hPa`}
          icon="📊"
        />
      </div>

      {/* 5-Day Forecast */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {weather.forecast.map((day, index) => (
          <div key={index} className="glass p-5 text-center hover:shadow-2xl transition-all duration-300">
            <p className="text-sm font-medium mb-3">{format(new Date(day.date), 'MMM d')}</p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="w-14 h-14 mx-auto"
            />
            <div className="flex justify-center gap-4 mt-3">
              <span className="text-xl font-bold">{Math.round(day.maxTemp)}°</span>
              <span className="text-xl text-gray-400">{Math.round(day.minTemp)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};