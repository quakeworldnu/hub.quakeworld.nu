import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const AWS_S3_BUCKET = "quakeworld";
const AWS_S3_REGION = "eu-central-1";
const AWS_S3_IDENTITY_POOL_ID =
  "eu-central-1:56c036fc-0f2f-4af3-a02f-36afa549f042";
const AWS_S3_BASE_URL = "https://quakeworld.s3.eu-central-1.amazonaws.com";

function getS3Client() {
  return new S3Client({
    region: AWS_S3_REGION,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: AWS_S3_REGION },
      identityPoolId: AWS_S3_IDENTITY_POOL_ID,
    }),
  });
}

export function getObjectsInBucket(name: string) {
  const client = getS3Client();
  const command = new ListObjectsV2Command({ Bucket: name });
  return client.send(command);
}

export async function getDemoUrls(): Promise<string[]> {
  const objects = await getObjectsInBucket(AWS_S3_BUCKET).then(
    ({ Contents }) => Contents || [],
  );

  const demos = [];
  for (const o of objects) {
    if (o.Key?.endsWith(".mvd")) {
      demos.push(`${AWS_S3_BASE_URL}/${o.Key}`);
    }
  }

  return demos;
}

export function formatDemoName(demoName: string): string {
  return demoName
    .replace(`${AWS_S3_BASE_URL}/`, "")
    .replace("qw/demos/", "")
    .replaceAll("/", " / ")
    .replaceAll("_", " ")
    .replace(/(\[.+])/gm, " $1 ")
    .replace(".mvd", "")
    .trim();
}
