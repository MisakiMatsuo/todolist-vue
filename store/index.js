import _ from 'lodash'

export const state = () => ({
  // ラベルデータ
  labels: [],
  // タスクデータ
  tasks: [],
  // 検索窓の入力
  search: '',
  // ラベルの絞り込み選択
  selectedLabel: [],
  // 優先度の絞り込み選択
  selectedPriority: [],
  // 期間の選択状態
  selectedLimitDate: null,
  // 期限切れの絞り込み選択
  selectedLimitDateOut: 0,
  // 現在時刻
  now: new Date(),
  // 並べ替えの選択
  selectedSort: null,
  // 昇順/降順の選択
  isAscHidden: false,
  isDiscHidden: true,
})

export const actions = {
  // ラベルを作成する処理
  createLabel({ commit, state }, task) {
    commit('CREATE_LABEL', task)
  },
  // タスクを追加する処理
  addTask({ commit, state }, task) {
    commit('ADD_TASK', task)
  },
  // タスクを編集する処理
  editTask({ commit, state }, task) {
    commit('EDIT_TASK', task)
  },
  // 検索窓の入力状態を保存する処理
  saveSearch({ commit, state }, search) {
    commit('SAVE_SEARCH', search)
  },
  // ラベルの選択状態を保存する処理
  saveLabel({ commit, state }, label) {
    commit('SAVE_LABEL', label)
  },
  // 優先度の選択状態を保存する処理
  savePriority({ commit, state }, priority) {
    commit('SAVE_PRIORITY', priority)
  },
  // 期限切れの選択状態を保存する処理
  saveLimitDateOut({ commit, state }, limitDateOut) {
    commit('SAVE_LIMITED_OUT', limitDateOut)
  },
  // 並び替えの選択状態を保存する処理
  saveSort({ commit, state }, select) {
    commit('SAVE_SORT', select)
  },
  // 昇順/降順の選択状態を保存する処理
  switchOrder({ commit }) {
    commit('SWITCH_ORDER')
  },
  // タスクを削除する処理
  deleteTask({ commit, state }, task) {
    commit('DELETE_TASK', task)
  },
  // 選択状態をリセットする処理
  resetFilter({ commit }) {
    commit('RESET_FILTER')
  },
}

export const mutations = {
  // 作成したラベルをラベルデータに保存する
  CREATE_LABEL(state, label) {
    state.labels.push(label)
  },
  // 入力タスクをタスクデータに保存する
  ADD_TASK(state, task) {
    state.tasks.push({
      name: task.name,
      id: task.id,
      status: task.status,
      priority: 0,
      label: null,
      limitDate: null,
      limitDateStr: '',
      createDate: task.createDate,
      detail: '',
      delete: false,
    })
  },
  // 編集タスクをタスクデータに保存する
  EDIT_TASK(state, task) {
    state.tasks.splice(task.id, 1, {
      ...task,
      name: task.name,
      status: task.status,
      priority: task.priority,
      label: task.label,
      limitDate: task.limitDate,
      limitDateStr: task.limitDateStr,
      createDate: task.createDate,
      detail: task.detail,
      delete: false,
    })
  },
  // 検索内容をデータに保存する
  SAVE_SEARCH(state, search) {
    state.search = search
  },
  // ラベルの選択をデータに保存する
  SAVE_LABEL(state, label) {
    state.selectedLabel = label
  },
  // 優先度の選択をデータに保存する
  SAVE_PRIORITY(state, priority) {
    state.selectedPriority = priority
  },
  // 期限切れの選択をデータに保存する
  SAVE_LIMITED_OUT(state, limitDateOut) {
    state.selectedLimitDateOut = limitDateOut
  },
  // 並び替えの選択状態を保存する
  SAVE_SORT(state, select) {
    state.selectedSort = select
  },
  // 昇順/降順の選択状態を保存する
  SWITCH_ORDER(state) {
    if (state.isAscHidden) {
      state.isAscHidden = false
      state.isDiscHidden = true
    } else {
      state.isAscHidden = true
      state.isDiscHidden = false
    }
  },
  // タスクを削除する
  DELETE_TASK(state, task) {
    // 確認画面でOK押下時のみ削除
    if (confirm('本当に削除してもよろしいですか？')) {
      task.delete = true
    }
  },
  // 絞り込み選択をリセットする
  RESET_FILTER(state) {
    state.selectedLabel = []
    state.selectedPriority = []
    state.selectedLimitDate = null
    state.selectedLimitDateOut = ''
    state.selectedSort = null
  },
}

export const getters = {
  filterTask: (state) => {
    // 絞り込みタスクを入れる配列
    const hitTasks = []
    // 検索窓の入力ワードで絞り込む
    if (state.search.length) {
      hitTasks.push(
        state.tasks.filter((task) => {
          return (
            task.name.includes(state.search) ||
            task.detail.includes(state.search)
          )
        })
      )
      // 検索窓が未入力の場合は全タスクを返す
    } else {
      hitTasks.push(state.tasks)
    }
    // 選択したラベルで絞り込む
    if (state.selectedLabel.length) {
      hitTasks.push(
        state.tasks.filter((task) => {
          return state.selectedLabel.includes(task.label)
        })
      )
    }
    // 選択した優先度で絞り込む
    if (state.selectedPriority.length) {
      hitTasks.push(
        state.tasks.filter((task) => {
          return state.selectedPriority.includes(task.priority)
        })
      )
    }
    // 期限切れを含まないで絞り込む
    if (state.selectedLimitDateOut === 1) {
      hitTasks.push(
        state.tasks.filter((task) => {
          return (
            task.limitDate === null ||
            !(task.limitDate.getTime() < state.now.getTime())
          )
        })
      )
      // 期限切れのみで絞り込む
    } else if (state.selectedLimitDateOut === 2) {
      hitTasks.push(
        state.tasks.filter((task) => {
          return (
            task.limitDate !== null &&
            task.limitDate.getTime() < state.now.getTime()
          )
        })
      )
    } else {
      // 期限切れを指定しない
      hitTasks.push(state.tasks)
    }
    // 検索結果がヒットしなかった場合は全てを返す（初期状態）
    if (!hitTasks.length) {
      return state.tasks
    }
    // 並べ替えの優先度順を選択
    if (state.selectedSort === 1) {
      const _hitTasks = _.intersectionBy(...hitTasks, 'id')
      if (state.isDiscHidden) {
        return _.sortBy(_hitTasks, ['priority'])
        // 降順
      } else {
        return _.sortBy(_hitTasks, ['priority']).reverse()
      }
      // 並べ替えの期限が近い順を選択
    } else if (state.selectedSort === 2) {
      const _hitTasks = _.intersectionBy(...hitTasks, 'id')
      if (state.isDiscHidden) {
        return _.sortBy(_hitTasks, ['limitDate'])
        // 降順
      } else {
        return _.sortBy(_hitTasks, ['limitDate']).reverse()
      }
      // 並べ替えのタスク名順を選択
    } else if (state.selectedSort === 3) {
      const _hitTasks = _.intersectionBy(...hitTasks, 'id')
      if (state.isDiscHidden) {
        return _.sortBy(_hitTasks, ['name'])
        // 降順
      } else {
        return _.sortBy(_hitTasks, ['name']).reverse()
      }
      // 並べ替え指定なしの場合は絞り込んだタスク配列の積集合を返す
    } else if (state.isDiscHidden) {
      return _.intersectionBy(...hitTasks, 'id')
      // 降順
    } else {
      return _.intersectionBy(...hitTasks, 'id').reverse()
    }
  },
}
