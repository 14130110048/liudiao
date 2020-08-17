<template>
<el-row style="position: relative;height:100%;width:100%;padding:20px 30px;">
  <div
    style="height:100%;width:100%;display: flex;align-items: center;flex-direction: column;overflow:auto;"
  >
    <!-- <el-button size="mini" type="primary" @click="goback" style="align-self: flex-start;">返回</el-button> -->
    <div
      style="text-align: center;font-size: 24px;text-align: center;font-weight: 600;width: 60%;"
      :span="24"
    >请选择要填的表单</div>
    <!-- <div style="text-align: center;font-size: 14px;padding-top: 15px;padding-bottom: 10px;" :span="24">
			为了您和他人的健康，请如实填报，如有隐瞒或者虚假填报，将依法追究相关责任
    </div>-->
    <!-- <div class="devideLine"></div> -->
    <el-col v-for="(item,index) in formList" :key="index" :span="22" class="nameWrap">
      <el-card shadow="always" @click.native="goDetail(item)" class="card">
        <div class="chart">
			<img :src="imglist[index%3]">
			<!-- <img src="../../assets/btnImg/biao-1.png"> -->
		</div>
        <div class="title">{{item.formDictName}}</div>
      </el-card>
    </el-col>
  </div>
  </el-row>
</template>

<script>
import { getFormList_youke } from "../../api/api";
import liudiao_1 from "../../assets/btnImg/biao-1.png";
import liudiao_2 from "../../assets/btnImg/biao-2.png";
import liudiao_3 from "../../assets/btnImg/biao-3.png";
export default {
  data() {
    return {
      formData: {},
      formDesc: {},
	  formList: [],
	  imglist:[]
    };
  },
  watch: {
    //检测数据结构发生变化
    formData: {
      handler: function(val, oldVal) {
        console.log(val);
      },
      deep: true
    }
  },
  methods: {
    goDetail(formParams_) {
      // if(formParams_.code=="liuxingbingxuediaochaxunwenzhiyinbiao"){
      // 	this.$router.push({name:"table1",params:{"formParams":formParams_}})
      // }else{
      this.$router.push({
        path: "tableYouke",
        query: { formParams: formParams_ }
      });
      // }
    },
    getFormList() {
      //获取表格列表
      let para = {
        languageCode: localStorage.lang
      };
      getFormList_youke(para).then(data => {
        if (data.result) {
          this.formList = data.data.list;
        } else {
          this.$message({
            message: data.data.msg,
            type: "error"
          });
        }
        console.log(data);
      });
    },
    goback() {
      this.$router.go(-1);
    }
  },
  mounted() {
	  this.imglist=[liudiao_1,liudiao_2,liudiao_3];
	this.getFormList();
  }
};
</script>
<style lang="scss">
form {
  background-color: white;
  // padding: 60px;
  // margin-top: 50px;
  // font-size: 34px !important;
}

.el-form-item__label {
  // font-size: 18px;
  // font-weight: bold;
  // color: #000000;
}

.el-form-item__content {
  // display: flex !important;
  // align-items: center !important;
  // justify-content: center;
}

.devideLine {
  width: 40%;
  height: 6px;
  background-color: rgba(42, 219, 185, 0.3);
  position: relative;
  top: 75px;
  z-index: 99;
  left: 30%;
}

.nameWrap {
  align-items: center;
  margin-top: 30px;
  text-align: center;
  cursor: pointer;
}
.el-card{
	border-radius: 10px;
	.el-card__body{
	display: flex;
	flex-direction: row;
	padding: 20px;
	.chart{
		height: 60px;
		width: 55px;
		overflow: hidden;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.title{
		flex: 1;
		margin-left: 20px;
		height: 60px;
		// line-height: 60px;
		font-size: 20px;
		text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
	}
}
}
</style>
