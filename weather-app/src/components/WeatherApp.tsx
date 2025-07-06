import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { Search, LocationOn, AccessTime, Thermostat, Opacity, Air, Visibility, WbSunny } from '@mui/icons-material';
import { WeatherService } from '../services/weatherService';
import type { WeatherResponse } from '../types/weather';

export function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await WeatherService.getCurrentWeather(city);
      setWeather(weatherData);
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

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
            <TextField
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              variant="outlined"
              disabled={loading}
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
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
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
              <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Box textAlign="center">
                    <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
                      {Math.round(weather.current.temp_c)}°C
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      ({Math.round(weather.current.temp_f)}°F)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box textAlign="center">
                    <img
                      src={`https:${weather.current.condition.icon}`}
                      alt={weather.current.condition.text}
                      style={{ width: 80, height: 80 }}
                    />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {weather.current.condition.text}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Weather Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Thermostat color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Feels like
                    </Typography>
                    <Typography variant="h6">
                      {Math.round(weather.current.feelslike_c)}°C
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Opacity color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Humidity
                    </Typography>
                    <Typography variant="h6">
                      {weather.current.humidity}%
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
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
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Visibility color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Visibility
                    </Typography>
                    <Typography variant="h6">
                      {weather.current.vis_km} km
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pressure
                    </Typography>
                    <Typography variant="h6">
                      {weather.current.pressure_mb} mb
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <WbSunny color="primary" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      UV Index
                    </Typography>
                    <Typography variant="h6">
                      {weather.current.uv}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
} 