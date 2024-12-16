import { Controller, Request, Response } from '@cloud-burger/handlers';
import { CustomerRepository } from '~/domain/customer/repositories/customer';

export class AuthenticateController {
  constructor(private customerRepository: CustomerRepository) {}

  handler: Controller = async (request: Request): Promise<Response<void>> => {
    return { statusCode: 200 };
  };
}
