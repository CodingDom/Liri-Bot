require("dotenv").config();
process.argv.splice(0,2);

var keys = require("./keys.js");
var colors = require("./log-colors.js").logColors;
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");

var command = process.argv[0]?process.argv[0].toLowerCase():"help";
var val = process.argv.slice(1).join("+");

switch (command) {
    case "concert-this":
        console.log("Liri is now gathering event info for " + val.replace("+", " "))
        axios.get("https://rest.bandsintown.com/artists/" + val + "/events?app_id=codingbootcamp")
        .then(function(response) {
            var data = response.data;
            data.forEach(function(event) {
                var venue = event.venue;
                var date = moment(event.datetime).format("MM/DD/YYYY");
                var info = `[${colors.FgGreen}${date}${colors.Reset}] Playing at ${colors.FgMagenta}${venue.name}${colors.Reset} in ${colors.FgCyan}${venue.city}`;

                // Checking if region exists within data.
                if (venue.region != "" && venue.region != false) {
                    info += `, ${venue.region}`;
                };

                info += `, ${venue.country}${colors.Reset}`;
                console.log(info);
            });
        });
    break;
    case "do-what-it-says":

    break;
    case "movie-this":
    
    break;
    case "spotify-this-song":
        spotify.search({ type: 'track', query: val }, function(err, data) {
            if (err) {
            return console.log(`${colors.FgRed}Error occurred:${colors.Reset} ${err}`);
            }
        
            data.tracks.items.forEach(function(track) {
                var info = `Artists:${colors.FgMagenta}`;  
                track.artists.forEach(function(artist) {
                    info += " " + artist.name;
                });
                
                info += `\n${colors.Reset}Song Title:${colors.FgGreen} ${track.name}`;

                if (track.preview_url) {
                    info += `\n${colors.Reset}Preview:${colors.FgBlue} ${track.preview_url}`;
                };

                if (track.album && track.album.name && track.album.name != "") {
                    info += `\n${colors.Reset}Album:${colors.FgCyan} ${track.album.name}`;
                };

                info += colors.FgYellow + "\n-----------------------------------------"
                console.log(info + colors.Reset);
            });
        });
    break;
    case "help":
        var message = `\n${colors.FgYellow}Welcome to the LIRI Bot!\n`;
        message += `Here are a list of my commands:\n`;
        message += `${colors.FgGreen}concert-this "Band Name"${colors.Reset} - Searches for all upcoming events hosted by/for your favorite bands.\n`;
        message += `${colors.FgGreen}do-what-it-says${colors.Reset} - Runs any command that is stored within the random.txt file.\n`
        message += `${colors.FgGreen}movie-this "Movie Title"${colors.Reset} - Gathers information and ratings on your favorite movie titles.\n`;
        message += `${colors.FgGreen}spotify-this-song "Song Title"${colors.Reset} - Gathers information on your favorite songs.\n`;

        console.log(message);
    break;
    default: 
        console.log(`Invalid command, type ${colors.FgYellow}"help"${colors.Reset} for instructions`);
    break;
}