import { spawnSync } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

function run(command, args) {
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Hostinger's build image currently ships an older glibc than the native
// Biome binary used by Umami. The official build-tracker-types script only
// uses Biome to format the generated declaration file, so for Hostinger we
// generate the same TypeScript declarations without the formatting-only step.
run(npm, ['run', 'check-env']);
run(npm, ['run', 'build-db']);
run(npm, ['run', 'check-db']);
run(npm, ['run', 'check-tracker']);
run(npm, ['run', 'build-tracker-script']);
run(npx, ['tsc', '-p', 'tsconfig.tracker.types.json']);
run(npm, ['run', 'build-recorder']);
run(npm, ['run', 'build-geo']);
run(npm, ['run', 'build-app']);
