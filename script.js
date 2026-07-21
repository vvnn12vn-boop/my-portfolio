/* ============================================================
   Data
   ============================================================ */

// Each movie owns its own fixed set of occupied seats, like a real
// showtime would - switching movies shows a different occupied map.
const movies = [
  {
    id: 1,
    genreIcon: '🚀',
    posterColor: '#3a3f7a',
    price: 12,
    title: { fa: 'افق شب‌هنگام', en: 'Nightfall Horizon' },
    genre: { fa: 'علمی‌تخیلی', en: 'Sci-Fi' },
    occupied: ['C4', 'C5', 'D3', 'D4', 'D5', 'E6', 'E7'],
  },
  {
    id: 2,
    genreIcon: '🎭',
    posterColor: '#7a3a4d',
    price: 10,
    title: { fa: 'اخگر و خاکستر', en: 'Ember & Ash' },
    genre: { fa: 'درام', en: 'Drama' },
    occupied: ['B2', 'B3', 'C5', 'C6', 'C7', 'D4'],
  },
  {
    id: 3,
    genreIcon: '🪐',
    posterColor: '#3a7a5e',
    price: 8,
    title: { fa: 'بچه‌های دنباله‌دار', en: 'Comet Kids' },
    genre: { fa: 'انیمیشن', en: 'Animation' },
    occupied: ['A3', 'A4', 'B5', 'B6', 'B7', 'F2'],
  },
  {
    id: 4,
    genreIcon: '🕶️',
    posterColor: '#7a5e3a',
    price: 11,
    title: { fa: 'سرقت نیمه‌شب', en: 'Midnight Heist' },
    genre: { fa: 'اکشن', en: 'Action' },
    occupied: ['D5', 'D6', 'E3', 'E4', 'E5', 'F6', 'F7'],
  },
];

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEATS_PER_ROW = 8;

const translations = {
  fa: {
    brandName: 'رزرو صندلی سینما',
    nowShowingEyebrow: 'اکران این هفته',
    chooseMovie: 'یک فیلم انتخاب کنید',
    screenLabel: 'پرده نمایش',
    legendAvailable: 'آزاد',
    legendSelected: 'انتخاب‌شده',
    legendOccupied: 'پر شده',
    seatsLabel: 'صندلی انتخاب‌شده',
    totalLabel: 'مبلغ قابل پرداخت',
    confirmBtn: 'تایید و رزرو بلیت',
    modalTitle: 'رزرو با موفقیت انجام شد',
    modalClose: 'رزرو جدید',
    seatAria: 'صندلی',
    seatOccupiedAria: 'صندلی پر شده',
    modalDetails: (movieTitle, seatList, total) =>
      `فیلم «${movieTitle}» — صندلی‌های ${seatList} — مبلغ کل $${total}`,
  },
  en: {
    brandName: 'Cinema Seat Booking',
    nowShowingEyebrow: 'Now showing',
    chooseMovie: 'Choose a movie',
    screenLabel: 'Screen',
    legendAvailable: 'Available',
    legendSelected: 'Selected',
    legendOccupied: 'Occupied',
    seatsLabel: 'Seats selected',
    totalLabel: 'Total due',
    confirmBtn: 'Confirm booking',
    modalTitle: 'Booking confirmed!',
    modalClose: 'New booking',
    seatAria: 'Seat',
    seatOccupiedAria: 'Occupied seat',
    modalDetails: (movieTitle, seatList, total) =>
      `"${movieTitle}" — seats ${seatList} — total $${total}`,
  },
};

const STORAGE_KEY = 'cinemaBookingState';

/* ============================================================
   State
   ============================================================ */

const state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      return {
        lang: saved.lang === 'en' ? 'en' : 'fa',
        movieId: movies.some((m) => m.id === saved.movieId) ? saved.movieId : movies[0].id,
        selectedSeats: Array.isArray(saved.selectedSeats) ? saved.selectedSeats : [],
      };
    }
  } catch (err) {
    console.warn('Could not read saved booking state:', err);
  }
  return { lang: 'fa', movieId: movies[0].id, selectedSeats: [] };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentMovie() {
  return movies.find((m) => m.id === state.movieId);
}

function t(key) {
  return translations[state.lang][key];
}

/* ============================================================
   DOM references
   ============================================================ */

const movieListEl = document.getElementById('movieList');
const seatMapEl = document.getElementById('seatMap');
const seatCountEl = document.getElementById('seatCount');
const totalPriceEl = document.getElementById('totalPrice');
const confirmBtn = document.getElementById('confirmBtn');
const langToggle = document.getElementById('langToggle');
const screenWrap = document.querySelector('.screen-wrap');
const modalOverlay = document.getElementById('modalOverlay');
const modalDetailsEl = document.getElementById('modalDetails');
const modalClose = document.getElementById('modalClose');

/* ============================================================
   Rendering
   ============================================================ */

function applyStaticTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[state.lang][key]) {
      el.textContent = translations[state.lang][key];
    }
  });

  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';

  langToggle.querySelectorAll('.lang-toggle__opt').forEach((opt) => {
    opt.classList.toggle('is-active', opt.dataset.langOpt === state.lang);
  });
}

function renderMovies() {
  movieListEl.innerHTML = movies
    .map((movie) => {
      const isSelected = movie.id === state.movieId;
      return `
        <button
          class="movie-card${isSelected ? ' is-selected' : ''}"
          data-id="${movie.id}"
          role="radio"
          aria-checked="${isSelected}"
        >
          <span class="movie-card__poster" style="background:${movie.posterColor}">${movie.genreIcon}</span>
          <span class="movie-card__body">
            <span class="movie-card__title">${movie.title[state.lang]}</span>
            <span class="movie-card__genre">${movie.genre[state.lang]}</span>
          </span>
          <span class="movie-card__price mono">$${movie.price}</span>
        </button>
      `;
    })
    .join('');
}

function renderSeatMap() {
  const movie = currentMovie();

  seatMapEl.innerHTML = ROWS.map((row) => {
    let seatsHtml = '';
    for (let n = 1; n <= SEATS_PER_ROW; n++) {
      const seatId = `${row}${n}`;
      const isOccupied = movie.occupied.includes(seatId);
      const isSelected = state.selectedSeats.includes(seatId);
      const ariaLabel = `${isOccupied ? t('seatOccupiedAria') : t('seatAria')} ${seatId}`;

      seatsHtml += `
        <button
          class="seat${isSelected ? ' seat--selected' : ''}${isOccupied ? ' seat--occupied' : ''}"
          data-seat="${seatId}"
          aria-label="${ariaLabel}"
          aria-pressed="${isSelected}"
          ${isOccupied ? 'disabled' : ''}
        ></button>
      `;

      // Aisle gaps: after seat 2 and after seat 6, giving a 2 | 4 | 2 layout
      if (n === 2 || n === 6) {
        seatsHtml += '<span class="seat-gap" aria-hidden="true"></span>';
      }
    }

    return `
      <div class="seat-row">
        <span class="seat-row__label mono">${row}</span>
        <div class="seat-row__seats">${seatsHtml}</div>
      </div>
    `;
  }).join('');
}

function updateSummary() {
  const movie = currentMovie();
  const count = state.selectedSeats.length;
  const total = count * movie.price;

  seatCountEl.textContent = count;
  totalPriceEl.textContent = total;
  confirmBtn.disabled = count === 0;
  screenWrap.classList.toggle('has-selection', count > 0);
}

function render() {
  applyStaticTranslations();
  renderMovies();
  renderSeatMap();
  updateSummary();
}

/* ============================================================
   Event handlers
   ============================================================ */

function handleMovieSelect(e) {
  const card = e.target.closest('.movie-card');
  if (!card) return;

  const id = Number(card.dataset.id);
  if (id === state.movieId) return;

  state.movieId = id;
  state.selectedSeats = []; // seats belong to a specific showtime
  saveState();

  renderMovies();
  renderSeatMap();
  updateSummary();
}

function handleSeatClick(e) {
  const seatBtn = e.target.closest('.seat');
  if (!seatBtn || seatBtn.disabled) return;

  const seatId = seatBtn.dataset.seat;
  const index = state.selectedSeats.indexOf(seatId);

  if (index > -1) {
    state.selectedSeats.splice(index, 1);
    seatBtn.classList.remove('seat--selected');
    seatBtn.setAttribute('aria-pressed', 'false');
  } else {
    state.selectedSeats.push(seatId);
    seatBtn.classList.add('seat--selected');
    seatBtn.setAttribute('aria-pressed', 'true');
  }

  saveState();
  updateSummary();
}

function handleConfirm() {
  if (state.selectedSeats.length === 0) return;

  const movie = currentMovie();
  const total = state.selectedSeats.length * movie.price;
  const seatList = [...state.selectedSeats].sort().join(', ');

  modalDetailsEl.textContent = translations[state.lang].modalDetails(movie.title[state.lang], seatList, total);
  modalOverlay.hidden = false;

  // The booking is complete - clear the selection for this showtime
  state.selectedSeats = [];
  saveState();
  renderSeatMap();
  updateSummary();
}

function closeModal() {
  modalOverlay.hidden = true;
}

function toggleLanguage() {
  state.lang = state.lang === 'fa' ? 'en' : 'fa';
  saveState();
  render();
}

/* ============================================================
   Init
   ============================================================ */

movieListEl.addEventListener('click', handleMovieSelect);
seatMapEl.addEventListener('click', handleSeatClick);
confirmBtn.addEventListener('click', handleConfirm);
modalClose.addEventListener('click', closeModal);
langToggle.addEventListener('click', toggleLanguage);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

render();
