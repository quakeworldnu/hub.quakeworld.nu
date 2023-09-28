import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const ENV = import.meta.env;

function getS3Client() {
  return new S3Client({
    region: ENV.VITE_AWS_S3_REGION,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: ENV.VITE_AWS_S3_REGION },
      identityPoolId: ENV.VITE_AWS_S3_IDENTITY_POOL_ID,
    }),
  });
}

export function getObjectsInBucket(name: string) {
  const client = getS3Client();
  const command = new ListObjectsV2Command({ Bucket: name });
  return client.send(command);
}

export async function getDemoUrls(): Promise<string[]> {
  const objects = await getObjectsInBucket(ENV.VITE_AWS_S3_BUCKET_NAME).then(
    ({ Contents }) => Contents || [],
  );

  const demos = [];
  for (const o of objects) {
    if (o.Key?.endsWith(".mvd")) {
      demos.push(`${ENV.VITE_AWS_S3_BUCKET_URL}/${o.Key}`);
    }
  }

  return demos;
}
