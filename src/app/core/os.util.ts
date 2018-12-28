export class OsUtil {
  public static getHomePath(): string {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || process.env.HOME;
    } else {
      return process.env.HOME;
    }
  }
}
