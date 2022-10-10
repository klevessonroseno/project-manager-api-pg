import { Request } from 'express';
import { SigningKeyCallback } from 'jsonwebtoken';

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface ICollaborators {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  userId?: string;
}

export interface IRequest extends Request {
  userId?: string;
  userName?: string;
}

export interface ISigningKeyCallback extends SigningKeyCallback {
  userId?: string;
  userName?: string;
}