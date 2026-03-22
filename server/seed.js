const bcrypt = require('bcryptjs')
const { readDB, writeDB } = require('./db')

function seed() {
  const db = readDB()
  if (!db.users) db.users = []
  if (!db.services) db.services = []
  if (!db.requests) db.requests = []
  if (!db.content) db.content = {}
  if (!db.content.home) db.content.home = {}
  if (!db.projects) db.projects = []
  if (!db.instructors) db.instructors = []
  if (!db.courses) db.courses = []
  // track whether seed made changes to avoid touching the DB file
  let changed = false

  // Seed admin user
  if (!db.users.find(u => u.email === 'admin@devonic.local')) {
    const hash = bcrypt.hashSync('AdminPass123!', 10)
    const admin = { id: '1', name: 'Devonic Admin', email: 'admin@devonic.local', password: hash, role: 'admin' }
    db.users.push(admin)
    changed = true
  }

  // Sample services
  if (db.services.length === 0) {
    db.services = [
      { 
        id: 'svc-1', 
        title: 'Web App Build', 
        summary: 'Design and development of a modern web app.', 
        price: 5400, 
        iconName: 'code',
        description: 'From discovery to launch, we build a responsive web application tailored to your goals.'
      },
      { 
        id: 'svc-2', 
        title: 'Product MVP', 
        summary: 'Rapid MVP delivery for startups and new ideas.', 
        price: 7800, 
        iconName: 'layers',
        description: 'Validate your idea with a lean MVP that you can ship fast and iterate on.'
      },
      { 
        id: 'svc-3', 
        title: 'Brand & UI Kit', 
        summary: 'Visual identity and UI system for your product.', 
        price: 2600, 
        iconName: 'design',
        description: 'Logo, colors, typography, and UI components for a consistent product experience.'
      },
      { 
        id: 'svc-4', 
        title: 'Marketing Site', 
        summary: 'High-converting landing pages and websites.', 
        price: 1400, 
        iconName: 'activity',
        description: 'Fast, responsive marketing site with a focus on clarity and conversions.'
      }
    ]
    changed = true
  }

  // Homepage content (admin-managed)
  if (!db.content.home || !db.content.home.hero) {
    db.content.home = {
      hero: {
        title: 'Learn digital skills, deliver real projects',
        subtitle: 'Short, practical services and guidance for teams and founders who want results fast.',
        primaryCta: { label: 'Browse Services', href: '/services' },
        secondaryCta: { label: 'Request a Project', href: '/contact' }
      },
      highlights: [
        { id: 'hl-1', title: 'Practical delivery', body: 'Project-based services with clear outcomes and timelines.', iconName: 'check' },
        { id: 'hl-2', title: 'Flexible packages', body: 'Pick a service or request a tailored scope.', iconName: 'layers' },
        { id: 'hl-3', title: 'Trusted experts', body: 'Small team, senior talent, direct communication.', iconName: 'users' }
      ],
      cta: {
        title: 'Ready to start your project?',
        subtitle: 'Submit a request and we’ll reply within 24 hours.',
        primaryCta: { label: 'Start a Request', href: '/contact' }
      }
    }
    changed = true
  }

  if (changed) {
    writeDB(db)
  }

  // Ensure requested core services exist (id-driven)
  const core = [
    { id: 'web-dev', title: 'Web Development', summary: 'Modern, responsive web applications and websites.', price: 2400, iconName: 'code', description: 'React/Node.js or static site builds, responsive and performant.' },
    { id: 'graphic-design', title: 'Graphic Designing', summary: 'Branding, logos, marketing materials and UI design.', price: 800, iconName: 'design', description: 'Logo, visual identity, and high-fidelity UI design assets.' },
    { id: 'seo', title: 'SEO', summary: 'Search engine optimization to increase visibility and traffic.', price: 600, iconName: 'seo', description: 'On-page SEO, technical audits, and content recommendations.' },
    { id: 'content-writing', title: 'Content Writing', summary: 'SEO-friendly content, blogs and copywriting.', price: 250, iconName: 'edit', description: 'High-quality, optimized articles and marketing copy.' },
    { id: 'digital-marketing', title: 'Digital Marketing', summary: 'Ads, social media and growth strategies.', price: 1200, iconName: 'activity', description: 'Campaign strategy, paid ads, and growth experiments.' }
  ]

  let added = false
  core.forEach(svc => {
    if (!db.services.find(x => x.id === svc.id)) {
      db.services.push(svc)
      added = true
    }
  })
  if (added) writeDB(db)

  // ensure projects array exists
  if (!db.projects) db.projects = []
  // no default projects
  if (added) writeDB(db)

  // Seed sample instructor if none exist
  if (db.instructors.length === 0) {
    db.instructors.push({
      id: 'inst-1',
      userId: null,
      name: 'Ali Hassan',
      email: 'ali@devonic.local',
      title: 'Senior Full-Stack Developer',
      bio: 'Experienced developer with 8+ years in web and mobile development. Passionate about teaching and mentoring.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali',
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB'],
      experience: [
        { title: 'Lead Developer', company: 'Tech Corp', start: '2020', end: 'Present', description: 'Leading a team of 5 developers on enterprise projects.' },
        { title: 'Full-Stack Developer', company: 'StartupXYZ', start: '2016', end: '2020', description: 'Built MVPs for multiple startups.' }
      ],
      projects: [],
      links: { website: 'https://alihassan.dev', linkedin: 'https://linkedin.com/in/alihassan', twitter: '' },
      status: 'published',
      createdAt: new Date().toISOString()
    })
    db.instructors.push({
      id: 'inst-2',
      userId: null,
      name: 'Sara Ahmed',
      email: 'sara@devonic.local',
      title: 'UI/UX Design Expert',
      bio: 'Design professional specializing in user experience and brand identity. 6+ years creating intuitive digital experiences.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
      skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping'],
      experience: [
        { title: 'Senior Designer', company: 'Design Studio', start: '2019', end: 'Present', description: 'Leading design for SaaS products.' }
      ],
      projects: [],
      links: { website: '', linkedin: 'https://linkedin.com/in/saraahmed', twitter: '' },
      status: 'published',
      createdAt: new Date().toISOString()
    })
    changed = true
  }

  // Seed sample courses if none exist
  if (db.courses.length === 0) {
    db.courses.push({
      id: 'course-1',
      title: 'Complete Web Development Bootcamp',
      summary: 'Learn HTML, CSS, JavaScript, React, Node.js and build real projects.',
      description: 'This comprehensive course covers everything from basic HTML to advanced React patterns. You will build 5 real-world projects and learn industry best practices.',
      price: 299,
      instructorId: 'inst-1',
      duration: '12 weeks',
      capacity: 30,
      students: [],
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      tags: ['web', 'javascript', 'react', 'node'],
      published: true,
      createdAt: new Date().toISOString()
    })
    db.courses.push({
      id: 'course-2',
      title: 'UI/UX Design Masterclass',
      summary: 'Master Figma and create stunning user interfaces from scratch.',
      description: 'Learn the complete design process from wireframing to high-fidelity prototypes. Includes portfolio projects.',
      price: 199,
      instructorId: 'inst-2',
      duration: '8 weeks',
      capacity: 25,
      students: [],
      thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      tags: ['design', 'figma', 'ui', 'ux'],
      published: true,
      createdAt: new Date().toISOString()
    })
    db.courses.push({
      id: 'course-3',
      title: 'Amazon FBA Complete Course',
      summary: 'Start your Amazon FBA business from zero to profitable.',
      description: 'Step-by-step guide to launching and scaling an Amazon FBA business. Product research, sourcing, and marketing strategies included.',
      price: 149,
      instructorId: 'inst-1',
      duration: '6 weeks',
      capacity: 50,
      students: [],
      thumbnailUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800',
      tags: ['business', 'amazon', 'ecommerce'],
      published: true,
      createdAt: new Date().toISOString()
    })
    changed = true
  }

  if (changed) writeDB(db)

  return db
}

module.exports = { seed }
if (require.main === module) {
  seed()
  console.log('Database seeded successfully.')
}
