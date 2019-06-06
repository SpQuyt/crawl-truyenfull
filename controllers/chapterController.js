import ObjectId from 'mongodb';
import storySchema from '../models/storySchema';
import chapterSchema from '../models/chapterSchema';
import Truyenfull from '../helpers/Crawler/Truyenfull';
import MyRegEx from '../helpers/MyRegEx';


module.exports = (mongoose, app) => {
  const Story = mongoose.model('Story', storySchema, 'stories');
  const Chapter = mongoose.model('Chapter', chapterSchema, 'chapters');

  

}