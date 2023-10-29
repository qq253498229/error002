import { Injectable } from '@angular/core';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as _path from 'node:path';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  fs!: typeof fs;
  os!: typeof os;
  _path!: typeof _path;

  constructor() {
    this.fs = nw.require('fs');
    this.os = nw.require('os');
    this._path = nw.require('path');
  }

  checkPath(path: string) {
    return this.fs.existsSync(path);
  }

  readdir(path: string) {
    return this.fs.readdirSync(path);
  }

  stat(folder: string) {
    return this.fs.statSync(folder);
  }

  exists(filename: string) {
    return this.fs.existsSync(filename);
  }

  listFile(folder: string) {
    // 读取目录中的所有文件和子目录
    const items = this.fs.readdirSync(folder);
    // 过滤出文件而不是目录
    const files = items.filter(item => {
      return this.fs.statSync(this._path.join(folder, item)).isFile();
    });
    // 创建一个包含文件名和修改时间的数组
    const fileDetails = files.map(file => {
      const filePath = this._path.join(folder, file);
      const stats = this.fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        mtime: stats.mtime, // 修改时间
      };
    });
    // 按修改时间倒序排序
    fileDetails.sort((a: any, b: any) => b.mtime - a.mtime);
    return fileDetails;
  }

  basename(path: string) {

    return this._path.basename(path);
  }

  parent(path: string) {
    return this._path.dirname(path);
  }

  del(path: string) {
    if (this.exists(path))
      this.fs.rmdirSync(path, {recursive: true});
  }

  zip(zipName: string, saveFolder: string, backupFolder: string): Observable<void> {
    let zipPath = `${backupFolder}/${zipName}`;
    let zl = nw.require('zip-lib');
    console.log('zip saveFolder', saveFolder);
    console.log('zip basename', this.basename(saveFolder));
    console.log('zip backupFolder', backupFolder);
    console.log('zip zipPath', zipPath);
    return new Observable<void>(subscriber => {

      const zip = new zl.Zip();
      zip.addFolder(saveFolder, this.basename(saveFolder));
      zip.archive(zipPath).then(() => {
        subscriber.next();
        subscriber.complete();
      });

    });
  }
}
