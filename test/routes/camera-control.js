import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

describe("Routes: Camera Control", () => {
    it("GET /camera-control", done => {
        request.get("/camera-control")
            .expect(200)
            .end(err => done(err));
    });
});
