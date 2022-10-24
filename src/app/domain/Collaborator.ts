import { User } from "./User";

export class Collaborator extends User {
  private readonly managerId: string;

  constructor(
    id: string, 
    name: string, 
    email: string, 
    password: string, 
    isManager: boolean,
    managerId: string,
  ) {
    super(id, name, email, password, isManager);
    this.managerId = managerId;
  }

  public getManagerId(): string {
    return this.managerId;
  }
}