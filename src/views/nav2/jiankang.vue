<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item v-if="OrganizeListByCode">
					<el-cascader v-model="customsCode_active" :props="optionProps" :options="OrganizeListByCode" @change="handleChangeChoose"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-input v-model="nickName" :placeholder="$t('menu.mingcheng')"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="success" v-on:click="getListBy">{{$t('menu.chaxun')}}</el-button>
        </el-form-item>-->
        <el-form-item>
          <el-button type="success" v-on:click="refrsh">刷新</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="taskCode" label="采样单编号" width sortable></el-table-column>
      <el-table-column prop="passengerName" label="被采样人姓名" width sortable></el-table-column>
      <el-table-column prop="passengerCode" label="被采样人护照号" width sortable></el-table-column>
      <el-table-column prop="taskItemList" label="采样项目" width sortable>
        <template scope="scope">
          <el-tag type="danger">{{scope.row.taskItemDetail}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeStr" label="创建时间" width sortable></el-table-column>

      <el-table-column :label="$t('menu.caozuo')" width="150">
        <template scope="scope">
          <el-button type="warning" size="small" @click="handleEdit(scope.row)">处理</el-button>
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
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      :title="$t('menu.bianji')"
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item :label="$t('menu.zhanghao')" prop="userID">
          <el-input v-model="editForm.userID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.mingcheng')" prop="nickName">
          <el-input v-model="editForm.nickName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.mima')" prop="resetPassword">
          <el-input v-model="editForm.resetPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.guanqumingcheng')" prop="customsCode">
          <el-cascader
            v-model="editForm.customsCode"
            :props="optionProps"
            :options="OrganizeListByCode"
            @change
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">{{$t('menu.quxiao')}}</el-button>
        <el-button
          type="primary"
          @click.native="editSubmit"
          :loading="editLoading"
        >{{$t('menu.tijiao')}}</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      :title="$t('menu.xinzeng')"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item :label="$t('menu.zhanghao')" prop="userID">
          <el-input v-model="addForm.userID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.mima')" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.mingcheng')" prop="nickName">
          <el-input v-model="addForm.nickName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.guanqumingcheng')" prop="customsCode">
          <el-cascader
            v-model="addForm.customsCode"
            :props="optionProps"
            :options="OrganizeListByCode"
            @change
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">{{$t('menu.quxiao')}}</el-button>
        <el-button
          type="primary"
          @click.native="addSubmit"
          :loading="addLoading"
        >{{$t('menu.tijiao')}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getTaskList,
  gettaskDetail,
  submitTask,
  getCustomsList,
  getCustomsList_all
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], // 列表选中列

      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        userID: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ]
      },
      // 编辑界面数据
      editForm: {
        userID: "",
        nickName: "",
        resetPassword: "",
        customsCode: "",
        currentUserID: ""
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        userID: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        customsCode: [
          {
            required: true,
            type: "array",
            message: "请选择关区",
            trigger: "change"
          }
        ]
      },
      // 新增界面数据
      addForm: {
        userID: "",
        password: "",
        nickName: "",
        customsCode: "",
        currentUserID: ""
      },
      OrganizeListByCode: null,
      optionProps: {
        value: "customsCode",
        label: "customsName",
        children: "child",
        checkStrictly: true
      },
      //新的
      currentUserID: "admin",
      customsName_active: "",
      customsCode_active: "",
      nickName: "",
      pageSize: 50,
      pageNum: 1
    };
  },
  methods: {
    refrsh() {
      this.pageNum = 1;
      this.getOfficerList();
    },
    getListBy() {
      this.getOfficerList();
    },
    handleChangeChoose() {
      this.getOfficerList();
    },
    // 获取用户列表
    getOfficerList() {
      let para = {
        currentUserID: this.currentUserID,
        nickName: this.nickName,
        customsCode: this.customsCode_active
          ? this.customsCode_active[this.customsCode_active.length - 1]
          : "",
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.listLoading = true;
      getTaskList(para).then(res => {
        if (res.result) {
          this.total = res.data.totalCount;
          this.users = res.data.list;
          this.listLoading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        console.log(res);
      });
    },
    // 性别显示转换
    formatSex: function(row, column) {
      return row.sex === 1 ? "男" : row.sex === 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getOfficerList();
    },
    handleChange(value) {
      console.log(value);
      this.addForm.organizeCode = value[value.length - 1];
    },
    getCustomsList() {
      let para = {};
      this.listLoading = true;
      getCustomsList(para).then(res => {
        if (res.data.result) {
          this.OrganizeListByCode = res.data.data;
          this.listLoading = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        console.log(this.OrganizeListByCode);
      });
    },
    getCustomsList_all() {
      let para = {};
      this.listLoading = true;
      getCustomsList_all(para).then(res => {
        if (res.result) {
          this.OrganizeListByCode = res.data.list;
          this.listLoading = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        console.log(this.OrganizeListByCode);
      });
    },

    // 删除
    handleDel: function(index, row) {
      console.log(row);
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = {
            userIDs: [row.userID],
            currentUserID: this.currentUserID
          };
          officer_delete(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getOfficerList()();
          });
        })
        .catch(() => {});
    },
    // 显示编辑界面
    handleEdit: function(row) {
      this.$router.push({
        path: "./taskDetail",
        query: {
          formParams: row
        }
      });
    },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
    },
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            this.editForm.customsCode = this.editForm.customsCode[
              this.editForm.customsCode.length - 1
            ];
            console.warn(this.editForm);
            officer_edit(this.editForm).then(res => {
              if (res.result) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getOfficerList();
              }
              this.addLoading = false;
            });
          });
        }
      });
    },
    // 新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            console.warn(this.addForm);
            this.addForm.customsCode = this.addForm.customsCode[
              this.addForm.customsCode.length - 1
            ];
            this.addForm.currentUserID = this.currentUserID;
            officer_add(this.addForm).then(res => {
              if (res.result) {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getOfficerList();
              }
              this.addLoading = false;
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    // 批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = {
            ids: ids
          };
          batchRemoveUser(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    }
  },
  mounted() {
    // this.getUsers(JSON.parse(sessionStorage.getItem('user')).organizeCode)
    // if(!JSON.parse(sessionStorage.getItem('user')).isSuper){
    // 	this.getOrganizeListByCode()
    // }else{
    // 	this.getOrganizeListByCode_super();
    // }
    this.getCustomsList_all();
    this.getOfficerList();
    setInterval(() => {
      this.getOfficerList();
    }, 5000);
  }
};
</script>

<style scoped>
</style>
