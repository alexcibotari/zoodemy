import {Lecture} from './lecture.model';
import {Chapter} from './chapter.model';
import {Quiz} from './quiz.model';

export type CourseBlock = Lecture | Chapter | Quiz;
