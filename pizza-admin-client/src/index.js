const ui = require('./modules/ui');

const style = require('./style/index.css');

ui.render();
ui.listen();

module.exports = { style };
