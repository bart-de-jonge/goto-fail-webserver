import app from "../../../app.js";
import socketApp from "../../../routes/sockets/sockets.js";
import socketClient from "socket.io-client";
import http from "http";
import { expect } from "chai";

describe("Routes: ShotCaller Sockets", () => {
    const options = {
        "path": "/socket.io",
        "force new connection": true
    };

    const socketURL = "http://localhost:3000/shotCallers";

    let client = null;
    let server = null;
    let socketServer = null;

    before(function (done) {
        this.timeout(0);
        server = http.Server(app);
        socketServer = socketApp(server);
        server.listen(3000, () => {
            client = socketClient.connect(socketURL, options);
            client.on("connect_error", err => console.log(err));
            client.on("connect", data => {
                console.log("CONNECTED");
                done();
            });
        });
    });

    it("Should Be Able To Advance The Count", done => {
        client.emit("advance_count");
        client.on("next_count", data => {
            expect(data.newCount).to.exist;
            done();
        });
    });

    after(function (done) {
        this.timeout(0);
        client.close();
        server.close(() => {
            done();
        });
    });
});
