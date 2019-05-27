import https from 'superagent';
import DomParser from 'dom-parser';
import jsdom from 'jsdom';
import officegen from 'officegen';
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

      console.log (dom.window.document.getElementsByClassName('chap-content serif-font')[0].innerHTML.replace('\n', ' ')); 
      
    } catch (err) {
      if (err.status == 503) {
        console.log('Too many requests!');
      }
      else if (err.status == 404) {
        console.log(`Story ${title} not found!`);
      }
      else {
        console.log(err);
      }
    }
  }
}

module.exports = TruyenYY;