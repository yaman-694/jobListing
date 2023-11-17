// config
const config = {
  url: 'https://api.recruitcrm.io/v1/',
  token:
    '7ph7atKWpBgK5rQQDbd1alptL2UiQ1vusYTB8hb8B6UP7bLKmb2qt3HRjScQa9nunJuI5cdhpqU0kyVrzHm5TF8xNjk3MDMyNDU2',
};

// helper functions
const getJSON = async (url, options) => {
  const data = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/json',
    },
  });

  return data;
};

// Model
const state = {
  jobs: [],
  bookmarks: [],
  applied: [],
  pagination: {
    pageLimit: 5,
    currentPage: 1,
  },
  category: [],
  country: [],
  filterCategory: '',
  filterCountry: '',
  jobSkill: '',
  city: '',
};

const createOptions = function (parent, data, type) {
  parent.innerHTML = '';
  // add default option
  const defaultOption = document.createElement('option');
  defaultOption.setAttribute('value', '');
  defaultOption.textContent = `All ${type}`;
  parent.appendChild(defaultOption);
  data.forEach(c => {
    const option = document.createElement('option');
    option.setAttribute('value', c);
    option.textContent = c;
    parent.appendChild(option);
  });
};

const addCategoryOptions = function (category) {
  const categorySelect = document.querySelector('.category__select');
  createOptions(categorySelect, category, 'Categories');
  // first clear all the options
};

const addCountryOptions = function (country) {
  const countrySelect = document.querySelector('.country__select');
  // first clear all the options
  createOptions(countrySelect, country, 'Countries');
};
const createJobObject = function (results) {
  const jobCategory = new Set();
  const jobCountry = new Set();
  const bookmarks = localStorage.getItem('bookmarks');
  const applied = localStorage.getItem('applied');
  if (applied) state.applied = JSON.parse(applied);
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
  state.jobs = results.data.map(data => {
    jobCategory.add(data.job_category);
    jobCountry.add(data.country);
    return {
      jobId: data.id,
      position: data.name,
      city: data.city,
      locality: data.locality,
      country: data.country,
      description: data.job_description_text,
      techStack: data.job_skill,
      jobCategory: data.job_category,
      contract: data.job_type,
      postedAt: data.created_at,
      bookmarked: state.bookmarks.includes(data.id),
      applied: state.applied.includes(data.id),
    };
  });
  state.category = [...jobCategory];
  state.country = [...jobCountry];
};

const resetFilter = function () {
  state.filterCategory = '';
  state.filterCountry = '';
  state.jobSkill = '';
  state.city = '';

  const categorires = document.querySelectorAll(
    '.categories__list .list__item'
  );
  // remove active class
  categorires.forEach(c => c.classList.remove('active'));
  categorires[0].classList.add('active');
};

// get jobs
const getJobs = async () => {
  resetFilter();
  const data = await getJSON(`${config.url}jobs`);
  if (!data.ok) throw new Error(`${results.message} (${data.status})`);
  const results = await data.json();
  createJobObject(results);
  addCountryOptions(state.country);
  addCategoryOptions(state.category);
};

const addToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
  localStorage.setItem('applied', JSON.stringify(state.applied));
};

const getJobDescription = function (jobId) {
  const data = state.jobs.find(job => job.jobId === +jobId);
  return data;
};

const filterJobs = async function () {
  let data;
  if (
    state.filterCategory === '' &&
    state.filterCountry === '' &&
    state.city === '' &&
    state.jobSkill === ''
  ) {
    data = await getJSON(`${config.url}jobs`);
  } else {
    data = await getJSON(
      `${config.url}jobs/search?job_category=${state.filterCategory}&country=${state.filterCountry}&city=${state.city}&job_skill=${state.jobSkill}`
    );
  }
  if (!data.ok) {
    throw new Error(`${data.message} (${data.status})`);
  }
  const results = await data.json();
  console.log(results);
  if (results.length !== 0) createJobObject(results);
};

const getSearchResultsPage = function (page = 1) {
  state.pagination.currentPage = page;
  const start = (page - 1) * state.pagination.pageLimit;
  const end = page * state.pagination.pageLimit;
  return state.jobs.slice(start, end);
};

// views

// view class

class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log(data);
    }
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="../imgs/icons.svg#icon-loader"></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

// job card view

class JobCardView extends View {
  _parentElement = document.querySelector('.jobs__container');

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
    document.querySelector('.reset-btn').addEventListener('click', handler);
  }

  _generateMarkup() {
    return this._data.map(this._generateMarkupCard).join('');
  }
  addBookMarkHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const jobCardBookMarkBtn = e.target.closest('.bookmark');
      if (!jobCardBookMarkBtn) return;
      const jobId = e.target.closest('.job__card').dataset.id;

      handler(jobCardBookMarkBtn, jobId);
    });
  }

  addBookMark(jobCardBookMarkBtn) {
    if (jobCardBookMarkBtn.name === 'bookmark-outline') {
      jobCardBookMarkBtn.name = 'bookmark';
      return true;
    } else if (jobCardBookMarkBtn.name === 'bookmark') {
      jobCardBookMarkBtn.name = 'bookmark-outline';
      return false;
    }
  }

  _generateMarkupCard(job) {
    return `
          <div class="job__card" data-id='${job.jobId}' >
          <div class="job__card__header">
            <div class="company">
              <img class='card-logo' src=${job.logo} alt="logo" />
              <h5>${job.company}</h5>
            </div>
            <ion-icon class="bookmark" name="bookmark${
              job.bookmarked ? '' : '-outline'
            }"></ion-icon>
          </div>
          <div class="job__card__body">
            <h5 class="job__card__title">
              <p>${job.position}</p>
            </h5>
            <div class="job__card__desc">
              <p class="location">${job.city}</p>
              <p class="package">${job.contract}</p>
            </div>
          </div>
          <div class="buttons">
            <p class="date">${job.postedAt}</p>
            <button class="card-btn ${job.applied ? 'active' : ''}">${
      job.applied ? 'Applied' : 'Apply'
    }</button>
          </div>
          </div>`;
  }
}

// description view
class DescriptionView extends View {
  _parentElement = document.querySelector('.job__description');

  addHandlerRender(handler) {
    document.querySelectorAll('.job__card').forEach(card => {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.bookmark') || e.target.closest('.card-btn'))
          return;
        const jobId = e.target.closest('.job__card').dataset.id;
        handler(jobId);
      });
    });
  }

  addHandlerClose(handler) {
    document
      .querySelector('.job__desc__container')
      .addEventListener('click', function (e) {
        const closeBtn = e.target.closest('.close-btn');
        if (!closeBtn) return;
        handler();
      });
  }

  closeDescription() {
    document.querySelector('.job__desc__container').classList.remove('active');
  }

  _generateMarkup() {
    return this._generateDescriptionMarkup(this._data);
  }

  _generateDescriptionMarkup(job) {
    return `
        <div class="job__desc__container active" data-id=${job.jobId}>
            <div class="close-btn">
              <ion-icon name="close-outline"></ion-icon>
            </div>
            <div class="job__desc__header">
              <div class="company">
                <img
                  class="card-logo"
                  src=${job.logo}
                  alt="logo"
                />
                <h5>${job.company}</h5>
              </div>
              <ion-icon class="bookmark" name="bookmark${
                job.bookmarked ? '' : '-outline'
              }"></ion-icon>
            </div>
            <div class="job__card__body">
              <h5 class="job__card__title">
                <p>${job.position}</p>
              </h5>
              <div class="job__card__desc">
                <p class="location ${job.type}">${job.type}</p>
                <p class="location">${job.location}</p>
                <p class="package">${job.package}</p>
              </div>
            </div>
            <div class="buttons job__desc__btn">
              <p class="date">${job.postedAt}</p>
              <button class="card-btn ${job.applied ? 'active' : ''}">${
      job.applied ? 'Applied' : 'Apply'
    }</button>
            </div>

            <div class="job__desc__body">
              <div class="job__desc">
                <label class="heading-tertiary" for="description">Description</label>
                <p class="description">
                  ${job.description}
                </p>
              </div>
          </div>
        `;
  }
}

// filter view
class FilterView extends View {
  _parentElement = document.querySelector('.filter__container');
  _country = '';
  _category = '';

  addCategoryEvent() {
    this._parentElement.addEventListener('click', e => {
      const category = e.target.closest('.list__item');
      if (!category) return;
      // clear active class
      document
        .querySelectorAll('.list__item')
        .forEach(c => c.classList.remove('active'));
      // add active class
      category.classList.add('active');
    });
  }

  addHandlerSearch(handler) {
    const searchButton = document.querySelector('.search__btn');
    searchButton.addEventListener('click', e => {
      e.preventDefault();
      const jobSkill = document.querySelector('#job-skill');
      const city = document.querySelector('#city');
      handler({ jobSkill: jobSkill.value, city: city.value });
      //clear input fields
      jobSkill.value = '';
      city.value = '';
    });
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', e => {
      const category = e.target.closest('.list__item');
      const country = e.target.closest('.country__select');
      const categorySelect = document.querySelector('.category__select');
      this._country = country ? country?.value : this._country;
      if (
        !category
          ?.closest('.categories__container')
          .classList.contains('not-active')
      ) {
        this._category = category ? category?.id : this._category;
      }

      if (!categorySelect.classList.contains('not-active')) {
        this._category = categorySelect
          ? categorySelect?.value
          : this._category;
      }
      handler(this._category, this._country);
    });
  }
}

// pagination view

class PaginationView extends View {
  _parentElement = document.querySelector('.pages');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.page');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkupButton(curPage, numPages) {
    let markup = '';
    for (let pageNo = 1; pageNo <= numPages; pageNo++) {
      markup += `<li class="page ${
        curPage == pageNo ? 'active' : ''
      }" data-goto=${pageNo}>${pageNo}</li>`;
    }
    return markup;
  }
  _generateMarkup() {
    const curPage = this._data.pagination.currentPage;

    const numPages = Math.ceil(
      this._data.jobs.length / this._data.pagination.pageLimit
    );
    return this._generateMarkupButton(curPage, numPages);
  }
}

///////////////////////////////////////////////////
/// controller
const descriptionView = new DescriptionView();
const filterView = new FilterView();
const jobCardView = new JobCardView();
const paginationView = new PaginationView();

const jobsCardController = async function () {
  try {
    jobCardView.renderSpinner();
    await getJobs();
    jobCardView.render(getSearchResultsPage());
    descriptionView.addHandlerRender(descriptionController);
    paginationView.render(state);
  } catch (err) {
    console.log(err);
  }
};

const addBookMarkController = function (jobCardBookMarkBtn, jobId) {
  const operation = jobCardView.addBookMark(jobCardBookMarkBtn);
  if (operation) {
    state.bookmarks.push(+jobId);
  } else {
    const index = state.bookmarks.indexOf(+jobId);
    state.bookmarks.splice(index, 1);
  }
  addToLocalStorage();
};

const descriptionController = async function (jobId) {
  try {
    const data = getJobDescription(jobId);
    descriptionView.render(data);
    descriptionView.addHandlerClose(closeDescriptionController);
  } catch (err) {
    console.log(err);
  }
};

const closeDescriptionController = function () {
  descriptionView.closeDescription();
};

const filterController = async function (category, country) {
  try {
    console.log(category, country);
    if (category !== state.filterCategory || country !== state.filterCountry) {
      jobCardView.renderSpinner();
      state.filterCategory = category;
      state.filterCountry = country;
      await filterJobs();
      jobCardView.render(getSearchResultsPage());
      descriptionView.addHandlerRender(descriptionController);
      paginationView.render(state);
    }
  } catch (err) {
    console.log(err);
  }
};

const searchController = async function ({ jobSkill, city }) {
  try {
    jobCardView.renderSpinner();
    document.getElementById('jobs').scrollIntoView();
    state.jobSkill = jobSkill;
    state.city = city;
    await filterJobs();
    jobCardView.render(getSearchResultsPage());
    descriptionView.addHandlerRender(descriptionController);
    paginationView.render(state);
  } catch (err) {
    console.log(err);
  }
};

const controlerPagination = function (goToPage) {
  jobCardView.render(getSearchResultsPage(goToPage));
  paginationView.render(state);
  descriptionView.addHandlerRender(descriptionController);
};
const init = function () {
  jobCardView.addHandlerRender(jobsCardController);
  filterView.addCategoryEvent();
  jobCardView.addBookMarkHandler(addBookMarkController);
  filterView.addHandlerRender(filterController);
  filterView.addHandlerSearch(searchController);
  paginationView.addHandlerClick(controlerPagination);
};
init();
