const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  level: String,
  thumbnail: String,
  isPublished: Boolean,
  instructorId: mongoose.Schema.Types.ObjectId,
}, { strict: false });

const Course = mongoose.model('Course', courseSchema);
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

async function fixCourses() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Find first user to use as instructor
  const anyUser = await User.findOne({});
  
  if (!anyUser) {
    console.log('❌ No users found! Please register first.');
    process.exit();
  }

  console.log(`📝 Using instructor: ${anyUser.name} (${anyUser._id})`);

  // Update all courses with real instructor ID
  const result = await Course.updateMany(
    {},
    { $set: { instructorId: anyUser._id } }
  );

  console.log(`✅ Updated ${result.modifiedCount} courses`);

  // Verify
  const courses = await Course.find({});
  console.log('\n📚 Updated courses:');
  courses.forEach(c => {
    console.log(`   ${c.title} - Instructor: ${c.instructorId}`);
  });

  process.exit();
}

fixCourses();