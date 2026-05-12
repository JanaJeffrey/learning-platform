const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://mongo:KLDvCBfGEchhgxGjqkumDQHslEbMrIiB@trolley.proxy.rlwy.net:17953/learning-platform';

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  level: String,
  thumbnail: String,
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

const courses = [
  { title: "Complete Web Development", description: "Learn HTML, CSS, JavaScript, React", price: 0, category: "Web Development", level: "beginner", thumbnail: "💻", isPublished: true },
  { title: "Machine Learning A-Z", description: "Learn ML algorithms, TensorFlow", price: 0, category: "Data Science", level: "advanced", thumbnail: "🤖", isPublished: true },
  { title: "Advanced Python", description: "Master Python programming", price: 49.99, category: "Programming", level: "intermediate", thumbnail: "🐍", isPublished: true },
  { title: "UI/UX Design", description: "Learn Figma and design", price: 39.99, category: "Design", level: "beginner", thumbnail: "🎨", isPublished: true },
  { title: "React & Next.js", description: "Modern web development", price: 59.99, category: "Web Development", level: "intermediate", thumbnail: "⚛️", isPublished: true }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected');
    
    await Course.deleteMany({});
    console.log('🗑️ Cleared old courses');
    
    await Course.insertMany(courses);
    console.log(`✅ Added ${courses.length} courses`);
    
    console.log('\n📚 Courses ready!');
    process.exit();
  } catch(err) {
    console.error('❌ Error:', err.message);
    process.exit();
  }
}

seed();