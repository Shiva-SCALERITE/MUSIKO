const api = new DeezerAPI();
const player = new MusicPlayer();

// DOM Elements
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");
const navLinks = document.querySelectorAll(".nav-links li");
const sections = document.querySelectorAll(".section");
const featuredPlaylists = document.querySelector(".featured-playlists");
const sr = document.querySelector(".hide");

// Navigation
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetSection = link.textContent.trim().toLowerCase();

    // Update active states
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");

    // Show corresponding section
    sections.forEach((section) => {
      section.classList.remove("active");
      if (section.id === `${targetSection}-section`) {
        section.classList.add("active");
      }
    });
  });
});

// Search functionality
searchInput.addEventListener(
  "input",
  debounce(async (e) => {
    const query = e.target.value.trim();

    if (query) {
      const results = await api.search(query);
      displaySearchResults(results);
    } else {
      searchResults.innerHTML = "";
    }
  }, 300)
);

function displaySearchResults(tracks) {
  //searchresults.style.display = "none";
  searchResults.innerHTML = "";
  tracks.forEach((track) => {
    const trackCard = createTrackCard(track);
    searchResults.appendChild(trackCard);
  });
}

function createTrackCard(track) {
  const div = document.createElement("div");
  div.className = "track-card";
  div.innerHTML = `
        <img src="${track.album.cover_medium}" alt="${track.title}">
        <h3>${track.title}</h3>
        <p>${track.artist.name}</p>
    `;

  div.addEventListener("click", () => {
    player.setQueue([track]);
    player.loadTrack(track);
  });

  return div;
}

// Load featured playlists
async function loadFeaturedPlaylists() {
  const playlists = await api.getFeaturedPlaylists();
  displayFeaturedPlaylists(playlists);
}

function displayFeaturedPlaylists(playlists) {
  featuredPlaylists.innerHTML = "";
  playlists.forEach((playlist) => {
    const playlistCard = createPlaylistCard(playlist);
    featuredPlaylists.appendChild(playlistCard);
  });
}

function createPlaylistCard(playlist) {
  const div = document.createElement("div");
  div.className = "playlist-card";
  div.innerHTML = `
        <img src="${playlist.picture_medium}" alt="${playlist.title}">
        <h3>${playlist.title}</h3>
        <p>${playlist.user.name}</p>
    `;

  div.addEventListener("click", async () => {
    const fullPlaylist = await api.getPlaylist(playlist.id);
    if (fullPlaylist && fullPlaylist.tracks.data) {
      player.setQueue(fullPlaylist.tracks.data);
      player.loadTrack(fullPlaylist.tracks.data[0]);
    }
  });

  return div;
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize the application
loadFeaturedPlaylists();
