// TEMPORARY stand-in for authenticate.js until real JWT auth is ready.
// Reads the user from the x-dev-user-id and x-dev-role headers.
// Only works when DEV_AUTH=true and never in production.
const VALID_ROLES = ['admin', 'tenant', 'landlord', 'agent'];

const devAuthenticate = (req, res, next) => {
    if (process.env.DEV_AUTH !== 'true' || process.env.NODE_ENV === 'production') {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    const user_id = req.header('x-dev-user-id');
    const role = req.header('x-dev-role');

    if (!user_id || !VALID_ROLES.includes(role)) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    req.user = { user_id, role };
    next();
}

module.exports = { devAuthenticate };