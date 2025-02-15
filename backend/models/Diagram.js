const mongoose = require('mongoose');

const diagramSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to user model
        ref: 'User', // Name of referenced model
        required: true,
    },
    tabs: [{
        type: mongoose.Schema.Types.ObjectId, // Reference to tab model
        ref: 'Tab',
    }],
    favorited: { type: Boolean, required: true },
    dateAccessed: { type: Date, required: true},
}, {
    timestamps: true,
});

diagramSchema.pre('save', next => {
    this.dateAccessed = Date.now();
    next();
})

module.exports = mongoose.model('Diagram', diagramSchema);