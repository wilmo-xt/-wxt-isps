const axios = require('axios');

/**
 * Serviço para consulta de dados climáticos usando a API OpenWeatherMap
 */
class WeatherService {
  constructor() {
    this.API_KEY = process.env.OPENWEATHER_API_KEY;
    this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
  }

  /**
   * Consulta o clima atual para uma cidade específica
   * @param {string} city - Nome da cidade para consulta
   * @returns {Promise<Object>} - Dados climáticos da cidade
   */
  async getCurrentWeather(city) {
    try {
      const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt&appid=${this.API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.status !== 200) {
        throw new Error(`Erro ao consultar clima: ${response.statusText}`);
      }
      
      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Erro ao consultar clima:', error);
      
      if (error.response && error.response.status === 404) {
        throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
      }
      
      throw new Error(`Falha ao consultar dados climáticos`);
    }
  }

  /**
   * Formata os dados climáticos recebidos da API
   * @param {Object} data - Dados brutos da API
   * @returns {Object} - Dados formatados
   */
  formatWeatherData(data) {
    return {
      city: data.name,
      country: data.sys.country,
      temperature: {
        current: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        min: Math.round(data.main.temp_min),
        max: Math.round(data.main.temp_max)
      },
      weather: {
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon
      },
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg
      },
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      clouds: data.clouds.all,
      visibility: data.visibility,
      timestamp: data.dt,
      timezone: data.timezone,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    };
  }

  /**
   * Obtém a URL do ícone do clima
   * @param {string} iconCode - Código do ícone retornado pela API
   * @returns {string} - URL do ícone
   */
  getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

module.exports = new WeatherService();

