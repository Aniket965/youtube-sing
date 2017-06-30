var colors = require('colors');
var exec = require('child_process').exec;


module.exports = (url) => {
    var path = process.cwd()
     exec('youtube-dl --extract-audio --audio-format mp3 '+ url, (err, stdout, stderr) => {
           console.log(stdout.green);
            if (err) {
                console.error(err);
            } else {
              
                console.log("Downloaded🎉🎉🎉🎉🎉".yellow);
            }
        });
}