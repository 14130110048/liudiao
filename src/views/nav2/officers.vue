<template>
  <section
    style="width: calc(100% - 40px);
    height: calc(100% - 40px);
    overflow:hidden;
    padding: 20px;
    background-color: #fff;"
  >
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>-->
        <el-form-item v-if="OrganizeListByCode">
          <el-cascader
            v-model="customsCode_active"
            :props="optionProps"
            :options="OrganizeListByCode"
            @change="handleChangeChoose"
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input v-model="nickName" :placeholder="$t('menu.mingcheng')"></el-input>
        </el-form-item>
        <el-form-item class="btn" style="text-align:left">
          <el-button type="success" v-on:click="getListBy">{{$t('menu.chaxun')}}</el-button>
        </el-form-item>
        <el-form-item style="float: right;" class="btn">
          <el-button type="primary" @click="handleAdd">{{$t('menu.xinzeng')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      stripe
      border
      style="width: 100%;"
      height="calc(100% - 75px)"
    >
      <el-table-column prop="userID" :label="$t('menu.zhanghao')" width sortable></el-table-column>
      <el-table-column prop="nickName" :label="$t('menu.mingcheng')" width sortable></el-table-column>
      <el-table-column prop="customsName" :label="$t('menu.guanqumingcheng')" width sortable></el-table-column>
      <el-table-column :label="$t('menu.caozuo')" width="150">
        <template scope="scope">
          <el-button
            type="warning"
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
          >{{$t('menu.bianji')}}</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDel(scope.$index, scope.row)"
          >{{$t('menu.shanchu')}}</el-button>
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
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('menu.shenfen')" prop="formType">
          <el-radio
            v-for="item in roles"
            :key="item.roleCode"
            v-model="editForm.formType"
            :label="item.roleCode"
          >{{item.roleName}}</el-radio>
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
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('menu.shenfen')" prop="formType">
          <el-radio
            v-for="item in roles"
            v-model="addForm.formType"
            :key="item.roleCode"
            :label="item.roleCode"
          >{{item.roleName}}</el-radio>
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
  getOfficerList,
  officer_add,
  officer_edit,
  officer_delete,
  getCustomsList,
  getCustomsList_all,
  GetRoleList
} from "../../api/api";

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新登录密码"));
      } else {
        if (!value.match(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/)) {
          callback(
            new Error(
              "密码由字母、数字组成,必须包含至少一位大写字母和数字，长度为8-18位"
            )
          );
        } else {
          callback();
        }
      }
    };
    return {
      roles: [],
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
        ],
        resetPassword: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      // 编辑界面数据
      editForm: {
        userID: "",
        nickName: "",
        resetPassword: "",
        customsCode: "",
        currentUserID: "",
        formType: ""
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
          },
          { validator: validatePass, trigger: "blur" }
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
        ],
        formType: [
          {
            required: true,
            message: "请选择身份",
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
        currentUserID: "",
        formType: ""
      },
      OrganizeListByCode: null,
      optionProps: {
        value: "customsCode",
        label: "customsName",
        children: "child",
        checkStrictly: true
      },
      //新的
      currentUserID: "",
      customsName_active: "",
      customsCode_active: "",
      nickName: "",
      pageSize: 20,
      pageNum: 1
    };
  },
  methods: {
    getListBy() {
      this.pageNum = 1;
      this.pageSize = 20;
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
      getOfficerList(para).then(res => {
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
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm.userID = row.userID;
      this.editForm.nickName = row.nickName;
      this.editForm.resetPassword = row.resetPassword;
      this.editForm.customsCode = [row.customsCode];
      this.editForm.currentUserID = this.currentUserID;
      this.editForm.formType = row.formType;
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
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
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
    },
    getRoleList() {
      //获取表格列表
      GetRoleList()
        .then(res => {
          if (res.result) {
            this.roles = res.data;
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
    // this.getUsers(JSON.parse(sessionStorage.getItem('user')).organizeCode)
    // if(!JSON.parse(sessionStorage.getItem('user')).isSuper){
    // 	this.getOrganizeListByCode()
    // }else{
    // 	this.getOrganizeListByCode_super();
    // }
    this.currentUserID =
      JSON.parse(sessionStorage.getItem("user")).userID || "";
    // this.nickName=JSON.parse(sessionStorage.getItem("user")).nickName || "";
    this.getCustomsList_all();
    this.getOfficerList();
    this.getRoleList();
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  .el-form-item {
    width: 25%;
  }
  .btn {
    width: 19%;
    text-align: right;
  }
}
</style>
