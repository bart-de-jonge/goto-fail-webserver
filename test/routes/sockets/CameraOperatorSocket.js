import app from "../../../app.js";
import socketApp from "../../../routes/sockets/sockets.js";
import socketClient from "socket.io-client";
import http from "http";
import { expect } from "chai";

describe("Routes: CameraOperator Sockets", () => {
    const options = {
        "path": "/socket.io",
        "force new connection": true
    };

    const socketURL = "http://localhost:3000/cameraOperators";

    let client = null;
    let server = null;
    let socketServer = null;

    before(function (done) {
        // Deal with an impatient mocha
        this.timeout(0);
        server = http.Server(app);
        socketServer = socketApp(server);
        server.listen(3000, () => {
            client = socketClient.connect(socketURL, options);
            client.on("connect", data => {
                client.removeListener("connect");
                done();
            });
        });
    });

    it("Should Be Able To Advance The Count", done => {
        client.on("next_count", data => {
            expect(data.newCount).to.exist;
            done();
        });
        client.emit("advance_count");
    });

    after(function (done) {
        this.timeout(0);
        client.close();
        server.close();
        setImmediate(() => server.emit("close"));
        done();
    });
});
