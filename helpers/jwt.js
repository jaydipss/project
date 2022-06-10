const expressJwt = require("express-jwt").expressjwt;

//const isAdmin = require("../routers/users");

function authJWT() {
  const secrett = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret: secrett,
    algorithms: ["HS256"],
    // isRevoked: isRevokedCallback,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },

      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

// //check user is admin or not- not a admin then cancle the token
// // only admin can add the product
// //payload - contain the data which are assing in the token

// async function isRevokedCallback(req, payload, done) {
//   const a = payload.isAdmin;
//   console.log(a, "this is not define");
//   console.log(payload);
//   // }
//   //}
// }

module.exports = authJWT;
//add coments
