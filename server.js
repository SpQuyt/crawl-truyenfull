import express from 'express';
import bodyParser from 'body-parser';
import Truyenfull from './helpers/Crawler/Truyenfull';
import MyRegEx from './helpers/MyRegEx';

const app = express();
const port = 3000;

let truyenfull = new Truyenfull();
let myregex = new MyRegEx();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {

})

// console.log(truyenfull.crawlAllChapters('tien-nghich', 1017, 1019));
// truyenfull.crawlAllChapters('tien-nghich', 1017, 1019);
// truyenfull.crawl1Chapter('nhau-nhau', 1989);
// truyenfull.crawlAllStoryInfo1Page('tien-hiep', 3);
truyenfull.crawlAllStoryInfoAllPages('trong-sinh');
// truyenfull.writeDoc('tien-nghich', 1017, 1019);
// myregex.convertUTF8('Dị Nhân Tu Chân Đa Thế Giới');

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})

