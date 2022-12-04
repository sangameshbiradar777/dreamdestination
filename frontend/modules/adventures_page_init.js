import {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  addSorryMessageToDom,
  addNewAdventure,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  removeFilterPillAndUpdateDOM,
  removeAddNewAdventureBtnFunctionality,
  addNewAdventureBtnFunctionality,
} from "./adventures_page.js";

// Declaring global variable adventure
let adventures;
let city;

function pushNewAdventure(newAdventure) {
  adventures.push(newAdventure);
}

//Checks if filters are available in local storage and sets the value accordingly
// The structure of "filters" object is { duration : "6-10", category : [] }, which basically means duration is single-value filter and category is multi-value filter

let filters =
  getFiltersFromLocalStorage() !== null
    ? getFiltersFromLocalStorage()
    : { duration: "", category: [] };

// entry point (executed when DOM is loaded)
(async function () {
  // Fetches the City from URL query param (here : window.location.search is an in-built browser property that returns the query param from URL, example: http://localhost:8081/?city=bengaluru => window.location.search would return "?city=bengaluru")
  city = getCityFromURL(window.location.search);

  // Fetches the adventures for the particular city
  adventures = await fetchAdventures(city);

  // Applies filters on the adventures list
  let filteredAdventures = filterFunction(adventures, filters);

  // Check if the filteredAdventure contains any adventures
  // If it dosent contains any adventures show the sorry Message
  if (filteredAdventures.length) {
    // Updates the filtered adventures list to the DOM
    addAdventureToDOM(filteredAdventures, city);
  } else {
    // Show the sorry message
    addSorryMessageToDom();
  }

  // add new adventures when the button is clicked
  addNewAdventure(city);

  // Updates the DOM with filter pills if any
  generateFilterPillsAndUpdateDOM(filters);

  // removes the selected filter and updtaes DOM
  removeFilterPillAndUpdateDOM(adventures, filters, city);

  // If any filters are applied remove the add new adventure btn functionality
  if (filters.category.length || filters.duration) {
    console.log(filters.category, filters.duration);
    removeAddNewAdventureBtnFunctionality();
  }
})();

//executed when onChange() is triggered on duration filter dropdown
function selectDuration(event) {
  // TODO: MODULE_FILTERS
  // 1. Change the DOM to show the selected duration filter. Use the provided input event
  // 2. Invoke saveFiltersToLocalStorage here

  // Set the innerHTML of the data element to empty
  document.querySelector("#data").innerHTML = "";

  // extract the duration using event.target.value
  filters.duration = event.target.value;

  // save filters to local storage
  saveFiltersToLocalStorage(filters);

  // get filtered adventures according to duration
  const filteredAdventures = filterFunction(adventures, filters);

  // Check if the filteredAdventure contains any advntures
  // If it dosent contains any adventures show the sorry Message
  if (filteredAdventures.length) {
    // add the filtered adventures to dom
    addAdventureToDOM(filteredAdventures, city);
  } else {
    // Show the sorry message
    addSorryMessageToDom();
  }

  // Remove the add new adventure btn functionality
  removeAddNewAdventureBtnFunctionality();
}

//executed when clear button is clicked on duration filter dropdown
function clearDuration(event) {
  // TODO: MODULE_FILTERS
  // 1. Change the DOM to clear the Duration filter. Refer clearCategory() below
  // 2. Invoke saveFiltersToLocalStorage here

  // get the select options of duration filter
  const durationElement = document.querySelector("#duration-select");

  // set the selectedIndex of duration select options to 0
  durationElement.selectedIndex = 0;

  // set the innerHTML of the data element to empty
  document.querySelector("#data").innerHTML = "";

  // reset the duration of filter object
  filters.duration = "";

  // Add new adventure btn functionality
  addNewAdventureBtnFunctionality();

  // save filters to local storage
  saveFiltersToLocalStorage(filters);

  // add the adventures to dom
  addAdventureToDOM(adventures, city);
}

//executed when onChange() is triggered on category filter dropdown
function selectCategory(event) {
  document.getElementById("data").textContent = "";
  document.getElementById("category-list").textContent = "";

  let category = event.target.value;
  document.getElementById("category-select").selectedIndex = 0;

  filters["category"].push(category);
  filters["category"] = filters["category"].filter(onlyUnique);

  generateFilterPillsAndUpdateDOM(filters);
  let filteredAdventures = filterFunction(adventures, filters);

  // Check if the filteredAdventure contains any advntures
  // If it dosent contains any adventures show the sorry Message
  if (filteredAdventures.length) {
    // Add the filtered adventures to dom
    addAdventureToDOM(filteredAdventures, city);
  } else {
    // Show the sorry message
    addSorryMessageToDom();
  }

  //* Dont change the order, remove add new adventure btn functionality should be below add adventure to dom
  // Remove add new adventure btn functionality
  removeAddNewAdventureBtnFunctionality();

  // TODO: MODULE_FILTERS
  // 1. Invoke saveFiltersToLocalStorage here
  saveFiltersToLocalStorage(filters);
}

//executed when clear button is clicked on category filter dropdown
function clearCategory(event) {
  document.getElementById("data").textContent = "";
  document.getElementById("category-list").textContent = "";

  filters["category"] = [];
  let filteredAdventures = filterFunction(adventures, filters);
  addAdventureToDOM(filteredAdventures, city);

  // Add new adventure btn functionality
  addNewAdventureBtnFunctionality();

  // TODO: MODULE_FILTERS
  // 1. Invoke saveFiltersToLocalStorage here
  saveFiltersToLocalStorage(filters);
}

//helper function
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

//registering module based functions in the DOM in order for them to work
window.selectDuration = selectDuration;
window.selectCategory = selectCategory;
window.clearDuration = clearDuration;
window.clearCategory = clearCategory;

export { pushNewAdventure };
