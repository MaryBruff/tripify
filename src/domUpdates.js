//===Imports===//
import { filterUserTrips, calculateSingleTripCost, calculateTripsCost } from "./functions";
import { newTripObject } from "./scripts";

//==Selectors==//

//sections
const pastTripsSection = document.getElementById("pastTripsSection");
const pendingTripsSection = document.getElementById("pendingTripsSection");
const futureTripsSection = document.getElementById("futureTripsSection");

const destinationSelection = document.getElementById('trip-destinations-input');

//buttons 
const pendingTripsButton = document.getElementById('pendingTripsButton');
const futureTripsButton = document.getElementById('futureTripsButton');



//==Functions==//
export const displayPastUserTrips = (id, tripsData, destinationsData) => {
  // console.log("Trips Data:", tripsData); // Log to check the data
  // console.log("Destinations Data:", destinationsData);
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.past.forEach((trip) => {
    pastTripsSection.innerHTML += `<p>
    ${trip.destinationName}: ${trip.date}, travelers: ${trip.travelers}, length: ${trip.duration} days
  </p>`;
  });
};

export const displayPendingUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.pending.forEach((trip) => {
    pendingTripsSection.innerHTML +=`<p>
    ${trip.destinationName}: ${trip.date}, travelers: ${trip.travelers}, length: ${trip.duration} days
  </p>`;
  });
};

export const displayFutureUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.future.forEach((trip) => {
    futureTripsSection.innerHTML += `<p>
      ${trip.destinationName}: ${trip.date}, travelers: ${trip.travelers}, length: ${trip.duration} days
    </p>`;
  });
};


export const makeNewBooking = (newTripObject, userId) => {

  const destinationId = document.getElementById('trip-destinations-input').value;
  const travelers = document.getElementById('trip-numTravelers-input').value;
  const date = document.getElementById('trip-date-input').value;
  const duration = document.getElementById('trip-duration-input').value;

  if (!userId || isNaN(parseInt(travelers)) || isNaN(parseInt(duration))) {
    console.error('Invalid input for booking a trip');
    // Implement logic to show error to the user, e.g., an alert or a modal???
    return;
  }

  // Assuming newTripObject.trips is an array of trip objects
  const newTrip = {
    "userID": userId,
    "status": "pending",
    "suggestedActivities": [],
    "destinationID": destinationId,
    "travelers": parseInt(travelers),
    "date": date,
    "duration": parseInt(duration)
  };

  newTripObject.trips.push(newTrip);

  console.log("New trip added:", newTrip);
  console.log("Updated newTripObject:", newTripObject);

  displayFutureUserTrips(userId, newTripObject.trips, newTripObject.destinations);


  // Update the future trips section in the UI
  futureTripsSection.innerHTML += `<p>${newTrip.destinationID}: ${newTrip.date}, travelers: ${newTrip.travelers}, length: ${newTrip.duration} days</p>`;
};


export const showBookingPage = (newTripObject, trips) => {
  const { destinations } = newTripObject;

  destinations.forEach((destination) => {
    destinationSelection.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`;
  }); 
  const newTrip = {
    "id": trips.length,
    "status": "pending",
    "suggestedActivities": [],
    "userID": 2, // hardcoded for now
    "destinationID": 0,
    "travelers": 0,
    "date": " ",
    "duration": 0
  };
  }

  newTripForm.addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Retrieve the form values inside the event handler
    const destinationId = document.getElementById('trip-destinations-input').value;
    const travelers = document.getElementById('trip-numTravelers-input').value;
    const date = document.getElementById('trip-date-input').value;
    const duration = document.getElementById('trip-duration-input').value;
  
    // Calculate the cost of the single trip using the retrieved values
    const singleTripCost = calculateSingleTripCost(destinationId, parseInt(travelers), parseInt(duration), newTripObject.destinations);
    document.getElementById('totalTripCost').innerText = `$${singleTripCost.toFixed(2)}`;
  
    // Calculate and update the total yearly spending
    const yearlySpending = calculateTripsCost(2, newTripObject.trips, newTripObject.destinations);
    document.querySelector('.total-cost').innerText = yearlySpending.toFixed(2);
  });


