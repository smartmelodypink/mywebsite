/* =====================================================================
   ✿  EDIT YOUR WHOLE WEBSITE FROM THIS ONE FILE  ✿
   ---------------------------------------------------------------------
   You almost never need to touch the other files. Just change the text,
   add your photos, and update your links below. Save and refresh!

   HOW TO ADD A PHOTO:
   1. Put your image file in the  images/  folder (e.g. images/cat.jpg)
   2. In a gallery below, set  src: "images/cat.jpg"
   3. Add a fun  caption  if you want. Done!

   If you leave  src  empty (""), a cute placeholder tile shows instead,
   so the site always looks complete while you collect your pictures.
   ===================================================================== */

const SITE = {
  // ---- YOUR BASICS ----------------------------------------------------
  ownerName: "pinkmelody (code name)",                 // ← your name
  siteTitle: "imapersonmhm.exe",             // ← shows in the top bar & browser tab
  tagline: "my little corner of the internet ♡",
  avatar: "",                         // ← e.g. "images/me.jpg" (leave "" for a cute default)

  aboutText:
    "hi!! welcome to my page (✿◠‿◠) i’m 15 and i love collecting little " +
    "moments from the things i’m into. click around, drag the windows, " +
    "and peek inside my hobby folders below. hope you smile while you’re here!",

  // ---- YOUR HOBBIES ---------------------------------------------------
  // Add, remove, or rename any hobby. Each one becomes its own window.
  // "emoji" is just a little icon for the window. "photos" is the gallery.
  hobbies: [
    {
      id: "embroidery",
      title: "embroidery.png",
      emoji: "📷",
      blurb: "skies, streets & little details i didn’t want to forget.",
      photos: [
        { src: "", caption: "sunset walk" },
        { src: "", caption: "rainy window" },
        { src: "", caption: "flower close-up" },
        { src: "", caption: "city lights" },
        { src: "", caption: "morning coffee" },
        { src: "", caption: "cloud watching" },
      ],
    },
    {
      id: "art",
      title: "my_art.png",
      emoji: "🎨",
      blurb: "doodles, sketches & half-finished masterpieces ♡",
      photos: [
        { src: "", caption: "ocean sketch" },
        { src: "", caption: "self portrait" },
        { src: "", caption: "lil character" },
        { src: "", caption: "watercolor try" },
      ],
    },
    {
      id: "baking",
      title: "baking.png",
      emoji: "🧁",
      blurb: "things i baked that (mostly) turned out cute.",
      photos: [
        { src: "", caption: "strawberry cake" },
        { src: "", caption: "cookies!" },
        { src: "", caption: "cupcakes" },
        { src: "", caption: "first macarons" },
      ],
    },
    {
      id: "music",
      title: "playlists.png",
      emoji: "🎧",
      blurb: "songs on repeat & concert memories.",
      photos: [
        { src: "", caption: "vinyl finds" },
        { src: "", caption: "concert night" },
        { src: "", caption: "my setup" },
      ],
    },
  ],

  // ---- FAKE MUSIC PLAYER (just for looks ♡) ---------------------------
  nowPlaying: {
    track: "good days",
    artist: "your fave artist",
  },

  // ---- YOUR LINKS ----------------------------------------------------
  // Delete any you don't want. "url" can be "#" if you don't have it yet.
  links: [
    { label: "instagram", handle: "@yourhandle", url: "#" },
    { label: "pinterest", handle: "@yourhandle", url: "#" },
    { label: "email",     handle: "you@email.com", url: "mailto:you@email.com" },
    { label: "youtube",   handle: "your channel", url: "#" },
  ],
};
