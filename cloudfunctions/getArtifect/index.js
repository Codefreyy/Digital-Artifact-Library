// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    filterTypeObj,
    type,
    keyword
  } = event
  const artifects = (await db.collection('artifect').get()).data

  console.log(filterTypeObj)

  let filterList = []
  if (filterTypeObj.categoryType === '全部类别' && filterTypeObj.dynastyType === '全部朝代') {
    filterList = artifects
  }

  if (filterTypeObj.categoryType === '类别' && filterTypeObj.dynastyType === '全部朝代') {
    filterTypeObj.categoryList.forEach(category => {
      artifects.forEach(artifect => {
        if (artifect.type_code === category) {
          filterList.push(artifect)
        }
      })
    })
  }

  if (filterTypeObj.categoryType === '全部类别' && filterTypeObj.dynastyType === '朝代') {
    filterTypeObj.dynastyList.forEach(dynasty => {
      artifects.forEach(artifect => {
        if (artifect.ear_code === dynasty) {
          filterList.push(artifect)
        }
      })
    })
  }

  if (filterTypeObj.categoryType === '类别' && filterTypeObj.dynastyType === '朝代') {
    function multiFilter(array, filters) {
      const filterKeys = Object.keys(filters);
      return array.filter((item) => {
        return filterKeys.every((key) => {
          if (!filters[key].length) return true;
          return !!~filters[key].indexOf(item[key]);
        });
      });
    }

    filterList = multiFilter(artifects, {
      type_code: filterTypeObj.categoryList,
      ear_code: filterTypeObj.dynastyList
    })
  }

  let res = []
  if (type === '名称') {
    res = filterList.filter(item => item.title.includes(keyword))
  } else {
    res = filterList.filter(item => item.No.includes(keyword))
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    artifects: res,
    total: res.length
  }
}