import * as Maildev from 'maildev';

export const getMaildev = (): Promise<any> =>
  new Promise((resolve, reject) => {
    const maildev = new Maildev({
      smtp: 1025, // incoming SMTP port - default is 1025
    });

    maildev.listen(function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(maildev);
      }
    });
  });
