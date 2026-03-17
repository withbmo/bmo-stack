const rawVersion = process.versions.node;

function parse(version) {
  const [major = '0', minor = '0', patch = '0'] = version.split('.');
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
  };
}

function compare(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function isSupported(version) {
  const v = parse(version);
  const min20 = { major: 20, minor: 19, patch: 0 };
  const min22 = { major: 22, minor: 12, patch: 0 };
  const min24 = { major: 24, minor: 0, patch: 0 };

  if (v.major === 20) return compare(v, min20) >= 0;
  if (v.major === 22) return compare(v, min22) >= 0;
  if (v.major >= 24) return compare(v, min24) >= 0;
  return false;
}

if (!isSupported(rawVersion)) {
  console.error('');
  console.error(`Unsupported Node.js version: ${rawVersion}`);
  console.error('This repo uses Prisma 7.x, which requires one of:');
  console.error('- Node 20.19.0 or newer in the Node 20 line');
  console.error('- Node 22.12.0 or newer in the Node 22 line');
  console.error('- Node 24.0.0 or newer');
  console.error('');
  console.error('Recommended fix: `nvm use` after installing Node 20.19.0, or upgrade to a supported Node version and rerun `pnpm install`.');
  process.exit(1);
}
