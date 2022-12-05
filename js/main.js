
const APIKEY = '8913965d97341b8f7136dad04d180979';
let API_WEATHER;
let API_CITY;

//Arrière plan de l'app
const background = document.querySelector('.app-container');
//Png montagne
const hills = document.querySelector('.hills');
//Localisation
const location = document.querySelector('.location');
//Icone svg du temp
const imgIcon = document.querySelector('.icon-meteo');
//Temp
const temps = document.querySelector('.temp');
//Température
const temperature = document.querySelector('.temperature');
//Humiditer
const humidity = document.querySelector('.humidity');
const humidity_index = document.querySelector('.humidity_index')
//Indice UV
const iuv = document.querySelector('.uv');
//vent
const wind = document.querySelector('.wind')
const wind_Direction = document.querySelector('.wind-direction')

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        CallAPIWeather(long, lat);
        CallAPICity(long, lat);
    }, () => {
        alert(`Activez la localisation pour faire fonctionner l'appli`)
    })
}

//Appel de L'api pour la météo
function CallAPIWeather(long, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${APIKEY}`)
        .then((reponse) => {
            return reponse.json();
        })
        .then((data) => {
            console.log(data);

            API_WEATHER = data;

            let heureNow = new Date().getHours()
            let MinuteNow = new Date().getMinutes();
            let uv = API_WEATHER.current.uvi;
            let value_humidity = `${Math.trunc(API_WEATHER.current.humidity)}`
            let windDirection = API_WEATHER.current.wind_deg;


            //Icone du temp dynamique
            if (heureNow >= 6 && heureNow < 21) {
                imgIcon.src = `img/jour/${API_WEATHER.current.weather[0].icon}.svg`
                background.style.backgroundColor = '#5094ab';
                hills.src = `img/bg-day.png`
            }
            else {
                imgIcon.src = `img/nuit/${API_WEATHER.current.weather[0].icon}.svg`
                background.style.backgroundColor = '#0f0f24';
                hills.src = 'img/bg-night.png'
            }

            //Le temp
            temps.innerHTML = API_WEATHER.current.weather[0].description;
            //La température
            temperature.innerHTML = `${Math.trunc(API_WEATHER.current.temp)}°`;
            //L'humiditer
            humidity.innerHTML = value_humidity + " %";
            if (value_humidity >= 0 && value_humidity < 35) {
                humidity_index.innerHTML = `Sec`;
            }
            else if (value_humidity >= 35 && value_humidity < 75) {
                humidity_index.innerHTML = `Optimal`;
            }
            else if (value_humidity >= 75 && value_humidity <= 100) {
                humidity_index.innerHTML = `Humide`;
            }
            //Vent
            wind.innerHTML = `${Math.trunc(API_WEATHER.current.wind_speed * 3.6)} Km/h`;

            //echelle d'indice uv
            if (uv <= 2) {
                iuv.innerHTML = `faible`;
            }
            else if (uv > 2 && uv <= 5) {
                iuv.innerHTML = `moyen`;
            }
            else if (uv > 5 && uv <= 7) {
                iuv.innerHTML = `élevé`;
            }
            else if (uv > 7 && uv <= 10) {
                iuv.innerHTML = `Très élevé`;
            }
            else {
                iuv.innerHTML = `extrème`;
            }

            //direction du vent
            let Tab_Win_Direction = ["Nord", "Nord Nord Ouest", "Nord Est", "Est Nord Est",
                "Est", "Est Sud Est", "Sud Est", "Sud Sud Est",
                "Sud", "Sud Sud Ouest", "Sud ouest", "Ouest Sud Ouest",
                "Ouest", "Ouest Nord Ouest", "Nord Ouest", "Nord Nord Ouest"]
            windDirection = windDirection / 22.5
            wind_Direction.innerHTML = Tab_Win_Direction[windDirection]
            console.log(wind_Direction)

        })
}

//Appel de l'api pour la localisation à partir de la longitude et de la lattitude
function CallAPICity(longi, lati) {
    fetch(`https://geo.api.gouv.fr/communes?lat=${lati}&lon=${longi}&fields=nom`)
        .then((response) => {
            return response.json();
        })
        .then((results) => {
            //console.log(results)

            API_CITY = results
            location.innerText = API_CITY[0].nom;
        })
}