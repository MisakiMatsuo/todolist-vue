<template>
  <div class="col-2">
    <div class="side mr-3">
      <!--トップ-->
      <div class="p-3 pb-4"><a href="#">トップ</a></div>
      <!--ラベルで絞り込みエリア-->
      <!--<template v-if="labels.length === 0"></template>-->
      <b-form-group
        v-slot="{ ariaDescribedby }"
        class="label pl-3"
        label="ラベル"
      >
        <b-form-checkbox-group
          v-model="selectedLabel"
          :options="labels"
          :aria-describedby="ariaDescribedby"
          class="mb-3"
          stacked
          switches
        ></b-form-checkbox-group>
        <b-button v-b-modal.modal-prevent-closing class="button mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            fill="currentColor"
            class="bi bi-plus"
            viewBox="0 0 21 21"
          >
            <path
              d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
            />
          </svg>
          新しいラベルを作成
        </b-button>
      </b-form-group>
      <!--新規ラベルの作成画面-->
      <b-modal
        id="modal-prevent-closing"
        ref="modal"
        title="新しいラベルを作成"
        @show="resetModal"
        @ok="handleOk"
      >
        <!--ラベルの入力フォーム-->
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label-for="label-input"
            invalid-feedback="ラベルを入力してください"
          >
            <b-form-input
              id="label-input"
              v-model="label"
              :state="labelState"
              placeholder="ラベル名を入力"
              required
            ></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
      <!--優先度で絞り込みエリア-->
      <b-form-group
        v-slot="{ ariaDescribedby }"
        class="label pl-3"
        label="優先度"
      >
        <b-form-checkbox-group
          v-model="selectedStatus"
          :options="statusOptions"
          :aria-describedby="ariaDescribedby"
          class="mb-3"
          stacked
          switches
        ></b-form-checkbox-group>
      </b-form-group>
      <!--期限で絞り込みエリア-->
      <b-form-group
        v-slot="{ ariaDescribedby }"
        class="label pl-3"
        label="期限"
      >
        <b-form-select
          v-model="selectedLimit"
          label="期限"
          :options="limitOptions"
          class="limit-date-input mb-2"
        ></b-form-select>
        <b-form-radio
          v-model="selectedLimitOut"
          :aria-describedby="ariaDescribedby"
          value="A"
          >期限切れを含まない</b-form-radio
        >
        <b-form-radio
          v-model="selectedLimitOut"
          :aria-describedby="ariaDescribedby"
          value="B"
          class="mb-3"
          >期限切れのみ表示</b-form-radio
        >
      </b-form-group>
      <!--リセットエリア-->
      <b-button type="reset" class="button ml-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          class="bi bi-arrow-repeat"
          viewBox="0 0 21 21"
        >
          <path
            d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
          />
          <path
            fill-rule="evenodd"
            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
          />
        </svg>
        すべてリセット
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar.vue',
  data() {
    return {
      // ラベルの変数
      label: '',
      labels: [],
      labelState: null,
      selectedLabel: [],
      // ステータスの変数
      selectedStatus: [],
      statusOptions: [
        { text: 'High', value: 'High' },
        { text: 'Middle', value: 'Middle' },
        { text: 'Low', value: 'Low' },
      ],
      // 期限の変数
      selectedLimit: null,
      limitOptions: [
        { value: null, text: '指定しない' },
        { value: '本日', text: '本日' },
        { value: '明日', text: '明日' },
        { value: '今週', text: '今週' },
        { value: '来週', text: '来週' },
        { value: '今月', text: '今月' },
      ],
      selectedLimitOut: '',
      text: '',
    }
  },
  methods: {
    // ラベル作成画面を初期化する
    resetModal() {
      this.label = ''
      this.labelState = null
    },
    // フォームの入力値をチェックして有効を返す
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity()
      this.labelState = valid
      return valid
    },
    // バリデーションチェック後にラベルを更新する
    handleSubmit() {
      // 無効な場合は何もしない
      if (!this.checkFormValidity()) {
        return
      }
      // 作成したラベルをラベルデータに保存する
      this.labels.push(this.label)
      // モーダルを閉じる
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    // OKボタン押下でラベルを更新する
    handleOk(bvModalEvt) {
      // バリデーションを満たす場合のみ送信する
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
  },
}
</script>

<style scoped>
.col-2 {
  padding: 0;
}
.side {
  width: 100%;
  height: 100%;
  background: #efefef;
}
.button {
  color: #707070;
  background: #efefef;
  border: none;
  padding: 0;
}
.limit-date-input {
  width: 14vw;
}
</style>
