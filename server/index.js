import express from 'express';
import cors from 'cors';
import routes from './routes';

const { urlencoded, json } = express;

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use('*', (request, response) => {
  response.status(404).send('Not Found');
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;
