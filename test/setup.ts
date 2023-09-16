import { resetDb } from './utils/database.util';

export default async function () {
  await resetDb();
}
