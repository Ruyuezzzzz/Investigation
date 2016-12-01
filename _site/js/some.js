function changeVid(category, number, name) {
  window.stop();
  video = document.getElementById('video-content');
  video.pause();
  document.querySelector("#video-content > source").src="/assets/videos/mock_ivs/"+ category + number + name +".mp4";
  video.load();

}

function pauseVid() {
  console.log('click');
  video = document.getElementById('video-content');
  control = document.getElementById('video-control');
  control.setAttribute('onclick', 'return playVid()');
  video.pause();

}

function playVid() {
  console.log('click');
  video = document.getElementById('video-content');
  control = document.getElementById('video-control');
  control.setAttribute('onclick', 'return pauseVid()');
  video.play();

}

function stopEverything() {
  pauseVid();
  window.stop();
}


function fixEverything() {
  //code to follow
}

function panicJerks() {
  console.log("Everybody freak the fuck out!")
}
