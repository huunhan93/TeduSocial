import "dotenv/config";
import App from "./app";
import { IndexRoute } from "@modules/index";
import UsersRoute from "@modules/users/users.route";
import { validateEnv } from "@core/utils";

validateEnv();
const routes = [new IndexRoute(), new UsersRoute()];

const app = new App(routes);
app.listen();
