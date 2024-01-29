import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default function () {
  const filename = fileURLToPath(import.meta.url);
  return dirname(filename);
}
