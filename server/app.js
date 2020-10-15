const express = require('express');
const routes = require('./routes')
const { urlencoded, json } = express;

const app = express();
const PORT = 5000;
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/api', routes);

app.use('*', (request, response) => {
    response.status(404).send('Not Found');
  });
  
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));