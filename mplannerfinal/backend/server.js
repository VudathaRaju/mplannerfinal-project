const app = require("./app")
const eventCheck = require('./shared/event-check');

const debug = require('debug')('mplanner');
const http = require('http');

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

server.listen(port);



//  socket related code.

let socketServer = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(socketServer);
const cron = require('node-cron');

const port1 = process.env.SOCKET_SERVER_PORT || 3001;

io.on('connection', (socket) => {
    socket.on('event-update', (info) => {
        io.emit('notification', info);
    });
});


cron.schedule('*/59 * * * * *', async () => {
    const events = await eventCheck()
    if (events && events.length) {
        console.log('events--------------')
        for (let i = 0; i < events.length; i++) {
            io.emit('snooze', { userId: events[i].id, message: 'start soon', event: events[i] })
        }
    }
});

socketServer.listen(port1, () => {
    console.log(`started on port: ${port}`);
});
