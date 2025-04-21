// Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: 'vOlLb0kK50M',  // your YouTube video ID
        playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: 'vOlLb0kK50M',  // this enables looping
            modestbranding: 1,  // minimal branding
            rel: 0,  // remove related videos
            showinfo: 0  // remove title & info on video load
        },
        events: {
            onReady: function (e) {
                e.target.mute(); // mute video on load
                e.target.playVideo(); // autoplay the video
            }
        }
    });
}
