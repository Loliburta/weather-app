import React, { useEffect, useState, useRef } from "react";
import { TimelineLite, Power3, TweenLite, gsap, timeline } from "gsap";
import { ReactComponent as Clouds } from "./assets/clouds.svg";
import { ReactComponent as ClearSky } from "./assets/clear-sky.svg";
import { ReactComponent as FewClouds } from "./assets/few-clouds.svg";
import { ReactComponent as Atmosphere } from "./assets/atmosphere.svg";
import { ReactComponent as Snow } from "./assets/snow.svg";
import { ReactComponent as Rain } from "./assets/rain.svg";
import { ReactComponent as Drizzle } from "./assets/drizzle.svg";
import { ReactComponent as Thunderstorm } from "./assets/thunderstorm.svg";

const api = {
  key: "0547d2585fd23e3154fcf7635e308295",
  base: "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/",
};

function App() {
  const [place, setPlace] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [weatherIcon, setWeatherIcon] = useState();
  const [newBackground, setNewBackground] = useState();

  const [forecastIcon1, setForecastIcon1] = useState();
  const [temp1Min, setTemp1Min] = useState();
  const [temp1Max, setTemp1Max] = useState();
  const [day1, setDay1] = useState();

  const [forecastIcon2, setForecastIcon2] = useState();
  const [temp2Min, setTemp2Min] = useState();
  const [temp2Max, setTemp2Max] = useState();
  const [day2, setDay2] = useState();

  const [forecastIcon3, setForecastIcon3] = useState();
  const [temp3Min, setTemp3Min] = useState();
  const [temp3Max, setTemp3Max] = useState();
  const [day3, setDay3] = useState();
  var tl = gsap.timeline();
  useEffect(() => {
    TweenLite.from(".search-box", {
      y: 30,
      opacity: 0,
      ease: Power3.easeOut,
      delay: 0.3,
    });
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa");
  }, []);
  const divRef = useRef();
  useEffect(() => {
    if (divRef.current != undefined && !tl.isActive()) {
      TweenLite.set(divRef.current, { visibility: "visible" });
      if (document.getElementsByClassName(".location") !== undefined) {
        tl.from(".location", {
          duration: 1.5,
          x: 200,
          autoAlpha: 0,
          ease: Power3.easeOut,
        });
      }
      if (document.getElementsByClassName(".date") !== undefined) {
        tl.from(
          ".date",
          {
            duration: 1.5,
            x: -200,
            autoAlpha: 0,
            ease: Power3.easeOut,
          },
          "-=1.5"
        );
      }
      if (document.getElementsByClassName(".main-icon") !== undefined) {
        tl.from(
          ".main-icon",
          {
            duration: 1.5,
            x: -200,
            autoAlpha: 0,
            ease: Power3.easeOut,
          },
          "-=1.5"
        );
      }

      console.log("animacja2");
    }
  }, [divRef.current, place]);
  if (document.getElementsByClassName(".location") !== undefined) {
    TweenLite.set(".location", { visibility: "visible" });
    TweenLite.set(".date", { visibility: "visible" });
    TweenLite.set(".main-icon", { visibility: "visible" });
  }

  const get_day = (_dt) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = new Date(_dt * 1000).getDay();
    return days[day];
  };

  const chooseIcon = (_id, setIcon) => {
    if (_id < 299) {
      console.log("Thunderstorm");
      setIcon(<Thunderstorm width="100px" fill="white" stroke="black" />);
    } else if (_id < 499) {
      console.log("Drizzle");
      setIcon(<Drizzle />);
    } else if (_id < 599) {
      console.log("Rain");
      setIcon(<Rain />);
    } else if (_id < 699) {
      console.log("Snow");
      setIcon(<Snow />);
    } else if (_id < 799) {
      console.log("Atmosphere");
      setIcon(<Atmosphere />);
    } else if (_id === 800) {
      console.log("Clear");
      setIcon(<ClearSky />);
    } else if (_id === 801) {
      console.log("FewClouds");
      setIcon(<FewClouds />);
    } else {
      console.log("Clouds");
      setIcon(<Clouds />);
    }
  };

  const search = (evt) => {
    if (evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setQuery("");
          try {
            setNewBackground(
              getBackgroud(
                result.main.temp,
                new Date().getUTCHours() + result.timezone / 3600
              )
            );
            chooseIcon(result.weather[0].id, setWeatherIcon);
            setPlace(result.name);
            setWeather(result);
            fetch(
              `${api.base}onecall?lat=${result.coord.lat}&lon=${result.coord.lon}&units=metric&appid=${api.key}`
            )
              .then((res) => res.json())
              .then((result) => {
                chooseIcon(result.daily[1].weather[0].id, setForecastIcon1);
                chooseIcon(result.daily[2].weather[0].id, setForecastIcon2);
                chooseIcon(result.daily[3].weather[0].id, setForecastIcon3);
                setTemp1Max(result.daily[1].temp.max);
                setTemp2Max(result.daily[2].temp.max);
                setTemp3Max(result.daily[3].temp.max);
                setTemp1Min(result.daily[1].temp.min);
                setTemp2Min(result.daily[2].temp.min);
                setTemp3Min(result.daily[3].temp.min);
                setDay1(get_day(result.daily[1].dt));
                setDay2(get_day(result.daily[2].dt));
                setDay3(get_day(result.daily[3].dt));
              });
          } catch (error) {
            console.error(error);
          }
        });
    }
  };

  const datebuilder = (_date) => {
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[_date.getDay()];
    let date = _date.getDate();
    let month = months[_date.getMonth()];
    let year = _date.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };
  const getBackgroud = (degrees, time) => {
    console.log(time);
    if (degrees < 5) {
      if (time > 20 || time < 5) {
        return "app night";
      }
      return "app";
    } else if (degrees < 15) {
      if (time > 20 || time < 5) {
        return "app night";
      }
      return "app normal";
    } else if (degrees < 30) {
      return "app warm";
    }
    return "app hot";
  };

  React.useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
  });
  if (windowWidth < 1025) {
    return (
      <div
        className={typeof newBackground != "undefined" ? newBackground : "app"}
      >
        <main>
          <div className="search-box" id="search-box">
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>

          {typeof weather.main != "undefined" ? (
            <div>
              <div className="location-box">
                <div className="location" ref={divRef}>
                  {weather.name}, {weather.sys.country}
                </div>
                <div className="date">{datebuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temperature" id="temperature">
                  <div className="main-forecast">
                    <span className="main-icon">{weatherIcon}</span>
                    <div className="test1">
                      <p className="weather-condition">
                        {weather.weather[0].description}
                      </p>
                      <p>Wind {weather.wind.speed}km/h</p>
                      <p>Humidity {weather.main.humidity}%</p>
                    </div>
                  </div>
                  <div className="main-temp">
                    {Math.round(weather.main.temp)}°C
                  </div>
                </div>
              </div>
              <div className="forecast">
                <div className="day-forecast">
                  <p>{day1}</p>
                  <p>{forecastIcon1}</p>
                  <div className="day-forecast-temps">
                    {Math.round(temp1Max)}°
                    <span className="min-temp">{Math.round(temp1Min)}°</span>
                  </div>
                </div>
                <div className="day-forecast">
                  <p>{day2}</p>
                  <p>{forecastIcon2}</p>
                  <div className="day-forecast-temps">
                    {Math.round(temp2Max)}°
                    <span className="min-temp">{Math.round(temp2Min)}°</span>
                  </div>
                </div>
                <div className="day-forecast">
                  <p>{day3}</p>
                  <p>{forecastIcon3}</p>
                  <div className="day-forecast-temps">
                    {Math.round(temp3Max)}°
                    <span className="min-temp"> {Math.round(temp3Min)}°</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </main>
      </div>
    );
  } else {
    return (
      <div className="desktop-background">
        <div
          className={
            typeof newBackground != "undefined" ? newBackground : "app"
          }
        >
          <div className="desktop-main">
            <div className="search-box" id="search-box">
              <input
                type="text"
                className="search-bar"
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                onKeyPress={search}
              />
            </div>

            {typeof weather.main != "undefined" ? (
              <div>
                <div className="location-box">
                  <div className="location" ref={divRef}>
                    {weather.name}, {weather.sys.country}
                  </div>
                  <div className="date">{datebuilder(new Date())}</div>
                </div>
                <div className="weather-box">
                  <div className="temperature">
                    <div className="main-forecast">
                      {weatherIcon}
                      <div className="test1">
                        <p className="weather-condition">
                          {weather.weather[0].description}
                        </p>
                        <p>Wind {weather.wind.speed}km/h</p>
                        <p>Humidity {weather.main.humidity}%</p>
                      </div>
                    </div>
                    <div className="main-temp">
                      {Math.round(weather.main.temp)}°C
                    </div>
                  </div>
                </div>
                <div className="forecast">
                  <div className="day-forecast">
                    <p>{day1}</p>
                    <p>{forecastIcon1}</p>
                    <div className="day-forecast-temps">
                      {Math.round(temp1Max)}°
                      <span className="min-temp"> {Math.round(temp1Min)}°</span>
                    </div>
                  </div>
                  <div className="day-forecast">
                    <p>{day2}</p>
                    <p>{forecastIcon2}</p>
                    <div className="day-forecast-temps">
                      {Math.round(temp2Max)}°
                      <span className="min-temp"> {Math.round(temp2Min)}°</span>
                    </div>
                  </div>
                  <div className="day-forecast">
                    <p>{day3}</p>
                    <p>{forecastIcon3}</p>
                    <div className="day-forecast-temps">
                      {Math.round(temp3Max)}°
                      <span className="min-temp"> {Math.round(temp3Min)}°</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
