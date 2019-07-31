const root = document.querySelector('.container');

const FORM_ID = 'form';
const SUBMIT_ID = 'submit';
const NAME_ID = 'name';
const EMAIL_ID = 'email';

const clear = () => {
  root.innerHTML = '';
};

const compileMessage = (err, order, client) => {
  if (err) {
    return `<p class="container__message container__message_error">${err}: Error has occured!<p>`;
  }

  const { orderNumber } = order;
  const { name, email } = client;

  return `<div>
    <p class="container__message">
      <b>${name}</b> thank you for the order!
    </p>
    <p class="container__message">
      You will be notified to <b>${email}</b> email when your pizza is ready.
    </p>
    <p class="container__message">
      Order number is <b>${orderNumber}</b>.
    </p>
    <p class="container__message">
      You can cancel the order by clicking on
      <a href="#">the link</a>
      while your order is not ready yet.
    </p>
  </div>`;
};

const renderMessage = (message) => {
  root.insertAdjacentHTML('afterBegin', message);
};

const getValuesFromFields = () => {
  const name = root.querySelector(`#${NAME_ID}`).value;
  const email = root.querySelector(`#${EMAIL_ID}`).value;

  return { name, email };
};

module.exports = {
  listen() {
    let isFieldsFilled = false;
    root.addEventListener('submit', (event) => {
      if (event.target.id === FORM_ID) {
        isFieldsFilled = true;
        event.preventDefault();
      }
    });
    root.addEventListener('click', async (event) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(isFieldsFilled);
        });
      });

      if (isFieldsFilled && event.target.id === SUBMIT_ID) {
        isFieldsFilled = false;

        const { name, email } = getValuesFromFields();

        const { statusCode, body: { orderNumber } } = { statusCode: 200, body: { orderNumber: '2837asd47' } };

        let message;
        if (statusCode === 200) {
          message = compileMessage(null, { orderNumber }, { name, email });
        } else {
          message = compileMessage(statusCode);
        }

        clear();
        renderMessage(message);

        console.log('TODO: I want to be able to order a pizza!');
      }
    });
  },
  render() {
    root.insertAdjacentHTML('afterBegin', `
      <h1 class="container__heading">Order pizza fast and easy!</h1>
      <form class="container__form form" id="${FORM_ID}" class="form">
        <input class="form__text" id="${NAME_ID}" type="text" placeholder="Name" required />
        <input class="form__text form__text_last" id="${EMAIL_ID}" type="email" placeholder="name@domain.com" required />
        <input class="form__button" id="${SUBMIT_ID}" type="submit" value="Order now" />
      </form>
    `);
  },
};
