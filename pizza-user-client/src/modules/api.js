const ENDPOINT = require('../../creds.js');

module.exports = {
  async placeOrder(name, email) {
    const data = await fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });

    const { status } = data;
    const { orderNumber } = await data.json();

    return { status, orderNumber };
  },
};
