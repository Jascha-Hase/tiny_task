import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import { Task } from '../task';
import { TaskService } from '../task.service';
/**
 * A list of tiny tasks.
 */
@Component({
  selector: 'tiny-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  public searchText : string;
  @Input() tasks: Task[];
  @Output() deleted: EventEmitter<Task> = new EventEmitter();
  @Output() updated: EventEmitter<Task> = new EventEmitter();


  constructor(@Inject('TaskService') private taskService: TaskService) {
  }

  delete(task: Task): void {
    this.taskService.delete(task.id).subscribe(() => {
      this.deleted.emit(task);
    });
  }
  markTaskDone(task: Task): void {
    this.taskService.markTaskDone(task).subscribe(() => {
      this.updated.emit(task);
    });
  }

  setDone(task: Task): void {
    this.taskService.setDone(task).subscribe(() => {
      this.updated.emit(task);
    })
  }
}
