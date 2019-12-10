// timeout 5 minutes
const TIMEOUT = 5 * 60 * 1000

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function waitForStatus({
  callback,
  statusProp = 'status',
  // wait status
  targetStatus,
  // timeout mini seconds
  timeout,
  // start mini seconds
  start = Date.now(),
  // promise resolve
  resolve = null,
  // promise reject
  reject = null
}) {
  const now = Date.now()
  return new Promise(async (res, rej) => {
    try {
      resolve = resolve || res
      reject = reject || rej
      // timeout
      if (now - start > timeout) {
        reject(new Error('Request Timeout.'))
      }
      const detail = await callback()
      // 4: deploying, 1: created
      if (detail[statusProp] === targetStatus) {
        resolve(detail)
      } else {
        await sleep(1000)
        return waitForStatus({
          callback,
          statusProp,
          targetStatus,
          timeout,
          start,
          resolve,
          reject
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  TIMEOUT,
  waitForStatus,
  sleep
}
