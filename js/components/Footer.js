import { percentMoji } from '../generic.js';

class Footer {
  constructor(el) {
    this.el = el;
    this.footer;
    this.build();
  }

  build() {
    this.footer = document.createElement('footer');
    this.footer.classList.add('footer');
    this.footer.innerHTML = `Created with Vanilla Js, Scss and Chart.js\t${percentMoji(Math.random(), 1)}\tby Idan Amati at &lt;ITC&gt; Full Stack Bootcamp 2020`;
    this.el.append(this.footer);
  }
}

export default Footer;
