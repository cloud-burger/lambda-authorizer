import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import Connection from '~/infrastructure/postgres/connection';
import Pool from '~/infrastructure/postgres/pool';
import { PoolFactory } from '~/infrastructure/postgres/pool-factory';
import { handler } from '.';

jest.mock('~/infrastructure/postgres/connection');
jest.mock('~/infrastructure/postgres/pool');
jest.mock('~/infrastructure/postgres/pool-factory');
jest.mock('~/controllers/authorizer');

describe('authorize customer handler', () => {
  const poolFactoryMock = jest.mocked(PoolFactory);
  it('should call authorize customer controller', async () => {
    const dbClientMock = mock<Pool>();

    poolFactoryMock.getPool.mockResolvedValue(dbClientMock);
    dbClientMock.getConnection.mockResolvedValue(mock<Connection>());

    const event = mock<APIGatewayRequestAuthorizerEvent>();

    await handler(event);
  });
});
