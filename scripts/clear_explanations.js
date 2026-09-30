const fs = require('fs');
const path = require('path');

let totalFilesProcessed = 0;
let totalQuestionsUpdated = 0;
let totalExplanationsCleared = 0;
let totalHintsCleared = 0;

function processFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return;

    let modified = false;
    for (const q of data) {
      if (!q) continue;
      totalQuestionsUpdated++;
      
      if (q.explanation !== undefined && q.explanation !== "") {
        q.explanation = "";
        totalExplanationsCleared++;
        modified = true;
      }
      
      if (q.hints !== undefined && q.hints !== "") {
        q.hints = "";
        totalHintsCleared++;
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    totalFilesProcessed++;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err.message);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      walkDir(full);
    } else if (item.name.endsWith('.json') && item.name !== 'summary.json') {
      processFile(full);
    }
  }
}

console.log('Starting explanation and hints cleanup...');
const startTime = Date.now();

// 1. Process job-solution
console.log('Processing public/data/job-solution ...');
walkDir(path.join(__dirname, '../public/data/job-solution'));

// 2. Process most-important-questions
console.log('Processing public/data/most-important-questions ...');
walkDir(path.join(__dirname, '../public/data/most-important-questions'));

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log('=== Cleanup Completed ===');
console.log(`Time taken: ${duration}s`);
console.log(`Total JSON files processed: ${totalFilesProcessed}`);
console.log(`Total questions checked: ${totalQuestionsUpdated}`);
console.log(`Total explanation fields cleared: ${totalExplanationsCleared}`);
console.log(`Total hints fields cleared: ${totalHintsCleared}`);
