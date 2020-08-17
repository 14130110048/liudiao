<template>
  <div id="table">
    <el-row class="top">
      <el-col :span="3" class="return">
        <div @click="goback">
          <img src="../../assets/btnImg/return.png" class="img" />
        </div>
        <div class="title1" @click="goback()">返回</div>
      </el-col>
      <el-col :span="18" class="title">送检统计报告</el-col>
    </el-row>
    <el-row class="staticBox">
      <el-row class="box">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true">
            <el-form-item label="日期">
              <el-date-picker
                v-model="searchParam.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="航班号">
              <el-input v-model="searchParam.flightNo" placeholder="请输入航班号"></el-input>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" @click="getDetail">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-row class="chartBox">
          <el-col :span="24">
            <div class="chart" ref="chart1"></div>
          </el-col>
        </el-row>
        <el-row class="radioBox">
          <el-radio-group v-model="tableShow" size="small">
            <el-radio-button label="1">未送检</el-radio-button>
            <el-radio-button label="2">已送检</el-radio-button>
          </el-radio-group>
        </el-row>
        <el-row class="tableBox" v-show="tableShow==1">
          <el-table
            :data="tableData1"
            highlight-current-row
            stripe
            border
            style="width: 100%;"
            height="100%"
          >
            <el-table-column prop="formCode" label="采样单编号" sortable>
              <template scope="scope">
                <span @click="goCaiyang(scope.row)">{{scope.row.formCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nasSwabCode" label="鼻咽拭子采样编码" width sortable></el-table-column>
            <el-table-column prop="venoBloodCode" label="静脉血采样编码" width sortable></el-table-column>
            <el-table-column prop="submitter" label="采样人" width="90" sortable></el-table-column>
            <el-table-column :label="$t('menu.caozuo')" width="80">
              <template scope="scope">
                <el-button type="warning" size="small" @click="sendToCheck(scope.row)">送检</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination
              layout="total,prev, pager, next"
              @current-change="handleCurrentChange"
              :page-size="searchParam.pageSize"
              :current-page="searchParam.pageNum"
              :total="total1"
              style="float:right;"
            ></el-pagination>
          </el-col>
        </el-row>
        <el-row class="tableBox" v-show="tableShow==2">
          <el-table
            :data="tableData2"
            highlight-current-row
            stripe
            border
            style="width: 100%;"
            height="100%"
          >
            <el-table-column prop="formCode" label="采样单编号" sortable>
              <template scope="scope">
                <span @click="goCaiyang(scope.row)">{{scope.row.formCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nasSwabCode" label="鼻咽拭子采样编码" width sortable></el-table-column>
            <el-table-column prop="venoBloodCode" label="静脉血采样编码" width sortable></el-table-column>
            <!-- <el-table-column prop="submitter" label="采样人" width sortable></el-table-column> -->
            <el-table-column prop="sender" label="送检人" width sortable></el-table-column>
            <el-table-column prop="sendTimeStr" label="送检时间" width sortable></el-table-column>
          </el-table>

          <!--工具条-->
          <el-col :span="24" class="toolbar">
            <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
            <el-pagination
              layout="total,prev, pager, next"
              @current-change="handleCurrentChange"
              :page-size="searchParam.pageSize"
              :current-page="searchParam.pageNum"
              :total="total2"
              style="float:right;"
            ></el-pagination>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { QuerySendStatisticsResult, SendFormToCheck } from "../../api/api";
import { sendStatic } from "../../api/echart";
export default {
  data() {
    return {
      searchParam: {
        date: "",
        flightNo: "",
        pageSize: 10,
        pageNum: 1
      },
      chart1: null,
      tableData1: [],
      total1: 0,
      tableShow: 1,
      tableData2: [],
      total2: 0
    };
  },
  mounted() {
    this.searchParam.date = new Date();
    this.initPage();
    window.onresize = function() {
      this.chart1.resize();
    };
  },
  methods: {
    initPage() {
      this.chart1 = this.$echarts.init(this.$refs.chart1);
      this.getDetail();
    },
    getDetail() {
      let param = this.searchParam;
      if (this.searchParam.date) {
        QuerySendStatisticsResult(param)
          .then(res => {
            if (res.result) {
              let data1 = res.data.sendCount;
              let data2 = res.data.unSendCount;
              this.chart1.setOption(sendStatic(data1, data2));
              this.tableData1 = res.data.unSendList
                ? res.data.unSendList.list
                : [];
              this.total1 = res.data.unSendList ? res.data.unSendList.total : 0;
              this.tableData2 = res.data.sendList ? res.data.sendList.list : [];
              this.total2 = res.data.sendList ? res.data.sendList.total : 0;
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
      } else {
        this.$message({
          message: "请先选择日期！",
          type: "warning"
        });
      }
    },
    goback() {
      this.$router.go(-1);
    },
    handleCurrentChange(val) {
      this.searchParam.pageNum = val;
      this.goFormDetail();
    },
    goCaiyang(row) {
      this.$router.push({
        path: "/formRecord/tableRecord",
        query: {
          formParams: {
            formRecordCode: row.formCode,
            formCode: row.formCode.split("-")[0]
          }
        }
      });
    },
    sendToCheck(row) {
      const loading = this.$loading({
        lock: true,
        text: "拼命请求中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let para = {
        userId: JSON.parse(sessionStorage.getItem("user")).userID || "",
        sampleCode: "",
        formCode: row.formCode
      };
      SendFormToCheck(para)
        .then(res => {
          this.loading = false;
          if (res.result) {
            if (res.data == 0) {
              this.$message({
                message: "送检成功！",
                type: "success"
              });
            } else if (res.data == 1) {
              this.$message({
                message: "未找到采样码对应的采样单，请重新输入！",
                type: "error"
              });
            } else if (res.data == 2) {
              this.$message({
                message: "该采样码已送检！",
                type: "warning"
              });
            }
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
          loading.close();
          this.getDetail();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
