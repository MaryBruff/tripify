import "./css/styles.css";

import {promises, addNewTrip} from './apiCalls.js';

import {populateDestinations, displayUserTrips, createTripHTML, calculateTotalCost} from './domUpdates'

import { filterUserTrips, calculateTripCosts} from "./functions";

// === GLobal === //
export let newTripObject = {};
let userId = null;




window.onload = () => {
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
}

const mainPageLoad = () => {
  userId = 33; // Hardcoded for now, will be dynamic later

  // Display past trips
  displayUserTrips(userId, newTripObject.trips, newTripObject.destinations, 'past');

  // Display pending trips
  displayUserTrips(userId, newTripObject.trips, newTripObject.destinations, 'pending');
};


//Create new booking
export const makeNewBooking = (newTripObject, userId) => {
  const destinationId = document.getElementById('trip-destinations-input').value;
  const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
  const date = document.getElementById('trip-date-input').value.replace(/-/g, '/');
  const duration = parseInt(document.getElementById('trip-duration-input').value);

  // Validate input
  if (!userId || isNaN(travelers) || isNaN(duration)) {
    console.error('Invalid input for booking a trip');
    // Update error message in the UI
    return;
  }

  // Convert input date to Date object and get current date
  const inputDate = new Date(date);
  const currentDate = new Date();

  // Check if the input date is in the past
  if (inputDate < currentDate) {
    console.error('Cannot book a trip for a past date');
    alert('Cannot book a trip for a past date');
    return;
  }

  // Create a new trip object
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

  // Add the new trip to the trip object
  newTripObject.trips.push(newTrip);

  // Call to addNewTrip (API call)
  addNewTrip(newTrip)
    .then((response) => {
      // Handle server response
      if (response.message) {
        alert(`Trip added successfully: ${response.message}`);

        // Clear the form fields
        document.getElementById('trip-destinations-input').value = '';
        document.getElementById('trip-numTravelers-input').value = '';
        document.getElementById('trip-date-input').value = '';
        document.getElementById('trip-duration-input').value = '';

        // Calculate and update total cost with fee
        const totalCostWithFee = calculateTotalCost(newTrip, newTripObject.destinations);

        // Accumulate yearly total
        const yearlyTotalElement = document.querySelector('.yearly');
        const currentYearlyTotal = parseFloat(yearlyTotalElement.innerText.replace(/\$/g, '')) || 0;
        const newYearlyTotal = currentYearlyTotal + totalCostWithFee;
        yearlyTotalElement.innerText = `$${newYearlyTotal.toFixed(2)}`;

        // Generate trip HTML and append it
        const tripHTML = createTripHTML(newTrip, newTripObject.destinations, true);
        pendingTripsSection.innerHTML += tripHTML;
      } else {
        throw new Error("Failed to add trip");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to add new trip. Please try again.");
    });
};

//Book new trip button
const bookNewTripButton = document.getElementById('bookNewTripBtn');
if (bookNewTripButton) {
  bookNewTripButton.addEventListener('click', () => {
    makeNewBooking(newTripObject, userId); 
  });
}

