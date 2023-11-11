//===Imports===//
import { allTravelersData, allTrips, allDestinations } from "./scripts";
import {displayTraveler, displayTotalCost} from './domUpdates';




//===Functions===//

//filterUserTrips takes in an id, tripsData, and destinationsData and returns an object with two arrays: pending and past
export const filterUserTrips = (id, tripsData, destinationsData) => {
  if (tripsData.find((trip) => trip.userID === id)) {
    const userTrips = tripsData.filter((trip) => trip.userID === id);


    // const userDestinations = userTrips.map((trip) => {
    //   trip.destinationName = destinationsData.find(
    //     (destination) => destination.id === trip.destinationID
    //   ).destination;
    //   return trip;
    // });
    const userDestinations = userTrips.map((trip) => {
      const destination = destinationsData.find(destination => destination.id === trip.destinationID);
      trip.destinationName = destination ? destination.destination : 'Unknown';
      return trip;
    });
    
    return userDestinations.reduce(
      (acc, userTrip) => {
        const tripDate = new Date(userTrip.date);
        const today = new Date();
  
        if (userTrip.status === "approved" && tripDate < today) {
          acc.past.push(userTrip);
        } else if (userTrip.status === "pending") {
          acc.pending.push(userTrip);
        } else if (userTrip.status === "approved" && tripDate >= today) {
          acc.future.push(userTrip);
        }
        return acc;
      },
      {
        pending: [],
        past: [],
        future: [] 
      }
    );
  };
};

export const calculateTripsCost = (id, tripsData, destinationsData) => {
  const currentYear = new Date().getFullYear();
  const userTrips = filterUserTrips(id, tripsData, destinationsData);
  
  // Filter out trips that are not in the current year
  const currentYearTrips = userTrips.past.filter(trip => {
    const tripYear = new Date(trip.date).getFullYear();
    return tripYear === currentYear;
  });
  
  const flightCost = currentYearTrips.reduce((acc, trip) => {
    const destinationFlightCost = destinationsData.find(
      (destination) => destination.id === trip.destinationID
      ).estimatedFlightCostPerPerson;
      acc += trip.travelers * destinationFlightCost;
      return acc;
    }, 0);
    
    const lodgingCost = currentYearTrips.reduce((acc, trip) => {
      const destinationLodgingCost = destinationsData.find(
        (destination) => destination.id === trip.destinationID
        ).estimatedLodgingCostPerDay;
        acc += trip.duration * destinationLodgingCost;
        return acc;
      }, 0);
      
      const agentFee = (flightCost + lodgingCost) * 0.1;
      return flightCost + lodgingCost + agentFee;
    };
    

  export const getDestinationSelections = (destinationsData) => {
      return destinationsData.map(destination => destination.destination);
    }

    export const populateDestinations = (destinationsData) => {
      const destinationSelect = document.getElementById('trip-destinations-input');
      destinationSelect.innerHTML = ''; // Clear existing options
      destinationsData.forEach(destination => {
        destinationSelect.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`;
      });
    };

    export const calculateSingleTripCost = (destinationId, travelers, duration, destinationsData) => {
      const destination = destinationsData.find(dest => dest.id === parseInt(destinationId));
      if (destination) {
        const flightCost = destination.estimatedFlightCostPerPerson * travelers;
        const lodgingCost = destination.estimatedLodgingCostPerDay * duration * travelers;
        return flightCost + lodgingCost;
      }
      return 0;
    };

    export const updateTripObject = (newTripObject, newTrip) => {
      newTripObject.trips.push(newTrip);
      console.log("Updated newTripObject with new trip:", newTripObject);
    
      // Update UI components
      displayFutureUserTrips(newTrip.userID, newTripObject.trips, newTripObject.destinations);
      // ... any other UI updates needed
    };

    //login??
    // export function validateCredentials(username, password) {
    //   // Implement your validation logic here
    //   return username === 'traveler50' && password === 'travel';
    // }
    
    // export function extractUserId(username) {
    //   // Assuming username is in the format "traveler" followed by the ID
    //   const idPart = username.split('traveler')[1];
    //   return idPart ? parseInt(idPart, 10) : null;
    // }

    
