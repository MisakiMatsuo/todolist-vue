<template>
  <div class="col-10 container-fluid">
    <div class="row">
      <!--編集画面のモーダル-->
      <b-modal id="modal-lg" size="lg" @ok="handleOk">
        <!--タスク名-->
        <template #modal-header="">
          <b-form-input
            id="name-input"
            v-model="editedTaskName"
            class="task-name"
            required
          ></b-form-input>
          <button
            type="button"
            aria-label="Close"
            class="close"
            @click="hideEditModal"
          >
            ×
          </button>
        </template>
        <!--セレクトボックス-->
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <!--ステータスの選択-->
            <b-form-select v-model="editedTaskStatus" class="select-box mr-1">
              <b-form-select-option
                v-for="editedTaskStatusOption in editedTaskStatusOptions"
                :key="editedTaskStatusOption.value"
                :value="editedTaskStatusOption.value"
              >
                {{ editedTaskStatusOption.text }}
              </b-form-select-option>
            </b-form-select>
            <!--優先度の選択-->
            <b-form-select v-model="editedTaskPriority" class="select-box mr-1">
              <b-form-select-option
                v-for="editedTaskPriorityOption in editedTaskPriorityOptions"
                :key="editedTaskPriorityOption.value"
                :value="editedTaskPriorityOption.value"
              >
                {{ editedTaskPriorityOption.text }}
              </b-form-select-option>
            </b-form-select>
            <!--ラベルの選択-->
            <b-form-select v-model="editedTaskLabel" class="select-box mr-1">
              <b-form-select-option
                v-for="editedTaskLabelOption in editedTaskLabelOptions"
                :key="editedTaskLabelOption.value"
                :value="editedTaskLabelOption.value"
              >
                {{ editedTaskLabelOption.text }}
              </b-form-select-option>
            </b-form-select>
          </div>
          <!--作成日の表示-->
          <div class="create-date">作成日：{{ selectedTask.createDate }}</div>
        </div>
        <div class="d-flex justify-content-between">
          <!--詳細テキストの入力-->
          <b-form-textarea
            id="textarea"
            v-model="editedTaskDetail"
            placeholder="クリックして詳細を入力"
            class="task-detail mr-3 mt-3 p-3"
          ></b-form-textarea>
          <!--期限の選択-->
          <div class="mt-3">
            <p class="limit-name">期限：{{ context }}</p>
            <b-calendar
              v-model="context"
              locale="en-US"
              @context="onContext"
            ></b-calendar>
          </div>
        </div>
      </b-modal>
    </div>
    <!--Todoリストエリア-->
    <div id="todo" class="col-4 p-3">
      <b-form-input
        v-model="search"
        class="mr-sm-2 search"
        placeholder="ワード検索"
      ></b-form-input>
      <h1 class="pb-1 ml-4">Todo</h1>
      <!--新規タスクの追加-->
      <b-form-input
        v-model="todoTaskName"
        placeholder="タスクを追加"
        class="input-task mb-2 ml-4"
        @keyup.enter.prevent="addTodo"
      ></b-form-input>
      <!--追加タスクの描画エリア-->
      <ul class="list-group ml-4">
        <template v-for="task in filteredWordTasks">
          <li
            v-if="task.status === 'todo'"
            :key="task.id"
            class="list-group-item"
            @click="edit(task)"
          >
            <b-card
              :class="{ selected: isActiveTask === task }"
              @mouseover="mouseOverAction(task)"
              @mouseout="mouseOutAction"
            >
              <b-card-title class="d-flex justify-content-between">
                <div>
                  {{ task.name }}
                  <svg
                    v-if="task.priority === isTaskPriority"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    class="bi bi-flag-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"
                    />
                  </svg>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-x"
                  :class="{ _selected: isActiveTask === task }"
                  viewBox="0 0 16 16"
                  @click.stop="deleteTask(task)"
                >
                  <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </b-card-title>
              <b-card-text class="small text-muted text-right">
                {{ task.limitDate }}</b-card-text
              >
            </b-card>
          </li>
        </template>
      </ul>
    </div>
    <!--Doingリストエリア-->
    <div id="doing" class="col-4 p-3">
      <h1 class="pb-1 ml-4">Doing</h1>
      <!--新規タスクの追加-->
      <b-form-input
        v-model="doingTaskName"
        placeholder="タスクを追加"
        class="input-task mb-2 ml-4"
        @keyup.enter.prevent="addDoing"
      ></b-form-input>
      <!--追加タスクの描画エリア-->
      <ul class="list-group ml-4">
        <template v-for="task in filteredWordTasks">
          <li
            v-if="task.status === 'doing'"
            :key="task.id"
            class="list-group-item"
            @click="edit(task)"
          >
            <b-card
              :class="{ selected: isActiveTask === task }"
              @mouseover="mouseOverAction(task)"
              @mouseout="mouseOutAction"
            >
              <b-card-title class="d-flex justify-content-between">
                <div>
                  {{ task.name }}
                  <svg
                    v-if="task.priority === isTaskPriority"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    class="bi bi-flag-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"
                    />
                  </svg>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-x"
                  :class="{ _selected: isActiveTask === task }"
                  viewBox="0 0 16 16"
                  @click.stop="deleteTask(task)"
                >
                  <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </b-card-title>
              <b-card-text class="small text-muted text-right">
                {{ task.limitDate }}</b-card-text
              >
            </b-card>
          </li>
        </template>
      </ul>
    </div>
    <!--Doneリストエリア-->
    <div id="done" class="col-4 p-3">
      <h1 class="pb-1 ml-4">Done</h1>
      <!--新規タスクの追加-->
      <b-form-input
        v-model="doneTaskName"
        placeholder="タスクを追加"
        class="input-task mb-2 ml-4"
        @keyup.enter.prevent="addDone"
      ></b-form-input>
      <!--追加タスクの描画エリア-->
      <ul class="list-group ml-4">
        <template v-for="task in filteredWordTasks">
          <li
            v-if="task.status === 'done'"
            :key="task.id"
            class="list-group-item"
            @click="edit(task)"
          >
            <b-card
              :class="{ selected: isActiveTask === task }"
              @mouseover="mouseOverAction(task)"
              @mouseout="mouseOutAction"
            >
              <b-card-title class="d-flex justify-content-between">
                <div>
                  {{ task.name }}
                  <svg
                    v-if="task.priority === isTaskPriority"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    fill="currentColor"
                    class="bi bi-flag-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"
                    />
                  </svg>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-x"
                  :class="{ _selected: isActiveTask === task }"
                  viewBox="0 0 16 16"
                  @click.stop="deleteTask(task)"
                >
                  <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  />
                </svg>
              </b-card-title>
              <b-card-text
                class="small text-right"
                :class="compareLimitAndToday(task)"
              >
                {{ task.limitDate }}</b-card-text
              >
            </b-card>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Main.vue',
  data() {
    return {
      tasks: [],
      // タスク追加時の変数
      todoTaskName: '',
      doingTaskName: '',
      doneTaskName: '',
      // クリック選択されたタスクの変数
      selectedTask: '',
      // 編集画面の各オプションの変数
      editedTaskName: '',
      editedTaskStatus: '',
      editedTaskStatusOptions: [
        { text: 'Todo', value: 'todo' },
        { text: 'Doing', value: 'doing' },
        { text: 'Done', value: 'done' },
      ],
      editedTaskPriority: '',
      editedTaskPriorityOptions: [
        { text: 'High', value: 'high' },
        { text: 'Middle', value: 'middle' },
        { text: 'Low', value: 'low' },
      ],
      editedTaskLabel: '',
      editedTaskLabelOptions: [
        { text: '未分類', value: '' },
        { text: '仕事', value: 'job' },
        { text: '家計', value: 'finance' },
        { text: '旅行', value: 'trip' },
      ],
      editedTaskLimitDate: '',
      editedTaskCreateDate: '',
      editedTaskDetail: '',
      context: null,
      id: 0,
      // タスクがマウスオーバーされた状態の変数
      isActiveTask: '',
      // 重要度High状態の変数
      isTaskPriority: 'high',
      // ワード検索の変数
      search: '',
      // 現在の日付オブジェクトを入れる変数
      nowDateObject: new Date(),
      // タスクの期限オブジェクトを入れる変数
      limitDateObject: '',
    }
  },
  methods: {
    // 10秒後ごとに期限切れタスクの絞り込みをする
    // filterExpiredTask() {
    //   const A = setInterval(this.compareLimitAndToday, 10000)
    //   console.log(A)
    // },
    // 期限切れタスクを絞り込む
    compareLimitAndToday(task) {
      // 今日の日付とタスク期限を比較する
      console.dir(task)
      if (task.limitDate === '') {
        return []
      }
      if (task.limitDate.getTime() < this.nowDateObject.getTime()) {
        return ['text-danger']
      } else {
        return ['text-muted']
      }
    },
    // Todoフォームで新規タスクを追加する
    addTodo() {
      // フォームが空の場合は表示しない
      if (this.todoTaskName.length === 0) {
        return
      }
      // タスクをデータに追加する
      const addTask = {
        name: this.todoTaskName,
        id: this.id,
        status: 'todo',
        priority: 'middle',
        label: '',
        limitDate: '',
        createDate: this.createDateStr(),
        detail: '',
      }
      this.tasks.push(addTask)
      this.id++
      this.todoTaskName = ''
    },
    // Doingフォームで新規タスクを追加する
    addDoing() {
      // フォームが空の場合は表示しない
      if (this.doingTaskName.length === 0) {
        return
      }
      // タスクをデータに追加する
      const addTask = {
        name: this.doingTaskName,
        id: this.id,
        status: 'doing',
        priority: 'middle',
        label: '',
        limitDate: '',
        createDate: this.createDateStr(),
        detail: '',
      }
      this.tasks.push(addTask)
      this.id++
      this.doingTaskName = ''
    },
    // Doneフォームで新規タスクを追加する
    addDone() {
      // フォームが空の場合は表示しない
      if (this.doneTaskName.length === 0) {
        return
      }
      // タスクをデータに追加する
      const addTask = {
        name: this.doneTaskName,
        id: this.id,
        status: 'done',
        priority: 'middle',
        label: '',
        limitDate: '',
        createDate: this.createDateStr(),
        detail: '',
      }
      this.tasks.push(addTask)
      this.id++
      this.doneTaskName = ''
    },
    // タスクを削除する
    deleteTask(task) {
      // 確認画面でOK押下時のみ削除する
      if (confirm('本当に削除してもよろしいですか？')) {
        task.status = 'delete'
      }
    },
    // new Date()の値をyyyy-mm-ddの文字列に変換する
    createDateStr() {
      const date = new Date()
      const Y = date.getFullYear()
      const M = ('00' + (date.getMonth() + 1)).slice(-2)
      const D = ('00' + date.getDate()).slice(-2)
      return `${Y}-${M}-${D}`
    },
    // hoverしたタスクを強調する
    mouseOverAction(task) {
      this.isActiveTask = task
    },
    // hoverしていない状態は何もしない
    mouseOutAction() {
      this.isActiveTask = ''
    },
    // 選択したタスクの編集画面を表示する
    edit(task) {
      // 選択タスクをdata保存してHMTLから参照可能にする
      this.selectedTask = task
      // 編集画面を初期化する
      this.editedTaskName = this.selectedTask.name
      this.editedTaskStatus = this.selectedTask.status
      this.editedTaskPriority = this.selectedTask.priority
      this.editedTaskLabel = this.selectedTask.label
      this.editedTaskDetail = this.selectedTask.detail
      // 選択タスクの編集画面を表示する
      this.$bvModal.show('modal-lg')
    },
    // 編集画面の期限を定義する
    onContext(ctx) {
      this.context = ctx.selectedDate
    },
    // OKボタン押下で編集内容を更新する
    handleOk() {
      // 変更部分の新しい値を返す
      this.handleName()
      this.handleStatus()
      this.handlePriority()
      this.handleLabel()
      this.handleLimitDate()
      this.handleDetail()
      // 変更部分のデータを更新する
      this.tasks.splice(this.selectedTask.id, 1, {
        ...this.selectedTask,
        name: this.editedTaskName,
        status: this.editedTaskStatus,
        priority: this.editedTaskPriority,
        label: this.editedTaskLabel,
        limitDate: this.context,
        detail: this.editedTaskDetail,
      })
      console.log(this.tasks)
      // this.filterExpiredTask()
      // 編集画面を閉じる
      this.hideEditModal()
    },
    // タスク名を変更した場合は新しい値を返す
    handleName() {
      if (!(this.editedTaskName === this.selectedTask.name)) {
        return this.editedTaskName
      }
    },
    // ステータスを変更した場合は新しい値を返す
    handleStatus() {
      if (!(this.editedTaskStatus === this.selectedTask.status)) {
        return this.editedTaskStatus
      }
    },
    // 優先度を変更した場合は新しい値を返す
    handlePriority() {
      if (!(this.editedTaskPriority === this.selectedTask.priority)) {
        return this.editedTaskPriority
      }
    },
    // ラベルを変更した場合は新しい値を返す
    handleLabel() {
      if (!(this.editedTaskLabel === this.selectedTask.label)) {
        return this.editedTaskLabel
      }
    },
    // 期限を変更した場合は新しい値を返す
    handleLimitDate() {
      if (!(this.editedTaskLimitDate.length === 0)) {
        return this.editedTaskLimitDate
      }
    },
    // タスク詳細を変更した場合は新しい値を返す
    handleDetail() {
      if (!(this.editedTaskDetail.length === 0)) {
        return this.editedTaskDetail
      }
    },
    // 編集画面を閉じる
    hideEditModal() {
      this.$nextTick(() => {
        this.$bvModal.hide('modal-lg')
      })
    },
  },
  // 検索ワードに該当するタスクを絞り込む
  computed: {
    filteredWordTasks() {
      return this.tasks.filter((task) => {
        return (
          this.search === task.name ||
          this.search === task.detail ||
          this.search === ''
        )
      })
    },
  },
}
</script>

<style scoped>
/* 編集画面のレイアウト */
.task-name {
  border: none;
  border-bottom: solid 1px #ced4da;
}
.select-box {
  width: 180px;
}
.create-date {
  font-size: 0.8rem;
  color: #707070;
  padding: 0.5rem 0.5rem 0 0;
  text-align: right;
}

/* タスクエリア全体のレイアウト */
h1 {
  font-size: 1.5rem;
}
#todo h1 {
  border-bottom: solid 2px #40ddf2;
}
#doing h1 {
  border-bottom: solid 2px #4fedb0;
}
#done h1 {
  border-bottom: solid 2px #eaea63;
}

/* タスク追加フォームのレイアウト */
.input-task {
  width: 93%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
input::placeholder {
  color: #268bef;
}
input:focus::placeholder {
  color: transparent;
}

/* 登録タスクエリアのレイアウト */
.list-group {
  padding: 0;
  overflow: scroll;
  height: 70vh;
}
.list-group-item {
  border: none;
  padding: 0;
  margin-bottom: 0.6rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.bi-flag-fill {
  color: red;
}
.bi-x {
  display: none;
}
.selected {
  transition: 0.3s;
  border: solid 1px #a9a9a9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}
._selected {
  display: block;
  transition: 0.3s;
}
</style>
