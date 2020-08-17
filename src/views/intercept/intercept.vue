<template>
  <div id="formRecord">
    <el-row class="actionBox">
      <el-button type="success" size="mini">刷新</el-button>
    </el-row>

    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="formList"
      tooltip-effect="dark"
      border
      stripe
      style="width: 100%;"
      height="calc(100% - 65px)"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column
        prop="formCode"
        :label="$t('menu.jiankangma')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="submitter"
        width
        :label="$t('menu.huzhao')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="flightNo" :label="$t('menu.xingming')" sortable show-overflow-tooltip></el-table-column>
      <el-table-column :label="$t('menu.caozuo')" width="300">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="release(scope)">放行</el-button>
          <el-button type="warning" size="mini">录入体温</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="total,prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="pageNum"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { GetList, BatchDelete } from "../../api/api";
export default {
  data() {
    return {
      formList: [],
      pageSize: 20,
      pageNum: 1,
      total: 0,
      selectData: []
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
      this.langValue = value;
      this.getFormList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
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
      let para = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      GetList(para)
        .then(res => {
          if (res.result) {
            this.formList = res.data.list;
            this.total = res.data.totalcount;
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
    release(scope) {
      this.$confirm("确定要对该旅客进行放行操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         
        })
        .catch(() => {

        });
    }
  },
  mounted() {
    this.getFormList();
  }
};
</script>