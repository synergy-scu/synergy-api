import http from 'http';

import app from './app';


const server = http.Server(app);

export default server;
