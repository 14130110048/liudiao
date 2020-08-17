<template>
  <div id="formRecord">
    <el-row class="actionBox">
      <!-- <el-button
        type="success"
        size="mini"
        @click="goDetail"
        :disabled="selectData.length!=1"
      >{{$t('menu.tijiao')}}</el-button>-->
      <el-button
        type="primary"
        size="mini"
        @click="editFormData"
        :disabled="selectData.length!=1"
      >{{$t('menu.bianji')}}</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="deleteFormData"
        :disabled="selectData.length<=0"
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
      height="calc(100% - 65px)"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="formCode"
        :label="$t('menu.biaodanbianhao')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="submitter"
        width
        :label="$t('menu.tijiaoren')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="flightNo" :label="$t('menu.biaodanleixing')" sortable show-overflow-tooltip></el-table-column> -->
      <el-table-column :label="$t('menu.tijiaoshijian')" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.submitTimeStr }}</template>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="$t('menu.yichangyuanyin')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
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
    editFormData() {
      //编辑记录
      let para = JSON.parse(JSON.stringify(this.selectData[0]));
      para.formCode = this.selectData[0].formType.split("-")[0];
      para.formRecordCode = this.selectData[0].formCode;
      //   console.log(para);
      this.$router.push({
        path: "/formRecord/tableRecord_edit",
        query: {
          formParams: para
        }
      });
    },
    deleteFormData() {
      //删除记录
      this.$confirm(this.$t("menu.deleteFormTip"), this.$t("menu.tip"), {
        type: "warning"
      })
        .then(() => {
          let codeList = [];
          this.selectData.forEach(item => {
            codeList.push(item.formCode);
          });
          BatchDelete(codeList).then(res => {
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
            //   console.log(res);
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