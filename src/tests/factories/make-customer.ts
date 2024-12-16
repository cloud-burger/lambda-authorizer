import { Customer } from '~/domain/customer/entities/customer';

export const makeCustomer = (override: Partial<Customer> = {}): Customer =>
  new Customer({
    documentNumber: '53523992060',
    email: 'johndue@gmail.com',
    id: 'eba521ba-f6b7-46b5-ab5f-dd582495705e',
    name: 'John Due',
    ...override,
  });
