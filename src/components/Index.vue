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
            <el-col :span="2" :offset="18">
              <div>
                <el-link type="primary" class="login" icon="el-icon-s-promotion" href="#/logReg/login">登录&注册</el-link>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <div>
            <el-carousel height="620px" indicator-position="none">
              <el-carousel-item v-for="item in imgs" :key="item">
                <el-image
                  :src="item" style="height:620px;width: 100%"
                ></el-image>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-main>
        <el-footer>未经同意，不得转载本网站之所有信息 | 本网站归宠物收容中心所有©1999-2021</el-footer>
      </el-container>
    </div>
</template>

<script>
  import logo01 from "../assets/IndexImgs/logo01.jpg";
  import logo02 from "../assets/IndexImgs/logo02.jpg";
  import logo03 from "../assets/IndexImgs/logo03.jpg";
    export default {
      name: "Index",
      data(){
        return{
          imgs:[logo01,logo02,logo03]
        }
      }
    }
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #b3d8ff;
    color: #cf9236;
    text-align: center;
    line-height: 60px;
    padding: 0px;
    margin: 0px;
  }
  .el-main {
    background-color: #A0CFFF;
    color: #333;
    text-align: center;
    line-height: 60px;
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
</style>
