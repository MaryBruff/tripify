//===Imports===//
import { filterUserTrips, calculateTripCosts} from "./functions";
import { addNewTrip } from "./apiCalls.js";
import { newTripObject} from "./scripts.js";


//==Query Selectors==//

//sections
const pastTripsSection = document.getElementById("pastTripsSection");
const pendingTripsSection = document.getElementById("pendingTripsSection");


//inputs
const destinationSelection = document.getElementById("trip-destinations-input");

//===Functions===//
//displays trips
export const createTripElement = (trip, destinationsData) => {
  const destination = destinationsData.find(dest => dest.id === trip.destinationID) || {};
  const tripImage = destination.image || "default-image-url.jpg";
  const tripAltText = destination.alt || "Default description";

  return `
    <div class="trip">
      <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
      <div class="trip-details">
        <p>${destination.destination || 'Unknown'}: ${trip.date}, Travelers: ${trip.travelers}, Days: ${trip.duration}</p>
        ${trip.status === 'pending' 
          ? `<p>Total Cost (incl. agent's fee): $${calculateTotalCost(trip, destinationsData).toFixed(2)}</p>`
          : '<p class="trip-status">Status: Completed</p>'
        }
      </div>
    </div>`;
}

export const calculateTotalCost = (trip, destinationsData) => {
  const singleTripCost = calculateTripCosts(trip.destinationID, null, destinationsData, true, trip.travelers, trip.duration);
  const agentFee = singleTripCost * 0.1; // 10% agent fee
  return singleTripCost + agentFee;
}

export const displayPastUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  pastTripsSection.innerHTML = sortedUserTrips.past.map(trip => createTripElement(trip, destinationsData)).join('');
};

export const displayPendingUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  pendingTripsSection.innerHTML = sortedUserTrips.pending.map(trip => createTripElement(trip, destinationsData)).join('');
};


export const makeNewBooking = (newTripObject, userId) => {
  const destinationId = document.getElementById('trip-destinations-input').value;
  const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
  const date = document.getElementById('trip-date-input').value.replace(/-/g, '/');
  const duration = parseInt(document.getElementById('trip-duration-input').value);

  if (!userId || isNaN(travelers) || isNaN(duration)) {
    console.error('Invalid input for booking a trip');
    // update error message in the UI
    return;
  }

  const newTrip = {
    id: (newTripObject.trips.length + 1),
    "userID": userId,
    "status": "pending",
    "suggestedActivities": [],
    "destinationID": parseInt(destinationId, 10),
    "travelers": travelers,
    "date": date,
    "duration": duration
  };

  newTripObject.trips.push(newTrip);
  // Call to addNewTrip (API call)
  addNewTrip(newTrip) //error
    .then((response) => {
      // Handle server response
      if (response.message) {
        alert(`Trip added successfully: ${response.message}`);
        // Further UI update if necessary
      } else {
        throw new Error("Failed to add trip");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to add new trip. Please try again.");
    });

  // Calculate and display the estimated cost for the new trip using the new function
  const singleTripCost = calculateTripCosts(destinationId, null, newTripObject.destinations, true, travelers, duration);
  const agentFee = singleTripCost * 0.1; // 10% agent fee
  const totalCostWithFee = singleTripCost + agentFee;

  // Add the new trip to the future trips section in the UI
  const destination = newTripObject.destinations.find(dest => dest.id === parseInt(destinationId));
  const tripImage = destination ? destination.image : 'default-image-url.jpg';
  const tripAltText = destination ? destination.alt : 'Default description';

  pendingTripsSection.innerHTML += `
    <div class="trip">
      <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
      <div class="trip-details">
        <p>${destination ? destination.destination : 'Unknown'}: ${date}, Travelers: ${travelers}, Days: ${duration}</p>
        <p>Total Cost (incl. agent's fee): $${totalCostWithFee.toFixed(2)}</p>
        <p>Status: Pending</p>
      </div>
    </div>`;

  // Update the estimated cost and yearly spending in the UI
  document.querySelector('.estimated').innerText = `$${totalCostWithFee.toFixed(2)}`;
};

export const populateDestinations = (destinationsData, trips = []) => {
  const destinationSelect = document.getElementById('trip-destinations-input');
  destinationSelect.innerHTML = destinationsData.map(destination => 
    `<option value="${destination.id}">${destination.destination}</option>`
  ).join('');

  // Initialize newTrip only if trips array is provided
  if (trips.length > 0) {
    const newTrip = {
      id: trips.length,
      status: "pending",
      suggestedActivities: [],
      userID: 0,
      destinationID: 0,
      travelers: 0,
      date: " ",
      duration: 0,
    };
    // Additional logic for newTrip if necessary
  }
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
  document.getElementById("estimated").innerText = `$${singleTripCost.toFixed(2)}`;

  // Add any additional logic needed for booking the trip or updating the UI
});

