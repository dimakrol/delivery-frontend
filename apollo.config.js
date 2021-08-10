module.exports = {
  client: {
    includes: ['./src/**/*.tsx'],
    tagName: 'gql',
    service: {
      name: 'delivery-backend',
      url: 'http://localhost:5000/graphql'
    }
  }
}