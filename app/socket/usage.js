import app from '../synergy';

app.locals.io.on('connection', socket => {
    console.log('Synergy UI Connected');

    socket.on('disconnect', () => {
        clearInterval(app.locals.usageLoopId);
        console.log('Synergy UI Disconnected');
    });
});
