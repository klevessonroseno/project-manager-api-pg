export class Collaborator {
  constructor(
    public id: number, 
    public name: string, 
    public email: string, 
    public password: string, 
    public userId: string
    ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.userId = userId;
  }
}