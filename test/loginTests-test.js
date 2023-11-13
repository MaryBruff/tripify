import { expect } from "chai";
import { travelersData } from "../src/Data/sample-test-data";
import { userLogin } from "../src/functions.js";

describe("userLogin", () => {
    it("should return an error for incorrect password", () => {
        const result = userLogin("traveler1", "wrongPassword", travelersData);
        expect(result).to.deep.equal({ error: "Incorrect Password!" });
    });

    it("should return an error if the user does not exist", () => {
        const result = userLogin("traveler999", "travel", travelersData);
        expect(result).to.deep.equal({ error: "User 999 does not exist." });
    });

    it("should return user details on successful login", () => {
        const result = userLogin("traveler1", "travel", travelersData);
        expect(result).to.deep.equal({ userId: 1, userName: "Ham Leadbeater" });
    });

    it("should return an error for invalid username format", () => {
        const result = userLogin("invalidUser", "travel", travelersData);
        expect(result).to.deep.equal({ error: "Invalid Username Format" });
    });
});
