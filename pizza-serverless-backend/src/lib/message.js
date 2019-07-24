module.exports = (statusCode, responce) => ({
  statusCode,
  body: JSON.stringify(responce),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});
