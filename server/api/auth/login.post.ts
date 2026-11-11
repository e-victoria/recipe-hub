export default defineEventHandler(async (event) => startSession(event, 'auth/login', await readBody(event)))
