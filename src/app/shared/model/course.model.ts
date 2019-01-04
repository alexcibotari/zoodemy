import {PriceDetail} from './price-detail.model';
import {User} from './user.model';

export interface Course {
  _class: string;
  id: number;
  /**
   * Title of the course
   */
  title: string;
  /**
   * URL of the course dashboard page
   */
  url: string;
  /**
   * Whether the course is paid. Note that Udemy has both free and paid courses
   */
  is_paid: boolean;
  /**
   * How much the course costs
   */
  price: string;
  price_detail: PriceDetail;
  /**
   * An array of user objects which state the instructors of the course. Note that Udemy courses may have multiple instructors
   */
  visible_instructors: User[];
  /**
   * Course image, dimensions 125_H
   */
  image_125_H: string;
  /**
   * Course image, dimensions 240x135
   */
  image_240x135: string;
  is_practice_test_course: boolean;
  /**
   * Course image, dimensions 480x270
   */
  image_480x270: string;
  published_title: string;
  completion_ratio: number;
}
