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
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              multiple
              :auto-upload="true"
              :http-request="imageUpLoad"
              style="border: 2px dashed #cf9236;height: 50px;margin-top: 5px;">
              <img v-if="imageUrl" :src="imageUrl" style="height: 45px;width: 50px;margin-top: 5px;margin-bottom: 3px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
          <el-col :span="3">
            <div>
              <el-link type="primary" class="info">欢迎你：<span style="color: #67c23a">{{user.name}}</span> 管理员</el-link>
            </div>
          </el-col>
          <el-col :span="1">
            <div>
              <el-link type="primary" class="info" icon="el-icon-s-promotion" href="#/logReg/login"> 退出</el-link>
            </div>
          </el-col>
          <el-col :span="2">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-link type="primary" class="info">个人中心</el-link><i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>姓名:<span>{{user.name}}</span></el-dropdown-item>
                <el-dropdown-item divided>性别:<span>{{user.sex}}</span></el-dropdown-item>
                <el-dropdown-item divided>邮箱:<span>{{user.email}}</span></el-dropdown-item>
                <el-dropdown-item divided>密码:<span>{{user.password}}</span></el-dropdown-item>
                <el-dropdown-item divided>手机号码:<span>{{user.phone}}</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div class="imgContent">
          <el-carousel :interval="4000" type="card" height="400px" indicator-position="none">
            <el-carousel-item v-for="item in imgs" :key="item">
              <el-image
                :src="item" style="height:400px;width: 100%"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div style="background-color: #b3e19d;">
          <el-tabs type="border-card" class="mainContent">
            <el-tab-pane>
              <span slot="label" @click="users"><i class="el-icon-user"></i> 用户信息管理</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="adopts"><i class="el-icon-s-shop"></i> 宠物领养信息管理</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="finds"><i class="el-icon-help"></i> 宠物寻找信息管理</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="shares"><i class="el-icon-s-promotion"></i> 宠物分享信息管理</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="news"><i class="el-icon-video-camera-solid"></i> 新闻信息管理</span>
              <router-view/>
            </el-tab-pane>
          </el-tabs>
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
    import logo04 from "../assets/IndexImgs/logo04.jpg";
    import logo05 from "../assets/IndexImgs/logo05.jpg";
    import logo06 from "../assets/IndexImgs/logo06.jpg";
    import logo07 from "../assets/IndexImgs/logo07.jpg";
    import logo08 from "../assets/IndexImgs/logo08.jpg";

    export default {
      name: "Adminer",
      data(){
        return{
          imgs:[logo01,logo02,logo03,logo04,logo05,logo06,logo07,logo08],
          /*登录用户信息*/
          user: {
            phone: '',
            name: '',
            email: '',
            password: '',
            sex:'',
          },
          imageUrl:'',
        }
      },
      methods:{
        finds(){
          this.$router.push('/admin/finds');
        },
        users(){
          this.$router.push('/admin/users');
        },
        shares(){
          this.$router.push('/admin/shares');
        },
        news(){
          this.$router.push('/admin/news');
        },
        adopts(){
          this.$router.push('/admin/adopts');
        },
        /*获取登录信息*/
        getLoginInfo(){
          let phone=this.$cookies.get("loginPhone");
          let _this=this;
          this.$http.get("http://localhost:9150/user/getLoginInfo?phone="+phone).then(function (result) {
            if (result.data.status==200){
              _this.imageUrl="data:image/jpeg;base64,"+result.data.data.image;
              _this.user=result.data.data;
            }
          })
        },

        /*头像更新*/
        imageUpLoad(param){
          let form=new FormData();
          let phone=this.$cookies.get("loginPhone");
          form.append("phone",phone);
          form.append("files",param.file);
          let _this=this;
          this.$http({
            method:"post",
            url:"http://localhost:9150/user/upload",
            headers:{
              'Content-type':'multipart/form-data'
            },
            data:form
          }).then(function (result) {
            if (result.data.status==200){
              _this.imageUrl="data:image/jpeg;base64,"+result.data.data.image;
              _this.$message({
                showClose: true,
                message: '恭喜你:'+result.data.msg,
                type: 'success'
              });
            }
          })
        },
      },
      created() {
        this.users();
        this.getLoginInfo();
      }
    }
</script>

<style>
  .imgContent{
    background-color: #ccc;
  }
  .el-tabs .el-tabs__nav-scroll {
    background-color: #b3d8ff;
  }
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
  .mainContent{
    background-color: rgba(177, 225, 159, 0.49);
  }
</style>
