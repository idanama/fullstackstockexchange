const debounce = (callback, delay = 500) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
};

const urlParams = (name, value) => {
  const params = new URLSearchParams(window.location.search);
  if (name && value) {
    params.set(name, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  } else if (name) {
    return params.get(name);
  }
};

const splitArray = (array, limit) => {
  const result = [];
  let ii = 0;
  for (let i = 0; i < (array.length / limit); i += 1) {
    result.push(array.slice(ii, ii + limit));
    ii += limit;
  }
  return result;
};

export { debounce, urlParams, splitArray };
