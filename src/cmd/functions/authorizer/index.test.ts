import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { handler } from '.';

jest.mock('~/controllers/authorizer');

describe('authorize customer handler', () => {
  it('should call authorize customer controller', async () => {
    const event = mock<APIGatewayRequestAuthorizerEvent>();

    await handler(event);
  });
});
