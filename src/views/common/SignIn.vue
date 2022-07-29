<template>
  <div>
    <div>
      <h2>Please Sign in</h2>
      <div id="loginForm">
<!--        <form @submit.prevent="fnLogin">-->
        <form >
          <p>
            <input class="w3-input" name="uid" placeholder="ID...." v-model="userId"><br>
          </p>
          <p>
            <input name="password" class="w3-input" placeholder="Password...." v-model="userPw" type="password">
          </p>
          <p>
            <button type="submit" class="w3-button w3-green w3-round" @click="fnLogin">Sign In</button>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  data() {
    return {
      userId: '',
      userPw: '',
    }
  },
  methods: {
    ...mapActions(['login']), //vuex/actions에 있는 login 함수

    async fnLogin() {
      if(this.userId === '' ){
        alert('ID를 입력해 주세용')
        return
      }

      if(this.userPw === ''){
        alert('password를 입력해 주세용')
        return
      }

      try {
        let loginResult = await this.login({userId: this.userId, userPw: this.userPw})
        if (loginResult) {this.goToPages()}
      } catch (err) {
        if(err.message.indexOf('Network Error') > -1){
          alert('서버에 접속할 수 없습니다. 상태를 확인해주세요')
        } else {
          alert('로그인 정보를 불러올 수 없습니다.')
        }
      }
    },
    goToPages() {
      this.$router.push({
        name: 'BoardList'
      })
    }
  },
  computed: {
    ...mapGetters({
      errorState: 'getErrorState'
    })
  }
}
</script>

<style scoped>
  #loginForm {
    width: 500px;
    margin: auto;
  }
</style>
