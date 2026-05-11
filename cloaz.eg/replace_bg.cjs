const fs = require('fs');

const files = [
  'src/pages/HomePage.tsx',
  'src/pages/ProductPage.tsx',
  'src/pages/AboutPage.tsx',
  'src/pages/CategoriesPage.tsx',
  'src/pages/StorePage.tsx',
  'src/pages/ContactPage.tsx',
  'src/pages/AuthPage.tsx',
  'src/index.css'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/url\(\["']?\/asstes\/bg\.svg["']?\)/g, 'url("/asstes/background.jpg")');
    content = content.replace(/url\(\/asstes\/bg\.svg\)/g, 'url("/asstes/background.jpg")');
    fs.writeFileSync(file, content);
  }
});
console.log("Replaced bg.svg with background.jpg");
