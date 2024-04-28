import { encryptBuilder } from "../aesctrBuilders";

const encrypt = encryptBuilder(process.env.GRANT_ID_KEY);

export default encrypt;
