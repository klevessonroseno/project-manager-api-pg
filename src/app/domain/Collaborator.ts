import { v4 as uuidv4 } from "uuid";

export class Collaborator {
  private readonly id: string; 
  private name: string; 
  private email: string; 
  private password: string; 
  private readonly userId: string;

  constructor( 
    id: string,
    name: string, 
    email: string, 
    password: string, 
    userId: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.userId = userId;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getUserId(): string {
    return this.userId;
  }
}