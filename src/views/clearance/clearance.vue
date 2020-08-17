<template>
  <div id="formRecord">
    <!--工具条-->
    <el-row class="serachBox">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item :label="$t('menu.lvkexingming')">
            <el-input
              v-model="searchParam.PassengerName"
              :placeholder="$t('menu.inputlvkexingming')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.huzhao')">
            <el-input v-model="searchParam.PassportCode" :placeholder="$t('menu.inputhuzhao')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.hangbanhao')">
            <el-input v-model="searchParam.FlightNo" :placeholder="$t('menu.inputhangbanhao')"></el-input>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchParam.EntryDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="getListByFormCode">{{$t('menu.chaxun')}}</el-button>
            <el-button type="primary" @click="reset">{{$t('menu.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row class="actionBox">
      <el-button
        type="success"
        size="mini"
        @click="goDetail"
        :disabled="selectData.length!=1"
      >{{$t('menu.chakan')}}</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="deleteEntry"
        :disabled="selectData.length<1"
      >{{$t('menu.shanchu')}}</el-button>
    </el-row>

    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="formList"
      tooltip-effect="dark"
      border
      stripe
      style="width: 100%;"
      height="calc(100% - 215px)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="passportCode"
        :label="$t('menu.huzhao')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="passengerName"
        width
        :label="$t('menu.xingming')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="flightNo"
        :label="$t('menu.hangbanhao')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="通关日期" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.entryDateStr }}</template>
      </el-table-column>
      <!-- <el-table-column :label="$t('menu.caozuo')" width="150">
        <template scope="scope">
          <el-button type="success" size="small" @click="goDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="total,prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="searchParam.pageSize"
        :current-page="searchParam.pageNum"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  QueryPassengerEntryList,
  QueryPassengerEntryDetail,
  DeleteEntry
} from "../../api/api";
export default {
  data() {
    return {
      formList: [],
      total: 0,
      selectData: [],
      searchParam: {
        PassengerName: "",
        FlightNo: "",
        PassportCode: "",
        EntryDate: "",
        pageSize: 20,
        pageNum: 1
      }
    };
  },
  watch: {
    $route(to, from) {
      this.getFormList();
    }
  },
  methods: {
    getListByFormCode() {
      this.searchParam.pageNum = 1;
      this.searchParam.pageSize = 20;
      this.getFormList();
    },
    handleChange(value) {
      console.log(value);
      this.langValue = value;
      this.getFormList();
    },
    handleCurrentChange(val) {
      this.searchParam.pageNum = val;
      this.getFormList();
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.selectData = val;
    },
    goDetail() {
      this.$router.push({
        path: "/clearance/clearanceDetail",
        query: {
          passportCode: this.selectData[0].passportCode,
          entryDate: this.selectData[0].entryDate
        }
      });
    },
    getFormList() {
      // 获取表格列表
      let para = this.searchParam;
      para.EntryDate = this.searchParam.EntryDate
        ? this.searchParam.EntryDate
        : null;
      QueryPassengerEntryList(para)
        .then(res => {
          console.log(res);
          if (res.result) {
            this.formList = res.data.list;
            this.total = res.data.totalCount;
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
    // 重置查询条件
    reset() {
      this.searchParam.PassportCode = "";
      this.searchParam.PassengerName = "";
      this.searchParam.FlightNo = "";
      this.searchParam.EntryDate = "";
    },
    deleteEntry() {
      // 删除记录
      this.$confirm(this.$t("menu.deleteFormTip"), this.$t("menu.tip"), {
        type: "warning"
      })
        .then(() => {
          let codeList = [];
          this.selectData.forEach(item => {
            let data = {
              passportCode: item.passportCode,
              entryDate: item.entryDate
            };
            codeList.push(data);
          });
          let para = {
            list: codeList
          };
          DeleteEntry(para).then(res => {
            if (res.result) {
              this.$message({
                message: this.$t("menu.deleteSuccess"),
                type: "success"
              });
              this.getFormList();
            } else {
              this.$message({
                message: res.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    }
  },

  mounted() {
    this.getFormList();
  }
};
</script>
