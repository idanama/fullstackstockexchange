import stockApi from './api.js';
import Marquee from './Marquee.js';
import { debounce, urlParams } from './generic.js';

const searchBar = document.querySelector('.search-bar');
const searchButton = searchBar.querySelector('#search-button');
const searchForm = searchBar.querySelector('#search-form');
let searchOpen = false;

const genericLoaderFill = '<div class="flex-center loader"><img src="/res/icons/loader.svg"></div>';

const searchBarLoader = (truth) => {
  if (truth) {
    searchButton.querySelector('img').src = '/res/icons/loader.svg';
    searchButton.classList.add('loader');
  } else {
    searchButton.querySelector('img').src = '/res/icons/search.svg';
    searchButton.classList.remove('loader');
  }
};

const search = async (query) => {
  const res = await stockApi.searchBar(query, searchBarLoader);
  changeSearchBarState(2);

  if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    urlParams('query', query);
  }

  const list = document.createElement('ul');

  if (res.length > 0) {
    res.forEach((stock) => {
      const li = document.createElement('li');
      li.id = `result-${stock.symbol}`;
      li.innerHTML = `
        <a href="/company.html?symbol=${stock.symbol}">
          <div>
            <div class="image"></div>
            <div class="name">${stock.name}</div>
          </div>
          <div>
            <div class="change"></div>
            <div class="symbol">${stock.symbol}</div>
          </div>
        </a>
        `;
      list.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.innerHTML = '<div><div>No results found</div><div>🧐</div></div>';
    list.appendChild(li);
  }
  searchBar.querySelector('.search-results').innerHTML = null;
  searchBar.querySelector('.search-results').appendChild(list);

  if (res.length > 0) {
    for (let i = 0; i < res.length; i += 1) {
      const quote = await stockApi.company(res[i].symbol);
      const stock = {
        ...quote.profile,
        symbol: quote.symbol,
      };
      const li = document.querySelector(`#result-${stock.symbol}`);
      li.querySelector('.change').innerHTML = `
            <span class="${stock.changes >= 0 ? 'good' : 'bad'}">
            ${(((stock.changes / (stock.price - stock.changes)) * 100) || 0).toFixed(2)}%
            </span>
            `;
      li.querySelector('.image').innerHTML = `<img src="${stock.image}">`;
    }
  }
};

const changeSearchBarState = (phase) => {
  switch (phase) {
    case 0:
      searchBar
        .querySelectorAll('.search-input')
        .forEach((item) => item.classList.add('d-none'));
      searchBar
        .querySelector('.search-results').classList.add('d-none');
      searchBar.classList.remove('table');
      searchBar.classList.add('minimized');
      searchBar.querySelector('#search').value = null;
      searchOpen = false;
      break;
    case 1:
      searchBar
        .querySelectorAll('.search-input')
        .forEach((item) => item.classList.remove('d-none'));
      searchBar.classList.remove('minimized');
      searchOpen = true;
      break;
    case 2:
      searchBar.querySelector('.search-results').classList.remove('d-none');
      searchBar.classList.add('table');
      break;
    default:
      break;
  }
};

const searchNow = () => {
  search(searchBar.querySelector('input').value);
};

searchButton.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!searchOpen) {
    changeSearchBarState(1);
  } else {
    searchNow();
  }
});

searchForm.addEventListener('input', debounce(searchNow));

searchBar.querySelector('#search-close').addEventListener('click', (e) => {
  e.preventDefault();
  changeSearchBarState(0);
});

const buildMarquee = async () => {
  const marqueeWrapper = document.createElement('div');
  marqueeWrapper.classList.add('marquee-wrapper');
  marqueeWrapper.append(await new Marquee(marqueeWrapper).build());
  document.body.append(marqueeWrapper);
};

if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
  const query = urlParams('query');
  if (query) {
    changeSearchBarState(1);
    searchBar.querySelector('#search').value = query;
    search(query);
  }
}

buildMarquee();

export { genericLoaderFill, urlParams };
