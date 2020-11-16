import { splitArray } from './generic.js';

const apiUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/';

async function apiQuery(url, loader) {
  try {
    if (loader) {
      loader(true);
    }
    const res = await (await fetch(`${apiUrl}${url}`)).json();
    if (loader) {
      loader(false);
    }
    return res;
  } catch (e) {
    return console.error(e);
  }
}

// tested only on company/profile endpoint
const joinResult = (results) => {
  let parsedResult = [];
  [...results].forEach((result) => {
    if ('symbol' in result) {
      parsedResult.push(result);
    } else {
      parsedResult = parsedResult.concat(result.companyProfiles);
    }
  });
  return parsedResult;
};

const stockApi = {
  searchBar: async (query, loader) => apiQuery(`search?limit=10&exchange=NASDAQ&query=${query}`, loader),
  quote: async (query, loader) => apiQuery(`quote/${query}`, loader),
  company: async (query, loader) => {
    if (Array.isArray(query)) {
      const queries = splitArray(query, 3);
      return Promise
        .all(queries.map((q) => apiQuery(`company/profile/${q}`, loader)))
        .then((results) => joinResult(results))
        .catch((e) => console.error(e));
    }
    return apiQuery(`company/profile/${query}`, loader);
  },
  graph: async (query, loader) => apiQuery(`historical-price-full/${query}?serietype=line`, loader),
  mostActive: async (loader) => apiQuery('actives', loader),
};

export default stockApi;
