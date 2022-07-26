<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-gray" v-on:click="fnList">목록</button>
    </div>

    <div class="board-contents">
      <input type="text" v-model="title" class="w3-input w3-border" placeholder="제목을 입력해 주세용">
      <input type="text" v-model="author" class="w3-input w3-border" placeholder="작성자 명을 입력해줘">
    </div>

    <div class="board-contents">
      <textarea id="" cols="30" rows="10" v-model="content" class="w3-input w3-border" style="resize: none;"></textarea>
    </div>

    <div class="common-buttons">
      <button type="button" class="w3-button w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-gray" v-on:click="fnList">목록</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BoardWrite",
  data() {
    return {
      requestBody: this.$route.query,
      idx: this.$route.query.idx,

      title:'',
      author:'',
      content:'',
      regDt:'',
      viewCnt:''
    }
  },
  mounted () {
    this.viewDetail()
  },
  methods: {
    viewDetail() {
      if(this.idx !== undefined) {
        this.$axios.post(/*this.$serverUrl + */'/board/detail/' + this.idx, {
          params: this.requestBody
        }).then((res) => {
          this.title = res.data.data.title
          this.author = res.data.data.author
          this.content = res.data.data.content
          this.regDt = res.data.data.regDt
        }).catch((err) => {
          console.log(err)
          alert("상세 조회 실패\n로직을 잘 봐주세용")
        })
      }
    },
    fnList() {
      delete this.requestBody.idx
      this.$router.push({
        path: './list',
        query: this.requestBody
      })
    },
    fnView(idx) {
      this.requestBody.idx = idx
      this.$route.push({
        path: './derail',
        query: this.requestBody
      })
      },
    fnSave() {
      let apiUrl = '/board/regist'
      this.form = {
        "idx": this.idx,
        "title": this.title,
        "content": this.content,
        "author": this.author,
        "regDt": this.regDt
      }

      if (this.idx === undefined) {
        //INSERT
        this.$axios.post(apiUrl, this.form)
            .then(() => {
              alert('글이 저장되었습니다.')
              /*this.fnView(res.data.idx)*/
              this.fnList();
            }).catch((err) => {
          if (err.message.indexOf('Network Error') > -1) {
            alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
          }
        })
      } else {
        //UPDATE
        this.$axios.post(apiUrl, this.form)
            .then(() => {
              alert('글이 수정되었습니다.')
              /*this.fnView(res.data.idx)*/
              this.fnList();
            }).catch((err) => {
          if (err.message.indexOf('Network Error') > -1) {
            alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
          }
        })
      }
    }
  }
}
</script>
<style scoped>

</style>
