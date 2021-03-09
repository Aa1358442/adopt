<template>
  <div>
    <el-row>
      <el-col :span="14">
        <div>
          <el-table
            :data="adopt.filter(data => !searchAdopt || data.name.toLowerCase().includes(searchAdopt.toLowerCase()))"
            style="width: 100%"
            :row-class-name="tableRowClassName">
            <el-table-column prop="name" label="发布用户名"></el-table-column>
            <el-table-column prop="phone" label="联系方式"></el-table-column>
            <el-table-column prop="address" label="宠物发现地址"></el-table-column>
            <el-table-column prop="date" label="发布日期"></el-table-column>
            <el-table-column prop="status" label="领养状态"></el-table-column>
            <el-table-column align="right" width="180">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="searchAdopt"
                  size="medium"
                  clearable
                  placeholder="输入姓名关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="success"
                  @click="getAdoptInfo(scope.$index, scope.row)">详细信息</el-button>
                <el-popconfirm
                  confirm-button-text='好的'
                  cancel-button-text='不用了'
                  icon="el-icon-info"
                  icon-color="red"
                  title="确定删除当前领养信息吗？"
                  @confirm="deleteAdopts(scope.$index, scope.row)"
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
                         :page-size="pageSizeAdopt"
                         :total="totalAdopt"
                         :current-page="pageNowAdopt"
                         :page-sizes="[2,4,6,8,10]"
                         prev-text="上一页"
                         next-text="下一页"
                         background
                         small
                         @current-change="findAdoptPage"
                         @size-change="findAdoptSize">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="10">
        <div style="background-color: #C3ECFF;">
          <el-form :label-position="labelPosition" label-width="80px" :model="adoptAdd" ref="adoptAdd" :rules="rules" style="padding-bottom: 20px;">
            <el-form-item>
              <h2 style="font-size: 25px; margin: 0px;padding: 0px">发布宠物领养帖子</h2>
            </el-form-item>
            <el-form-item label="发现地址" prop="address">
              <el-input v-model="adoptAdd.address" placeholder="请输入流浪宠物发现地址"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="content">
              <quill-editor v-model="adoptAdd.content"
                            ref="myQuillEditor"
                            style="background-color: #d9ecff;">
              </quill-editor>
            </el-form-item>
            <el-form-item label="图片描述">
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
              <el-button type="primary" @click="publishAdopts">立即发布</el-button>
              <el-button type="info"  @click="resetForm('adoptAdd')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: "Admin_adopts",
      data(){
        return{
          fileList:[],
          labelPosition: 'right',
          adopt:[{
            id:'',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            phone:'13187823445',
            status:'未被领养'
          }],
          searchAdopt:'',
          totalAdopt:0,
          pageSizeAdopt:4,
          pageNowAdopt:1,
          adoptAdd: {
            id:'',
            number:'',
            content: '',
            address:'',
          },
          rules: {
            address: [
              { required: true, message: '请输入流浪宠物的发现地址', trigger: 'blur' },
            ],
            content: [
              { required: true, message: '请输入流浪宠物的描述信息', trigger: 'blur' },
            ]
          }
        }
      },
      methods:{

        pre(file,fileList){
          this.fileList.push(file.raw);
        },
        exceedImage(file,fileList){
          alert("只能上传3张图片");
        },

        /*删除*/
        deleteAdopts(index,row){
          let _this=this;
          this.$http.get("http://localhost:9150/adopt/deleteAdopts?id="+row.id).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                message: '恭喜你,'+result.data.msg,
                type: 'success'
              });
              _this.findAdoptList();
            }else {
              _this.$message.error(result.data.msg);
              _this.findAdoptList();
            }
          })
        },
        getAdoptInfo(index,row){
          this.adoptAdd.content=row.content;
          this.adoptAdd.address=row.address;
          this.adoptAdd.number=row.id;
        },
        //跳转到第几页
        findAdoptPage(page){
          this.pageNowAdopt=page;
          this.findAdoptList(page,this.pageSizeAdopt);
        },
        //改变没有显示条数
        findAdoptSize(size){
          this.pageSizeAdopt=size;
          this.findAdoptList(this.pageNowAdopt,size);
        },
        //所有收养宠物信息记录
        findAdoptList(page,size) {
          page = page ? page : this.pageNowAdopt;
          size = size ? size : this.pageSizeAdopt;
          let _this = this;
          this.$http.get("http://localhost:9150/adopt/findAdoptList?pageNow=" + page + "&pageSize=" + size).then(function (result) {
            _this.adopt = result.data.users;
            _this.totalAdopt = result.data.total;
          })
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.$refs['upload'].clearFiles();
          this.adoptAdd.number='';
        },
        escapeStringHTML (str) {
          str = str.replace(/</g, '<')
          str = str.replace(/>/g, '>')
          return str
        },

        publishAdopts(){
          let form=new FormData();
          form.append("phone",this.$cookies.get("loginPhone"));
          form.append("name",this.$cookies.get("loginName"));
          form.append("address",this.adoptAdd.address);
          form.append("content",this.adoptAdd.content);
          form.append("number",this.adoptAdd.number);
          for (let i=0;i<this.fileList.length;i++){
            form.append("files",this.fileList[i],this.fileList[i].name);
          }
          let _this=this;
          this.$http({
            method:"post",
            url:"http://localhost:9150/adopt/addAdopt",
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
              _this.findAdoptList();
              _this.resetForm('adoptAdd');
            }else {
              _this.$message({
                showClose: true,
                message: '很遗憾:'+result.data.msg,
                type: 'error'
              });
            }
          })
        },

        /*publishAdopts(){
          let phone=this.$cookies.get("loginPhone");
          let name=this.$cookies.get("loginName");
          let _this=this;
          this.$http.post("http://localhost:9150/adopt/addAdopt?name="+name+"&phone="+phone+"&address="+this.adoptAdd.address+"&content="+this.adoptAdd.content+"&number="+this.adoptAdd.number).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                showClose: true,
                message: result.data.msg,
                type: 'success'
              });
              _this.findAdoptList();
              _this.resetForm('adoptAdd');
            }else {
              _this.$message({
                showClose: true,
                message: result.data.msg,
                type: 'error'
              });
            }
          })
        },*/
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
        this.findAdoptList();
      }
    }
</script>

<style scoped>

</style>
