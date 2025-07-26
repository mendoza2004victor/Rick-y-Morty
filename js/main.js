const API_BASE = "https://rickandmortyapi.com/api/character";

const charactersContainer = document.getElementById("characters");
const loading = document.getElementById("loading");
const noResults = document.getElementById("noResults");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const nameFilter = document.getElementById("nameFilter");
const statusFilter = document.getElementById("statusFilter");
const genderFilter = document.getElementById("genderFilter");
const filterBtn = document.getElementById("filterBtn");

let currentUrl = API_BASE;

filterBtn.addEventListener("click", () => {
  const name = nameFilter.value.trim();
  const status = statusFilter.value;
  const gender = genderFilter.value;

  let url = `${API_BASE}/?`;
  if (name) url += `name=${name}&`;
  if (status) url += `status=${status}&`;
  if (gender) url += `gender=${gender}&`;

  currentUrl = url;
  fetchCharacters(currentUrl);
});

prevBtn.addEventListener("click", () => {
  if (prevBtn.dataset.url) {
    currentUrl = prevBtn.dataset.url;
    fetchCharacters(currentUrl);
  }
});

nextBtn.addEventListener("click", () => {
  if (nextBtn.dataset.url) {
    currentUrl = nextBtn.dataset.url;
    fetchCharacters(currentUrl);
  }
});

async function fetchCharacters(url) {
  loading.classList.remove("hidden");
  noResults.classList.add("hidden");
  charactersContainer.innerHTML = "";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("No hay resultados");

    const data = await res.json();

    // Paginación
    prevBtn.disabled = !data.info.prev;
    nextBtn.disabled = !data.info.next;
    prevBtn.dataset.url = data.info.prev;
    nextBtn.dataset.url = data.info.next;

    renderCharacters(data.results);
  } catch (error) {
    noResults.classList.remove("hidden");
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  } finally {
    loading.classList.add("hidden");
  }
}

function renderCharacters(characters) {
  charactersContainer.innerHTML = characters
    .map((char) => {
      return `
        <div class="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <img src="${char.image}" alt="${char.name}" class="w-full h-auto rounded mb-2" />
          <h2 class="text-xl font-semibold">${char.name}</h2>
          <p><strong>Estado:</strong> ${char.status}</p>
          <p><strong>Especie:</strong> ${char.species}</p>
        </div>
      `;
    })
    .join("");
}

// Cargar primera página
fetchCharacters(currentUrl);
