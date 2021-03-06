// main file for LIRI node app

// global variables
	// grab code from keys.js file:
var client = require("./keys.js");
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
	// if command entered is "movie-this" then call omdbAPI
	if (functionRequest === "movie-this") {
		if (movieOrSong) {
		omdbAPI(movieOrSong);
		}	
		else {
			var movieOrSong = "Mr. Nobody";
			omdbAPI(movieOrSong);
			console.log(movieOrSong);	
		}
	} 
	// if command entered is "spotify-this-song" then call spotify API
	else if (functionRequest === "spotify-this-song") {
		if (movieOrSong) {
			mySpotify(movieOrSong) 
		}
		else {
			var movieOrSong = "The Sign";
			mySpotify(movieOrSong);
			console.log(movieOrSong);
		}
	}
} // close function

// this function will make a request to the omdbAPI and 
    // return title, year, rating, location, language, plot, actors, etc
function omdbAPI(movieOrSong) {	
	// Include the request npm package (remember to run "npm install request" in this folder)
	var request = require("request");
	var queryUrl = "http://www.omdbapi.com/?t=" + movieOrSong + "&y=&plot=short&apikey=40e9cece";
	// Then run a request to the OMDB API with the movie specified
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
	  	var logData = "Title: " + JSON.parse(body).Title + ", " + "ReleaseYr: " + JSON.parse(body).Year + ", " + "IMDB: " + JSON.parse(body).imdbRating + ", " + "Actors: " + JSON.parse(body).Actors + ", " + "Countries: " + JSON.parse(body).Country + ", "+ ", " + "Plot: " + JSON.parse(body).Plot + "|";
	  	// calls function to write results to txt file
	    logResults(logData);
	  } // close if statement
	}); // close response function
} // close omdb function

// this function will grab and show last 20 tweets and show the time/date they were created
function myTwitter() {
    // get only 20 most recent tweets
    var params = {count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if(error) throw error;
	  // loop through object for each tweet and return text & time/date
	  for (var i = 0; i < 20; i++) {
	  console.log("Tweeted: " + tweets[i].text);
	  console.log("On: " + tweets[i].created_at); 
	  console.log("--------------------------");
	  var logData = "Tweeted: " + tweets[i].text + ", " + "Date_Time: " + tweets[i].created_at + "|";
	  // calls function to write results to txt file
	  logResults(logData);
	  } 
	});
}

// this function will call Spotify api and return info on song
function mySpotify(movieOrSong) {
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify({
	  id: "2d42f82af6224f07993b3b395db068ad",
	  secret: "2221dcc9fe6647d39484170ccb5518d2"
	});
	// call api using search method
	spotify.search({ type: 'track', query: movieOrSong, limit: 1 }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  }
	// uncomment to see entire JSON object
	// console.log(JSON.stringify(data, null, 2));
	// artist name
	var band = data.tracks.items[0].album.artists[0].name;
	console.log("Artist: " + band);
	// song name
	var song = data.tracks.items[0].name;
	console.log("Song: " + song);
	// preview URL
	var preview = data.tracks.items[0].preview_url;
	console.log("Preview URL: " + preview);
	// album name
	var album = data.tracks.items[0].album.name;
    console.log("Album: " + album);
    console.log("-------------------------------------------------");
    var logData = "Artist: " + band + ", " + "Song: " + song + ", " + "Album: " + album + ", " + "Preview_URL: " + preview +"|";
	// calls function to write results to txt file
    logResults(logData);
	});
}

// this function will take text from random.txt file and use to call LIRI command
function doWhatItSays() {
	// uses fs module to read data from random.txt file
	fs.readFile('random.txt',"utf8", function(err, data) {
	  if (err) throw err;
	  //splits text file by comma and stores in array res
	  var res = data.split(',');
	  // grabs second element in array and passes as arg in function called
	  mySpotify(res[1]);
	});
}

// this function uses fs module to write results to txt file log.txt
function logResults(logData) {
	// append logData from results to log.txt file
	fs.appendFile('log.txt', logData, (err) => {
		if (err) throw err;
	});
}













