import ObjectId from 'mongodb';
import storySchema from '../models/storySchema';
import Truyenfull from '../helpers/Crawler/Truyenfull';


module.exports = (mongoose, app) => {
  const Story = mongoose.model('Story', storySchema, 'stories')

  app.get(`/story/getAllStories`, async (req, res) => {
    Story.find()
    .limit(100)
    .exec((err, result) => {
      if (err) console.log(err);
      res.send(result);
    })     
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