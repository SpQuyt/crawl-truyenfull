import express from 'express';
import bodyParser from 'body-parser';
import Truyenfull from './helpers/Crawler/Truyenfull';
import TruyenCV from './helpers/Crawler/TruyenCV';
import TruyenYY from './helpers/Crawler/TruyenYY';
import MyRegEx from './helpers/MyRegEx';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

app.get(`/GetStoryInfo`, async (req, res) => {
  let result =  await Truyenfull.crawlAllStoryInfoManyPages(req.query.category, 3, 14);
  // let result =  await Truyenfull.crawlAllStoryInfoAllPages(req.query.category);
  // let result = await Truyenfull.crawlAllStoryInfo1Page(req.query.category, 3);
  res.send(result);
})

// console.log(Truyenfull.crawlAllChapters('tien-nghich', 1017, 1019));
// Truyenfull.crawlAllChapters('tien-nghich', 1017, 1019);
// Truyenfull.crawl1Chapter('tien-nghich', 1017);
// Truyenfull.crawlPoster('tien-nghich');
// Truyenfull.crawlAllStoryInfo1Page('tien-hiep', 3);
// Truyenfull.crawlAllStoryInfoAllPages('tien-hiep');
// Truyenfull.writeTxt('tien-nghich', 1017, 1019);
// Truyenfull.writeDoc('vu-dong-can-khon', 1017, 1019);
// Truyenfull.writeDoc('linh-vu-thien-ha', 1017, 1019);
// MyRegEx.convertUTF8('Sư Phụ Con Yêu Người');
// console.log('ụ'.normalize() == 'ụ')
// console.log('ư' == 'ư')
// MyRegEx.convertUTF8('Sư Phụ Con Yêu Người'.toString())
// TruyenCV.crawl1Page('tien-nghich', 1000);
// TruyenYY.crawl1Page('tien-nghich', 1020);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server started on port ${port}`);
})

