import axios from 'axios';
import type { WeatherResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY ;
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function getCurrentWeather(city: string): Promise<WeatherResponse> {
  try {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: city,
        aqi: 'no'
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.log(error)
      throw new Error(`Weather API error: ${error.response?.status} ${error.response?.data.error.message}`);
    }
    throw new Error('Network error occurred');
  }
}
