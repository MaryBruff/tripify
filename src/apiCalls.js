 export const allTravelersData = fetch('http://localhost:3001/api/v1/travelers')
  .then(response => response.json())
  .then(data => data.travelers);

const oneTravelerData = (id) => {
  fetch(`http://localhost:3001/api/v1/travelers/${id}`)
  .then(response => response.json())
  .then(data => console.log(data)); 
}

const allTripsData = fetch('http://localhost:3001/api/v1/trips')
  .then(response => response.json())
  .then(data => data.trips);

const allDestinationsData = fetch('http://localhost:3001/api/v1/destinations')
  .then(response => response.json())
  .then(data => data.destinations);




export const addNewTrip = (data) => {
  fetch('http://localhost:3001/api/v1/trips', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => console.log(data));
};

export const promises = [
  allTravelersData,
  allTripsData,
  allDestinationsData,
];