var fs = require("fs"); // necessary to read a file

fs.readFile("keys.js", "utf8", function(error, data) {
  // There was an error
  if (error) {
    return console.log(error);
  }
  let keys = require('./keys.js'); // capture data from keys.js file
  var consKey = keys.twitterKeys.consumer_key;
  var consSec = keys.twitterKeys.consumer_secret;
  var accessKey = keys.twitterKeys.access_token_key;
  var accessSec = keys.twitterKeys.access_token_secret;

  var action = process.argv[2]; // first parameter
  var value = process.argv[3]; // second parameter

  switch (action) { // first parameter match
    case "my-tweets":
      twitter();
      break;
    case "spotify-this-song":
      spotify();
      break;
    case "movie-this":
      omdb();
      break;
    case "do-what-it-says":
      random();
      break;    
  }


  function twitter() {
    var Twitter = require('twitter');
 
    var client = new Twitter({
      consumer_key: consKey,
      consumer_secret: consSec,
      access_token_key: accessKey,
      access_token_secret: accessSec
    });
    
    var params = {screen_name: 'ucibootcamp1'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        fs.appendFileSync("log.txt", "Tweets:\r\n"); // add a Tweets header to log.txt
        for (var i=0; i<tweets.length; i++) {
          console.log(i+1+ ". " + tweets[i].text);
          // enter tweets in log.txt
          fs.appendFileSync("log.txt", i+1+ ". " + tweets[i].text + "\r\n"); 
        }
      fs.appendFileSync("log.txt", "\r\n"); // add a line break
      }
    });
  }


  function spotify() {
    if (!value) { // Check if a song title was entered
      value = "ace of base the sign"; // if not, use The Sign by Ace of Base
    }

    var spotify = require('spotify');
    spotify.search({ type: 'track', query: value }, function(err, data) {
      if ( err ) {
          console.log('Error occurred: ' + err);
          return;
      }
      var spotifyPath = data.tracks.items[0]; // variable to specific song data
      console.log("Artist: " + spotifyPath.artists[0].name);
      console.log("Song: " + spotifyPath.name);
      console.log("Link: " + spotifyPath.preview_url);
      console.log("Album: " + spotifyPath.album.name);
      // enter spotify results in log.txt
      fs.appendFileSync("log.txt", "Spotify results:\r\nArtist: " + spotifyPath.artists[0].name + "\r\nSong: " + spotifyPath.name + "\r\nLink: " + spotifyPath.preview_url + "\r\nAlbum: " + spotifyPath.album.name + "\r\n\r\n");
    });
  }

  function omdb() {
    var api = "i=tt3896198&apikey=40e9cece"; // import the API key from keys.js file

    var request = require("request");
    if (!value) { // Check if a movie name was entered
      value = "mr nobody"; // if not, use Mr. Nobody
    }

      request("http://www.omdbapi.com/?"+api+"&t="+value+"&r=json", function(error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("Rated: " + JSON.parse(body).Rated);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
        // enter OMDb results in log.txt
        fs.appendFileSync("log.txt", "OMDb results:\r\nTitle: " + JSON.parse(body).Title + "\r\nYear: " + JSON.parse(body).Year + "\r\nRated: " + JSON.parse(body).Rated + "\r\nCountry: " + JSON.parse(body).Country + "\r\nLanguage: " + JSON.parse(body).Language + "\r\nPlot: " + JSON.parse(body).Plot + "\r\nActors: " + JSON.parse(body).Actors + "\r\nRotten Tomatoes: " + JSON.parse(body).Ratings[1].Value + "\r\n\r\n");
      }
    });
  }


  // Output text from random.txt file
  function random() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      console.log(data);
      // enter random.txt data results in log.txt
      fs.appendFileSync("log.txt", "Data from random.txt:\r\n" + data);
    });
  }

});