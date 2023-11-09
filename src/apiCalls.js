// Function to fetch travelers
export const fetchTravelers = () => {
  return fetch("http://localhost:3001/api/v1/travelers")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
};

// Function to fetch trips
export const fetchTrips = () => {
  return fetch("http://localhost:3001/api/v1/trips")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
};

// Function to fetch destinations
export const fetchDestinations = () => {
  return fetch("http://localhost:3001/api/v1/destinations")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
};
