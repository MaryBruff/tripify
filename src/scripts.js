import "./css/styles.css";

import {promises, oneTravelerData, fetchTravelerData, allDestinationsData, addNewTrip} from './apiCalls.js';

import {displayPastUserTrips, displayPendingUserTrips, makeNewBooking, showBookingPage} from './domUpdates'

import {calculateTripsCost, populateDestinations, calculateSingleTripCost} from './functions.js'

// === GLobal === //
export let newTripObject = {};
let userId = null;
// let userID;


const mainPageLoad = () => {
  userId = 10; // Hardcoded for now, will be dynamic later
  displayPastUserTrips(userId, newTripObject.trips, newTripObject.destinations);
  displayPendingUserTrips(userId, newTripObject.trips, newTripObject.destinations);
  
  const yearlySpendingElement = document.getElementById('yearly');
  if (yearlySpendingElement) {
    const totalCost = calculateTripsCost(userId, newTripObject.trips, newTripObject.destinations);
    yearlySpendingElement.innerText = totalCost.toFixed(2); 
  } else {
    console.error('Yearly spending element not found');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Fetch data and initialize the page
  Promise.all(promises)
    .then(response => {
      const [allTravelersData, allTripsData, allDestinationsData] = response;
      newTripObject.travelers = allTravelersData;
      newTripObject.trips = allTripsData;
      newTripObject.destinations = allDestinationsData;

      populateDestinations(allDestinationsData); 
      mainPageLoad(); 
    });

//Book new trip button
  const bookNewTripButton = document.getElementById('bookNewTripBtn');
  if (bookNewTripButton) {
    bookNewTripButton.addEventListener('click', () => {
      makeNewBooking(newTripObject, userId); //error
    });
  }

  const newTripForm = document.getElementById('newTripForm');

  if (newTripForm) {
    newTripForm.addEventListener('submit', function(event) {
      const destinationId = document.getElementById('trip-destinations-input').value;
      const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
      const date = document.getElementById('trip-date-input').value.replace(/-/g, '/');
      const duration = parseInt(document.getElementById('trip-duration-input').value);
    });
  }
});

































