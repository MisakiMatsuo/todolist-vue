export const state = () => ({
  // ラベルの変数
  labels: [],
})
export const mutations = {
  // 作成したラベルをラベルデータに保存する
  // createLabel(state, label) {
  //   state.labels.push({
  //     text: label.text,
  //     value: label.id,
  //   })
  // },
  createLabel(state, label) {
    state.labels.push(label)
  },
}
// export const actions = {
//   add({ commit }, label) {
//     commit('createLabel', label)
//   },
// }
