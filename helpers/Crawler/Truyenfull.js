import https from 'superagent';
import DomParser from 'dom-parser';
import jsdom from 'jsdom';
import MyRegEx from '../MyRegEx';
import fs from 'fs';

const parser = new DomParser();
const { JSDOM } = jsdom;

const truyenFullURL = 'https://truyenfull.vn/';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Truyenfull {

  static async crawl1Chapter(title, index) {
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

      console.log(`Đang tải ${title} chương ${index}...`);

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

  static async crawlManyChapters(title, beginChap, endChap) {
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

  static async crawlAllChapters(title) {
    let lastPageIndex = null;
    try {
      lastPageIndex = await this.getLastChapterIndexStory(title);
    } catch (err) {
      console.log(err);
    }

    let chapterList = [];
    for (var i = 1; i <= lastPageIndex; i++) {
      let chapter = await this.crawl1Chapter(title, i);

      if (i % 3 == 0) {
        await sleep(1000);
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

  // static async writeDoc(title, beginChap, endChap) {
  //   let chapterList = await this.crawlAllChapters(title, beginChap, endChap);
  //   let docx = officegen('docx');

  //   for (const chapter of chapterList) {
  //     let pObj = docx.createP();
  //     //Add header
  //     pObj.addText(chapter.header, { bold: true, font_size: 24 });
  //     pObj.addLineBreak();
  //     pObj.addLineBreak();
  //     //Add body
  //     for (const paragraph of chapter.body) {
  //       pObj.addText(paragraph, { font_face: 'Arial' });
  //       pObj.addLineBreak();
  //       pObj.addLineBreak();
  //     }
  //     //Add page break
  //     docx.putPageBreak();
  //   }

  //   //create folder
  //   let pathFolder = `${__dirname}/../../downloadable/${title}/truyenfull`;
  //   let pathDoc = `${__dirname}/../../downloadable/${title}/truyenfull/${title}-${beginChap}-${endChap}.docx`;
  //   try {
  //     fs.mkdirSync(pathFolder.split(`/${title}`)[0]);
  //   } catch (err) {
  //     console.log(`\nFolder downloadable đã tồn tại!`);
  //   }
  //   try {
  //     fs.mkdirSync(pathFolder.split(`/truyenfull`)[0]);
  //     fs.mkdirSync(pathFolder);
  //   } catch (err) {
  //     console.log('\nFolder truyenfull đã tồn tại!');
  //   }

  //   //create .docx file at the destined path
  //   let out = fs.createWriteStream(pathDoc);
  //   out.on('error', (err) => {
  //     console.log(err);
  //   });

  //   docx.generate(out);
  //   console.log('Đã xong file .docx!');
  // }

  static async writeTxt(title, beginChap, endChap) {
    let chapterList = await this.crawlAllChapters(title, beginChap, endChap);

    //create folder
    let pathFolder = `${__dirname}/../../downloadable/${title}/truyenfull`;
    let pathTxt = `${pathFolder}/${title}-${beginChap}-${endChap}.txt`;
    try {
      fs.mkdirSync(pathFolder.split(`/${title}`)[0]);
    } catch (err) {
      console.log(`\nFolder downloadable đã tồn tại!`)
    }
    try {
      fs.mkdirSync(pathFolder.split(`/truyenfull`)[0]);
      fs.mkdirSync(pathFolder);
    } catch (err) {
      console.log('\nFolder truyenfull đã tồn tại!');
    }

    //create .txt file at the destined path
    if (fs.existsSync(pathTxt)) {           //check if file already existed?
      try {
        fs.unlink(pathTxt);
      } catch (err) {
        console.log(err);
      }

    }
    for (const chapter of chapterList) {
      fs.appendFile(pathTxt, `${chapter.header}\n\n`, (err) => {
        if (err) console.log(err);
      });
      for (const paragraph of chapter.body) {
        fs.appendFile(pathTxt, `${paragraph}\n\n`, (err) => {
          if (err) console.log(err);
        });
      }
      fs.appendFile(pathTxt, `\n\n\n\n\n\n`, (err) => {
        if (err) console.log(err);
      });
    }
  }

  static async getLastPageIndexCategory(category) {
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

  static async getLastChapterIndexStory(title) {
    try {
      const res = await https.get(`${truyenFullURL}${title}`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);

      const domInfoArray = Array.from(dom.window.document
        .getElementsByClassName('info')[0]
        .getElementsByTagName('div'));
      const status = dom.window.document
        .getElementsByClassName('info')[0]
        .getElementsByTagName('div')[domInfoArray.length - 1]
        .getElementsByTagName('span')[0].innerHTML.normalize();

      if (status == 'Full') {
        const domPaginationArray = Array.from(dom.window.document
          .getElementsByClassName('pagination pagination-sm')[0]
          .getElementsByTagName('li'));
        const lastPageURL = domPaginationArray[domPaginationArray.length - 2]
          .getElementsByTagName('a')[0]
          .getAttribute('href');
        try {
          const res2 = await https.get(`${lastPageURL}`);
          const ele2 = parser.parseFromString(res2.text, 'text/html');
          const dom2 = new JSDOM(ele2.rawHTML);

          const domListChapterArray = Array.from(dom2.window.document
            .getElementsByClassName('list-chapter')[0]
            .getElementsByTagName('li'));
          const lastChapterIndex = domListChapterArray[domListChapterArray.length - 1]
            .getElementsByTagName('a')[0]
            .getAttribute('href')
            .split('chuong-')[1]
            .replace('/','');

          return lastChapterIndex;
        } catch (err) {
          console.log(err)
        }
      }
      else if (status != 'Full'){
        const domListChapterArray = Array.from(dom.window.document
          .getElementsByClassName('l-chapters')[0]
          .getElementsByTagName('li'));
          const lastChapterIndex = domListChapterArray[0]
          .getElementsByTagName('a')[0]
          .getAttribute('href')
          .split('chuong-')[1]
          .replace('/','');

        return lastChapterIndex;
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async crawl1PageOfCategory(category, page) {
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
        // const latestChap = node.getElementsByClassName('col-xs-2 text-info')[0].getElementsByTagName('a')[0].innerHTML
        //   .split('</span>')[2]
        const storyURL = node.getElementsByClassName('truyen-title')[0]
          .getElementsByTagName('a')[0]
          .getAttribute('href');
        const story = await this.crawlStoryInfo(storyURL);

        storyList1Page.push(story)
      }

      console.log(`Đang tải thông tin thể loại ${category} ở trang ${page}`);

      return storyList1Page;
    } catch (err) {
      console.log(err);
    }
  }

  static async crawlAllPagesOfCategory(category) {
    let lastPageIndex = null;
    try {
      lastPageIndex = await this.getLastPageIndex(category);
    } catch (err) {
      console.log(err);
    }

    let storyListAllPages = [];
    try {
      for (let i = 1; i <= lastPageIndex; i++) {
        let newPage = await this.crawl1PageOfCategory(category, i)
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

  static async crawlManyPagesOfCategory(category, beginIndex, endIndex) {
    let storyListAllPages = [];
    try {
      for (let i = beginIndex; i <= endIndex; i++) {
        let newPage = await this.crawl1PageOfCategory(category, i)
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

  static async crawlStoryInfo(storyURL) {
    try {
      const res = await https.get(`${storyURL}`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);

      const poster = dom.window.document
        .getElementsByClassName('book')[0]
        .getElementsByTagName('img')[0].src;
      const title = dom.window.document
        .getElementsByClassName('title')[0].innerHTML.normalize();
      const author = dom.window.document
        .getElementsByClassName('info')[0]
        .getElementsByTagName('div')[0]
        .getElementsByTagName('a')[0].innerHTML.normalize();

      const domHTMLArray = Array.from(dom.window.document
        .getElementsByClassName('info')[0]
        .getElementsByTagName('div')[1].getElementsByTagName('a'));
      const categoryList = domHTMLArray.map(dom => {
        return dom.innerHTML.normalize();
      })

      const domInfoArray = Array.from(dom.window.document
        .getElementsByClassName('info')[0]
        .getElementsByTagName('div'));
      const status = dom.window.document
        .getElementsByClassName('info')[0]
        .getElementsByTagName('div')[domInfoArray.length - 1]
        .getElementsByTagName('span')[0].innerHTML.normalize();

      const description = Array.from(dom.window.document
        .getElementsByClassName('col-xs-12 col-sm-8 col-md-8 desc')[0]
        .getElementsByTagName('div'))[3]
        .innerHTML
        .replace(/<b>|<\/b>/g, '')
        .replace(/<i>|<\/i>/g, '')
        .replace(/&nbsp;/g, ' ')
        .normalize()
        .split('<br>');

      return ({
        title: title,
        author: author,
        poster: poster,
        description: description,
        categoryList: categoryList,
        status: status,
      });
    } catch (err) {
      console.log();
    }
  }

  static async crawlCategoryList() {
    let list = [];
    try {
      const res = await https.get(`${truyenFullURL}`);
      const ele = parser.parseFromString(res.text, 'text/html');
      const dom = new JSDOM(ele.rawHTML);

      const domHTMLArray = Array.from(dom.window.document
        .getElementsByClassName('list list-truyen list-cat col-xs-12')[0]
        .getElementsByClassName('col-xs-6'))

      list = domHTMLArray.map((dom) => {
        return dom.getElementsByTagName('a')[0].innerHTML.normalize();
      })

      return list;
    } catch (err) {
      console.log(err);
    }
  }

  static async test() {
    let list = [];
    let categoryList = await this.crawlCategoryList();
    for (var i = 0; i < categoryList.length; i++) {
      list.push(await this.crawlAllPagesOfCategory(MyRegEx.convertUTF8(categoryList[i])));
    }
    console.log(list);
  }
}

module.exports = Truyenfull;