#!/usr/bin/env node

// Bundle analyzer script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function analyzeBundle() {
  console.log('Analyzing bundle size...\n');

  try {
    // Build the application
    console.log('Building application...');
    execSync('npm run build', { stdio: 'inherit' });

    // Analyze the bundle
    console.log('\nAnalyzing bundle...');
    execSync('npx @next/bundle-analyzer', { stdio: 'inherit' });

    // Check for large chunks
    const buildDir = path.join(process.cwd(), '.next');
    const staticDir = path.join(buildDir, 'static');

    if (fs.existsSync(staticDir)) {
      console.log('\n=== Static Assets Analysis ===');
      
      const analyzeDirectory = (dir, prefix = '') => {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            analyzeDirectory(itemPath, prefix + item + '/');
          } else {
            const { size } = stat;
            const sizeKB = (size / 1024).toFixed(2);
            const sizeMB = (size / (1024 * 1024)).toFixed(2);
            
            if (size > 100 * 1024) { // Larger than 100KB
              console.log(`${prefix}${item}: ${sizeKB} KB (${sizeMB} MB)`);
            }
          }
        });
      };
      
      analyzeDirectory(staticDir);
    }

    // Check package.json for large dependencies
    console.log('\n=== Dependencies Analysis ===');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const { dependencies, devDependencies } = packageJson;
    const allDependencies = { ...dependencies, ...devDependencies };
    
    const largeDeps = Object.entries(allDependencies)
      .filter(([name, version]) => {
        // Check for potentially large packages
        const largePackages = [
          'react', 'react-dom', 'next', '@supabase',
          'framer-motion', 'three', '@react-three',
          'pdf-lib', 'jspdf', 'html2canvas',
          'monaco-editor', '@codemirror',
          'chart.js', 'd3', 'plotly.js'
        ];
        return largePackages.some(pkg => name.includes(pkg));
      })
      .map(([name, version]) => ({ name, version }));

    if (largeDeps.length > 0) {
      console.log('Potentially large dependencies:');
      largeDeps.forEach(dep => {
        console.log(`  - ${dep.name}@${dep.version}`);
      });
    }

    console.log('\n=== Optimization Recommendations ===');
    console.log('1. Consider dynamic imports for large components');
    console.log('2. Use next/dynamic for heavy libraries');
    console.log('3. Implement code splitting for routes');
    console.log('4. Optimize images and assets');
    console.log('5. Remove unused dependencies');

  } catch (error) {
    console.error('Error analyzing bundle:', error.message);
    process.exit(1);
  }
}

// Run the analysis
analyzeBundle();
