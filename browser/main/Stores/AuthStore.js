/* global localStorage */
var Reflux = require('reflux')
var request = require('superagent')

var AuthActions = require('../Actions/AuthActions')

var apiUrl = 'http://localhost:8000/'

var AuthStore = Reflux.createStore({
    init: function () {
      this.listenTo(AuthActions.login, this.login)
      this.listenTo(AuthActions.register, this.register)
      this.listenTo(AuthActions.logout, this.logout)
      this.listenTo(AuthActions.updateProfile, this.updateProfile)
    },
    // Reflux Store
    login: function (input) {
      request
        .post(apiUrl + 'auth/login')
        .send(input)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.trigger(null)
            return
          }

          var user = res.body.user
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('user', JSON.stringify(res.body.user))

          this.trigger({
            status: 'loggedIn',
            data: user
          })
        }.bind(this))
    },
    register: function (input) {
      request
        .post(apiUrl + 'auth/signup')
        .send(input)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.trigger(null)
            return
          }

          var user = res.body.user
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('user', JSON.stringify(res.body.user))

          this.trigger({
            status: 'registered',
            data: user
          })
        }.bind(this))
    },
    logout: function () {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      this.trigger({
        status: 'loggedOut'
      })
    },
    updateProfile: function (input) {
      request
        .put(apiUrl + 'auth/user')
        .set({
          Authorization: 'Bearer ' + localStorage.getItem('token')
        })
        .send(input)
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.trigger(null)
            return
          }

          var user = res.body
          localStorage.setItem('user', JSON.stringify(user))

          this.trigger({
            status: 'userProfileUpdated',
            data: user
          })
        }.bind(this))
    },
    // Methods
    check: function () {
      if (localStorage.getItem('token')) return true
      return false
    },
    getUser: function () {
      var userJSON = localStorage.getItem('user')
      if (userJSON == null) return null
      return JSON.parse(userJSON)
    }
})

module.exports = AuthStore