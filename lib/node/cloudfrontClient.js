const {
  CloudFrontClient,
  CreateInvalidationCommand,
  ListDistributionsCommand,
} = require('@aws-sdk/client-cloudfront');

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
  listDistributions: async () => {
    const params = {};
    const command = new ListDistributionsCommand(params);
    const response = await cfClient.send(command);
    return response.DistributionList?.Items?.map(d => ({
      id: d.Id,
      domainName: d.DomainName,
      alternativeDomainName: d.Aliases?.Items?.[0],
    }));
  },
};
