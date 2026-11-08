
import fs from 'node:fs';
import path from 'node:path';

const distDir = './dist';
const headersFile = path.join(distDir, '_headers');

const credentials = process.env.BASIC_AUTH_CREDENTIALS;

if (!credentials || !credentials.includes(':')) {
    console.error('Missing or invalid BASIC_AUTH_CREDENTIALS');
    process.exit(1);
}

if (!fs.existsSync(distDir)) {
    console.error('Build output directory does not exist.');
    process.exit(1);
}

const headersContent = `/*
  Basic-Auth: ${credentials}
`;

fs.writeFileSync(headersFile, headersContent, {
    encoding: 'utf8',
    mode: 0o600,
});

console.log('Site-wide Basic Authentication headers generated.');
