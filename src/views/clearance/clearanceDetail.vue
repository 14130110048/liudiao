<template>
  <div id="table">
    <el-row class="top">
      <el-col :span="3" class="return">
        <div @click="goback">
          <img src="../../assets/btnImg/return.png" class="img" />
        </div>
        <div class="title1" @click="goback()">返回</div>
      </el-col>
      <el-col :span="18" class="title">通关记录详情</el-col>
    </el-row>
    <el-row class="DetailBox">
      <el-row class="part" v-if="passengerDetail">
        <el-row class="part-top">
          <span class="color"></span>
          <span class="title">基本信息</span>
        </el-row>
        <el-row class="card">
          <el-row class="baseInfo">
            <el-col :span="12" class="info">
              <span class="name">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span>
              <span class="value">{{passengerDetail.passengerName}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">性&nbsp;&nbsp;&nbsp;&nbsp;别：</span>
              <span class="value">{{passengerDetail.genderStr}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">出生年月：</span>
              <span class="value">{{passengerDetail.birthDateStr}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">国&nbsp;&nbsp;&nbsp;&nbsp;籍：</span>
              <span class="value">{{passengerDetail.countryStr}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">出入境日期：</span>
              <span class="value">{{passengerDetail.entryDateStr}}</span>
            </el-col>
            <el-col :span="12" class="info">
              <span class="name">航班号：</span>
              <span class="value">{{passengerDetail.flightNo}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="image">
              <div class="imgBox">
                <img :src="passengerDetail.faceUrl" />
              </div>
              <div class="imgTitle">人脸</div>
            </el-col>
            <el-col :span="12" class="image">
              <div class="imgBox">
                <img :src="passengerDetail.passportUrl" />
              </div>
              <div class="imgTitle">护照</div>
            </el-col>
          </el-row>
        </el-row>
      </el-row>
      <el-row class="part">
        <el-row class="part-top">
          <span class="color"></span>
          <span class="title">单据信息</span>
        </el-row>
        <el-row class="card">
          <div class="timeLine">
            <div class="partTime">
              <div class="timeBox">{{passengerDetail.checkTimeStr}}</div>
              <div class="line">
                <div class="dot"></div>
              </div>
              <div
                class="content color"
                @click="goShenmingka(passengerDetail.entryDate,passengerDetail.passportCode)"
              >健康申明卡</div>
              <!-- <div
              >{{passengerDetail.checker}}审核通过,<a class="underline" @click="goShenmingka(passengerDetail.entryDate,passengerDetail.passportCode)">点击查看详情</a></div> -->
            </div>
            <div class="partTime" v-for="(item,index) in formList" :key="item.timeStamp">
              <div class="timeBox">{{item.createTimeStr}}</div>
              <div class="line">
                <div class="dot"></div>
              </div>
              <div
                class="content"
                :class="'color-'+index"
                @click="goFormDetail(item)"
              >{{item.formName}}</div>
            </div>
          </div>
        </el-row>
      </el-row>
      <el-row class="part" v-if="entryDetail">
        <el-row class="part-top">
          <span class="color"></span>
          <span class="title">通关信息</span>
        </el-row>
        <el-row class="card">
          <el-row class="passInfo">
            <el-col :span="24">
              <span class="name">通关时间：</span>
              <span class="value">{{entryDetail.entryTimeStr}}</span>
            </el-col>
            <el-col :span="24">
              <p class="name" style="padding:0;margin:0;">通关图像：</p>
              <el-col
                :span="8"
                class="image"
                v-for="item in entryDetail.captureImageList"
                :key="item"
              >
                <div class="imgBox">
                  <img :src="item" />
                </div>
              </el-col>
            </el-col>
            <el-col>
              <span class="name">旅客体温：</span>
              <span class="wendu">{{entryDetail.temperature}}</span>
            </el-col>
          </el-row>
        </el-row>
      </el-row>
      <el-row class="noData" v-if="!passengerDetail&&formList.length==0&&!entryDetail">
        <img src="../../assets/Mainhub/noData.png" class="img" />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { QueryPassengerEntryDetail } from "../../api/api";
export default {
  data() {
    return {
      passportCode: "",
      entryDate: "",
      passengerDetail: {},
      formList: [],
      entryDetail: {}
    };
  },
  mounted() {
    this.passportCode = this.$route.query.passportCode;
    this.entryDate = this.$route.query.entryDate;
    this.getDetail();
  },
  methods: {
    getDetail() {
      let param = {
        passportCode: this.passportCode,
        entryDate: this.entryDate
      };
      QueryPassengerEntryDetail(param)
        .then(res => {
          if (res.result) {
            this.passengerDetail = res.data.passengerDetail;
            this.formList = res.data.formList ? res.data.formList : [];
            this.entryDetail = res.data.entryDetail;
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
    },
    goFormDetail(data) {
      this.$router.push({
        path: "/formRecord/tableRecord",
        query: {
          formParams:data
        }
      });
    },
    goShenmingka(_entryDate,_passportCode) {
      this.$router.push({
        path: "/shenmingka",
        query: {
          formParams: {
            passportCode:_passportCode,
            entryDate:_entryDate
          }
        }
      });
    },
    goback() {
      this.$router.go(-1);
    }
  }
};
</script>
