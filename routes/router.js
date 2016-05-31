import index from "./index";
import timeline from "./timeline";
import uploadScp from "./upload-scp";
import users from "./users";
import camera from "./camera";
import shotCaller from "./shot-caller";

// Module used to attach all routes to the correct urls
module.exports.addRoutes = (app) => {
    app.use("/", index);
    app.use("/timeline", timeline);
    app.use("/upload-scp", uploadScp);
    app.use("/", users);
    app.use("/camera", camera);
    app.use("/shot-caller", shotCaller);
};
