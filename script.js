const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide');

// Function to fetch weather data based on city name
function getWeather() {
    const APIKey = '596c62eb6020886e1905d9f1aabed724';
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            if (json.cod === '404') {
                cityHide.textContent = city;
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                return;
            }

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            if (cityHide.textContent === city) {
                return;
            } else {
                cityHide.textContent = city;
                container.style.height = '555px';
                container.classList.add('active');
                weatherBox.classList.add('active');
                weatherDetails.classList.add('active');
                error404.classList.remove('active');

                setTimeout(() => {
                    container.classList.remove('active');
                }, 2500);

                switch (json.weather[0].main) {
                    case 'Clear':
                        image.src = 'images/clear.png';
                        break;
                    case 'Rain':
                        image.src = 'images/rain.png';
                        break;
                    case 'Snow':
                        image.src = 'images/snow.png';
                        break;
                    case 'Clouds':
                        image.src = 'images/cloud.png';
                        break;
                    case 'Mist':
                    case 'Haze':
                        image.src = 'images/mist.png';
                        break;
                    default:
                        image.src = 'images/cloud.png';
                }

                temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

                const infoWeather = document.querySelector('.info-weather');
                const infoHumidity = document.querySelector('.info-humidity');
                const infoWind = document.querySelector('.info-wind');

                if (infoWeather && infoHumidity && infoWind) {
                    const elCloneInfoWeather = infoWeather.cloneNode(true);
                    const elCloneInfoHumidity = infoHumidity.cloneNode(true);
                    const elCloneInfoWind = infoWind.cloneNode(true);

                    elCloneInfoWeather.id = 'clone-info-weather';
                    elCloneInfoWeather.classList.add('active-clone');

                    elCloneInfoHumidity.id = 'clone-info-humidity';
                    elCloneInfoHumidity.classList.add('active-clone');

                    elCloneInfoWind.id = 'clone-info-wind';
                    elCloneInfoWind.classList.add('active-clone');

                    setTimeout(() => {
                        infoWeather.insertAdjacentElement("afterend", elCloneInfoWeather);
                        infoHumidity.insertAdjacentElement("afterend", elCloneInfoHumidity);
                        infoWind.insertAdjacentElement("afterend", elCloneInfoWind);
                    }, 2200);

                    const cloneInfoWeather = document.querySelectorAll('.info-weather.active-clone');
                    const totalCloneInfoWeather = cloneInfoWeather.length;
                    const cloneInfoWeatherFirst = cloneInfoWeather[0];

                    const cloneInfoHumidity = document.querySelectorAll('.info-humidity.active-clone');
                    const cloneInfoHumidityFirst = cloneInfoHumidity[0];

                    const cloneInfoWind = document.querySelectorAll('.info-wind.active-clone');
                    const cloneInfoWindFirst = cloneInfoWind[0];

                    if (totalCloneInfoWeather > 0) {
                        cloneInfoWeatherFirst.classList.remove('active-clone');
                        cloneInfoHumidityFirst.classList.remove('active-clone');
                        cloneInfoWindFirst.classList.remove('active-clone');

                        setTimeout(() => {
                            cloneInfoWeatherFirst.remove();
                            cloneInfoHumidityFirst.remove();
                            cloneInfoWindFirst.remove();
                        }, 2200);
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Optionally handle the error, e.g., show an error message
        });
}

// Function to start voice recognition
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech Recognition API is not supported in this browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = event => {
        const cityName = event.results[0][0].transcript;
        document.querySelector('.search-box input').value = cityName;
        getWeather();
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = event => {
        console.error('Speech recognition error', event.error);
        alert('There was an error with the speech recognition. Please try again.');
    };
}

// Attach event listener to the voice command button
const voiceCommandButton = document.querySelector('.search-box button.bx-microphone');
if (voiceCommandButton) {
    voiceCommandButton.addEventListener('click', startVoiceRecognition);
}

// About button and modal functionality
const aboutButton = document.querySelector('.about-button');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-button');

aboutButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
