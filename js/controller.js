import * as model from './model.js';
import descriptionView from './views/descriptionView.js';
import filterView from './views/filterView.js';
import jobCardView from './views/jobCardView.js';
import paginationView from './views/paginationView.js';

const jobsCardController = async function () {
  try {
    jobCardView.renderSpinner();
    await model.getJobs();
    jobCardView.render(model.getSearchResultsPage());
    descriptionView.addHandlerRender(descriptionController);
    paginationView.render(model.state);
  } catch (err) {
    console.log(err);
  }
};

const addBookMarkController = function (jobCardBookMarkBtn, jobId) {
  const operation = jobCardView.addBookMark(jobCardBookMarkBtn);
  if (operation) {
    model.state.bookmarks.push(+jobId);
  } else {
    const index = model.state.bookmarks.indexOf(+jobId);
    model.state.bookmarks.splice(index, 1);
  }
  model.addToLocalStorage();
};

const descriptionController = async function (jobId) {
  try {
    const data = model.getJobDescription(jobId);
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
    if (
      category !== model.state.filterCategory ||
      country !== model.state.filterCountry
    ) {
      jobCardView.renderSpinner();
      model.state.filterCategory = category;
      model.state.filterCountry = country;
      await model.filterJobs();
      jobCardView.render(model.getSearchResultsPage());
      descriptionView.addHandlerRender(descriptionController);
      paginationView.render(model.state);
    }
  } catch (err) {
    console.log(err);
  }
};

const searchController = async function ({ jobSkill, city }) {
  try {
    jobCardView.renderSpinner();
    document.getElementById('jobs').scrollIntoView();
    model.state.jobSkill = jobSkill;
    model.state.city = city;
    await model.filterJobs();
    jobCardView.render(model.getSearchResultsPage());
    descriptionView.addHandlerRender(descriptionController);
    paginationView.render(model.state);
  } catch (err) {
    console.log(err);
  }
};

const controlerPagination = function (goToPage) {
  jobCardView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state);
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
