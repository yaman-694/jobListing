import { View } from './view.js';
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
      markup += `<li class="page ${curPage==pageNo? 'active': ''}" data-goto=${pageNo}>${pageNo}</li>`;
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

export default new PaginationView();
