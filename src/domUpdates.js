//===Imports===//
import { filterUserTrips } from "./functions";





//==Selectors==//

//sections
const pastTripsSection = document.getElementById("pastTripsSection");
const pendingTripsSection = document.getElementById("pendingTripsSection");
const futureTripsSection = document.getElementById("futureTripsSection");

//buttons 
const pendingTripsButton = document.getElementById('pendingTripsButton');
const futureTripsButton = document.getElementById('futureTripsButton');





//==Functions==//
export const displayPastUserTrips = (id, tripsData, destinationsData) => {
  const sortedUserTrips = filterUserTrips(id, tripsData, destinationsData);
  sortedUserTrips.past.forEach((trip) => {
    console.log('trip', trip)
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



export const loginUpdates = {
  showMainPage: (userId) => {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("mainPage").classList.remove("hidden");
    document.getElementById("userName").textContent = `User ID: ${userId}`;
  },
  showLoginPage: () => {
    document.getElementById("mainPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("userName").textContent = "";
  },
  displayLoginError: (message) => {
    document.getElementById("loginErrorMessage").textContent = message;
  },
};

