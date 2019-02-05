require("dotenv").config();
process.argv.splice(0,2);

var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");


var command = process.argv[0].toLowerCase();
var val = process.argv.slice(1).join("+");

switch (command) {
    case "spotify-this-song":

    break;
    case "concert-this":
        console.log("Gathering event info for " + val.replace("+", " "))
        axios.get("https://rest.bandsintown.com/artists/" + val + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var data = response.data;
            data.forEach(function(event) {
                var venue = event.venue;
                console.log(`Playing at ${venue.name} in ${venue.city}, ${venue.region}, ${venue.country}`);
            })
        });
    break;
    case "movie-this":
    
    break;
    case "do-what-it-says":

    break;
    case "help":

    break;
    default: 
        console.log('Invalid command, type "help" for instructions');
    break;
}