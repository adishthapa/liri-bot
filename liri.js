// Required packages/files
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var keys = require("./keys.js");
var fs = require("fs");

// BandsInTown API Key
var bandsintown = keys.bandsintown.secret;
// OMDB API Key
var omdb = keys.omdb.secret;
// Spotify API Key
var spotify = new Spotify(keys.spotify);

// Console Command that triggers the different functions
var command = process.argv[2];

// Writes the Console Command to log.txt
fs.appendFile("log.txt",command, function(err) {
    if (err) {
        console.log("Error: " + err);
    };
});

// Function that parses process.argv for search terms and then logs it and returns it
function processCommand() {
    var searchCommand = process.argv.slice(3).join(" ");
    var logCommand = " " + searchCommand + "\n";
    fs.appendFile("log.txt",logCommand, function(err) {
        if (err) {
            console.log("Error: " + err);
        };
    });
    return searchCommand;
};

// Function that prints out the given artist's upcomming concert dates and their venue locations and name
function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + bandsintown)
    .then(function (response) {
        if (response.data != "\n{warn=Not found}\n" && response.data.length > 0) {
            console.log("---------------------------------------------------------------------------\n")
            for (var i = 0; i < response.data.length; i++) {
                console.log("Venue Name: " + response.data[i].venue.name + "\n");
                console.log("Country: " + response.data[i].venue.country);
                console.log("City: " + response.data[i].venue.city);
                console.log("Region: " + response.data[i].venue.region + "\n");
    
                var concertDate = response.data[i].datetime;
                concertDate = moment(concertDate).format("MM/DD/YYYY")
                console.log("Date: " + concertDate);
                if (i === response.data.length - 1) {
                    console.log("\n---------------------------------------------------------------------------") 
                } else {
                    console.log("\n---------------------------------------------------------------------------\n")
                };
            };
        } else {
            console.log("---------------------------------------------------------------------------\n")
            console.log("Sorry, no upcomming events found for '" + artist +"'");
            console.log("\n---------------------------------------------------------------------------")
        };   
    }).catch(function (error) {
        console.log("---------------------------------------------------------------------------\n")
        console.log("Sorry, an error has occured. Please try again later.");
        console.log("\n---------------------------------------------------------------------------")
    });
};

// Function that prints out the given movie's title, release year, imdb rating, rotten tomatoes rating, country, languages, actors, and plot
function movieThis(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&plot=short&apikey=trilogy")
    .then(function (response) {
        if (response.data.Response === "True") {
            console.log("---------------------------------------------------------------------------\n")
            console.log("Title: " + response.data.Title);
            console.log("Released Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Languages: " + response.data.Language);
            console.log("Actors: " + response.data.Actors);
            console.log("Plot: " + response.data.Plot);
            console.log("\n---------------------------------------------------------------------------") 

        } else {
            console.log("---------------------------------------------------------------------------\n")
            console.log("Sorry, no movie title found for '" + movie +"'");
            console.log("\n---------------------------------------------------------------------------")
        };
    }).catch(function (error) {
        console.log("---------------------------------------------------------------------------\n")
        console.log("Sorry, an error has occured. Please try again later.");
        console.log("\n---------------------------------------------------------------------------")
    });
};

// Function that prints out the given song's name, artists, album, and a preview of the song
function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song, limit: 5 })
    .then(function(response) {
        if (response.tracks.items.length > 0) {
            console.log("---------------------------------------------------------------------------\n")
            for (var i = 0; i < response.tracks.items.length; i++) {
                console.log("Result #" + (i + 1) + "\n");
                console.log("Song: " + response.tracks.items[i].name)
                var artists = "Artist: ";
                for (var j = 0; j < response.tracks.items[i].artists.length; j++ ) {
                    if (j === response.tracks.items[i].artists.length - 1) {
                        artists += response.tracks.items[i].artists[j].name;
                    } else {
                        artists += response.tracks.items[i].artists[j].name + " & ";
                    };
                };
                console.log(artists);
                console.log("Album: " + response.tracks.items[i].album.name);
                console.log("Preview: " + response.tracks.items[0].external_urls.spotify)
                if (i === response.tracks.items.length - 1) {
                    console.log("\n---------------------------------------------------------------------------") 
                } else {
                    console.log("\n---------------------------------------------------------------------------\n")
                };
            };
        } else {
            console.log("---------------------------------------------------------------------------\n")
            console.log("Sorry, no tracks found for '" + song +"'");
            console.log("\n---------------------------------------------------------------------------")
        };
    }).catch(function(err) {
        console.log("---------------------------------------------------------------------------\n")
        console.log("Sorry, an error has occured. Please try again later.");
        console.log("\n---------------------------------------------------------------------------")
    });
};

switch(command) {
    case "concert-this":
        var artist = processCommand();
        if (artist) {
            concertThis(artist);
        } else {
            console.log("+-------------------------------------------------------------------------+")
            console.log("|                                                                         |")
            console.log("| Please make sure to enter the name of an Artist or a Band after the     |")
            console.log("| command.                                                                |")
            console.log("|                                                                         |")
            console.log("| Example:                                                                |")
            console.log("|                                                                         |")
            console.log("| node liri.js concert-this '<artist/band name here>'                     |");
            console.log("|                                                                         |")
            console.log("+-------------------------------------------------------------------------+")
        };
        break;
    case "movie-this":
        var movie = processCommand();
        if (movie) {
            movieThis(movie);
        } else {
            // The direction says to show default movie called "Mr. Nobody" if nothing is provided like this:
            // movieThis("Mr. Nobody");
            // However, I think the following output looks much better for User Friendliness:

            console.log("+-------------------------------------------------------------------------+")
            console.log("|                                                                         |")
            console.log("| Please make sure to enter the name of a Movie after the command.        |")
            console.log("|                                                                         |")
            console.log("| Example:                                                                |")
            console.log("|                                                                         |")
            console.log("| node liri.js movie-this '<movie name here>'                             |");
            console.log("|                                                                         |")
            console.log("+-------------------------------------------------------------------------+")
        };
        break;
    case "spotify-this-song":
        var song = processCommand();
        if (song) {
            spotifyThisSong(song);
        } else {
            // The direction says to show default song of "The Sign" by Ace of Base if nothing is provided like this:
            // spotifyThisSong("The Sign Ace of Base");
            // However, I think the following output looks much better for User Friendliness:

            console.log("+-------------------------------------------------------------------------+")
            console.log("|                                                                         |")
            console.log("| Please make sure to enter the name of a Song after the command.         |")
            console.log("|                                                                         |")
            console.log("| Example:                                                                |")
            console.log("|                                                                         |")
            console.log("| node liri.js spotify-this-song '<song name here>'                       |");
            console.log("|                                                                         |")
            console.log("+-------------------------------------------------------------------------+")
        };
        break;
    case "do-what-it-says":
        processCommand();
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            };
            var fileArr = data.split("\n");
            for (var i = 0; i < fileArr.length; i++) {
                var commandsArr = fileArr[i].split(",");
                switch(commandsArr[0]){
                    case "concert-this":
                        concertThis(commandsArr[1]);
                        break;
                    case "movie-this":
                        movieThis(commandsArr[1]);
                        break;
                    case "spotify-this-song":
                        spotifyThisSong(commandsArr[1]);
                        break;
                    default:
                        console.log("Unknown command in random.txt");
                }
            }
        });
        break;
    default:
        console.log("+-------------------------------------------------------------------------+")
        console.log("|                                                                         |")
        console.log("| The given command is not recognized.                                    |");
        console.log("|                                                                         |")
        console.log("| Please try one of the following commands instead:                       |");
        console.log("|                                                                         |")
        console.log("| node liri.js concert-this '<artist/band name here>'                     |");
        console.log("| node liri.js movie-this '<movie name here>'                             |");
        console.log("| node liri.js spotify-this-song '<song name here>'                       |");
        console.log("| node liri.js do-what-it-says                                            |");
        console.log("|                                                                         |")
        console.log("+-------------------------------------------------------------------------+")
};