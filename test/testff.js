var fs=require('fs');
eval(fs.readFileSync("./ffmpeg_asm.js", "utf-8"))
//var ff=require("./ffmpeg-all-codecs.js");

var data="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"
var buf=new Buffer(data,'base64');
var arr=new Uint8Array(buf)

//console.log(arr)

var results = ffmpeg_run({
  arguments: [
	'-i', 'audio.wav', 
    '-c:a', 'vorbis', 
    '-b:a', '4800k', 
    '-strict', 'experimental', 'output.mp4'
  ],
  files: [
    {
      data: arr,
      name: 'test.wav'
    }
  ]
});


console.dir(results)

// results is an Array of { data: UInt8Array, name: string }
// results.forEach(function(file) {
//   console.log("File recieved", file.name, file.data);
// });