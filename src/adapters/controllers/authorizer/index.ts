import {
  AuthorizeController,
  AuthorizeRequest,
  AuthorizeResponse,
} from '@cloud-burger/handlers';
import logger from '@cloud-burger/logger';
import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';

export class AuthorizeCustomerController {
  constructor(
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  handler: AuthorizeController = async (
    request: AuthorizeRequest,
  ): Promise<AuthorizeResponse> => {
    logger.info({
      message: 'Authorize user request',
      data: request,
    });

    const documentNumber = request.headers['x-identification'];

    const isUserIdentified = documentNumber !== 'not-identified';

    if (isUserIdentified) {
      const customer = await this.findCustomerByDocumentNumberUseCase.execute({
        documentNumber,
      });

      logger.info({
        message: 'Authorize user response',
        data: {
          customer,
          documentNumber,
        },
      });

      return {
        principalId: documentNumber,
      };
    }
  };
}
