import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';


@Injectable()
export class TasksService {
    constructor(
      @InjectRepository(TaskRepository)
      private readonly taskRepository: TaskRepository
    ) {}
    // private tasks: Task[] = []
    //
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find();
    }
    //
    // getTaskById(id: string): Task {
    //     return this.tasks.find( task => task.id === id)
    // }

    async getTaskById(id: number): Promise<Task> {
        const found  = await this.taskRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`)
        }
        return found;
    }

    //
    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;
    //
    //     const task: Task = {
    //         id : uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }
    //
    //     this.tasks.push(
    //         task
    //     )
    //
    //     return task;
    // }

     createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return  this.taskRepository.createTask(createTaskDto);
     }


    // deleteTaskById(id: string): Task {
    //     const t = this.tasks.find( task => task.id === id)
    //
    //     this.tasks = this.tasks.filter( task => task.id !== t.id)
    //
    //     return t
    // }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete({id: id});
        if (result.affected === 0 ) {
            throw new NotFoundException(`No task could be deleted with ${id}`)
        }
        return;
    }

    // updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    //     const foundIndex = this.tasks.findIndex( task => task.id === id);
    //
    //     this.tasks[foundIndex].status = updateTaskStatusDto.status;
    //
    //     return this.tasks[foundIndex];
    //
    // }

    async updateTaskStatus(id: number, updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task> {
        const { status } = updateTaskStatusDto

        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }
}
