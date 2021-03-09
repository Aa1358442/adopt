<template>
  <div>
    <el-row>
      <el-col :span="15">
        <div>
          <el-table
            :data="shares.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="name" label="发布者姓名"></el-table-column>
            <el-table-column prop="date" label="发布日期"></el-table-column>
            <el-table-column align="right" width="180">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="medium"
                  placeholder="输入姓名关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="info"
                  size="small"
                  @click="getShareInfo(scope.$index, scope.row)">详细信息</el-button>
                <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除当前分享文章吗？"
                  @confirm="deleteShare(scope.$index, scope.row)"
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
      <el-col :span="9">
        <div style="background-color: #C3ECFF;padding: 20px;">
          <el-form :label-position="labelPosition" :rules="rules"  ref="share" label-width="60px" :model="share">
            <el-form-item>
              <h3 style="font-size: 25px;color: #67c23a;margin: 20px;padding: 0px">添加修改</h3>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="share.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="descs">
              <el-input type="textarea" v-model="share.descs" :autosize="{ minRows: 5}" placeholder="请输入分享的内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addShare('share')">立即发布</el-button>
              <el-button type="success"  @click="resetForm('share')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: "Admin_shares",
      data(){
        return{
          labelPosition: 'right',
          shares: [{
            id: '1',
            title: '养宠物狗的第一步',
            name: 'root',
            date: '2016-05-02',
          }],
          share:{
            id:'',
            title:'',
            descs:'',
            date:'',
          },
          rules:{
            title: [
              { required: true, message: '请输入标题', trigger: 'blur' },
            ],
            descs:[
              { required: true, message: '请输入具体内容', trigger: 'blur' }
            ],

          },
          search:'',
          total:0,
          pageSize:4,
          pageNow:1,
        }
      },
      methods:{
        getShareInfo(index,row){
          this.share.id=row.id;
          this.share.title=row.title;
          this.share.descs=row.descs;
          this.share.date=row.id;
        },
        deleteShare(index,row){
          let _this=this;
          this.$http.get("http://localhost:9150/shares/deleteShares?id="+row.id).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                message: '恭喜你,'+result.data.msg,
                type: 'success'
              });
              _this.findSharesList();
            }else {
              _this.$message.error(result.data.msg);
              _this.findSharesList();
            }
          })
        },
        addShare(share){
          let name=this.$cookies.get("loginName");
          let _this=this;
          this.$http.post("http://localhost:9150/shares/addShares?name="+name+"&title="+this.share.title+"&descs="+this.share.descs+"&id="+this.share.id).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                showClose: true,
                message: '恭喜你:'+result.data.msg,
                type: 'success'
              });
              _this.resetForm('share');
              _this.findSharesList();
            }else {
              _this.$message({
                showClose: true,
                message: '很遗憾:'+result.data.msg,
                type: 'error'
              });
              _this.resetForm('share');
            }
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.share.id='';
        },
        tableRowClassName({row, rowIndex}) {
          if (rowIndex%2 === 1) {
            return 'warning-row';
          } else if (rowIndex%2 === 0) {
            return 'success-row';
          }
          return '';
        },
        findPage(page){
          this.pageNow=page;
          this.findSharesList(page,this.pageSize);
        },
        findSize(size){
          this.pageSize=size;
          this.findSharesList(this.pageNow,size);
        },
        findSharesList(page,size){
          page=page?page:this.pageNow;
          size=size?size:this.pageSize;
          let _this=this;
          this.$http.get("http://localhost:9150/shares/findSharesList?pageNow="+page+"&pageSize="+size).then(function (result) {
            _this.shares=result.data.shares;
            _this.total=result.data.total;
          })
        },
      },
      created() {
        this.findSharesList();
      }
    }
</script>

<style scoped>

</style>
