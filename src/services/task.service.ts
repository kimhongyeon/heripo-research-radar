import type { TaskService as CoreTaskService } from '@llm-newsletter-kit/core';

import type { TaskRepository } from '../types/dependencies';

/**
 * Task service implementation
 * - Manages newsletter generation task lifecycle (start/end)
 * - Prevents duplicate execution
 */
export class TaskService implements CoreTaskService<number> {
  private currentTaskId: number | null = null;

  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * Start a new task
   * @throws Error if a task is already running
   * @returns Task ID
   */
  async start(): Promise<number> {
    if (this.currentTaskId !== null) {
      throw new Error('Task is already running');
    }

    const taskId = await this.taskRepository.createTask();
    this.currentTaskId = taskId;

    return taskId;
  }

  /**
   * End the current task
   * @throws Error if no task is running
   */
  async end(): Promise<void> {
    if (this.currentTaskId === null) {
      throw new Error('No task is running');
    }

    await this.taskRepository.completeTask(this.currentTaskId);
    this.currentTaskId = null;
  }
}
