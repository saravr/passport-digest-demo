var digestClient = require('http-digest-client');

var digest = digestClient('foo', 'bar', false);

digest.request({
    host: 'localhost',
    path: '/api/me',
    port: 3001,
    method: 'GET',
    headers: {"User-Agent": "Simon Ljungberg"} // Set any headers you want
}, function (res) {
    res.on('data', function (data) {
        console.log("RESP: " + data.toString());
    });
    res.on('error', function (err) {
        console.log('oh noes');
    });
});
