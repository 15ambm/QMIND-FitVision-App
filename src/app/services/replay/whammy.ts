// Everything below is copied from the npm package Whammy
// (https://github.com/antimatter15/whammy)
// and adapted to work in this context and with TypeScript

// FIXME: More typing could be added here but I'm leaving some stuff as <any>
// for now because I have no idea what a RIFF is
/*=============================================================================*/

interface Frame {
  width: number;
  height: number;
  duration: number;
}

interface WebPFrame extends Frame {
  data: any;
  riff: any;
}

const numToBuffer = (num: number) => {
  const parts = [];
  while (num > 0) {
    parts.push(num & 0xff);
    num = num >> 8;
  }
  return new Uint8Array(parts.reverse());
};

const strToBuffer = (str: string) => {
  // return new Blob([str]);

  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
  // this is slower
  // return new Uint8Array(str.split('').map(function(e){
  // 	return e.charCodeAt(0)
  // }))
};


// sorry this is ugly, and sort of hard to understand exactly why this was done
// at all really, but the reason is that there's some code below that i dont really
// feel like understanding, and this is easier than using my brain.
function bitsToBuffer(bits) {
    const data = [];
    const pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
    bits = pad + bits;
    for (let i = 0; i < bits.length; i += 8) {
      data.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(data);
  }

const generateEBML = (json) => {
  const ebml = [];
  for (const entry of json) {
    let data = entry.data;
    if (typeof data === 'object') { data = generateEBML(data); }
    if (typeof data === 'number') { data = bitsToBuffer(data.toString(2)); }
    if (typeof data === 'string') { data = strToBuffer(data); }

    const len = data.size || data.byteLength || data.length;
    const zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
    const sizeStr = len.toString(2);
    const padded = (new Array((zeroes * 7 + 7 + 1) - sizeStr.length)).join('0') + sizeStr;
    const size = (new Array(zeroes)).join('0') + '1' + padded;

    // i actually dont quite understand what went on up there, so I'm not really
    // going to fix this, i'm probably just going to write some hacky thing which
    // converts that string into a buffer-esque thing

    ebml.push(numToBuffer(entry.id));
    ebml.push(bitsToBuffer(size));
    ebml.push(data);

  }

  return new Blob(ebml, { type: 'video/webm' });
};

// woot, a function that's actually written for this project!
// this parses some json markup and makes it into that binary magic
// which can then get shoved into the matroska comtainer (peaceably)
const makeSimpleBlock = (data: any) => {
  let flags = 0;
  if (data.keyframe) { flags |= 128; }
  if (data.invisible) { flags |= 8; }
  if (data.lacing) { flags |= (data.lacing << 1); }
  if (data.discardable) { flags |= 1; }
  if (data.trackNum > 127) {
    throw new Error('TrackNumber > 127 not supported');
  }
  const out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(e => {
    return String.fromCharCode(e);
  }).join('') + data.frame;

  return out;
};

// here's something else taken verbatim from weppy, awesome rite?
const parseWebP = (riff: any): WebPFrame => {
  const c = [];
  const VP8 = riff.RIFF[0].WEBP[0];

  const frameStart = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
  for (let i = 0; i < 4; i++) {
    c[i] = VP8.charCodeAt(frameStart + 3 + i);
  }

  let width: number, horizontalScale: number, height: number, verticalScale: number, tmp: number;

  // the code below is literally copied verbatim from the bitstream spec
  tmp = (c[1] << 8) | c[0];
  width = tmp & 0x3FFF;
  horizontalScale = tmp >> 14;
  tmp = (c[3] << 8) | c[2];
  height = tmp & 0x3FFF;
  verticalScale = tmp >> 14;

  return {
    width,
    height,
    data: VP8,
    riff,
    duration: null
  };
};

  // i think i'm going off on a riff by pretending this is some known
  // idiom which i'm making a casual and brilliant pun about, but since
  // i can't find anything on google which conforms to this idiomatic
  // usage, I'm assuming this is just a consequence of some psychotic
  // break which makes me make up puns. well, enough riff-raff (aha a
  // rescue of sorts), this function was ripped wholesale from weppy

const parseRIFF = (str: string) => {
  let offset = 0;
  const chunks = {};

  while (offset < str.length) {
    const id = str.substr(offset, 4);
    const len = parseInt(str.substr(offset + 4, 4).split('').map(i => {
      const unpadded = i.charCodeAt(0).toString(2);
      return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
    }).join(''), 2);
    const data = str.substr(offset + 4 + 4, len);
    offset += 4 + 4 + len;
    chunks[id] = chunks[id] || [];

    if (id === 'RIFF' || id === 'LIST') {
      chunks[id].push(parseRIFF(data));
    } else {
      chunks[id].push(data);
    }
  }
  return chunks;
};

// here's a little utility function that acts as a utility for other functions
// basically, the only purpose is for encoding "Duration", which is encoded as
// a double (considerably more difficult to encode than an integer)
const doubleToString = (num: number) => {
  return [].slice.call(
    new Uint8Array(
      (
        new Float64Array([num]) // create a float64 array
      ).buffer) // extract the array buffer
    , 0) // convert the Uint8Array into a regular array
    .map((e: number) => { // since it's a regular array, we can now use map
      return String.fromCharCode(e); // encode all the bytes individually
    })
    .reverse() // correct the byte endianness (assume it's little endian for now)
    .join(''); // join the bytes in holy matrimony as a string
};

// sums the lengths of all the frames and gets the duration, woo
const checkFrames = (frames: Frame[]): Frame => {
  const width = frames[0].width,
    height = frames[0].height;
  let duration = frames[0].duration;
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].width !== width) { throw new Error('Frame ' + (i + 1) + ' has a different width'); }
    if (frames[i].height !== height) { throw new Error('Frame ' + (i + 1) + ' has a different height'); }
    if (frames[i].duration < 0 || frames[i].duration > 0x7fff) {
      throw new Error('Frame ' + (i + 1) + ' has a weird duration (must be between 0 and 32767)');
    }
    duration += frames[i].duration;
  }
  return {
    duration,
    width,
    height
  };
};

// in this case, frames has a very specific meaning, which will be
// detailed once i finish writing the code
const toWebM = (frames: Frame[]) => {
  const info = checkFrames(frames);

  // max duration by cluster in milliseconds
  const CLUSTER_MAX_DURATION = 30000;

  const EBML = [
    {
      id: 0x1a45dfa3, // EBML
      data: [
        {
          data: 1,
          id: 0x4286 // EBMLVersion
        },
        {
          data: 1,
          id: 0x42f7 // EBMLReadVersion
        },
        {
          data: 4,
          id: 0x42f2 // EBMLMaxIDLength
        },
        {
          data: 8,
          id: 0x42f3 // EBMLMaxSizeLength
        },
        {
          data: 'webm',
          id: 0x4282 // DocType
        },
        {
          data: 2,
          id: 0x4287 // DocTypeVersion
        },
        {
          data: 2,
          id: 0x4285 // DocTypeReadVersion
        }
      ]
    },
    {
      id: 0x18538067, // Segment
      data: [
        {
          id: 0x1549a966, // Info
          data: [
            {
              data: 1e6, // do things in millisecs (num of nanosecs for duration scale)
              id: 0x2ad7b1 // TimecodeScale
            },
            {
              data: 'whammy',
              id: 0x4d80 // MuxingApp
            },
            {
              data: 'whammy',
              id: 0x5741 // WritingApp
            },
            {
              data: doubleToString(info.duration),
              id: 0x4489 // Duration
            }
          ]
        },
        {
          id: 0x1654ae6b, // Tracks
          data: [
            {
              id: 0xae, // TrackEntry
              data: [
                {
                  data: 1,
                  id: 0xd7 // TrackNumber
              },
                {
                  data: 1,
                  id: 0x63c5 // TrackUID
                },
                {
                  data: 0,
                  id: 0x9c // FlagLacing
                },
                {
                  data: 'und',
                  id: 0x22b59c // Language
                },
                {
                  data: 'V_VP8',
                  id: 0x86 // CodecID
                },
                {
                  data: 'VP8',
                  id: 0x258688 // CodecName
                },
                {
                  data: 1,
                  id: 0x83 // TrackType
                },
                {
                  id: 0xe0,  // Video
                  data: [
                    {
                      data: info.width,
                      id: 0xb0 // PixelWidth
                    },
                    {
                      data: info.height,
                      id: 0xba // PixelHeight
                    }
                  ]
                }
              ]
            }
          ]
        },

        // cluster insertion point
      ]
    }
    ];


  // Generate clusters (max duration)
  let frameNumber = 0;
  let clusterTimecode = 0;
  while (frameNumber < frames.length) {
    const clusterFrames = [];
    let clusterDuration = 0;
    do {
      clusterFrames.push(frames[frameNumber]);
      clusterDuration += frames[frameNumber].duration;
      frameNumber++;
    } while (frameNumber < frames.length && clusterDuration < CLUSTER_MAX_DURATION);

    let clusterCounter = 0;
    const cluster = {
      id: 0x1f43b675, // Cluster
      data: [
        {
          data: clusterTimecode,
          id: 0xe7 // Timecode
        }
      ].concat(clusterFrames.map(webp => {
        const block = makeSimpleBlock({
          discardable: 0,
          frame: webp.data.slice(4),
          invisible: 0,
          keyframe: 1,
          lacing: 0,
          trackNum: 1,
          timecode: Math.round(clusterCounter)
        });
        clusterCounter += webp.duration;
        return {
          data: block,
          id: 0xa3
        };
      }) as any)
    };

    // Add cluster to segment
    EBML[1].data.push(cluster as any);
    clusterTimecode += clusterDuration;
  }

  return generateEBML(EBML);
};

const fromImageArray = (images: string[], fps: number) => {
  return toWebM(images.map(image => {
    const webp = parseWebP(parseRIFF(atob(image.slice(23))));
    webp.duration = 1000 / fps;
    return webp;
  }));
};

export { fromImageArray };
