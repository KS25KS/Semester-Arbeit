// 1. Load the IFrame Player API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

// 2. This function gets called once the API is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: 'vOlLb0kK50M', // ✅ Replace with your YouTube video ID
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      loop: 1,
      fs: 0,
      cc_load_policy: 0,
      iv_load_policy: 3,
      autohide: 1,
      playlist: 'vOlLb0kK50M', // ✅ Needed to make looping work
      mute: 1,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: function (event) {
        event.target.mute();
        event.target.playVideo();
      },
      onStateChange: function (event) {
        if (event.data === YT.PlayerState.ENDED) {
          event.target.playVideo();
        }
      }
    }
  });
}