class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.isPlaying = false;
    this.currentTrack = null;
    this.queue = [];
    this.currentIndex = 0;

    this.initializeControls();
    this.setupEventListeners();
    this.displayRecentTracks();
    this.displayFeaturedPlaylists();
  }

  initializeControls() {
    this.playPauseBtn = document.getElementById("play-pause");
    this.nextBtn = document.getElementById("next");
    this.prevBtn = document.getElementById("previous");
    this.shuffleBtn = document.getElementById("shuffle");
    this.repeatBtn = document.getElementById("repeat");
    this.progressBar = document.getElementById("progress");
    this.currentTimeSpan = document.getElementById("current-time");
    this.durationSpan = document.getElementById("duration");
  }

  setupEventListeners() {
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.nextBtn.addEventListener("click", () => this.playNext());
    this.prevBtn.addEventListener("click", () => this.playPrevious());

    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.handleTrackEnd());
  }

  loadTrack(track) {
    this.currentTrack = track;
    this.audio.src = track.preview;
    this.updateTrackInfo();
    this.storeRecentTrack(track); // Store in local storage
    this.displayRecentTracks(); // Update UI
    this.play();
  }

  updateTrackInfo() {
    document.getElementById("current-track-title").textContent =
      this.currentTrack.title;
    document.getElementById("current-track-artist").textContent =
      this.currentTrack.artist.name;
    document.getElementById("current-track-image").src =
      this.currentTrack.album.cover_medium;
  }

  togglePlayPause() {
    this.isPlaying ? this.pause() : this.play();
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }

  playNext() {
    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      this.loadTrack(this.queue[this.currentIndex]);
    }
  }

  playPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadTrack(this.queue[this.currentIndex]);
    }
  }

  updateProgress() {
    const { currentTime, duration } = this.audio;
    const progressPercent = (currentTime / duration) * 100;
    this.progressBar.style.width = `${progressPercent}%`;

    this.currentTimeSpan.textContent = this.formatTime(currentTime);
    this.durationSpan.textContent = this.formatTime(duration);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  handleTrackEnd() {
    this.playNext();
  }

  setQueue(tracks) {
    this.queue = tracks;
    this.currentIndex = 0;
  }

  // Store last 5 played tracks in local storage
  storeRecentTrack(track) {
    let recentTracks = JSON.parse(localStorage.getItem("recentTracks")) || [];

    // Remove track if it already exists
    recentTracks = recentTracks.filter((t) => t.id !== track.id);

    // Add new track at the beginning
    recentTracks.unshift(track);

    // Keep only last 5
    if (recentTracks.length > 5) recentTracks.pop();

    localStorage.setItem("recentTracks", JSON.stringify(recentTracks));
  }

  // Display Recently Played Tracks
  displayRecentTracks() {
    const recentContainer = document.getElementById("recent-played");
    if (!recentContainer) return;

    recentContainer.innerHTML = ""; // Clear previous items
    const recentTracks = JSON.parse(localStorage.getItem("recentTracks")) || [];

    if (recentTracks.length === 0) {
      recentContainer.innerHTML = "<p>No recent tracks</p>";
      return;
    }

    recentTracks.forEach((track) => {
      const trackCard = document.createElement("div");
      trackCard.className = "track-card";
      trackCard.innerHTML = `
                <img src="${track.album.cover_medium}" alt="${track.title}">
                <h3>${track.title}</h3>
                <p>${track.artist.name}</p>
            `;

      trackCard.addEventListener("click", () => {
        this.setQueue([track]);
        this.loadTrack(track);
      });

      recentContainer.appendChild(trackCard);
    });
  }

  // Display Featured Playlists (Static Data Example)
  displayFeaturedPlaylists() {
    const featuredContainer = document.getElementById("featured-playlists");
    if (!featuredContainer) return;

    const featuredTracks = [
      {
        title: "Top Hits 2024",
        cover: "https://source.unsplash.com/200x200/?music",
        artist: "Various",
      },
      {
        title: "Chill Vibes",
        cover: "https://source.unsplash.com/200x200/?chill,music",
        artist: "Various",
      },
      {
        title: "Workout Mix",
        cover: "https://source.unsplash.com/200x200/?workout,music",
        artist: "Various",
      },
      {
        title: "Indie Essentials",
        cover: "https://source.unsplash.com/200x200/?indie,music",
        artist: "Various",
      },
      {
        title: "Hip-Hop Bangers",
        cover: "https://source.unsplash.com/200x200/?hiphop,music",
        artist: "Various",
      },
    ];

    featuredContainer.innerHTML = "";

    featuredTracks.forEach((track) => {
      const trackCard = document.createElement("div");
      trackCard.className = "track-card";
      trackCard.innerHTML = `
                <img src="${track.cover}" alt="${track.title}">
                <h3>${track.title}</h3>
                <p>${track.artist}</p>
            `;

      featuredContainer.appendChild(trackCard);
    });
  }
}

// Initialize player when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  const player = new MusicPlayer();
});
