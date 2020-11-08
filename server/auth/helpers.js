const bcrypt = require('bcrypt');

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

const axios = require('axios');

const verifyReCaptchaToken = async (req, res, next) => {
  const token = req.body.recaptchaToken
  const secret = process.env.RECAPTCHA_SECRET_KEY // read secret key from environment
  if (token) {
    try {
      const URL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
      const { data } = await axios.post(URL)
      if (data.success) {
        next()
      } else {
        console.log(data)
        next(new Error('reCAPTCHA token validation failed'))
      }
    } catch (err) {
      next(err)
    }
  } else {
    next(new Error("recaptchaToken missing"))
  }
}

module.exports = {
  hashPassword,
  comparePasswords,
  loginRequired,
  verifyReCaptchaToken
}

