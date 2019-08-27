export class OsUtil {

  private static readonly illegalRe: RegExp = /[\/\?<>\\:\*\|"]/g;
  private static readonly controlRe: RegExp = /[\x00-\x1f\x80-\x9f]/g;
  private static readonly reservedRe: RegExp = /^\.+$/;
  private static readonly windowsReservedRe: RegExp = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  private static readonly windowsTrailingRe: RegExp = /[\. ]+$/;
  private static readonly replaceWith: string = '';

  public static getHomePath(): string {
    if (process.platform === 'win32') {
      return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || process.env.HOME;
    } else {
      return process.env.HOME;
    }
  }

  public static sanitize( input: string): string {
    return input
    .replace(this.illegalRe, this.replaceWith)
    .replace(this.controlRe, this.replaceWith)
    .replace(this.reservedRe, this.replaceWith)
    .replace(this.windowsReservedRe, this.replaceWith)
    .replace(this.windowsTrailingRe, this.replaceWith);
  }
}
