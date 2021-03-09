<template>
  <div>
    <el-row>
      <el-col :span="14">
        <div>
          <el-table
            :data="messages"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="title" label="活动标题" width="100"></el-table-column>
            <el-table-column prop="date" label="活动时间" width="120"></el-table-column>
            <el-table-column prop="content" label="活动内容"></el-table-column>
            <el-table-column align="right" width="180">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  @change="searchNews"
                  clearable
                  size="medium"
                  placeholder="输入活动名关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="getNewsInfo(scope.$index, scope.row)">详细信息</el-button>
                <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除当前新闻吗？"
                  @confirm="deleteNews(scope.$index, scope.row)"
                >
                  <el-button size="mini"
                             type="danger"
                             slot="reference">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="margin: 15px 0px"
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
        </div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: #C3ECFF;margin-left: 20px;">
          <el-form :label-position="labelPosition" label-width="80px" style="padding-bottom: 20px;" :model="news" ref="news" :rules="rules">
            <el-form-item>
              <h2 style="font-size: 25px; margin: 0px;padding: 0px">发布宠物活动帖子</h2>
            </el-form-item>
            <el-form-item label="活动标题" prop="title">
              <el-input v-model="news.title" placeholder="请输入活动标题"></el-input>
            </el-form-item>
            <el-form-item label="活动内容" prop="content">
              <el-input type="textarea" v-model="news.content" :autosize="{ minRows: 5}" placeholder="请填写活动内容"></el-input>
            </el-form-item>
            <el-form-item label="活动时间" prop="date">
              <el-col>
                <el-date-picker type="date" placeholder="选择日期:修改信息时必须重新选择一次日期" v-model="news.date" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="活动图片">
              <el-upload
                class="upload-demo"
                ref="upload"
                :on-change="pre"
                accept=".jpg,.jpeg,.png"
                :on-exceed="exceedImage"
                :limit="1"
                multiple
                action="#"
                :file-list="news.image"
                list-type="list"
                :auto-upload="false">
                <el-button slot="trigger" size="middle" type="primary">选择图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且最多只能上传1张</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="publishNews">立即发布</el-button>
              <el-button type="success" @click="resetForm('news')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: "Admin_news",
      data(){
        return{
          fileList:[],
          messages:[{
            title:'hhh',
            date: '2016-05-02',
            content: '王小虎',
          }],
          search:'',
          total:0,
          pageSize:8,
          pageNow:1,
          labelPosition: 'right',
          news: {
            id:'',
            title: '',
            content:'',
            date:'',
            image:[]
          },
          rules: {
            title: [
              { required: true, message: '活动标题', trigger: 'blur' },
            ],
            content: [
              { required: true, message: '请输入活动内容', trigger: 'blur' }
            ],
            date: [
              { required: true, message: '请输入活动内容', trigger: 'blur' }
            ]
          }

        }
      },
      methods:{
        deleteNews(index,row){
          let _this=this;
          this.$http.get("http://localhost:9150/news/deleteNews?id="+row.id).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                message: '恭喜你,'+result.data.msg,
                type: 'success'
              });
              _this.findNewsList();
            }else {
              _this.$message.error(result.data.msg);
            }
          })
        },
        searchNews(){
          this.findNewsList(this.pageNow,this.pageSize,this.search);
        },
        pre(file,fileList){
          this.news.image.push(file.raw);
        },
        exceedImage(file,fileList){
          this.$message({
            showClose: true,
            message: '警告哦，只能上传1张图片',
            type: 'warning'
          });
        },
        publishNews(){
          let form=new FormData();
          form.append("title",this.news.title);
          form.append("content",this.news.content);
          form.append("date",this.news.date);
          form.append("number",this.news.id);
          for (let i=0;i<this.news.image.length;i++){
            form.append("files",this.news.image[i],this.news.image[i].name);
          }
          let _this=this;
          this.$http({
            method:"post",
            url:"http://localhost:9150/news/addNews",
            headers:{
              'Content-type':'multipart/form-data'
            },
            data:form
          }).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                showClose: true,
                message: '恭喜你:'+result.data.msg,
                type: 'success'
              });
              _this.resetForm('news');
              _this.findNewsList();
            }else {
              _this.$message({
                showClose: true,
                message: '很遗憾:'+result.data.msg,
                type: 'error'
              });
              _this.resetForm('news');
            }
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.$refs['upload'].clearFiles();
          this.news.id='';
        },
        /*宠物收养模块函数*/
        getNewsInfo(index,row){
          this.news.id=row.id;
          this.news.title=row.title;
          this.news.date=row.date;
          this.news.content=row.content;
        },
        //跳转到第几页
        findPage(page){
          this.pageNow=page;
          this.findNewsList(page,this.pageSize);
        },
        //改变没有显示条数
        findSize(size){
          this.pageSize=size;
          this.findNewsList(this.pageNow,size);
        },
        //所有收养宠物信息记录
        findNewsList(page,size){
          page=page?page:this.pageNow;
          size=size?size:this.pageSize;
          let _this=this;
          this.$http.get("http://localhost:9150/news/findNewsList?pageNow="+page+"&pageSize="+size+"&title="+this.search).then(function (result) {
            _this.messages=result.data.news;
            _this.total=result.data.total;
          })
        },
        tableRowClassName({row, rowIndex}) {
          if (rowIndex%2 === 1) {
            return 'warning-row';
          } else if (rowIndex%2 === 0) {
            return 'success-row';
          }
          return '';
        },
      },
      created() {
        this.findNewsList();
      }
    }
</script>

<style scoped>

</style>
