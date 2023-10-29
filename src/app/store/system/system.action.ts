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
}
