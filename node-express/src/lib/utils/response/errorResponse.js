export default function errorResponse(res, code, message, details) {
  const payload = { message, details };

  res.status(code).json(payload);
}
