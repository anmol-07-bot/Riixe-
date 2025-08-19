import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// API: sample courses data (could be swapped for DB later)
const courses = [
  {
    id: 'js-basics',
    title: 'JavaScript Basics',
    description: 'Learn variables, functions, loops, and DOM.',
    lessons: [
      {
        id: 'intro',
        title: 'Introduction to JS',
        content: 'JavaScript runs in the browser and on servers via Node.js.'
      },
      {
        id: 'variables',
        title: 'Variables',
        content: 'Use let/const for block-scoped variables.'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'Which keyword declares a block-scoped variable?',
          options: ['var', 'let', 'function', 'class'],
          answerIndex: 1
        }
      ]
    }
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    description: 'Structure and style web pages.',
    lessons: [
      { id: 'html', title: 'HTML', content: 'HTML structures content using tags.' },
      { id: 'css', title: 'CSS', content: 'CSS styles HTML elements.' }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          prompt: 'Which tag creates a hyperlink?',
          options: ['<div>', '<a>', '<span>', '<p>'],
          answerIndex: 1
        }
      ]
    }
  }
];

app.get('/api/courses', (req, res) => {
  res.json(courses.map(({ quiz, ...course }) => course));
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Educational app listening on http://localhost:${PORT}`);
});

