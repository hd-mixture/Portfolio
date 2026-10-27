require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing legacy connection to MongoDB...');
const legacyUri = 'mongodb://bajrangidarshan:HD%40Mixture08@ac-glfcfos-shard-00-00.6auzxrf.mongodb.net:27017,ac-glfcfos-shard-00-01.6auzxrf.mongodb.net:27017,ac-glfcfos-shard-00-02.6auzxrf.mongodb.net:27017/hdmixture_portfolio?ssl=true&replicaSet=atlas-12wuyz-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(legacyUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('✅ Connection Successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed!');
    console.error(err);
    process.exit(1);
  });
