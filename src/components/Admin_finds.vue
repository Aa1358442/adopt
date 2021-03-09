<template>
  <div>
    <el-row>
      <el-col :span="14">
        <div>
          <el-table
            :data="finds.filter(data => !searchFind || data.name.toLowerCase().includes(searchFind.toLowerCase()))"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="宠物名" width="100"></el-table-column>
            <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
            <el-table-column align="right" width="180">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="searchFind"
                  size="medium"
                  clearable
                  placeholder="输入姓名关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="getFindInfo(scope.$index, scope.row)">详细信息</el-button>
                <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除当前寻找信息吗？"
                  @confirm="deleteFinds(scope.$index, scope.row)"
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
                         :page-size="pageSizeFind"
                         :total="totalFind"
                         :current-page="pageNowFind"
                         :page-sizes="[2,4,6,8,10]"
                         prev-text="上一页"
                         next-text="下一页"
                         background
                         small
                         @current-change="findFindPage"
                         @size-change="findFindSize">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: #C3ECFF;margin-left: 20px;">
          <el-form :label-position="labelPosition" label-width="80px" style="padding-bottom: 20px;" :model="findsContent" ref="findsContent" :rules="rules">
            <el-form-item>
              <h2 style="font-size: 25px; margin: 0px;padding: 0px">发布宠物寻找帖子</h2>
            </el-form-item>
            <el-form-item label="宠物姓名" prop="name">
              <el-input v-model="findsContent.name"></el-input>
            </el-form-item>
            <el-form-item label="宠物描述" prop="desc">
              <el-input type="textarea" v-model="findsContent.desc" :autosize="{ minRows: 5}" placeholder="请描述失踪的宠物信息"></el-input>
            </el-form-item>
            <el-form-item label="图片上传">
              <el-upload
                class="upload-demo"
                ref="upload"
                :on-change="pre"
                accept=".jpg,.jpeg,.png"
                :on-exceed="exceedImage"
                :limit="5"
                multiple
                action="#"
                :file-list="fileList"
                list-type="list"
                :auto-upload="false">
                <el-button slot="trigger" size="middle" type="primary">选择图片</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且最多只能上传5张</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="publishFinds">立即发布</el-button>
              <el-button @click="resetForm('findsContent')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

    export default {
      name: "Admin_finds",
      data(){
        return{
          fileList:[],
          labelPosition: 'right',
          finds:[{
            id: '20160202',
            name: '王小虎',
            phone:'13187823445',
            descs:'',
          }],
          searchFind:'',
          totalFind:0,
          pageSizeFind:4,
          pageNowFind:1,
          findsContent: {
            number:'',
            name: '',
            desc:'',
          },
          rules: {
            name: [
              { required: true, message: '请输入宠物姓名', trigger: 'blur' },
            ],
            desc: [
              { required: true, message: '请输入描述信息', trigger: 'blur' }
            ]
          }
        }
      },
      methods:{
        deleteFinds(index,row){
          let _this=this;
          this.$http.get("http://localhost:9150/finds/deleteFinds?id="+row.id).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                message: '恭喜你,'+result.data.msg,
                type: 'success'
              });
              _this.findFindList();
            }else {
              _this.$message.error(result.data.msg);
              _this.findFindList();
            }
          })
        },
        pre(file,fileList){
          this.fileList.push(file.raw);
        },
        exceedImage(file,fileList){
          this.$message({
            showClose: true,
            message: "只能上传3张图片",
            type: 'warning'
          });
        },
        getFindInfo(index,row){
          this.findsContent.desc=row.descs;
          this.findsContent.name=row.name;
          this.findsContent.number=row.id;
        },
        //跳转到第几页
        findFindPage(page){
          this.pageNowFind=page;
          this.findFindList(page,this.pageSizeFind);
        },
        //改变没有显示条数
        findFindSize(size){
          this.pageSizeFind=size;
          this.findFindList(this.pageNowFind,size);
        },
        //所有收养宠物信息记录
        findFindList(page,size) {
          page = page ? page : this.pageNowFind;
          size = size ? size : this.pageSizeFind;
          let phone=this.$cookies.get("loginPhone");
          let _this = this;
          this.$http.get("http://localhost:9150/finds/findFindsListByPhone?pageNow=" + page + "&pageSize=" + size+"&phone="+phone).then(function (result) {
            _this.finds = result.data.finds;
            _this.totalFind = result.data.total;
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.findsContent.number='';
        },
        publishFinds(){
          let form=new FormData();
          form.append("phone",this.$cookies.get("loginPhone"));
          form.append("pname",this.$cookies.get("loginName"));
          form.append("name",this.findsContent.name);
          form.append("desc",this.findsContent.desc);
          form.append("number",this.findsContent.number);
          for (let i=0;i<this.fileList.length;i++){
            form.append("files",this.fileList[i],this.fileList[i].name);
          }
          let _this=this;
          this.$http({
            method:"post",
            url:"http://localhost:9150/finds/addFinds",
            headers:{
              'Content-type':'multipart/form-data'
            },
            data:form
          }).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                message: '恭喜你,'+result.data.msg,
                type: 'success'
              });
              _this.findFindList();
              _this.resetForm('findsContent');
            }else {
              _this.$message({
                message: result.data.msg,
                type: 'error'
              });
            }
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
        this.findFindList();
      }

    }
</script>

<style scoped>

</style>
