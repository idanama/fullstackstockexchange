import stockApi from './api.js';
import { genericLoaderFill } from './ui.js';
import { updateGraph } from './graphs.js';
import { urlParams } from './generic.js';

const performanceMoji = (percent, max = 0.05) => {
  const positive = percent > 0;
  let emojis = [];
  if (positive) {
    emojis = ['🙃', '😀', '😁', '😆', '🤩', '🥳', '🤑'];
  } else {
    emojis = ['😐', '🙁', '😞', '😒', '😮', '😣', '😨'];
  }
  const pos = Math.min(
    Math.round(((emojis.length - 1) / max) * Math.abs(percent)),
    emojis.length - 1,
  );
  return emojis[pos];
};

const displayCompany = async (symbol) => {
  createCard(symbol);
  const res = await stockApi.company(symbol);
  loadCompanyCard({ ...res.profile, symbol: res.symbol });
  document.querySelector(`#${symbol} .graph-container`).innerHTML = genericLoaderFill;

  const graph = await stockApi.graph(symbol);

  // if there is a new price, add it to historical data
  if (graph.historical[0].close !== res.profile.price) {
    graph.historical.unshift({ date: new Date(), close: res.profile.price });
  }

  updateGraph({ symbol, data: graph.historical });
};

const createCard = (symbol) => {
  const cardContainer = document.createElement('section');
  cardContainer.classList.add('card-container');
  cardContainer.id = symbol;

  const card = document.createElement('div');
  card.classList.add('card');

  const loader = document.createElement('div');
  loader.classList.toggle('loader-container');
  loader.innerHTML = genericLoaderFill;

  card.append(loader);
  cardContainer.append(card);

  document.querySelector('#monitor').appendChild(cardContainer);
};

const loadCompanyCard = (info) => {
  const cardContainer = document.querySelector(`#${info.symbol}`);

  const header = document.createElement('header');
  header.innerHTML = `<h2><a href="/company.html?symbol=${info.symbol}">${info.companyName}</a></h2><div><img src="${info.image}" alt="${info.companyName} logo"></div>`;

  const graph = document.createElement('div');
  graph.classList.add('graph-container');
  graph.appendChild(document.createElement('canvas'));

  const footer = document.createElement('footer');
  footer.innerHTML = `<div class="graph-sum"><div><div>Now:</div><div>${info.price}</div></div></div><h2>${performanceMoji(info.changes / info.price)}</h2>`;

  const extraToggle = document.createElement('div');
  extraToggle.classList.add('extra-toggle');
  extraToggle.innerHTML = '<img src="/res/icons/chevron.svg">';

  const card = cardContainer.querySelector('.card');
  card.innerHTML = null;
  card.append(header, graph, footer, extraToggle);

  const extraWrapper = document.createElement('div');
  extraWrapper.classList.add('extra-wrapper');

  const extra = document.createElement('div');
  extra.classList.add('extra');

  let extraContent = '';

  const keys = Object.keys(info);
  keys.forEach((key) => {
    switch (key) {
      case 'website':
        extraContent += `<div><span class="key">"${key}":\t</span><span class="value"><a href="${info[key]}" target="_blank">${info[key]}</a></span></div>\n`;
        break;
      case 'mktCap':
        extraContent += `<div><span class="key">"${key}":\t</span><span class="value"><a href="${info[key]}" target="_blank">${info[key]}</a></span>\t<span class="comment">//\t${Number.parseFloat(info[key]).toLocaleString()} ${info.currency || ''}</span></div>\n`;
        break;
      case 'phone':
        extraContent += `<div><span class="key">"${key}":\t</span><span class="value"><a href="tel:${info[key]}">${info[key]}</a></span></div>\n`;
        break;
      default:
        extraContent += `<div><span class="key">"${key}":\t</span><span class="value">"${info[key]}"</span></div>\n`;
        break;
    }
  });

  extra.innerHTML = extraContent;

  extraWrapper.append(extra);
  cardContainer.append(extraWrapper);

  extraToggle.addEventListener('click', () => {
    extraToggle.classList.toggle('open');
    extra.classList.toggle('open');
    extraWrapper.classList.toggle('open');
  });
};

displayCompany(urlParams('symbol'));
