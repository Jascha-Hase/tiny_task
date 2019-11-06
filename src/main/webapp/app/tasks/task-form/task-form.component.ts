import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Task } from '../task';
import { TaskService } from '../task.service';
import { LocalTaskService } from '../local-task.service';

/**
 * A form to create tiny tasks.
 */
@Component({
  selector: 'tiny-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent {

  startDate = new Date();
  @Output() created: EventEmitter<Task> = new EventEmitter();
  @Output() deleted: EventEmitter<Task> = new EventEmitter();

  taskForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    dueDate: new FormControl('', Validators.required)
  });

  constructor(@Inject('TaskService') private taskService: TaskService) { }

  addTaskButton(): void {
    this.taskService.create(this.taskForm.value.name, this.taskForm.value.dueDate).subscribe(task => {
      this.created.emit(task);
      this.taskForm.reset();
    });
  }
  deleteDone(){
    this.taskService.deleteAllDoneTasks().subscribe(() => {
      this.deleted.emit();
    });
  }
}
