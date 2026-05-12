const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const users = await User.find({});
  
  console.log('\n📋 Existing users:');
  console.log('====================================');
  
  users.forEach(u => {
    console.log(`Name: ${u.name}`);
    console.log(`Email: ${u.email}`);
    console.log(`ID: ${u._id}`);
    console.log('------------------------------------');
  });
  
  if (users.length === 0) {
    console.log('⚠️ No users found!');
    console.log('Please register at http://localhost:3000/register first');
  } else {
    console.log('\n✅ Use this ID as instructorId:', users[0]._id);
  }
  
  process.exit();
});