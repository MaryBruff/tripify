import { expect } from 'chai';
import { destinationsData, travelersData, tripsData } from '../src/Data/sample-test-data';
import { calculateTripCosts, filterUserTrips } from "../src/functions.js"

describe('calculateTripCosts', () => {
    let userId, currentYear, destinationId, trip, cost, expectedCost, totalCost, expectedTotalCost, invalidDestinationId, travelers, duration, modifiedTripsData, includePendingTrips;

    beforeEach(() => {
        userId = 1; 
        currentYear = new Date().getFullYear(); 
        destinationId = 1;
        trip = tripsData.find(trip => trip.id === 1); 
        invalidDestinationId = 999; 
        travelers = 2; 
        duration = 5; 
        includePendingTrips = true; 
        modifiedTripsData = tripsData.filter(trip => new Date(trip.date).getFullYear() !== currentYear);
        totalCost = 0;
        expectedTotalCost = 0;
        expectedCost = 0;
    });

    it('should correctly calculate the cost for a single trip', () => {
        cost = calculateTripCosts(destinationId, tripsData, destinationsData, true, trip.travelers, trip.duration);
        expectedCost = 960; 

        expect(cost).to.equal(expectedCost);
    });

    it('should handle invalid destination ID correctly', () => {
        cost = calculateTripCosts(invalidDestinationId, tripsData, destinationsData, true, travelers, duration);
        expectedCost = 0;

        expect(cost).to.equal(expectedCost);
    });

    it('should accurately calculate the total cost for all trips in the current year', () => {
        totalCost = calculateTripCosts(userId, tripsData, destinationsData, false);
        calculateExpectedTotalCost(tripsData, currentYear, userId); 

        expect(totalCost).to.equal(expectedTotalCost);
    });

    it('should return the correct total when there are no trips for the current year', () => {
        totalCost = calculateTripCosts(userId, modifiedTripsData, destinationsData, false);
        expectedCost = 0; 

        expect(totalCost).to.equal(expectedCost);
    });

    it('should correctly calculate and add the agent\'s fee to each trip\'s cost', () => {
        totalCost = calculateTripCosts(userId, tripsData, destinationsData, false, 0, 0, includePendingTrips);
        calculateExpectedTotalCostWithAgentFee(tripsData, userId, includePendingTrips); 
    });

    // Helper function to calculate expected total cost
    function calculateExpectedTotalCost(data, year, uid) {
        data.forEach(trip => {
            if (new Date(trip.date).getFullYear() === year && trip.userID === uid) {
                addTripCost(trip);
            }
        });
    }

    // Helper function to calculate expected total cost with agent's fee
    function calculateExpectedTotalCostWithAgentFee(data, uid, pending) {
        data.forEach(trip => {
            if (trip.userID === uid && (trip.status === 'approved' || (pending && trip.status === 'pending'))) {
                addTripCost(trip);
            }
        });
    }
    // Helper function to add cost of a single trip to the total
    function addTripCost(trip) {
        const destination = destinationsData.find(dest => dest.id === trip.destinationID);
        if (destination) {
            const tripCost = (destination.estimatedFlightCostPerPerson * trip.travelers) + 
                             (destination.estimatedLodgingCostPerDay * trip.duration * trip.travelers);
            const agentFee = tripCost * 0.1; // Assuming a 10% fee
            expectedTotalCost += tripCost + agentFee;
        }
    }
});
