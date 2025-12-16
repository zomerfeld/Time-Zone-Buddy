import { getUncachableGitHubClient } from '../server/github';
import * as fs from 'fs';
import * as path from 'path';

const REPO_NAME = 'time-zone-planner';
const REPO_DESCRIPTION = 'A privacy-preserving Chrome extension that displays multiple time zones with color-coded cards and scroll-to-plan feature for meeting coordination.';

async function getAllFiles(dir: string, baseDir: string = dir): Promise<{ path: string; content: string }[]> {
  const files: { path: string; content: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      try {
        const content = fs.readFileSync(fullPath);
        const base64Content = content.toString('base64');
        files.push({ path: relativePath, content: base64Content });
      } catch (e) {
        console.log(`Skipping file ${relativePath}: ${e}`);
      }
    }
  }

  return files;
}

async function main() {
  console.log('Getting GitHub client...');
  const octokit = await getUncachableGitHubClient();

  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);

  let repo;
  try {
    const { data: existingRepo } = await octokit.repos.get({
      owner: user.login,
      repo: REPO_NAME,
    });
    repo = existingRepo;
    console.log(`Repository ${REPO_NAME} already exists.`);
  } catch (e: any) {
    if (e.status === 404) {
      console.log(`Creating repository ${REPO_NAME}...`);
      const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
        name: REPO_NAME,
        description: REPO_DESCRIPTION,
        private: false,
        auto_init: true,
      });
      repo = newRepo;
      console.log(`Repository created: ${newRepo.html_url}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      throw e;
    }
  }

  console.log('Collecting files...');
  const files = await getAllFiles('.');
  console.log(`Found ${files.length} files to upload.`);

  const { data: refData } = await octokit.git.getRef({
    owner: user.login,
    repo: REPO_NAME,
    ref: 'heads/main',
  });
  const latestCommitSha = refData.object.sha;

  const { data: commitData } = await octokit.git.getCommit({
    owner: user.login,
    repo: REPO_NAME,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commitData.tree.sha;

  console.log('Creating blobs...');
  const treeItems: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];

  for (const file of files) {
    try {
      const { data: blob } = await octokit.git.createBlob({
        owner: user.login,
        repo: REPO_NAME,
        content: file.content,
        encoding: 'base64',
      });
      treeItems.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      });
      console.log(`  Uploaded: ${file.path}`);
    } catch (e) {
      console.log(`  Failed: ${file.path}: ${e}`);
    }
  }

  console.log('Creating tree...');
  const { data: tree } = await octokit.git.createTree({
    owner: user.login,
    repo: REPO_NAME,
    base_tree: baseTreeSha,
    tree: treeItems,
  });

  console.log('Creating commit...');
  const { data: newCommit } = await octokit.git.createCommit({
    owner: user.login,
    repo: REPO_NAME,
    message: 'Push all project files from Replit',
    tree: tree.sha,
    parents: [latestCommitSha],
  });

  console.log('Updating reference...');
  await octokit.git.updateRef({
    owner: user.login,
    repo: REPO_NAME,
    ref: 'heads/main',
    sha: newCommit.sha,
  });

  console.log(`\nSuccess! Repository URL: https://github.com/${user.login}/${REPO_NAME}`);
}

main().catch(console.error);
