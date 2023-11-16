import { config } from './config.js';
import { getJSON } from './helper.js';

export const state = {
  jobs: [],
  bookmarks: [],
  pagination: {
    pageLimit: 10,
    currentPage: 1,
  },
  category: [],
  country: [],
  filterCategory: '',
  filterCountry: '',
  jobSkill: '',
  city: '',
};

const createOptions = function (parent, data) {
  parent.innerHTML = '';
  // add default option
  const defaultOption = document.createElement('option');
  defaultOption.setAttribute('value', 'all');
  defaultOption.textContent = 'All';
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
  createOptions(categorySelect, category);
  // first clear all the options
};

const addCountryOptions = function (country) {
  const countrySelect = document.querySelector('.country__select');
  // first clear all the options
  createOptions(countrySelect, country);
};
const createJobObject = function (results) {
  const jobCategory = new Set();
  const jobCountry = new Set();
  state.bookmarks = localStorage.getItem('bookmarks')
    ? JSON.parse(localStorage.getItem('bookmarks'))
    : [];
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

  const categorires = document.querySelectorAll('.categories__list .list__item');
  // remove active class
  categorires.forEach(c => c.classList.remove('active'));
  categorires[0].classList.add('active');
}

// get jobs
export const getJobs = async () => {
  const data = await getJSON(`${config.url}jobs`);
  if (!data.ok) throw new Error(`${results.message} (${data.status})`);
  const results = await data.json();
  createJobObject(results);
  resetFilter();
  addCountryOptions(state.country);
  addCategoryOptions(state.category);
};

export const addToLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const getJobDescription = function (jobId) {
  const data = state.jobs.find(job => job.jobId === +jobId);
  return data;
};

export const filterJobs = async function () {
  const data = await getJSON(
    `${config.url}jobs/search?job_category=${state.filterCategory}&country=${state.filterCountry}&city=${state.city}&job_skill=${state.jobSkill}`
  );
  if (!data.ok) {
    throw new Error(`${data.message} (${data.status})`);
  }
  const results = await data.json();
  console.log(results)
  if (results.length !== 0) createJobObject(results);
};

export const getSearchResultsPage = function (page = 1) {
  state.pagination.currentPage = page;
  const start = (page - 1) * state.pagination.pageLimit;
  const end = page * state.pagination.pageLimit;
  return state.jobs.slice(start, end);
};