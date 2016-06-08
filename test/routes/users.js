import supertest from "supertest";
import app from "../../app.js";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Users", () => {
    it("GET /get-users", done => {
        request.get("/get-users")
            .expect(200)
            .expect(res => {
                expect(res.body).to.have.property("users");
            })
            .end(err => done(err));
    });

    it("POST /picked-user", done => {
        request.post("/picked-user")
            .send({ pickedUser: "Johnny Boy"})
            .expect(200)
            .expect(res => {
                expect(res.body.success).to.be.true;
            })
            .end(err => done(err));
    });

    it("POST /update-users", done => {
        request.post("/update-users")
            .send({ users: [] })
            .expect(200)
            .expect(res => {
                expect(res.body.success).to.be.true;
            })
            .end(err => done(err));
    });
});
