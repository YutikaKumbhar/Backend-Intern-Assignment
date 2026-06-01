const mongoose = require('mongoose');
const { mongodbUri, nodeEnv } = require('./env');

async function connectDB() {
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongodbUri);

  if (nodeEnv !== 'test') {
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  }
}

module.exports = connectDB;
