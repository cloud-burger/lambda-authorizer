import logger from '@cloud-burger/logger';
import { Customer } from '~/domain/customer/entities/customer';
import { CustomerRepository as ICustomerRepository } from '~/domain/customer/repositories/customer';
import Connection from '~/infrastructure/postgres/connection';
import { CustomerDbSchema } from './dtos/customer-db-schema';
import { DatabaseCustomerMapper } from './mappers/database-customer';
import { FIND_CUSTOMER_BY_DOCUMENT_NUMBER } from './queries/find-by-document-number';

export class CustomerRepository implements ICustomerRepository {
  constructor(private connection: Connection) {}

  async findByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    const { records } = await this.connection.query({
      sql: FIND_CUSTOMER_BY_DOCUMENT_NUMBER,
      parameters: {
        document_number: documentNumber,
      },
    });

    if (!records.length) {
      logger.debug({
        message: 'Customer not found',
        data: {
          documentNumber,
          records,
        },
      });

      return null;
    }
    const [customer] = records;

    return DatabaseCustomerMapper.toDomain(customer as CustomerDbSchema);
  }
}
