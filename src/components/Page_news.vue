<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-input
          placeholder="请输入新闻内容"
          v-model="search"
          @change="searchNews"
          clearable>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" v-for="item in news" :key="news.id">
        <el-card :body-style="{margin:'0px'}" style="height: 430px;overflow-y:auto">
          <img :src="item.image" class="image">
          <div style="font-weight: bold">
            <ul style="margin: 0px;padding: 0px;list-style-type: none;text-align: left">
              <li style="height: 60px;font-size: small;color: cornflowerblue">活动标题：<span>{{item.title}}</span></li>
              <li style="font-size: small;color: #cf9236;">活动时间：<span>{{item.date}}</span></li>
              <li style="font-size: small;line-height: 30px;color: #67c23a">活动内容：<span>{{item.content}}</span></li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-pagination style="margin-top: 15px;"
                       layout="prev, pager, next,jumper,total,sizes"
                       :page-size="pageSize"
                       :total="total"
                       :current-page="pageNow"
                       :page-sizes="[2,4,6,8,10]"
                       prev-text="上一页"
                       next-text="下一页"
                       background
                       small
                       @current-change="findPage"
                       @size-change="findSize">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import logo01 from "../assets/IndexImgs/logo01.jpg";
    import logo02 from "../assets/IndexImgs/logo02.jpg";
    import logo03 from "../assets/IndexImgs/logo03.jpg";
    import logo04 from "../assets/IndexImgs/logo04.jpg";
    import logo05 from "../assets/IndexImgs/logo05.jpg";
    import logo06 from "../assets/IndexImgs/logo06.jpg";
    import logo07 from "../assets/IndexImgs/logo07.jpg";
    import logo08 from "../assets/IndexImgs/logo08.jpg";

    export default {
      name: "Page_news",
      data(){
        return{
          news:[{
            id:'1',
            title:'第十六届宠物博览会',
            date:'2020-12-12',
            content:'宠物再北京市海淀区清华大学计算机与科学研究元丢失',
            image:'',
          }],
          search:'',
          total:0,
          pageSize:4,
          pageNow:1,
        }
      },
      methods: {
        getInfo() {

        },
        searchNews(){
          this.findNewsList(this.pageNow,this.pageSize,this.search);
        },
        findPage(page){
          this.pageNow=page;
          this.findNewsList(page,this.pageSize,this.search);
        },
        findSize(size){
          this.pageSize=size;
          this.findNewsList(this.pageNow,size,this.search);
        },
        findNewsList(page,size,title){
          page=page?page:this.pageNow;
          size=size?size:this.pageSize;
          title=title?title:this.search;
          let _this=this;
          this.$http.get("http://localhost:9150/news/findNewsList?pageNow="+page+"&pageSize="+size+"&title="+title).then(function (result) {
            _this.news=result.data.news;
            let newsList=result.data.news;
            for (let i=0;i<newsList.length;i++){
              if (newsList[i].images.length){
                _this.news[i].image="data:image/jpeg;base64,"+newsList[i].images[0].image;
              }
            }
            _this.total=result.data.total;
          })
        }
      },
      created() {
        this.findNewsList();
      }
    }
</script>

<style scoped>
  .image{
    height: 150px;
    width: 100%;
  }
</style>
