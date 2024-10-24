import { httpServer } from "./src/http_server/index.js";

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT, () => {
  console.log('Server is listening on port 8181');
});