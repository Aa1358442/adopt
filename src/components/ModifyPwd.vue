<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <div style="margin: 20px;"></div>
        <div>
          <el-form :label-position="labelPosition" label-width="80px" :model=" user" :rules="rules"  ref="user">
            <el-form-item>
              <h3 style="font-size: 25px;color: #67c23a;margin: 20px;padding: 0px">密码修改</h3>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="user.phone"></el-input>
            </el-form-item>
            <el-form-item label="原密码" prop="password">
              <el-input type="password" v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
              <el-input type="password" v-model="user.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="密码确认" prop="surePwd">
              <el-input type="password" v-model="user.surePwd"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="sureModify('user')">确认修改</el-button>
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
      name: "ModifyPwd",
      data(){
        return{
          labelPosition: 'right',
          user: {
            phone: '',
            password: '',
            newPwd:'',
            surePwd:'',
          },
          rules: {
            phone: [
              {required: true, message: '请输入手机号码', trigger: 'blur'},
              {min: 11, max: 11, message: '长度为11个字符的号码', trigger: 'blur'}
            ],
            password: [
              {required: true, message: '请输入密码', trigger: 'blur'},
              {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
            ],
            newPwd: [
              {required: true, message: '请输入新密码', trigger: 'blur'},
              {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
            ],
            surePwd: [
              {required: true, message: '请输入确认新密码', trigger: 'blur'},
              {min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur'}
            ],

          },
        }
      },
      methods:{
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        sureModify(user){
          this.$refs[user].validate((valid) => {
            if (valid){
              let _this=this;
              this.$http.post("http://localhost:9150/user/modifyPwd?phone="+this.user.phone+"&password="+this.user.password+
                "&newPwd="+this.user.newPwd+"&surePwd="+this.user.surePwd).then(function (result) {
                  if (result.data.status==200){
                    _this.$message({
                      message: '恭喜你,'+result.data.msg,
                      type: 'success'
                    });
                    _this.$router.push('/logReg/login')
                  }else {
                    _this.$message({
                      message: '很遗憾,修改失败：'+result.data.msg,
                      type: 'error'
                    });
                  }
              })
            }else {
              this.$message({
                showClose: true,
                message: '警告哦，校验未通过!',
                type: 'warning'
              });
              return false;
            }
          });
        }
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
