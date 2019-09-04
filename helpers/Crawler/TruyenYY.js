import https from 'superagent';
import DomParser from 'dom-parser';
import jsdom from 'jsdom';
import fs from 'fs';

const parser = new DomParser();
const { JSDOM } = jsdom;

const truyenYYURL = 'https://truyenyy.com/';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class TruyenYY {
  static async crawl1Page(title, index) {
    try {
      const res = await https.get(`${truyenYYURL}truyen/${title}/chuong-${index}.html`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);

      const header = dom.window.document.getElementsByClassName('chap-title sans-serif-font')[0].innerHTML
        .replace(/<span>/g, '')
        .replace(/<\/span>/g, ' - ');
      const body = Array.from(dom.window.document
        .getElementsByClassName('chap-content serif-font')[0]
        .getElementsByTagName('p'));

      body.map((paragraph, index, body) => {
        body[index] = body[index].innerHTML.replace(/\n/g, ' ');
      })

      console.log(header);

      return {
        header: header,
        body: body,
      }

    } catch (err) {
      if (err.status == 503) {
        console.log('Too many requests!');
      } else if (err.status == 404) {
        console.log(`Story ${title} not found!`);
      } else {
        console.log(err);
      }
    }
  }
}

module.exports = TruyenYY;