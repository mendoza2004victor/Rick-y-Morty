const API_BASE = 'https://rickandmortyapi.com/api/character';
let currentUrl = API_BASE;

const nameInput = document.getElementById('name');
const statusInput = document.getElementById('status');
const genderInput = document.getElementById('gender');
const filterBtn = document.getElementById('filterBtn');
const charactersDiv = document.getElementById('characters');
const statusMessage = document.getElementById('statusMessage');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

async function fetchCharacters(url) {
  statusMessage.textContent = 'Cargando...';
  charactersDiv.innerHTML = '';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se encontraron resultados');
    const data = await res.json();

    renderCharacters(data.results);
    updatePagination(data.info);
    statusMessage.textContent = '';
  } catch (err) {
    statusMessage.textContent = err.message;
    nextBtn.disabled = true;
    prevBtn.disabled = true;
  }
}

function renderCharacters(characters) {
  charactersDiv.innerHTML = characters.map(char => `
    <div class="bg-gray-800 p-4 rounded shadow bg-blue-900">
      <img src="${char.image}" alt="${char.name}" class="w-full h-48 object-cover rounded mb-2" />
      <h2 class="text-xl font-bold">${char.name}</h2>
      <p><strong>Estado:</strong> ${char.status}</p>
      <p><strong>Especie:</strong> ${char.species}</p>
    </div>
  `).join('');
}

function updatePagination(info) {
  nextBtn.disabled = !info.next;
  prevBtn.disabled = !info.prev;
  nextBtn.dataset.url = info.next;
  prevBtn.dataset.url = info.prev;
}

function buildQuery() {
  let query = [];
  if (nameInput.value) query.push(`name=${nameInput.value}`);
  if (statusInput.value) query.push(`status=${statusInput.value}`);
  if (genderInput.value) query.push(`gender=${genderInput.value}`);
  return `${API_BASE}?${query.join('&')}`;
}

// Eventos
filterBtn.addEventListener('click', () => {
  currentUrl = buildQuery();
  fetchCharacters(currentUrl);
});

nextBtn.addEventListener('click', () => {
  if (nextBtn.dataset.url) {
    currentUrl = nextBtn.dataset.url;
    fetchCharacters(currentUrl);
  }
});

prevBtn.addEventListener('click', () => {
  if (prevBtn.dataset.url) {
    currentUrl = prevBtn.dataset.url;
    fetchCharacters(currentUrl);
  }
});

// Cargar personajes al inicio
fetchCharacters(currentUrl);
