import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathExists } from './fs-safe.js';

const marketplaceName = 'promptify-local';
const pluginName = 'promptify';
const pluginKey = `${pluginName}@${marketplaceName}`;

export async function registerClaudeCodePlugin({ homeDir, installPath, version }) {
  const claudePluginsRoot = path.join(homeDir, '.claude', 'plugins');
  const pluginPath = path.join(claudePluginsRoot, 'cache', marketplaceName, pluginName, version);

  await rm(pluginPath, { recursive: true, force: true });
  await mkdir(pluginPath, { recursive: true });

  await Promise.all([
    cp(path.join(installPath, 'adapters', 'claude-code', '.claude-plugin'), path.join(pluginPath, '.claude-plugin'), {
      recursive: true
    }),
    cp(path.join(installPath, 'adapters', 'claude-code', 'commands'), path.join(pluginPath, 'commands'), {
      recursive: true
    }),
    cp(path.join(installPath, 'adapters', 'claude-code', 'skills'), path.join(pluginPath, 'skills'), {
      recursive: true
    }),
    cp(path.join(installPath, 'shared'), path.join(pluginPath, 'shared'), { recursive: true })
  ]);

  const installedPluginsPath = getInstalledPluginsPath(homeDir);
  const installedPlugins = await readInstalledPlugins(installedPluginsPath);
  const previousEntry = installedPlugins.plugins[pluginKey]?.[0] ?? {};
  const now = new Date().toISOString();

  installedPlugins.plugins[pluginKey] = [
    {
      scope: 'user',
      installPath: pluginPath,
      version,
      installedAt: previousEntry.installedAt ?? now,
      lastUpdated: now
    }
  ];

  await writeInstalledPlugins(installedPluginsPath, installedPlugins);
  return { pluginPath, pluginKey };
}

export async function unregisterClaudeCodePlugin({ homeDir }) {
  const installedPluginsPath = getInstalledPluginsPath(homeDir);
  if (!(await pathExists(installedPluginsPath))) {
    return false;
  }

  const installedPlugins = await readInstalledPlugins(installedPluginsPath);
  if (!installedPlugins.plugins[pluginKey]) {
    return false;
  }

  delete installedPlugins.plugins[pluginKey];
  await writeInstalledPlugins(installedPluginsPath, installedPlugins);
  return true;
}

export async function getClaudeCodePluginStatus({ homeDir }) {
  const installedPluginsPath = getInstalledPluginsPath(homeDir);
  if (!(await pathExists(installedPluginsPath))) {
    return { ok: false, message: installedPluginsPath };
  }

  const installedPlugins = await readInstalledPlugins(installedPluginsPath);
  const entry = installedPlugins.plugins[pluginKey]?.[0];
  if (!entry?.installPath) {
    return { ok: false, message: pluginKey };
  }

  const requiredFiles = [
    '.claude-plugin/plugin.json',
    'commands/promptify.md',
    'skills/promptify/SKILL.md',
    'shared/templates/task.md'
  ];
  const missing = [];
  for (const file of requiredFiles) {
    if (!(await pathExists(path.join(entry.installPath, file)))) {
      missing.push(file);
    }
  }

  return {
    ok: missing.length === 0,
    message: missing.length === 0 ? entry.installPath : `${entry.installPath} missing ${missing.join(', ')}`
  };
}

function getInstalledPluginsPath(homeDir) {
  return path.join(homeDir, '.claude', 'plugins', 'installed_plugins.json');
}

async function readInstalledPlugins(target) {
  if (!(await pathExists(target))) {
    return { version: 2, plugins: {} };
  }

  const parsed = JSON.parse(await readFile(target, 'utf8'));
  return {
    version: parsed.version ?? 2,
    plugins: parsed.plugins ?? {}
  };
}

async function writeInstalledPlugins(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
