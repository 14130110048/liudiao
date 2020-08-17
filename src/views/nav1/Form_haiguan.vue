<template>
  <div id="formRecord">
    <!--工具条-->
    <el-row class="serachBox">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item :label="$t('menu.biaodanleixing')">
            <el-select
              v-model="formCode"
              :placeholder="$t('menu.selectbiaodanleixing')"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in formTypeList"
                :key="item.formDictCode"
                :label="item.formDictName"
                :value="item.formDictCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="语言">
            <el-select v-model="langValue" placeholder="请选择语言">
              <el-option
                v-for="item in getLangs"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item :label="$t('menu.biaodanbianhao')">
            <el-input v-model="checkRecordCode" :placeholder="$t('menu.biaodanbianhao')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.lvkexingming')">
            <el-input v-model="passengerCode" :placeholder="$t('menu.inputlvkexingming')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.huzhao')">
            <el-input v-model="passportCode" :placeholder="$t('menu.inputhuzhao')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.hangbanhao')">
            <el-input v-model="flightNo" :placeholder="$t('menu.inputhangbanhao')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('menu.tianbiaoren')" v-if="currentRole=='admin'">
            <el-select
              v-model="submitter"
              :placeholder="$t('menu.selecttianbiaoren')"
              multiple
              collapse-tags
            >
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
              v-model="selectDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="采样编码">
            <el-input
              v-model="sampleCode"
              placeholder="请输入采样编码"
              @keyup.enter.native="getListByFormCode"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="currentRole=='admin'"></el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="getListByFormCode">{{$t('menu.chaxun')}}</el-button>
            <el-button type="primary" @click="reset">{{$t('menu.reset')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="formCode" placeholder="表单唯一标识"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="success" v-on:click="getListByFormCode">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>-->
    <el-row class="actionBox">
      <el-button
        type="success"
        size="mini"
        @click="goDetail"
        :disabled="selectData.length!=1"
      >{{$t('menu.chakan')}}</el-button>
      <el-button
        type="warning"
        size="mini"
        @click="exportWord"
        :disabled="selectData.length<=0"
      >{{$t('menu.daochu')}}</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="editFormData"
        :disabled="selectData.length!=1||!editFlag"
      >{{$t('menu.bianji')}}</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="deleteFormData"
        :disabled="selectData.length<=0||!deleteFlag"
      >{{$t('menu.shanchu')}}</el-button>
      <!-- <el-button
        type="info"
        size="mini"
        @click="commitFormData"
        :disabled="selectData.length<=0"
      >{{$t('menu.tijiao')}}</el-button>-->
      <el-button
        size="mini"
        class="zhuanjiao"
        @click="deliverFormData"
        :disabled="selectData.length<=0"
      >{{$t('menu.zhuanjiao')}}</el-button>
    </el-row>
    <!-- <el-row class="actionBox">
      <div class="actionBtn" :title="$t('menu.chakan')">
        <span class="btn_normal" v-if="selectData.length!=1">
          <img src="../../assets/btnImg/chakan_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length==1" @click="goDetail">
          <img src="../../assets/btnImg/chakan_light.png" />
        </span>
      </div>
      <div class="actionBtn" :title="$t('menu.bianji')">
        <span class="btn_normal" v-if="selectData.length!=1">
          <img src="../../assets/btnImg/bianji_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length==1" @click="editFormData">
          <img src="../../assets/btnImg/bianji_light.png" />
        </span>
      </div>
      <div class="actionBtn" :title="$t('menu.daochu')">
        <span class="btn_normal" v-if="selectData.length<=0">
          <img src="../../assets/btnImg/daochu_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length>0" @click="exportWord">
          <img src="../../assets/btnImg/daochu_light.png" />
        </span>
      </div>
      <div class="actionBtn" :title="$t('menu.shanchu')">
        <span class="btn_normal" v-if="selectData.length<=0">
          <img src="../../assets/btnImg/shanchu_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length>0" @click="deleteFormData">
          <img src="../../assets/btnImg/shanchu_light.png" />
        </span>
      </div>
    </el-row>-->
    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="formList"
      tooltip-effect="dark"
      border
      stripe
      style="width: 100%;"
      :height="currentRole=='admin'?'calc(100% - 315px)':'calc(100% - 265px)'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="passengerCode"
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
      <el-table-column prop="formName" :label="$t('menu.mingcheng')" sortable show-overflow-tooltip></el-table-column>
      <!-- <el-table-column
        prop="formRecordCode"
        width
        :label="$t('menu.jilubianhao')"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="languageName" :label="$t('menu.yuyan')" show-overflow-tooltip></el-table-column>-->
      <!-- <el-table-column prop="officerCode" width="" label="问询关员" show-overflow-tooltip>
      </el-table-column>-->
      <el-table-column prop="submitter" label="提交人" v-if="currentRole=='admin'" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :label="$t('menu.tijiaoshijian')" sortable show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.formSubmitTimeStr }}</template>
      </el-table-column>
      <!-- <el-table-column :label="$t('menu.caozuo')" width="300">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="goDetail(scope.row)">{{$t('menu.chakan')}}</el-button>
          <el-button type="warning" size="mini" @click="exportWord(scope.row)">{{$t('menu.daochu')}}</el-button>
          <el-button type="primary" size="mini" @click="editFormData(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteFormData(scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
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
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getFormList,
  exportWord,
  deleteFormData,
  GetQueryFormType,
  GetQueryLanguage,
  GetQueryOfficerList,
  BatchCommit,
  PrintDeliverForm
} from "../../api/api";
import liudiao_topLeft from "../../assets/liudiao_topLeft.png";
import liudiao_topRight from "../../assets/liudiao_topRight.png";
import liudiao_bottomLeft from "../../assets/liudiao_bottomLeft.png";
import liudiao_bottomRight from "../../assets/liudiao_bottomRight.png";
export default {
  data() {
    return {
      liudiao_topLeft: liudiao_topLeft,
      liudiao_topRight: liudiao_topRight,
      liudiao_bottomLeft: liudiao_bottomLeft,
      liudiao_bottomRight: liudiao_bottomRight,
      formData: {},
      formDesc: {},
      formList: [],
      pageSize: 20,
      pageNum: 1,
      total: 0,
      checkRecordCode: "",
      formCode: [],
      passengerCode: "",
      officerCode: "",
      passportCode: "",
      langValue: "",
      flightNo: "",
      sampleCode: "",
      selectDate: null,
      submitter: [],
      formTypeList: [],
      getLangs: [],
      officerList: [],
      selectData: [],
      currentRole: "",
      editFlag: false,
      deleteFlag: false
    };
  },
  watch: {
    // 检测数据结构发生变化
    formData: {
      handler: function(val, oldVal) {
        console.log(val);
      },
      deep: true
    },
    $route(to, from) {
      if (to.path == "/formRecord") {
        this.getFormList();
      }
    }
  },
  methods: {
    getListByFormCode() {
      this.pageNum = 1;
      this.pageSize = 20;
      this.getFormList();
    },
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
      if (this.selectData.length > 0) {
        if (this.currentRole == "admin") {
          this.editFlag = true;
          this.deleteFlag = true;
        } else {
          this.editFlag = this.selectData[0].editFlag;
          this.deleteFlag = true;
          this.selectData.forEach(item => {
            if (!item.deleteFlag) {
              this.deleteFlag = false;
            }
          });
        }
      }
    },
    goDetail() {
      this.$router.push({
        path: "/formRecord/tableRecord",
        query: {
          formParams: this.selectData[0]
        }
      });
    },
    exportWord() {
      let codeList = [];
      this.selectData.forEach(item => {
        codeList.push(item.formRecordCode);
      });
      let para = {
        formRecordCodes: codeList
      };
      exportWord(para).then(data => {
        if (data.result) {
          if (data.data.successFormRecordResults.length == 0) {
            this.$message({
              message: "fail",
              type: "error"
            });
            return;
          } else {
            let files = data.data.successFormRecordResults;
            files.forEach(item => {
              // let a = document.createElement("a");
              // a.href = item.formRecordFilePath;
              // a.click();
              // a.remove();
              const iframe = document.createElement("iframe");
              iframe.style.display = "none"; // 防止影响页面
              iframe.style.height = 0; // 防止影响页面
              iframe.src = item.formRecordFilePath;
              document.body.appendChild(iframe);
              setTimeout(() => {
                iframe.remove();
              }, 2 * 60 * 1000);
            });
          }
          // let a = document.createElement("a");
          // a.href = data.data.successFormRecordResults[0].formRecordFilePath;
          // a.click();
        } else {
          this.$message({
            message: data.data.msg,
            type: "error"
          });
        }
        console.log(data);
      });
    },
    getFormList() {
      // 获取表格列表
      let para = {
        checkRecordCode: this.checkRecordCode,
        formCode: this.formCode,
        languageCode: this.langValue,
        passengerCode: this.passengerCode,
        officerCode: "",
        passportCode: this.passportCode, // 护照编号
        flightNo: this.flightNo,
        submitter: this.submitter,
        sampleCode: this.sampleCode,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        selectDate: this.selectDate ? this.selectDate : null,
        userId: JSON.parse(sessionStorage.getItem("user")).userID
      };
      getFormList(para).then(data => {
        if (data.result) {
          this.formList = data.data.list;
          this.total = data.data.totalCount;
        } else {
          this.$message({
            message: data.msg,
            type: "error"
          });
        }
        console.log(data);
      });
    },
    editFormData() {
      // 编辑记录
      this.$router.push({
        path: "/formRecord/tableRecord_edit",
        query: {
          formParams: this.selectData[0]
        }
      });
    },
    deleteFormData() {
      // 删除记录
      this.$confirm(this.$t("menu.deleteFormTip"), this.$t("menu.tip"), {
        type: "warning"
      })
        .then(() => {
          let codeList = [];
          this.selectData.forEach(item => {
            codeList.push(item.formRecordCode);
          });
          let para = {
            formRecordCodes: codeList,
            UserId: JSON.parse(sessionStorage.getItem("user")).userID
          };
          deleteFormData(para).then(data => {
            if (data.result) {
              if (data.data.successData.length == 0) {
                this.$message({
                  message: "fail",
                  type: "error"
                });
                return;
              }
              this.$message({
                message: this.$t("menu.deleteSuccess"),
                type: "success"
              });
              this.getFormList();
            } else {
              this.$message({
                message: data.msg,
                type: "error"
              });
            }
            console.log(data);
          });
        })
        .catch(() => {});
    },
    commitFormData() {
      // 删除记录
      this.$confirm("确定要提交选中的数据吗？", this.$t("menu.tip"), {
        type: "warning"
      })
        .then(() => {
          let codeList = [];
          this.selectData.forEach(item => {
            let form = {
              formRecordCode: item.formRecordCode,
              formCode: item.formCode
            };
            codeList.push(form);
          });
          BatchCommit(codeList).then(data => {
            if (data.result) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.getFormList();
            } else {
              this.$message({
                message: data.msg,
                type: "error"
              });
            }
            console.log(data);
          });
        })
        .catch(() => {});
    },
    deliverFormData() {
      // 转交记录
      this.$confirm("确定要转交选中的数据吗？", this.$t("menu.tip"), {
        type: "warning"
      })
        .then(() => {
          let codeList = [];
          this.selectData.forEach(item => {
            let form = {
              formRecordCode: item.formRecordCode,
              passengerCode: item.passengerCode,
              passengerName: item.passengerName,
              flightNo: item.flightNo
            };
            codeList.push(form);
          });
          let para = {
            userId: JSON.parse(sessionStorage.getItem("user")).userID,
            formList: codeList
          };
          PrintDeliverForm(para).then(data => {
            if (data.result) {
              this.$message({
                message: "转交成功",
                type: "success"
              });
              this.getFormList();
            } else {
              this.$message({
                message: data.msg,
                type: "error"
              });
            }
            console.log(data);
          });
        })
        .catch(() => {});
    },
    // 重置查询条件
    reset() {
      this.checkRecordCode = "";
      this.formCode = [];
      this.langValue = "";
      this.passengerCode = "";
      this.officerCode = "";
      this.passportCode = "";
      this.submitter = [];
      this.flightNo = "";
      this.sampleCode = "";
      this.selectDate = null;
    },
    // 获取表单类型
    getQueryFormType() {
      let _this = this;
      let param = {
        languageCode: localStorage.lang
      };
      GetQueryFormType(param)
        .then(res => {
          if (res.result) {
            _this.formTypeList = res.data.list;
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
    // 获取语言
    getQueryLanguage() {
      let _this = this;
      let param = {};
      GetQueryLanguage(param)
        .then(res => {
          if (res.result) {
            _this.getLangs = res.data.list;
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
  created() {
    this.currentRole = JSON.parse(sessionStorage.getItem("user")).roleCode;
  },
  mounted() {
    // this.langValue = localStorage.lang;
    this.getQueryFormType();
    this.getQueryLanguage();
    this.getQueryOfficerList();
    this.getFormList();
  }
};
</script>
