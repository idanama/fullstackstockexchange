import stockApi from '../api.js';
import { loaderFill, percentMoji } from '../generic.js';

class CompanyInfo {
  constructor(el, symbol) {
    this.el = el;
    this.symbol = symbol;
    this.graph;
    this.info;
    this.build();
    this.loadCompany();
  }

  build() {
    this.el.classList.add('card-container');
    this.el.id = this.symbol;

    const card = document.createElement('div');
    card.classList.add('card');

    const loader = document.createElement('div');
    loader.classList.toggle('loader-container');
    loader.innerHTML = loaderFill;

    card.append(loader);
    this.el.append(card);

    document.querySelector('#monitor').appendChild(this.el);
  }

  async loadCompany() {
    const res = await stockApi.company(this.symbol);
    this.loadGraph();

    this.info = { ...res.profile, symbol: res.symbol };

    const header = document.createElement('header');
    header.innerHTML = `<h2><a href="/company.html?symbol=${this.symbol}">${this.info.companyName}</a></h2><div><img src="${this.info.image}" alt="${this.info.companyName} logo"></div>`;

    this.graph = document.createElement('div');
    this.graph.classList.add('graph-container');
    this.graph.appendChild(document.createElement('canvas'));

    const footer = document.createElement('footer');
    footer.innerHTML = `<div class="graph-sum"><div><div>Now:</div><div>${this.info.price}</div></div></div><h2>${percentMoji(this.info.changes / this.info.price)}</h2>`;

    const extraToggle = document.createElement('div');
    extraToggle.classList.add('extra-toggle');
    extraToggle.innerHTML = '<img src="/res/icons/chevron.svg">';

    const card = this.el.querySelector('.card');
    card.innerHTML = null;
    card.append(header, this.graph, footer, extraToggle);

    const extraWrapper = document.createElement('div');
    extraWrapper.classList.add('extra-wrapper');

    const extra = document.createElement('div');
    extra.classList.add('extra');

    let extraContent = '';

    const keys = Object.keys(this.info);
    keys.forEach((key) => {
      switch (key) {
        case 'website':
          extraContent += `<div><span class="key">"${key}":\t</span><span class="value"><a href="${this.info[key]}" target="_blank">${this.info[key]}</a></span></div>\n`;
          break;
        case 'mktCap':
          extraContent += `<div><span class="key">"${key}":\t</span><span class="value">${this.info[key]}</span>\t<span class="comment">//\t${Number.parseFloat(this.info[key]).toLocaleString()} ${this.info.currency || ''}</span></div>\n`;
          break;
        case 'phone':
          extraContent += `<div><span class="key">"${key}":\t</span><span class="value"><a href="tel:${this.info[key]}">${this.info[key]}</a></span></div>\n`;
          break;
        default:
          extraContent += `<div><span class="key">"${key}":\t</span><span class="value">"${this.info[key]}"</span></div>\n`;
          break;
      }
    });

    extra.innerHTML = extraContent;

    extraWrapper.append(extra);
    this.el.append(extraWrapper);

    extraToggle.addEventListener('click', () => {
      extraToggle.classList.toggle('open');
      extra.classList.toggle('open');
      extraWrapper.classList.toggle('open');
    });
  }

  async loadGraph() {
    this.graph = loaderFill;

    const graphData = await stockApi.graph(this.symbol);

    // if there is a new price, add it to historical data
    if (graphData.historical[0].close.toFixed(2) !== this.info.price.toFixed(2)) {
      graphData.historical.unshift({ date: new Date(), close: this.info.price });
    }
    this.updateGraph(graphData.historical);
  }

  updateGraph(data) {
    this.graph.innerHTML = '';
    const ctx = this.graph
      .appendChild(document.createElement('canvas'))
      .getContext('2d');
    const today = new Date();
    const filtered = { labels: [], data: [] };

    data
      .filter((item) => new Date(item.date).getTime() > today.getTime() - (86400000 * (7 * 4 + 1)))
      .forEach((item) => {
        filtered.labels.unshift(item.date);
        filtered.data.unshift(item.close);
      });
    // ${((filtered.data[0] / filtered.data[filtered.data.length - 1]) * 100).toFixed(2)}
    const sumNow = filtered.data[filtered.data.length - 1];
    const sumDaily = (sumNow / filtered.data[filtered.data.length - 2] - 1);
    const sumPeriod = (sumNow / filtered.data[0] - 1);

    document.querySelector(`#${this.symbol} .graph-sum`).innerHTML = `
      <div><div>Now</div><div>${sumNow.toFixed(2)}</div></div>
      <div><div>Daily</div><div class="${sumDaily >= 0 ? 'good' : 'bad'}">(${(sumDaily * 100).toFixed(2)}%)</div></div>
      <div><div>Two weeks</div><div class="${sumPeriod >= 0 ? 'good' : 'bad'}">(${((sumPeriod || 0) * 100).toFixed(2)}%)</div></div>
    `;

    const chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: filtered.labels,
        datasets: [{
          label: this.symbol,
          backgroundColor: 'transparent',
          borderColor: sumPeriod >= 0 ? ' #008800' : '#d80007',
          pointHoverBorderColor: sumPeriod >= 0 ? ' #008800' : '#d80007',
          data: filtered.data,
        }],
      },

      options: {
        layout: {
          padding: {
            left: 16,
            right: 16,
            top: 16,
            bottom: 16,
          },
        },
        scales: {
          xAxes: [{ display: false }],
          yAxes: [{ display: false }],
        },
        legend: { display: false },
        tooltips: {
          enabled: false,
          custom(tooltipModel) {
            // Tooltip Element
            let tooltipEl = document.getElementById('chartjs-tooltip');

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }
            // Set Text
            if (tooltipModel.body) {
              // const titleLines = tooltipModel.title || [];
              const pointData = parseFloat(tooltipModel.dataPoints[0].value);
              const pointDate = new Date(tooltipModel.dataPoints[0].label).toLocaleDateString('en-GB');
              // const relativePointData = filtered.data[0];
              const relativePointData = filtered.data[tooltipModel.dataPoints[0].index - 1];
              const changeToRelative = ((pointData / relativePointData) - 1) || 0;

              const innerHtml = `
              <div>${pointDate}</div>
              <div><span>${pointData.toFixed(2)}</span><span class="${changeToRelative >= 0 ? 'good' : 'bad'}">(${(changeToRelative * 100).toFixed(2)}%)</span></div>
              `;

              const tableRoot = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
            const position = this._chart.canvas.getBoundingClientRect();

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = `${position.left + window.pageXOffset + tooltipModel.caretX}px`;
            tooltipEl.style.top = `${position.top + window.pageYOffset + tooltipModel.caretY}px`;
            tooltipEl.style.pointerEvents = 'none';
          },
        },
      },
    });
  }
}

export default CompanyInfo;
