<template>
    <div>
      <el-row>
        <el-col :span="8" :offset="8">
          <el-input
            placeholder="请输入宠物姓名关键字"
            v-model="search"
            @change="searchFinds"
            clearable>
          </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" v-for="item in pets" :key="item.id">
          <el-card :body-style="{margin:'0px'}" style="height: 430px;overflow-y:auto">
            <img :src="item.imagee" class="image">
            <div style="font-weight: bold">
              姓名:<span style="color: #cf9236">{{item.name}}</span>
              <div style="height: 60px">
                <p style="margin:0px;font-size: 15px;line-height: 20px;color: #cf9236"><span style="color:#000000">描述:</span>{{item.descs}}</p>
              </div>
              <div>
                <p><el-button type="success" style="width: 100%" @click="getFindsInfo(item.id)">详细信息</el-button></p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="8">
          <el-pagination style="margin-top: 15px;"
                         layout="prev, pager, next,jumper,total,sizes"
                         :page-size="pageSize"
                         :total="total"
                         :current-page="pageNow"
                         :page-sizes="[2,4,6,8,10]"
                         prev-text="上一页"
                         next-text="下一页"
                         background
                         small
                         @current-change="findPage"
                         @size-change="findSize">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    export default {
      name: "Page_finds",
      data(){
        return{
          pets:[{
            id:'1',
            name:'小白',
            descs:'宠物再北京市海淀区清华大学计算机与科学研究元丢失',
            imagee:'',
          }],
          search:'',
          total:0,
          pageSize:4,
          pageNow:1,

        }
      },
      methods:{
        getFindsInfo(id){
          this.$router.push('/page_finds_desc');
          this.$cookies.set("findsId",id);
        },
        searchFinds(){
          this.findFindsList(this.pageNow,this.pageSize,this.search);
        },
        findPage(page){
          this.pageNow=page;
          this.findFindsList(page,this.pageSize,this.search);
        },
        findSize(size){
          this.pageSize=size;
          this.findFindsList(this.pageNow,size,this.search);
        },
        findFindsList(page,size,name){
          page=page?page:this.pageNow;
          size=size?size:this.pageSize;
          name=name?name:this.search;
          let _this=this;
          this.$http.get("http://localhost:9150/finds/findFindsList?pageNow="+page+"&pageSize="+size+"&name="+name).then(function (result) {
            _this.pets=result.data.finds;
            let finds=result.data.finds;
            for (let i=0;i<finds.length;i++){
              if (finds[i].images.length){
                _this.pets[i].imagee="data:image/jpeg;base64,"+finds[i].images[0].image;
              }
            }
            _this.total=result.data.total;
          })
        }
      },
      created() {
        this.findFindsList();
      }
    }
</script>

<style scoped>
  .image{
    height: 150px;
    width: 100%;
  }
</style>
