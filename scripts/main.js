
import data from './data.js';
import { searchMovieByTitle, makeBgActive, createButton } from './helpers.js';

class MoviesApp {
  constructor(options) {
    const {
      root, searchInput, searchForm, yearHandler, yearSubmitter, yearFilter, genreFilter, genreSubmitter, genreHandler
    } = options;

    this.$tableEl = document.getElementById(root);
    this.$tbodyEl = this.$tableEl.querySelector('tbody');

    this.$searchInput = document.getElementById(searchInput);
    this.$searchForm = document.getElementById(searchForm);

    this.$yearFilteringBox = document.getElementById(yearFilter);
    this.yearSubmitter = yearSubmitter;
    this.yearItems = [];
    this.yearCounts = [];
    this.yearHandler = yearHandler;

    this.$genreFilteringBox = document.getElementById(genreFilter);
    this.genreSubmitter = genreSubmitter;
    this.genreItems = [];
    this.genreCounts = [];
    this.genreHandler = genreHandler;

  }
    
    createMovieEl(movie) {
      const { image, title, genre, year, id } = movie;
      return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`;
    }

    fillTable() {
      const moviesArr = data.map((movie) => {
          return this.createMovieEl(movie);
        }).join('');
      this.$tbodyEl.innerHTML = moviesArr;
    }

    reset() {
      this.$tbodyEl.querySelectorAll('tr').forEach((item) => {
        item.style.background = 'transparent';
      });
    }

    // YEAR HANDLING AND FILTERING

    getMovieYears() {
      data.forEach((movie) => {
        if (!this.yearItems.includes(movie.year)) {
          this.yearItems.push(movie.year);
        }
      });

      this.yearItems.sort();
      this.getYearCounts();
    }
  
    getYearCounts() {
      this.yearItems.forEach((year) => {
        let count = 0;

        data.forEach((movie) => {
          if (year === movie.year) {
            count++;
          }
        });

        this.yearCounts.push(count);
      });
    }

    createYearFilteringEl(year, index) {
      return `<div class='form-check'>
                <input
                  class="form-check-input"
                  type="radio"
                  id="${year}-${index}"
                  value="${year}"
                  name="year"
                />
                <label class="form-check-label" for="${year}-${index}"> ${year} (${this.yearCounts[index]}) </label>
              </div>`;
    }
  
    yearFiltering() {
      this.yearItems.forEach((year, index) => {
        this.$yearFilteringBox.innerHTML += this.createYearFilteringEl(
          year, index
        );
      });

      const $yearFilterBtn = createButton(
        this.yearSubmitter,
        'submit',
        ['btn', 'btn-primary'],
        'Filter'
      );

      this.$yearFilteringBox.append($yearFilterBtn);
    }
  
    resetYearFiltering() {
      const $checkEl = this.$yearFilteringBox.querySelector(
        `input[name='${this.yearHandler}']:checked`
      );

      if ($checkEl) {
        $checkEl.checked = false;
      }
    }

  // GENRE HANDLING AND FILTERING

  getMovieGenres() {
    data.forEach((movie) => {
      if (!this.genreItems.includes(movie.genre)) {
        this.genreItems.push(movie.genre);
      }
    });

    this.getGenreCounts();
  }

  getGenreCounts() {
    this.genreItems.forEach((genre) => {
      let count = 0;
      data.forEach((movie) => {
        if (genre === movie.genre) {
          count++;
        }
      });

      this.genreCounts.push(count);
    });
  }

  createGenreFilteringEl(genre, index) {
    return `
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="${genre}"
                value="${genre}"
                name="genre"
              />
              <label class="form-check-label" for="flexCheckDefault">
                ${genre} (${this.genreCounts[index]})
              </label>
            </div>`;
  }

  genreFiltering() {
    this.genreItems.forEach((genre, index) => {
      this.$genreFilteringBox.innerHTML += this.createGenreFilteringEl(
        genre, index
      );
    });
    const $genreFilterBtn = createButton(
      this.genreSubmitter,
      'submit',
      ['btn', 'btn-primary'],
      'Filter'
    );

    this.$genreFilteringBox.append($genreFilterBtn);
  }

  resetGenreFiltering() {
    const $checkEl = this.$genreFilteringBox.querySelectorAll(
      `input[name='${this.genreHandler}']:checked`
    );
    if ($checkEl) {
      $checkEl.forEach((el) => {
        el.checked = false;
      });
    }
  }

  // HANDLERS

  handleSearching() {
    this.$searchForm.addEventListener('submit', (event) => {
      this.reset();
      this.resetYearFiltering();
      this.resetGenreFiltering();
      event.preventDefault();

      const sVal = this.$searchInput.value;
      if (sVal) {
        data.filter((movie) => {
            return searchMovieByTitle(movie, sVal);
          })
          .forEach(makeBgActive);
        this.$searchInput.value = '';
      }
    });
  }

  handleYearFiltering() {
    this.$yearSubmitter = document.getElementById(this.yearSubmitter);
    this.$yearSubmitter.addEventListener('click', () => {
      this.reset();
      this.resetGenreFiltering();
      const selectedYear = document.querySelector(
        `input[name='${this.yearHandler}']:checked`
      ).value;
      data
        .filter((movie) => {
          return movie.year === selectedYear;
        })
        .forEach(makeBgActive);
    });
  }

  handleGenreFiltering() {
    this.$genreSubmitter = document.getElementById(this.genreSubmitter);
    this.$genreSubmitter.addEventListener('click', () => {
      this.reset();
      this.resetYearFiltering();

      const $slcGenres = document.querySelectorAll(
        `input[name='${this.genreHandler}']:checked`
      );
      
      if ($slcGenres) {
        $slcGenres.forEach((genreEl) => {
          data
            .filter((movie) => {
              return genreEl.value === movie.genre;
            })
            .forEach(makeBgActive);
        });
      }
    });
  }

  init() {
    this.getMovieYears();
    this.yearFiltering();
    this.getMovieGenres();
    this.genreFiltering();
    this.fillTable();
    this.handleSearching();
    this.handleYearFiltering();
    this.handleGenreFiltering();
  }
}

  let myMoviesApp = new MoviesApp({
    root: 'movies-table',
    searchInput: 'searchInput',
    searchForm: 'searchForm',

    yearFilter: 'yearFilter',
    yearSubmitter: 'yearSubmitter',
    yearHandler: 'year',

    genreFilter: 'genreFilter',
    genreSubmitter: 'genreSubmitter',
    genreHandler: 'genre',
  });

myMoviesApp.init();
