import CryptoJS from "crypto-js";
import cookie from "cookie";
import QueryString from "./query-string";

export default async function login(req, res) {
  let body = JSON.parse(req.body);
  const cookies = cookie.parse(req.headers.cookie || "");
  try {
    const mid_password = CryptoJS.AES.decrypt(
      cookies.login_token,
      process.env.SECRET
    );
    const password = mid_password.toString(CryptoJS.enc.Utf8);
    const data = await fetch(process.env.GRAPHQL_URI, {
      method: "POST",
      headers: {
        email: body.email,
        password: password,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        mutation{
          updateOneRegisteration(set:${QueryString({
            files: body.files,
            error: "",
          })}, query:${QueryString({ email: body.email })}) {
            files
            error
          }
        }
`,
      }),
    }).then((e) => e.json());
    res.json({
      error: false,
      data: data.data.updateOneRegisteration.files,
      error_data: data.data.updateOneRegisteration.error,
    });
  } catch {
    res.json({ error: true, message: "Some Error Occured" });
  }
}
