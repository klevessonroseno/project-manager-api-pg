import { Services } from "./Services";

class CollaboratorsServices extends Services {
  generatePassword(): string {
    return Math.random().toString(36).slice(-8);
  }
}

export default new CollaboratorsServices();