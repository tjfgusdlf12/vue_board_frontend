<template>
  <div class="board-List">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnWrite">등록</button>
    </div>
    <table class="w3-table-all">
      <thead>
        <tr>
          <th>No</th>
          <th>제목</th>
          <th>내용</th>
          <th>조회수</th>
          <th>등록일시</th>
          <th>작성자</th>
          <th>삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row,idx) in list" :key="idx">
          <td>{{ row.idx }}</td>
          <td><a v-on:click="viewDetail(`${row.idx}`)">{{ row.title }}</a></td>
          <td>{{ row.content }}</td>
          <td>{{ row.viewCnt }}</td>
          <td>{{ row.author}}</td>
          <td>{{ row.regDt}}</td>
          <td><button type="button" class="w3-button w3-round w3-red" v-on:click="fnDelete(`${row.idx}`)">삭제</button></td>
        </tr>
      </tbody>
    </table>
    <div class="pagination w3-bar w3-padding-16 w3-small"  v-if="paging.total_list_cnt > 0">
      <span class="pg">
        <a href="javascript:;" @click="fnPage(1)" class="first w3-button w3-border">&lt;&lt;</a>
        <a href="javascript:;" v-if="paging.start_page > 10" @click="fnPage(`${paging.start_page-1}`)" class="prev w3-button w3-border">&lt;</a>
        <template v-for=" (n,index) in pagination()">
          <template v-if="paging.page == n">
              <strong class="w3-button w3-border w3-green" :key="index">{{ n }}</strong>
          </template>
          <template v-else>
              <a class="w3-button w3-border" href="javascript:;" @click="fnPage(`${n}`)" :key="index">{{ n }}</a>
          </template>
        </template>
        <a href="javascript:;" v-if="paging.total_page_cnt > paging.end_page"
           @click="fnPage(`${paging.end_page+1}`)" class="next w3-button w3-border">&gt;</a>
        <a href="javascript:;" @click="fnPage(`${paging.total_page_cnt}`)" class="last w3-button w3-border">&gt;&gt;</a>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "BoardList",
  data() {//변수 생성
    return {
      requestBody: {},
      list: {},
      no: '',
      paging: {
        block: 0,
        end_page: 0,
        next_block: 0,
        page: 0,
        page_size: 0,
        prev_block: 0,
        start_index: 0,
        start_page: 0,
        total_block_cnt: 0,
        total_list_cnt: 0,
        total_page_cnt: 0,
      }, //페이징 데이터
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      keyword: this.$route.query.keyword,
      pagination: function () { //페이징 처리 for문 커스텀
        let pageNumber = [] //;
        let start_page = this.paging.start_page;
        let end_page = this.paging.end_page;
        for (let i = start_page; i <= end_page; i++) pageNumber.push(i);
        return pageNumber;
      }
    }
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      this.requestBody = { // 데이터 전송
        keyword: this.keyword
      }

      this.$axios.post(/*this.$serverUrl + */"/board/list", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {
        if(res.request){
          this.list = res.data.data
        }

      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },
    viewDetail(idx){
      this.requestBody.idx = idx
      this.$router.push({
        path: './detail',
        query: this.requestBody
      })
    },
    fnWrite() {
      this.$router.push({
        path:'./write'
      })
    },
    fnPage(n) {
      if(this.page !== n) {
        this.page = n
        this.fnGetList()
      }
    },
    fnDelete(idx) {
      if (!confirm("삭제하시겠습니까?")) return

      this.$axios.post('/board/delete/' + idx, {

      }).then(() => {
        alert('삭제되었습니다.')
        this.fnGetList()
      }).catch((err) => {
        console.log(err);
      })
    }
  }
}
</script>
