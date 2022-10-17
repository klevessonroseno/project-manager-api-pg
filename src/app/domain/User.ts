export abstract class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private password: string;

  constructor(
    id: string,
    name: string, 
    email: string, 
    password: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
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
}