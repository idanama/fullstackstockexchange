function urlParams(name, value) {
  const params = new URLSearchParams(window.location.search);
  if (name && value) {
    params.set(name, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  } if (name && value === null) {
    params.delete(name);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  } else {
    return params.get(name);
  }
}

function splitArray(array, limit) {
  const result = [];
  let ii = 0;
  for (let i = 0; i < (array.length / limit); i += 1) {
    result.push(array.slice(ii, ii + limit));
    ii += limit;
  }
  return result;
}

export { urlParams, splitArray };
