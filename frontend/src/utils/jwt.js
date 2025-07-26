import jwtDecode from "jwt-decode";

export const getUserFromToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};
