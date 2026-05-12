const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define Course schema directly (since we don't want to rely on the model file)
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  longDescription: String,
  price: Number,
  category: String,
  level: String,
  thumbnail: String,
  totalDuration: Number,
  isPublished: Boolean,
  enrolledStudents: Number,
  lessons: Array,
  instructorId: String,
  createdAt: Date
});

const Course = mongoose.model('Course', courseSchema);

// Sample courses
const courses = [
  {
    title: "Complete Web Development Bootcamp 2024",
    description: "Master full-stack web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB. Build real-world projects and become a professional developer.",
    longDescription: "This comprehensive bootcamp takes you from absolute beginner to professional web developer. You'll learn both frontend and backend development, build 10+ real projects, and get career-ready skills.",
    price: 0,
    category: "Web Development",
    level: "beginner",
    thumbnail: "💻",
    totalDuration: 40,
    isPublished: true,
    enrolledStudents: 0,
    lessons: [],
    instructorId: "65abc123def456",
    createdAt: new Date()
  },
  {
    title: "Machine Learning A-Z",
    description: "Learn ML algorithms, TensorFlow, and real-world AI applications. From zero to hero!",
    longDescription: "Master machine learning from scratch. Learn regression, classification, neural networks, and build AI models that actually work.",
    price: 0,
    category: "Data Science",
    level: "advanced",
    thumbnail: "🤖",
    totalDuration: 50,
    isPublished: true,
    enrolledStudents: 0,
    lessons: [],
    instructorId: "65abc123def456",
    createdAt: new Date()
  },
  {
    title: "Advanced Python Programming",
    description: "Master Python with advanced concepts, OOP, and real-world projects.",
    longDescription: "Take your Python skills to the next level. Learn advanced concepts like decorators, generators, context managers, and build real applications.",
    price: 49.99,
    category: "Programming",
    level: "intermediate",
    thumbnail: "🐍",
    totalDuration: 35,
    isPublished: true,
    enrolledStudents: 0,
    lessons: [],
    instructorId: "65abc123def456",
    createdAt: new Date()
  },
  {
    title: "UI/UX Design Masterclass",
    description: "Learn Figma, prototyping, user research, and design systems.",
    longDescription: "Become a professional UI/UX designer. Learn user-centered design, wireframing, prototyping, and build a stunning portfolio.",
    price: 39.99,
    category: "Design",
    level: "beginner",
    thumbnail: "🎨",
    totalDuration: 28,
    isPublished: true,
    enrolledStudents: 0,
    lessons: [],
    instructorId: "65abc123def456",
    createdAt: new Date()
  },
  {
    title: "React & Next.js Mastery",
    description: "Build modern web applications with React, Next.js, and Tailwind CSS.",
    longDescription: "Master the most in-demand frontend technologies. Build real projects including e-commerce sites and dashboards.",
    price: 59.99,
    category: "Web Development",
    level: "intermediate",
    thumbnail: "⚛️",
    totalDuration: 30,
    isPublished: true,
    enrolledStudents: 0,
    lessons: [],
    instructorId: "65abc123def456",
    createdAt: new Date()
  }
];

async function addCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses
    const deleted = await Course.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing courses`);

    // Add new courses
    const inserted = await Course.insertMany(courses);
    console.log(`✅ Added ${inserted.length} courses to database`);

    console.log('\n📚 Courses added:');
    inserted.forEach(course => {
      console.log(`   - ${course.title} (ID: ${course._id}) - ${course.price === 0 ? 'FREE' : '$' + course.price}`);
    });

    console.log('\n✅ Done! You can now refresh your courses page.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addCourses();