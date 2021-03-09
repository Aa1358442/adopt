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
              <el-link icon="el-icon-s-promotion" style="color: #cf9236;font-weight: bold"  href="#/page">返回</el-link>
            </div>
          </el-col>
          <el-col :span="2">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-link type="primary" style="font-weight: bold">个人中心</el-link><i class="el-icon-arrow-down el-icon--right"></i>
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
        <div>
          <el-row style="height: 230px;background-color: #b3e19d">
            <el-col :span="4">
              <div style="margin: 20px 20px;height: 150px">
                <img v-if="finds.imageUrl" :src="finds.imageUrl" style="height: 150px;width: 100%;">
                <p style="padding: 0px;margin: 0px;line-height: 30px;font-weight: bolder;color: #cf9236">宠物名：<span>{{finds.name}}</span></p>
              </div>
            </el-col>
            <el-col :span="15">
              <div style="margin: 20px">
                <div style="line-height: 20px;text-align: left;font-weight: bold;color: #cf9236" v-html="finds.content"></div>
              </div>
            </el-col>
            <el-col :span="5">
              <div style="margin: 20px">
                <el-form :rules="rules"  ref="findsdesc" :model="findsdesc">
                  <el-form-item label="" prop="content">
                    <el-input type="textarea" v-model="findsdesc.content" :autosize="{ minRows: 5}" clearable placeholder="请输入评论信息"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" style="width: 100%" @click="publishFindsdesc">发表评论</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
          <el-divider content-position="right"></el-divider>
          <el-divider content-position="right"></el-divider>
          <div style="height: 400px;overflow: auto;background-color: #d9ecff">
            <div  v-for="item in findsdescs" :key="item.id">
              <el-row style="height: 100px;background-color: #d9ecff;">
                <el-col :span="2" style="background-color: #c6e2ff;height: 100px">
                  <div style="margin: 20px">
                    <img v-if="item.images" :src="item.images" style="height: 70px;width: 70px;">
                  </div>
                </el-col>
                <el-col :span="20" style="background-color: #dcdfe6;height: 100px">
                  <div style="margin: 20px">
                    <p style="line-height: 20px;height:20px;text-align: left;font-weight: bold;color: #cf9236">{{item.content}}</p>
                  </div>
                </el-col>
                <el-col :span="2" style="background-color: #c6e2ff;height: 100px">
                  <div>
                    <p style="line-height: 20px">评论人：<span>{{item.name}}</span></p>
                    <p style="line-height: 20px">{{item.date}}</p>
                  </div>
                </el-col>
              </el-row>
              <el-divider></el-divider>
            </div>
          </div>
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
      name: "Page_finds_desc",
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
          finds:{
            imageUrl:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            id:'',
            phone:'',
            name:'',
            content:'',
          },
          findsdesc:{
            content:'',
            imageUrl:'',
          },
          rules:{
            content:[
              { required: true, message: '请输入评论内容', trigger: 'blur' }
            ],
          },
          findsdescs:[{
            id:'',
            phone:'',
            name:'',
            content:'',
            date:'',
            images:'',
          }]
        }
      },
      methods:{

        //重置
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },

        //查询所有列表信息
        findFindsDescList(){
          let _this=this;
          this.$http.get("http://localhost:9150/findsdesc/findFindsDescList?number="+this.finds.id).then(function (result) {
            _this.findsdescs=result.data.data;
            let finds=result.data.data;
            for (let i=0;i<finds.length;i++){
              _this.findsdescs[i].images="data:image/jpeg;base64,"+finds[i].images;
            }
          })
        },

        //表发评论
        publishFindsdesc(){
          let _this=this;
          this.$http.post("http://localhost:9150/findsdesc/addFindsDesc?number="+
            this.finds.id+"&name="+this.user.name+"&phone="+this.user.phone+"&content="+this.findsdesc.content).then(function (result) {
            if (result.data.status==200){
              _this.$message({
                showClose: true,
                message: result.data.msg,
                type: 'success'
              });
              _this.findFindsDescList();
              _this.resetForm('findsdesc');
            }else {
              _this.$message({
                showClose: true,
                message: result.data.msg,
                type: 'error'
              });
            }
          })
        },

        ///获取寻找帖子相关信息
        getFindsInfo(){
          let _this=this;
          console.log(_this.finds.id);
          this.$http.get("http://localhost:9150/finds/getFindsInfo?id="+this.finds.id).then(function (result) {
            _this.finds.name=result.data.finds.name;
            _this.finds.content=_this.escapeStringHTML(result.data.finds.descs);
          })
        },
        getFindsImagesInfo(){
          let _this=this;
          this.$http.get("http://localhost:9150/images/getFindsImages?number="+this.finds.id).then(function (result) {
            _this.finds.imageUrl="data:image/jpeg;base64,"+result.data.images[0].image;
          })
        },
        escapeStringHTML (str) {
          str = str.replace(/</g, '<')
          str = str.replace(/>/g, '>')
          return str
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
            }
            _this.$message({
              showClose: true,
              message: result.data.msg,
              type: 'success'
            });
          })
        },
      },
      created() {
        this.getLoginInfo();
        this.finds.id=this.$cookies.get("findsId");
        this.getFindsInfo();
        this.getFindsImagesInfo();
        this.findFindsDescList();
      }
    }
</script>

<style>
  .el-divider--horizontal{
    margin: 12px 0px;
  }
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
