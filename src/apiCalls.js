const allTravelersData = fetch("http://localhost:3001/api/v1/travelers")
  .then((response) => response.json())
  .then((data) => data.travelers);


export const oneTravelerData = (id) => {
  fetch(`http://localhost:3001/api/v1/travelers/${id}`)
  .then(response => response.json())
  .then(data => console.log(data)); 
}


const allTripsData = fetch("http://localhost:3001/api/v1/trips")
  .then((response) => response.json())
  .then((data) => data.trips);


const allDestinationsData = fetch("http://localhost:3001/api/v1/destinations")
  .then((response) => response.json())
  .then((data) => data.destinations);


  export const addNewTrip = (data) => {
    fetch("http://localhost:3001/api/v1/trips", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => response.json())
    .then(newTrip => {
      console.log("New Trip Added:", newTrip);
      // Update UI here
    })
    .catch(error => console.error('Error:', error));
  };

  
  // export const fetchTravelerData = (id) => {
  //   return fetch(`http://localhost:3001/api/v1/travelers/${id}`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('User data retrieval failed');
  //       }
  //       return response.json();
  //     })
  //     .catch((error) => console.error('Error fetching user data:', error));
  // };
export const promises = [allTravelersData, allTripsData, allDestinationsData];