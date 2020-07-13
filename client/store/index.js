// export const modules = {
// }


const bodyOnly = /[?&]body_only([=&]|$)/.test(location.search)
export const state = () => ({
  userData: {},
  bodyOnly,

  notifications: 0,
  notiInfomation: [],
  notiNotify: [],
  notiCommission: [],

  reloadRules: false,
})

export const getters = {
  userData (state) {
    return state.userData
  },
  reloadRules (state) {
    return state.reloadRules
  },
  bodyOnly: state => state.bodyOnly,
}

export const mutations = {
  setUserInfo (state, data) {
    state.userData = data
  },
  setNotifications (state, data) {
    state.notifications = data
  },
  setInfomation (state, data) {
    state.notiInfomation = data
  },
  setNotify (state, data) {
    state.notiNotify = data
  },
  setCommission (state, data) {
    state.notiCommission = data
  },
  updateReloadRules (state, data) {
    state.reloadRules = data
  },
}
