import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

describe("Routes: Director", () => {
    it("GET /director", done => {
        request.get("/director")
            .expect(200)
            .end(err => done(err));
    });
});
