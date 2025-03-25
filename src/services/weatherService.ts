
import { WeatherData, Location } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/';

export const weatherService = {
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    const cityResponse = await fetch(
      `${BASE_URL}2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!cityResponse.ok) {
      throw new Error('Failed to fetch city data');
    }
    
    const cityData = await cityResponse.json();
    
    const weatherResponse = await fetch(
      `${BASE_URL}3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await weatherResponse.json();
    
    return {
      city: cityData.name,
      temp: Math.round(weatherData.current.temp),
      description: weatherData.current.weather[0].description,
      icon: weatherData.current.weather[0].icon,
      humidity: weatherData.current.humidity,
      windSpeed: Math.round(weatherData.current.wind_speed),
      pressure: weatherData.current.pressure,
      forecast: weatherData.daily.slice(1, 6).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString(),
        maxTemp: Math.round(day.temp.max),
        minTemp: Math.round(day.temp.min),
        description: day.weather[0].description,
        icon: day.weather[0].icon
      }))
    };
  },

  async searchLocation(query: string): Promise<Location[]> {
    const response = await fetch(
      `${BASE_URL}geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search location');
    }
    
    const data = await response.json();
    return data.map((item: any) => ({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state
    }));
  }
};