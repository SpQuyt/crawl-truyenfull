import express from 'express';
import bodyParser from 'body-parser';
import Truyenfull from './helpers/Crawler/Truyenfull';
import cors from 'cors';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const app = express();
const port = 8000;

/*Load Controllers*/
const storyController = require('./controllers/storyController');
const crawlController = require('./controllers/crawlController');
const categoryController = require('./controllers/categoryController');

/*Load Middlewares */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

const urlDB = 'mongodb://admin123:admin123@ds231537.mlab.com:31537/crawl_truyenfull';
mongoose.connect(urlDB, { useNewUrlParser: true })
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("DB OK")
});

// Truyenfull.test();
// Truyenfull.crawlAllChapters('tien-nghich', 1017, 1019);
// Truyenfull.crawl1Chapter('tien-nghich', 1017);
// Truyenfull.crawlPoster('tien-nghich');
// Truyenfull.crawl1PageOfCategory('tien-hiep', 3);
// Truyenfull.crawlAllPagesOfCategory('tien-hiep');
// Truyenfull.crawlManyPagesOfCategory('ngon-tinh', 1, 3);
// Truyenfull.crawl1PageOfCategory(MyRegEx.convertUTF8('tien-hiep'), 1);
// Truyenfull.crawlStoryInfo(`https://truyenfull.vn/gioi-than/`);
// Truyenfull.writeTxt('tien-nghich', 1017, 1019);
// Truyenfull.writeDoc('vu-dong-can-khon', 1017, 1019);
// Truyenfull.writeDoc('linh-vu-thien-ha', 1017, 1019);
// Truyenfull.crawlCategoryList();
// MyRegEx.convertUTF8('Sư Phụ Con Yêu Người');
// TruyenCV.crawl1Page('tien-nghich', 1000);

storyController(mongoose, app);
crawlController(mongoose, app);
categoryController(mongoose, app);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server started on port ${port}`);
})

