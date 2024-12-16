import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';
import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { generatePolicy } from 'cmd/functions/authorizer/policy';

export class AuthorizerController {
  constructor(
    private findCustomerByDocumentNumberUseCase: FindCustomerByDocumentNumberUseCase,
  ) {}

  handler = async (event: APIGatewayRequestAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    const methodArn = event.methodArn;
    const headers = event.headers || {};

    if (headers['x-identification']) {
      const documentNumber = headers['x-identification'];
      
      try {
        const customer = await this.findCustomerByDocumentNumberUseCase.execute({
          documentNumber,
        });

        return generatePolicy(documentNumber, 'Allow', methodArn);        
      } catch (error) {
        return generatePolicy(documentNumber, 'Deny', methodArn);
      }

    }

    return generatePolicy('not-identified', 'Allow', methodArn);
  };
}
