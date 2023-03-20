const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const pxToRpx = (v_px, windowWidth) => {
  let onePxToRpx = 750 / windowWidth;
  let v_rpx = v_px * onePxToRpx;

  return Math.floor(v_rpx)
}

export {
  formatTime,
  formatNumber,
  pxToRpx
}