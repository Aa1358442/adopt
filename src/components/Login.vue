<template>
    <div>
      <el-row>
        <el-col :span="8" :offset="8">
          <div style="margin: 20px;"></div>
          <div>
            <el-form :label-position="labelPosition" label-width="80px" :model=" user" :rules="rules"  ref="user">
              <el-form-item>
                <h3 style="font-size: 25px;color: #67c23a;margin: 20px;padding: 0px">用户登录</h3>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="user.phone"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="user.password"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="code">
                <div >
                  <el-input v-model="user.code" class="code">
                    <el-image slot="append" :src="src" style="width:100px;height:34px;padding: 0px;margin: 0px" @click="getCode"></el-image>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="sureLogin">立即登录</el-button>
                <el-button type="success" @click="resetForm('user')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
      name: "Login",
      data() {
        return {
          labelPosition: 'right',
          user: {
            phone: '',
            password: '',
            code: ''
          },
          src:'http://localhost:9150/user/getCode',
          rules: {
            phone: [
              {required: true, message: '请输入手机号码', trigger: 'blur'},
              {min: 11, max: 11, message: '长度为11个字符的号码', trigger: 'blur'}
            ],
            password: [
              {required: true, message: '请输入密码', trigger: 'blur'},
              {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
            ],
            code: [
              {required: true, message: '请输入验证码', trigger: 'blur'}
            ]
          },

        };
      },
      methods: {
        onSubmit() {
          this.$router.push('/page');
        },
        getCode(){
          this.src='http://localhost:9150/user/getCode?code='+Math.random();
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        sureLogin(){
          let _this=this;
          this.$http.post('http://localhost:9150/user/login?phone='+this.user.phone+'&password='+this.user.password+'&code='+this.user.code).then(function (result) {
                if (result.data.status==200){
                  _this.$message({
                    message: '恭喜你:'+result.data.msg,
                    type: 'success'
                  });
                  _this.$cookies.set("loginPhone",result.data.data.phone);
                  _this.$cookies.set("loginName",result.data.data.name);
                  let role=result.data.data.role;
                  if (role=="user"){
                    _this.$router.push('/page');
                  }
                  if (role=="adminer"){
                    _this.$router.push('/admin');
                  }
                  _this.src='http://localhost:9150/user/getCode?code='+Math.random();
                }else {
                  _this.$message({
                    showClose: true,
                    message: result.data.msg,
                    type: 'error'
                  });
                  _this.src='http://localhost:9150/user/getCode?code='+Math.random();
                }
          })
        },

      }
    }
</script>

<style scoped>
  .el-form{
    background-color: #b3d8ff;
    padding: 0px 100px 30px 30px;
  }

  /*覆盖elementUI中的样式.el-input-group__append*/
  .code .el-input-group__append{
    padding: 0px 0px;
  }
</style>
