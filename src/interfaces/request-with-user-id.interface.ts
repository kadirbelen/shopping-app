import { Request } from 'express';

export default interface IRequestWithUserId extends Request {
  userId: number;
}
