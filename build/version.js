const fs = require('fs-extra')
const path = require('path')
const packageJsonPath = path.resolve(__dirname, '../package.json')

function updateVersion(releaseType = 'patch') {
  // releaseType = major, minor, patch
  fs.readJson(packageJsonPath).then((json) => {
    let [major, minor, patch] = json.version.split('.')

    switch(releaseType) {
      case 'major': major = Number(major) + 1; break;
      case 'minor': minor = Number(minor) + 1; break;
      case 'patch': patch = Number(patch) + 1; break;
    }

    json.version = [major, minor, patch].join('.')
    return json
  }).then((json) => {
    fs.writeJson(packageJsonPath, json, { spaces: 2 }).then(() => {
      console.log('version updated')
      console.log()
    })
  })
}

updateVersion(process.argv[2])