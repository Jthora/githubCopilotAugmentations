/* eslint-disable no-console */
const path = require('path');
const { runTests, downloadAndUnzipVSCode } = require('@vscode/test-electron');

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '..');
  const extensionTestsPath = path.resolve(__dirname, '../dist/test/integration/index');

    const vscodeExecutablePath = await downloadAndUnzipVSCode('stable');

    await runTests({
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
  launchArgs: []
    });
    console.log('Integration tests passed.');
  } catch (err) {
    console.error('Failed to run integration tests');
    console.error(err);
    process.exit(1);
  }
}

main();
