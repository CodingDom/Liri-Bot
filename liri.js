require("dotenv").config();
process.argv.splice(0,2);

var keys = require("./keys.js");
var colors = require("./log-colors.js").logColors;
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// Gathers command arguments, if no arguments added, run help command
var userCommand = process.argv[0]?process.argv[0].toLowerCase():"help";
var arg = process.argv.slice(1).join("+");

function addColor(color,msg) {
return color + msg + colors.Reset;
};

function runCommand(cmd,val) {
    switch (cmd) {
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
            axios.get("http://www.omdbapi.com/?apikey=trilogy&t="+val)
            .then(function(response) {
            var data = response.data;
            var info = `Title: ${data.Title}\n`;
            info += `Release Date: ${data.Released}\n`;
            info += `IMDB Rating: ${data.imdbRating}\n`;
            info += `Rotten Tomatoes Rating: ${data.Ratings[1].Value}\n`;
            info += `Produced in ${data.Country}\n`;
            info += `Language: ${data.Language}\n`;
            info += `Plot: ${data.Plot}\n`;
            info += `Actors: ${data.Actors}\n`;
            console.log(info);
            })
            .catch(function(error) {
                console.log(error);
            });
        break;
        case "spotify-this-song":
            spotify.search({ type: 'track', query: val }, function(err, data) {
                if (err) {
                return console.log(addColors(colors.FgRed,"Error occurred: ") + err);
                }
            
                data.tracks.items.forEach(function(track) {
                    var info = `Artists:`;  
                    track.artists.forEach(function(artist) {
                        info += " " + addColor(colors.FgMagenta,artist.name);
                    });
                    
                    info += "\nSong Title: " + addColor(colors.FgGreen,track.name);

                    if (track.preview_url) {
                        info += "\nPreview: " + addColor(colors.FgBlue,track.preview_url);
                    };

                    if (track.album && track.album.name && track.album.name != "") {
                        info += "\nAlbum: " + addColor(colors.FgCyan,track.album.name);
                    };

                    info += addColor(colors.FgYellow,"\n-----------------------------------------");
                    console.log(info);
                });
            });
        break;
        case "help":
            var message = `\n${colors.FgYellow}Welcome to the LIRI Bot!\n`;
            message += `Here are a list of my commands:\n`;
            message += addColor(colors.FgGreen,'concert-this "Band Name"') + " - Searches for all upcoming events hosted by/for your favorite bands.\n";
            message += addColor(colors.FgGreen,'do-what-it-says') + " - Runs any command that is stored within the random.txt file.\n";
            message += addColor(colors.FgGreen,'movie-this "Movie Title"') + " - Gathers information and ratings on your favorite movie titles.\n";
            message += addColor(colors.FgGreen,'spotify-this-song "Song Title"') + " - Gathers information on your favorite songs.\n";

            console.log(message);
        break;
        default: 
            console.log(`Invalid command, type ${addColor(colors.FgYellow,'"help"')} for instructions`);
        break;
    }
};    


runCommand(userCommand,arg);