var express =   require('express');
var app =       express();
var server;

app.use(express.basicAuth(adapter.config.user, adapter.config.pass));

if (adapter.config.ssl) {
    var fs = require('fs');
    server = require('https').createServer({
        key:    fs.readFileSync(__dirname + '/ssl/privatekey.pem'),
        cert:   fs.readFileSync(__dirname + '/ssl/certificate.pem')
    }, app);
} else {
    server = require('http').createServer(app);
}

server.listen(adapter.config.port);

/*
for (var i = 0; i < adapter.config.devices.length; i++) {
    var dpId = firstId + (i * 5);

    socket.emit('setObject', dpId, {
        Name: 'Geofency Name '+adapter.config.devices[i],
        TypeName: 'VARDP'
    });
    socket.emit('setObject', dpId+1, {
        Name: 'Geofency Longitude '+adapter.config.devices[i],
        TypeName: 'VARDP'
    });
    socket.emit('setObject', dpId+2, {
        Name: 'Geofency Latitude '+adapter.config.devices[i],
        TypeName: 'VARDP'
    });
    socket.emit('setObject', dpId+3, {
        Name: 'Geofency Entry '+adapter.config.devices[i],
        TypeName: 'VARDP'
    });
    socket.emit('setObject', dpId+4, {
        Name: 'Geofency Date '+adapter.config.devices[i],
        TypeName: 'VARDP'
    });
}
*/

app.use(express.bodyParser({}));
app.post('/*', function (req, res) {
    res.set('Content-Type', 'text/html');
    var id = parseInt(req.path.slice(1), 10);
    if (adapter.config.devices[id]) {

        adapter.log.info('received webhook from device ' + id);

        /*
        socket.emit('setState', [dpId, req.body.name]);
        socket.emit('setState', [dpId+1, req.body.longitude]);
        socket.emit('setState', [dpId+2, req.body.latitude]);
        socket.emit('setState', [dpId+3, req.body.entry]);
        socket.emit('setState', [dpId+4, formatTimestamp(req.body.date)]);
        */

        res.status(200);
        res.send('OK');
    } else {
        adapter.log.warn('received webhook from unknown device '+id);
        res.status(404);
        res.send('UNKNOWN DEVICE');
    }
});


function stop() {
    adapter.log.info('terminating');
    setTimeout(function () {
        process.exit();
    }, 500);
}

process.on('SIGINT', function () {
    stop();
});

process.on('SIGTERM', function () {
    stop();
});



function formatTimestamp(str) {
    var ts = new Date(str);
    return ts.getFullYear() + '-' +
        ('0' + (ts.getMonth() + 1).toString(10)).slice(-2) + '-' +
        ('0' + (ts.getDate()).toString(10)).slice(-2) + ' ' +
        ('0' + (ts.getHours()).toString(10)).slice(-2) + ':' +
        ('0' + (ts.getMinutes()).toString(10)).slice(-2) + ':' +
        ('0' + (ts.getSeconds()).toString(10)).slice(-2);
}