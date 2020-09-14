const express = require('express');

const app = express();

app.use(() => {
    console.log('helo bro');
})

app.listen(4000);