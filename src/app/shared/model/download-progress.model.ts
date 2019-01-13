export class DownloadProgress {
  constructor(
      public total: number = 0,
      public downloaded: number = 0,
      public errors: number = 0
  ) {

  }

  get percentageDecimal(): number {
    return this.downloaded / this.total;
  }

  get percentage(): number {
    return this.percentageDecimal * 100;
  }

  get isDone(): boolean {
    return this.total > 1 && this.total === (this.downloaded + this.errors);
  }
}
