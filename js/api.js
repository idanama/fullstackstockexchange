const apiUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/';

const apiQuery = async (url, loader) => {
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
};

const stockApi = {
  searchBar: async (query, loader) => apiQuery(`search?limit=10&exchange=NASDAQ&query=${query}`, loader),
  company: async (query, loader) => apiQuery(`company/profile/${query}`, loader),
  graph: async (query, loader) => apiQuery(`historical-price-full/${query}?serietype=line`, loader),
};
