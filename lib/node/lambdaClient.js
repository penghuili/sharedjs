const {
  LambdaClient,
  AddPermissionCommand,
  GetFunctionConfigurationCommand,
  InvokeCommand,
  RemovePermissionCommand,
} = require('@aws-sdk/client-lambda');

const lClient = new LambdaClient({ region: process.env.AWS_REGION });

export const lambdaClient = {
  addPermission: async params => {
    const command = new AddPermissionCommand(params);
    const response = await lClient.send(command);
    return response;
  },
  getFunctionConfiguration: async params => {
    const command = new GetFunctionConfigurationCommand(params);
    const response = await lClient.send(command);
    return response;
  },
  invoke: async params => {
    const command = new InvokeCommand(params);
    const response = await lClient.send(command);
    return response;
  },
  removePermission: async params => {
    const command = new RemovePermissionCommand(params);
    const response = await lClient.send(command);
    return response;
  },
};
