const responseCode = (res, error = false, msg = '', body = [], statusCode = 200) => {
    const data = {
        error, body, msg
    }
    return res.status(statusCode).json(data);
}

module.exports = { responseCode }