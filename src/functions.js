//===Functions===//

//Filter User Trips//
export const filterUserTrips = (id, tripsData, destinationsData) => {
  const userTrips = tripsData.filter((trip) => trip.userID === id);

  // Handle case when no trips are found for the user for sad test
  if (userTrips.length === 0) {
    return {
      pending: [],
      past: [],
    };
  }

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
      }
      return acc;
    },
    {
      pending: [],
      past: [],
    }
  );
};

//=== Calculate total cost for a single trip or all trips in the current year ===// 
export const calculateTripCosts = (idOrDestinationId, tripsData, destinationsData, isSingleTrip = false, travelers = 0, duration = 0, includePendingTrips = false) => {
  const calculateCost = (destinationId, travelers, duration) => {
    const destination = destinationsData.find(dest => dest.id === parseInt(destinationId));
    if (destination) {
      const flightCost = destination.estimatedFlightCostPerPerson * travelers;
      const lodgingCost = destination.estimatedLodgingCostPerDay * duration * travelers;
      return flightCost + lodgingCost;
    }
    return 0;
  };

  if (isSingleTrip) {
    // Calculate cost for a single trip
    return calculateCost(idOrDestinationId, travelers, duration);
  } else {
    // Calculate total cost for all trips in the current year
    const currentYear = new Date().getFullYear();

    // Filter trips based on the year and possibly the status
    const filteredTrips = filterUserTrips(idOrDestinationId, tripsData, destinationsData);
    const currentYearTrips = (includePendingTrips ? [...filteredTrips.past, ...filteredTrips.pending] : filteredTrips.past)
      .filter(trip => {
        const tripYear = new Date(trip.date).getFullYear();
        return tripYear === currentYear;
      });

    // Calculate total cost for each trip, including the agent's fee
    return currentYearTrips.reduce((acc, trip) => {
      const tripCost = calculateCost(trip.destinationID, trip.travelers, trip.duration);
      const agentFee = tripCost * 0.1; // 10% fee
      return acc + tripCost + agentFee;
    }, 0);
  }
};


















// export const logInValidation = (username, password, travelersData) => {
//   let userId = 0;
//   if (password === 'travel'){
//     const parts = username.split('traveler');
//     userId = parts[1];
//   } else {
//     return 'Incorrect Password!';
//   }
//   if (!travelersData.find(traveler => traveler.id === Number(userId))) {
//     return `User ${userId} does not exist.`
//   }
//   return Number(userId);
// }
