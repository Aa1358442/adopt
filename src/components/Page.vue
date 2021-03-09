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
              <el-link type="primary" class="info">欢迎你：<span style="color: #67c23a">{{user.name}}</span></el-link>
            </div>
          </el-col>
          <el-col :span="1">
            <div>
              <el-link icon="el-icon-s-promotion" style="color: #cf9236;font-weight: bold"  href="#/logReg/login">退出</el-link>
            </div>
          </el-col>
          <el-col :span="2">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-link style="font-weight: bold;color: #cf9236">个人中心</el-link><i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" style="font-weight: bold">
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
        <!--流浪宠物图片轮播-->
        <div class="imgContent">
          <el-carousel :interval="4000" type="card" height="400px" indicator-position="none">
            <el-carousel-item v-for="item in imgs" :key="item">
              <el-image
                :src="item" style="height:400px;width: 100%"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <!--主要内容模块-->
        <div>
          <el-tabs type="border-card" class="mainContent">
            <el-tab-pane>
              <span slot="label" @click="adopts"><i class="el-icon-s-shop"></i> 流浪宠物领养</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="finds"><i class="el-icon-s-promotion"></i> 宠物寻找浏览</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="shares"><i class="el-icon-share"></i> 宠物经验分享</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="news"><i class="el-icon-video-camera-solid"></i> 新闻活动</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="myadopts"><i class="el-icon-s-platform"></i> 我的宠物领养中心</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="myfinds"><i class="el-icon-s-cooperation"></i> 我的宠物寻找中心</span>
              <router-view/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label" @click="myorder"><i class="el-icon-shopping-cart-full"></i> 我的领养订单中心</span>
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
      name: "Page",
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
      methods: {
        /*路由跳转*/
        adopts(){
          this.$router.push('/page/adopts')
        },
        finds(){
          this.$router.push('/page/finds')
        },
        shares(){
          this.$router.push('/page/shares');
        },
        news(){
          this.$router.push('/page/news')
        },
        myadopts(){
          this.$router.push('/page/myadopts')
        },
        myfinds(){
          this.$router.push('/page/myfinds')
        },
        myorder(){
          this.$router.push('/page/orders')
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
                message: '恭喜你:'+result.data.msg,
                type: 'success'
              });
            }
          })
        },
      },
      created() {
          this.adopts();
          this.getLoginInfo();
      },
    }
</script>

<style>
  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-tabs .el-tabs__nav-scroll {
    background-color: #b3d8ff;
  }
  .imgContent{
    background-color: #ccc;
  }
  .mainContent{
    background-color: rgba(177, 225, 159, 0.49);
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
  .info{
    font-weight: bold;
    font-size: 15px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
