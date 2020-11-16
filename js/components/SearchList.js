import stockApi from '../api.js';

class SearchList {
  constructor(el, list, query) {
    this.el = el;
    this.ul;
    this.list = list;
    this.query = query;
    this.build();
  }

  build() {
    this.ul = document.createElement('ul');

    if (this.list.length > 0) {
      this.list.forEach((stock) => {
        const li = document.createElement('li');
        li.id = `result-${stock.symbol}`;
        li.classList.add('search-result');

        let content = `
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
        const re = new RegExp(`(<div.*>.*)(${this.query})(.*</div>)`, 'gi');
        const rw = `  
        $1<span class="highlighted">$2</span>$3
        `;
        content = content.replace(re, rw);
        li.innerHTML = content;
        this.ul.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.innerHTML = '<div><div>No results found</div><div>🧐</div></div>';
      this.ul.appendChild(li);
    }
    this.el.appendChild(this.ul);

    this.update();
  }

  async update() {
    const symbols = this.list.map((item) => item.symbol);
    const quotes = await stockApi.company(symbols);
    quotes.forEach((quote) => {
      const stock = {
        ...quote.profile,
        symbol: quote.symbol,
      };
      const li = document.getElementById(`result-${stock.symbol}`);
      if (li) {
        li.querySelector('.change').innerHTML = `
                <span class="${stock.changes >= 0 ? 'good' : 'bad'}">
                ${(((stock.changes / (stock.price - stock.changes)) * 100) || 0).toFixed(2)}%
                </span>
                `;
        li.querySelector('.image').innerHTML = `<img src="${stock.image}">`;
      }
    });
  }
}

export default SearchList;
