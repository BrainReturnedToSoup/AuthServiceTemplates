import createServer from "./createServer";

const PORT = 8080;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server is active, listening on port ${PORT}`);
});
