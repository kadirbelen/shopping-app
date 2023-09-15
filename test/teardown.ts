import { clearDbTables } from './utils/database.util';

export default async function () {
  await clearDbTables();
}
