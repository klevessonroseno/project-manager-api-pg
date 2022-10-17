import { User } from "./User";

export class Collaborator extends User {
  private readonly managerId: string;

  constructor(
    id: string, 
    name: string, 
    email: string, 
    password: string, 
    managerId: string,
  ) {
    super(id, name, email, password);
    this.managerId = managerId;
  }

  public getManagerId(): string {
    return this.managerId;
  }
}