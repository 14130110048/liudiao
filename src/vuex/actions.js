// test
export const increment = ({ commit }) => {
  commit('INCREMENT')
}
export const decrement = ({ commit }) => {
  commit('DECREMENT')
}
//yuyan
export const setLangs = ({ commit },args) => {
  commit('SETLANGS',args)
}
