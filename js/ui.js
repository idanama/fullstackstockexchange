const searchBar = document.querySelector('.search-bar');
const searchButton = searchBar.querySelector('#search-button');
let searchOpen = false;

const genericLoaderFill = '<div class="flex-center loader"><img src="/res/icons/loader.svg"></div>';

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

searchButton.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!searchOpen) {
    changeSearchBarState(1);
  } else if (searchBar.querySelector('input').value) {
    const query = searchBar.querySelector('input').value;
    const res = await searchQuery(query);
    changeSearchBarState(2);

    const list = document.createElement('ul');

    if (res.length > 0) {
      res.forEach((stock) => {
        const li = document.createElement('li');
        li.innerHTML = `<div><a href="/company.html?symbol=${stock.symbol}">${stock.name}</div><div>${stock.symbol}</a></div>`;
        list.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.innerHTML = '<div>No results found</div><div>🧐</div>';
      list.appendChild(li);
    }
    searchBar.querySelector('.search-results').innerHTML = null;
    searchBar.querySelector('.search-results').appendChild(list);
  }
});

searchBar.querySelector('#search-close').addEventListener('click', (e) => {
  e.preventDefault();
  changeSearchBarState(0);
});

const searchBarLoader = (truth) => {
  if (truth) {
    searchButton.querySelector('img').src = '/res/icons/loader.svg';
    searchButton.classList.add('loader');
  } else {
    searchButton.querySelector('img').src = '/res/icons/search.svg';
    searchButton.classList.remove('loader');
  }
};
