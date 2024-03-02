const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const tokenExtractor = (request, response, next) => {
  console.log('extracting token')
  request.token = getTokenFrom(request)
  console.log('token: ', request.token)
  next()
}

module.exports = tokenExtractor
