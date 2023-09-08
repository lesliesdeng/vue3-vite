const CryptoJS = require('crypto-js')

// 16进制转字符串
const getKey = function (str: string) {
  let val = ''
  const arr = str.split(',')
  let i = 0
  for (; i < arr.length; i++) {
    val += String.fromCharCode(parseInt(arr[i], 16))
  }
  return val
  // return str.split(",").map(s => String.fromCharCode(parseInt(s,16))).join('');
}

let keyStr = ''

// Encrypt
/**
 *   var word = 18;
 *   var key = ***********
 *   result x6iDoHcQFw6qu+8LHJf1IQ==
 * @param {*等待加密的字符串} word
 */
/**
 * 安全临时方案；用16进制字符串数字混淆处理加密关键字
 */
const aes = getKey('41,45,53')
const ecb = getKey('45,43,42')
const kcs = getKey('50,6b,63,73,37')
const config = {
  words: ['d186', 'c6g7', '82g0', 'V3a1', 'k8E8', 'q097', 'A6gup'],
  fn: function (str: string) {
    const now = new Date().getTime()
    const arr2 = (now + '').split('')
    const strArr = str.split('')
    arr2.forEach(function (item, index) {
      delete strArr[1 * (index + 1) + index]
    })
    return strArr.join('')
  }
}

const encrypt = function (word?: any, MultiKey?: string) {
  if (!keyStr) {
    keyStr = config.fn(config.words.join(''))
  }

  const key = CryptoJS.enc.Utf8.parse(MultiKey || keyStr)

  if (!word) return word
  const str = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS[aes].encrypt(str, key, {
    mode: CryptoJS.mode[ecb],
    padding: CryptoJS.pad[kcs]
  })
  return encrypted.toString()
}
const decrypt = function (encrypted: string) {
  if (!keyStr) {
    keyStr = config.fn(config.words.join(''))
  }
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const decryptedData = CryptoJS[aes].decrypt(encrypted, key, {
    mode: CryptoJS.mode[ecb],
    padding: CryptoJS.pad[kcs]
  })
  return decryptedData.toString(CryptoJS.enc.Utf8)
}

export { encrypt, decrypt }
