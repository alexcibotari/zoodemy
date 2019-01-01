export const environment: any = {
  production: true,
  api: {
    udemy: {
      auth: {
        type: 'Basic',
        credentials: 'YWQxMmVjYTljYmUxN2FmYWM2MjU5ZmU1ZDk4NDcxYTY6YTdjNjMwNjQ2MzA4ODI0YjIzMDFmZGI2MGVjZmQ4YTA5NDdlODJkNQ=='
      },
      subDomain: 'www'
    }
  },
  message: {
    duration: 5000
  },
  download: {
    retry: 10,
    interval: 10000
  }
};
