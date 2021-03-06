// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 在登陆后同步用户数据，只获取前100条
 * -------output---------
 * tip_list   愿望列表
 * is_success
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  const collection = db.collection('love-tips')
  const LIMIT_NUM = 100
  try {
    var data = await collection.where(
      db.command.or([
        {
          self_id: wxContext.OPENID
        },
        {
          picker_id: wxContext.OPENID
        }
      ])
    ).limit(LIMIT_NUM).get()

    return {
      tip_list: data,
      is_success: true
    }
  }
  catch (err) {
    console.error(err)
    return {
      tip_list: [],
      is_success: false
    }
  }
}