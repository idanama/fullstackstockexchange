function urlParams(name, value) {
  const params = new URLSearchParams(window.location.search);
  if (name && value) {
    params.set(name, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  } if (name && value === null) {
    params.delete(name);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  } else return params.get(name);
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

function percentMoji(percent, max = 0.05) {
  const positive = percent > 0;
  let emojis = [];
  if (positive) {
    emojis = ['🙃', '😀', '😁', '😆', '🤩', '🥳', '🤑'];
  } else {
    emojis = ['😐', '🙁', '😞', '😒', '😮', '😣', '😨'];
  }
  const pos = Math.min(
    Math.round(((emojis.length - 1) / max) * Math.abs(percent)),
    emojis.length - 1,
  );
  return emojis[pos];
}

const loaderFill = '<div class="flex-center loader"><img src="/res/icons/loader.svg"></div>';

export {
  urlParams, splitArray, percentMoji, loaderFill,
};
