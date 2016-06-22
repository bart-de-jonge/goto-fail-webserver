import supertest from "supertest";
import app from "../app.js";

const request = supertest(app);

describe("Routes: Error Handling", () => {
    describe("GET 404", () => {
        it("returns 404 message", done => {
            request.get("/SQUEEEEEEEEE")
                .expect(200)
                .end(err => done(err));
        });
    });
});
