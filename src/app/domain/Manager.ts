import { User } from "./User";

export class Manager extends User {
  constructor(
    id: string, 
    name: string, 
    email: string, 
    password: string,
  ) {
    super(id, name, email, password, true);
  }
}