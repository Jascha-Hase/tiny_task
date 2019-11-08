import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';

import { TaskService } from '../task.service';
import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      providers: [{
        provide: 'TaskService',
        useValue: jasmine.createSpyObj('taskService', ['create', 'deleteAllDoneTasks'])
      }]
    }).overrideTemplate(TaskFormComponent, '')
      .compileComponents();

    taskService = TestBed.get('TaskService');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate a task', () => {
    expect(component.taskForm.invalid).toBe(true);
    component.taskForm.setValue({ name: 'My task', dueDate: new Date() });
    expect(component.taskForm.invalid).toBe(false);
  });

  it('should create a task', () => {
    // given
    const date = new Date();
    component.taskForm.setValue({ name: 'My task', dueDate: date });
    taskService.create.and.returnValue(of({ id: 'id', name: 'My task', dueDate: date, done: false }));

    // when
    component.addTaskButton();

    // then
    expect(taskService.create).toHaveBeenCalledWith('My task', date);
  });

  it('should emit the task after creation', () => {
    // given
    const date = new Date();
    component.taskForm.setValue({ name: 'My task', dueDate: date });
    taskService.create.and.returnValue(of({ id: 'id', name: 'My task', dueDate: date, done: false }));
    const createEmitter = spyOn(component.created, 'emit');
    
    // when
    component.addTaskButton();

    // then
    expect(createEmitter).toHaveBeenCalledWith({ id: 'id', name: 'My task', dueDate: date, done: false });
  });

  it('should reset the form after creation', () => {
    // given
    const date = new Date();
    component.taskForm.setValue({ name: 'My task', dueDate: date });
    taskService.create.and.returnValue(of({ id: 'id', name: 'My task', dueDate: date, done: false }));
    const formReset = spyOn(component.taskForm, 'reset');

    // when
    component.addTaskButton();

    // then
    expect(formReset).toHaveBeenCalled();
  });
  it('should delete a task', () => {
    // given
    taskService.deleteAllDoneTasks.and.returnValue(of(undefined));

    // when
    component.deleteDone();

    // then
    expect(taskService.deleteAllDoneTasks).toHaveBeenCalled();
  });
  it('should emit the deleted tasks', () => {
    // given
    taskService.deleteAllDoneTasks.and.returnValue(of(undefined));
    const deleteEmitter = spyOn(component.deleted, 'emit');
    
    // when
    component.deleteDone();

    // then
    expect(deleteEmitter).toHaveBeenCalled();
  });
});
