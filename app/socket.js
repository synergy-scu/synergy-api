import socketIO from 'socket.io';

import SynergyServer from './server';


export const createSocket = server => socketIO(server);

const IO = createSocket(SynergyServer);

export default IO;
