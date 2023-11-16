import { View } from './view.js';

class DescriptionView extends View {
  _parentElement = document.querySelector('.job__description');

  addHandlerRender(handler) {
    document.querySelectorAll('.job__card').forEach(card => {
      card.addEventListener('click', function (e) {
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
        <div class="job__desc__container active">
            <div class="close-btn">
              X
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
              <ion-icon class="bookmark" name="bookmark-outline"></ion-icon>
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
              <button class="card-btn">Apply</button>
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

export default new DescriptionView();
