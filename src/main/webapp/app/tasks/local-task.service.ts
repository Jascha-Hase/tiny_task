import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { Task } from './task';
import { TaskService } from './task.service';

@Injectable()
export class LocalTaskService implements TaskService {

  private static readonly STORAGE_KEY: string = 'tiny.tasks';

  getAll(): Observable<Task[]> {
    return of(this.readTasks());
  }

  create(name: string, dueDate: Date): Observable<Task> {
    const tasks = this.readTasks();
    const task = { id: uuid(), name, done: false, dueDate };
    tasks.push(task);
    this.writeTasks(tasks);
    return of(task);
  }

  delete(id: string): Observable<void> {
    const tasks = this.readTasks();
    this.writeTasks(tasks.filter(task => task.id !== id));
    return of(null);
  }

  deleteAllDoneTasks(): Observable<void> {
    const tasks = this.readTasks();
    const doneTasks = tasks.filter((task) => !task.done)
    this.writeTasks(doneTasks);
    return of(null);
  }

  private readTasks(): Task[] {
    const tasksJson = localStorage.getItem(LocalTaskService.STORAGE_KEY);
    const tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    return tasks.map(task => {
      return {...task, dueDate: task.dueDate ? new Date(task.dueDate) : null}
    })

  }

  private writeTasks(tasks: Task[]): void {
    let sortedTaksByDate = this.sortDates(tasks);
    sortedTaksByDate.sort(this.sortTasks);
    localStorage.setItem(LocalTaskService.STORAGE_KEY, JSON.stringify(sortedTaksByDate));
  }

  private sortTasks(a: Task, b: Task) {
    return (a.done === b.done) ? 0 : a.done ? 1 : -1;
  }
  public sortDates(tasks) {
      const tasksWithoutDueDate = tasks.filter(d => !d.dueDate);
      let tasksWithDueDate = tasks.filter(d => d.dueDate);
      tasksWithDueDate = tasksWithDueDate.sort(
        (a, b) => {
          return (a.dueDate === b.dueDate) ? 0 : a.dueDate < b.dueDate ? 1 : -1;
        }
      );
      tasks = [...tasksWithDueDate, ...tasksWithoutDueDate];
      return tasks;
  }

  setDone(id: String): Observable<void> {
    const tasks = this.readTasks();
    const task = tasks.find(taskItem => taskItem.id === id);
    if (task !== undefined) {
      task.done = true;
      this.writeTasks(tasks);
    }
    return of(null);
  }

}
