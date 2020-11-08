const bcrypt = require('bcrypt');
const axios = require('axios');

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12)
    const password_digest = await bcrypt.hash(password, salt)
    return password_digest
  } catch (err) {
    console.log('ERROR', err);
  }
}

const comparePasswords = async (candidatePassword, passwordDigest) => {
  try {
    const match = await bcrypt.compare(candidatePassword, passwordDigest)
    return match
  } catch (err) {
    console.log('ERROR', err)
  }
}

const loginRequired = (req, res, next) => {
  if (req.user) return next()
  res.status(401).json({
    payload: null,
    msg: "You need to be logged in to access this route",
    err: true
  })
}

const verifyReCaptchaToken = async (req, res, next) => {
  const token = req.body.recaptchaToken
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (token) {
    try {
      // call axios to verify token with google
      const URL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
      const { data } = await axios.post(URL)
      console.log('recaptcha verification:', data)
      if (data.success) {
        next()
      } else {
        let err = new Error('reCAPTCHA validation failed')
        next(err)
      }
    } catch (err) {
      next(err)
    }
  } else {
    let err = new Error('wrong token/token missing')
    next(err)
  }
}

module.exports = {
  hashPassword,
  comparePasswords,
  loginRequired,
  verifyReCaptchaToken
}

