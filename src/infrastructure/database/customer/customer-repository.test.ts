import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { CustomerRepository } from './customer-repository';

describe('customer repository', () => {
  const mockDynamoDbClient = mockClient(DynamoDBClient);
  let customerRepository: CustomerRepository;

  beforeAll(() => {
    customerRepository = new CustomerRepository('customers');
  });

  it('should return null while find customer by document number and customer not found', async () => {
    mockDynamoDbClient.on(QueryCommand).resolves({
      Items: [],
    });

    const customer =
      await customerRepository.findByDocumentNumber('01234567890');

    expect(customer).toBeNull();
    expect(mockDynamoDbClient).toHaveReceivedCommandWith(QueryCommand, {
      TableName: 'customers',
      IndexName: 'document_number_gsi',
      KeyConditionExpression: '#document_number = :documentNumber',
      ExpressionAttributeNames: {
        '#document_number': 'document_number',
      },
      ExpressionAttributeValues: {
        ':documentNumber': '01234567890',
      },
    });
  });

  it('should return customer while find customer by document number', async () => {
    mockDynamoDbClient.on(QueryCommand).resolves({
      Items: [
        {
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
          document_number: '1234567890',
          id: '123',
          name: 'John',
          email: 'john@gmail.com',
        },
      ],
    });

    const customer =
      await customerRepository.findByDocumentNumber('01234567890');

    expect(customer).toEqual({
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      documentNumber: '1234567890',
      email: 'john@gmail.com',
      id: '123',
      name: 'John',
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    });
    expect(mockDynamoDbClient).toHaveReceivedCommandWith(QueryCommand, {
      TableName: 'customers',
      IndexName: 'document_number_gsi',
      KeyConditionExpression: '#document_number = :documentNumber',
      ExpressionAttributeNames: {
        '#document_number': 'document_number',
      },
      ExpressionAttributeValues: {
        ':documentNumber': '01234567890',
      },
    });
  });
});
