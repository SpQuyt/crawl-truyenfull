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

class Crawler {
  // constructor() {
  //   this.headerList = [];
  //   this.bodyList = [];
  // }

  async crawl1Chapter(counter) {
    const res = await https.get(truyenURL + counter + '/')
    const ele = parser.parseFromString(res.text, "text/html");
    const dom = new JSDOM(ele.rawHTML);
    const header = dom.window.document.getElementsByClassName('chapter-title')[0].getAttribute("title").split('- ')[1];
    const body = dom.window.document.getElementsByClassName('chapter-c')[0].innerHTML
        .replace(/<i>|<\/i>|<b>|<\/b>/g, '')
        .split("<br>&nbsp;<br>");

    console.log(header);
    return ({
      header: header,
      body: body,
    })
  }

  async crawlAllChapters(beginChap, endChap) {
    let chapterList = [];
    // chapterList.push(this.crawl1Chapter(beginChap));
    // chapterList.push(this.crawl1Chapter(beginChap+1));
    // chapterList.push(await this.crawl1Chapter(beginChap+2));
    for (var i = beginChap; i < endChap - beginChap + 1; i++) {
      chapterList.push(this.crawl1Chapter(beginChap));
    }
    return chapterList;
  }

  async writeDoc() {
    // let chapterList = await this.crawlAllChapters(1017, 1019);
    // console.log(chapterList);

    // let docx = officegen('docx');

    // for (let i = 0; i < this.headerList.length; i++) {
    //   let pObj = docx.createP();

    //   //Add header
    //   pObj.addText(this.headerList[i], { bold: true, font_size: 24 });
    //   pObj.addLineBreak();
    //   pObj.addLineBreak();

    //   //Add body
    //   pObj.addText(this.bodyList[i].text, { font_face: 'Arial' });
    //   pObj.addLineBreak();
    //   pObj.addLineBreak();
    // }

    // let out = fs.createWriteStream('Tien-Nghich.docx');

    // out.on('error', function (err) {
    //   console.log(err)
    // });

    // docx.generate(out);

    // console.log('DONE!')
  }
}

crawler = new Crawler();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {

})

console.log(crawler.crawlAllChapters(1017,1019));
// crawler.crawlAllChapters(1017,1019);
// crawler.crawl1Chapter(1018);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})

