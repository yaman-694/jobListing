import { View } from './view.js';

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
            <ion-icon class="bookmark" name="bookmark${job.bookmarked ? '' : '-outline'}"></ion-icon>
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
            <button class="card-btn">Apply</button>
          </div>
          </div>`;
  }
}

export default new JobCardView();
