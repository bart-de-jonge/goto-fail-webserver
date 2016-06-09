import supertest from "supertest";
import app from "../../app.js";
import fs from "fs";
import { expect } from "chai";

const request = supertest(app);

describe("Routes: Users", () => {
    try {
        fs.accessSync(`${__dirname}/../../project-scp-files/project.scp`, fs.F_OK);

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
    } catch (e) {
        // Bad Weather Test For If Project File Isn't Present
        it("POST /update-users No Data", done => {
            request.post("/update-users")
                .send({ users: [] })
                .expect(res => {
                    expect(res.body.success).to.be.false;
                })
                .end(err => done(err));
        });
    }
});
