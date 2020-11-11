import stockApi from './api.js';

class Marquee {
  constructor(el) {
    this.el = el;
    this.list = [];
  }

  async build() {
    await this.getData();

    const marquee = document.createElement('ul');
    marquee.classList.add('marquee');

    for (let i = 0; i < (this.list.length - 1) * 2; i += 1) {
      const ii = i % (this.list.length - 1);

      const li = document.createElement('li');
      li.innerHTML = `
                <a href="/company.html?symbol=${this.list[ii].ticker}">${this.list[ii].ticker}\t
                <span class="${this.list[ii].changesPercentage.indexOf('-') > 0 ? 'bad' : 'good'}">${this.list[ii].changesPercentage}</span></a>
              `;
      marquee.appendChild(li);
    }

    this.el.appendChild(marquee);
  }

  async getData() {
    this.list = await stockApi.mostActive();
  }
}

export default Marquee;
