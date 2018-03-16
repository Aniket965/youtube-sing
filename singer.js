#!/usr/local/bin/node

var colors = require("colors");
var youtubedl = require("youtube-dl");
var exec = require("child_process").exec;
const stream = require("youtube-audio-stream");
const decoder = require("lame").Decoder;
const Speaker = require("speaker");
var ytpl = require("ytpl");

const speaker = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
  });

module.exports = url => {
  var path = process.cwd();
  var IsRunning = false;
  var Playlist_urls = [];

  if (url.includes("playlist")) {
    var i = url.indexOf("=") + 1;
    ytpl(url.substring(i), function(err, playlist) {
      if (err) throw err;
      playlist.items.forEach(item => {
        if (!IsRunning) {
          playsong(item.url_simple);
        } else {
          Playlist_urls.push(item.url_simple);
        }
      });
    });
  } else {
    playsong(url);
  }
  function playsong(url) {
    IsRunning = true;
    youtubedl.getInfo(url, function(err, info) {
      if (err) throw err;
      console.log("Playing...\n".cyan + info.title.rainbow);
      console.log("wanna save offline ?(yes)".yellow);
      var stdin = process.openStdin();

      stdin.addListener("data", function(d) {
        if (d.toString().trim() === "yes") {
          console.log("downloading....");
          exec(
            "youtube-dl --extract-audio --audio-format mp3 " + url,
            (err, stdout, stderr) => {
              if (err) {
                console.error(err);
              } else {
                console.log("Downloaded 🔥".yellow);
              }
            }
          );
        }
      });

      let streamas = stream(url)
        .pipe(decoder())
        .pipe(speaker);
      streamas.on("open", () => (IsRunning = true));
      streamas.on("close", () => {
        IsRunning = false;
        stdin.removeAllListeners();
        if (Playlist_urls.length > 0) {
          Playlist_urls.shift();
          playsong(Playlist_urls[0]);
        }
      });
    });

  }
};
