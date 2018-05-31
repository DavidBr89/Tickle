import prune from 'json-prune';

import { ajax } from '../utils/promises';

const url = `https://api.discogs.com/users/anarcho123/collection/folders/0/releases?sort=added&sort_order=desc&token=${
  process.env.DiscogsAccessToken0
}`;

const apiToken = i => {
  switch (i % 2) {
    case 0:
      return process.env.DiscogsAccessToken0;
    default:
      return process.env.DiscogsAccessToken1;
  }
};

function getData({ onDataLoaded, onImagesLoaded, onError }) {
  ajax({
    url,
    type: 'GET',
    dataType: 'jsonp',
    async: false,
    cache: false
  })
    .catch(onError)
    .then(res => {
      onImagesLoaded();
      const data = res.data.releases;
      const results = [];
      data
        // .slice(0, 10)
        .reduce(
          (pacc, d, i) =>
            pacc
              // .then(() => wait(1000))
              .then(() =>
                ajax({
                  url: `${d.basic_information.resource_url}?token=${apiToken(
                    i
                  )}`,
                  type: 'GET',
                  dataType: 'jsonp',
                  async: false,
                  cache: false,
                  timeout: 0
                })
              )
              .catch(onError)
              .then(e => {
                console.log('e', e);
                // e.data.tags = e.data.styles;
                // e.data.url = d.basic_information.resource_url;
                e.data.key = i;
                e.data.id = i;
                e.data.thumb = d.basic_information.thumb;
                results.push(e.data);
              }),
          Promise.resolve()
        )
        .catch(onError)
        .then(() => {
          const reducedResults = results.map(
            ({
              artists,
              rating,
              genres,
              country,
              styles,
              title,
              released,
              images,
              tags,
              thumb,
              key,
              uri
            }) => ({
              artists,
              rating,
              genres,
              country,
              styles,
              title,
              released,
              images,
              tags,
              thumb,
              key,
              uri
            })
          );

          // console.log('prune', prune(reducedResults));
          const resultStr = prune(reducedResults);
          const resultArray = JSON.parse(resultStr);
          // console.log('resultArray', resultArray);
          // window.open(
          //   `data:text/json,${encodeURIComponent(resultStr)}`,
          //   '_blank'
          // );
          onDataLoaded(
            resultArray.map(d => {
              d.tags = d.styles;
              return d;
            })
          );
        })
        .catch(onError);
    });
}
export default getData;
