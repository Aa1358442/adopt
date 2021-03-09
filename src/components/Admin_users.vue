<template>
    <div>
      <el-row>
        <el-col :span="15">
          <div>
            <el-table
              :data="users.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              style="width: 100%"
              :row-class-name="tableRowClassName">
              <el-table-column prop="id" label="编号"></el-table-column>
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="phone" label="手机号码"></el-table-column>
              <el-table-column prop="sex" label="性别"></el-table-column>
              <el-table-column prop="role" label="角色"></el-table-column>
              <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
              <el-table-column align="right" width="180">
                <template slot="header" slot-scope="scope">
                  <el-input
                    v-model="search"
                    size="medium"
                    clearable
                    placeholder="输入姓名关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    type="info"
                    size="small"
                    @click="modifyUser(scope.$index, scope.row)">修改</el-button>
                  <el-popconfirm
                    confirm-button-text='好的'
                    cancel-button-text='不用了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="确定删除当前用户吗？"
                    @confirm="deleteUser(scope.$index, scope.row)"
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
                           :page-sizes="[4,6,8,10,12]"
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
            <el-form :label-position="labelPosition" :rules="rules"  ref="user" label-width="80px" :model="user">
              <el-form-item>
                <h3 style="font-size: 25px;color: #67c23a;margin: 20px;padding: 0px">添加修改</h3>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="user.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="user.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="user.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="user.password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-select v-model="user.sex" placeholder="请选择性别">
                  <el-option label="男" value="男" name="sex"></el-option>
                  <el-option label="女" value="女" name="sex"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色" prop="role">
                <el-select v-model="user.role" placeholder="请选择角色">
                  <el-option label="user" value="user" name="role"></el-option>
                  <el-option label="adminer" value="adminer" name="role"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <div >
                  <el-input v-model="user.code" class="code" placeholder="请输入验证码">
                    <el-image slot="append" :src="src" style="width:100px;height:34px;padding: 0px;margin: 0px" @click="getCode"></el-image>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addUser('user')">立即创建</el-button>
                <el-button type="success"  @click="resetForm('user')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
      name: "Admin_users",
      data(){
        return{
          labelPosition: 'right',
          users: [{
            id: '1',
            name: 'root',
            phone: '13187237842',
            sex:'男',
            role:'user',
            email:'huangmuda@163.com'
          }],
          src:'http://localhost:9150/user/getCode',
          user:{
            id: '',
            name: '',
            phone: '',
            password:'',
            sex:'',
            role:'',
            email:'',
            code:'',
          },
          rules:{
            phone: [
              { required: true, message: '请输入手机号码', trigger: 'blur' },
              { min: 11,max:11, message: '长度为11个字符的号码', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ],
            email:[
              { required: true, message: '请输入邮箱', trigger: 'blur' }
            ],
            sex:[
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            role:[
              { required: true, message: '请选择角色', trigger: 'change' }
            ],
            code:[
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max:11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
            ],

          },
          search:'',
          total:0,
          pageSize:6,
          pageNow:1,
        }
      },
      methods:{
        deleteUser(index, row) {
          let _this=this;
          this.$http.get("http://localhost:9150/user/deleteUser?id="+row.id).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                message: '恭喜你,'+result.data.msg,
                type: 'success'
              });
              _this.findUsersList();
            }else {
              _this.$message.error(result.data.msg);
            }
          })
        },
        modifyUser(index,row){
          this.user.id=row.id;
          this.user.name=row.name;
          this.user.phone=row.phone;
          this.user.sex=row.sex;
          this.user.email=row.email;
          this.user.code=row.code;
          this.user.password=row.password;
          this.user.role=row.role;
        },
        addUser(user) {
          this.$refs[user].validate((valid) => {
            if (valid) {
              let _this=this;
              this.$http.post("http://localhost:9150/user/add",this.user).then(function (result) {
                if (result.data.status==200){
                  _this.$message({
                    showClose: true,
                    message: '恭喜你'+result.data.msg,
                    type: 'success'
                  });
                  _this.getCode();
                  _this.resetForm('user');
                  _this.findUsersList();
                  _this.user.id='';
                }else {
                  _this.$message({
                    showClose: true,
                    message: result.data.msg,
                    type: 'error'
                  });
                  _this.getCode();
                }
              });
            } else {
              this.$message({
                showClose: true,
                message: '警告哦，校验未通过!',
                type: 'warning'
              });
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        getCode(){
          this.src='http://localhost:9150/user/getCode?code='+Math.random();
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
          this.findUsersList(page,this.pageSize);
        },
        findSize(size){
          this.pageSize=size;
          this.findUsersList(this.pageNow,size);
        },
        findUsersList(page,size){
          page=page?page:this.pageNow;
          size=size?size:this.pageSize;
          let _this=this;
          this.$http.get("http://localhost:9150/user/findUsersList?pageNow="+page+"&pageSize="+size).then(function (result) {
            _this.users=result.data.users;
            _this.total=result.data.total;
          })
        },
      },
      created() {
        this.findUsersList();
      }
    }
</script>

<style>
  .code .el-input-group__append{
    padding: 0px 0px;
  }
  .el-select{
    /*充满父元素（el-col）*/
    width: 100%;
  }
</style>
