import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { TaskService } from '../task.service';
import { TaskListComponent } from './task-list.component';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      providers: [{
        provide: 'TaskService',
        useValue: jasmine.createSpyObj('taskService', ['delete', 'setDone'])
      }]
    }).overrideTemplate(TaskListComponent, '')
      .compileComponents();

    taskService = TestBed.get('TaskService');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a task', () => {
    // given
    taskService.delete.and.returnValue(of(null));

    // when
    component.delete({ id: 'id', name: 'My task', dueDate: new Date, done: false });

    // then
    expect(taskService.delete).toHaveBeenCalledWith('id');
  });

  it('should emit the task after deletion', () => {
    // given
    const date = new Date();
    taskService.delete.and.returnValue(of(null));
    const deleteEmitter = spyOn(component.deleted, 'emit');

    // when
    component.delete({ id: 'id', name: 'My task', dueDate: date, done: false });

    // then
    expect(deleteEmitter).toHaveBeenCalledWith({ id: 'id', name: 'My task', dueDate: date, done: false });
  });

  it('should setdone task', () => {
    // given
    taskService.setDone.and.returnValue(of(null));

    // when
    component.setDone({ id: 'id', name: 'My task', dueDate: new Date, done: false });

    // then
    expect(taskService.setDone).toHaveBeenCalledWith('id');
  });

  it('should emit the done task', () => {
    // given
    const date = new Date();
    taskService.setDone.and.returnValue(of(null));
    const doneEmitter = spyOn(component.updated, 'emit');

    // when
    component.setDone({ id: 'id', name: 'My task', dueDate: date, done: false });

    // then
    expect(doneEmitter).toHaveBeenCalledWith({ id: 'id', name: 'My task', dueDate: date, done: false });
  });
});
