# BI Course Website - RANEPA

Clean, minimalist academic website for Business Intelligence course.

## 🚀 Quick Start

### Option 1: Test Immediately
1. Open `bi-course-site.html` in your browser
2. Everything works locally with sample data

### Option 2: Full Setup with Obsidian

#### Structure
```
bi-course/
├── content/           # Your Obsidian vault (markdown files)
│   ├── module1.md
│   ├── module2.md
│   └── module3.md
├── presentations/     # HTML presentations
│   ├── lecture1.html
│   └── lecture2.html
├── materials/         # Downloadable materials
│   └── module1/
│       └── lecture1.zip
├── public/           # Built site (auto-generated)
├── build.js          # Build script
├── package.json      # Dependencies
└── vercel.json       # Deployment config
```

#### Setup Steps

1. **Initialize project**
```bash
# Create project folder
mkdir bi-course && cd bi-course

# Initialize npm
npm init -y

# Install dependencies
npm install js-yaml marked
npm install -D http-server
```

2. **Create content structure**
```bash
# Create folders
mkdir content presentations materials public

# Copy the files from /tmp to your project
```

3. **Write content in Obsidian**
- Open `content/` folder as Obsidian vault
- Create `.md` files for each module
- Follow the markdown structure from `module1.md` example

4. **Build the site**
```bash
# Build once
npm run build

# Watch for changes (development)
npm run dev

# Preview locally
npm run serve
# Open http://localhost:8080
```

## 📝 Content Format

Each module is a markdown file in `content/` folder:

```markdown
# Module Title

## Metadata
\`\`\`yaml
title: Module Title
description: Brief description
order: 1
status: published
\`\`\`

## Lectures

### Lecture 1: Title
- **Duration**: 45 min
- **Type**: Лекция
- **Video**: https://youtube.com/watch?v=xxx
- **Presentation**: presentations/lecture1.html
- **Materials**: materials/module1/lecture1.zip
- **Description**: Brief description

#### Resources
- [Resource Title](https://link.com)
```

## 🎨 Customization

### Colors & Styling
Edit the Tailwind classes in `bi-course-site.html`:
- Primary color: `bg-blue-600` → change to your brand
- Font: Currently using Inter → change in `<style>` section

### Add Your Links
Replace placeholders in the HTML:
- Telegram channel URL
- YouTube video links
- Material download links

## 🚀 Deploy to Vercel

### Method 1: GitHub + Vercel
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. Connect to Vercel:
- Go to [vercel.com](https://vercel.com)
- Import GitHub repository
- Deploy automatically

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts
```

## 📱 Features

- ✅ Mobile responsive
- ✅ Progress tracking (localStorage)
- ✅ Clean academic design
- ✅ Obsidian-compatible markdown
- ✅ Presentation viewer
- ✅ Download materials
- ✅ Video links
- ✅ Additional resources

## 🔄 Workflow

1. **Write content** in Obsidian (markdown)
2. **Run build** script → generates HTML
3. **Push to GitHub** → auto-deploys to Vercel
4. **Students access** at your-domain.vercel.app

## 📊 Adding Presentations

Your presentations (from yesterday's work) go in `presentations/` folder:
```bash
presentations/
├── lecture1.html
├── lecture2.html
└── assets/
    └── images/
```

## 🤝 Support

- Telegram: @your_channel
- Email: your.email@ranepa.ru

## 📄 License

MIT - Free to use and modify