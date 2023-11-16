import { View } from './view.js';

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
          ? categorySelect?.value !== 'all'
            ? categorySelect?.value
            : this._category
          : this._category;
      }
      handler(this._category, this._country);
    });
  }
}

export default new FilterView();
