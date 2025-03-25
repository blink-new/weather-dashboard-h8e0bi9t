
export interface WeatherData {
  city: string;
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    description: string;
    icon: string;
  }>;
}

export interface Location {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}