// Modify chart.js class global defults
Chart.defaults.global.elements.point.borderWidth = '2';
Chart.defaults.global.elements.point.radius = 2;
Chart.defaults.global.elements.point.hoverBorderWidth = '2';
Chart.defaults.global.elements.point.hitRadius = '10';
Chart.defaults.global.elements.point.hoverRadius = '2';
Chart.defaults.global.elements.point.borderColor = 'none';
Chart.defaults.global.elements.point.backgroundColor = 'none';

Chart.defaults.global.elements.line.tension = 0.3;

const updateGraph = ({ symbol, data }) => {
  document.querySelector(`#${symbol} .graph-container`).innerHTML = '';
  // document.createElement('canvas')
  const ctx = document.querySelector(`#${symbol} .graph-container`).appendChild(document.createElement('canvas')).getContext('2d');
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

  document.querySelector(`#${symbol} .graph-sum`).innerHTML = `
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
        label: symbol,
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
          //   tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          //   tooltipEl.style.fontSize = `${tooltipModel.bodyFontSize}px`;
          //   tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          //   tooltipEl.style.padding = `${tooltipModel.yPadding}px ${tooltipModel.xPadding}px`;
          tooltipEl.style.pointerEvents = 'none';
        },
      },
    },
  });
};
