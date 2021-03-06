class CompareList {
  constructor(el, compare) {
    this.el = el;
    this.compare = compare;
    this.buttons;
    this.compareButton;
    this.list = [];
    this.build();
  }

  build() {
    this.buttons = document.createElement('div');
    this.buttons.classList.add('buttons');
    this.compareButton = document.createElement('button');
    this.compareButton.classList.add('circle', 'highlighted');
    this.compareButton.id = 'compare';
    this.compareButton.innerHTML = '<img src="/res/icons/arrow-right.svg" alt="Compare">';
    this.compareButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `/compare.html?symbols=${this.list}`;
    });
    this.buttons.append(this.compareButton);
    this.el.append(this.buttons);
    this.onChange();
  }

  remove(symbol) {
    this.el.querySelector(`#compare-${symbol}`).remove();
    this.list.splice(this.list.indexOf(symbol), 1);
    this.onChange();
  }

  add(symbol) {
    this.list.push(symbol);
    const button = document.createElement('button');
    button.innerHTML = `${symbol} <img src="/res/icons/x.svg" alt="Remove ${symbol}">`;
    button.classList.add('small');
    button.id = `compare-${symbol}`;
    button.addEventListener('click', () => this.compare(symbol));
    this.buttons.prepend(button);
    this.onChange();
  }

  onChange() {
    if (this.list.length < 1) {
      this.el.classList.remove('show');
      this.compareButton.remove();
    } else {
      this.el.classList.add('show');
      this.buttons.append(this.compareButton);
    }
  }
}

export default CompareList;
