<template>
  <div id="dashboard">
    <el-row>
      <el-row class="top">
        <span class="color"></span>
        <span class="title">{{$t('menu.jinrigailan')}}</span>
      </el-row>
      <el-row class="cardBox">
        <el-row>
          <el-col
            class="card"
            :span="6"
            v-for="(item,index) in summaryList"
            :key="item.itemCode"
            :class="[(index+1)%4==0?'rightcard':'',index<4&&summaryList.length>4?'bottom':'']"
          >
            <div class="name">
              <span class="icon" :class="'icon-'+item.itemCode"></span>
              <span class="font">{{item.itemName}}</span>
            </div>
            <div class="value" :class="'value-'+item.itemCode">{{item.display}}</div>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <el-row>
      <el-row class="top">
        <span class="color"></span>
        <span class="title">{{$t('menu.lishiqushi')}}</span>
      </el-row>
      <el-row class="chartBox">
        <el-col :span="24">
          <p>{{$t('menu.biaodanshuliang')}}</p>
          <div class="chart" ref="chart1"></div>
        </el-col>
        <el-col
          :span="24"
          style="border-top: 1px dotted #c5d1d5;"
          v-if="roleCode=='admin'||roleCode=='linjianyuan'"
        >
          <p>{{$t('menu.tianxieshichang')}}</p>
          <div class="chart" ref="chart2"></div>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { formNum, formTime } from "../../api/echart";
import { GetSummary, GetStatistics, GetDurationStatistic } from "../../api/api";
export default {
  data() {
    return {
      userId: "",
      roleCode: "",
      chart1: "",
      chart2: "",
      summaryList: [],
      data1: [],
      data2: []
    };
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem("user")).userID || "";
    this.roleCode = JSON.parse(sessionStorage.getItem("user")).roleCode || "";
  },
  mounted() {
    this.initPage();
    window.onresize = function() {
      this.chart1.resize();
      if (this.roleCode == "admin" || this.roleCode == "linjianyuan") {
        this.chart2.resize();
      }
    };
  },
  methods: {
    initPage() {
      this.chart1 = this.$echarts.init(this.$refs.chart1);
      this.getSummary();
      this.getStatistics();
      if (this.roleCode == "admin" || this.roleCode == "linjianyuan") {
        this.chart2 = this.$echarts.init(this.$refs.chart2);
        this.getDurationStatistic();
      }
    },
    getSummary() {
      let param = {
        UserId: this.userId
      };
      GetSummary(param)
        .then(res => {
          if (res.result) {
            this.summaryList = res.data.items;
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
    getStatistics() {
      let param = {
        UserId: this.userId
      };
      GetStatistics(param)
        .then(res => {
          if (res.result) {
            this.data1 = res.data.items;
            this.chart1.setOption(formNum(this.data1));
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
    getDurationStatistic() {
      let param = {
        UserId: this.userId
      };
      GetDurationStatistic(param)
        .then(res => {
          if (res.result) {
            this.data2 = res.data.items;
            this.chart2.setOption(formTime(this.data2));
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
  },
  beforeDestroy() {
    //页面关闭前关闭定时器
    // clearInterval(this.timer);
  }
};
</script>
