import { randomBytes } from "crypto";

console.log(
  randomBytes(64, (err, val) => {
    if (err) throw err;

    console.log(val.toString("hex"));
  })
);
