//Set up constant values
const api_key = '2aMRnPooBzIzAuqQpghLapKirW9whohVRS2Ioyy8'; 
const endpointURL = 'https://developer.nps.gov/api/v1/parks?';
//Format query string for endPoint URL using encodeURIComponent to encode the query parameters. Check out https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent to learn more.
function formatQueryString(params) {
  //Created an array to store the array of 'Query Parameter' objects
  const items = [];
  //Loop through the "query parameter" objects to format an array of query strings as such 'api_key=api_key',
  Object.entries(params).forEach(([k, v]) => {
    items.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`) 
  });
  //then append '&' to queryString
  const queryString = items.join('&');
  return queryString;
}

//This function appends our JSON response to a an un-ordered list
function displayLists(JSONresponse) {
  $('#listItems').empty();
  for (let i = 0; i < JSONresponse.data.length; i++) {
    $('#listItems').append(
      `<li><h2 style="color: #800000">${JSONresponse.data[i].name}</h2>
      <p>${JSONresponse.data[i].description}</p>
      <p><i>${JSONresponse.data[i].url}</i></p>
      </li>`
    )};
  $('#results').removeClass('hidden');
};

function getParks(stateCode, limit) {
  //lets format our "query parameter" objects with our api_key, stateCode and limit.
  const queryString = formatQueryString({
    api_key: api_key, 
    stateCode: stateCode,
    limit: limit
  });
  //We format our complete url
  const url = `${endpointURL}${queryString}`;
  //fetch data from the URL
  fetch(url)
    .then((response) => {
      //we return our response as json if we get data back through the API's endpoint
      if (response.ok && limit > 0) {
        return response.json();
      }
      $('#errorMessage').text(response.statusText);
    })
    //lets render our JSON response
    .then(JSONresponse => {
      displayLists(JSONresponse);
    })
    .catch((err) => {
      $('#listItems').empty();
      $('#errorMessage').text(`Something went wrong with your request! Try again`);
    });
}

$(function() {
  $('#searchForm').submit(event => {  
    event.preventDefault();
    const searchTerm = $('#searchTerm').val();
    const limit = $('#maxResults').val();
    getParks(searchTerm, limit);
  });
});
