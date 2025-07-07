import axios from 'axios';
import type { WeatherResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY ;
const BASE_URL = 'https://api.weatherapi.com/v1';

// Location interface for search results
export interface Location {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

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

export async function searchCities(query: string): Promise<Location[]> {
  if (query.length < 2) return [];
  
  try {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query
      }
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      throw new Error(`Search API error: ${error.response?.status} ${error.response?.data.error.message}`);
    }
    throw new Error('Network error occurred');
  }
}
