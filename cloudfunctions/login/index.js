// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let token = ''
  let id = ''
  const users = await db.collection('user').get()
  const res = users.data.find(user => user.username === event.username)

  if (res) {
    if (res.password === event.password) {
      token = 'yq99029'
      id = res._id
    }
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    token,
    id,
    res
  }
}