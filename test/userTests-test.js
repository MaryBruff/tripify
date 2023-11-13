import { expect } from "chai";
import { destinationsData, tripsData } from "../src/Data/sample-test-data";
import { filterUserTrips } from "../src/functions.js";

describe("filterUserTrips", () => {
    it("should return pending trips for a given user", () => {
        const userId = 3;
        const customTripsData = [
            ...tripsData,
            {
                id: 6,
                userID: 3,
                destinationID: 2,
                travelers: 2,
                date: "2023/11/12",
                duration: 5,
                status: "pending",
                suggestedActivities: []
            }
        ];
        const result = filterUserTrips(userId, customTripsData, destinationsData);

        expect(result).to.have.property("pending").with.lengthOf(1);
        expect(result.pending[0]).to.deep.include({ userID: 3, status: "pending" });
        expect(result.pending[0].destinationName).to.equal("Stockholm, Sweden");
    });

    it("should correctly categorize trips of a given user", () => {
        const result = filterUserTrips(3, tripsData, destinationsData);
        expect(result).to.be.an("object");
        expect(result.past).to.be.an("array");
        expect(result.pending).to.be.an("array");
    });

    it("should handle a user with no trips", () => {
        const result = filterUserTrips(999, tripsData, destinationsData);
        expect(result).to.deep.equal({ pending: [], past: [] });
    });

    it("should return past approved trips for a given user", () => {
        const userId = 3;
        const customTripsData = [
            {
                id: 7,
                userID: 3,
                destinationID: 2,
                travelers: 1,
                date: "2020/01/01",
                duration: 7,
                status: "approved",
                suggestedActivities: []
            }
        ];
        const result = filterUserTrips(userId, customTripsData, destinationsData);

        expect(result).to.have.property("past").with.lengthOf(1);
        expect(result.past[0]).to.deep.include({ userID: 3, status: "approved" });
        expect(new Date(result.past[0].date)).to.be.below(new Date());
        expect(result.past[0].destinationName).to.equal("Stockholm, Sweden");
    });

    it("should return both pending and past trips for a given user", () => {
        const userId = 3;
        const customTripsData = [
            {
                id: 8,
                userID: 3,
                destinationID: 2,
                travelers: 1,
                date: "2020/01/01",
                duration: 7,
                status: "approved",
                suggestedActivities: []
            },
            {
                id: 9,
                userID: 3,
                destinationID: 2,
                travelers: 2,
                date: "2023/11/12",
                status: "pending",
                suggestedActivities: []
            }
        ];
        const result = filterUserTrips(userId, customTripsData, destinationsData);

        expect(result).to.have.property("past").with.lengthOf(1);
        expect(result).to.have.property("pending").with.lengthOf(1);
        expect(result.past[0]).to.deep.include({ userID: 3, status: "approved" });
        expect(result.pending[0]).to.deep.include({ userID: 3, status: "pending" });
        expect(new Date(result.past[0].date)).to.be.below(new Date());
        expect(result.past[0].destinationName).to.equal("Stockholm, Sweden");
        expect(result.pending[0].destinationName).to.equal("Stockholm, Sweden");
    });

    it("should set destinationName to 'Unknown' if destinationID is not in destinationsData", () => {
        const userId = 3;
        const customTripsData = [
            {
                id: 10,
                userID: 3,
                destinationID: 999,
                travelers: 1,
                date: "2023/11/12",
                duration: 5,
                status: "pending",
                suggestedActivities: []
            }
        ];
        const result = filterUserTrips(userId, customTripsData, destinationsData);

        expect(result.pending[0]).to.deep.include({
            userID: 3,
            destinationID: 999,
            destinationName: "Unknown"
        });
    });

    it("should handle invalid user IDs correctly", () => {
        const invalidUserIds = [9999, -1, "invalid"];
        invalidUserIds.forEach(invalidId => {
            const result = filterUserTrips(invalidId, tripsData, destinationsData);
            expect(result).to.deep.equal({
                pending: [],
                past: []
            });
        });
    });

    it("should handle empty tripsData correctly", () => {
        const userId = 3;
        const emptyTripsData = [];
        const result = filterUserTrips(userId, emptyTripsData, destinationsData);

        expect(result).to.deep.equal({
            pending: [],
            past: []
        });
    });

    it("should handle empty destinationsData correctly", () => {
        const userId = 3;
        const emptyDestinationsData = [];
        const result = filterUserTrips(userId, tripsData, emptyDestinationsData);

        expect(result.pending.every(trip => trip.destinationName === "Unknown")).to.be.true;
        expect(result.past.every(trip => trip.destinationName === "Unknown")).to.be.true;
    });

    it("should return empty arrays if there are no trips for the given user ID", () => {
        const userId = 999;
        const result = filterUserTrips(userId, tripsData, destinationsData);

        expect(result).to.deep.equal({
            pending: [],
            past: []
        });
    });
});


