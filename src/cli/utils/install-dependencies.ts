import { spawn } from 'node:child_process';
import type { PackageManager } from './detect-package-manager.js';

const DEPENDENCIES = ['zustand', 'sharp'];

export function installDependencies(
  packageManager: PackageManager,
  cwd: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let command: string;
    let args: string[];

    switch (packageManager) {
      case 'npm':
        command = 'npm';
        args = ['install', ...DEPENDENCIES];
        break;
      case 'yarn':
        command = 'yarn';
        args = ['add', ...DEPENDENCIES];
        break;
      case 'pnpm':
        command = 'pnpm';
        args = ['add', ...DEPENDENCIES];
        break;
      case 'bun':
        command = 'bun';
        args = ['add', ...DEPENDENCIES];
        break;
    }

    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}
