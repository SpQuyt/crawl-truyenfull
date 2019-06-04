import ObjectId from 'mongodb';
import storySchema from '../models/storySchema';
import Truyenfull from '../helpers/Crawler/Truyenfull';


module.exports = (mongoose, app) => {
  const Story = mongoose.model('Story', storySchema)

  app.get(`/stories/addToDB`, async (req, res) => {
    // let categoryList = await Truyenfull.crawlCategoryList();
    // let queryResult = await Truyenfull.crawlManyPagesOfCategory(req.query.category, 1, 3);
    let queryResult = await Truyenfull.crawlAllPagesOfCategory(req.query.category);
    // let result =  await Truyenfull.crawlAllStoryInfoAllPages(req.query.category);
    // let result = await Truyenfull.crawlAllStoryInfo1Page(req.query.category, 3);

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

  // app.get('/users/:id/bills', (req, res) => {
  //   Bill.find({ 'userID': ObjectId(req.params.id) }, function (err, result) {
  //     if (err) return res.json({
  //       errors: err
  //     });

  //     if (result.length == 0) {
  //       res.json({
  //         success: false
  //       });
  //     }
  //     else {
  //       res.json({
  //         success: true,
  //         result: result
  //       });
  //     }
  //   })
  // });

  // app.patch('/bill/update/:id', (req, res) => {
  //   Bill.findOneAndUpdate({ billID: req.params.id }, { $set: { purchased: true } }, { new: true }, (err, result) => {
  //     if (result == null || err) {
  //       res.json({
  //         success: false
  //       });
  //     }
  //     else {
  //       res.json({
  //         success: true,
  //         result: result
  //       })
  //     }
  //   })
  // })
}