import { AuthorizerHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { AuthorizeCustomerController } from '~/controllers/authorizer';
import { CustomerRepository } from '~/infrastructure/database/customer/customer-repository';
import { env } from '~/infrastructure/env';

let customerRepository: CustomerRepository;
let findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase;
let authorizeCustomerController: AuthorizeCustomerController;
let authorizeHandler: AuthorizerHandler;

const setDependencies = () => {
  customerRepository = new CustomerRepository(env.DYNAMO_TABLE_CUSTOMERS);
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
  logger.debug({
    message: 'Event received',
    data: event,
  });

  setDependencies();

  return await authorizeHandler.handler(event);
};
