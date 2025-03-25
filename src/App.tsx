
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { FiSearch } from 'react-icons/fi';

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  forecast: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
  }>;
}

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWeather('New York');
  }, []);

  const fetchWeather = async (city: string) => {
    try {
      setLoading(true);
      setError(null);

      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (!geoData.length) {
        throw new Error('City not found');
      }

      const { lat, lon } = geoData[0];

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        city,
        temp: Math.round(weatherData.current.temp),
        condition: weatherData.current.weather[0].main,
        humidity: weatherData.current.humidity,
        windSpeed: Math.round(weatherData.current.wind_speed),
        pressure: weatherData.current.pressure,
        forecast: weatherData.daily.slice(1, 6).map((day: any) => ({
          date: format(day.dt * 1000, 'M/d/yyyy'),
          tempMax: Math.round(day.temp.max),
          tempMin: Math.round(day.temp.min),
          condition: day.weather[0].main,
        })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      fetchWeather(search);
      setSearch('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-12 text-center loading-pulse">
          <div className="text-4xl mb-4">🌤</div>
          <p className="text-xl font-light">Loading your weather forecast...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-12 text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <p className="text-xl font-light mb-6">{error}</p>
          <button
            onClick={() => fetchWeather('New York')}
            className="glass glass-hover px-8 py-3 text-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any city..."
            className="search-input pr-12"
          />
          <button 
            type="submit" 
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <FiSearch className="text-2xl text-white/70 hover:text-white transition-colors" />
          </button>
        </form>

        {/* Main Weather Card */}
        <div className="glass p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-3">{weather.city}</h1>
              <p className="text-2xl text-white/90 font-light">{weather.condition}</p>
            </div>
            <div className="text-center">
              <div className="temp-display text-7xl md:text-8xl">
                {weather.temp}°
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="metric-card">
            <WiHumidity className="metric-icon" />
            <p className="text-xl font-light">Humidity</p>
            <p className="text-3xl font-bold">{weather.humidity}%</p>
          </div>
          <div className="metric-card">
            <WiStrongWind className="metric-icon" />
            <p className="text-xl font-light">Wind Speed</p>
            <p className="text-3xl font-bold">{weather.windSpeed} km/h</p>
          </div>
          <div className="metric-card">
            <WiBarometer className="metric-icon" />
            <p className="text-xl font-light">Pressure</p>
            <p className="text-3xl font-bold">{weather.pressure} hPa</p>
          </div>
        </div>

        {/* Forecast */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weather.forecast.map((day) => (
            <div key={day.date} className="forecast-card">
              <p className="text-lg font-medium">
                {format(new Date(day.date), 'EEE')}
              </p>
              <div className="text-3xl font-bold">{day.tempMax}°</div>
              <div className="text-xl text-white/80">{day.tempMin}°</div>
              <p className="text-lg font-light">{day.condition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;