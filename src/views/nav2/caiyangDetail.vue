<template>
  <div id="table" style="position:relative;z-index:auto;">
    <!-- <img :src="liudiao_topLeft" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;left: 0;">
		<img :src="liudiao_topRight" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;right: 0;">
		<img :src="liudiao_bottomLeft" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;left: 0;">
		
    <img :src="liudiao_bottomRight" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;right: 0;">-->
    <div style="width: calc(100% - 30px);display: flex;padding:15px;">
      <el-button size="mini" type="success" @click="goback" style="margin-right: auto;">返回</el-button>
      <div style="display: flex;justify-content: end;">
        <el-button
          size="small"
          type="primary"
          @click="chooseOtherList(item.formTemplate.code)"
          v-for="item in otherList"
          :key="item.formTemplate.code"
        >{{item.formTemplate.name}}</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div
      style="text-align: center;font-size: 28px;text-align: center;font-weight: 700;margin-top:10px;"
      :span="24"
    >{{radioChoose}}</div>
    <!-- <div style="text-align: center;font-size: 14px;padding-top: 15px;padding-bottom: 10px;" :span="24">
			为了您和他人的健康，请如实填报，如有隐瞒或者虚假填报，将依法追究相关责任
		</div>
    <div class="devideLine"></div>-->
    <el-row class="formData" style="height:calc(100% - 110px)">
      <el-row class="formBox">
      <ele-form
        class="lmk"
        :formDesc="formDesc"
        v-model="formData"
        :isLoading="isLoading"
        :visible.sync="isShowDialog"
        :formError="formError"
        @request="handleRequest"
        labelPosition="top"
        :span="24"
        @submit.native.prevent
      ></ele-form>
      </el-row>
    </el-row>
    <div class="loading" v-if="isLoading">
      <div class="loading-icon">
        <p class="loading-text">拼命加载中</p>
      </div>
    </div>

    <el-dialog width="80%" :visible.sync="isShowDialog">
      <ele-form
        :formDesc="formDesc_other"
        v-model="formData_other"
        :isLoading="isLoading"
        isDialog
        disabled
        :isShowBackBtn="false"
        :isShowSubmitBtn="false"
        :visible.sync="isShowDialog"
        :formError="formError"
        @request="handleRequest"
        labelPosition="top"
      ></ele-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFormDetail,
  submitFormData,
  getTaskDetail,
  submitTask,
  getRelatedFormDetailListByTaskCode
} from "../../api/api";
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
      isLoading: false,
      formError: null,
      liudiao_topLeft: liudiao_topLeft,
      liudiao_topRight: liudiao_topRight,
      liudiao_bottomLeft: liudiao_bottomLeft,
      liudiao_bottomRight: liudiao_bottomRight,
      formData: {},
      formDesc: {},
      formData_other: {},
      formDesc_other: {},
      radioChoose: "",
      radioDic: {
        流调表: "liudiaobiao",
        采样表: "caiyangbiao",
        判定表: "pandingbiao",
        结果表: "chayanjieguobiao"
      },
      isShowDialog: false,
      otherList: []
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
      console.log(this.formDesc_other);
      for (let k in this.formDesc_other) {
        let d = this.formDesc_other[k];
        if (d.vif) {
          console.log("函数重构函数重构函数重构函数重构函数重构函数重构" + k);
          this.formDesc_other[k].vif = new Function("return " + d.vif)();
        }
        if (d.options) {
          console.log(k);
          newFormData[k] = [];
        }
        if (d.attrs) {
          if (d.attrs.responseFn) {
            console.log("图片上传函数重构" + k);
            this.formDesc_other[k].attrs.responseFn = new Function(
              "return " + d.attrs.responseFn
            )();
          }
          if (d.attrs.httpRequest) {
            console.log("图片上传函数重构" + k);
            this.formDesc_other[k].attrs.httpRequest = new Function(
              "return " + d.attrs.httpRequest
            )();
          }
        }
       // 校验重构rules
        if (d.rules) {
          this.formDesc_other[k].rules.forEach(item => {
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
    chooseOtherList(code_) {
      //遍历找到当前页面选定的类型
      let data = null;
      this.otherList.forEach(item => {
        if (item.formTemplate.code == code_) {
          data = item;
        }
      });
      //获取到页面表单渲染数据
      this.formDesc_other = JSON.parse(data.formTemplate.htmltemplatetext);
      this.formDesc_other = this.formDesc_other.formDesc
        ? this.formDesc_other.formDesc
        : this.formDesc_other;
      //获取到页面填充数据
      let formList = data.formData.formList;
      if (formList && formList.length > 0) {
        for (let i = 0; i < formList.length; i++) {
          this.formData_other[formList[i].htmlCode] = formList[i].htmlValue;
          if (formList[i].htmlType == "DateTime") {
            this.formData_other[formList[i].htmlCode] = parseInt(
              formList[i].htmlValue
            );
          }
        }
      }
      this.makeFun();
      this.isShowDialog = true;
    },
    getRelatedFormDetailListByTaskCode() {
      let para = {
        taskCode: this.formParams.taskCode
      };
      getRelatedFormDetailListByTaskCode(para).then(res => {
        if (res.result) {
          this.otherList = res.data.list;
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
      this.isLoading = true;
      let para = {
        taskCode: this.formParams.taskCode,
        formCode: "",
        languageCode: localStorage.lang,
        formRecordCode: "",
        formType: JSON.parse(sessionStorage.getItem("user")).formType
      };
      getTaskDetail(para).then(res => {
        if (res.data.result) {
          let data = res.data.data;
          //获取到页面表单渲染数据
          this.formDesc = JSON.parse(data.formTemplate.htmltemplatetext);
          this.formDesc = this.formDesc.formDesc
            ? this.formDesc.formDesc
            : this.formDesc;
          //获取到页面填充数据
          let formList = data.formData.formList;
          if (formList && formList.length > 0) {
            for (let i = 0; i < formList.length; i++) {
              //
              // this.formData[formList[i].htmlCode] = formList[i].htmlValue;
               this.$set(
                this.formData,
                formList[i].htmlCode,
                formList[i].htmlValue
              );
              if (formList[i].htmlType == "DateTime") {
                // this.formData[formList[i].htmlCode] = parseInt(
                //   formList[i].htmlValue
                // );
                 this.$set(
                  this.formData,
                  formList[i].htmlCode,
                  parseInt(formList[i].htmlValue)
                );
              }
            }
          }
          this.isLoading = false;
          setTimeout(() => {
            //获取焦点
            document.getElementById("caiyangbianma").focus();
            //回车事件
            // document.getElementById("caiyangbianma").onkeydown = function(e) {
            //   let key = window.event.keyCode;
            //   if (key == 13) {
            //     return false;
            //   }
            // };
          }, 600);
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
        this.$message.success("提交成功");
        this.goback(); // 跳转回上一页
      } catch (error) {
        // 处理错误
        // 为了表单同步显示后端返回的错误, 需要将错误信息传递给表单
        this.formError = { 错误: "提交错误" };
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
        formType: JSON.parse(sessionStorage.getItem("user")).formType,
        checkRecordCode: "",
        taskCode: this.formParams.taskCode,
        formCode: this.formParams.formCode,
        passengerCode: "",
        officerCode: "",
        formList: formList,
        userId: JSON.parse(sessionStorage.getItem("user")).userID
      };
      console.log("这是提交的数据");
      console.log(para);
      return new Promise((resolve, reject) => {
        submitTask(para).then(res => {
          if (res.result) {
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

  mounted() {
    let formType = JSON.parse(sessionStorage.getItem("user")).formType;
    if (formType == "jianyanyuan") {
      this.radioChoose = "现场采样环节记录";
    } else if (formType == "pandingyuan") {
      this.radioChoose = "口岸新型冠状病毒肺炎流行病学判定表";
    } else if (formType == "jiankangyuan") {
      this.radioChoose = "口岸新型冠状病毒肺炎流行病学查验结果表";
    }
    this.formParams = this.$route.query.formParams;
    this.getFormDetail();
    this.getRelatedFormDetailListByTaskCode();
  },
  created() {
    //禁用这个页面回车事件
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key == 13) {
        return false;
      }
    };
  }
};
</script>
<style lang="scss">
// form {
// 	background-color: white;
// 	border: 1px solid #dedede;
// 	padding: 60px;
// 	margin-top: 30px;
// 	font-size: 34px !important;
// }

.el-form-item__label {
  font-size: 18px;
  // font-weight: bold;
  color: #000000;
}

.el-form-item__content {
  // display: flex !important;
  // align-items: center !important;
  // justify-content: center;
}
.el-divider--horizontal {
  margin: 0;
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
</style>