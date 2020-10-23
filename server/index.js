import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import routes from './routes';
import { socketIO } from './helper';

config();

const { urlencoded, json } = express;

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(helmet());
app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
});
app.use('/api/v1', routes);

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${PORT}`);
});

socketIO.init(server);

export default app;
