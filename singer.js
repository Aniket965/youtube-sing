#!/usr/local/bin/node

var colors = require("colors");
var youtubedl = require("youtube-dl");
var exec = require("child_process").exec;
const stream = require("youtube-audio-stream");
const decoder = require("lame").Decoder;
const Speaker = require("speaker");
var ytpl = require("ytpl");
const log = require("emojifylogs").log;

module.exports = url => {
  var path = process.cwd();
  var IsRunning = false;
  var Playlist_urls = [];

  if (url.includes("playlist")) {
    var i = url.indexOf("=") + 1;
    ytpl(url.substring(i), function(err, playlist) {
      if (err) throw err;
      playlist.items.forEach(item => {
        Playlist_urls.push(item.url_simple);
      });
      playsong(Playlist_urls[0]);
    });
  } else {
    playsong(url);
  }
  function playsong(url) {
    let streamas;
    let speaker;
    IsRunning = true;
    youtubedl.getInfo(url, function(err, info) {
      if (err) throw err;
      log("Playing...\n".cyan + info.title.green);
      log.info("wanna save offline ? (yes) or wanna skip (s) ");
      var stdin = process.openStdin();
      stdin.addListener("data", function(d) {
        if (d.toString().trim() === "yes") {
          log("downloading....");
          exec(
            "youtube-dl --extract-audio --audio-format mp3 " + url,
            (err, stdout, stderr) => {
              if (err) {
                error(err);
              } else {
                log.info("Downloaded 🔥".yellow);
              }
            }
          );
        }
        if (d.toString().trim() === "s") {
          log.info('Skipping the current Song'.bgMagenta)
          streamas.destroy();
          IsRunning = false;
          stdin.removeAllListeners();
        }
      });

      try {
        speaker = new Speaker({
          channels: 2, // 2 channels
          bitDepth: 16, // 16-bit samples
          sampleRate: 44100 // 44,100 Hz sample rate
        });
        streamas = stream(url)
          .pipe(decoder())
          .pipe(speaker);
        streamas.on("open", () => (IsRunning = true));
        streamas.on("close", () => {
          IsRunning = false;
          speaker.close();
          stdin.removeAllListeners();
          if (Playlist_urls.length > 0) {
            Playlist_urls.shift();
            playsong(Playlist_urls[0]);
          } else log("Your Song/Playlisted Ended!".blue);
        });
      } catch (e) {
        log(e);
      }
    });
  }
};
