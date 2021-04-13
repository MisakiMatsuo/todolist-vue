<template>
  <div>
    <!--ロゴ-->
    <b-navbar toggleable="lg" class="navbar">
      <b-navbar-brand tag="h1" href="#">Todos</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!--並べ替え-->
        <b-navbar-nav>
          <b-nav-item-dropdown text="並べ替え" right>
            <b-dropdown-item href="#">優先度順</b-dropdown-item>
            <b-dropdown-item href="#">期限の近い順</b-dropdown-item>
            <b-dropdown-item href="#">作成日順</b-dropdown-item>
            <b-dropdown-item href="#">タスク名順</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
        <!--検索-->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              class="mr-sm-2 search"
              placeholder="ワード検索"
            ></b-form-input>
          </b-nav-form>
          <!--アイコン-->
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>
                <img
                  class="icon"
                  src="https://placekitten.com/g/30/30"
                  alt="Kitten"
                />
              </em>
            </template>
            <b-dropdown-item href="#">ログアウト</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Navbar.vue',
}
</script>

<style scoped>
.navbar {
  background: #efefef;
}
#nav-collapse {
  width: 50vw;
}
.icon {
  border-radius: 50%;
}

/* 検索フォーム */
.search::placeholder {
  color: #c6c6c6;
}
.search:focus::placeholder {
  color: transparent;
}
</style>
