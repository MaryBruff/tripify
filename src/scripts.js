import "./css/styles.css";

import {promises} from './apiCalls.js';

import {makeNewBooking, populateDestinations, displayUserTrips} from './domUpdates'

// === GLobal === //
export let newTripObject = {};
let userId = null;


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
  userId = 33; // Hardcoded for now, will be dynamic later

  // Display past trips
  displayUserTrips(userId, newTripObject.trips, newTripObject.destinations, 'past');

  // Display pending trips
  displayUserTrips(userId, newTripObject.trips, newTripObject.destinations, 'pending');
};


  //Book new trip button
const bookNewTripButton = document.getElementById('bookNewTripBtn');
if (bookNewTripButton) {
  bookNewTripButton.addEventListener('click', () => {
    makeNewBooking(newTripObject, userId); 
  });
}

