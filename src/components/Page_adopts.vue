<template>
    <div>
      <el-row>
        <el-col :span="15">
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
              <el-table-column align="right" width="200">
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
                  <el-button
                    size="small"
                    type="primary"
                    @click="raiseAdopt(scope.$index, scope.row)">发起领养</el-button>
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
        <el-col :span="9">
          <div style="background-color: #C3ECFF;padding: 20px">
            <el-form :label-position="labelPosition" label-width="80px" :model="raises" ref="raises" :rules="rules" style="padding-bottom: 20px;">
              <el-form-item>
                <h2 style="font-size: 25px; margin: 0px;padding: 0px">发起领养请求给发布者</h2>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input v-model="raises.address" placeholder="请输入你的地址"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="phone">
                <el-input v-model="raises.phone" placeholder="请输入你的联系方式" disabled></el-input>
              </el-form-item>
              <el-form-item label="发布者" prop="phones">
                <el-input v-model="raises.phones" placeholder="请输入发布者联系方式" disabled></el-input>
              </el-form-item>
              <el-form-item label="宠物描述" prop="content">
                <quill-editor v-model="raises.content"
                              disabled
                              ref="myQuillEditor"
                              style="background-color: #d9ecff;">
                </quill-editor>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="sureRaiseAdopt('raises')">确定领养</el-button>
                <el-button type="info"  @click="resetForm('raises')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>

    export default {
      name: "Page_adopts",
      data(){
        return{
          labelPosition: 'right',
          adopt:[{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            phone:'13187823445',
            status:'未被领养'
          }],
          raises: {
            number:'',
            content: '',
            address:'',
            phone:'',  //发起领养者联系方式
            name:'',
            phones:'', //发布者联系方式
            status:'',
            date:'',
          },
          rules: {
            address: [
              { required: true, message: '请输入你的发现地址', trigger: 'blur' },
            ],
            content: [
              { required: true, message: '请输入流浪宠物的描述信息', trigger: 'blur' },
            ],
            phone: [
              { required: true, message: '请输入你的手机号码', trigger: 'blur' },
              { min: 11,max:11, message: '长度为11个字符的号码', trigger: 'blur' }
            ],
            phones: [
              { required: true, message: '请输入发布者手机号码', trigger: 'blur' },
              { min: 11,max:11, message: '长度为11个字符的号码', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入你的手机号码', trigger: 'blur' },
              { min: 11,max:11, message: '长度为11个字符的号码', trigger: 'blur' }
            ],
          },
          searchAdopt:'',
          totalAdopt:0,
          pageSizeAdopt:8,
          pageNowAdopt:1,
        }
      },
      methods:{
        sureRaiseAdopt(raises){
          this.$refs['raises'].validate((valid) => {
            if (valid) {
              this.$http.post("http://localhost:9150/raises/addRaises?number="+this.raises.number+"&content="+this.raises.content+
              "&address="+this.raises.address+"&phone="+this.raises.phone+"&name="+this.raises.name+"&phones="+this.raises.phones).then(function (result) {
                if (result.data.status==200){
                  this.$message({
                    showClose: true,
                    message: '恭喜你:'+result.data.msg,
                    type: 'success'
                  });
                  this.findAdoptList();
                }else {
                  this.$message({
                    showClose: true,
                    message: '很遗憾:'+result.data.msg,
                    type: 'error'
                  });
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
        raiseAdopt(index,row){
          if (row.phone==this.$cookies.get("loginPhone")){
            this.$message({
              showClose: true,
              message: '发起领养请求失败:发布者是你自己',
              type: 'warning'
            });
          }else {
            if (row.status=="未被领养"){
              this.raises.number=row.id;
              this.raises.phones=row.phone;
              this.raises.content=row.content;
              this.raises.status=row.status;
              this.raises.name=this.$cookies.get("loginName");
              this.raises.phone=this.$cookies.get("loginPhone");
            }
            if (row.status=="领养中"){
              this.$message({
                showClose: true,
                message: '发起领养失败:已有人发起领养!',
                type: 'warning'
              });
            }
            if (row.status=="已被领养"){
              this.$message({
                showClose: true,
                message: '发起领养失败:已被领养',
                type: 'warning'
              });
            }
          }
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
          this.raises.number='';
        },
        /*宠物收养模块函数*/
        getAdoptInfo(index,row){
          this.$router.push('/page_adopts_desc');
          this.$cookies.set("adoptId",row.id);
          this.$cookies.set("adoptPhone",row.phone);
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
        findAdoptList(page,size){
          page=page?page:this.pageNowAdopt;
          size=size?size:this.pageSizeAdopt;
          let _this=this;
          this.$http.get("http://localhost:9150/adopt/findAdoptList?pageNow="+page+"&pageSize="+size).then(function (result) {
            _this.adopt=result.data.users;
            _this.totalAdopt=result.data.total;
          })
        },
        tableRowClassName({row, rowIndex}) {
          if (rowIndex%2 === 1) {
            return 'warning-row';
          } else if (rowIndex%2 === 0) {
            return 'success-row';
          }
          return '';
        },
        onEditorBlur(editor) {
          console.log('editor blur!', editor);
          console.log(this.content);
        }, //失去焦点事件
      },
      created() {
        this.findAdoptList();
      }
    }
</script>

<style scoped>

</style>
