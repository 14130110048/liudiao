<template>
  <div id="formRecord">
    <!--工具条-->
    <el-row class="serachBox">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item label="操作人员">
            <el-select v-model="searchParam.userId" placeholder="请选择操作人员" collapse-tags>
              <el-option
                v-for="item in officerList"
                :key="item.code"
                :label="item.nickname"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchParam.date"
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

    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="formList"
      tooltip-effect="dark"
      border
      stripe
      style="width: 100%;margin-top:20px;"
      height="calc(100% - 145px)"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="userName" label="操作人" sortable show-overflow-tooltip></el-table-column>
      <el-table-column prop="optName" width label="操作类型" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="操作结果" sortable show-overflow-tooltip>
        <template slot-scope="scope">
            {{scope.row.optResult==-1?"未知":(scope.row.optResult==0?"成功":"失败")}}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" sortable show-overflow-tooltip></el-table-column>
      <el-table-column label="操作时间" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.optTimeStr }}</template>
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
import { GetQueryOfficerList, QueryOperationLog } from "../../api/api";
export default {
  data() {
    return {
      formList: [],
      officerList: [],
      total: 0,
      searchParam: {
        userId: "",
        date: "",
        pageSize: 20,
        pageNum: 1
      }
    };
  },
  methods: {
    getListByFormCode() {
      this.searchParam.pageNum = 1;
      this.searchParam.pageSize = 20;
      this.getFormList();
    },
    handleChange(value) {
      //   console.log(value);
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
    getFormList() {
      // 获取表格列表
      let para = this.searchParam;
      this.searchParam.date = this.searchParam.date
        ? this.searchParam.date
        : null;
      QueryOperationLog(para)
        .then(res => {
          console.log(res);
          if (res.result) {
            this.formList = res.data.list;
            this.total = res.data.total;
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
      this.searchParam.userId = "";
      this.searchParam.date = "";
    },
    // 获取关员列表
    getQueryOfficerList() {
      let _this = this;
      let param = {
        userCode: JSON.parse(sessionStorage.getItem("user")).userID
      };
      GetQueryOfficerList(param)
        .then(res => {
          if (res.result) {
            _this.officerList = res.data.list;
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

  mounted() {
    this.getQueryOfficerList();
    this.getFormList();
  }
};
</script>
