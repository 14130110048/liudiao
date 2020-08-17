<template>
  <div id="table">
    <el-row class="top">
      <el-col :span="3" class="return">
        <div @click="goback">
          <img src="../../assets/btnImg/return.png" class="img" />
        </div>
        <div class="title1" @click="goback()">返回</div>
      </el-col>
      <el-col :span="18" class="title">中华人民共和国出/入境健康申明卡</el-col>
    </el-row>
    <el-row class="shenmingkaBox">
      <el-row class="shenmingka">
        <el-row class="card">
          <el-row class="card-top">
            <el-col :span="15" class="card-title" :offset="2">
              <span>中华人民共和国</span>
              <span>出/入境健康申明卡</span>
            </el-col>
            <el-col :span="4" class="logo">
              <img src="../../assets/Mainhub/customLogo.png" class="img" />
            </el-col>
          </el-row>
          <el-row class="cardInfo">
            <el-col :span="12" class="info">
              <span class="name">姓名：</span>
              <span class="value">{{formDetail.passerName}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">性别：</span>
              <span class="value">{{formDetail.gender}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">出生年月：</span>
              <span class="value">{{formDetail.birthdate}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">国籍(地区)：</span>
              <span class="value">{{formDetail.country}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">职业：</span>
              <span class="value">{{formDetail.job}}</span>
            </el-col>
            <!-- <el-col :span="12" class="info">
              <span class="name">证件类型：</span>
              <span class="value">{{formDetail.certType}}</span>
            </el-col>-->
            <el-col :span="12" class="info">
              <span class="name">证件号码：</span>
              <span class="value">{{formDetail.certNo}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">航班(船班/车次)号：</span>
              <span class="value">{{formDetail.flightNo}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">座位号：</span>
              <span class="value">{{formDetail.seatNo}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">联系方式：</span>
              <span class="value">{{formDetail.telephone}}</span>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，您旅居的国家和地区(请具体到城市，国内地址请具体到所在街道/乡镇)：</el-col>
              <el-col v-for="(item,index) in formDetail.everTravelList" :key="index">
                <el-col :span="12" class="info1">
                  <span class="name">日期：</span>
                  <span class="value">{{item.startDateStr}} ~ {{item.endDateStr}}</span>
                </el-col>
                <el-col :span="12" class="info1">
                  <span class="name">旅居国家或地区：</span>
                  <span class="value">{{item.country}}/{{item.city}}/{{item.addressDetail}}</span>
                </el-col>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，曾接触新冠肺炎确诊病例/疑似病例/无症状感染者</el-col>
              <el-col>
                <el-radio v-model="formDetail.hasContactSufferer" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.hasContactSufferer" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，曾接触有发热和/或呼吸道症状的感染者</el-col>
              <el-col>
                <el-radio v-model="formDetail.hasTouchAlike" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.hasTouchAlike" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，所居住社区曾报告有新冠肺炎病例</el-col>
              <el-col>
                <el-radio v-model="formDetail.isEstateInfected" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.isEstateInfected" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，所在办公室/家庭等是否出现2人及以上有发热和/或呼吸道症状感染者</el-col>
              <el-col>
                <el-radio v-model="formDetail.hasInClusterCase" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.hasInClusterCase" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，是否有不适症状</el-col>
              <el-col :span="24" class="info">
                <span class="name">症状：</span>
                <span class="value">{{formDetail.hasSymtom}}</span>
              </el-col>
              <el-col :span="24" class="info">
                <span class="name">其他症状：</span>
                <span class="value">{{formDetail.symtom}}</span>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col class="name">过去14日至今，是否曾服用退烧药、感冒药、止咳药</el-col>
              <el-col>
                <el-radio v-model="formDetail.hasTakenAntipyretics" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.hasTakenAntipyretics" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <el-col>过去14日至今，您是否接受过新冠病毒检测</el-col>
              <el-col>
                <el-radio v-model="formDetail.hasCIDTes" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.hasCIDTes" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info" v-if="formDetail.hasCIDTes==1">
              <el-col>如果您接受过新冠病毒检测，检测结果是否为阳性</el-col>
              <el-col>
                <el-radio v-model="formDetail.testResult" label="1" disabled>是</el-radio>
                <el-radio v-model="formDetail.testResult" label="0" disabled>否</el-radio>
              </el-col>
            </el-col>
            <el-col :span="24" class="info">
              <span class="name">审核人：</span>
              <span class="value">{{formDetail.checker}}</span>
            </el-col>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { QueryPasserHealthyInfo } from "../../api/api";
export default {
  data() {
    return {
      formDetail: {},
      formParam: {}
    };
  },
  mounted() {
    this.formParam = this.$route.query.formParams;
    this.getHealthyInfo();
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    getHealthyInfo() {
      QueryPasserHealthyInfo(this.formParam)
        .then(res => {
          // console.log(res);
          if (res.result) {
            this.formDetail = res.data;
            if (this.formDetail) {
              this.formDetail.hasContactSufferer = this.formDetail.hasContactSufferer.toString();
              this.formDetail.hasTouchAlike = this.formDetail.hasTouchAlike.toString();
              this.formDetail.isEstateInfected = this.formDetail.isEstateInfected.toString();
              this.formDetail.hasInClusterCase = this.formDetail.hasInClusterCase.toString();
              this.formDetail.hasTakenAntipyretics = this.formDetail.hasTakenAntipyretics.toString();
              this.formDetail.hasCIDTes = this.formDetail.hasCIDTes.toString();
              this.formDetail.testResult = this.formDetail.testResult.toString();
            }
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
