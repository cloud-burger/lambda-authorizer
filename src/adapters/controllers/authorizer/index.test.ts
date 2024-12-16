import { FindCustomerByDocumentNumberUseCase } from 'application/use-cases/customer/find-by-document-number';
import { mock, MockProxy } from 'jest-mock-extended';
import { makeCustomer } from 'tests/factories/make-customer';
import { AuthorizeCustomerController } from '.';

describe('authorize customer controller', () => {
  let findCustomerByDocumentNumberUseCase: MockProxy<FindCustomerByDocumentNumberUseCase>;
  let authorizeCustomerController: AuthorizeCustomerController;

  beforeAll(() => {
    findCustomerByDocumentNumberUseCase = mock();
    authorizeCustomerController = new AuthorizeCustomerController(
      findCustomerByDocumentNumberUseCase,
    );
  });

  it('should find customer by document number successfully', async () => {
    findCustomerByDocumentNumberUseCase.execute.mockResolvedValue(
      makeCustomer({
        createdAt: new Date('2024-07-12T22:18:26.351Z'),
        updatedAt: new Date('2024-07-12T22:18:26.351Z'),
      }),
    );

    const response = await authorizeCustomerController.handler({
      headers: {
        'x-identification': '1234567890',
      },
      methodArn: 'method-arn',
      type: 'REQUEST',
    });

    expect(findCustomerByDocumentNumberUseCase.execute).toHaveBeenNthCalledWith(
      1,
      { documentNumber: '1234567890' },
    );
    expect(response).toEqual({
      principalId: '1234567890',
    });
  });

  it('should return when x-identification is not set', async () => {
    const response = await authorizeCustomerController.handler({
      headers: {
        'x-identification': null,
      },
      methodArn: 'method-arn',
      type: 'REQUEST',
    });

    expect(findCustomerByDocumentNumberUseCase.execute).not.toHaveBeenCalled();
    expect(response).toBeUndefined();
  });
});
