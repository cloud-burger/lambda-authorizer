import {
  AuthorizeController,
  AuthorizeRequest,
  AuthorizeResponse,
} from '@cloud-burger/handlers';
import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';

export class AuthorizeCustomerController {
  constructor(
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  handler: AuthorizeController = async (
    event: AuthorizeRequest,
  ): Promise<AuthorizeResponse> => {
    const documentNumber = event.headers['x-identification'];

    if (documentNumber) {
      await this.findCustomerByDocumentNumberUseCase.execute({
        documentNumber,
      });

      return {
        principalId: documentNumber,
      };
    }
  };
}
