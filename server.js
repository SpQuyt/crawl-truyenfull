const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const Truyenfull = require("./helpers/Crawler/Truyenfull");
const MyRegEx = require("./helpers/MyRegEx");

truyenfull = new Truyenfull();
myregex = new MyRegEx();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {

})

// console.log(truyenfull.crawlAllChapters('tien-nghich', 1017, 1019));
// truyenfull.crawlAllChapters('tien-nghich', 1017, 1019);
// truyenfull.crawl1Chapter('nhau-nhau', 1989);
// truyenfull.crawlAllStoryInfo1Page('tien-hiep', 3);
// truyenfull.crawlAllStoryInfoAllPages('tien-hiep');
// truyenfull.writeDoc('tien-nghich', 1017, 1019);
myregex.convertUTF8('Dị Nhân Tu Chân Đa Thế Giới');

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
})

