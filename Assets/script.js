
var cityInput = $("#city")
var stateInput = $("#state")
var searchBtn = $("#search")
var clearBtn = $("#clear")
var cityBtns = $(".city-buttons")

var currentCity = $("#current-city")
var icon = $("#icon")
var currentTemp = $("#current-temp")
var currentWind = $("#current-wind")
var currentHumidity = $("#current-humidity")
var currentUVI = $("#current-uvi")

function getWeather(lat, lon) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat 
    + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=b9ec11f0d49180f28dafbc63cb0ffc2a";
    fetch(weatherApi)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            currentCity.text(localStorage.getItem("city") + ", " + localStorage.getItem("state") + " (" + moment.utc((data.current.dt+data.timezone_offset)*1000).format("MM/DD/YYYY, h:mm A") + ")");
            icon.attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
            icon.removeClass("hide");
            currentTemp.text("Temp: " + data.current.temp + "°F");
            currentWind.text("Wind Speed: " + data.current.wind_speed + " MPH");
            currentHumidity.text("Humidity: " + data.current.humidity + "%");
            currentUVI.text("UV Index: " + data.current.uvi);
            if (data.current.uvi >= 11) {
                currentUVI.css("background-color", "violet");
            } else if (data.current.uvi >= 8) {
                currentUVI.css("background-color", "red");
            } else if (data.current.uvi >=6) {
                currentUVI.css("background-color", "orange");
            } else if (data.current.uvi >=3) {
                currentUVI.css("background-color", "yellow");
            } else {
                currentUVI.css("background-color", "green");
            }
        });
}

function getCoordinates(city, state) {
    var geocodeApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ",US-" + state 
    + ",US&limit=5&appid=b9ec11f0d49180f28dafbc63cb0ffc2a";
    fetch(geocodeApi)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            var lattitude = Math.round(data[0].lat * 100)/100;
            var longitude = Math.round(data[0].lon * 100)/100;
            getWeather(lattitude,longitude);
        });
}

searchBtn.click(function(event) {
    event.preventDefault();
    // City name
    var rawCity = cityInput.val();
    var words = rawCity.split(" ");
    for (i=0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    var city = words.join(" ");
    // State abbreviation
    var state = stateInput.val().toUpperCase();
    localStorage.setItem("city", city)
    localStorage.setItem("state", state)
    getCoordinates(city, state);
    // Add to search history
    var cityBtn = $("<button>" + city + "</button>");
    cityBtn.data("city", city);
    cityBtn.data("state", state);
    cityBtn.attr("class", "city-button");
    cityBtns.prepend(cityBtn);
});

cityBtns.on("click", ".city-button", function() {
    var city = $(this).data("city");
    var state = $(this).data("state");
    localStorage.setItem("city", city)
    localStorage.setItem("state", state)
    getCoordinates(city, state);
});

clearBtn.click( function() {
    $(".city-button").remove();
})