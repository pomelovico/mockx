const successReturn = (response) => payload => response.send({
    status:0,
    payload
});

const failReturn = (response,code) => error => response.send({
    status:1,
    code:code,
    error
});

module.exports = {
    successReturn,
    failReturn
}