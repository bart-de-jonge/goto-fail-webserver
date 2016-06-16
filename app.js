import express from "express";
import path from "path";
import favicon from "serve-favicon";
import logger from "morgan";
import bodyParser from "body-parser";
import session from "express-session";
import SQLiteStore from "connect-sqlite3";

const sqliteSessionStore = SQLiteStore(session);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    store: new sqliteSessionStore,
    secret: "averyrandomkeyfromgotofail",
    name: "gotofail.sid",
    sameSite: true,
    saveUnitialized: true,
    rolling: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}));
app.use(require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true,
    sourceMap: true,
}));
app.use(express.static(path.join(__dirname, "public")));

// Include bower components and elements as public routes
app.use("/bower_components", express.static(`${__dirname}/bower_components`));
app.use("/elements", express.static(`${__dirname}/elements`));

// add routes
require("./routes/router").addRoutes(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {},
    });
});

module.exports = app;
