import { exec } from './git-helper/node_modules/dugite/build/lib/index.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const commitMessage = process.argv.slice(2).join(' ') || `Site update: ${new Date().toLocaleString()}`;

async function runGit(args) {
  console.log(`> git ${args.join(' ')}`);
  const result = await exec(args, projectRoot);
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${result.exitCode}`);
  }
  return result;
}

async function deploy() {
  try {
    console.log('🚀 Starting automated deploy to live...');
    await runGit(['add', '.']);
    
    // Check if there are uncommitted changes
    const status = await exec(['status', '--porcelain'], projectRoot);
    if (status.stdout.trim()) {
      await runGit(['commit', '-m', commitMessage]);
    } else {
      console.log('ℹ️ Working tree clean, checking for unpushed commits...');
    }

    console.log('📦 Pushing to GitHub (main branch)...');
    await runGit(['push', 'origin', 'main']);
    console.log('🎉 Successfully pushed to GitHub! Vercel is now updating your live website at https://www.grafikmachinery.in');
  } catch (error) {
    console.error('❌ Deploy error:', error.message);
    process.exit(1);
  }
}

deploy();
