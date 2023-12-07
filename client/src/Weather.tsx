import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import styles from "./Weather.module.css"; // Temp css until Weather one is implemented

interface WeatherData {
  main: {
    temp: number;
  };

  weather: {
    0: { id: number; main: string[]; description: string[]; icon: string[] };
    length: 1;
  };
}

/**
 * A simple React component that creates the content for the weather service page
 * @component
 *
 * @returns {JSX.Element} React component
 */
const WeatherBody = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = "ede7f85b113d45a494175eba25470ebf";
        const city = "Kingston";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (response.ok) {
          setWeather(data);
        } else {
          setError("Failed to fetch weather data");
        }
      } catch (error) {
        setError("An error occurred while fetching weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (!weather) {
    return null;
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const temperature = weather.main.temp;
  const weatherDescription = weather.weather[0].main;
  const weatherImageId = weather.weather[0].icon;

  let weatherImage = `https://openweathermap.org/img/wn/${weatherImageId}@2x.png`;

  let drinkRec;

  // Handling for depending on temperature, what drink to recommend
  if (temperature < 55) {
    drinkRec = "It's chilly today. Try one of our hot brewed teas!";
  } else if (temperature > 85) {
    drinkRec =
      "It's a bit warm today. Cool down with one of our ice blended drinks!";
  } else {
    drinkRec = "Weather looks great today. Try one of our classic milk teas!";
  }

  return (
    <div>
      <h2>Current Weather in College Station, TX</h2>
      <h3>Temperature: {temperature}°F</h3>
      <h3>Description: {weatherDescription}</h3>
      <img src={weatherImage} alt="Weather" />
      <br></br>
      <h3>{drinkRec}</h3>
      <br></br>
      <Link to="/">
        <button className={styles.returnButton}>Return</button>
      </Link>
    </div>
  );
};

/**
 * A simple React component that creates the weather page
 * @component
 *
 * @returns {JSX.Element} React component
 */
function Weather() {
  useEffect(() => {
    document.body.classList.add(styles.weather_body);
    return () => {
      document.body.classList.remove(styles.weather_body);
    };
  }, []);
  return (
    <div className={styles.weather}>
      <WeatherBody />
    </div>
  );
}

export default Weather;
