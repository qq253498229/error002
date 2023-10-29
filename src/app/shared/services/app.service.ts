import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Observable } from 'rxjs';
import * as archiver from 'archiver';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  fs!: typeof fs;
  os!: typeof os;
  path!: typeof path;
  archiver!: typeof archiver;

  constructor() {
    this.fs = nw.require('fs');
    this.os = nw.require('os');
    this.path = nw.require('path');
    this.archiver = nw.require('archiver');
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
      return this.fs.statSync(this.path.join(folder, item)).isFile();
    });
    // 创建一个包含文件名和修改时间的数组
    const fileDetails = files.map(file => {
      const filePath = this.path.join(folder, file);
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
    return this.path.basename(path);
  }

  parent(path: string) {
    return this.path.dirname(path);
  }

  del(path: string) {
    if (this.exists(path))
      this.fs.rmdirSync(path, {recursive: true});
  }

  zip(zipName: string, saveFolder: string, backupFolder: string): Observable<void> {
    let zipPath = `${backupFolder}/${zipName}`;
    return new Observable<void>(subscriber => {
      // 创建一个可写流，将压缩文件保存到指定路径
      const output = this.fs.createWriteStream(zipPath);

      // 创建一个 archiver 实例
      const archive = this.archiver('zip', {
        zlib: {level: 9}, // 设置压缩级别
      });
      // 将可写流连接到 archiver
      archive.pipe(output);

      // 将源文件夹添加到压缩文件中
      archive.directory(saveFolder, this.basename(saveFolder));

      // 完成压缩并关闭可写流
      archive.finalize();

      // 监听完成事件
      archive.on('end', () => {
        subscriber.next();
        // subscriber.complete();
      });

      // 处理错误
      archive.on('error', (e: any) => {
        subscriber.error(e);
        // subscriber.complete();
      });
    });
  }
}
