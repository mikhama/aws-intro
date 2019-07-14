const { ENDPOINT_ORDERS, ENDPOINT_COMPLETE_ORDER } = require('../../creds.js');

module.exports = {
  async getOrders() {
    const data = await fetch(ENDPOINT_ORDERS);

    // const { status } = { status: 400 };
    const { status } = data;

    // const orders = [
    //   {
    //     id: '100asd3',
    //     name: 'Nikolay',
    //     email: 'nikolay@gmail.com',
    //     isCompleted: true,
    //     isCancelled: false,
    //   },
    //   {
    //     id: '134df45',
    //     name: 'Mike',
    //     email: 'mike@gmail.com',
    //     isCompleted: true,
    //     isCancelled: false,
    //   },
    //   {
    //     id: 'asd44dc',
    //     name: 'Pavel',
    //     email: 'pavel@gmail.com',
    //     isCompleted: false,
    //     isCancelled: false,
    //   },
    //   {
    //     id: 'f5ddf34',
    //     name: 'Alexey',
    //     email: 'alexey@gmail.com',
    //     isCompleted: false,
    //     isCancelled: true,
    //   },
    //   {
    //     id: 'cvvrr34',
    //     name: 'Nikita',
    //     email: 'nikita@gmail.com',
    //     isCompleted: false,
    //     isCancelled: true,
    //   },
    // ];
    const { orders } = await data.json();

    return { status, orders };
  },

  async completeOrder(id, isCompleted) {
    const data = await fetch(ENDPOINT_COMPLETE_ORDER, {
      method: 'POST',
      body: JSON.stringify({ id, isCompleted }),
    });

    // const { status, body: { message } } = { status: 200, body: { message: 'OK' } };

    const { status } = data;
    const { message } = await data.json();

    return { status, message };
  },
};
