const allTravelersData = fetch("http://localhost:3001/api/v1/travelers")
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => data.travelers)
  .catch(error => {
    console.error('Error:', error);
  });

export const oneTravelerData = (id) => {
  return fetch(`http://localhost:3001/api/v1/travelers/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      return data; 
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const allTripsData = fetch("http://localhost:3001/api/v1/trips")
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => data.trips)
  .catch(error => {
    console.error('Error:', error);
  });

const allDestinationsData = fetch("http://localhost:3001/api/v1/destinations")
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => data.destinations)
  .catch(error => {
    console.error('Error:', error);
  });

export const addNewTrip = (data) => {
  return fetch("http://localhost:3001/api/v1/trips", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(newTrip => {
    console.log("New Trip Added:", newTrip);
    return newTrip;
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

export const promises = [allTravelersData, allTripsData, allDestinationsData];