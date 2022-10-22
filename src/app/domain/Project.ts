export class Project {
  private readonly id: string;
  private title: string;
  private description: string;
  private deadline: Date;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private finished: boolean;
  private readonly managerId: string;

  constructor(
    id: string, 
    title: string, 
    description: string, 
    deadline: Date, 
    createdAt: Date, 
    updatedAt: Date, 
    finished: boolean, 
    managerId: string
) {
    this.id = id
    this.title = title
    this.description = description
    this.deadline = deadline
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.finished = finished
    this.managerId = managerId
  }

    public getId(): string {
      return this.id;
    }

    public getTitle(): string {
      return this.title;
    }

    public setTitle(title: string): void {
      this.title = title;
    }

    public getDescription(): string {
      return this.description;
    }

    public setDescription(description: string): void {
      this.description = description;
    }

    public getDeadline(): Date {
      return this.deadline;
    }

    public setDeadline(deadline: Date): void {
      this.deadline = deadline;
    }

    public getCreatedAt(): Date {
      return this.createdAt;
    }

    public getUpdatedAt(): Date {
      return this.updatedAt;
    }

    public setUpdatedAt(updatedAt: Date): void {
      this.updatedAt = updatedAt;
    }

    public isFinished(): boolean {
      return this.finished;
    }

    public setFinished(finished: boolean): void {
      this.finished = finished;
    }

    public getManagerId(): string {
      return this.managerId;
    }
}