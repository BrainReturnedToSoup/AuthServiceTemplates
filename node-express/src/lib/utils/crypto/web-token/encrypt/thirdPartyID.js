import { config } from 'dotenv';
config();

import { encryptBuilder } from "../aesctrBuilders";

const encrypt = encryptBuilder(process.env.THIRD_PARTY_ID_KEY);

export default encrypt;
