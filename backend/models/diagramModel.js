const mongoose = require('mongoose');

const diagramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    userID: { type: String, required: true },
    tabs: { type: String, required: true },
    favorite: { type: Boolean, required: true },
    editorContent: { type: String, required: false},
})

module.exports = mongoose.model("Diagram", diagramSchema);