const mongoose = require('mongoose');

const stepSchema = mongoose.Schema({
    title: String,
    content: String
})

var courseSchema = mongoose.Schema({
    course: [stepSchema]
});

// courseSchema.index({ '$**': 'text' });

module.exports = mongoose.model("courses", courseSchema);