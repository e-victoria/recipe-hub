export default defineEventHandler(async (event) => {
  const user = await startSession(event, 'auth/register', await readBody(event))
  setResponseStatus(event, 201)
  return user
})
