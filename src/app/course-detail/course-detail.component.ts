import {Component, OnInit} from '@angular/core';
import {UdemyService} from '../shared/service/udemy.service';
import {ActivatedRoute} from '@angular/router';
import {CourseBlock} from '../shared/model/course-block.model';

@Component({
  selector: 'zc-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  items: Array<CourseBlock>;

  constructor(
      private readonly udemyService: UdemyService,
      private readonly route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.udemyService.getCourse(params.id)
      .subscribe(value => {
        this.items = value.results;
      });
    });
  }

}
