
import { useState, useEffect } from 'react';
import { WeatherData, Location } from '../types/weather';
import { weatherService } from '../services/weatherService';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    } else {
      getUserLocation();
    }
  }, [location]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude, name: "Current Location" });
        },
        (error) => {
          setError("Unable to get your location. Please search for a city.");
        }
      );
    }
  };

  const fetchWeather = async (loc: Location) => {
    try {
      setLoading(true);
      setError(null);
      const data = await weatherService.getWeather(loc.lat, loc.lon);
      setWeather(data);
    } catch (err) {
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await weatherService.searchLocation(query);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to search location");
    }
  };

  const selectLocation = (loc: Location) => {
    setLocation(loc);
    setSearchResults([]);
    // Save to recent locations
    const recent = JSON.parse(localStorage.getItem('recentLocations') || '[]');
    const updated = [loc, ...recent.filter((l: Location) => l.name !== loc.name)].slice(0, 5);
    localStorage.setItem('recentLocations', JSON.stringify(updated));
  };

  return {
    weather,
    location,
    loading,
    error,
    searchResults,
    searchLocation,
    selectLocation,
    getUserLocation
  };
}