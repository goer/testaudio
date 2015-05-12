var ogg = require('ogg');
var vorbis = require('vorbis');

var oe = new ogg.Encoder();
var ve = new vorbis.Encoder();

// not yet implemented...
//ve.addComment('ARTIST', 'Bob Marley');

// `process.stdin` *MUST* be PCM float 32-bit signed little-endian samples.
// channels and sample rate are configurable but default to 2 and 44,100hz.
process.stdin.pipe(ve)

// send the encoded Vorbis pages to the Ogg encoder
ve.pipe(oe.stream());

// write the produced Ogg file with Vorbis audio to `process.stdout`
oe.pipe(process.stdout);