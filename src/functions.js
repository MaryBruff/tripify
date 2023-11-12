//===Imports===//
import { allTravelersData, allTrips, allDestinations } from "./scripts";
import {displayTraveler, displayTotalCost, displayFutureUserTrips } from './domUpdates';


//===Functions===//

//filterUserTrips takes in an id, tripsData, and destinationsData and returns an object with two arrays: pending and past
export const filterUserTrips = (id, tripsData, destinationsData) => {
  if (tripsData.find((trip) => trip.userID === id)) {
    const userTrips = tripsData.filter((trip) => trip.userID === id);
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

//===Calculate Trips Cost===//

export const calculateTripsCost = (id, tripsData, destinationsData) => {
  const currentYear = new Date().getFullYear();
  const userTrips = filterUserTrips(id, tripsData, destinationsData);

  // Filter out trips that are not in the current year
  const currentYearTrips = userTrips.past.filter(trip => {
    const tripYear = new Date(trip.date).getFullYear();
    return tripYear === currentYear;
  });

  // Calculate total cost for each trip, including the agent's fee
  const totalCostIncludingAgentFee = currentYearTrips.reduce((acc, trip) => {
    const destination = destinationsData.find(destination => destination.id === trip.destinationID);

    // Calculate the flight and lodging cost for the trip
    const flightCost = trip.travelers * (destination ? destination.estimatedFlightCostPerPerson : 0);
    const lodgingCost = trip.duration * (destination ? destination.estimatedLodgingCostPerDay : 0);

    // Add the agent's 10% fee to this trip's cost
    const tripTotalCost = flightCost + lodgingCost;
    const agentFee = tripTotalCost * 0.1; // 10% fee

    // Accumulate the total cost including the agent's fee
    return acc + tripTotalCost + agentFee;
  }, 0);

  return totalCostIncludingAgentFee;
};


//Single Trip Cost//
export const calculateSingleTripCost = (destinationId, travelers, duration, destinationsData) => {
  const destination = destinationsData.find(dest => dest.id === parseInt(destinationId));
  if (destination) {
    const flightCost = destination.estimatedFlightCostPerPerson * travelers;
    const lodgingCost = destination.estimatedLodgingCostPerDay * duration * travelers;
    return flightCost + lodgingCost;
  }
  return 0;
};


//destinationSelections takes in destinationsData and returns an array of destinations
  export const getDestinationSelections = (destinationsData) => {
      return destinationsData.map(destination => destination.destination);
    }

    export const populateDestinations = (destinationsData) => {
      const destinationSelect = document.getElementById('trip-destinations-input');
      destinationSelect.innerHTML = '';
      destinationsData.forEach(destination => {
        destinationSelect.innerHTML += `<option value="${destination.id}">${destination.destination}</option>`;
      });
    };



    export const updateTripObject = (newTripObject, newTrip) => {
      newTripObject.trips.push(newTrip);
      console.log("Updated newTripObject with new trip:", newTripObject);
    
      // Update UI components
      displayFutureUserTrips(newTrip.userID, newTripObject.trips, newTripObject.destinations);
    };

