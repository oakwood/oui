/* eslint-disable no-console */
const path = require('path')
const fse = require('fs-extra')
const glob = require('glob')

const packagePath = process.cwd()
const buildPath = path.join(packagePath, './build')
const srcPath = path.join(packagePath, './src')

async function includeFileInBuild(file) {
  const sourcePath = path.resolve(packagePath, file)
  const targetPath = path.resolve(buildPath, path.basename(file))
  await fse.copy(sourcePath, targetPath)
  console.log(`Copied ${sourcePath} to ${targetPath}`)
}

/**
 * Puts a package.json into every immediate child directory of rootDir.
 * That package.json contains information about esm for bundlers so that imports
 * like import Typography from '@material-ui/core/Typography' are tree-shakeable.
 *
 * @param {string} rootDir
 */
async function createModulePackages({ from, to }) {
  const directoryPackages = glob.sync('*/index.js', { cwd: from }).map(path.dirname)

  await Promise.all(
    directoryPackages.map(async (directoryPackage) => {
      const packageJsonPath = path.join(to, directoryPackage, 'package.json')

      return packageJsonPath
    }),
  )
}

async function createPackageFile() {
  const packageData = await fse.readFile(path.resolve(packagePath, './package.json'), 'utf8')
  const { scripts, devDependencies, workspaces, ...packageDataOther } = JSON.parse(packageData)
  const newPackageData = {
    ...packageDataOther,
    private: false,
    main: './index.js',
    module: './esm/index.js',
  }
  const targetPath = path.resolve(buildPath, './package.json')

  await fse.writeFile(targetPath, JSON.stringify(newPackageData, null, 2), 'utf8')
  console.log(`Created package.json in ${targetPath}`)

  return newPackageData
}

async function run() {
  try {
    const packageData = await createPackageFile()

    await Promise.all(
      [
        // use enhanced readme from workspace root for `@oakwood/oui`
        packageData.name === '@oakwood/oui' ? '../../README.md' : './README.md',
        '../../CHANGELOG.md',
      ].map((file) => includeFileInBuild(file)),
    )

    await createModulePackages({ from: srcPath, to: buildPath })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

run()
