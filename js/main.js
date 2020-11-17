import Marquee from './components/Marquee.js';
import SearchBar from './components/SearchBar.js';
import Footer from './components/Footer.js';

(() => {
  const marquee = new Marquee(document.querySelector('.marquee-wrapper'));
  const searchBar = new SearchBar(document.querySelector('.search-bar'));
  const footerContainer = document.createElement('div');
  document.body.append(footerContainer);
  console.log(footerContainer);
  const footer = new Footer(footerContainer);
})();
