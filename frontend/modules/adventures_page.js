import config from "../conf/index.js";
import imageURL from "../src/images/image.js";
import { pushNewAdventure } from "./adventures_page_init.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it

  // use the split method to split the string based on the equal sign
  // access the city which will be present at index 1 of the array
  const city = search.split("=")[1];
  return city;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data

  // create a URL from where the adventure details is served
  const URL = `${config.backendEndpoint}/adventures/?city=${city}`;

  // sorround the code which makes network call in try and catch block
  try {
    // fetch the adventure details using the fetch API
    const adventuresResponse = await fetch(URL);

    // check if the status of response object is ok
    if (adventuresResponse.ok) {
      // convert the response object to json object and return it
      const adventures = await adventuresResponse.json();
      return adventures;
    }

    // else throw a new error with the status code
    else {
      const message = `⚡⚡An error occurred with a status code of ${adventuresResponse.status}⚡⚡`;
      throw new Error(message);
    }
  } catch (err) {
    // catch any errors that may happed during a network call made using fetch
    console.log(err.message);
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures, city) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM

  // fetch the data element from the dom where col element need to be inserted
  const dataElement = document.querySelector("#data");

  // set the innerHTML of the dataElement to empty
  dataElement.innerHTML = "";

  // loop through each of the adventures and add all of then to DOM
  adventures.forEach((adventure) => {
    // create a colElement which acts as a bootstrap column
    const colElement = document.createElement("div");

    // set the class attribute on the col element
    colElement.setAttribute("class", "col-md-6 col-lg-3 mt-3");

    // get the innerHTML of colElement to from getCardHTML
    colElement.innerHTML = getCardHTML(adventure);

    // append the calElement to dataElement
    dataElement.append(colElement);
  });

  //* EXTRA FEATURE
  // Create a div to add the add new adventure btn at the end off all adventure
  const addNewAdventureElement = document.createElement("div");

  // Set the necessary attributes to the element
  addNewAdventureElement.setAttribute(
    "class",
    "add-adventure add-adventure-secondary d-none"
  );

  // Set the innerHTML of the add new adventure element
  addNewAdventureElement.innerHTML = `
    <button class="btn btn-outline-warning add-adventure-btn">
      Add new adventure
    </button>
  `;

  // Append the add new adventure element to data element
  dataElement.append(addNewAdventureElement);

  // Add the add new adventure btn functionality
  addNewAdventure(city, true);
}

// Add Only single adventure to DOM
function addSingleAdventureToDom(adventure) {
  // fetch the data element from the dom where col element need to be inserted
  const dataElement = document.querySelector("#data");

  // create a colElement which acts as a bootstrap column
  const colElement = document.createElement("div");

  // set the class attribute on the col element
  colElement.setAttribute("class", "col-md-6 col-lg-3 mt-3");

  // get the innerHTML of colElement to from getCardHTML
  colElement.innerHTML = getCardHTML(adventure);

  // Get the add adventure secondary element from dom
  const btnAddAdventurePrimary = document.querySelector(
    ".add-adventure-primary .add-adventure-btn"
  );
  const btnAddAdventureSecondary = document.querySelector(
    ".add-adventure-secondary .add-adventure-btn"
  );

  // Get the children length of dataelement
  const dataElementLength = dataElement.children.length;

  // Insert the new adventue before the btn add adventure
  dataElement.insertBefore(
    colElement,
    dataElement.children[dataElementLength - 1]
  );

  // Set the innerHTMl of the add adventure btn to initial
  btnAddAdventurePrimary.innerHTML = "Add new adventure";
  btnAddAdventureSecondary.innerHTML = "Add new adventure";
}

//* HELPER
// Return the card HTML
function getCardHTML(adventure) {
  return `
    <div class='activity-card'>
      <div class='category-banner'>${adventure.category}</div>
      <a id="${adventure.id}" href="detail/?adventure=${adventure.id}">
          <img src=${adventure.image} >
          <div class='activity-card-text p-3 d-flex flex-column justify-content-between'>
              <div class='description-text d-flex justify-content-between'>
                  <h4 class='fs-6 w-75'>${adventure.name}</h4>
                  <span>₹${adventure.costPerHead}</span>
              </div>
              <div class='duration-text d-flex justify-content-between'>
                  <h4 class='fs-6'>Duration</h4>
                  <span>${adventure.duration} hours</span>
              </div>
          </div>
      </a>
    </div>
  `;
}

// Shows sorry message if there are no adventures for the selected filters
function addSorryMessageToDom() {
  // Get the data element from the dom
  const dataElement = document.querySelector("#data");

  // Set the inner HTML of the data element to empty
  dataElement.innerHTML = "";

  // Create a sorry message card
  const sorryMessageElement = document.createElement("figure");

  // Center the content of sorry message element
  sorryMessageElement.style.textAlign = "center";

  // Add the HTML required for the sorry message card
  sorryMessageElement.innerHTML = `
    <img id='not-found-img' src='${imageURL}' alt='Not found' />
    <p class='sorry-message'><span>Ouhh..</span> there are no adventures for this filter.</p>
    <p class='change-filter'>Try changing the filter.</p>
  `;

  // Append the sorry message element to the
  dataElement.append(sorryMessageElement);
}

//* OPTIONAL
// Whenever clicked on add new adventure button make a post request to the backend
// function addNewAdventure(city) {
//   // get the button from the dom
//   const addAdventureBtns = document.querySelectorAll(".add-adventure-btn");

//   // Get the new adventure modals
//   const newAdventureModalContainer = document.querySelector(
//     ".new-adventure-container"
//   );

//   // create the city object that need to be passed as the body of POST request
//   const cityObject = { city };

//   // Loop through two add adventure btn and add event listener to both of them
//   addAdventureBtns.forEach((addAdventureBtn) => {
//     // Add an event listner to the button for click event
//     addAdventureBtn.addEventListener("click", async function () {
//       // Add a loader to the add new adventure btn
//       addAdventureBtn.innerHTML = '<div class="loader"></div>';

//       // create a url that needs to be hit when the button is clicked
//       const URL = `${config.backendEndpoint}/adventures/new`;

//       // make a post request to the url using post method
//       const adventureResponse = await fetch(URL, {
//         method: "POST",
//         headers: {
//           "Content-type": "application/json; charset=UTF-8",
//         },
//         body: JSON.stringify(cityObject),
//       });

//       // Check if adventure response is ok or not
//       if (adventureResponse.ok) {
//         // Convert the response to json
//         const newAdventure = await adventureResponse.json();

//         console.log(newAdventure);

//         // Add the newly created adventure to dom use addSingleAdventureToDom
//         addSingleAdventureToDom(newAdventure);

//         // Set new adventure details
//         setNewAdventureDetails(newAdventure);

//         // Listen for Ok event
//         listenOkClick();

//         // Open the modal when we receive the new adventure
//         newAdventureModalContainer.classList.add("modal-open");
//       }
//     });
//   });
// }

function addNewAdventure(city, secondaryBtn = false) {
  // get the button from the dom
  let addAdventureBtn;

  // If sedondary btn is true, update addadventurebtn to secondary btn;
  if (secondaryBtn) {
    addAdventureBtn = document.querySelectorAll(".add-adventure-btn")[1];
  } else {
    addAdventureBtn = document.querySelector(".add-adventure-btn");
  }

  // Get the new adventure modals
  const newAdventureModalContainer = document.querySelector(
    ".new-adventure-container"
  );

  // create the city object that need to be passed as the body of POST request
  const cityObject = { city };

  // Add an event listner to the button for click event
  addAdventureBtn.addEventListener("click", async function () {
    // Add a loader to the add new adventure btn
    addAdventureBtn.innerHTML = '<div class="loader"></div>';

    // create a url that needs to be hit when the button is clicked
    const URL = `${config.backendEndpoint}/adventures/new`;

    // make a post request to the url using post method
    const adventureResponse = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(cityObject),
    });

    // Check if adventure response is ok or not
    if (adventureResponse.ok) {
      // Convert the response to json
      const newAdventure = await adventureResponse.json();

      // Add the newly created adventure to dom use addSingleAdventureToDom
      addSingleAdventureToDom(newAdventure);

      // Set new adventure details
      setNewAdventureDetails(newAdventure);

      // Add new adventure to gloabl adventures variable
      pushNewAdventure(newAdventure);

      // Listen for Ok event
      listenOkClick();

      // Open the modal when we receive the new adventure
      newAdventureModalContainer.classList.add("modal-open");
    }
  });
}

// Sets the properties of new adventure in the modal
function setNewAdventureDetails({
  image,
  name,
  duration,
  costPerHead,
  category,
  id,
}) {
  // Get all the elements from the dom to which we need to update the details
  const adventureImage = document.querySelector(".new-adventure-image");
  const adventureName = document.querySelector(".new-adventure-name");
  const adventureDuration = document.querySelector(".new-adventure-duration");
  const adventurePrice = document.querySelector(".new-adventure-price");
  const adventureCategory = document.querySelector(".new-adventure-category");

  // Update the dom elements with new adventure data
  adventureImage.setAttribute("src", image);
  adventureName.textContent = `Adventure ${name}`;
  adventureDuration.textContent = duration;
  adventurePrice.textContent = `₹${costPerHead}`;
  adventureCategory.textContent = category;
}

function listenOkClick() {
  // Get ok and vistit adventure btn from the dom
  const btnOkAdventure = document.querySelector(".btn-ok-adventure");
  const newAdventureModalContainer = document.querySelector(
    ".new-adventure-container"
  );

  // Hide the modal when clicked on ok
  btnOkAdventure.addEventListener("click", () => {
    newAdventureModalContainer.classList.remove("modal-open");
  });
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list

  // loop through the list and filter the adventures that lie between low and high values
  const filteredList = list.filter((listItem) => {
    return listItem.duration >= low && listItem.duration <= high;
  });

  return filteredList;
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list

  // Iterate over the list and filter the lists that matches the category list items
  const filteredList = list.filter((listItem) => {
    // Check if the current list item matches any of the target category
    return categoryList.includes(listItem.category);
  });

  return filteredList;
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods

  // FILTER BY CATEGORY
  // Check if the category key of filters object is empty or not,
  // call filterByCategory method only if its truthy
  if (filters.category.length !== 0) {
    list = filterByCategory(list, filters.category);
  }

  // check if the duration key of filter object is empty or not
  // call filterByDuration method only if its truthy
  if (filters.duration) {
    // extract the low and high values using split and destructuring
    const [low, high] = filters.duration.split("-");

    // get adventures filtered by duration
    list = filterByDuration(list, low, high);
  }

  // Place holder for functionality to work in the Stubs
  return list;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage

  window.localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object

  return JSON.parse(window.localStorage.getItem("filters"));
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills

  // Get the dom element into where we need to append the pills to
  const categoryPillsElement = document.querySelector("#category-list");

  // Set the innerHTML of the categoryPillsElement to empty
  categoryPillsElement.innerHTML = "";

  // Loop over the category key of filter object and populate pills into the DOM
  filters.category.forEach((categoryItem) => {
    // Create a span element for the pill
    const pillElement = document.createElement("div");

    // Set the class attribute of the pill element
    pillElement.setAttribute("class", "category-filter");

    // add the HTML necessary for the pill element
    pillElement.innerHTML = `
        <span>${categoryItem}</span>
        <ion-icon name="close-outline" id="close-icon"></ion-icon>
    `;

    // append the pill element to the categoryPillsElement
    categoryPillsElement.append(pillElement);
  });

  // UPDATING DURATION FILTER VALUE
  // Extract the low value of the duration filter
  const [lowString] = filters.duration.split("-");

  // Now the low is of type string, convert it to integer
  const low = parseInt(lowString);

  // use if else to set the duration filter value
  if (low === 0) setDurationFilterValue(1);
  else if (low === 2) setDurationFilterValue(2);
  else if (low === 6) setDurationFilterValue(3);
  else if (low === 12) setDurationFilterValue(4);
}

// Sets the duration filter value based on the index value passed
function setDurationFilterValue(indexValue) {
  const durationElement = document.querySelector("#duration-select");
  durationElement.selectedIndex = indexValue;
}

//* OPTIONAL
// Function to remove filter pill when clicked on the remove button of the pill
function removeFilterPillAndUpdateDOM(adventures, filters, city) {
  // Get the parent element of all the pills
  const categoryListElement = document.querySelector("#category-list");

  // add an event listener to the parent element
  // with the help of EVENT PROPOGATION handle the clicks on the child pill elements -
  // to remove the filter pill and update DOM
  categoryListElement.addEventListener("click", function (e) {
    // Get the target element, so we can differentiate between which element is clicked -
    // and make the code work for only close button
    const targetElement = e.target;

    // check the targetElement is the close button or not -
    // if not just RETURN as we dont want to run our code for other clicks
    if (targetElement.id !== "close-icon") return;

    // Now, get the closest element of the target element which has the -
    // classname as 'category-filter', so that we can extract the text content -
    // of the pill we have clicked on
    const targetParent = targetElement.closest(".category-filter");

    // Now we have got the parent element of the target, we can extract its textcontent -
    // and use it to filter the adventures
    const filterToRemove = targetParent.querySelector("span").textContent;

    // Remove the filters from filter.category
    filters.category = filters.category.filter(
      (filter) => filter !== filterToRemove
    );

    // update the filter pill section
    generateFilterPillsAndUpdateDOM(filters);

    // Get the adventures with new filters
    const filteredAdventures = filterFunction(adventures, filters);

    // Check if the filteredAdventure contains any advntures
    // If it dosent contains any adventures show the sorry Message
    if (filteredAdventures.length) {
      // Updates the filtered adventures list to the DOM
      addAdventureToDOM(filteredAdventures, city);
    } else {
      // Show the sorry message
      addSorryMessageToDom();
    }

    // Remove add new adventure btn functionality if there are no adventures else add new adventure btn functionality
    if (filters.category.length) {
      removeAddNewAdventureBtnFunctionality();
    } else {
      addNewAdventureBtnFunctionality();
    }

    // update the filters in local storage
    saveFiltersToLocalStorage(filters);
  });
}

function removeAddNewAdventureBtnFunctionality() {
  // get the button from the dom
  // const addAdventureBtns = document.querySelectorAll(".add-adventure-btn");
  const addAdventureBtns = document.querySelectorAll(".add-adventure-btn");

  // Make the btns disabled
  addAdventureBtns.forEach((addAdventureBtn) => {
    addAdventureBtn.setAttribute("disabled", "true");
    addAdventureBtn.classList.add("disabled");
    addAdventureBtn.setAttribute(
      "title",
      "Clear all the filters to add new adventure"
    );
  });
}

function addNewAdventureBtnFunctionality() {
  // get the add new adventure btns from dom
  const addAdventureBtns = document.querySelectorAll(".add-adventure-btn");

  // Unable the buttons if they are disabled
  addAdventureBtns.forEach((addAdventureBtn) => {
    addAdventureBtn.removeAttribute("disabled");
    addAdventureBtn.classList.remove("disabled");
    addAdventureBtn.removeAttribute("title");
  });
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  addSorryMessageToDom,
  filterByDuration,
  addNewAdventure,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  removeFilterPillAndUpdateDOM,
  removeAddNewAdventureBtnFunctionality,
  addNewAdventureBtnFunctionality,
};
