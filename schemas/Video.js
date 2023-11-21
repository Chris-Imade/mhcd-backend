const mongoose = require('mongoose');

const VideoSchema = mongoose.Schema({
    title: String,
    embedLink: String,
    desc: String,
    duration: String,
    uniqueIdentifier: String,
    // Other important information about the video
}, { timestamp: true })

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;