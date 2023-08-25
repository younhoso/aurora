const _getBuildOptionBy = (param) => {
  return process.argv.filter(arg => arg.includes(param))?.at(0)?.split('=')?.at(-1) ?? '';
}

const platformType = _getBuildOptionBy('PLATFORM');
const _isProdMode = _getBuildOptionBy('MODE') === 'prod';

const entryDirectory = platformType ? `${platformType}/` : '';
const outputDirectory = platformType && _isProdMode ? `${platformType}/` : '';

module.exports = {
  platformType,
  entryDirectory,
  outputDirectory
}