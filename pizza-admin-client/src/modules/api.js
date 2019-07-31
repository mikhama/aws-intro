const GET_ORDERS_URL = '';
const COMPLETE_ORDER_URL = '';

module.exports.getOrders = async () => {
  const request = await fetch(GET_ORDERS_URL);

  const { status } = request;
  const { orders } = await request.json();

  return { status, orders };
};

module.exports.completeOrder = async (id) => {
  const request = await fetch(COMPLETE_ORDER_URL, {
    method: 'POST',
    body: JSON.stringify({ id }),
  });

  const { status } = request;
  const { message } = await request.json();

  return { status, message };
};
