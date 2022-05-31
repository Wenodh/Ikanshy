const { authJwt } = require('../middleware');
const controller = require('../controllers/transaction.controller');
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });
    app.post(
        '/api/transaction/:toId',
        [authJwt.verifyToken],
        controller.credit
    );
    app.get(
        '/api/transaction/balance',
        [authJwt.verifyToken],
        controller.balance
    );
};
