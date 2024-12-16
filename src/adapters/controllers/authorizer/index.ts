import { Controller, Request, Response } from '@cloud-burger/handlers';

export class AuthorizerController {
  constructor() {}

  handler: Controller = async (request: Request): Promise<Response<void>> => {
    return { statusCode: 200 };
  };
}
