<template>
  <div id="table">
    <el-row class="top">
      <el-col :span="3" class="return">
        <!-- <el-button size="mini" type="primary" @click="goback">返回</el-button> -->
        <div @click="goback">
          <img src="../../assets/btnImg/return.png" class="img" />
        </div>
        <div class="title1" @click="goback()">返回</div>
      </el-col>
      <el-col :span="18" class="title">{{formParams.formDictName}}</el-col>
      <!-- <el-col class="remainTime" :span="4">已用时长 {{remainTimeFormat}}</el-col> -->
    </el-row>
    <!-- <img :src="liudiao_topLeft" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;left: 0;">
		<img :src="liudiao_topRight" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;right: 0;">
		<img :src="liudiao_bottomLeft" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;left: 0;">
    <img :src="liudiao_bottomRight" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;right: 0;">-->
    <!-- <el-button @click="goback">返回</el-button>
		<div style="text-align: center;font-size: 28px;text-align: center;font-weight: 700;" :span="24">
			{{formParams.formName}}
    </div>-->
    <!-- <div style="text-align: center;font-size: 14px;padding-top: 15px;padding-bottom: 10px;" :span="24">
			为了您和他人的健康，请如实填报，如有隐瞒或者虚假填报，将依法追究相关责任
		</div>
    <div class="devideLine"></div>-->
    <el-row class="formData">
      <el-row class="formBox">
        <ele-form
          :formDesc="formDesc"
          v-model="formData"
          :isLoading="isLoading"
          :formError="formError"
          @request="handleRequest"
          :isShowSubmitBtn="false"
          :isShowBackBtn="false"
          labelPosition="top"
          :span="24"
          class="lmk"
        ></ele-form>
      </el-row>
    </el-row>
    <div class="loading" v-if="editLoading">
      <div class="loading-icon">
        <p class="loading-text">拼命加载中</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getFormDetail, submitFormData, getFormDicDetail } from "../../api/api";
import liudiao_topLeft from "../../assets/liudiao_topLeft.png";
import liudiao_topRight from "../../assets/liudiao_topRight.png";
import liudiao_bottomLeft from "../../assets/liudiao_bottomLeft.png";
import liudiao_bottomRight from "../../assets/liudiao_bottomRight.png";
var checkTemperature = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("当前体温必填"));
  } else if (!value.match(/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/)) {
    callback(new Error("体温为最多带有一位小数的数字"));
  } else if (value > 37.3) {
    callback(new Error("体温最高不超过37.3度"));
  } else {
    callback();
  }
};
var checkTemperature1 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("当前体温必填"));
  } else if (!value.match(/^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1})?$/)) {
    callback(new Error("体温为最多带有一位小数的数字"));
  } else {
    callback();
  }
};
export default {
  data() {
    return {
      formParams: "",
      isLoading: null,
      formError: null,
      liudiao_topLeft: liudiao_topLeft,
      liudiao_topRight: liudiao_topRight,
      liudiao_bottomLeft: liudiao_bottomLeft,
      liudiao_bottomRight: liudiao_bottomRight,
      formData: {},
      formDesc: {},
      editLoading: false
    };
  },
  watch: {
    //检测数据结构发生变化
    formData: {
      handler: function(val, oldVal) {
        console.log("值发生了变化");
        console.log(val);
      },
      deep: true
    }
  },
  methods: {
    makeFun() {
      let newFormData = {};
      console.log(this.formDesc);
      for (let k in this.formDesc) {
        let d = this.formDesc[k];
        if (d.vif) {
          console.log("函数重构函数重构函数重构函数重构函数重构函数重构" + k);
          this.formDesc[k].vif = new Function("return " + d.vif)();
        }
        if (d.options) {
          console.log(k);
          newFormData[k] = [];
        }
        if (d.attrs) {
          if (d.attrs.responseFn) {
            console.log("图片上传函数重构" + k);
            this.formDesc[k].attrs.responseFn = new Function(
              "return " + d.attrs.responseFn
            )();
          }
          if (d.attrs.httpRequest) {
            console.log("图片上传函数重构" + k);
            this.formDesc[k].attrs.httpRequest = new Function(
              "return " + d.attrs.httpRequest
            )();
          }
        }
        //校验重构rules
        if (d.rules) {
          this.formDesc[k].rules.forEach(item => {
            if (item.validator) {
              item.validator = eval("(" + item.validator + ")");
            }
          });
        }
      }
      console.log("这是被注入的数据");
      console.log(newFormData);
      this.formData = newFormData;
      console.log("这是被替换后的fomrData");
      console.log(this.formData);
      console.log("这是处理过的表单数据");
      console.log(this.formDesc);
    },
    getFormDicDetail() {
      this.editLoading = true;
      let para = {
        code: this.formParams.code
      };
      getFormDicDetail(para).then(res => {
        if (res.result) {
          //获取到页面表单渲染数据
          let lang = localStorage.lang;
          let data = res.data;
          data.languageList.forEach(item => {
            if (item.languageType == lang) {
              this.formDesc = JSON.parse(item.formData.htmlTemplateText);
              this.formDesc = this.formDesc.formDesc
                ? this.formDesc.formDesc
                : this.formDesc;
            }
          });
          this.makeFun();
          this.editLoading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },

    getFormDetail() {
      //获取表格列表
      let para = {
        formCode: this.formParams.formCode,
        formRecordCode: this.formParams.formRecordCode
      };
      getFormDetail(para).then(res => {
        if (res.data.result) {
          let data = res.data.data;
          //获取到页面表单渲染数据
          this.formDesc = JSON.parse(data.formTemplate.htmltemplatetext);
          //获取到页面填充数据
          // let formList = data.formData.formList
          // if(formList&&formList.length>0){
          // 	for(let i=0;i<formList.length;i++){
          // 		this.formData[formList[i].htmlCode] = formList[i].htmlValue
          // 	}
          // }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    async handleRequest(data) {
      if (this.isLoading) return; // 判断状态
      try {
        this.isLoading = true; // 更改状态
        const response = await this.submitFormData(); // 发送请求
        // 成功处理
        this.$message.success("添加成功");
        // this.$router.back() // 跳转回上一页
      } catch (error) {
        // 处理错误
        // 为了表单同步显示后端返回的错误, 需要将错误信息传递给表单
        this.formError = {
          错误: "提交错误"
        };
      } finally {
        this.isLoading = false;
      }
    },
    submitFormData() {
      console.log(JSON.stringify(this.formData));
      let formList = [];
      for (let key in this.formData) {
        let htmlType = null;
        if (this.formDesc[key].type == "radio") {
          htmlType = "radio";
        } else if (this.formDesc[key].type == "checkbox") {
          htmlType = "radio";
        } else {
          htmlType = "string";
        }
        formList.push({
          htmlCode: key,
          htmlValue: this.formData[key],
          htmlType: htmlType,
          htmlVerifyType: ""
        });
      }
      let para = {
        checkRecordCode: "",
        formCode: this.formParams.formCode,
        passengerCode: "",
        officerCode: "",
        formList: formList
      };
      console.log("这是提交的数据");
      console.log(para);
      return new Promise((resolve, reject) => {
        submitFormData(para).then(res => {
          if (res.result) {
            alert("提交成功");
            resolve(res.data);
          } else {
            reject(res.data);
            // this.$message({
            // 	message: res.data.msg,
            // 	type: 'error'
            // })
          }
          console.log(res);
        });
      });
    },
    goback() {
      this.$router.go(-1);
    }
  },
  created() {
    this.formParams = this.$route.query.formParams;
    this.getFormDicDetail();
  },
  mounted() {
    console.log(this.$route.query.formParams);
  }
};
</script>