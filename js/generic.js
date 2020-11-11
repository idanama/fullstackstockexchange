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

export { debounce, urlParams };
