import { AuthorizerHandler } from '@cloud-burger/handlers';
import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { AuthorizeCustomerController } from '~/controllers/authorizer';
import { CustomerRepository } from '~/infrastructure/database/customer/customer-repository';
import Connection from '~/infrastructure/postgres/connection';
import Pool from '~/infrastructure/postgres/pool';
import { PoolFactory } from '~/infrastructure/postgres/pool-factory';

let pool: Pool;
let customerRepository: CustomerRepository;
let findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase;
let authorizeCustomerController: AuthorizeCustomerController;
let authorizeHandler: AuthorizerHandler;

const setDependencies = (connection: Connection) => {
  customerRepository = new CustomerRepository(connection);
  findCustomerByDocumentNumberUseCase = new FindCustomerByDocumentNumberUseCase(
    customerRepository,
  );
  authorizeCustomerController = new AuthorizeCustomerController(
    findCustomerByDocumentNumberUseCase,
  );
  authorizeCustomerController = new AuthorizeCustomerController(
    findCustomerByDocumentNumberUseCase,
  );
  authorizeHandler = new AuthorizerHandler(authorizeCustomerController.handler);
};

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();

  setDependencies(connection);

  try {
    return await authorizeHandler.handler(event);
  } finally {
    connection.release();
  }
};
