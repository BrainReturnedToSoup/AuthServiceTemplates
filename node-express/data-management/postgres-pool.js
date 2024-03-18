import pgp from "pg-promise";

const poolConstructor = pgp();

const config = {
  user: "",
  host: "",
  database: "",
  password: "",
  port: "",
  max: "",
};

const pool = poolConstructor(config);

export default pool;
