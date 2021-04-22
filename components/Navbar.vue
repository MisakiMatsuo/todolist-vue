<template>
  <div>
    <!--ロゴ-->
    <b-navbar class="navbar">
      <b-navbar-brand tag="h1" class="navbar-brand col-2">Todos</b-navbar-brand>
      <b-collapse id="nav-collapse" class="col-10 pr-4 pl-4" is-nav>
        <!--並べ替えセレクトボックス-->
        <b-navbar-nav class="nav d-flex justify-content-between">
          <b-nav-form>
            <b-button
              id="asc-btn"
              variant="outline-secondary"
              class="mr-1 ml-3"
              type="button"
              @click="$store.dispatch('switchOrder')"
            >
              <!--昇順アイコン-->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-sort-alpha-down"
                viewBox="0 1 16 16"
                :hidden="$store.state.isAscHidden"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.082 5.629L9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"
                />
                <path
                  d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"
                />
              </svg>
              <!--降順アイコン-->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-sort-alpha-down-alt"
                viewBox="0 1 16 16"
                :hidden="$store.state.isDiscHidden"
              >
                <path
                  d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"
                />
                <path
                  fill-rule="evenodd"
                  d="M10.082 12.629L9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"
                />
                <path
                  d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"
                />
              </svg>
            </b-button>
            <b-form-select
              id="sort"
              v-model="selected"
              label="sort"
              class="sort"
              :options="sortOptions"
              @change="saveSort"
            >
            </b-form-select>
          </b-nav-form>
          <b-nav-form>
            <!--検索窓-->
            <b-form-input
              class="mr-2 search"
              placeholder="検索"
              @input="saveSearch"
            ></b-form-input>
            <!--ログインアイコン-->
            <b-nav-item-dropdown class="mr-0" right>
              <template #button-content>
                <em>
                  <img
                    class="icon"
                    src="https://placekitten.com/g/30/30"
                    alt="Kitten"
                  />
                </em>
              </template>
              <b-dropdown-item disabled
                ><strong>hoge@cloud-ace.jp</strong></b-dropdown-item
              >
              <b-dropdown-item>ログアウト</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Navbar.vue',
  data() {
    return {
      selected: 0,
      sortOptions: [
        { value: 0, text: '作成日順' },
        { value: 1, text: '重要度の高い順' },
        { value: 2, text: '期限が近い順' },
        { value: 3, text: 'タスク名順' },
      ],
      isHidden: false,
    }
  },
  methods: {
    // 検索窓の入力状態を保存する
    saveSearch(e) {
      this.$store.dispatch('saveSearch', e)
    },
    saveSort(e) {
      this.$store.dispatch('saveSort', e)
    },
  },
}
</script>

<style scoped>
.navbar {
  background: #efefef;
  padding: 0;
}
.navbar-brand {
  padding: 0.8rem;
  margin: 0;
  background: #fff;
}
#sort {
  border: none;
}
.icon {
  border-radius: 50%;
}
.nav {
  flex-basis: 100%;
}

/* 検索フォーム */
.search {
  border: none;
}
.search::placeholder {
  color: #c6c6c6;
}
.search:focus::placeholder {
  color: transparent;
}
</style>
