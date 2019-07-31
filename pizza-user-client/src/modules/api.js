const URL = '';

module.exports.placeOrder = async (name, email) => {
  const request = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
  const { status } = request;
  const { orderNumber } = await request.json();

  return { status, orderNumber };
};
