function write(level, message, meta = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
    return;
  }
  console.log(line);
}

module.exports = {
  info: (message, meta) => write('info', message, meta),
  error: (message, meta) => write('error', message, meta),
};
