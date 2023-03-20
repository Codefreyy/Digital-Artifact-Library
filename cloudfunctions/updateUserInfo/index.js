// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const updateData = {}

  if (event.username) {
    updateData.username = event.username
  }
  if (event.like) {
    updateData.like = event.like
  }
  if (event.collection) {
    updateData.collection = event.collection
  }

  const res = await db.collection('user').where({
    _id: event.userId
  }).update({
    data: updateData
  })

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    res
  }
}