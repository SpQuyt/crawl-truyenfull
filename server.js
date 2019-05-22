const https = require("superagent");
const DomParser = require('dom-parser');
const parser = new DomParser();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const officegen = require('officegen');
const fs = require('fs');

const truyenURL = 'https://truyenfull.vn/tien-nghich/chuong-';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Crawler {
  // constructor() {
  //   this.headerList = [];
  //   this.bodyList = [];
  // }

  async crawl1Chapter(counter) {
    try {
      const res = await https.get(truyenURL + counter + '/')
      const ele = parser.parseFromString(res.text, "text/html");
      const dom = new JSDOM(ele.rawHTML);
      const header = dom.window.document.getElementsByClassName('chapter-title')[0].getAttribute("title").split('- ')[1];
      const body = dom.window.document.getElementsByClassName('chapter-c')[0].innerHTML
        .replace(/<i>|<\/i>|<b>|<\/b>/g, '')
        .split("<br>&nbsp;<br>");

      console.log("Đang tải chương " + counter + "...");

      return ({
        header: header,
        body: body,
      });
    } catch (err) {
      if (err.status == 503) {
        this.crawl1Chapter(counter);
      }
    }



    // try {

    // } catch (err) {
    //   console.log("OH NO")
    //   return null;
    // }
  }

  async crawlAllChapters(beginChap, endChap) {
    let chapterList = [];
    for (var i = beginChap; i <= endChap; i++) {
      let chapter = await this.crawl1Chapter(i);

      if (i%5 == 0) {
        await sleep(3000);
      }

      if (chapter == null) {
        break;
      }
      else {
        chapterList.push(chapter);
      }

    }
    return chapterList;
  }

  async writeDoc() {
    let chapterList = await this.crawlAllChapters(1017, 1976);

    let docx = officegen('docx');

    for (const chapter of chapterList) {
      let pObj = docx.createP();

      //Add header
      pObj.addText(chapter.header, { bold: true, font_size: 24 });
      pObj.addLineBreak();
      pObj.addLineBreak();

      //Add body
      for (const paragraph of chapter.body) {
        pObj.addText(paragraph, { font_face: 'Arial' });
        pObj.addLineBreak();
        pObj.addLineBreak();
      }

      docx.putPageBreak();
    }

    let out = fs.createWriteStream('Tien-Nghich.docx');

    out.on('error', function (err) {
      console.log(err)
    });

    docx.generate(out);

    console.log('DONE!')
  }
}

crawler = new Crawler();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {

})

// console.log(crawler.crawlAllChapters(1017,1019));
// crawler.crawlAllChapters(1017,1019);
// crawler.crawl1Chapter(1989);
crawler.writeDoc();

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})

