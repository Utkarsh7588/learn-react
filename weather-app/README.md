# Weather App

A React weather application built with TypeScript and Vite that provides current weather information and forecasts.

## Features

- Current weather display
- Weather forecasts
- Location-based weather
- City search with autocomplete
- Responsive design with Material-UI
- Caching for improved performance

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory and add your Weather API key:

```env
VITE_WEATHER_API_KEY=your_weather_api_key_here
```

**Get your API key from:** [WeatherAPI.com](https://www.weatherapi.com/)

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Weather Service

The application uses a comprehensive weather service (`src/services/weatherService.ts`) that includes:

- **API Key Management**: Uses environment variables for secure API key storage
- **Caching**: Implements 10-minute cache to reduce API calls
- **Error Handling**: Custom error classes with proper error messages
- **Multiple Methods**:
  - `getCurrentWeather(city)` - Get weather by city name
  - `getCurrentWeatherByCoords(lat, lon)` - Get weather by coordinates
  - `getForecast(city, days)` - Get weather forecast
  - `searchCities(query)` - Search for cities
  - `getWeatherByLocation()` - Get weather for user's location

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
