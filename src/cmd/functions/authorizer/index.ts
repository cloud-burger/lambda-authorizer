import { LambdaApiHandler } from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AuthorizerController } from '~/controllers/authorizer';

let authorizerController: AuthorizerController;
let lambdaHandler: LambdaApiHandler;

const setDependencies = () => {
  authorizerController = new AuthorizerController();
  lambdaHandler = new LambdaApiHandler(authorizerController.handler);
};

export const handler = async (event: APIGatewayProxyEvent) => {
  logger.setEvent('self-service', event);
  logger.debug({
    message: 'Event received',
    data: event,
  });
  setDependencies();

  return await lambdaHandler.handler(event);
};
