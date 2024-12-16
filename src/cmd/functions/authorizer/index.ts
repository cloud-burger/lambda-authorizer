import { APIGatewayRequestAuthorizerEvent,  } from 'aws-lambda';
import { AuthorizerController } from '~/controllers/authorizer';
import { PoolFactory } from '~/infrastructure/postgres/pool-factory';
import Pool from '~/infrastructure/postgres/pool';
import Connection from '~/infrastructure/postgres/connection';
import { CustomerRepository } from '~/infrastructure/database/customer/customer-repository';
import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';

let pool: Pool;
let authorizerController: AuthorizerController;
let customerRepository: CustomerRepository;
let findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase;

const setDependencies = (connection: Connection) => {
  customerRepository = new CustomerRepository(connection);
  findCustomerByDocumentNumberUseCase = new FindCustomerByDocumentNumberUseCase(
    customerRepository,
  );
  authorizerController = new AuthorizerController(findCustomerByDocumentNumberUseCase);
};

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  pool = await PoolFactory.getPool();
  const connection = await pool.getConnection();
    
  setDependencies(connection);

  return await authorizerController.handler(event);
};
