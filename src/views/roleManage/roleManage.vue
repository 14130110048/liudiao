<template>
  <div id="roleManage">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item style="float: right;">
          <el-button type="primary" @click="addRole">{{$t('menu.xinzeng')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      highlight-current-row
      ref="multipleTable"
      :data="formList"
      tooltip-effect="dark"
      border
      stripe
      style="width: 100%"
      height="calc(100% - 50px)"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column
        prop="roleCode"
        :key="Math.random()"
        :label="$t('menu.roleID')"
        width="100"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="roleName" :label="$t('menu.roleName')" sortable show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="roleLevel"
        :label="$t('menu.roleLevel')"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="isBuildIn"
        :label="$t('menu.roleBuildIn')"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.isBuildIn==1?$t('menu.yes'):$t('menu.no')}}</template>
      </el-table-column>
      <el-table-column :label="$t('menu.caozuo')" width="250" align="left">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="goDetail(scope.row.roleCode)"
          >{{$t('menu.chakan')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="currentRoleLevel==-1||currentRoleLevel<scope.row.roleLevel"
            @click="editFormData(scope.row.roleCode)"
          >{{$t('menu.bianji')}}</el-button>
          <el-button
            type="danger"
            size="mini"
            v-if="scope.row.isBuildIn!=1"
            @click="deleteFormData(scope.row.roleCode)"
          >{{$t('menu.shanchu')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增界面-->
    <el-dialog
      :title="action==0?$t('menu.chakan'):(action==1?$t('menu.xinzeng'):$t('menu.bianji'))"
      :visible.sync="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item :label="$t('menu.roleID')" prop="roleCode">
          <el-input v-model="addForm.roleCode" auto-complete="off" :disabled="action==0||action==2"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.roleName')" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off" :disabled="action==0"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.roleLevel')" prop="roleLevel">
          <el-input
            v-model="addForm.roleLevel"
            auto-complete="off"
            type="number"
            min="1"
            :disabled="action==0"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.menuRole')">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            :disabled="action==0"
          >{{$t('menu.checkAll')}}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="addForm.menuCode" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="item in menuList"
              :label="item.menuCode"
              :key="item.menuCode"
              :disabled="action==0"
            >{{item.menuName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">{{$t('menu.quxiao')}}</el-button>
        <el-button type="primary" @click="updateForm" v-if="action!=0">{{$t('menu.tijiao')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GetRoleList,
  GetRoleDetail,
  UpdateRoleInfo,
  DeleteRole,
  GetMenuList,
  InsertRoleInfo
} from '../../api/api'

export default {
  data () {
    return {
      formList: [],
      menuList: [],
      addFormVisible: false,
      addFormRules: {
        roleCode: [
          {
            required: true,
            message: '请输入角色编号',
            trigger: 'blur'
          }
        ],
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleLevel: [
          {
            required: true,
            message: '请输入角色级别,为正整数',
            trigger: 'blur'
          }
        ]
      },
      // 新增界面数据
      addForm: {
        roleCode: '',
        roleName: '',
        roleLevel: '',
        menuCode: []
      },
      checkAll: false,
      isIndeterminate: false,
      action: 0,
      allMenuCode: [],
      currentRoleLevel: ''
    }
  },
  methods: {
    handleCheckAllChange (val) {
      this.addForm.menuCode = val ? this.allMenuCode : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (val) {
      this.$forceUpdate()
      let checkedCount = val.length
      this.checkAll = checkedCount === this.menuList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.menuList.length
    },
    goDetail (code) {
      // 查看-0，新增-1，编辑-2
      this.action = 0
      this.addFormVisible = true
      this.getRoleDetail(code)
    },
    getRoleDetail (code) {
      let para = {
        RoleCode: code
      }
      GetRoleDetail(para)
        .then(res => {
          if (res.result) {
            this.addForm = res.data
            this.addForm.menuCode = []
            res.data.menuList.forEach(item => {
              this.addForm.menuCode.push(item.menuCode)
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    addRole () {
      this.action = 1
      this.reset()
    },
    reset () {
      this.isIndeterminate = false
      this.addForm.roleCode = ''
      this.addForm.roleName = ''
      this.addForm.roleLevel = ''
      this.addForm.menuCode = []
      this.addFormVisible = true
    },
    getFormList () {
      // 获取表格列表
      GetRoleList()
        .then(res => {
          if (res.result) {
            this.formList = res.data
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMenuList () {
      GetMenuList()
        .then(res => {
          if (res.result) {
            this.menuList = res.data
            this.menuList.forEach(item => {
              this.allMenuCode.push(item.menuCode)
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    openDialog () {
      // 查看-0，新增-1，编辑-2
      this.addFormVisible = true
    },
    updateForm () {
      let _this = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let menuListPara = []
          _this.menuList.forEach(item => {
            if (_this.addForm.menuCode.indexOf(item.menuCode) > -1) {
              menuListPara.push(item)
            }
          })
          let para = {
            RoleCode: _this.addForm.roleCode,
            RoleName: _this.addForm.roleName,
            RoleLevel: parseInt(_this.addForm.roleLevel),
            MenuList: menuListPara
          }
          if (_this.action == 1) {
            InsertRoleInfo(para)
              .then(res => {
                if (res.result) {
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  _this.reset()
                  _this.getFormList()
                  _this.addFormVisible = false
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else if (_this.action == 2) {
            UpdateRoleInfo(para)
              .then(res => {
                if (res.result) {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  _this.reset()
                  _this.getFormList()
                  _this.addFormVisible = false
                } else {
                  this.$message({
                    message: res.msg,
                    type: 'error'
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      })
    },
    editFormData (code) {
      // 编辑
      // 查看-0，新增-1，编辑-2
      this.action = 2
      this.addFormVisible = true
      this.getRoleDetail(code)
    },
    deleteFormData (code) {
      // 删除记录
      this.$confirm('确认删除该角色吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          let para = {
            RoleCode: code
          }
          DeleteRole(para).then(res => {
            if (res.result) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getFormList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {})
    }
  },
  mounted () {
    this.currentRoleLevel =
      JSON.parse(sessionStorage.getItem('user')).roleLevel || ''
    this.getFormList()
    this.getMenuList()
  }
}
</script>
