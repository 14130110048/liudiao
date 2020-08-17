<template>
  <section
    style=" position: relative;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    overflow:hidden;
    padding: 20px;
    background-color: #fff;"
    class="inspection"
  >
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="sampleCode"
            placeholder="请输入采样码"
            @keyup.enter.native="getListBy"
            ref="sampleCode"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getListBy">送检</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" v-on:click="refrsh">刷新</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="warning" @click="goStatic">送检统计</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="formData"
      highlight-current-row
      stripe
      border
      style="width: 100%;"
      height="calc(100% - 75px)"
    >
      <el-table-column prop="formCode" label="采样单编号" sortable>
        <template scope="scope">
          <span @click="goCaiyang(scope.row)">{{scope.row.formCode}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="passengerName" label="旅客姓名" width sortable></el-table-column>
      <el-table-column prop="passportCode" label="护照号" width sortable></el-table-column>-->
      <el-table-column prop="nasSwabCode" label="鼻咽拭子采样编码" width sortable></el-table-column>
      <el-table-column prop="venoBloodCode" label="静脉血采样编码" width sortable></el-table-column>
      <!-- <el-table-column prop="sendTimeStr" label="采样时间" width sortable></el-table-column> -->
      <el-table-column prop="submitter" label="采样人" width="90" sortable></el-table-column>
      <el-table-column :label="$t('menu.caozuo')" width="80">
        <template scope="scope">
          <el-button type="warning" size="small" @click="sendForm(scope.row)">送检</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
      <el-pagination
        layout="total,prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </section>
</template>

<script>
import { QueryUnSendFormList, SendFormToCheck } from "../../api/api";

export default {
  data() {
    return {
      formData: [],
      total: 0,
      pageSize: 20,
      pageNum: 1,
      sampleCode: "",
      userId: ""
    };
  },
  methods: {
    refrsh() {
      this.pageNum = 1;
      this.sampleCode = "";
      this.getInspectionList();
    },
    getListBy() {
      this.formCode = "";
      if (this.sampleCode) {
        if (!this.sampleCode.match( /^[\dA-Z]+$/)) {
          this.$notify({
            message: "采样码为数字或者大写字母",
            type: "error"
          });
        } else {
          this.sendToCheck();
        }
      } else {
        this.$notify({
          message: "请输入采样码",
          type: "error"
        });
      }
    },
    sendForm(data) {
      this.sampleCode = "";
      this.formCode = data.formCode;
      this.sendToCheck();
    },
    // 获取用户列表
    getInspectionList() {
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      QueryUnSendFormList(para).then(res => {
        if (res.result) {
          this.total = res.data.total;
          this.formData = res.data.list;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        console.log(res);
      });
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getInspectionList();
    },
    sendToCheck() {
      const loading = this.$loading({
        lock: true,
        text: "拼命请求中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      let para = {
        userId: JSON.parse(sessionStorage.getItem("user")).userID || "",
        sampleCode: this.sampleCode,
        formCode: this.formCode
      };
      SendFormToCheck(para)
        .then(res => {
          this.loading = false;
          if (res.result) {
            if (res.data == 0) {
              // this.$message({
              //   message: "送检成功！",
              //   type: "success"
              // });
              this.$notify({
                message: "送检成功！",
                type: "success"
              });
            } else if (res.data == 1) {
              // this.$message({
              //   message: "未找到采样码对应的采样单，请重新输入！",
              //   type: "error"
              // });
              this.$notify({
                message: "未找到采样码对应的采样单，请重新输入！",
                type: "error"
              });
            } else if (res.data == 2) {
              // this.$message({
              //   message: "该采样码已送检！",
              //   type: "warning"
              // });
              this.$notify({
                message: "该采样码已送检！",
                type: "warning"
              });
            }
          } else {
            // this.$message({
            //   message: res.msg,
            //   type: "error"
            // });
            this.$notify({
              message: res.msg,
              type: "error"
            });
          }
          this.sampleCode = "";
          loading.close();
          this.$refs.sampleCode.focus();
          this.getInspectionList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    goStatic() {
      this.$router.push({
        path: "/inspectionStatic"
      });
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
    }
  },

  mounted() {
    this.getInspectionList();
    this.$nextTick(() => {
      this.$refs.sampleCode.focus();
    });
  }
};
</script>
