import { writeFile, mkdir } from 'fs/promises';
import { compileFromFile } from 'json-schema-to-typescript'; // eslint-disable-line import/no-extraneous-dependencies

const ENV_EVENT_JSON_SCHEMA = 'EVENT_JSON_SCHEMA';
const ENV_PAYLOAD_JSON_SCHEMA = 'PAYLOAD_JSON_SCHEMA';

async function main() {
  await mkdir('src/types', { recursive: true });
  if (process.env[ENV_EVENT_JSON_SCHEMA] !== undefined) {
    const event = await compileFromFile(process.env[ENV_EVENT_JSON_SCHEMA], {
      unreachableDefinitions: true,
    });

    await writeFile('src/types/event.ts', event);
  }

  if (process.env[ENV_PAYLOAD_JSON_SCHEMA] !== undefined) {
    const payload = await compileFromFile(
      process.env[ENV_PAYLOAD_JSON_SCHEMA],
      {
        unreachableDefinitions: true,
      }
    );

    await writeFile('src/types/payload.ts', payload);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
