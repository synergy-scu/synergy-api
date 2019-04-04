import express from 'express';
import bodyParser from 'body-parser';

import SynergyDB from './SynergyDB';

import apiResolver from './routes/apiResolver';
import loginResolver from './routes/loginResolver';
import appResolver from './routes/appResolver';


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', appResolver);
app.use('/login', loginResolver);
app.use('/api', apiResolver);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.locals.db = SynergyDB;

export default app;
