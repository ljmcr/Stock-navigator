export const fetcher = (url: string) =>
  fetch(url).then((response) => {
    if (response.ok) return response.json();
    else throw new Error(response.statusText);
  });
