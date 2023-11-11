import "./css/styles.css";

import {promises, oneTravelerData, fetchTravelerData, allDestinationsData} from './apiCalls.js';

import {displayPastUserTrips, displayPendingUserTrips, makeNewBooking, showBookingPage} from './domUpdates'

import {calculateTripsCost, populateDestinations, calculateSingleTripCost} from './functions.js'




// === GLobal === //
export let newTripObject = {};
let userId = null;



const mainPageLoad = () => {
  userId = 2; // Hardcoded for now, will be dynamic later
  displayPastUserTrips(userId, newTripObject.trips, newTripObject.destinations);
  displayPendingUserTrips(userId, newTripObject.trips, newTripObject.destinations);
  
  const totalCost = calculateTripsCost(userId, newTripObject.trips, newTripObject.destinations);
  document.querySelector('.total-cost').innerHTML = totalCost.toFixed(2); 
};


document.addEventListener('DOMContentLoaded', () => {
  // Fetch data and initialize the page
  Promise.all(promises)
    .then(response => {
      const [allTravelersData, allTripsData, allDestinationsData] = response;
      newTripObject.travelers = allTravelersData;
      newTripObject.trips = allTripsData;
      newTripObject.destinations = allDestinationsData;

      populateDestinations(allDestinationsData); // Populate destinations
      mainPageLoad(); // Call mainPageLoad function
    });

  // Define the 'Book New Trip' button
  const bookNewTripButton = document.getElementById('bookNewTripBtn');
  if (bookNewTripButton) {
    bookNewTripButton.addEventListener('click', () => {
      makeNewBooking(newTripObject, userId);
    });
  }

  
  // Define and add event listener for the new trip form submission
  const newTripForm = document.getElementById('newTripForm');

  if (newTripForm) {
    newTripForm.addEventListener('submit', function(event) {
      // event.preventDefault();
  
      // Extract values from the form
      const destinationId = document.getElementById('trip-destinations-input').value;
      const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
      const date = document.getElementById('trip-date-input').value;
      const duration = parseInt(document.getElementById('trip-duration-input').value);
  
      // Calculate the cost of the single trip
      const singleTripCost = calculateSingleTripCost(destinationId, travelers, duration, newTripObject.destinations);
      document.getElementById('totalTripCost').innerText = `$${singleTripCost.toFixed(2)}`;
  
      // Calculate and update the total yearly spending
      const yearlySpending = calculateTripsCost(userId, newTripObject.trips, newTripObject.destinations);
      document.querySelector('.total-cost').innerText = yearlySpending.toFixed(2);
    });
  }
}
);






























// const loginForm = document.getElementById('loginForm');

// loginForm.addEventListener('submit', function(event) {
//   // ...login logic...
//   if (validateCredentials(username, password)) {
//     const userId = extractUserId(username);
//     if (userId) {
//       oneTravelerData(userId)
//         .then(userData => {
//           showDashboard();
//           newTripObject = userData;
//           mainPageLoad(userId); // Pass the dynamically determined userId
//         });
//     } else {
//       alert('Invalid username format');
//     }
//   } else {
//     alert('Invalid credentials');
//   }
// });






