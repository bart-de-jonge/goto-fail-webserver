import supertest from "supertest";
import app from "../../app.js";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Upload", () => {
    it("Incorrect POST /upload-scp", done => {
        request.post("/upload-scp")
            .expect(200)
            .expect(res => {
                expect(res.body.succes).to.be.false;
                expect(res.body.message).to.exist;
            })
            .end(err => done(err));
    });
});
