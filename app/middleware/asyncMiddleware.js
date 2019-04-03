/**
 * Wraps the routing function in an async call. If an error occurs it will automcaically get passed to the catch block
 * @see https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
 */
const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncMiddleware;
