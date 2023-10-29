export namespace SystemAction {
  export class Copy {
    static readonly type = `复制文本`;

    constructor(public text: string) {
    }
  }

  export class SaveTempData {
    static readonly type = `保存临时数据`;

    constructor(public data: any) {
    }
  }

  export class SetSaveFolder {
    static readonly type = `设置存档路径`;

    constructor(public path: any) {
    }
  }

  export class SetBackupFolder {
    static readonly type = `设置备份路径`;

    constructor(public path: any) {
    }
  }

  export class Backup {
    static readonly type = `立即备份`;
  }

  export class LoadBackupList {
    static readonly type = `读取备份列表`;
  }

  export class Revert {
    static readonly type = `立即还原`;

    constructor(public path: any) {
    }
  }

}
