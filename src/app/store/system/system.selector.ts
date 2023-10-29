import { Selector } from '@ngxs/store';
import { SystemState, SystemStateModel } from './system.state';

export class SystemSelector {
  @Selector([SystemState])
  static tempData({tempData}: SystemStateModel) {
    return tempData;
  }

  @Selector([SystemState])
  static saveFolder({saveFolder}: SystemStateModel) {
    return saveFolder;
  }

  @Selector([SystemState])
  static backupFolder({backupFolder}: SystemStateModel) {
    return backupFolder;
  }

  @Selector([SystemState])
  static saveFolderFlag({saveFolderFlag}: SystemStateModel) {
    return saveFolderFlag;
  }

  @Selector([SystemState])
  static backupFolderFlag({backupFolderFlag}: SystemStateModel) {
    return backupFolderFlag;
  }

  @Selector([SystemState])
  static list({list}: SystemStateModel) {
    return list;
  }
}
