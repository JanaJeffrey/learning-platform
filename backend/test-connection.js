const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://mongo:KLDvCBfGEchhgxGjqkumDQHslEbMrIiB@trolley.proxy.rlwy.net:17953/learning-platform';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to Railway MongoDB Successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ Error:', error.message);
    process.exit(1);
  });