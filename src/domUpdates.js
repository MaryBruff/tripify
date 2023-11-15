//===Imports===//
import { filterUserTrips, calculateTripCosts } from "./functions";
import { allDestinationsData } from "./apiCalls.js";
import { newTripObject, makeNewBooking } from "./scripts.js";

//==Query Selectors==//
const pastTripsSection = document.getElementById("pastTripsSection");
const pendingTripsSection = document.getElementById("pendingTripsSection");
const destinationSelection = document.getElementById("trip-destinations-input");
const newTripForm = document.getElementById("newTripForm");

//===Functions===//

export const createTripHTML = (trip, destinationsData, isNewTrip = false) => {
  if (!trip || !destinationsData) {
    return logErrorAndReturn("Invalid input to createTripHTML");
  }

  const destination = destinationsData.find((dest) => dest.id === trip.destinationID) || {};
  const tripImage = destination.image || "default-image-url.jpg";
  const tripAltText = destination.alt || "Default description";

  let tripHTML = `
        <div class="trip">
            <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
            <div class="trip-details">
                <p>${destination.destination || "Unknown"}: ${trip.date}, Travelers: ${trip.travelers}, Days: ${trip.duration}</p>`;

  if (isNewTrip) {
    const totalCostWithFee = calculateTotalCost(trip, destinationsData);
    tripHTML += `<p>Estimated Trip Cost (incl. agent's fee 10%): $${totalCostWithFee.toFixed(2)}</p><p>Status: Pending</p>`;
  } else if (trip.status === "pending") {
    tripHTML += `<p>Estimated Trip Cost (incl. agent's fee 10%): $${calculateTotalCost(trip, destinationsData).toFixed(2)}</p>`;
  } else {
    tripHTML += '<p class="trip-status">Status: Completed</p>';
  }
  tripHTML += `</div></div>`;

  return tripHTML;
};

export const createTripElement = (trip, destinationsData) => {
  return createTripHTML(trip, destinationsData);
};

export const calculateTotalCost = (trip, destinationsData) => {
  if (typeof trip.destinationID !== "number" || !Array.isArray(destinationsData)) {
    return logErrorAndReturn("Invalid input for calculateTotalCost");
  }
  const singleTripCost = calculateTripCosts(trip.destinationID, null, destinationsData, true, trip.travelers, trip.duration);
  const agentFee = singleTripCost * 0.1; // 10% agent fee
  return singleTripCost + agentFee;
};

export const displayUserTrips = (id, tripsData, destinationsData, tripType) => {
  if (typeof id !== "number" || !Array.isArray(tripsData) || !Array.isArray(destinationsData)) {
    return logErrorAndReturn("Invalid input for displayUserTrips");
  }

  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  let targetSection;

  if (tripType === "past") {
    targetSection = pastTripsSection;
  } else if (tripType === "pending") {
    targetSection = pendingTripsSection;
  } else {
    console.error("Invalid trip type");
    return;
  }

  targetSection.innerHTML = sortedUserTrips[tripType].map((trip) => createTripElement(trip, destinationsData)).join("");
};

export const populateDestinations = (destinationsData) => {
  if (!Array.isArray(destinationsData)) {
    return logErrorAndReturn("Invalid destinations data");
  }
  const destinationSelect = document.getElementById("trip-destinations-input");
  if (!destinationSelect) {
    console.error("destinationSelect element not found");
    return;
  }
  destinationSelect.innerHTML = destinationsData.map((destination) => `<option value="${destination.id}">${destination.destination}</option>`).join("");
};

//==Event Listeners==//
if (newTripForm) {
  newTripForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const destinationId = document.getElementById("trip-destinations-input").value;
    const travelers = parseInt(document.getElementById("trip-numTravelers-input").value, 10);
    const date = document.getElementById("trip-date-input").value.replace(/-/g, "/");
    const duration = parseInt(document.getElementById("trip-duration-input").value, 10);

    if (!destinationId || isNaN(travelers) || isNaN(duration)) {
      console.error("Invalid input for booking a trip");
      const errorMessageContainer = document.getElementById("formErrorMessage");
      errorMessageContainer.innerText = "Please enter valid trip information. All fields are required.";
      errorMessageContainer.style.display = "block"; // Make the error message visible
      return;
    }
    // Assuming calculateTripCosts is a function that calculates the cost based on input
    const tripCost = calculateTripCosts(destinationId, null, newTripObject.destinations, true, travelers, duration);
    console.log(`Trip cost calculated: $${tripCost}`);
  });
} else {
  console.error("newTripForm not found");
}

