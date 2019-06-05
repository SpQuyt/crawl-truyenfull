import ObjectId from 'mongodb';
import categorySchema from '../models/categorySchema';
import storySchema from '../models/storySchema';
import Truyenfull from '../helpers/Crawler/Truyenfull';


module.exports = (mongoose, app) => {
  const Category = mongoose.model('Category', categorySchema, 'categories');
  const Story = mongoose.model('Story', storySchema, 'stories');

  app.get(`/category/getAllStoriesByCategory`, async (req, res) => {
    Story.find({
      // categoryList: { "$in" : ["Tiên Hiệp", "Trọng Sinh"]} 
      categoryList: req.query.category.normalize()
    })
    .exec((err, result) => {
      if (err) console.log(err);
      res.send(result);
    })   
  })
}