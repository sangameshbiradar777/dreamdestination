import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them

  // Create a url to which we need to hit to get the reservation data
  const URL = `${config.backendEndpoint}/reservations`;

  // Sorround the code that has a network call to be made in try and catch block
  try {
    const reservationResponse = await fetch(URL);

    // Check if the reservation response is ok or not
    if (reservationResponse.ok) {
      const reservations = await reservationResponse.json();
      return reservations;
    }

    // If the response is not ok throw an error
    else {
      const message = `⚡⚡An error occurred with a status code of ${reservationResponse.status}⚡⚡`;
      throw new Error(message);
    }
  } catch (error) {
    // Catch any errors that may happen during a network call
    console.log(error.message);
    return null;
  }
}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table

  //Conditionally render the no-reservation-banner and reservation-table-parent
  // Get the no resevation banner and reservation tabel parent elements from the dom
  const noReservationBannerEl = document.querySelector(
    "#no-reservation-banner"
  );
  const reservationTableParentEl = document.querySelector(
    "#reservation-table-parent"
  );

  // If there are no reservations show the no reservation banner
  if (reservations.length === 0) {
    noReservationBannerEl.style.display = 'block';
    reservationTableParentEl.style.display = 'none';
    return;
  }
  // If there are reservations show the table parent element
  else {
    reservationTableParentEl.style.display = 'block';
    noReservationBannerEl.style.display = 'none';
  }


  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */


  // Get the reservation table from the dom
  const reservationTableElement = document.querySelector('#reservation-table');

  // Loop over each reservation add it as table to the reservation table element
  reservations.forEach(reservation => {
    // Get the date and time in local date and time format
    // CONVERTED DATE AND TIME FORMAT TO PASS THE TEST CASES
    //* FOR CRIO TEST CASES TO PASS USE BELOW TWO LINES
    // const localeTime = new Date(reservation.time).toLocaleString('en-IN', { dateStyle: "long", timeStyle: "medium" }).replace(' at', ',');
    // const localeDate = new Date(reservation.date).toLocaleDateString('en-IN');

    const [localeDate, localeTime] = new Date(reservation.time).toLocaleString('en-IN').split(',');

    // Create a table row element
    const tableRowElement = document.createElement('tr');

    // Set the bootsrap scope attribute to it
    // tableRowElement.setAttribute('class', 'row');

    // Populate the inner html of table row element
    tableRowElement.innerHTML = `
          <td>${reservation.id}</td>
          <td>${reservation.name}</td>
          <td>${reservation.adventureName}</td>
          <td>${reservation.person}</td>
          <td>${localeDate}</td>
          <td>₹${reservation.price}</td>
          <td>${localeTime}</td>
          <td id=${reservation.id}>
            <a class="reservation-visit-button" href="../detail/?adventure=${reservation.adventure}
            ">Visit adventure
              <lord-icon
                src="https://cdn.lordicon.com/wxgbcyqg.json"
                trigger="loop"
                colors="outline:#121331"
                stroke="100"
                style="width:25px;height:25px;color:#ff3300">
            </lord-icon>
            </a>
          </td>
      `;

    // Append the tableRowHTML to reservation table element
    reservationTableElement.append(tableRowElement);
  })
}

export { fetchReservations, addReservationToTable };
