const { ENDPOINT_PLACE_ORDER } = require('../../creds.js');

module.exports = {
  async placeOrder(name, email) {
    const data = await fetch(ENDPOINT_PLACE_ORDER, {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });

    const { status } = data;
    const { orderNumber } = await data.json();
    // const { status, body: { orderNumber } } =
    // { statusCode: 200, body: { orderNumber: '2837asd47' } };

    return { status, orderNumber };
  },
};
