<template>
    <div>
      <div>
        <el-row>
          <el-col :span="8" :offset="8">
            <div style="margin: 20px;"></div>
            <div>
              <el-form :label-position="labelPosition" :rules="rules"  ref="user" label-width="80px" :model="user">
                <el-form-item>
                  <h3 style="font-size: 25px;color: #67c23a;margin: 20px;padding: 0px">用户注册</h3>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="user.phone"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="user.name"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="user.email"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="user.sex" placeholder="请选择性别">
                    <el-option label="男" value="男" name="sex"></el-option>
                    <el-option label="女" value="女" name="sex"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="验证码" prop="code">
                  <div >
                    <el-input v-model="user.code" class="code">
                      <el-image slot="append" :src="src" style="width:100px;height:34px;padding: 0px;margin: 0px" @click="getCode"></el-image>
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="register('user')">立即注册</el-button>
                  <el-button type="success"  @click="resetForm('user')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
    export default {
      name: "Register",
      data() {
        return {
          labelPosition: 'right',
          user: {
            phone: '',
            name: '',
            email: '',
            password: '',
            sex:'',
            code: '',
          },
          src:'http://localhost:9150/user/getCode',
          rules:{
            phone: [
              { required: true, message: '请输入手机号码', trigger: 'blur' },
              { min: 11,max:11, message: '长度为11个字符的号码', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ],
            email:[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 6, max:11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
            ],
            sex:[
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            code:[
              { required: true, message: '请输入验证码', trigger: 'blur' }
            ],
            image:[
              { required: true, message: '请选择头像', trigger: 'blur' }
            ]

          }
        };
      },
      methods: {
        register(user) {
          this.$refs[user].validate((valid) => {
            if (valid) {
              let _this=this;
              this.$http.post("http://localhost:9150/user/add",this.user).then(function (result) {
                if (result.data.status==200){
                  _this.$message({
                    showClose: true,
                    message: '恭喜你:'+result.data.msg,
                    type: 'success'
                  });
                  _this.$router.push('/logReg/login');
                  _this.src='http://localhost:9150/user/getCode?code='+Math.random();
                }else {
                  _this.$message({
                    showClose: true,
                    message: '很遗憾:'+result.data.msg,
                    type: 'error'
                  });
                  _this.src='http://localhost:9150/user/getCode?code='+Math.random();
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
        }
      }
    }
</script>

<style scoped>
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .el-form{
    background-color: #b3d8ff;
    padding: 0px 100px 30px 30px;
  }

  /*覆盖elementUI中的样式.el-input-group__append*/
  .code .el-input-group__append{
    padding: 0px 0px;
  }

  /*/deep/ .el-select 同意通过这种方式覆盖elementUI样式*/
  .el-select{
    /*充满父元素（el-col）*/
    width: 100%;
  }
</style>
