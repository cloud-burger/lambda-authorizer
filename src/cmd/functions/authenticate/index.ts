import { LambdaApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthenticateController } from '~/controllers/authenticate';
import { CustomerRepository } from '~/infrastructure/database/customer/customer-repository';
import Connection from '~/infrastructure/postgres/connection';
import Pool from '~/infrastructure/postgres/pool';
import { PoolFactory } from '~/infrastructure/postgres/pool-factory';

let pool: Pool;
let customerRepository: CustomerRepository;
let authenticateController: AuthenticateController;
let lambdaHandler: LambdaApiHandler;

const setDependencies = (connection: Connection) => {
  customerRepository = new CustomerRepository(connection);
  authenticateController = new AuthenticateController(customerRepository);
  lambdaHandler = new LambdaApiHandler(authenticateController.handler);
};

export const handler = async (event: APIGatewayProxyEvent) => {
  logger.setEvent('self-service', event);
  logger.debug({
    message: 'Event received',
    data: event,
  });

  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await lambdaHandler.handler(event);
  } finally {
    connection.release();
  }
};
