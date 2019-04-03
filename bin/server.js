import http from 'http';

import app from '../app/server';

const server = http.Server(app);

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
