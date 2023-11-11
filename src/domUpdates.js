//===Imports===//
import { filterUserTrips, calculateSingleTripCost, calculateTripsCost } from "./functions";
import { newTripObject } from "./scripts";

//==Query Selectors==//

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
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.past.forEach((trip) => {
    const destination = destinationsData.find(dest => dest.id === trip.destinationID);
    const tripImage = destination ? destination.image : 'default-image-url.jpg';
    const tripAltText = destination ? destination.alt : 'Default description';

    pastTripsSection.innerHTML += `
      <div class="trip">
        <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
        <div class="trip-details">
          <p>${trip.destinationName}: ${trip.date}, Travelers: ${trip.travelers}, Days: ${trip.duration}</p>
          <p class="trip-status">Status: Completed</p>
        </div>
      </div>`;
  });
};

export const displayPendingUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.pending.forEach((trip) => {
    const destination = destinationsData.find(dest => dest.id === trip.destinationID);
    const tripImage = destination ? destination.image : 'default-image-url.jpg';
    const tripAltText = destination ? destination.alt : 'Default description';

    pendingTripsSection.innerHTML += `
      <div class="trip">
        <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
        <div class="trip-details">
          <p>${trip.destinationName}: ${trip.date}, Travelers: ${trip.travelers}, Days: ${trip.duration}</p>
          <p class="trip-status">Status: Pending</p>
        </div>
      </div>`;
  });
};

export const displayFutureUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.future.forEach((trip) => {
    const destination = destinationsData.find(dest => dest.id === trip.destinationID);
    const tripImage = destination ? destination.image : 'default-image-url.jpg';
    const tripAltText = destination ? destination.alt : 'Default description';

    futureTripsSection.innerHTML += `
      <div class="trip">
        <img src="${tripImage}" alt="${tripAltText}" class="trip-image">
        <p>${trip.destinationName}: ${trip.date}, Travelers: ${trip.travelers}, Days: ${trip.duration}</p>
        <p>Status: ${trip.status}</p>
      </div>`;
  });
};


export const makeNewBooking = (newTripObject, userId) => {
  const destinationId = document.getElementById('trip-destinations-input').value;
  const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
  const date = document.getElementById('trip-date-input').value;
  const duration = parseInt(document.getElementById('trip-duration-input').value);

  if (!userId || isNaN(travelers) || isNaN(duration)) {
    console.error('Invalid input for booking a trip');
    // You might want to show a user-friendly error message here
    return;
  }

  const newTrip = {
    "userID": userId,
    "status": "pending",
    "suggestedActivities": [],
    "destinationID": destinationId,
    "travelers": travelers,
    "date": date,
    "duration": duration
  };

  newTripObject.trips.push(newTrip);

  // Calculate and display the estimated cost for the new trip
  const singleTripCost = calculateSingleTripCost(destinationId, travelers, duration, newTripObject.destinations);
  const agentFee = singleTripCost * 0.1; // 10% agent fee
  const totalCostWithFee = singleTripCost + agentFee;

  // Add the new trip to the future trips section in the UI
  const futureTripsSection = document.getElementById('futureTripsSection');
  const destination = newTripObject.destinations.find(dest => dest.id === parseInt(destinationId));
  const tripImage = destination ? destination.image : 'default-image-url.jpg';
  const tripAltText = destination ? destination.alt : 'Default description';

  futureTripsSection.innerHTML += `
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

  const yearlySpendingElement = document.getElementById('yearly');
  if (yearlySpendingElement) {
    const totalCost = calculateTripsCost(userId, newTripObject.trips, newTripObject.destinations);
    yearlySpendingElement.innerText = `$${totalCost.toFixed(2)}`;
  }
};



















//////OLD
// export const makeNewBooking = (newTripObject, userId) => {
//   const destinationId = document.getElementById('trip-destinations-input').value;
//   const travelers = document.getElementById('trip-numTravelers-input').value;
//   const date = document.getElementById('trip-date-input').value;
//   const duration = document.getElementById('trip-duration-input').value;

//   if (!userId || isNaN(parseInt(travelers)) || isNaN(parseInt(duration))) {
//     console.error('Invalid input for booking a trip');
//     // Implement logic to show error to the user, e.g., an alert or a modal???
//     return;
//   }

//   const newTrip = {
//     "userID": userId,
//     "status": "pending",
//     "suggestedActivities": [],
//     "destinationID": destinationId,
//     "travelers": parseInt(travelers),
//     "date": date,
//     "duration": parseInt(duration)
//   };

//   newTripObject.trips.push(newTrip);

//   // console.log("New trip added:", newTrip);
//   // console.log("Updated newTripObject:", newTripObject);
//   displayFutureUserTrips(userId, newTripObject.trips, newTripObject.destinations);

//   // Update the future trips section in the UI
//   futureTripsSection.innerHTML += `<p>${newTrip.destinationID}: ${newTrip.date}, travelers: ${newTrip.travelers}, length: ${newTrip.duration} days</p>`;
    
//   // Calculate and display the estimated cost for the new trip
//     const singleTripCost = calculateSingleTripCost(destinationId, parseInt(travelers), parseInt(duration), newTripObject.destinations);
//     document.querySelector('.estimated').innerText = singleTripCost.toFixed(2);
//     calculateTripsCost(userId, newTripObject.trips, newTripObject.destinations);
// };


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
    const duration = document.getElementById('trip-duration-input').value;
    
    // Calculate the cost of the single trip using the retrieved values
    const singleTripCost = calculateSingleTripCost(destinationId, parseInt(travelers), parseInt(duration), newTripObject.destinations);
    document.getElementById('estimated').innerText = `$${singleTripCost.toFixed(2)}`;

  });


