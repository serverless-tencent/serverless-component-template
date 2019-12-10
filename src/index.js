const { Component } = require('@serverless/core')
const { Capi } = require('@tencent-sdk/capi')
const { getTempKey } = require('./login')
const { DescribeService } = require('./apis')

class TencentComponent extends Component {
  async initCredential() {
    const temp = this.context.instance.state.status
    let { tencent } = this.context.credentials
    if (!tencent) {
      tencent = await getTempKey(temp)
      this.context.credentials.tencent = tencent
      this.context.instance.state.status = true
    }
  }

  async default(inputs = {}) {
    await this.initCredential()
    this.context.status('Deploying')

    const { region } = inputs

    const apig = new Capi({
      Region: region,
      AppId: this.context.credentials.tencent.AppId,
      SecretId: this.context.credentials.tencent.SecretId,
      SecretKey: this.context.credentials.tencent.SecretKey,
      Token: this.context.credentials.tencent.Token
    })

    const res = await DescribeService(apig, {
      Version: '2017-03-12',
      serviceId: 'service-7kqwzu92'
    })

    this.state = {
      region: region,
      serviceId: res.serviceId,
      serviceName: res.serviceName
    }
    const outputs = {
      region: region,
      serviceId: res.serviceId,
      serviceName: res.serviceName
    }

    await this.save()

    return outputs
  }

  // eslint-disable-next-line
  async remove(inputs = {}) {
    await this.initCredential()

    this.context.status('Removing')

    // const { state } = this
    // const { region } = state
    // init a clound api instance
    // const apig = new Capi({
    //   Region: region,
    //   AppId: this.context.credentials.tencent.AppId,
    //   SecretId: this.context.credentials.tencent.SecretId,
    //   SecretKey: this.context.credentials.tencent.SecretKey,
    //   Token: this.context.credentials.tencent.token,
    //   Version: '2017-03-12',
    //   serviceType: 'postgres',
    //   baseHost: 'api.qcloud.com'
    // })

    this.state = {}
    await this.save()
    return {}
  }
}

module.exports = TencentComponent
