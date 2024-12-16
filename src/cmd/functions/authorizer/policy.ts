import { APIGatewayAuthorizerResult } from "aws-lambda";

export type Effect = "Allow" | "Deny";

export interface Statement {
  Effect: Effect;
  Action: string | string[];
  Resource: string | string[];
}

export interface PolicyDocument {
  Version: string;
  Statement: Statement[];
}

/**
 * Generate a policy document for API Gateway.
 * @param principalId - The identifier for the user or principal.
 * @param effect - The policy effect (Allow or Deny).
 * @param methodArn - The ARN of the API Gateway method/resource.
 * @param context - Optional context for the Lambda Authorizer response.
 * @returns The full authorization response object.
 */
export function generatePolicy(
  principalId: string,
  effect: Effect,
  methodArn: string,
  context?: Record<string, any>
): APIGatewayAuthorizerResult {
  const policyDocument: PolicyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: effect,
        Action: "execute-api:Invoke",
        Resource: methodArn,
      },
    ],
  };

  const authResponse: APIGatewayAuthorizerResult = {
    principalId,
    policyDocument,
  };

  if (context) {
    authResponse.context = context;
  }

  return authResponse;
}

/**
 * Generate a resource ARN for API Gateway.
 * @param restApiId - The API Gateway ID.
 * @param region - AWS Region.
 * @param accountId - AWS Account ID.
 * @param stage - API Gateway stage (e.g., "dev", "prod").
 * @param httpMethod - HTTP method (e.g., "GET", "POST").
 * @param resourcePath - Resource path (e.g., "/users").
 * @returns The ARN string.
 */
export function generateMethodArn(
  restApiId: string,
  region: string,
  accountId: string,
  stage: string,
  httpMethod: string,
  resourcePath: string
): string {
  return `arn:aws:execute-api:${region}:${accountId}:${restApiId}/${stage}/${httpMethod}${resourcePath}`;
}
