const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  fileUrl: String,
  youtubeUrl: String,
  rssFeedUrl: String,
  transcript: String,
  status: {
    type: String,
    enum: ['In Progress', 'Done'],
    default: 'In Progress',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Podcast', PodcastSchema);