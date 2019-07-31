const { getOrders, completeOrder } = require('./api');

const root = document.querySelector('.container');

module.exports = {
  listen() {
    root.addEventListener('click', async (event) => {
      if (event.target.type === 'checkbox') {
        const id = event.target.parentNode.parentNode.children[0].innerHTML;
        const { status, message } = await completeOrder(id);
        event.target.parentNode.parentNode.classList.toggle('table__row_completed');

        window.console.log(`${status}: ${message}`);
      }
    });
  },
  async render() {
    const data = await getOrders();
    const { status } = data;

    if (status !== 200) {
      root.insertAdjacentHTML('afterBegin', `<p class="container__message container__message_error">${status}: Something went wrong!</p>`);
      return;
    }

    const { orders } = data;

    const ordersHtml = orders.map(({
      id,
      name,
      email,
      isCompleted,
      isCancelled,
    }) => `
      <tr class="table__row ${isCompleted ? 'table__row_completed' : ''} ${isCancelled ? 'table__row_cancelled' : ''}">
        <td class="table__cell">${id}</td>
        <td class="table__cell">${name}</td>
        <td class="table__cell">${email}</td>
        <td class="table__cell cell table__cell_with-checkbox">
          <input class="cell__checkbox" type="checkbox" ${isCompleted ? 'checked' : ''} ${isCancelled ? 'hidden' : ''}/>
        </td>
      </tr>
    `).join('');

    root.insertAdjacentHTML('afterBegin', `
      <h1 class="container__heading">Manage orders as fast as you can!</h1>
      <table class="container__table table" cellspacing="0" cellpadding="0">
        <thead class="table__heading">
          <tr>
            <th class="table__cell table__cell_heading">id</th>
            <th class="table__cell table__cell_heading">name</th>
            <th class="table__cell table__cell_heading">email</th>
            <th class="table__cell table__cell_heading">isCompleted</th>
          </tr>
        </thead>
        <tbody>
          ${ordersHtml}
        </tbody>
      </table>
    `);
  },
};
