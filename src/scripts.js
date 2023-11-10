import "./css/styles.css";

import {promises} from './apiCalls.js';

import {displayPastUserTrips, displayPendingUserTrips} from './domUpdates'





// === GLobal === //
export let newTripObject = {};




const mainPageLoad = () => {
  displayPastUserTrips(2, newTripObject.trips, newTripObject.destinations);
  displayPendingUserTrips(2, newTripObject.trips, newTripObject.destinations)
  console.log('newTripObject',newTripObject)
}

window.addEventListener('load', () => {
  Promise.all(promises)
  .then(response => {
    const [allTravelersData, allTripsData, allDestinationsData] = response;
    newTripObject.travelers = allTravelersData;
    newTripObject.trips = allTripsData;
    newTripObject.destinations = allDestinationsData;
  })
  .then(mainPageLoad)
});


//buttons not working will check back later 

// pastTripsButton.addEventListener('click', () => {
//   if (currentUserId !== null) {
//     displayPastUserTrips(currentUserId, mainData.trips, mainData.destinations);
//   } else {
//     console.error('No user is currently logged in.');
//   }
// });

// pendingTripsButton.addEventListener('click', () => {
//   if (currentUserId !== null) {
//     displayPendingUserTrips(currentUserId, mainData.trips, mainData.destinations);
//   } else {
//     console.error('No user is currently logged in.');
//   }
// });

// futureTripsButton.addEventListener('click', () => {
//   if (currentUserId !== null) {
//     displayFutureUserTrips(currentUserId, mainData.trips, mainData.destinations);
//   } else {
//     console.error('No user is currently logged in.');
//   }
// });


















// const initDashboard = () => {
//   const fetchPromises = [fetchTravelers(), fetchTrips(), fetchDestinations()];

//   Promise.all(fetchPromises).then((data) => {
//     travelers = data[0].travelers;
//     trips = data[1].trips;
//     destinations = data[2].destinations;

//     // Assuming currentUser is set after login and represents the logged in user
//     const userTrips = getTripData(currentUser.id, trips);
//     const currentDate = new Date(); // Today's date for categorizing trips
//     const { pastTrips, upcomingTrips, pendingTrips } = categorizeTrips(userTrips, currentDate);
//     const userDestinations = getDestinationData(userTrips, destinations);

//     // Display trips on the dashboard
//     displayUserTrips(pastTrips, upcomingTrips, pendingTrips, userDestinations);
//   }).catch(error => {
//     console.error("Error initializing dashboard:", error);
//   });
// };

// window.addEventListener("load", initDashboard);













  // document.addEventListener('DOMContentLoaded', () => {
  //   const loginForm = document.querySelector('.login-form');
  //   const logoutButton = document.getElementById('logout-button');
  
  //   loginForm.addEventListener('submit', (event) => {
  //     event.preventDefault();
  //     const username = document.getElementById('login-username-input').value;
  //     const password = document.getElementById('login-password-input').value;
  
  //     if (validateCredentials(username, password)) {
  //       const userId = getUserIdFromUsername(username);
  //       loginUpdates.showMainPage(userId);
  //     } else {
  //       loginUpdates.displayLoginError('Invalid username or password.');
  //     }
  //   });
  
  //   logoutButton.addEventListener('click', () => {
  //     loginUpdates.showLoginPage();
  //   });
  // });
  

