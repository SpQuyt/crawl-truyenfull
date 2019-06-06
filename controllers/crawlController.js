import ObjectId from 'mongodb';
import storySchema from '../models/storySchema';
import chapterSchema from '../models/chapterSchema';
import Truyenfull from '../helpers/Crawler/Truyenfull';
import MyRegEx from '../helpers/MyRegEx';

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = (mongoose, app) => {
  const Story = mongoose.model('Story', storySchema, 'stories');
  const Chapter = mongoose.model('Chapter', chapterSchema, 'chapters');

  app.get(`/crawl/1Genre1Page`, async (req, res) => {
    let crawlResult = await Truyenfull.crawl1PageOfCategory(req.query.category, req.query.index);

    for (const story of crawlResult) {
      const newStory = new Story({
        "title": story.title,
        "author": story.author,
        "description": story.description,
        "poster": story.poster,
        "categoryList": story.categoryList,
        "status": story.status,
      });

      newStory.save((err, result) => {
        if (err) {
          if (err.code == 11000) console.log(`==> ${story.title} đã tồn tại trong database.`);
        }
        else {
          console.log(`Đã thêm ${story.title} vào database.`);
        }
      })
    }

    res.send("DONE!")
  })

  app.get(`/crawl/1GenreAllPages`, async (req, res) => {
    let crawlResult = await Truyenfull.crawlAllPagesOfCategory(req.query.category);

    for (const story of crawlResult) {
      const newStory = new Story({
        "title": story.title,
        "author": story.author,
        "description": story.description,
        "poster": story.poster,
        "categoryList": story.categoryList,
        "status": story.status,
      });

      newStory.save((err, result) => {
        if (err) {
          if (err.code == 11000) console.log(`==> ${story.title} đã tồn tại trong database.`);
        }
        else {
          console.log(`Đã thêm ${story.title} vào database.`);
        }
      })
    }

    res.send("DONE!")
  })

  app.get(`/crawl/1GenreManyPages`, async (req, res) => {
    let crawlResult = await Truyenfull
      .crawlManyPagesOfCategory(req.query.category, req.query.begin, req.query.end);

    for (const story of crawlResult) {
      const newStory = new Story({
        "title": story.title,
        "author": story.author,
        "description": story.description,
        "poster": story.poster,
        "categoryList": story.categoryList,
        "status": story.status,
      });

      newStory.save((err, result) => {
        if (err) {
          if (err.code == 11000) console.log(`==> ${story.title} đã tồn tại trong database.`);
        }
        else {
          console.log(`Đã thêm ${story.title} vào database.`);
        }
      })
    }

    res.send("DONE!")
  })

  app.get(`/crawl/AllGenreManyPages`, async (req, res) => {
    let categoryList = await Truyenfull.crawlCategoryList();
    for (const category of categoryList) {
      let crawlResult = await Truyenfull
        .crawlManyPagesOfCategory(MyRegEx.convertUTF8(category), req.query.begin, req.query.end);

      for (const story of crawlResult) {
        const newStory = new Story({
          "title": story.title,
          "author": story.author,
          "description": story.description,
          "poster": story.poster,
          "categoryList": story.categoryList,
          "status": story.status,
        });

        newStory.save((err, result) => {
          if (err) {
            if (err.code == 11000) console.log(`==> ${story.title} đã tồn tại trong database.`);
          }
          else {
            console.log(`Đã thêm ${story.title} vào database.`);
          }
        })
      }
    }

    res.send("DONE!")
  })

  app.get(`/crawl/AllGenreAllPages`, async (req, res) => {
    let categoryList = await Truyenfull.crawlCategoryList();
    for (const category of categoryList) {
      let crawlResult = await Truyenfull
        .crawlAllPagesOfCategory(MyRegEx.convertUTF8(category));

      for (const story of crawlResult) {
        const newStory = new Story({
          "title": story.title,
          "author": story.author,
          "description": story.description,
          "poster": story.poster,
          "categoryList": story.categoryList,
          "status": story.status,
        });

        newStory.save((err, result) => {
          if (err) {
            if (err.code == 11000) console.log(`==> ${story.title} đã tồn tại trong database.`);
          }
          else {
            console.log(`Đã thêm ${story.title} vào database.`);
          }
        })
      }
    }

    res.send("DONE!")
  })

  app.get('/crawl/AllChapters1Story', async (req, res) => {
    let lastChapter = await Truyenfull.getLastChapterIndexStory(req.query.title);
    for (var i = 1; i <= lastChapter; i++) {
      let chapter = await Truyenfull.crawl1Chapter(req.query.title, i);

      if (i % 3 == 0) {
        await sleep(1000);
      }

      if (chapter == null) {
        break;
      }
      else {
        const newChapter = new Chapter({
          "header": chapter.header,
          "fromStory": req.query.title,
          "body": chapter.body,
        })

        newChapter.save((err, result) => {
          if (err) {
            if (err.code == 11000) console.log(`==> ${chapter.header} đã tồn tại trong database.`);
          }
          else {
            console.log(`Đã thêm ${req.query.title} ${chapter.header} vào database.`);
          }
        });
      }
    }


    res.send("DONE!");

  })
}