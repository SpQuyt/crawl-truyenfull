import ObjectId from 'mongodb';
import storySchema from '../models/storySchema';
import Truyenfull from '../helpers/Crawler/Truyenfull';
import MyRegEx from '../helpers/MyRegEx';


module.exports = (mongoose, app) => {
  const Story = mongoose.model('Story', storySchema, 'stories')

  app.get(`/crawl/1Genre1Page`, async (req, res) => {
    // let categoryList = await Truyenfull.crawlCategoryList();
    // let queryResult = await Truyenfull.crawlManyPagesOfCategory(req.query.category, 1, 3);
    let queryResult = await Truyenfull.crawlAllPagesOfCategory(req.query.category);
    // let result =  await Truyenfull.crawlAllStoryInfoAllPages(req.query.category);
    let result = await Truyenfull.crawlAllStoryInfo1Page(req.query.category, req.query.index);

    for (const story of queryResult) {
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

    console.log("DONE!")

  })

  app.get(`/crawl/1GenreAllPages`, async (req, res) => {
    let queryResult = await Truyenfull.crawlAllPagesOfCategory(req.query.category);

    for (const story of queryResult) {
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
    console.log("DONE!")
  })

  app.get(`/crawl/1GenreManyPages`, async (req, res) => {
    let queryResult = await Truyenfull
      .crawlManyPagesOfCategory(req.query.category, req.query.begin, req.query.end);

    for (const story of queryResult) {
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
    console.log("DONE!")
  })

  app.get(`/crawl/AllGenreManyPages`, async (req, res) => {
    let categoryList = await Truyenfull.crawlCategoryList();
    for (const category of categoryList) {
      let queryResult = await Truyenfull
        .crawlManyPagesOfCategory(MyRegEx.convertUTF8(category), req.query.begin, req.query.end);

      for (const story of queryResult) {
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
    console.log("DONE!")
  })

  app.get(`/crawl/AllGenreAllPages`, async (req, res) => {
    let categoryList = await Truyenfull.crawlCategoryList();
    for (const category of categoryList) {
      let queryResult = await Truyenfull
        .crawlAllPagesOfCategory(MyRegEx.convertUTF8(category));

      for (const story of queryResult) {
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
    console.log("DONE!")
  })
}