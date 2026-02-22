const $videoSections = document.querySelectorAll(".video");
$videoSections.forEach(($videoSection) => {
  const videoUrl = $videoSection.dataset.src;
  if (!videoUrl) return;

  const startTime = parseFloat($videoSection.dataset.startTime);
  const $video = createVideo(videoUrl);

  $videoSection.prepend($video);

  if (!isNaN(startTime) && startTime > 0) {
    $video.addEventListener(
      "loadedmetadata",
      () => {
        $video.currentTime = startTime;
      },
      { once: true },
    );
  }
});

function createVideo(url) {
  const $video = document.createElement("video");
  $video.classList.add("video__player");
  $video.setAttribute("src", url);
  $video.setAttribute("controls", "");
  $video.setAttribute("playsinline", "");
  $video.setAttribute("muted", "");
  $video.setAttribute("preload", "metadata");

  return $video;
}
