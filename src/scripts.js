import "./css/styles.css";
import { promises, addNewTrip } from './apiCalls.js';
import { populateDestinations, displayUserTrips, createTripHTML, calculateTotalCost } from './domUpdates';
import { userLogin } from "./functions";

// === Global Variables & Selectors === //
export let newTripObject = {};
let userId = null;

const loginButton = document.querySelector('#login-button-input');
const userName = document.getElementById('login-username-input');
const password = document.getElementById('login-password-input');
const logoutButton = document.querySelector('.main-page-logout');
const bookNewTripButton = document.getElementById('bookNewTripBtn');
const messageContainer = document.getElementById('messageContainer');

// === Helper Functions === //
const updateVisibility = (showMainPage) => {
  document.getElementById('loginSection').style.display = showMainPage ? 'none' : 'block';
  document.getElementById('mainPage').style.display = showMainPage ? 'block' : 'none';
};

const resetLoginForm = () => {
  userName.value = '';
  password.value = '';
  document.getElementById('loginErrorMessage').innerText = '';
};

const handleLogin = (e) => {
  e.preventDefault();
  const result = userLogin(userName.value, password.value, newTripObject.travelers);
  if (result.error) {
    document.getElementById('loginErrorMessage').innerText = result.error;
  } else {
    userId = result.userId;
    updateMainPage(userId, result.userName);
  }
};

const updateMainPage = (userId, userName) => {
  console.log("Updating main page for user:", userId, "Username:", userName);
  displayUserTrips(userId, newTripObject.trips, newTripObject.destinations, 'past');
  displayUserTrips(userId, newTripObject.trips, newTripObject.destinations, 'pending');
  document.querySelector('.welcome').textContent = `Welcome back, ${userName}!`;
  updateVisibility(true);
};

// === Event Listeners === //
loginButton.addEventListener('click', handleLogin);
document.querySelector('.login-form').addEventListener('submit', handleLogin);


window.onload = () => {
  Promise.all(promises)
    .then(response => {
      const [allTravelersData, allTripsData, allDestinationsData] = response;
      newTripObject.travelers = allTravelersData;
      newTripObject.trips = allTripsData;
      newTripObject.destinations = allDestinationsData;
      populateDestinations(allDestinationsData);
    })
    .catch(error => console.log('Request failed from Promise.all', error));
};

bookNewTripButton.addEventListener('click', (event) => {
  event.preventDefault();
  makeNewBooking(newTripObject, userId);
});

logoutButton.addEventListener('click', () => {
  updateVisibility(false);
  resetLoginForm();
});

//Create new booking
export const makeNewBooking = (newTripObject, userId) => {
  const destinationId = document.getElementById('trip-destinations-input').value;
  const travelers = parseInt(document.getElementById('trip-numTravelers-input').value);
  const date = document.getElementById('trip-date-input').value.replace(/-/g, '/');
  const duration = parseInt(document.getElementById('trip-duration-input').value);
  const messageContainer = document.getElementById('messageContainer');
  
  // Validate input
  if (!userId || isNaN(travelers) || isNaN(duration)) {
    console.error('Invalid input for booking a trip');
    messageContainer.textContent = 'Invalid input for booking a trip. Please check your entries.';
    messageContainer.classList.add('error-message');
    return;
  }

  // Convert input date to Date object and get current date
  const inputDate = new Date(date);
  const currentDate = new Date();

// Check if the input date is in the past
if (inputDate < currentDate) {
  console.error('Cannot book a trip for a past date');
  messageContainer.textContent = 'Cannot book a trip for a past date.';
  messageContainer.classList.add('error-message');
  messageContainer.classList.remove('success-message');
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
        if (response.message) {
          messageContainer.textContent = `Trip added successfully: ${response.message}`;
          messageContainer.classList.remove('error-message');
          messageContainer.classList.add('success-message');

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
        const tripHTML = createTripHTML(newTrip, newTripObject.destinations, true);
        pendingTripsSection.innerHTML += tripHTML;
      } else {
        throw new Error("Failed to add trip");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      messageContainer.textContent = 'Failed to add new trip. Please try again.';
      messageContainer.classList.add('error-message');
    });
};

