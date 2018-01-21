// write the code you need to grab the data from keys.js. 
// Then store the keys in a variable.



// Make it so liri.js can take in one of the following commands:

//    * `my-tweets`

//    * `spotify-this-song`

//    * `movie-this`

//    * `do-what-it-says`

// global variables
var fs = require('fs');
var request = require('request');
var functionRequest = process.argv[2];
// Store all of the arguments in an array
var nodeArgs = process.argv;

// this function takes the user arguments and calls the appropriate function for calling correct API
function search() {
	if (functionRequest === "movie-this") {
		// omdbAPI();
		normalizeUserEntry();
	}
	else if (functionRequest === "my-tweets") {
		myTwitter();
	}
	else if (functionRequest === "spotify-this-song") {
		// mySpotify();
		normalizeUserEntry();
	}
	else if (functionRequest === "do-what-it-says") {
		doWhatItSays();
	}
	else {
		console.log('"' + functionRequest + '"' + " is an invalid request. Please enter valid request.")
	}
}
// calls function on load
search();

// this function is called if user argument is movie or spotify search. Will concat multi word movies/songs
function normalizeUserEntry() {
	// Create a variable for holding the first word of movie name aka: first arg
	var movieOrSong = nodeArgs[3];
	// Loop through all the words in the node argument entered by user
	for (var i = 3; i < nodeArgs.length; i++) {
	// if movie name is longer than single word, concatenate all word and assign to var
	  if (i > 3 && i < nodeArgs.length) {
	    movieOrSong = movieOrSong + "+" + nodeArgs[i];
	  }
	  // otherwise, if just single arg for movie name then assign to var 
	  else if (nodeArgs.length < 5) {
	    movieOrSong = nodeArgs[3];
	  }
	}
	// and call omdbAPI
	if (functionRequest === "movie-this") {
		omdbAPI(movieOrSong);
	}
	else if (functionRequest === "spotify-this-song") {
		mySpotify(movieOrSong) 
	}
}


// this function will make a request to the omdbAPI and 
    // return title, year, rating, location, language, plot, actors, etc
function omdbAPI(movieOrSong) {	
	// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
	var request = require("request");

	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieOrSong + "&y=&plot=short&apikey=40e9cece";

	request(queryUrl, function(error, response, body) {

	  // If the request is successful
	  if (!error && response.statusCode === 200) {
	  	// console.log(JSON.parse(body));
	    // Parse the body of the api response and retreive just the following:
	    console.log("Title: " + JSON.parse(body).Title);
	    console.log("Release Year: " + JSON.parse(body).Year);
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	   	// var tomatoe = JSON.parse(body).Ratings[1];
	    // var tomatoeRating = tomatoe["Value"];
	    // console.log("Rotten Tomatoes Rating: " + tomatoeRating);
	    console.log("Countries Produced: " + JSON.parse(body).Country);
	    console.log("Language: " + JSON.parse(body).Language);
	    console.log("Plot: " + JSON.parse(body).Plot);
	    console.log("Starring: " + JSON.parse(body).Actors);
	    console.log("-------------------------------------------------");
	  } // close if statement
	}); // close response function
} // close omdb function

// this function will grab and show last 20 tweets and show the time/date they were created
function myTwitter() {
	console.log("YES! You just tried to search the Twitter API");

    // will need to pass consumer_key, consumer_secret, access_token_key
    // and access_token_secret to twitter

    // find a way to look at tweets and only show 20 most recent tweets
}

// this function will 
function mySpotify(movieOrSong) {

	var Spotify = require('node-spotify-api');
	 
	var spotify = new Spotify({
	  id: "2d42f82af6224f07993b3b395db068ad",
	  secret: "2221dcc9fe6647d39484170ccb5518d2"
	});

	spotify.search({ type: 'track', query: movieOrSong, limit: 1 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	// uncomment to see entire JSON object
	// console.log(JSON.stringify(data, null, 2));

	var band = data.tracks.items[0].album.artists[0].name;
	console.log("Artist: " + band);

	var song = data.tracks.items[0].name;
	console.log("Song: " + song);

	var preview = data.tracks.items[0].preview_url;
	console.log("Preview URL: " + preview);

	var album = data.tracks.items[0].album.name;
    console.log("Album: " + album);
    console.log("-------------------------------------------------");
	});
}

function doWhatItSays() {
	console.log("YES! You just tried to search the blah API");

}
















