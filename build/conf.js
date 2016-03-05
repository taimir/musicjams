import path from 'path';

const basePath = path.join(__dirname, '../');

export default {
  paths : {
    base : basePath,
    src : path.join(basePath, 'src'),
    serve : path.join(basePath, 'serve')
  }
};
