import "dotenv/config";
import App from "./app";
import { IndexRoute } from "@modules/index";
import UsersRoute from "@modules/users/users.route";
import AuthRoute from "@modules/auth/auth.route";
import { validateEnv } from "@core/utils";
import ProfileRoute from "@modules/profile/profile.route";
import PostsRoute from "@modules/posts/posts.route";
import GroupRoute from "@modules/groups/groups.route";

validateEnv();
const routes = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ProfileRoute(),
  new PostsRoute(),
  new GroupRoute()
];

const app = new App(routes);
app.listen();
