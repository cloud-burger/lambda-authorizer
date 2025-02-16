import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Customer } from '~/domain/customer/entities/customer';
import { CustomerRepository as ICustomerRepository } from '~/domain/customer/repositories/customer';
import { CustomerDbSchema } from './dtos/customer-db-schema';
import { DatabaseCustomerMapper } from './mappers/database-customer';

export class CustomerRepository implements ICustomerRepository {
  private readonly client: DynamoDBClient;

  constructor(private customersTable: string) {
    this.client = new DynamoDBClient({ region: 'us-east-1' });
  }

  async findByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.customersTable,
        IndexName: 'document_number_gsi',
        KeyConditionExpression: '#document_number = :documentNumber',
        ExpressionAttributeNames: {
          '#document_number': 'document_number',
        },
        ExpressionAttributeValues: {
          ':documentNumber': documentNumber,
        },
      }),
    );

    const { Items } = result;

    const hasCustomer = Items?.length;

    if (!hasCustomer) {
      return null;
    }

    const [customer] = Items;

    return DatabaseCustomerMapper.toDomain(customer as CustomerDbSchema);
  }
}
