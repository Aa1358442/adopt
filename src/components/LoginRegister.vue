<template>
    <div>
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="3">
              <div>
                <el-link :underline="false" icon="el-icon-eleme" class="logoContent">宠物收容中心</el-link>
              </div>
            </el-col>
            <el-col :span="1" :offset="14">
              <div>
                <el-link type="primary" class="login" icon="el-icon-user-solid" href="#/logReg/login">登录</el-link>
              </div>
            </el-col>
            <el-col :span="1">
              <div>
                <el-link type="info" class="register" icon="el-icon-star-on" href="#/logReg/register">注册</el-link>
              </div>
            </el-col>
            <el-col :span="2">
              <div>
                <el-link type="danger" class="modifyPwd" icon="el-icon-s-tools" href="#/logReg/modifyPwd">密码修改</el-link>
              </div>
            </el-col>
            <el-col :span="1">
              <div>
                <el-link type="success" class="index" icon="el-icon-s-home" href="#/index">首页</el-link>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>未经同意，不得转载本网站之所有信息 | 本网站归宠物收容中心所有©1999-2021</el-footer>
      </el-container>
    </div>
</template>

<script>
    export default {
        name: "LoginRegister"
    }
</script>

<style scoped>
  .el-header,.el-footer {
    background-color: #b3d8ff;
    color: #cf9236;
    text-align: center;
    line-height: 60px;
    padding: 0px;
    margin: 0px;
  }
  .el-main {
    background-color: #ccc;
    color: #333;
    text-align: center;
    line-height: 60px;
    height: 620px;
    padding: 0px;
    margin: 0px;
  }
  .logoContent{
    font-weight: bolder;
    font-size: 20px;
    color: #13ce66;
  }
  .login{
    font-weight: bold;
    font-size: 15px;
  }
  .register{
    font-weight: bold;
    font-size: 15px;
  }
  .modifyPwd{
    font-weight: bold;
    font-size: 15px;
  }
  .index{
    font-weight: bold;
    font-size: 15px;
  }
</style>
