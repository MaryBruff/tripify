//===Imports===//
import { allTravelersData, allTrips, allDestinations } from "./scripts";
import {displayTraveler, displayTotalCost} from './domUpdates';

//===Functions===//

//filterUserTrips takes in an id, tripsData, and destinationsData and returns an object with two arrays: pending and past
export const filterUserTrips = (id, tripsData, destinationsData) => {
  if (tripsData.find((trip) => trip.userID === id)) {
    const userTrips = tripsData.filter((trip) => trip.userID === id);
    const userDestinations = userTrips.map((trip) => {
      trip.destinationName = destinationsData.find(
        (destination) => destination.id === trip.destinationID
      ).destination;
      return trip;
    });
    return userDestinations.reduce(
      (acc, userTrip) => {
        if (userTrip.status === "approved") {
          acc.past.push(userTrip);
        } else if (userTrip.status === "pending") {
          acc.pending.push(userTrip);
        }
        return acc;
      },
      {
        pending: [],
        past: [],
      }
    );
  } else {
    return `User ${id} cannot be found`;
  }
};

//calculateTripsCost takes in an id, tripsData, and destinationsData and returns the total cost of all past trips
export const calculateTripsCost = (id, tripsData, destinationsData) => {
  const userTrips = filterUserTrips(id, tripsData, destinationsData);
  const flightCost = userTrips.past.reduce((acc, trip) => {
    const destinationFlightCost = destinationsData.find(
      (destination) => destination.id === trip.destinationID
    ).estimatedFlightCostPerPerson;
    acc += trip.travelers * destinationFlightCost;
    return acc;
  }, 0);
  const lodgingCost = userTrips.past.reduce((acc, trip) => {
    const destinationLodgingCost = destinationsData.find(
      (destination) => destination.id === trip.destinationID
    ).estimatedLodgingCostPerDay;
    acc += trip.duration * destinationLodgingCost;
    return acc;
  }, 0);
  const agentFee = (flightCost + lodgingCost) * 0.1;
  return flightCost + lodgingCost + agentFee;
};


//===Starting login===//
export const validateCredentials = (username, password) => {
  return username === "traveler50" && password === "travel";
};

export const getUserIdFromUsername = (username) => {
  return username.replace("traveler", "");
};
