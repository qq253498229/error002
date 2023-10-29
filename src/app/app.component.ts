import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SystemSelector } from './store/system/system.selector';
import { SystemAction } from './store/system/system.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  list: any = [];
  saveFolder = '';
  saveFolderFlag = false;
  backupFolder = '';
  backupFolderFlag = false;
  backupLoading = false;
  revertLoading = false;

  constructor(
      private store: Store,
  ) {
    this.store.select(SystemSelector.saveFolder).subscribe(r => this.saveFolder = r);
    this.store.select(SystemSelector.backupFolder).subscribe(r => this.backupFolder = r);
    this.store.select(SystemSelector.saveFolderFlag).subscribe(r => this.saveFolderFlag = r);
    this.store.select(SystemSelector.backupFolderFlag).subscribe(r => this.backupFolderFlag = r);
    this.store.select(SystemSelector.list).subscribe(r => this.list = r);
  }

  ngOnInit() {
    this.store.dispatch(new SystemAction.LoadBackupList());
  }

  setSaveFolder() {
    this.store.dispatch(new SystemAction.SetSaveFolder(this.saveFolder));
  }

  setBackupFolder() {
    this.store.dispatch(new SystemAction.SetBackupFolder(this.backupFolder));
  }

  backup() {
    if (this.backupLoading) return;
    this.backupLoading = true;
    this.store.dispatch(new SystemAction.Backup()).subscribe(() => this.backupLoading = false);
  }

  revert(data: any) {
    if (this.revertLoading) return;
    this.revertLoading = true;
    this.store.dispatch(new SystemAction.Revert(data)).subscribe(() => this.revertLoading = false);
  }
}
