function updateClock() {
    const now = new Date();
    const formatted = now.toLocaleDateString('ru-RU') + ' ' +
        now.toLocaleTimeString('ru-RU', { hour12: false }) + '.' +
        String(now.getMilliseconds()).padStart(3, '0');
    document.getElementById('clock').textContent = formatted;
}
setInterval(updateClock, 1);

function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const weather = data.current_weather;
            const temp = weather.temperature;
            const wind = weather.windspeed;
            document.getElementById('weather').textContent =
                `Температура: ${temp}°C, Ветер: ${wind} км/ч`;

            if (temp > 25) {
                document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80")';
            } else if (temp > 15) {
                document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1920&q=80")';
            } else if (temp > 5) {
                document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1486308510493-cbffb9648cde?auto=format&fit=crop&w=1920&q=80")';
            } else {
                document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1608133152769-0e24a4424ea7?auto=format&fit=crop&w=1920&q=80")';
            }
            document.body.style.backgroundSize = 'cover';
        })
        .catch(() => {
            document.getElementById('weather').textContent = 'Ошибка загрузки погоды.';
        });
}

function useGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
            () => document.getElementById('weather').textContent = 'Не удалось определить местоположение.'
        );
    } else {
        document.getElementById('weather').textContent = 'Геолокация не поддерживается.';
    }
}

function getWeatherByCity() {
    const city = document.getElementById('cityInput').value;
    if (!city) return;

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`;
    fetch(geoUrl)
        .then(res => res.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const loc = data.results[0];
                fetchWeather(loc.latitude, loc.longitude);
            } else {
                document.getElementById('weather').textContent = 'Город не найден.';
            }
        })
        .catch(() => {
            document.getElementById('weather').textContent = 'Ошибка при поиске города.';
        });
}

useGeolocation();