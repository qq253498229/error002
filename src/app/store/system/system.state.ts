import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { SystemAction } from './system.action';
import { Clipboard } from '@angular/cdk/clipboard';
import { AppService } from '../../shared/services/app.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { mergeMap, tap } from 'rxjs';

export interface SystemStateModel {
  /**
   * 临时数据
   */
  tempData?: any;
  saveFolder: string;
  saveFolderFlag: boolean;
  backupFolder: string;
  backupFolderFlag: boolean;
  list: any;
}

@State<SystemStateModel>({
  name: 'system',
  defaults: {
    saveFolder: 'C:\\Users\\Administrator\\AppData\\LocalLow\\Eleventh Hour Games\\Last Epoch\\Saves',
    saveFolderFlag: false,
    backupFolder: '',
    backupFolderFlag: false,
    list: [],
  },
})
@Injectable({
  providedIn: 'root',
})
export class SystemState {

  constructor(
      private clipboard: Clipboard,
      private service: AppService,
      private message: NzMessageService,
  ) {
  }

  @Action(SystemAction.SaveTempData)
  saveTempData(ctx: StateContext<SystemStateModel>, {data}: SystemAction.SaveTempData) {
    ctx.patchState({tempData: data});
  }

  @Action(SystemAction.Copy)
  copyText(ctx: StateContext<SystemStateModel>, data: SystemAction.Copy) {
    this.clipboard.copy(data.text);
  }

  @Action(SystemAction.SetSaveFolder)
  SetSaveFolder(ctx: StateContext<SystemStateModel>, {path}: SystemAction.SetSaveFolder) {
    if (this.service.checkPath(path)) {
      ctx.patchState({saveFolder: path, saveFolderFlag: true});
      this.message.success(`设置成功！`);
    } else {
      this.message.error(`找不到这个目录`);
    }
  }

  @Action(SystemAction.SetBackupFolder)
  SetBackupFolder(ctx: StateContext<SystemStateModel>, {path}: SystemAction.SetBackupFolder) {
    if (this.service.checkPath(path)) {
      ctx.patchState({backupFolder: path, backupFolderFlag: true});
      this.message.success(`设置成功！`);
    } else {
      this.message.error(`找不到这个目录`);
    }
    return ctx.dispatch(new SystemAction.LoadBackupList());
  }

  @Action(SystemAction.Backup)
  Backup(ctx: StateContext<SystemStateModel>) {
    let state = ctx.getState();
    const datePipe = new DatePipe('en-US');
    const currentDate = new Date();
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd-HH-mm-ss');
    const zipName = `backup-${formattedDate}.zip`;
    return this.service.zip(zipName, state.saveFolder, state.backupFolder).pipe(tap(() => {
      this.message.success(`备份完成！`);
    }), mergeMap(() => ctx.dispatch(new SystemAction.LoadBackupList())));
  }

  @Action(SystemAction.LoadBackupList)
  LoadBackupList(ctx: StateContext<SystemStateModel>) {
    let state = ctx.getState();
    let list = this.service.listFile(state.backupFolder);
    ctx.patchState({list});
  }

  @Action(SystemAction.Revert)
  Revert(ctx: StateContext<SystemStateModel>, {path}: SystemAction.Revert) {
    let state = ctx.getState();
    let zipName = `${state.backupFolder}/${path}`;
    this.service.del(state.saveFolder);
    let AdmZip = nw.require('adm-zip');
    new AdmZip(zipName).extractAllTo(this.service.parent(state.saveFolder), true);
  }
}
