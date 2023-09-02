const wrapper = document.querySelector(".wrapper");
inputPart = wrapper.querySelector(".input-part");
infoTxt = inputPart.querySelector(".info-txt");
inputField = inputPart.querySelector("input");
locationBtn = inputPart.querySelector("button");
weatherIcon = wrapper.querySelector(".weather-part img");
arrowBack = wrapper.querySelector("header i");

const apiKey = "f819aef21896a2e248ec0e3e6e3bea50";
let api;

inputField.addEventListener("keyup", (e) => {
  // if user pressed btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");

  //getting api response and returning it with parsing into js obj and in another
  // then function calling weatherDetails function with passing api result as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    //let's get required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    // using custom icon according to the id which api return us
    if (id == 800) {
      weatherIcon.src = "Images/clear.svg";
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = "Images/storm.svg";
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = "Images/snow.svg";
    } else if (id >= 701 && id <= 782) {
      weatherIcon.src = "Images/haze.svg";
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = "Images/cloud.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = "Images/rain.svg";
    }

    //let's pass these value to a particular html element
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
}
