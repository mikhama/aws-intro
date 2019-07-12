const { ENDPOINT_REQUESTS } = require('../../creds.js');

const root = document.querySelector('.container');

module.exports = {
  listen() {
    root.addEventListener('click', async (event) => {
      if (event.target.type === 'checkbox') {
        // const data = await fetch(ENDPOINT_COMPLETE_REQUEST, {
        //   method: 'POST',
        //   mode: 'cors',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ id }),
        // });
        const { statusCode, body: { message } } = { statusCode: 200, body: { message: 'Something goes good' } }; // await data.json();
        event.target.parentNode.parentNode.classList.toggle('table__row_completed');

        window.console.log(`${statusCode}: ${message}`);
      }
    });
  },
  async render() {
    const data = await fetch(ENDPOINT_REQUESTS);

    // const { status } = { status: 400 };
    const { status } = data;

    if (status !== 200) {
      root.insertAdjacentHTML('afterBegin', `<p class="container__message container__message_error">${status}: Something went wrong!</p>`);
      return;
    }

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
