// === Load YouTube IFrame API ===
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// === Global player variable ===
let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: 'ScMzIvxBSi4', // 🔁 Replace with your YouTube video ID
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      loop: 1,
      playlist: 'ScMzIvxBSi4', // 🔁 Required for loop to work
      mute: 1,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  event.target.mute();
  event.target.playVideo();
}