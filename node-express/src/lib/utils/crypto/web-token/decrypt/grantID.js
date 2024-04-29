import { config } from 'dotenv';
config();

import { decryptBuilder } from "../aesctrBuilders";

const decrypt = decryptBuilder(process.env.GRANT_ID_KEY);

export default decrypt;
