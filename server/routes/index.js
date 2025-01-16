const express = require('express')
const registerUser = require('../controller/registerUser')
const userDetails = require('../controller/userDetails')
const logout = require('../controller/logout')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')
const verifyOtp = require('../controller/VerifyOtp')
const guestAccountVerification = require('../controller/guestAccount')
const login = require('../controller/login')
const guestDetails = require('../controller/guestDetails')
const searchGuestUser = require('../controller/searchGuestUser')

const router = express.Router()

// Craete user api

router.post('/register',registerUser)

router.post('/verify-otp',verifyOtp)

router.get("/user-details",userDetails)

router.get("/guest-details",guestDetails)

router.get('/logout',logout)

router.post('/update-user',updateUserDetails)

router.post('/search-user',searchUser)

router.post('/search-guest-user',searchGuestUser)

router.post('/guest-user',guestAccountVerification)

router.post('/login',login)


module.exports = router