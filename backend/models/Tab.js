const mongoose = require('mongoose');

const tabSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    diagramId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to diagram model
        ref: 'Diagram',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Tab', tabSchema);