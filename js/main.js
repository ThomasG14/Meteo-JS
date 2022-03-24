
const APIKEY = '8913965d97341b8f7136dad04d180979';
let API_WEATHER;
let API_CITY;

//Arrière plan de l'app
const background = document.querySelector('.app-container');
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
//Indice UV
const iuv = document.querySelector('.uv');

const hills = document.querySelector('.hills');

if(navigator.geolocation)
{
    navigator.geolocation.getCurrentPosition(position => 
    {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        CallAPIWeather(long, lat);
        CallAPICity(long, lat);
    }, 
    () => 
    {
        alert(`Activez la localisation pour faire fonctionner l'appli`)
    })
}

//Appel de L'api pour la météo
function CallAPIWeather(long, lat)
{
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${APIKEY}`)
    .then((reponse) =>
    {
        return reponse.json();
    })
    .then((data) => 
    {
        console.log(data);

        API_WEATHER = data;

        let heureNow = new Date().getHours()
        let MinuteNow = new Date().getMinutes();
        let uv = API_WEATHER.current.uvi;


        //Icone du temp dynamique
        if(heureNow >= 6 && heureNow < 21)
        {
            imgIcon.src = `img/jour/${API_WEATHER.current.weather[0].icon}.svg`
            background.style.backgroundColor='#5094ab';
            hills.src = `img/bg-day.png`
        }
        else
        {
            imgIcon.src = `img/nuit/${API_WEATHER.current.weather[0].icon}.svg`
            background.style.backgroundColor='#0f0f24';
            hills.src = 'img/bg-night.png'
        }

        //Le temp
        temps.innerText = API_WEATHER.current.weather[0].description;
        //La température
        temperature.innerText = `${Math.trunc(API_WEATHER.current.temp)}°`;
        //L'humiditer
        humidity.innerHTML = `${Math.trunc(API_WEATHER.current.humidity)}%`


        //echelle d'indice uv
        if(uv <= 2)
        {
            iuv.innerText = `faible`;
        }
        else if(uv > 2 && uv <= 5)
        {
            iuv.innerText = `moyen`;
        }
        else if(uv > 5 && uv <= 7)
        {
            iuv.innerText = `élevé`;
        }
        else if(uv > 7 && uv <= 10)
        {
            iuv.innerText = `Très élevé`;
        }
        else
        {
            iuv.innerText = `extrème`;
        }

    })
}

//Appel de l'api pour la localisation à partir de la longitude et de la lattitude
function CallAPICity(longi, lati)
{
    fetch(`https://geo.api.gouv.fr/communes?lat=${lati}&lon=${longi}&fields=nom`)
    .then((response) =>
    {
        return response.json();
    })
    .then((results) => 
    {        
        console.log(results)
        API_CITY = results
        location.innerText = API_CITY[0].nom;      
    })
}