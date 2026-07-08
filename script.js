async function loadTaste() {
  const response = await fetch("data/taste.json");
  if (!response.ok) {
    throw new Error("taste.json을 불러오지 못했습니다.");
  }
  return response.json();
}

function renderTags(tags) {
  const root = document.querySelector("#tags");
  root.innerHTML = tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
}

function renderMoods(moods) {
  const root = document.querySelector("#moods");
  root.innerHTML = moods
    .map((mood) => `<span class="mood">${mood}</span>`)
    .join("");
}

function renderArtists(artists) {
  const root = document.querySelector("#artists");
  root.innerHTML = artists
    .map(
      (artist) => `
        <div class="artist">
          <strong>${artist.name}</strong>
          <span>${artist.mood}</span>
        </div>
      `,
    )
    .join("");
}

function renderRecommendations(songs) {
  const root = document.querySelector("#recommendations");
  root.innerHTML = songs
    .map(
      (song) => `
        <article class="song">
          <div>
            <h3>${song.title}</h3>
            <p class="artist-name">${song.artist}</p>
            <p>${song.reason}</p>
          </div>
          <a href="${song.url}" target="_blank" rel="noreferrer">듣기</a>
        </article>
      `,
    )
    .join("");
}

loadTaste()
  .then((data) => {
    document.querySelector("#profile-name").textContent = data.profile.name;
    document.querySelector("#headline").textContent = data.profile.headline;
    document.title = data.profile.name;

    renderTags(data.tags);
    renderMoods(data.moods);
    renderArtists(data.topArtists);
    renderRecommendations(data.recommendations);
  })
  .catch((error) => {
    document.querySelector("#headline").textContent = error.message;
  });
