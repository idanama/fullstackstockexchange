const apiUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/';

const apiQuery = async (url, format = 'json') => {
  // format : 'json' / 'text'
  try {
    return await (await fetch(`${apiUrl}${url}`))[format]();
  } catch (e) {
    console.error(e);
  }
};

const searchQuery = async (query) => {
  if (query) {
    try {
      searchBarLoader(true);
      const res = await apiQuery(`search?limit=10&exchange=NASDAQ&query=${query}`);
      searchBarLoader(false);
      return res;
    } catch (e) {
      console.error(e);
    }
  }
};

const companyQuery = async (symbol) => {
  if (symbol) {
    try {
      return await apiQuery(`company/profile/${symbol}`);
    } catch (e) {
      console.error(e);
    }
  }
};
const graphQuery = async (symbol) => {
  if (symbol) {
    try {
      return await apiQuery(`historical-price-full/${symbol}?serietype=line`);
    } catch (e) {
      console.error(e);
    }
  }
};
