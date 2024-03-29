const expressJwt = require("express-jwt").expressjwt;

function authJWT() {
  const secrett = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret: secrett,
    algorithms: ["HS256"],
    // isRevoked: isRevoked,
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

// async function isRevoked(req, payload, done) {
//   if (!payload.iaAdmin) {
//     console.log(payload);
//     done(null, true);
//   }
//   done();
// }

module.exports = authJWT;
