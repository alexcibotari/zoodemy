export interface User {
  _class: string;
  id: number;
  /**
   * Full name of the user
   */
  title: string;
  /**
   * Name of the user
   */
  name: string;
  display_name: string;
  /**
   * Job title of the user
   */
  job_title: string;
  /**
   * User image, dimensions 50x50
   */
  image_50x50: string;
  /**
   * User image, dimensions 100x100
   */
  image_100x100: string;
  initials: string;
  /**
   * Absolute URL of the user profile page
   */
  url: string;
  /**
   * Whether the user is anonymous
   */
  is_generated?: boolean;
  access_token?: string;
}
