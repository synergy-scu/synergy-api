import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import socketIO from 'socket.io';
import 'json.date-extensions';

import SynergyDB from './SynergyDB';

import apiResolver from './routes/apiResolver';
import appResolver from './routes/appResolver';

JSON.useDateParser();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', appResolver);
app.use('/api', apiResolver);

app.locals.db = SynergyDB;

const server = http.Server(app);
server.listen(3000, () => {
    console.log('Listening on port 3000');
});

const IO = socketIO(server, { path: '/io' });
app.locals.io = IO;
app.locals.sockets = {};

export default app;

