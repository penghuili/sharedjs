const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');

const cfClient = new CloudFrontClient();

export const cloudfrontClient = {
  invalidate: async (distributionId, paths) => {
    const params = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: `peng37-invalidation-${Date.now()}`,
        Paths: {
          Quantity: paths.length,
          Items: paths,
        },
      },
    };
    const command = new CreateInvalidationCommand(params);
    const response = await cfClient.send(command);
    return response;
  },
};
