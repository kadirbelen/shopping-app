import { ZodError } from 'zod';

import { registerSchema } from '../../../src/validations/user.validation';

describe('userValidationSchema', () => {
  const validPayload = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Passw0rd$',
  };

  describe('registerSchema', () => {
    it('should validate when valid register payload', () => {
      const validationResult = registerSchema.parse(validPayload);

      expect(validationResult).toEqual(validPayload);
    });

    it('should throw error when firstName is missing', () => {
      expect(() => registerSchema.parse({ ...validPayload, firstName: undefined })).toThrowError(ZodError);
    });

    it('should throw error when firstName include more than 255 characters', () => {
      expect(() => registerSchema.parse({ ...validPayload, firstName: 'a'.repeat(256) })).toThrowError(ZodError);
    });

    it('should throw error when lastName is missing', () => {
      expect(() => registerSchema.parse({ ...validPayload, lastName: undefined })).toThrowError(ZodError);
    });

    it('should throw error when lastName include more than 255 characters', () => {
      expect(() => registerSchema.parse({ ...validPayload, lastName: 'a'.repeat(256) })).toThrowError(ZodError);
    });

    it('should throw error when email is not valid', () => {
      expect(() => registerSchema.parse({ ...validPayload, email: 'invalid-email' })).toThrowError(ZodError);
    });

    it('should throw error when password include less than 8 characters', () => {
      expect(() => registerSchema.parse({ ...validPayload, password: 'a'.repeat(4) })).toThrowError(ZodError);
    });
  });
});
