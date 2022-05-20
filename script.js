const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");
const year = document.getElementById("year");

year.innerHTML = new Date().getFullYear();
const apiURL = "https://api.lyrics.ovh";

// Search by song or artist name
// Use an async await function behind the scenes,
// avoids .then() chaining
async function searchSongs(term) {
  // fetch(`${apiURL}/suggest/${term}`)
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));

  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  console.log(data);
  showData(data);
}

// Show song and artist in DOM
function showData(data) {
  // Set the results section to a <ul>,
  // map through the data array,
  // join at the end
  result.innerHTML = `<ul class="songs">
  ${data.data
    .map(
      (song) =>
        ` <li>
    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
    <button data-artist="${song.artist.name}" data-song="${song.title}" class="btn">Get Lyrics</button>
    </li>`
    )
    .join("")}
  </ul>`;

  if (data.next || data.prev) {
    more.innerHTML = `
      ${
        data.prev
          ? `<button onClick="getMoreSongs('${data.prev}')" class="btn">Prev</button>`
          : ""
      }
      ${
        data.next
          ? `<button onClick="getMoreSongs('${data.next}')" class="btn">Next</button>`
          : ""
      }
    `;
  } else {
    more.innerHTML = "";
  }
}
// Get prev/next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors.eu.org/${url}`);
  const data = await res.json();
  console.log(data);
  showData(data);
}

// Get lyrics
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  console.log(data);

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br/>");

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>
  `;
  more.innerHTML = "";
}
// Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Grab the user input
  const searchTerm = search.value.trim();

  // Validate user input
  if (!searchTerm) {
    alert("Please type in an artist or song name!");
  } else {
    searchSongs(searchTerm);
  }
});

// Get lyrics button click
result.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-song");

    setTimeout(getLyrics(artist, songTitle), 2000);
  }
});
