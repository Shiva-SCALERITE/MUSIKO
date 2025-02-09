class DeezerAPI {
  constructor() {
    this.baseUrl = "https://api.deezer.com";
    this.corsProxy = "https://cors-anywhere.herokuapp.com/";
  }

  async search(query) {
    try {
      const response = await fetch(
        `${this.corsProxy}${this.baseUrl}/search?q=${query}`
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  async getPlaylist(id) {
    try {
      const response = await fetch(
        `${this.corsProxy}${this.baseUrl}/playlist/${id}`
      );
      return await response.json();
    } catch (error) {
      console.error("Get playlist error:", error);
      return null;
    }
  }

  async getFeaturedPlaylists() {
    try {
      const response = await fetch(
        `${this.corsProxy}${this.baseUrl}/chart/0/playlists`
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Get featured playlists error:", error);
      return [];
    }
  }
}
