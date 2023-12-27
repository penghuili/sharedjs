const {
  CloudWatchEventsClient,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
  DeleteRuleCommand,
} = require('@aws-sdk/client-cloudwatch-events');

const cweClient = new CloudWatchEventsClient({ region: process.env.AWS_REGION });

export const cloudWatchEventClient = {
  putRule: async params => {
    const command = new PutRuleCommand(params);
    const response = await cweClient.send(command);
    return response;
  },
  putTargets: async params => {
    const command = new PutTargetsCommand(params);
    const response = await cweClient.send(command);
    return response;
  },
  removeTargets: async params => {
    const command = new RemoveTargetsCommand(params);
    const response = await cweClient.send(command);
    return response;
  },
  deleteRule: async params => {
    const command = new DeleteRuleCommand(params);
    const response = await cweClient.send(command);
    return response;
  },
};
