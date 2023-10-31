import * as fse from 'node:fs'
import {analyze, parse} from '@antongolub/lockfile'

// if (process.argv.length === 2) {
//   console.error('缺少platform参数!');
//   process.exit(1);
// }
// let version = '0.75.0'
// let outDir, platform, arch;
// if ('--platform=win64' === process.argv[2]) {
//   outDir = './out/win64'
//   platform = 'win'
//   arch = 'x64'
// } else if ('--platform=osx64' === process.argv[2]) {
//   outDir = './out/osx64'
//   platform = 'osx'
//   arch = 'x64'
// } else {
//   console.error('platform不匹配!');
//   process.exit(1);
// }
//
// execSync('yarn --cwd ../ run build')
// //将angular build之后的目录复制过来
// fs.copySync('../dist', './temp')
// //添加所需文件
// fs.copySync('./package-prod.json', './temp/package.json')
// fs.copySync('./build-bgscript.js', './temp/build-bgscript.js')
// fs.copySync('./tray.png', './temp/tray.png')
// //判断构建目录存在不存在，存在则先删除
// if (fs.pathExistsSync(outDir)) {
//   fs.removeSync(outDir)
// }
// //执行nwjs构建
// nwbuild({
//   srcDir: "./temp/*",
//   outDir: outDir,
//   cacheDir: "./cache", // "./cache" | string
//   mode: "build", // "run" | "build"
//   version: version, // "latest" | "stable" | string
//   flavor: "normal", // "normal" | "sdk"
//   platform: platform, // "linux" | "osx" | "win"
//   arch: arch, // "ia32" | "x64" | "arm64"
//   downloadUrl: 'https://npmmirror.com/mirrors/nwjs',
// }).then(() => {
//   //构建结束删除临时复制的dist目录
//   fs.removeSync('temp')
// });
//
//
const dependencies = [
    'zip-lib'
]

function getDependencyTree() {

    const lf = fse.readFileSync('../yarn.lock', 'utf-8')
    const pkg = fse.readFileSync('../package.json', 'utf-8')

    const snapshot = parse(lf, pkg) // Holds JSON-friendly TEntries[]
    const idx = analyze(snapshot)   // An index to represent repo dep graphs
    let tree = idx.tree;
    return Object.keys(tree)
        .filter(s => s.split(',').length > 1 && dependencies.indexOf(s.split(',')[1]) !== -1)
        .map(s => tree[s].chunks[tree[s].chunks.length - 1]);
}

function copyDependencies() {
    let tree = getDependencyTree()
    console.log(1)
}

//将angular没有包含的依赖手动复制过来
copyDependencies()



