import nwbuild from 'nw-builder'
import fs from 'fs-extra'
import {execSync} from 'node:child_process'

if (process.argv.length === 2) {
  console.error('缺少platform参数!');
  process.exit(1);
}
let version = '0.75.0'
let outDir, platform, arch;
if ('--platform=win64' === process.argv[2]) {
  outDir = './out/win64'
  platform = 'win'
  arch = 'x64'
} else if ('--platform=osx64' === process.argv[2]) {
  outDir = './out/osx64'
  platform = 'osx'
  arch = 'x64'
} else {
  console.error('platform不匹配!');
  process.exit(1);
}

execSync('yarn --cwd ../ run build')
//将angular build之后的目录复制过来
fs.copySync('../dist', './temp')
//添加所需文件
fs.copySync('./package-prod.json', './temp/package.json')
fs.copySync('./build-bgscript.js', './temp/build-bgscript.js')
//判断构建目录存在不存在，存在则先删除
if (fs.pathExistsSync(outDir)) {
  fs.removeSync(outDir)
}
//执行nwjs构建
nwbuild({
  srcDir: "./temp/*",
  outDir: outDir,
  cacheDir: "./cache", // "./cache" | string
  mode: "build", // "run" | "build"
  version: version, // "latest" | "stable" | string
  flavor: "normal", // "normal" | "sdk"
  platform: platform, // "linux" | "osx" | "win"
  arch: arch, // "ia32" | "x64" | "arm64"
  downloadUrl: 'https://npmmirror.com/mirrors/nwjs',
}).then(() => {
  //构建结束删除临时复制的dist目录
  fs.removeSync('temp')
});




