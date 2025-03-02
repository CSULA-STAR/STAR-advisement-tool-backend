const logger = (req, res, next) => {
    const { method, url, params, query, body } = req;
    const timestamp = new Date().toISOString();

    let log = `[${timestamp}] Endpoints: ${method} ${url}`;

    if (Object.keys(params).length !== 0) {
        log += ` Path Parameters: ${JSON.stringify(params)}`;
    }

    if (Object.keys(query).length !== 0) {
        log += ` Query Parameters: ${JSON.stringify(query)}`;
    }

    if (Object.keys(body).length !== 0) {
        log += ` Request Body: ${JSON.stringify(body, null, 2)}`;
    }

    console.log(`\x1b[32m${log} \x1b[0m`);

    // invoke next to pass control to the next middleware or route handler
    next();
};

module.exports = {
    logger
};
