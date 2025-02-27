import { Customer } from '../entities/customer';

export interface CustomerRepository {
  findByDocumentNumber(documentNumber: string): Promise<Customer | null>;
}
