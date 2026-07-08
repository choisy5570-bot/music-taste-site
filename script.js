async function loadTaste() {
  const response = await fetch("data/taste.json");
  if (!response.ok) {
    throw new Error("취향 데이터를 불러오지 못했습니다.");
  }
  return response.json();
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function musicSearchUrl(title, artist) {
  return `https://music.youtube.com/search?q=${encodeURIComponent(`${artist} ${title}`)}`;
}

function coverVars(item, index) {
  const palettes = [
    ["#ff4d5d", "#2b0306", "#c51d2c"],
    ["#64d4bd", "#0c2f32", "#734dff"],
    ["#4aa3ff", "#06162b", "#f7378c"],
    ["#ffcc3f", "#281b05", "#ff5d7a"],
    ["#bda2ff", "#11102a", "#64d4bd"],
  ];
  const colors = item.colors || palettes[index % palettes.length];
  return `--cover-a:${colors[0]};--cover-b:${colors[1]};--cover-c:${colors[2]};`;
}

function renderTags(tags) {
  document.querySelector("#tags").innerHTML = tags
    .map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`)
    .join("");
}

function renderTopCards(cards) {
  document.querySelector("#top-cards").innerHTML = cards
    .map((card, index) => {
      const mainUrl = card.url || musicSearchUrl(card.title, card.artist);
      const rows = card.ranks
        .map(
          (rank) => `
            <div>
              <span><strong>#${rank.rank}</strong> ${escapeHTML(rank.name)}</span>
              <b>${escapeHTML(rank.count)}</b>
            </div>
          `,
        )
        .join("");

      return `
        <article class="music-card">
          <div class="music-card__stat">
            <span>${escapeHTML(card.type)} +${escapeHTML(card.change)}</span>
            <strong>${escapeHTML(card.total)}</strong>
          </div>
          <div class="cover" style="${coverVars(card, index)}">
            <span class="badge">${escapeHTML(card.badge)}</span>
            <h3>${escapeHTML(card.title)}</h3>
            <p>${escapeHTML(card.artist)}</p>
          </div>
          <div class="rank-list">${rows}</div>
          <a class="music-card__link" href="${escapeHTML(mainUrl)}" target="_blank" rel="noreferrer">YouTube Music에서 듣기</a>
        </article>
      `;
    })
    .join("");
}

function renderDecades(decades) {
  document.querySelector("#decades").innerHTML = decades
    .map(
      (item) => `
        <div class="decade">
          <span>${escapeHTML(item.label)}</span>
          <span style="--value:${escapeHTML(item.value)}%"></span>
        </div>
      `,
    )
    .join("");
}

function renderListenList(songs) {
  document.querySelector("#listen-list").innerHTML = songs
    .map((song, index) => {
      const url = song.url || musicSearchUrl(song.title, song.artist);
      return `
        <a class="listen-item" href="${escapeHTML(url)}" target="_blank" rel="noreferrer">
          <span class="mini-cover" style="${coverVars(song, index)}"></span>
          <span>
            <strong>${escapeHTML(song.title)}</strong>
            <span>${escapeHTML(song.artist)} · ${escapeHTML(song.mood)}</span>
          </span>
          <em>듣기</em>
        </a>
      `;
    })
    .join("");
}

loadTaste()
  .then((data) => {
    document.title = data.profile.name;
    document.querySelector("h1").textContent = data.profile.name;
    document.querySelector("#headline").textContent = data.profile.headline;
    document.querySelector("#scrobble-count").textContent = data.stats.scrobbles;

    renderTags(data.tags);
    renderTopCards(data.topCards);
    renderDecades(data.decades);
    renderListenList(data.listen);
  })
  .catch((error) => {
    document.querySelector("#headline").textContent = error.message;
  });

document.querySelector("#shuffle-theme").addEventListener("click", () => {
  document.body.classList.toggle("theme-blue");
});
