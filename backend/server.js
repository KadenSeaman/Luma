require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const User = require('./models/user');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userRoute = require('./routes/userRoute');
const documentRoute = require('./routes/documentRoute');
const tabRoute = require('./routes/tabRoute');

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});

app.use('/api/users', userRoute);
app.use('/api/users/:_id/documents', documentRoute);
app.use('/api/users/:_id/:document_id/tabs', tabRoute);