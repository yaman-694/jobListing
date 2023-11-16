
// mobile navigation

const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEl = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
});

// smooth scrolling


const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const href = link.getAttribute("href");

    // Scroll back to top
    if (href === "#")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    // Scroll to other links
    if (href !== "#" && href.startsWith("#")) {
      const sectionEl = document.querySelector(href);
      sectionEl.scrollIntoView({ behavior: "smooth" });
    }

    // Close mobile naviagtion
    if (link.classList.contains("main-nav-link"))
      headerEl.classList.toggle("nav-open");
  });
});

const filterContainer = document.querySelector('.filter__container');

filterContainer.addEventListener('click', function (e) {
  let target = e.target.closest('.categories__container');
  if (target) {
    target.classList.remove('not-active');
    const categorySelect = document.querySelector('.category__select');
    categorySelect.classList.add('not-active');
    return;
  }
  target=null;
  target = e.target.closest('.category__select');
  if (target) {
    target.classList.remove('not-active');
    const categorySelect = document.querySelector('.categories__container');
    categorySelect.classList.add('not-active');
  }
});