import Marquee from './components/Marquee.js';
import SearchBar from './components/SearchBar.js';

(() => {
  const marquee = new Marquee(document.querySelector('.marquee-wrapper'));
  const searchBar = new SearchBar(document.querySelector('.search-bar'));
})();
