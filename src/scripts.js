import "./css/styles.css";

import {promises} from './apiCalls.js';

import {displayPastUserTrips, displayPendingUserTrips, makeNewBooking, populateDestinations} from './domUpdates'



// === GLobal === //
export let newTripObject = {};
let userId = null;

// const userNameInput = document.getElementById("login-username-input");
// const passwordInput = document.getElementById("login-password-input");
// const logInButton = document.getElementById("login-button-input");


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
  })
  .catch((error) => console.log('Request failed from Promise.all', error));
});

const mainPageLoad = () => {
  userId = 24; // Hardcoded for now, will be dynamic later
  displayPastUserTrips(userId, newTripObject.trips, newTripObject.destinations);
  displayPendingUserTrips(userId, newTripObject.trips, newTripObject.destinations);
};


  //Book new trip button
const bookNewTripButton = document.getElementById('bookNewTripBtn');
if (bookNewTripButton) {
  bookNewTripButton.addEventListener('click', () => {
    makeNewBooking(newTripObject, userId); 
  });
}
































