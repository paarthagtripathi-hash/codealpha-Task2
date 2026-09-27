// Song Data Array (Using free open-source test tracks)
const songs = [
  {
    title: "Cinematic Atmosphere",
    artist: "Audio Library",
    cover: "https://picsum.photos/id/1018/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Upbeat Urban Groove",
    artist: "Sound Helix",
    cover: "https://picsum.photos/id/1025/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Smooth Ambient Journey",
    artist: "Creative Sounds",
    cover: "https://picsum.photos/id/1039/300/300",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

let songIndex = 0;
let isPlaying = false;

// DOM Elements
const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const artworkWrapper = document.querySelector(".artwork-wrapper");

const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const progressContainer = document.getElementById("progress-container");
const progressFill = document.getElementById("progress-fill");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const volumeSlider = document.getElementById("volume-slider");
const playlistEl = document.getElementById("playlist");

// Initialize and Load Track
function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
  updateActivePlaylistItem();
}

// Play and Pause Logic
function playSong() {
  isPlaying = true;
  playBtn.innerHTML = "&#10074;&#10074;"; // Pause symbol
  artworkWrapper.classList.add("playing");
  audio.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.innerHTML = "&#9658;"; // Play symbol
  artworkWrapper.classList.remove("playing");
  audio.pause();
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

// Previous and Next Track
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

// Time Format Helper (mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update Progress Bar and Timers
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Clickable Progress Bar Seeking
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

// Volume Slider
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Bonus: Auto-play next song when current one finishes
audio.addEventListener("ended", nextSong);

// Bonus: Render and Clickable Playlist
function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${song.title}</span><small>${song.artist}</small>`;
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updateActivePlaylistItem() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item, index) => {
    item.classList.toggle("active", index === songIndex);
  });
}

// Initial Run
renderPlaylist();
loadSong(songs[songIndex]);
audio.volume = volumeSlider.value;