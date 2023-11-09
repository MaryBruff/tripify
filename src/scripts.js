import "./css/styles.css";
import { fetchTravelers, fetchTrips, fetchDestinations } from "./apiCalls.js";



Promise.all([fetchTravelers(), fetchTrips(), fetchDestinations()])
  .then((results) => {
    const [travelers, trips, destinations] = results;

    console.log("Travelers:", travelers);
    console.log("Trips:", trips);
    console.log("Destinations:", destinations);
  })
  .catch((error) => {
    console.error("Failed to fetch data:", error);
  });
