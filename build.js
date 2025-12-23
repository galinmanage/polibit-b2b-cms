const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const env = process.argv[2] || 'production';
const basePath = process.argv[3] || '';
const outputDir = `build-${env}`;
const buildDestination = path.join(__dirname, outputDir);

const testHtaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${basePath}

  # If the requested file or directory doesn't exist...
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # ...rewrite everything to index.html
  RewriteRule ^ index.html [L]
</IfModule>
`;
const productionHtaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On

  # Don’t rewrite existing files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

<FilesMatch "^\\."> 
  Order allow,deny
  Deny from all
</FilesMatch>
`;

execSync(`PUBLIC_URL=${basePath} env-cmd -f .env.${env} react-scripts build`, { stdio: 'inherit' });

async function removeDirAndRename() {
  try {
    // Check if directory exists
    await fs.promises.access(buildDestination);

    // Remove old directory
    await fs.promises.rm(buildDestination, {recursive: true, force: true});
  } catch (e) {
    console.warn('No previous build found, skipping removal of old build!')
  }
  fs.renameSync(path.join(__dirname, 'build'), path.join(__dirname, outputDir));
  fs.writeFileSync(path.join(__dirname, outputDir, '.htaccess'), basePath ? testHtaccessContent : productionHtaccessContent);
}

removeDirAndRename();
