import Lodash from 'lodash'

function getMonthDays (year, month) {
  var thisDate = new Date(year, month, 0) // 当天数为0 js自动处理为上一月的最后一天
  return thisDate.getDate()
}

export function mockData (date) {
  let d = new Date()
  let curM = String(d.getMonth() + 1).padStart(2, 0)

  let totalDay = curM === date.month ? d.getDate() : getMonthDays(date.year, date.month)

  let data = []

  for (let j = 1; j <= totalDay; j++) {
    data.push(
      [
        `${date.year}-${date.month}-${String(j).padStart(2, '0')}`,
        '',
        Lodash.random(0, 4),
      ],
    )
  }

  return data
}
