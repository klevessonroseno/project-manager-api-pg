declare namespace Express {
  interface Request {
    manager: {
      id: string;
      name: string;
      email: string;
    };
  };
}