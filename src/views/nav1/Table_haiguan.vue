<template>
  <div id="table">
    <el-row class="top">
      <el-col :span="2" class="return">
        <!-- <el-button size="mini" type="primary" @click="goback">返回</el-button> -->
        <div @click="goback">
          <img src="../../assets/btnImg/return.png" class="img" />
        </div>
        <div class="title1" @click="goback()">{{$t('menu.fanhui')}}</div>
      </el-col>
      <el-col :span="18" class="title">{{formParams.formName?formParams.formName:formName}}</el-col>
      <!-- <el-col class="remainTime" :span="4">已用时长 {{remainTimeFormat}}</el-col> -->
    </el-row>
    <!-- <img :src="liudiao_topLeft" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;left: 0;">
		<img :src="liudiao_topRight" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;right: 0;">
		<img :src="liudiao_bottomLeft" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;left: 0;">
    <img :src="liudiao_bottomRight" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;right: 0;">-->
    <!-- <el-button size="mini" type="primary" @click="goback">返回</el-button>
		<div style="text-align: center;font-size: 28px;text-align: center;font-weight: 700;" :span="24">
			{{formParams.formName}}
    </div>-->
    <!-- <div style="text-align: center;font-size: 14px;padding-top: 15px;padding-bottom: 10px;" :span="24">
			为了您和他人的健康，请如实填报，如有隐瞒或者虚假填报，将依法追究相关责任
		</div>
    <div class="devideLine"></div>-->
    <div
      class="zhang"
      :style="{color:colorF,borderColor:colorF}"
      v-if="bukongqingkuangFlag"
    >{{bukongqingkuangFlag}}</div>
    <div
      class="tongxing"
      :style="{color:tongxingColor,borderColor:tongxingColor}"
      v-if="tongxingFlag"
    >{{tongxingFlag}}</div>
    <el-row class="formData">
      <el-row class="formBox">
        <ele-form
          class="lmk"
          :formDesc="formDesc"
          v-model="formData"
          :isLoading="isLoading"
          :formError="formError"
          @request="handleRequest"
          :isShowSubmitBtn="false"
          :isShowBackBtn="false"
          disabled="true"
          :span="24"
          labelPosition="top"
        ></ele-form>
      </el-row>
    </el-row>
    <div class="loading" v-if="isLoading">
      <div class="loading-icon">
        <p class="loading-text">{{$t('menu.loading')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getFormDetail, submitFormData } from "../../api/api";
import liudiao_topLeft from "../../assets/liudiao_topLeft.png";
import liudiao_topRight from "../../assets/liudiao_topRight.png";
import liudiao_bottomLeft from "../../assets/liudiao_bottomLeft.png";
import liudiao_bottomRight from "../../assets/liudiao_bottomRight.png";
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
      bukongqingkuangFlag: "",
      colorF: "",
      formName: "",
      tongxingFlag: "",
      tongxingColor: ""
    };
  },
  watch: {
    //检测数据结构发生变化
    formData: {
      handler: function(val, oldVal) {
        if (val.bukongqingkuang == "1") {
          this.bukongqingkuangFlag = "PROSAS预警";
          this.colorF = "red";
        } else if (val.bukongqingkuang == "2") {
          this.bukongqingkuangFlag = "边检通报";
          this.colorF = "green";
        } else if (val.bukongqingkuang == "3") {
          this.bukongqingkuangFlag = "旅通系统";
          this.colorF = "yellow";
        } else if (val.bukongqingkuang == "4") {
          this.bukongqingkuangFlag = "否";
          this.colorF = "#b3a8a8";
        } else if (val.bukongqingkuang == "5") {
          this.bukongqingkuangFlag = "风控通报";
          this.colorF = "";
        }
        if (val.relpassercount == 0) {
          this.tongxingFlag = "无同行旅客";
          this.tongxingColor = "green";
        } else if (val.relpassercount > 0) {
          this.tongxingFlag = val.relpassercount + "同行旅客";
          this.tongxingColor = "red";
        } else {
          this.tongxingFlag = "";
          this.tongxingColor = "";
        }
      },
      deep: true
    }
  },
  methods: {
    getFormDetail() {
      //获取表格列表
      this.isLoading = true;
      let para = {
        formCode: this.formParams.formCode,
        languageCode: localStorage.lang,
        formRecordCode: this.formParams.formRecordCode
      };
      getFormDetail(para).then(res => {
        if (res.result) {
          let data = res.data;
          //获取到页面表单渲染数据
          this.formDesc = JSON.parse(data.formTemplate.htmltemplatetext);
          this.formName = data.formTemplate.name;
          this.formDesc = this.formDesc.formDesc
            ? this.formDesc.formDesc
            : this.formDesc;
          //获取到页面填充数据
          let formList = data.formData.formList;
          this.formParams.formDictCode = data.formData.formCode;
          if (formList && formList.length > 0) {
            for (let i = 0; i < formList.length; i++) {
              // this.formData[formList[i].htmlCode] = formList[i].htmlValue;
              //更改数据不更新
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
        } else {
          this.$message({
            message: res.msg,
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
        this.$message.success(this.$t("menu.addSuccess"));
        // this.$router.back() // 跳转回上一页
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

  mounted() {
    console.log(this.$route.query.formParams);
    this.formParams = this.$route.query.formParams;
    this.getFormDetail();
  }
};
</script>
