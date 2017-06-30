var colors = require('colors');
var youtubedl = require('youtube-dl')
var exec = require('child_process').exec;
const stream = require('youtube-audio-stream')
const decoder = require('lame').Decoder
const speaker = require('speaker')
var prompt = require('prompt');
var ytpl = require('ytpl')


module.exports = (url) => {

    var path = process.cwd()
    var IsRunning = false;
    var Playlist_urls = []

    if (url.includes('playlist')) {
        console.log('isPlaylist')
        ytpl('PLzQqd22EbZ9AvwgkxefgQ0PM5VS_MaS8r', function (err, playlist) {
            if (err) throw err;
            playlist.items.forEach((item) => {

                if (!IsRunning) {
                    playsong(item.url_simple);
                    Playlist_urls.push(item.url_simple);
                } else {
                    Playlist_urls.push(item.url_simple);
                }

            });



        });

    }
    else {
        playsong(url);
    }

    function playsong(url) {

        IsRunning = true
        youtubedl.getInfo(url, function (err, info) {
            if (err) throw err;
            console.log("Playing...\n".cyan, info.title.rainbow);
            console.log('wanna save offline ?(yes)'.yellow)

            var stdin = process.openStdin();
            stdin.addListener("data", function (d) {
                if (d.toString().trim() === 'yes') {
                    console.log('downloading....');
                    exec('youtube-dl --extract-audio --audio-format mp3 ' + url, (err, stdout, stderr) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("Downloaded🎉🎉🎉🎉🎉".yellow);
                        }
                    });
                }
            });

            var streamas = stream(url)
                .pipe(decoder())
                .pipe(speaker());
            streamas.on('open', () => IsRunning = true);
            streamas.on('close', () => {
                IsRunning = false
                Playlist_urls.shift();
                stdin.removeAllListeners();
                if (Playlist_urls.length > 0) {
                    playsong(Playlist_urls[0]);
                }

            })

        });


    }

}