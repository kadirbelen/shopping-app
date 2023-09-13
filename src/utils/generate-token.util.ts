import jwt from 'jsonwebtoken';

import tokenService from '../services/token.service';

export const generateToken = async (userId: number) => {
  const payload = { _id: userId };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN as string, {
    expiresIn: '1h',
  });

  const result = await tokenService.upsert(userId, accessToken);

  return result.token;
};
