export const performAuthenticatedGetActionAsync = async (url) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(url, {
    method: "GET",
    ...getHttpHeaders(true),
  });
};

export const performPostActionAsync = async (url, data) => {
  return await callAPIAsync(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...getHttpHeaders(false),
  });
};

export const performAuthenticatedPostActionAsync = async (url, data) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...getHttpHeaders(true),
  });
};

export const performAuthenticatedPutActionAsync = async (url, data) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(url, {
    method: "PUT",
    body: JSON.stringify(data),
    ...getHttpHeaders(true),
  });
};

export const performAuthenticatedDeleteActionAsync = async (url, data) => {
  if (!checkJwt()) {
    return {
      error: true,
      tokenExpired: true,
      message: "Invalid token. Please login again!",
    };
  }
  return await callAPIAsync(url, {
    method: "DELETE",
    ...(data && { body: JSON.stringify(data) }),
    ...getHttpHeaders(true),
  });
};

const callAPIAsync = async (url, options) => {
  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      return {
        error: true,
        tokenExpired: true,
        message: "Token expired. Please login again!",
      };
    }

    return await response.json();
  } catch (err) {
    return {
      error: true,
      message: err,
    };
  }
};

const checkJwt = () => {
  return localStorage.getItem("jwt");
};

function getHttpHeaders(withCredentials) {
  if (withCredentials) {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };
  }

  return {
    headers: {
      "Content-Type": "application/json",
    },
  };
}
