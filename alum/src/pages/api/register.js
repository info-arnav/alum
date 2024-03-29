import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
const crypto = require("crypto");
import * as Realm from "realm-web";
import QueryString from "./query-string";

export default async function register(req, res) {
  let body = JSON.parse(req.body);
  const app = Realm.getApp(process.env.APP_ID);
  try {
    const data = await fetch(process.env.GRAPHQL_URI, {
      method: "POST",
      headers: {
        apikey: process.env.GRAPHQL_API,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      query{
        otp(query: ${QueryString({ email: body.email })}) {
          email
          otp
        }
      }
      `,
      }),
    }).then((e) => e.json());
    data.status = true;
    if (data.data.otp.otp == body.otp) {
      bcrypt.hash(body.password, 10, async function (err, hash) {
        let apiKey = crypto
          .randomBytes(Math.ceil(32 / 2))
          .toString("hex")
          .slice(0, 32);

        await app.emailPasswordAuth.registerUser({
          email: body.email,
          password: apiKey,
        });

        const credentials = Realm.Credentials.emailPassword(body.email, apiKey);

        const userId = await app.logIn(credentials);
        let verified;
        let type;
        if (
          body.email.split("@")[1] == "nsut.ac.in" &&
          body.type == "student"
        ) {
          verified = "true";
          type = "student";
        } else {
          verified = "false";
          type = "alumni";
        }
        let registeredUser = await fetch(process.env.GRAPHQL_URI, {
          method: "POST",
          headers: {
            email: body.email,
            password: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            mutation{
              insertOneRegisteration(data:${QueryString({
                email: body.email,
                password: hash,
                api: apiKey,
                files: body.files,
                applications: "[]",
                honors: "[]",
                projects: "[]",
                education: "[]",
                occupation: "[]",
                error: "",
              })}) {
                email
              }
            }
            `,
          }),
        }).then((e) => e.json());
        await fetch(process.env.GRAPHQL_URI, {
          method: "POST",
          headers: {
            apikey: process.env.GRAPHQL_API,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            mutation{
              updateOneRegisteration(query:${QueryString({
                email: body.email,
              })},set:${QueryString({
              verified: verified,
              type: type,
              user_id: userId.id,
            })}) {
                email
              }
            }
            `,
          }),
        });
        if (registeredUser.data.insertOneRegisteration.email == body.email) {
          var expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 100);
          res.setHeader(
            "Set-Cookie",
            `login_token=${CryptoJS.AES.encrypt(
              apiKey,
              process.env.SECRET
            )}; expires=${expirationDate.toUTCString()}; HttpOnly; Secure; SameSite=lax; Path=/`
          );
          res.json({
            error: false,
            key: CryptoJS.AES.encrypt(
              JSON.stringify({
                email: body.email,
                type: body.type,
                verified: verified,
              }),
              process.env.SECRET
            ).toString(),
          });
        } else {
          res.json({ error: true, message: "Some Error Occured" });
        }
      });
    } else {
      res.json({ error: true, message: "Invalid OTP" });
    }
  } catch {
    res.json({ error: true, message: "Some Error Occured" });
  }
}
