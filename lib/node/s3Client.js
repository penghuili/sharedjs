const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

export function createS3Client({
  endpoint,
  signatureVersion,
  region,
  accessKeyId,
  secretAccessKey,
}) {
  const client = new S3Client({ endpoint, signatureVersion, region, accessKeyId, secretAccessKey });

  return {
    getSignedUrlForUpload: async ({ Expires, ...params }) => {
      const command = new PutObjectCommand(params);
      const signedUrl = await getSignedUrl(client, command, {
        expiresIn: Expires,
      });
      return signedUrl;
    },
    getSignedUrlForDownload: async ({ Expires, ...params }) => {
      const command = new GetObjectCommand(params);
      const signedUrl = await getSignedUrl(client, command, {
        expiresIn: Expires,
      });
      return signedUrl;
    },
    upload: async params => {
      const command = new PutObjectCommand(params);
      await client.send(command);
    },
    download: async params => {
      const command = new GetObjectCommand(params);
      const response = await client.send(command);
      return response.Body;
    },
    list: async params => {
      const command = new ListObjectsV2Command(params);
      const response = await client.send(command);
      return response;
    },
    deleteObject: async params => {
      const command = new DeleteObjectCommand(params);
      await client.send(command);
    },
    deleteObjects: async params => {
      const command = new DeleteObjectsCommand(params);
      await client.send(command);
    },
  };
}
