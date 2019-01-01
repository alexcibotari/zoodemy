export class DownloadProgress {
  constructor(
      public totalFiles: number = 0,
      public currentFile: number = 0,
      public error: boolean = false
  ) {

  }

  get percentageDecimal(): number {
    return this.currentFile / this.totalFiles;
  }

  get percentage(): number {
    return this.percentageDecimal * 100;
  }

  get isDone(): boolean {
    return this.totalFiles === this.currentFile;
  }
}
