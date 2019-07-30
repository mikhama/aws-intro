const ENDPOINT = require('../../creds.js');

module.exports = {
  async getOrders() {
    const data = await fetch(ENDPOINT);

    const { status } = data;
    const { orders } = await data.json();

    orders.sort((a, b) => b.id - a.id);

    return { status, orders };
  },

  async completeOrder(id, isCompleted) {
    const data = await fetch(ENDPOINT, {
      method: 'PUT',
      body: JSON.stringify({ id, isCompleted }),
    });

    const { status } = data;
    const { message } = await data.json();

    return { status, message };
  },
};
