navigator.geolocation.getCurrentPosition(success => {
  let longitude = success.coords.longitude;
  let latitude = success.coords.latitude;
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code,temperature_2m,precipitation,is_day,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=weather_code,temperature_2m,rain,cloud_cover,wind_speed_80m,wind_direction_80m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum&timezone=auto`;
  fetch(url)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((rep) => {
      console.log(rep);
      winSpeed(rep.current.wind_speed_10m);
      compass(rep.current.wind_direction_10m);
      WaetherWeekIncrement(rep.daily);
      currenWeekTemp(rep.current);
      addPictoWeather(rep.current);
      carrouselHours(rep.hourly);
      imgBackground(rep.current.weather_code);
      dayNigthMoove(rep.current.is_day)
    });
    let urlCommune = `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=code,nom,codesPostaux,surface,population,centre,contour`
    fetch(urlCommune)
    .then(res=>{
      return res.json()
    })
    .then(rep=>{
      console.log(rep[0]);
      addVille(rep[0].nom,rep[0].code)
    })
});

/**
 * Function qui affiche l'heure
 */
function currentHours() {
  const hours = document.getElementById("hours");
  const date = document.getElementById("date");
  let now = new Date();
  let year = now.getFullYear();
  let month = ("0" + (now.getMonth() + 1)).slice(-2);
  let day = ("0" + now.getDate()).slice(-2);
  let heure = ("0" + now.getHours()).slice(-2);
  let minute = ("0" + now.getMinutes()).slice(-2);
  let seconde = ("0" + now.getSeconds()).slice(-2);
  date.innerHTML = `<h2 class="date width-100 text-center" id="date">${day}/${month}/${year}</h2>`;
  hours.innerHTML = `<h3 id="hours width-100 text-center" id="hours">${heure}:${minute}:${seconde}</h3>`;
  requestAnimationFrame(currentHours);
}
currentHours();
/**
 * variable qui reccupere les classes
 */
let speed = document.getElementById("windSpeed");
let weekIncrement = document.querySelector(".weather-week");
let tempWeek = document.getElementById("TempWeek");
let currentTemp = document.getElementById("currentTemp");
let temp = document.querySelector(".current-temp");
let currentPicto = document.querySelector(".current-picto");
let hoursWeather = document.querySelector(".hours-weather");
let background = document.querySelector(".background");
let ville = document.querySelector('.rectangle-empty')
let dayNigth = document.querySelector('.day-night')
/**
 * renvoi une string selon la valeur des données
 * @param {num} d 
 * @returns string
 */
function weatherCode (d) {
  if (d === 0) {
    return "sun"
  } else if (d >= 1 && d <= 3) {
    return "suncloud"
  } else if (d >= 4 && d <= 48) {
    return "cloud";
  } else if (d >= 49 && d <= 67) {
    return "rain";
  } else if (d >= 68 && d <= 79) {
    return "snow";
  } else {
    return "thunder";
  }
}
/**
 * fonction qui me donne la vitesse du vent
 * @param {array} donnee
 */
function winSpeed(donnee) {
  speed.innerHTML = `<p class="bold text-center width-100" id="windSpeed">${donnee} km / heure</p>`;
}
/**
 * fonction qui tourne la fleche selon la valeur qui recoit
 * @param {num} donnee 
 */
function compass(donnee) {
  let arrow = document.getElementById("arrow");
  arrow.style.transform = `translate(-50%, -50%) rotate(${donnee}deg) `;
}
/**
 * fonction qui incremente la div sur 7 jours
 * @param {array} donnee
 */
function WaetherWeekIncrement(donnees) {
  for (let i = 1; i < 7; i++) {
    let picto = weatherCode(donnees.weather_code[i]);
    let date = donnees.time[i];
    let mini = donnees.temperature_2m_min[i];
    let max = donnees.temperature_2m_max[i];
    weekIncrement.innerHTML += `<div class="slide-content box flex item-center">
      <p class="width-100 text-center bold"> ${date}</p>
      <span class="mini-picto-weather mini-picto-weather-${picto} margin-auto" id="weather-week-picto"></span>
      <p class="width-100 text-center bold" id="TempWeek">max ${max}°</p>
      <p class="width-100 text-center font-min color-text bold">min ${mini}°</p>
    </div>
`;
  }
}
/**
 * fonction qui recoit la temperature actuelle
 * @param {number} donnee
 */
function currenWeekTemp(donnee) {
  currentTemp.innerHTML = `<h2 class="width-100 text-center bold" id="currentTemp">${donnee.temperature_2m}°</h2>`;
}
/**
 * fonction qui donne une valeur de temperature et met le picto en fonction
 * @param {num} donnee
 */
function addPictoWeather(donnee) {
  let picto = "";
  let description = "";
  if (donnee.weather_code === 0) {
    picto = "sun";
    description = "grans soleil";
  } else if (donnee.weather_code >= 1 && donnee.weather_code <= 3) {
    picto = "sunny";
    description = "Partielement couvert";
  } else if (donnee.weather_code >= 4 && donnee.weather_code <= 48) {
    picto = "cloud";
    description = "brouillard";
  } else if (donnee.weather_code >= 49 && donnee.weather_code <= 67) {
    picto = "rain";
    description = "pluvieux";
  } else if (donnee.weather_code >= 68 && donnee.weather_code <= 79) {
    picto = "snow";
    description = "il neige";
  } else {
    picto = "storm";
    description = "orageux";
  }
  temp.innerHTML = `<h3 class="width-100 text-center bold current-temp">${description}</h3>`;
  currentPicto.innerHTML = `<span class="picto-weather picto-weather-${picto} current-picto"></span>`;
}
/**
 * fonction qui rempli est duplique les cartes du carrousel
 * @param {array} donnees
 */
function carrouselHours(donnees) {
  for (let i = 0; i <= 24; i++) {
    let hours = [i];
    let rain = donnees.rain[i];
    let temperature = donnees.temperature_2m[i];
    hoursWeather.innerHTML += `<div class="slide item-center">
        <div class="slide-content box flex item-center">
          <p class="width-100 text-center bold"><img src="public/img/thermometer.png" alt="">${temperature}</p>
          <p class="width-100 bold text-center"><img src="public/img/umbrella.png">  ${rain}</p>
          <p class="width-100 text-center color-text font-min bold">${hours}h00</p>
        </div>`;
  }
}
/**
 * fonction qui change le picto selon la valeur donnée
 * @param {num} donnees 
 */
function imgBackground(donnees) {
  background.innerHTML = `<img src="./public/img/${weatherCode(donnees)}.jpg" alt="" />`;
}
/**
 * fonction qui ajoute la ville et le code postale
 * @param {string} donnee1 
 * @param {string} donnee2 
 */
function addVille(donnee1,donnee2){
  ville.innerHTML = `<p class="item-center">${donnee1} (${donnee2})</p>`
}
/**
 * fonction qui change la classe soleil ou lune selon le jour ou la nuit
 * @param {num} donnee 
 */
function dayNigthMoove(donnee) {
  if(donnee===1){
    dayNigth.innerHTML = `<span class="picto-daynight picto-daynight-sun"></span>`
  }else{
    dayNigth.innerHTML = `<span class="picto-daynight picto-daynight-moon"></span>`
    background.innerHTML = `<img src="./public/img/night.jpg" alt=""></img>`
  }
}
