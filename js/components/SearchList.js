import stockApi from '../api.js';

class SearchList {
  constructor(el, list) {
    this.el = el;
    this.list = list;
    this.build();
  }

  build() {
    const list = document.createElement('ul');

    if (this.list.length > 0) {
      this.list.forEach((stock) => {
        const li = document.createElement('li');
        li.id = `result-${stock.symbol}`;
        li.classList.add('search-result');
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
    this.el.appendChild(list);

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
