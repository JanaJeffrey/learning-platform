const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const sampleCourses = [
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
    lessons: []
  },
  {
    title: "Advanced Python Programming",
    description: "Master Python with advanced concepts, OOP, and real-world projects. Perfect for intermediate developers.",
    longDescription: "Take your Python skills to the next level. Learn advanced concepts like decorators, generators, context managers, and build real applications.",
    price: 49.99,
    category: "Programming",
    level: "intermediate",
    thumbnail: "🐍",
    totalDuration: 35,
    isPublished: true,
    lessons: []
  },
  {
    title: "UI/UX Design Masterclass",
    description: "Learn Figma, prototyping, user research, and design systems. No experience needed!",
    longDescription: "Become a professional UI/UX designer. Learn user-centered design, wireframing, prototyping, and build a stunning portfolio.",
    price: 39.99,
    category: "Design",
    level: "beginner",
    thumbnail: "🎨",
    totalDuration: 28,
    isPublished: true,
    lessons: []
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
    lessons: []
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
    lessons: []
  },
  {
    title: "Digital Marketing Bootcamp",
    description: "SEO, Social Media, Email Marketing, and Analytics. Launch your marketing career!",
    longDescription: "Complete digital marketing course. Learn SEO, content marketing, social media strategy, email campaigns, and Google Analytics.",
    price: 29.99,
    category: "Marketing",
    level: "beginner",
    thumbnail: "📢",
    totalDuration: 25,
    isPublished: true,
    lessons: []
  }
];

async function getInstructor() {
  let instructor = await User.findOne({ role: 'instructor' });
  
  if (!instructor) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    instructor = await User.create({
      name: 'Admin Instructor',
      email: 'instructor@learnhub.com',
      password: hashedPassword,
      role: 'instructor'
    });
    console.log('✅ Created default instructor account');
    console.log('   Email: instructor@learnhub.com');
    console.log('   Password: password123');
  }
  
  return instructor._id;
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    const instructorId = await getInstructor();
    console.log(`👨‍🏫 Using instructor: ${instructorId}`);

    const coursesWithInstructor = sampleCourses.map(course => ({
      ...course,
      instructorId
    }));

    const createdCourses = await Course.insertMany(coursesWithInstructor);
    console.log(`✅ Added ${createdCourses.length} courses to database`);

    console.log('\n📚 Course List:');
    createdCourses.forEach(course => {
      console.log(`   ${course.title}: ${course._id}`);
    });

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Restart your backend: npm run dev');
    console.log('   2. Refresh your courses page at http://localhost:3000/courses');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();