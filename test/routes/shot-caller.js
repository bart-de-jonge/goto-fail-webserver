import supertest from "supertest";
import app from "../../app.js";

const request = supertest(app);

describe("Routes: shot-caller", () => {
    it("GET /shot-caller", done => {
        request.get("/shot-caller")
            .expect(200)
            .end((err) => done(err));
    });
});
