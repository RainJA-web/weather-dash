import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudSun, Search, MapPin, Droplets, Wind, Thermometer, AlertCircle } from 'lucide-react';

// Sử dụng Key bạn vừa gửi
const API_KEY = '68d6a03fb2aae66bb182b9abcaada8cd'; 

function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchWeather = async (lat, lon, cityName) => {
    setLoading(true);
    setErrorMsg('');
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=vi`;
      
      if (cityName) {
        url += `&q=${encodeURIComponent(cityName)}`;
      } else if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      } else {
        return; // Không có thông tin để tìm
      }

      const res = await axios.get(url);
      setWeather(res.data);
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message === "city not found" 
        ? "Không tìm thấy thành phố này!" 
        : "Lỗi kết nối hoặc API Key chưa kích hoạt (đợi 30p-2h).";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy vị trí khi khởi động
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => fetchWeather(p.coords.latitude, p.coords.longitude),
        () => setErrorMsg("Vui lòng cho phép truy cập vị trí hoặc tìm kiếm thủ công.")
      );
    }
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'system-ui, sans-serif',
    color: '#fff',
    padding: '20px'
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CloudSun size={40} /> Weather Dash
      </h1>

      <div style={{ marginBottom: '15px', width: '100%', maxWidth: '400px', display: 'flex', gap: '10px' }}>
        <input 
          style={{ padding: '12px', borderRadius: '10px', border: 'none', flex: 1, outline: 'none' }}
          type="text" 
          placeholder="Nhập thành phố (vd: Ho Chi Minh)..." 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchWeather(null, null, city)}
        />
        <button 
          style={{ padding: '12px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: '#fff', color: '#764ba2', fontWeight: 'bold' }}
          onClick={() => fetchWeather(null, null, city)}
        >
          {loading ? '...' : <Search size={20} />}
        </button>
      </div>

      {errorMsg && (
        <p style={{ backgroundColor: 'rgba(255,0,0,0.2)', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <AlertCircle size={18} /> {errorMsg}
        </p>
      )}

      {weather && (
        <div style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(15px)', padding: '30px', borderRadius: '25px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
            <MapPin size={18} />
            <h2 style={{ margin: 0 }}>{weather.name}, {weather.sys.country}</h2>
          </div>
          
          <div style={{ fontSize: '64px', fontWeight: 'bold', margin: '15px 0' }}>
            {Math.round(weather.main.temp)}°C
          </div>

          <p style={{ textTransform: 'capitalize', fontSize: '20px', margin: '0 0 20px 0', opacity: 0.9 }}>
            {weather.weather[0].description}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '20px' }}>
            <div>
              <Droplets size={20} />
              <p style={{ fontSize: '12px', margin: '5px 0' }}>Độ ẩm</p>
              <strong>{weather.main.humidity}%</strong>
            </div>
            <div>
              <Wind size={20} />
              <p style={{ fontSize: '12px', margin: '5px 0' }}>Gió</p>
              <strong>{weather.wind.speed} m/s</strong>
            </div>
            <div>
              <Thermometer size={20} />
              <p style={{ fontSize: '12px', margin: '5px 0' }}>Cảm giác</p>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;