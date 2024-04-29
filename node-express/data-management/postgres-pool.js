import pgp from "pg-promise";

const poolConstructor = pgp();

const config = {
  user: "postgres",
  host: "localhost",
  database: "nodejs_auth_service",
  password: "password",
  port: 5432,
  max: 100,
};

const pool = poolConstructor(config);

export default pool;
