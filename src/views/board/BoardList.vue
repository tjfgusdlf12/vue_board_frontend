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
        <tr v-for="(row, idx) in list" :key="idx">
          <td>{{ row.idx }}</td>
          <td><a v-on:click="viewDetail(`${row.idx}`)" style="cursor: pointer">{{ row.title }}</a></td>
          <td>{{ row.content }}</td>
          <td>{{ row.viewCnt }}</td>
          <td>{{ row.regDt}}</td>
          <td>{{ row.author}}</td>
          <td><button type="button" class="w3-button w3-round w3-red" v-on:click="fnDelete(`${row.idx}`)">삭제</button></td>
        </tr>
      </tbody>
    </table>
    <div class="pagination w3-bar w3-padding-16 w3-small" v-if="paging.totalListCnt > 0">
      <span class="pg">
        <a href="javascript:;" @click="fnPage(1)" class="first w3-button w3-border">&lt;&lt;</a>
        <a href="javascript:;" v-if="paging.startPage > 10" @click="fnPage(`${paging.startPage-1}`)" class="prev w3-button w3-border">&lt;</a>
        <template v-for=" (n,index) in paginavigation()">
            <template v-if="paging.page==n">
                <strong class="w3-button w3-border w3-green" :key="index">{{ n }}</strong>
            </template>
            <template v-else>
                <a class="w3-button w3-border" href="javascript:;" @click="fnPage(`${n}`)" :key="index">{{ n }}</a>
            </template>
        </template>
        <a href="javascript:;" v-if="paging.totalPageCnt > paging.endPage"
           @click="fnPage(`${paging.endPage+1}`)" class="next w3-button w3-border">&gt;</a>
        <a href="javascript:;" @click="fnPage(`${paging.totalPageCnt}`)" class="last w3-button w3-border">&gt;&gt;</a>
      </span>
    </div>

<!--    <div>
      <select v-model="search.srchType">
        <option v-for="item in srchTypeList" :value="item.value" :key="item.value">{{ item.text }}</option>
      </select>
      &nbsp;
      <input type="text" v-model="keyword" @keyup.enter="fnPage()">
      &nbsp;
      <button @click="fnPage()">검색</button>
    </div>-->

    <div>
      <select v-model="search.srchType">
        <option v-for="item in srchTypeList" :value="item.value" :key="item.value">{{ item.text }}</option>
      </select>
      &nbsp;
      <input type="text" v-model="search.srchKeyword" @keyup.enter="fnGetList()">
      &nbsp;
      <button @click="fnGetList()">검색</button>
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
      paging: {},
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      search: {
        srchType: '',
        srchKeyword: '',
        page: this.page,
        size: this.size
      },
      srchTypeList: [
        { value: '', text: '전체' },
        { value: 1, text: '제목' },
        { value: 2, text: '내용' },
        { value: 3, text: '작성자'}
      ],
      /*keyword: this.$route.query.keyword,*/
      paginavigation: function () { //페이징 처리 for문 커스텀
        let pageNumber = [] //;
        let startPage = this.paging.startPage;
        let endPage = this.paging.endPage;
        for (let i = startPage; i <= endPage; i++) pageNumber.push(i);
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
        srchKeyword: this.srchKeyword,
        srchType: this.srchType,
        page: this.page,
        size: this.size
      }

      this.$axios.post("/board/list",this.search /*{
        params: this.search,
      }*/).then((res) => {
        if(res.request){
          this.list = res.data.data
          this.paging = res.data.pagination
          this.no = this.paging.totalListCnt - ((this.paging.page - 1) * this.paging.pageSize)
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
