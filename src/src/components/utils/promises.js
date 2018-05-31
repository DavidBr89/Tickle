import $ from 'jquery';

const ajax = ({ timeout, ...options }) =>
  new Promise((resolve, reject) =>
    setTimeout(
      () =>
        $.ajax(options)
          .then(resolve)
          .fail(reject),
      timeout || 0
    )
  );

// const wait = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const wait = ms =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve();
    }, ms)
  );

export { ajax, wait };
