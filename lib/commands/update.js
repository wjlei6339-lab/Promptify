import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { registerClaudeCodePlugin } from '../claude-code-plugin.js';
import { copyResources } from '../resources.js';
import { doctorCommand } from './doctor.js';

export async function updateCommand(args, io, context) {
  await copyResources(context.paths);
  if (await hasInstalledHost(context.paths.manifest, 'claude-code')) {
    const packageRoot = context.packageRoot ?? process.cwd();
    const pkg = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
    await registerClaudeCodePlugin({
      homeDir: context.homeDir,
      installPath: context.paths.current,
      version: pkg.version
    });
    io.stdout('已刷新 Claude Code 插件：promptify@promptify-local');
  }
  io.stdout('更新完成：Promptify 资源已刷新。');
  return doctorCommand(io, context);
}

async function hasInstalledHost(manifestPath, hostId) {
  try {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    return manifest.hosts?.includes(hostId) ?? false;
  } catch {
    return false;
  }
}
