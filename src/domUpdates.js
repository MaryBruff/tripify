//===Imports===//
import { filterUserTrips, calculateTripCosts} from "./functions";
import { addNewTrip } from "./apiCalls.js";
import { newTripObject, makeNewBooking} from "./scripts.js";


//==Query Selectors==//
//Sections
const pastTripsSection = document.getElementById("pastTripsSection");
const pendingTripsSection = document.getElementById("pendingTripsSection");
//Inputs
const destinationSelection = document.getElementById("trip-destinations-input");

//===Functions===//

export const createTripHTML = (trip, destinationsData, isNewTrip = false) => {
  const destination = destinationsData.find(dest => dest.id === trip.destinationID) || {};
  const tripImage = destination.image || "default-image-url.jpg";
  const tripAltText = destination.alt || "Default description";

  let tripHTML = `
    <div class="trip">
      <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
      <div class="trip-details">
        <p>${destination.destination || 'Unknown'}: ${trip.date}, Travelers: ${trip.travelers}, Days: ${trip.duration}</p>
  `;
  if (isNewTrip) {
    const totalCostWithFee = calculateTotalCost(trip, destinationsData);
    tripHTML += `<p>Estimated Trip Cost (incl. agent's fee 10%): $${totalCostWithFee.toFixed(2)}</p><p>Status: Pending</p>`;
  } else if (trip.status === 'pending') {
    tripHTML += `<p>Estimated Trip Cost (incl. agent's fee 10%): $${calculateTotalCost(trip, destinationsData).toFixed(2)}</p>`;
  } else {
    tripHTML += '<p class="trip-status">Status: Completed</p>';
  }
  tripHTML += `</div></div>`;
  return tripHTML;
}

export const createTripElement = (trip, destinationsData) => {
  return createTripHTML(trip, destinationsData);
}

//Calculate total cost
export const calculateTotalCost = (trip, destinationsData) => {
  const singleTripCost = calculateTripCosts(trip.destinationID, null, destinationsData, true, trip.travelers, trip.duration);
  const agentFee = singleTripCost * 0.1; // 10% agent fee
  return singleTripCost + agentFee;
}

//Check trips and display trips
export const displayUserTrips = (id, tripsData, destinationsData, tripType) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  let targetSection;

  if (tripType === 'past') {
    targetSection = pastTripsSection;
  } else if (tripType === 'pending') {
    targetSection = pendingTripsSection;
  } else {
    console.error('Invalid trip type');
    return;
  }
  targetSection.innerHTML = sortedUserTrips[tripType].map(trip => createTripElement(trip, destinationsData)).join('');
};

export const populateDestinations = (destinationsData) => {
  const destinationSelect = document.getElementById('trip-destinations-input');
  destinationSelect.innerHTML = destinationsData.map(destination => 
    `<option value="${destination.id}">${destination.destination}</option>`
  ).join('');
};

newTripForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  const destinationId = document.getElementById('trip-destinations-input').value;
  const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
  const date = document.getElementById('trip-date-input').value.replace(/-/g, '/');
  const duration = parseInt(document.getElementById('trip-duration-input').value);

  // Ensure input validation for travelers and duration
  if (isNaN(travelers) || isNaN(duration)) {
    // Handle invalid input scenario, possibly by updating UI with an error message
    console.error('Invalid input for calculating trip cost');
    return;
  }
  // Calculate the cost of the single trip using the retrieved values
  const singleTripCost = calculateTripCosts(destinationId, null, newTripObject.destinations, true, travelers, duration); 
  // Update the UI with the calculated cost
  document.getElementById("yearly").innerText = `$${singleTripCost.toFixed(2)}`;
  
});
