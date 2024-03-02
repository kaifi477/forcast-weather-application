const temp = document.getElementById("temp");
date = document.getElementById("date-time");
currentLocation = document.getElementById("location");
(condition = document.getElementById("condition")),
  (rain = document.getElementById("rain")),
  (mainIcon = document.getElementById("icon"));
(uvIndex = document.querySelector(".uv-index")),
  (uvText = document.querySelector(".uv-text")),
  (windSpeed = document.querySelector(".wind-speed")),
  (Sunrise = document.querySelector(".sunrise")),
  (Sunset = document.querySelector(".sunset")),
  (humidity = document.querySelector(".humidity")),
  (visibility = document.querySelector(".visibility")),
  (humidityStatus = document.querySelector(".humidity-status")),
  (airQuality = document.querySelector(".air-quality")),
  (airQualityStatus = document.querySelector(".air-quality-status")),
  (visibilityStatus = document.querySelector(".visibility-status")),
  (weatherCards = document.querySelector("#weather-cards")),
  (celciusBtn = document.querySelector(".calcius")),
  (fahrenheitBtn = document.querySelector(".fahrenheit")),
  (hourlyBtn = document.querySelector(".hourly")),
  (weekBtn = document.querySelector(".week")),
  (tempUnit = document.querySelectorAll(".temp-unit")),
  searchForm =document.querySelector("#search");
  search =document.querySelector("#query");

let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "week";

// Update Date Time

function getDateTime() {
  let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // 12 hour Format
  hour = hour % 12;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }
  let dayString = days[now.getDay()];
  return `${dayString},${hour}:${minute}`;
}
date.innerText = getDateTime();
// update time every second
setInterval(() => {
  date.innerText = getDateTime();
}, 1000);

// function to get public ip with fetch

function getPublicIp() {
  fetch("https://geolocation-db.com/json/", {
    method: "Get",
  })
    .then((response) => response.json())
    .then((data) => {
    //   console.log(data);
      currentCity = data.city;
      getWeatherData(data.city, currentUnit, hourlyorWeek);
    });
}
getPublicIp();

// function to get weather data

function getWeatherData(city, unit, hourlyorWeek) {
  const apiKey = "FZ6A7DB2M6B9UCPEYRC9SVDX8";
  fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      let today = data.currentConditions;
      if (unit === "c") {
        temp.innerText = today.temp;
      } else {
        temp.innerText = celciusToFahrenheit(today.temp);
      }
      currentLocation.innerText = data.resolvedAddress;
      condition.innerText = today.conditions;
      rain.innerText = "Prec - " + today.precip + "%";
      uvIndex.innerText = today.uvindex;
      windSpeed.innerText = today.windspeed;
      humidity.innerText = today.humidity + "%";
      visibility.innerText = today.visibility;
      airQuality.innerText = today.winddir;
      measureUvIndex(today.uvindex);
      updateHumidityStatus(today.humidity);
      updateVisibilityStatus(today.visibility);
      updateAirQualityStatus(today.winddir);
      Sunrise.innerText = convertTimeTo12HourFormat(today.sunrise);
      Sunset.innerText = convertTimeTo12HourFormat(today.sunset);
      mainIcon.src = getIcon(today.icon);
      changeBackground(today.icon);
      if (hourlyorWeek === "hourly") {
        updateForecast(data.days[0].hours, unit, "day");
      } else {
        updateForecast(data.days, unit, "week");
      }
    })
    .catch((err) => {
      alert("City not found in database");
    });
}
// convert celcius to fahrenheit

function celciusToFahrenheit(temp) {
  return ((temp * 9) / 5 + 32).toFixed(1);
}
// function to get uv index status

function measureUvIndex(uvindex) {
  if (uvindex < 2) {
    uvText.innerText = "Low";
  } else if (uvindex < 5) {
    uvText.innerText = "Moderate";
  } else if (uvindex < 7) {
    uvText.innerText = "High";
  } else if (uvindex < 10) {
    uvText.innerText = "Very High";
  } else {
    uvText.innerText = "Extreme";
  }
}
function updateHumidityStatus(humidity) {
  if (humidity < 30) {
    humidityStatus.innerText = "Low";
  } else if (humidity < 60) {
    humidityStatus.innerText = "Moderate";
  } else {
    humidityStatus.innerText = "High";
  }
}
function updateVisibilityStatus(visibility) {
  if (visibility < 0.3) {
    visibilityStatus.innerText = "Dense Fog";
  } else if (visibility < 0.16) {
    visibilityStatus.innerText = "Moderate Fog";
  } else if (visibility < 0.35) {
    visibilityStatus.innerText = "Light Fog";
  } else if (visibility < 1.13) {
    visibilityStatus.innerText = "Very Light Fog";
  } else if (visibility < 2.16) {
    visibilityStatus.innerText = "Light Mist";
  } else if (visibility < 5.4) {
    visibilityStatus.innerText = "Very Light Mist";
  } else if (visibility < 10.8) {
    visibilityStatus.innerText = "Clear Air";
  } else {
    visibilityStatus.innerText = "Very Clear Air";
  }
}
function updateAirQualityStatus(airQuality) {
  if (airQuality < 50) {
    airQualityStatus.innerText = "Good";
  } else if (airQuality < 100) {
    airQualityStatus.innerText = "Moderate";
  } else if (airQuality < 150) {
    airQualityStatus.innerText = "Unhealthy for sensitive Groups";
  } else if (airQuality < 200) {
    airQualityStatus.innerText = "Unhealthy";
  } else if (airQuality < 250) {
    airQualityStatus.innerText = "Very Unhealthy";
  } else {
    airQualityStatus.innerText = "Hazardous";
  }
}
function convertTimeTo12HourFormat(time) {
  let hour = time.split(":")[0];
  let minute = time.split(":")[1];
  let ampm = hour >= 12 ? "pm" : "am";
  hour = hour % 12;
  hour = hour ? hour : 12; // the zero hour should be 12
  hour = hour < 10 ? "0" + hour : hour;
  //add prefix zero if less then 10
  minute = minute < 10 ? "0" + minute : minute;
  let strTime = hour + ":" + minute + " " + ampm;
  return strTime;
}
function getIcon(condition) {
  if (condition === "partly-cloudy-day") {
    return "./cloudy.png";
  } else if (condition === "partly-cloudy-night") {
    return "./moon.png";
  } else if (condition === "rain") {
    return "./rain.png";
  } else if (condition === "clear-day") {
    return "./clear-sky.png";
  } else if (condition === "clear-night") {
    return "./moon.png";
  } else {
    return "./clear-sky.png";
  }
}
function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}

function getHour(time) {
  let hour = time.split(":")[0];
  let min = time.split(":")[1];
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${min} PM`;
  } else {
    return `${hour}:${min} AM`;
  }
}

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let day = 0;
  let numCards = 0;
  // 24 cards if hourly weather and 7 for weakly
  if (type === "day") {
    numCards = 24;
  } else {
    numCards = 7;
  }
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    // hour if hourly time and day name if weekly
    let dayName = ""; // Define dayName variable
    if (type === "week") {
      dayName = getDayName(data[day].datetime);
    } else {
      dayName = getHour(data[day].datetime);
    }

    let dayTemp = data[day].temp;
    if (unit === "f") {
      dayTemp = celciusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = "°C";
    if (unit === "f") {
      tempUnit = "°F";
    }
    card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
          <img src="${iconSrc}" alt="">
        </div>
        <div class="day-temp">
          <h2 class="temp">${dayTemp}</h2>
          <span class="temp-units">${tempUnit}</span>
        </div>
      `;

    weatherCards.appendChild(card);
    day++;
  }
}
function changeBackground(condition) {
  const body = document.querySelector("body");
  let bg = "";
  if (condition === "partly-cloudy-day") {
    bg = "./partly-cloudy-day.jpg";
  } else if (condition === "partly-cloudy-night") {
    bg = "./partly-cloudy-night.jpg";
  } else if (condition === "rain") {
    bg = "./rain.jpg";
  } else if (condition === "clear-day") {
    bg = "./clear-sky.jpg";
  } else if (condition === "clear-night") {
    bg = "./night.jpg";
  } else {
    bg = "./clear-sky.jpg";
  }
  body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${bg})`;
}
fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    {
      tempUnit.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;
      });
      if (unit === "c") {
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      } else {
        celciusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
      }
      // call get weather after change unit
      getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
  }
}
hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit) {
  if (hourlyorWeek !== unit) {
    hourlyorWeek = unit;
    if (unit === "hourly") {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    } else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    // update weather on time change
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let location =search.value;
    if(location){
        currentCity =location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
})

// lets create the cities array which we want to suggest or we can use any

cities =[
    "Bijnor",
    "Utrakhand",
    "Delhi",
    "Chandigarh",
    "Himachal",
    "Agra",
    "Andheri",
    "New York",
    "Dubai",
    "United Kingdom",
    "Uttar Pradesh ",
    "mumbai",
];
var currentFocus;
// adding eventListener on search input
search.addEventListener('input', function(e){
    removeSuggestions();
    var a,
    b,
    i,
    val =this.value;
    // if there is nothing search input do nothing
    if(!val){
        return false;
    }
    currentFocus =1;

// creating a ul with a id suggestion
    a=document.createElement("ul");
    a.setAttribute("id","suggestions");
    // append the ul to parent which is search form
    this.parentNode.appendChild(a);

    // adding li's with matching search suggestions

    for(i=0;i<cities.length;i++)
{
    // check if items start with letters which are in input

    if(cities[i].substr(0,val.length).toUpperCase()==val.toUpperCase()){
        // if any suggestion matching then create li
        b = document.createElement('li');
        // adding content li
        // strong to make the matching letters bold
        b.innerHTML="<strong>" +cities[i].substr(0,val.length) +"</strong>"
        b.innerHTML+=cities[i].substr(val.length);
        // input field to hold the suggestion value
        b.innerHTML += "<input type='hidden' value='"+cities[i] +"'>";

        b.addEventListener('click', function(e){
            // on click set the search input value with the clicked suggestion value
            search.value = this.getElementsByTagName('input')[0].value;
            // remove the suggestion list
            removeSuggestions()
        });
        
// append suggestion li to ul 
        a.appendChild(b);
    }
}
})
// it's working but every new suggestion is coming over prev  
// lets remove prev suggestion then add new

function removeSuggestions(){
    // select the ul which is being adding on search input
    var x =document.getElementById('suggestion');
    // if x exists remove it
    if(x)x.parentNode.removeChild(x);
}
// lets add up and down key functionality to select a suggestion

search.addEventListener('input', function(e){
    removeSuggestions();
    var a,
    b,
    i,
    val =this.value;
    // if there is nothing search input do nothing
    if(!val){
        return false;
    }
    currentFocus = 1;

    // creating a ul with a id suggestions
    a=document.createElement("ul");
    a.setAttribute("id","suggestions");
    // append the ul to parent which is search form
    this.parentNode.appendChild(a);

    // adding li's with matching search suggestions

    for(i=0;i<cities.length;i++) {
        // check if items start with letters which are in input

        if(cities[i].substr(0,val.length).toUpperCase()==val.toUpperCase()){
            // if any suggestion matching then create li
            b = document.createElement('li');
            // adding content li
            // strong to make the matching letters bold
            b.innerHTML="<strong>" +cities[i].substr(0,val.length) +"</strong>"
            b.innerHTML+=cities[i].substr(val.length);
            // input field to hold the suggestion value
            b.innerHTML += "<input type='hidden' value='"+cities[i] +"'>";

            b.addEventListener('click', function(e){
                // on click set the search input value with the clicked suggestion value
                search.value = this.getElementsByTagName('input')[0].value;
                // remove the suggestion list
                removeSuggestions()
            });

            // append suggestion li to ul 
            a.appendChild(b);
        }
    }
});

function removeSuggestions(){
    // select the ul which is being adding on search input
    var x =document.getElementById('suggestions');
    // if x exists remove it
    if(x) x.parentNode.removeChild(x);
}

search.addEventListener('keydown', function(e){
    var x = document.getElementById('suggestions');
    // select all the li elements of suggestion ul
    if(x) x = x.getElementsByTagName('li');

    if(e.keyCode == 40){
        // if key code is down button 
        currentFocus++;
        // let's create a function to add an active suggestion
        addActive(x);
    }
    else if(e.keyCode == 38){
        // if key code is up button
        currentFocus--;
        addActive(x);
    }
    if(e.keyCode == 13){
        // if enter is pressed add the currently selected suggestion in input field
        e.preventDefault();
        // if any suggestion is selected, click it
        if(x) x[currentFocus].click();
    }
});


function addActive(x){
    // if there is no suggestion return as it is

    if(!x)return false;
    removeActive(x);
    // if current focus is more than the length of suggestion arrays make it a
    if(currentFocus >= x.length) currentFocus=0;
    // if its less then a make it last suggestion equals
    if(currentFocus<0) currentFocus=x.length -1;

    // adding active class on focused li
    x[currentFocus].classList.add('active');

}

// its working but we need to remove previously actived suggestion
function removeActive(x){
    for(var i=0; i<x.length; i++){
        x[i].classList.remove('active');
    }
}
// let searchBtn = document.querySelector('.search-btn');
// searchBtn.addEventListener('click', function() {
//     search.value = ''; // Clearing the value of the input field
// });
