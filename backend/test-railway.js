const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://mongo:KLDvCBfGEchhgxGjqkumDQHslEbMrIiB@trolley.proxy.rlwy.net:17953/learning-platform';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to Railway MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Error:', err.message);
    process.exit(1);
  });