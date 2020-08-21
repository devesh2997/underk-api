const open = require('open');

(async () => {
        await open('coverage/index.html', {"wait": true });
})();