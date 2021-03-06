import { urlParams } from '../generic.js';
import stockApi from '../api.js';

import SearchList from './SearchList.js'
import CompareList from './CompareList.js'

class SearchBar {
  constructor(el) {
    this.el = el;
    this.form;
    this.searchButton;
    this.searchCloseButton;
    this.searchResults;
    this.searchInput;
    this.timeout;
    this.compareButtons;
    this.build();
    this.onLoad();
  }

  async build() {
    this.el.classList.add('minimized');

    this.form = document.createElement('form');
    this.form.id = 'search-form';
    this.form.autocomplete = 'off';

    this.searchButton = document.createElement('button');
    this.searchButton.classList.add('circle');
    this.searchButton.id = 'search-button';
    this.searchButton.innerHTML = '<img src="/res/icons/search.svg" alt="Search">';

    this.searchInput = document.createElement('input');
    this.searchInput.classList.add('search-input');
    this.searchInput.type = 'text';
    this.searchInput.name = 'search';
    this.searchInput.id = 'search';
    this.searchInput.placeholder = 'Search';

    this.searchCloseButton = document.createElement('button');
    this.searchCloseButton.classList.add('circle');
    this.searchCloseButton.id = 'search-close';
    this.searchCloseButton.innerHTML = '<img src="/res/icons/x.svg" alt="Close">';

    this.form.append(this.searchButton, this.searchInput, this.searchCloseButton);

    this.searchCompare = document.createElement('div');
    this.searchCompare.id='search-compare';
    this.compareButtons = new CompareList(this.searchCompare,this.compare);

    this.searchResults = document.createElement('div');
    this.searchResults.id = 'search-results';

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.el.classList.contains('minimized')) {
        this.state(1);
      } else {
        this.search();
      }
    });
    this.form.addEventListener('input', () => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.search, 700);
    });
    this.searchCloseButton.addEventListener('click',(e) => {
      e.preventDefault();
      this.state(0);
    })

    this.el.append(this.form,this.searchCompare, this.searchResults);
    this.preloadLoader();
  }

  preloadLoader() {
    const preload = document.createElement('img');
    preload.src="/res/icons/loader.svg";
  }

  compare = (symbol) => {
    if (this.compareButtons.list.includes(symbol)) {
      if (this.searchResults.querySelector(`#compare-${symbol} img`)) {
        this.searchResults.querySelector(`#compare-${symbol} img`).classList.remove('rotate45');
      } 
      this.compareButtons.remove(symbol);
      return false
    } else {
      if (this.compareButtons.list.length > 3) {
        // todo: feedback to user, max 
        return false
      }
      this.searchResults.querySelector(`#compare-${symbol} img`).classList.add('rotate45');
      this.compareButtons.add(symbol);
      return true
    }

  }

  search = async (query) => {

    // get query from input if not provided
    if (!query) {
      query = this.searchInput.value || null; 
    }
    
    // set parmas query in input
    if (!this.searchInput.value && query) {
      this.searchInput.value = query;
    }
    
    // set query in urlParams 
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
      urlParams('query', query);
    }

    // terminate if no query
    if (!query) {
      return this.state(1);
    }

    const res = await stockApi.searchBar(query, this.loader);
    this.state(2);

    

    this.searchResults.innerHTML = null;
    const list = new SearchList(this.searchResults,res,query,this.compare)
  }

  loader = (truth) => {
    if (truth) {
      this.searchButton.querySelector('img').src = '/res/icons/loader.svg';
      this.searchButton.classList.add('loader');
    } else {
      this.searchButton.classList.remove('loader');
      setTimeout(()=>{
        this.searchButton.querySelector('img').src = '/res/icons/search.svg';
      },700)
    }
  }

  state(phase) {
    switch (phase) {
      case 0:
        this.el.classList.add('minimized');
        this.el.classList.remove('table');
        this.searchInput.value = null;
        this.searchResults.innerHTML = null;
        urlParams('query', null);
        break;
      case 1:
        this.el.classList.remove('minimized');
        this.el.classList.remove('table');
        this.searchResults.innerHTML = null;
        setTimeout(() => this.searchInput.focus(),0)
        break;
      case 2:
        this.el.classList.add('table');
        this.el.classList.remove('minimized');
        break;
      default:
        break;
    }
  }

  onLoad() {
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
      const query = urlParams('query');
      if (query) {
        this.search(query);
      }
    }
  }
}

export default SearchBar;
