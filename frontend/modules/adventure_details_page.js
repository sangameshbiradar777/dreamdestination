import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL

  // get the adventured id using split and destructuring
  const [_, adventureId] = search.split("=");
  return adventureId;
}

//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call

  // create a URL that should be hit to fetch the adventure details
  const URL = `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`;

  // sorround the code with try and block that has some network calls to be made
  try {
    // fetch the adventure details
    const adventureDetailsResponse = await fetch(URL);

    // Check if the respose is ok or not
    if (adventureDetailsResponse.ok) {
      // conver the details response to json format
      const adventureDetails = await adventureDetailsResponse.json();
      return adventureDetails;
    }

    // throw an error if response is not ok
    else {
      const message = `⚡⚡An error occurred with a status code of ${adventureDetailsResponse.status}⚡⚡`;
      throw new Error(message);
    }
  } catch (error) {
    // catch the errors that may happen during a network call
    console.log(error.message);
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM

  // Get all the necessary elements from the DOM
  const adventureNameElement = document.querySelector("#adventure-name");
  const adventureSubtitleElement = document.querySelector(
    "#adventure-subtitle"
  );
  const photoGalleryElement = document.querySelector("#photo-gallery");
  const adventureContentElement = document.querySelector("#adventure-content");

  // Set the text content of all the elements
  adventureNameElement.textContent = adventure.name;
  adventureSubtitleElement.textContent = adventure.subtitle;
  adventureContentElement.textContent = adventure.content;

  // loop through the imgage array of adventure object and add it to dom
  adventure.images.forEach((image) => {
    // create a div element
    const imgContainerElement = document.createElement("div");

    // set the innerHTML of the divElement to image
    imgContainerElement.innerHTML = `
      <img src=${image} class="activity-card-image" alt="adventure image">
    `;

    // append the div element to the photo gallery
    photoGalleryElement.append(imgContainerElement);
  });
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images

  // get photo gallery element fromt the dom
  const photoGalleryElement = document.querySelector("#photo-gallery");

  // set the controls of the bootstrap carousel
  photoGalleryElement.innerHTML = `
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div class="carousel-inner">
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;

  const carouselInnerEl = document.querySelector(".carousel-inner");

  // loop over the images append them to corousel inner element
  images.forEach((image, index) => {
    // create a carousel item
    const carouselItem = document.createElement("div");

    // set the first image as active item
    const className = index === 0 ? "carousel-item active" : "carousel-item";
    carouselItem.setAttribute("class", className);

    // set the innerHTML of the carousel item to image
    carouselItem.innerHTML = `
      <img src=${image} class="activity-card-image" alt="adventure image" >
    `;

    // append the carouel item to the carousel inner element
    carouselInnerEl.append(carouselItem);
  });
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.

  // select the sold out section element and reservation panel element
  const soldOutElement = document.querySelector("#reservation-panel-sold-out");
  const availableElement = document.querySelector(
    "#reservation-panel-available"
  );

  // Conditionally render sold out and availabel panels
  if (adventure.available) {
    const perPersonCostElement = document.querySelector(
      "#reservation-person-cost"
    );
    perPersonCostElement.innerHTML = adventure.costPerHead;
    soldOutElement.style.display = "none";
    availableElement.style.display = "block";
  } else {
    soldOutElement.style.display = "block";
    availableElement.style.display = "none";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field

  // get the element from the dom to update the total cost
  const reservationCostElement = document.querySelector("#reservation-cost");

  // get per person cost from adventure object
  const perHeadCost = adventure.costPerHead;

  // calculate the total const
  const totalCost = perHeadCost * persons;

  // update dom with total cost
  reservationCostElement.textContent = totalCost;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".

  // Get the form and other input elements from the DOM
  const formElement = document.querySelector("#myForm");
  const nameElement = document.querySelector('[name = "name"]');
  const dateElement = document.querySelector('[name = "date"]');
  const personElement = document.querySelector('[name = "person"]');
  const reservationModalElement = document.querySelector(
    ".reservation-success"
  );
  const reservatioErrorModalElement = document.querySelector('.reservation-error');
  const reservationDateElement = document.querySelector('.reservation-date');
  const reserveBtnElement = document.querySelector(".reserve-button");

  // Listen for the submit event on the form
  formElement.addEventListener("submit", async function (e) {
    // Prevent the defualt behaviour of form
    e.preventDefault();

    // Add a loader to the reserve-btn
    reserveBtnElement.innerHTML = `<div class='loader'></div>`;

    // Set the date in reservation status modal
    // Get the Intl date formatter
    //* REMOVED BELOW THREE LINES TO PASS TEST CASES OF CRIO
    const formatter = new Intl.DateTimeFormat("us", { month: "long", day: "numeric" });
    const bookingMonth = formatter.format(new Date(dateElement.value));
    reservationDateElement.textContent = bookingMonth;

    // reservationDateElement.textContent = dateElement.value;

    // Create the form data that needs to be send over to the backend
    const formData = {
      adventure: adventure.id,
      name: nameElement.value,
      date: dateElement.value,
      person: personElement.value,
    };

    // Create a URL to which we need to hit to make a POST request
    const URL = `${config.backendEndpoint}/reservations/new`;

    // Sorround the code with try and catch block which has a network call to be made
    try {
      const reservationResponse = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // Check if the response is ok or not
      if (reservationResponse.ok) {
        // Add the modal open class to modal element
        reservationModalElement.classList.add("modal-open");

        // Add the functionality of madal buttons
        reservationModalBtnFunction(true);
      }
      // If the response is not ok throw an error
      else {
        // Alert the user with a Error message
        reservatioErrorModalElement.classList.add('modal-open');

        // Add the functionality of madal buttons
        reservationModalBtnFunction(false);

        // Set the innerHTML of the reserve button element to reserved
        reserveBtnElement.innerHTML = 'Reserve';

        const message = `⚡⚡An error occurred with a status code of ${reservationResponse.status}⚡⚡`;
        throw new Error(message);
      }
    } catch (error) {
      // Catch any errors that may happed during a network call
      console.log(error);
      return null;
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't

  // Get the reseved banner element from the DOM
  const reservedBannerElement = document.querySelector("#reserved-banner");

  // Show the banner if the adventure is reserved else hide it
  if (adventure.reserved) {
    reservedBannerElement.style.display = "block";
  } else {
    reservedBannerElement.style.display = "none";
  }
}

function reservationModalBtnFunction(success) {
  // Get the reservation modal element and ok btn from the dom
  const reservationModalElements = document.querySelectorAll(
    ".reservation-status-container"
  );
  const btnOkElements = document.querySelectorAll(".btn-ok");

  // Add an event listener to btnOkElement
  btnOkElements.forEach(btnOkElement => {
    btnOkElement.addEventListener("click", function () {
      reservationModalElements.forEach(element => {
        element.classList.remove('modal-open');
      })
      if(success) window.location.reload();
    });
  })
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
  reservationModalBtnFunction,
};
