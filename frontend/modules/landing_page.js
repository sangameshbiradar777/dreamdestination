import config from "../conf/index.js";

async function init() {
  // get data element from the dom
  const dataElement = document.getElementById("data");

  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  // Set the innerHTML of the data element to empty
  dataElement.innerHTML = "";

  // populate the dom with cities
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data

  // Use the backendEndPoint variable present in the config object and create a correct URL
  const URL = `${config.backendEndpoint}/cities`;

  // to catch any errors that might happen while doing a network call wrap all the code in try catch block
  try {
    // Use the fetch function to get the data from URL created
    const citiesResponse = await fetch(URL);

    // check if status of cities response is between 200 and 299
    if (citiesResponse.ok) {
      // citiesResponse now has the response object, convert it to JSON an return it
      let cities = await citiesResponse.json();
      return cities;
    }

    // if its status is not between 200 and 299 throw a new Error
    else {
      const message = `⚡⚡An error occurred with a status code of ${citiesResponse.status}⚡⚡`;
      throw new Error(message);
    }
  } catch (error) {
    // catch the errors that may happen during a fetch operation and return null
    return null;
  }
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM

  // create a col element which will be a bootstrap column
  const colElement = document.createElement("div");

  // set the classnames of cardElement
  colElement.setAttribute("class", "col-md-6 col-lg-4 col-xl-3 mt-3");

  // create the HTML required for col element
  const tileHTML = `
    <div class='tile-container'>
      <div class='tile'>
          <a id=${id} href='pages/adventures/?city=${id}'>
            <div class='tile-img-container'>
              <img src="${image}" alt='${city} image'>
            </div>
            <div class='tile-text'>
                <h2>${city}</h2>
                <span>${description}</span>
            </div>
          </a>
      <div>
    <div>
  `;

  colElement.innerHTML = tileHTML;

  // get the data element from the dom
  const dataElement = document.getElementById("data");

  // append colElement to dataElement
  dataElement.append(colElement);
}

export { init, fetchCities, addCityToDOM };
