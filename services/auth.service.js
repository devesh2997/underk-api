const { User, Merchant, Admin } = require('../models')
const validator = require('validator')
const { to, TE, isEmpty } = require('../services/util.service')

const getUniqueKeyFromBody = function (body) {
  // this is so they can send in 3 options unique_key, email, or phone and it will work
  let unique_key = body.unique_key
  if (typeof unique_key === 'undefined') {
    if (typeof body.email !== 'undefined') {
      unique_key = body.email
    } else {
      unique_key = null
    }
  }

  return unique_key
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody

const createAdmin = async adminInfo => {
  if (isEmpty(adminInfo)) TE('Admin info not provided')
  let email = adminInfo.email
  let password = adminInfo.password
  let err

  if (isEmpty(email)) TE('Please enter an email to create admin')

  if (isEmpty(password)) TE('Please enter a password to create admin')

  if (validator.isEmail(email)) {
    ;[err, admin] = await to(Admin.create(adminInfo))
    if (err) TE('admin already exists with that email')

    return admin
  } else {
    TE('A valid email  was not entered.')
  }
}
module.exports.createAdmin = createAdmin

const sendOTP = async function (country_code, mobile) {
  if (isEmpty(country_code)) TE('Country code not provided')

  if (isEmpty(mobile)) TE('Mobile number not provided')

  //TODO send otp

  return true
}
module.exports.sendOTP = sendOTP

const verifyOTP = async function (country_code, mobile, otp) {
  if (isEmpty(country_code)) TE('Country code not provided')

  if (isEmpty(module)) TE('Mobile number not provided')

  //TODO verify otp

  return true
}
module.exports.verifyOTP = verifyOTP

const authAdmin = async function (adminInfo) {
  // returns
  if (isEmpty(adminInfo)) TE('Email and password not provided.')
  let email = adminInfo.email
  let password = adminInfo.password

  if (isEmpty(email)) TE('Please enter an email to login')

  if (isEmpty(password)) TE('Please enter a password to login')

  let admin
  if (validator.isEmail(email)) {
    ;[err, admin] = await to(Admin.findOne({ where: { email: email } }))
    if (err) TE(err.message)
  } else {
    TE('A valid email was not entered')
  }

  if (!admin) TE('Not registered')
  ;[err, admin] = await to(admin.comparePassword(password))

  if (err) TE(err.message)

  return admin
}
module.exports.authAdmin = authAdmin
