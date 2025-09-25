// build.js - Simple static site builder for BI course
// Converts Obsidian markdown files to JSON for the website

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const marked = require('marked');

// Configuration
const config = {
    contentDir: './content',  // Where your .md files are stored
    outputDir: './public',    // Where to build the site
    dataFile: 'courseData.json'
};

// Parse markdown file with YAML frontmatter
function parseMarkdownFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    let inYaml = false;
    let yamlContent = [];
    let markdownContent = [];
    let yamlStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '```yaml' && !inYaml) {
            inYaml = true;
            yamlStart = i;
        } else if (lines[i].trim() === '```' && inYaml) {
            inYaml = false;
        } else if (inYaml && yamlStart !== i - 1) {
            yamlContent.push(lines[i]);
        } else if (!inYaml) {
            markdownContent.push(lines[i]);
        }
    }
    
    const metadata = yaml.load(yamlContent.join('\n')) || {};
    const html = marked.parse(markdownContent.join('\n'));
    
    return { metadata, html, raw: markdownContent.join('\n') };
}

// Extract lectures from markdown content
function extractLectures(markdownContent) {
    const lectures = [];
    const lines = markdownContent.split('\n');
    
    let currentLecture = null;
    let inLecture = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for lecture header (### Lecture X:)
        if (line.startsWith('### Lecture')) {
            if (currentLecture) {
                lectures.push(currentLecture);
            }
            
            const title = line.replace(/### Lecture \d+:\s*/, '').trim();
            currentLecture = {
                title: title,
                duration: 45,
                type: 'Лекция',
                completed: false,
                videoUrl: '',
                presentationUrl: '',
                materialsUrl: '',
                description: '',
                resources: []
            };
            inLecture = true;
        }
        // Parse lecture properties
        else if (inLecture && line.startsWith('- **')) {
            const match = line.match(/- \*\*(.+?)\*\*:\s*(.+)/);
            if (match) {
                const [, key, value] = match;
                switch(key.toLowerCase()) {
                    case 'duration':
                        currentLecture.duration = parseInt(value);
                        break;
                    case 'type':
                        currentLecture.type = value;
                        break;
                    case 'video':
                        currentLecture.videoUrl = value;
                        break;
                    case 'presentation':
                        currentLecture.presentationUrl = value;
                        break;
                    case 'materials':
                        currentLecture.materialsUrl = value;
                        break;
                    case 'description':
                        currentLecture.description = value;
                        break;
                }
            }
        }
        // Parse resources
        else if (inLecture && line.startsWith('- [') && line.includes('](')) {
            const match = line.match(/- \[(.+?)\]\((.+?)\)/);
            if (match) {
                currentLecture.resources.push({
                    title: match[1],
                    url: match[2]
                });
            }
        }
    }
    
    if (currentLecture) {
        lectures.push(currentLecture);
    }
    
    return lectures;
}

// Build course data from markdown files
function buildCourseData() {
    const modules = [];
    const contentDir = path.resolve(config.contentDir);
    
    if (!fs.existsSync(contentDir)) {
        console.log(`Creating content directory: ${contentDir}`);
        fs.mkdirSync(contentDir, { recursive: true });
        return modules;
    }
    
    const files = fs.readdirSync(contentDir)
        .filter(file => file.endsWith('.md'))
        .sort();
    
    for (const file of files) {
        const filePath = path.join(contentDir, file);
        const { metadata, raw } = parseMarkdownFile(filePath);
        
        const lectures = extractLectures(raw);
        
        modules.push({
            title: metadata.title || 'Untitled Module',
            description: metadata.description || '',
            order: metadata.order || 999,
            completed: false,
            lectures: lectures
        });
    }
    
    // Sort modules by order
    modules.sort((a, b) => a.order - b.order);
    
    return modules;
}

// Generate the complete HTML file with embedded data
function generateHTML(modules) {
    // Read the template (you can modify this)
    const template = fs.readFileSync('./template.html', 'utf-8');
    
    // Inject the modules data
    const html = template.replace(
        'modules: [/* MODULES_DATA */]',
        `modules: ${JSON.stringify(modules, null, 4)}`
    );
    
    return html;
}

// Main build function
function build() {
    console.log('🚀 Building BI Course Site...\n');
    
    // Create output directory
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // Build course data from markdown
    const modules = buildCourseData();
    console.log(`📚 Found ${modules.length} modules`);
    
    // Save as JSON (for API/dynamic loading if needed)
    const jsonPath = path.join(config.outputDir, config.dataFile);
    fs.writeFileSync(jsonPath, JSON.stringify(modules, null, 2));
    console.log(`📄 Generated ${config.dataFile}`);
    
    // Generate HTML
    if (fs.existsSync('./template.html')) {
        const html = generateHTML(modules);
        fs.writeFileSync(path.join(config.outputDir, 'index.html'), html);
        console.log('🌐 Generated index.html');
    }
    
    // Copy static assets if they exist
    const dirs = ['presentations', 'materials', 'css', 'js'];
    for (const dir of dirs) {
        if (fs.existsSync(dir)) {
            const destDir = path.join(config.outputDir, dir);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            console.log(`📁 Copied ${dir}/`);
        }
    }
    
    console.log('\n✅ Build complete! Deploy the "public" folder to Vercel.');
}

// Watch mode for development
function watch() {
    console.log('👀 Watching for changes...\n');
    build();
    
    fs.watch(config.contentDir, { recursive: true }, (eventType, filename) => {
        if (filename && filename.endsWith('.md')) {
            console.log(`\n🔄 ${filename} changed, rebuilding...`);
            build();
        }
    });
}

// CLI
const command = process.argv[2];
if (command === 'watch') {
    watch();
} else {
    build();
}

// For Vercel deployment
module.exports = { build };