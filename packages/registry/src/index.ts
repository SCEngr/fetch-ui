import 'reflect-metadata';
import { app } from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Registry server listening on port ${port}`);
});
