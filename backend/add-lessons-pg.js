const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://learnhub_user:Jk6a6VA8u13XaI0gAs4JDkUUhC6JvkTD@dpg-d828b83rjlhs738h3lo0-a.frankfurt-postgres.render.com/learnhub_2hkr',
  ssl: { rejectUnauthorized: false }
});

const lessons = [
  // Course 1 (Web Development)
  { id: 'l1', course_id: '1', title: 'Introduction to Web Development', description: 'What is web development?', duration: 600, order_num: 1, is_preview: 1, video_url: 'https://www.youtube.com/embed/ysEN5RaKOlA' },
  { id: 'l2', course_id: '1', title: 'HTML Fundamentals', description: 'Learn HTML tags', duration: 900, order_num: 2, is_preview: 1, video_url: 'https://www.youtube.com/embed/kUMe1FH4CHE' },
  { id: 'l3', course_id: '1', title: 'CSS Styling', description: 'Make websites beautiful', duration: 1200, order_num: 3, is_preview: 0, video_url: 'https://www.youtube.com/embed/1Rs2ND1ryYc' },
  { id: 'l4', course_id: '1', title: 'JavaScript Basics', description: 'Add interactivity', duration: 1500, order_num: 4, is_preview: 0, video_url: 'https://www.youtube.com/embed/PkZNo7MFNFg' },
  { id: 'l5', course_id: '1', title: 'React Introduction', description: 'Build modern apps', duration: 1800, order_num: 5, is_preview: 0, video_url: 'https://www.youtube.com/embed/l1mEResb9eY' },
  
  // Course 2 (Machine Learning)
  { id: 'l6', course_id: '2', title: 'What is Machine Learning?', description: 'Introduction to ML', duration: 600, order_num: 1, is_preview: 1, video_url: 'https://www.youtube.com/embed/aircAruvnKk' },
  { id: 'l7', course_id: '2', title: 'Python for ML', description: 'Python basics for ML', duration: 900, order_num: 2, is_preview: 0, video_url: 'https://www.youtube.com/embed/KytW151dpqU' },
  { id: 'l8', course_id: '2', title: 'Linear Regression', description: 'First ML algorithm', duration: 1200, order_num: 3, is_preview: 0, video_url: 'https://www.youtube.com/embed/7A9dR5UMPWQ' },
  { id: 'l9', course_id: '2', title: 'Neural Networks', description: 'Deep learning basics', duration: 1500, order_num: 4, is_preview: 0, video_url: 'https://www.youtube.com/embed/GwIo3gDZCVQ' },
  
  // Course 3 (Python)
  { id: 'l10', course_id: '3', title: 'Python Setup', description: 'Install Python', duration: 300, order_num: 1, is_preview: 1, video_url: 'https://www.youtube.com/embed/rfscVS0vtbw' },
  { id: 'l11', course_id: '3', title: 'Variables and Data Types', description: 'Python basics', duration: 600, order_num: 2, is_preview: 0, video_url: 'https://www.youtube.com/embed/_uQrJ0TkZlc' },
  { id: 'l12', course_id: '3', title: 'Functions and OOP', description: 'Advanced Python', duration: 900, order_num: 3, is_preview: 0, video_url: 'https://www.youtube.com/embed/9Os0o3wzS_I' },
  
  // Course 4 (UI/UX)
  { id: 'l13', course_id: '4', title: 'Design Fundamentals', description: 'Basic design principles', duration: 600, order_num: 1, is_preview: 1, video_url: 'https://www.youtube.com/embed/Wwh2UyA5N_M' },
  { id: 'l14', course_id: '4', title: 'Figma Basics', description: 'Learn Figma', duration: 900, order_num: 2, is_preview: 0, video_url: 'https://www.youtube.com/embed/4WXTN9IICRs' },
  { id: 'l15', course_id: '4', title: 'Prototyping', description: 'Create prototypes', duration: 600, order_num: 3, is_preview: 0, video_url: 'https://www.youtube.com/embed/UXF0m8YJlSQ' },
  
  // Course 5 (React)
  { id: 'l16', course_id: '5', title: 'React Setup', description: 'Create React App', duration: 300, order_num: 1, is_preview: 1, video_url: 'https://www.youtube.com/embed/w7ejDZ8SWv8' },
  { id: 'l17', course_id: '5', title: 'Components and Props', description: 'React basics', duration: 900, order_num: 2, is_preview: 0, video_url: 'https://www.youtube.com/embed/dpw9EHDh2bM' },
  { id: 'l18', course_id: '5', title: 'State and Hooks', description: 'useState, useEffect', duration: 1200, order_num: 3, is_preview: 0, video_url: 'https://www.youtube.com/embed/QaSxLge9Gic' },
  { id: 'l19', course_id: '5', title: 'Next.js Basics', description: 'Server-side rendering', duration: 900, order_num: 4, is_preview: 0, video_url: 'https://www.youtube.com/embed/OhMDrkAyaGk' },
  
  // Course 6 (JavaScript)
  { id: 'l20', course_id: '6', title: 'JavaScript Fundamentals', description: 'Variables, functions', duration: 1800, order_num: 1, is_preview: 1, video_url: 'https://www.youtube.com/embed/W6NZfCO5SIk' },
  { id: 'l21', course_id: '6', title: 'DOM Manipulation', description: 'Modify HTML elements', duration: 1500, order_num: 2, is_preview: 0, video_url: 'https://www.youtube.com/embed/PkZNo7MFNFg' },
  { id: 'l22', course_id: '6', title: 'Asynchronous JavaScript', description: 'Promises, async/await', duration: 1800, order_num: 3, is_preview: 0, video_url: 'https://www.youtube.com/embed/2Zo_3-E4B6Y' },
  { id: 'l23', course_id: '6', title: 'ES6+ Features', description: 'Modern JavaScript', duration: 1200, order_num: 4, is_preview: 0, video_url: 'https://www.youtube.com/embed/ivdTnPlGND8' }
];

async function addLessons() {
  try {
    for (const lesson of lessons) {
      await pool.query(`
        INSERT INTO lessons (id, course_id, title, description, duration, order_num, is_preview, video_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING
      `, [lesson.id, lesson.course_id, lesson.title, lesson.description, lesson.duration, lesson.order_num, lesson.is_preview, lesson.video_url]);
    }
    console.log(`✅ Added ${lessons.length} lessons`);
    process.exit();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit();
  }
}

addLessons();