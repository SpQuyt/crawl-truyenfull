import https from 'superagent';
import DomParser from 'dom-parser';
import jsdom from 'jsdom';
import officegen from 'officegen';
import fs from 'fs';

const parser = new DomParser();
const { JSDOM } = jsdom;

const truyenFullURL = 'https://truyenfull.vn/';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Truyenfull {

  async crawl1Chapter(title, index) {
    try {
      const res = await https.get(`${truyenFullURL}${title}/chuong-${index}/`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);
      const header = dom.window.document.getElementsByClassName('chapter-title')[0].getAttribute("title")
        .split('- ')[1];

      //replace all <br> tags to '<<' to split the paragraph easier
      const body = dom.window.document.getElementsByClassName('chapter-c')[0].innerHTML
        .replace(/<i>|<\/i>|<b>|<\/b>/g, '')
        .replace(/<br>&nbsp;<br>/g, '<<')
        .replace(/<br><br>/g, '<<')
        .split('<<');

      console.log(`Đang tải chương ${index}...`);

      return ({
        header: header,
        body: body,
      });
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

  async crawlAllChapters(title, beginChap, endChap) {
    let chapterList = [];
    for (var i = beginChap; i <= endChap; i++) {
      let chapter = await this.crawl1Chapter(title, i);

      if (i % 5 == 0) {
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

  async writeDoc(title, beginChap, endChap) {
    let chapterList = await this.crawlAllChapters(title, beginChap, endChap);
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
      //Add page break
      docx.putPageBreak();
    }

    //create folder
    let path = `${__dirname}/../../downloadable/${title}/truyenfull`;
    try {
      fs.mkdirSync(path.split(`/truyenfull`)[0]);
      fs.mkdirSync(path);
    } catch (err) {
      console.log('\nFolder đã tồn tại!');
    }

    //create .docx file at the destined path
    let out = fs.createWriteStream(`${__dirname}/../../downloadable/${title}/truyenfull/${title}.docx`);
    out.on('error', function (err) {
      console.log(err)
    });

    docx.generate(out);
    console.log('Đã xong file .docx!');
  }

  async getLastPageIndex(category) {
    let page = 1;
    try {
      const res = await https.get(`${truyenFullURL}the-loai/${category}/trang-${page}/`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);

      //list all nodes with <li> tag in HTML
      const liTagsHTML = dom.window.document.getElementsByTagName('li');
      //convert HTML collection to Array
      const liTagsArray = Array.from(liTagsHTML);
      //find the node[-4] of the list to check lastPageIndex
      let lastPageIndex = liTagsArray[liTagsArray.length - 4].getElementsByTagName('a')[0]
        .getAttribute('title')
        .split('Trang ')[1]

      return lastPageIndex;
    } catch (err) {
      console.log(err);
    }
  }

  async crawlAllStoryInfo1Page(category, page) {
    try {
      const res = await https.get(`${truyenFullURL}the-loai/${category}/trang-${page}/`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);
      const nodeListHTML = dom.window.document.getElementsByClassName('list list-truyen col-xs-12')[0]
        .getElementsByClassName('row');
      //convert HTML collection to Array
      const nodeListArray = Array.from(nodeListHTML);

      let storyList1Page = [];
      for (const node of nodeListArray) {
        storyList1Page.push({
          'title': node.getElementsByClassName('truyen-title')[0].getElementsByTagName('a')[0].innerHTML,
          'author': node.getElementsByClassName('author')[0].innerHTML
            .split('</span> ')[1],
          'latestChap': node.getElementsByClassName('col-xs-2 text-info')[0].getElementsByTagName('a')[0].innerHTML
            .split('</span>')[2],
        })
      }

      console.log(`Đang tải thông tin thể loại ${category} ở trang ${page}`);

      return storyList1Page;
    } catch (err) {
      console.log(err);
    }
  }

  async crawlAllStoryInfoAllPages(category) {
    let lastPageIndex = null;
    try {
      lastPageIndex = await this.getLastPageIndex(category);
    } catch (err) {
      console.log(err);
    }

    let storyListAllPages = [];
    try {
      for (let i = 1; i <= lastPageIndex; i++) {
        let newPage = await this.crawlAllStoryInfo1Page(category, i)
        if (i % 5 == 0) {
          await sleep(100);
        }

        for (const story of newPage) {
          storyListAllPages.push(story);
        }
      }
    } catch (err) {
      console.log(err);
    }

    console.log(`==> Tổng cộng có ${storyListAllPages.length} truyện thuộc thể loại ${category}`);
    return storyListAllPages;
  }
}

module.exports = Truyenfull;