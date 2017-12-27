import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import apiRoutes from './apiRoutes';
import db from './models';
import updateEventStatus from './helpers';

const app = express();
const { events } = db;

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/api/v1', apiRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'page not found' });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`App started on port ${app.get('port')}`);
  const interval = 24 * 60 * 60 * 1000;  // One day
  setInterval(() => {
    updateEventStatus(events);
  }, interval);
});

export default app;
