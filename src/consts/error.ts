export const ERROR = {
  NO_ROOM: { status: 404, message: "The url of room is invalid." },
  NO_PERMISSION: {
    status: 403,
    message: "Permission denied.",
  },
  NO_USER: { status: 404, message: "Can't find user to register as admin" },
  NO_CARD: { status: 404, message: "Can't find card" },
  NO_TOKEN: {
    status: 401,
    message: "Can not find token in your request.",
  },
  FAILED_TO_UPDATE: {
    status: 500,
    message: "Failed to update",
  },
  FAILED_TO_REGISTER_AS_ADMIN: {
    status: 500,
    message: "Failed to register new admin",
  },
  INVALID_TOKEN: {
    status: 404,
    message: "Invalid user token",
  },
};

export default ERROR;
