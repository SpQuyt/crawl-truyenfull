import express from 'express';
import bodyParser from 'body-parser';
import Truyenfull from './helpers/Crawler/Truyenfull';
import TruyenCV from './helpers/Crawler/TruyenCV';
import TruyenYY from './helpers/Crawler/TruyenYY';
import MyRegEx from './helpers/MyRegEx';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/download', (req, res) => {
  const file = `${__dirname}/downloadable/tien-nghich/truyenfull/tien-nghich.docx`;
  res.download(file);
})

// console.log(Truyenfull.crawlAllChapters('tien-nghich', 1017, 1019));
// Truyenfull.crawlAllChapters('tien-nghich', 1017, 1019);
// Truyenfull.crawl1Chapter('tien-nghich', 1017);
// Truyenfull.crawlAllStoryInfo1Page('tien-hiep', 3);
// Truyenfull.crawlAllStoryInfoAllPages('trong-sinh');
// Truyenfull.writeTxt('tien-nghich', 1017, 1019);
// Truyenfull.writeDoc('vu-dong-can-khon', 1017, 1019);
// Truyenfull.writeDoc('linh-vu-thien-ha', 1017, 1019);
// myregex.convertUTF8('Dị Nhân Tu Chân Đa Thế Giới');
// TruyenCV.crawl1Page('tien-nghich', 1000);
TruyenYY.crawl1Page('tien-nghich', 1020);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})

