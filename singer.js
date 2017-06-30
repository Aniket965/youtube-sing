var colors = require('colors');
var youtubedl = require('youtube-dl')
var exec = require('child_process').exec;
const stream = require('youtube-audio-stream')
const decoder = require('lame').Decoder
const speaker = require('speaker')
var prompt = require('prompt');


module.exports = (url) => {
    var path = process.cwd()
    youtubedl.getInfo(url, function (err, info) {
        if (err) throw err;
        console.log("Playing---".cyan, info.title.yellow);
        console.log('wanna save offline ?(yes)')
        prompt.start();
        prompt.get(['save'], function (err, result) {

            console.log('  mood: ' + result.save);
            if (result.save === 'yes') {
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
    });

    stream(url)
        .pipe(decoder())
        .pipe(speaker())




    // exec('youtube-dl --extract-audio --audio-format mp3 ' + url, (err, stdout, stderr) => {
    //     console.log(stdout.green);
    //     if (err) {
    //         console.error(err);
    //     } else {

    //         console.log("Downloaded🎉🎉🎉🎉🎉".yellow);
    //     }
    // });
}