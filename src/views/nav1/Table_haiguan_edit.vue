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
      <!-- <el-col class="remainTime" :span="5">用时 {{remainTimeFormat}}</el-col> -->
    </el-row>

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
    <!-- <div
      style="text-align: center;font-size: 24px;text-align: center;padding-top: 0px;padding-bottom: 30px;font-weight: 700;"
      :span="24"
    >{{formParams.formDictName}}</div>-->
    <el-row class="formData">
      <el-row class="formBox">
        <ele-form
          class="lmk"
          :formDesc="formDesc"
          v-model="formData"
          :isLoading="isLoading"
          :formError="formError"
          @request="handleRequest"
          :submitBtnText="$t('menu.tijiao')"
          :backBtnText="$t('menu.fanhui')"
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
import {
  editFormData,
  getFormDetail,
  getFormDetail_youke,
  submitFormData_youke,
  GetPassengerInfoByJianKangMa,
  GetPassengerInfoByHuZhaoHao,
  GetFlightPersonTypeInfo
} from "../../api/api";
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
      formData: {},
      formDesc: {},
      bukongqingkuangFlag: "",
      colorF: "",
      timer: null,
      remainTime: 0,
      remainTimeFormat: "",
      formName: "",
      tongxingFlag: "",
      tongxingColor: ""
    };
  },
  watch: {
    // 检测数据结构发生变化
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
    makeFun(formDesc_) {
      for (let k in formDesc_) {
        let d = formDesc_[k];
        if (d.vif) {
          console.log("函数重构" + k);
          formDesc_[k].vif = new Function("return " + d.vif)();
        }
        // if (d.options && d.type != "select") {
        //   console.log(k);
        //   this.formData[k] = [];
        // }
        if (d.attrs) {
          if (d.attrs.responseFn) {
            console.log("图片上传函数重构" + k);
            formDesc_[k].attrs.responseFn = new Function(
              "return " + d.attrs.responseFn
            )();
          }
          if (d.attrs.httpRequest) {
            console.log("图片上传函数重构" + k);
            formDesc_[k].attrs.httpRequest = new Function(
              "return " + d.attrs.httpRequest
            )();
          }
        }
        if (d.on) {
          if (d.on.click) {
            formDesc_[k].on.click = new Function("return " + d.on.click)();
          }
        }
        //校验重构rules
        if (d.rules) {
          formDesc_[k].rules.forEach(item => {
            if (item.validator) {
              item.validator = eval("(" + item.validator + ")");
            }
          });
        }
      }

      this.formDesc = formDesc_;
      console.log("这是被注入的数据");
      console.log("这是被替换后的fomrData");
      console.log(this.formData);
      console.log("这是处理过的表单数据");
      console.log(this.formDesc);

      this.$nextTick(() => {
        // 如果是临检表，先获取当前默认日期
        if (this.formParams.code == "liudiaobiao") {
          this.$set(
            this.formData,
            "churujingshijian",
            parseInt(new Date().getTime() / 1000)
          );
        } else if (this.formParams.code == "dengjilinjianbiao") {
          this.$set(
            this.formData,
            "hangbanriqi",
            parseInt(new Date().getTime() / 1000)
          );
        } else if (this.formParams.code == "kuaisuliudiaobiao") {
          this.$set(
            this.formData,
            "churujingshijian",
            parseInt(new Date().getTime() / 1000)
          );
        }
        setTimeout(() => {
          // 扫一扫健康码获取信息
          var d = document.getElementsByClassName("saoyisao");
          for (let i = 0; i < d.length; i++) {
            d[i].addEventListener("click", e => {
              if (event.target.type === "button") {
                console.log("点击了button" + e.target.id);
                console.log(this);
                this.scan(e.target.id);
              } else {
                console.log("点击了子元素" + e.path[1].id);
                this.scan(e.path[1].id);
              }
            });
          }
          // 护照号获取信息
          var d = document.getElementsByClassName("huzhaohaohuoquxinxi");
          for (let i = 0; i < d.length; i++) {
            d[i].addEventListener("click", e => {
              if (!this.formData.huzhaohaoma) {
                this.$message({
                  message: this.$t("menu.huzhaotip"),
                  type: "error"
                });
                return;
              }
              this.GetPassengerInfoByHuZhaoHao();
            });
          }
          // 护照航班信息
          var d = document.getElementsByClassName("huoquhangbanxinxi");
          for (let i = 0; i < d.length; i++) {
            d[i].addEventListener("click", e => {
              if (!this.formData.hangbanriqi) {
                this.$message({
                  message: this.$t("menu.hangbantimetip"),
                  type: "error"
                });
                return;
              }
              if (!this.formData.hangbanhao) {
                this.$message({
                  message: this.$t("menu.hangbanhaotip"),
                  type: "error"
                });
                return;
              }
              if (!this.formData.hangxian) {
                this.$message({
                  message: this.$t("menu.hangxianguojiatip"),
                  type: "error"
                });
                return;
              }
              this.GetFlightPersonTypeInfo();
            });
          }
          // 手动通过健康码获取航班信息
          var d = document.getElementsByClassName("shoudongjiankangmahuoqu");
          for (let i = 0; i < d.length; i++) {
            d[i].addEventListener("click", e => {
              if (!this.formData.jiankangma) {
                this.$message({
                  message: this.$t("menu.jiankangmatip"),
                  type: "error"
                });
                return;
              }
              this.GetPassengerInfoByJianKangMa(this.formData.jiankangma);
            });
          }
        }, 800);
      });
    },
    GetPassengerInfoByHuZhaoHao() {
      let that = this;
      const loading = that.$loading({
        lock: true,
        text: that.$t("menu.loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let para = {
        huZhaoHao: that.formData.huzhaohaoma,
        formDictCode: that.formParams.formDictCode
      };
      GetPassengerInfoByHuZhaoHao(para).then(res => {
        if (res.result && res.data.data) {
          // let data = res.data.data
          // for (let k in data) {
          // 	that.$set(that.formData, k, data[k]);
          // }
          // 获取到页面填充数据
          let formList = res.data.data;
          if (formList && formList.length > 0) {
            for (let i = 0; i < formList.length; i++) {
              that.$set(
                that.formData,
                formList[i].htmlCode,
                formList[i].htmlValue
              );
              if (formList[i].htmlType == "DateTime") {
                that.$set(
                  that.formData,
                  formList[i].htmlCode,
                  parseInt(formList[i].htmlValue)
                );
              }
            }
          }
          that.$message({
            message: that.$t("menu.getPesInfoSuccess"),
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
        loading.close();
      });
    },
    GetFlightPersonTypeInfo() {
      let that = this;
      const loading = that.$loading({
        lock: true,
        text: this.$t("menu.loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let para = {
        formDictCode: that.formParams.formDictCode,
        flightNo: that.formData.hangbanhao,
        flightDate: that.formData.hangbanriqi,
        country: that.formData.hangxian
      };
      GetFlightPersonTypeInfo(para).then(res => {
        if (res.result && res.data.data) {
          // let data = res.data.data
          // for (let k in data) {
          // 	that.$set(that.formData, k, data[k]);
          // }
          // 获取到页面填充数据
          let formList = res.data.data;
          if (formList && formList.length > 0) {
            for (let i = 0; i < formList.length; i++) {
              that.$set(
                that.formData,
                formList[i].htmlCode,
                formList[i].htmlValue
              );
              if (formList[i].htmlType == "DateTime") {
                that.$set(
                  that.formData,
                  formList[i].htmlCode,
                  parseInt(formList[i].htmlValue)
                );
              }
            }
          }
          that.$message({
            message: this.$t("menu.getPesInfoSuccess"),
            type: "success"
          });
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
        loading.close();
      });
    },
    getFormDetail() {
      // 获取表格列表
      this.isLoading = true;
      let para = {
        formCode: this.formParams.formCode,
        languageCode: localStorage.lang,
        formRecordCode: this.formParams.formRecordCode
      };
      getFormDetail(para).then(res => {
        if (res.result) {
          let data = res.data;
          // 获取到页面表单渲染数据
          let formDesc = JSON.parse(data.formTemplate.htmltemplatetext);
          this.formName = data.formTemplate.name;
          formDesc = formDesc.formDesc ? formDesc.formDesc : formDesc;
          // 获取到页面填充数据
          let formList = data.formData.formList;
          this.formParams.formDictCode = data.formData.formCode;
          if (formList && formList.length > 0) {
            for (let i = 0; i < formList.length; i++) {
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
          this.makeFun(formDesc);
          this.isLoading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    GetPassengerInfoByJianKangMa(jiankangma_) {
      // 获取表格列表
      let that = this;
      const loading = that.$loading({
        lock: true,
        text: that.$t("menu.loading"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let para = {
        jianKangMa: jiankangma_,
        formDictCode: that.formParams.formDictCode
      };
      GetPassengerInfoByJianKangMa(para).then(res => {
        if (res.result) {
          if (res.msg) {
            that.$notify.error({
              message: res.msg
            });
          }
          if (res.data.data) {
            let data = res.data.data;
            for (let k in data) {
              that.$set(that.formData, k, data[k]);
            }
            // 获取到页面填充数据
            let formList = res.data.data;
            if (formList && formList.length > 0) {
              for (let i = 0; i < formList.length; i++) {
                that.$set(
                  that.formData,
                  formList[i].htmlCode,
                  formList[i].htmlValue
                );
                if (formList[i].htmlType == "DateTime") {
                  that.$set(
                    that.formData,
                    formList[i].htmlCode,
                    parseInt(formList[i].htmlValue)
                  );
                }
              }
            }
            that.$notify.warning({
              message: that.$t("menu.getPesInfoSuccess"),
              offset: 70
            });
          }
        } else {
          that.$message({
            message: res.msg,
            type: "error"
          });
        }
        loading.close();
      });
    },
    async handleRequest(data) {
      if (this.isLoading) return; // 判断状态
      try {
        this.isLoading = true; // 更改状态
        const response = await this.submitFormData(); // 发送请求
        // 成功处理
        this.$message.success(this.$t("menu.editSuccess"));
        this.goback(); // 跳转回上一页
      } catch (error) {
        // 处理错误
        // 为了表单同步显示后端返回的错误, 需要将错误信息传递给表单
        this.formError = {
          错误: error
        };
      } finally {
        this.isLoading = false;
      }
    },
    submitFormData() {
      console.log(JSON.stringify(this.formData));
      let formList = [];
      for (let key in this.formData) {
        if (
          this.formData[key] instanceof Array &&
          this.formData[key].length == 0
        ) {
          this.formData[key] = "";
        }
        formList.push({
          htmlCode: key,
          htmlValue: this.formData[key],
          htmlType: "",
          htmlVerifyType: ""
        });
      }
      let para = {
        formRecordCode: this.formParams.formRecordCode,
        formList: formList
      };
      console.log("这是提交的数据");
      console.log(para);
      return new Promise((resolve, reject) => {
        editFormData(para).then(res => {
          if (res.result) {
            resolve(res.data);
          } else {
            console.log(res);
            reject(res.msg);
            // this.$message({
            // 	message: res.data.msg,
            // 	type: 'error'
            // })
          }
          console.log(res);
        });
      });
    },
    scan(ziduan_) {
      let that = this;
      var FNScanner = api.require("FNScanner");
      FNScanner.openScanner(
        {
          autorotation: true,
          isLight:true
        },
        function(ret, err) {
          if (ret) {
            if (ret.eventType == "success") {
              let code = ret.content;
              if (code.length < 18) {
                this.$message({
                  message: "健康码扫描不正确,请重新扫描一次",
                  type: "warning"
                });
              } else {
                if (code.indexOf("*") > -1) {
                  code = code.slice(0, code.indexOf("*"));
                }
                that.$set(that.formData, ziduan_, code);
                that.GetPassengerInfoByJianKangMa(code);
              }
            }
          } else {
            alert(JSON.stringify(err));
          }
        }
      );
    },
    goback() {
      this.$router.go(-1);
    },
    setTimeFormat() {
      this.remainTime++; // 当前秒数
      let hour = 0;
      let min = 0;
      let sec = 0;
      hour = parseInt(this.remainTime / (60 * 60));
      if (hour > 0) {
        // 大于等于一个小时，返回
        this.goback();
      } else {
        min = parseInt(this.remainTime / 60);
        if (min > 0) {
          sec = parseInt(this.remainTime % 60);
        } else {
          sec = parseInt(this.remainTime);
        }
        min = min < 10 ? "0" + parseInt(min) : parseInt(min);
        sec = sec < 10 ? "0" + parseInt(sec) : parseInt(sec);
        this.remainTimeFormat = min + ":" + sec;
      }
    }
  },
  mounted() {
    // console.log(this.$route.query.formParams)
    this.formParams = this.$route.query.formParams;
    this.getFormDetail();
    // clearInterval(this.timer);
    // this.timer = setInterval(() => {
    //   this.setTimeFormat();
    // }, 1000);
  },
  beforeDestroy() {
    // 页面关闭前关闭定时器
    // clearInterval(this.timer);
  }
};
</script>
