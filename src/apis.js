function HttpError(code, message) {
  this.code = code || 0
  this.message = message || ''
}

HttpError.prototype = Error.prototype

function apiFactory(actions) {
  const apis = {}
  actions.forEach((action) => {
    apis[action] = async (apig, inputs) => {
      const res = await apig.request(
        {
          Action: action,
          RequestClient: 'ServerlessComponent',
          Token: apig.options.Token || null,
          ...inputs
        },
        // this is preset options for apigateway
        {
          Version: '2017-03-12',
          ServiceType: 'apigateway',
          bashHost: 'api.qcloud.com',
          path: '/v2/index.php'
        }
      )
      if (res.code !== 0) {
        throw new HttpError(res.code, res.message)
      }
      return res
    }
  })

  return apis
}

const ACTIONS = ['DescribeService']
const APIS = apiFactory(ACTIONS)

module.exports = APIS
