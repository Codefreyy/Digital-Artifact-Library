// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const users = (await db.collection('user').get()).data

  const isRegister = users.some(user => user.username === event.userForm.username)

  if (!isRegister) {
    db.collection('user').add({
      data: {
        username: event.userForm.username,
        password: event.userForm.password,
        like: [],
        collection: []
      }
    })
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    isRegister
  }
}