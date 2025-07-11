import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Stack,
  Autocomplete,
  ListItem,
  ListItemText
} from '@mui/material';

import { Search, LocationOn, AccessTime, Thermostat, Opacity, Air, Visibility, WbSunny } from '@mui/icons-material';
import { getCurrentWeather, searchCities, type Location } from '../services/weatherService';
import type { WeatherResponse } from '../types/weather';

export function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Debounced search for autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (city.length >= 2) {
        setSearchLoading(true);
        try {
          const results = await searchCities(city);
          setSuggestions(results);
        } catch (err) {
          console.error('Search error:', err);
          setSuggestions([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [city]);

  const handleSearch = async (selectedCity?: string) => {
    const cityToSearch = selectedCity || city;
    if (!cityToSearch.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await getCurrentWeather(cityToSearch);
      setWeather(weatherData);
      setCity(cityToSearch);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 3,
        px: 2
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            color: 'white',
            mb: 4,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          🌤️ Weather App
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={suggestions}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                return `${option.name}, ${option.region}, ${option.country}`;
              }}
              loading={searchLoading}
              value={city}
              onChange={(_, newValue) => {
                if (typeof newValue === 'string') {
                  setCity(newValue);
                } else if (newValue) {
                  setCity(newValue.name);
                  handleSearch(newValue.name);
                }
              }}
              onInputChange={(_, newInputValue) => {
                setCity(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter city name..."
                  variant="outlined"
                  disabled={loading}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                      }
                    }
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <ListItem key={key} {...otherProps}>
                    <ListItemText
                      primary={option.name}
                      secondary={`${option.region}, ${option.country}`}
                    />
                  </ListItem>
                );
              }}
            />
            <Button
              variant="contained"
              disabled={loading}
              onClick={() => handleSearch()}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{
                borderRadius: 3,
                px: 3,
                background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                }
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            ❌ {error}
          </Alert>
        )}

        {weather && (
          <Card
            elevation={8}
            sx={{
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Location Info */}
              <Box textAlign="center" sx={{ mb: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {weather.location.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {weather.location.region}, {weather.location.country}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Last updated: {formatTime(weather.current.last_updated)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Main Weather Info */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3, alignItems: 'center' }}>
                <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
                  <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
                    {Math.round(weather.current.temp_c)}°C
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    ({Math.round(weather.current.temp_f)}°F)
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 300px', textAlign: 'center' }}>
                  <img
                    src={`https:${weather.current.condition.icon}`}
                    alt={weather.current.condition.text}
                    style={{ width: 80, height: 80 }}
                  />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {weather.current.condition.text}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Weather Details */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Thermostat color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Feels like
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(weather.current.feelslike_c)}°C
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Opacity color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Humidity
                  </Typography>
                  <Typography variant="h6">
                    {weather.current.humidity}%
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Air color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Wind
                  </Typography>
                  <Typography variant="h6">
                    {weather.current.wind_kph} km/h
                  </Typography>
                  <Chip label={weather.current.wind_dir} size="small" sx={{ mt: 1 }} />
                </Paper>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Visibility color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Visibility
                  </Typography>
                  <Typography variant="h6">
                    {weather.current.vis_km} km
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Pressure
                  </Typography>
                  <Typography variant="h6">
                    {weather.current.pressure_mb} mb
                  </Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                  <WbSunny color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    UV Index
                  </Typography>
                  <Typography variant="h6">
                    {weather.current.uv}
                  </Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
} 