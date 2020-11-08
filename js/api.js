const apiUrl = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?limit=10&exchange=NASDAQ&query=';

const searchQuery = async (query) => {
  if (query) {
    try {
      searchBarLoader(true);
      const res = await (await fetch(apiUrl + query)).json();
      searchBarLoader(false);
      return res;
    } catch (e) {
      console.error(e);
    }
  }
};
