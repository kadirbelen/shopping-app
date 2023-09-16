import { ApiError } from '../../../../src/responses/errors/api.error';

describe('ApiError', () => {
  it('should create JSON representation of ApiError', () => {
    const errorMessage = 'Test error message';
    const statusCode = 404;

    const apiError = new ApiError(errorMessage, statusCode);
    const jsonRepresentation = apiError.toJSON();

    expect(jsonRepresentation).toEqual({
      errors: [
        {
          message: errorMessage,
        },
      ],
      success: false,
      statusCode: statusCode,
    });
  });

  it('should create default JSON representation if no message provided', () => {
    const statusCode = 500;

    const apiError = new ApiError('', statusCode);
    const jsonRepresentation = apiError.toJSON();

    expect(jsonRepresentation).toEqual({
      errors: [
        {
          message: 'Something went wrong',
        },
      ],
      success: false,
      statusCode: statusCode,
    });
  });
});
