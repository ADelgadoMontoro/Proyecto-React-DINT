export const fetchAPI = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export const deleteAPI = async (url) => {
  const response = await fetch(url, {
    method: "DELETE",
  });
  return response.json();
};

export const addAPI = async (url, newItem) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newItem),
  });
  return response.json();
};

export const editAPI = async (url, updatedItem) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedItem),
  });
  return response.json();
};
