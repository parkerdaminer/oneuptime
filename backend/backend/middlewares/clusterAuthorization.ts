const sendErrorResponse = require('../middlewares/response').sendErrorResponse;

export default {
    isAuthorizedAdmin: async function (
        req: express.Request,
        res: express.Response,
        next: express.RequestHandler
    ) {
        let masterAdmin = false;

        if (req.authorizationType === 'MASTER-ADMIN') {
            masterAdmin = true;
        }

        if (masterAdmin) {
            return next();
        } else {
            return sendErrorResponse(req, res, {
                code: 400,
                message: 'Not master-admin',
            });
        }
    },
};
