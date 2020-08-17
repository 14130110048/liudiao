<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="3" class="logo">
        <img v-if="!collapsed" :src="logoImg" />
        <div>{{collapsed?'':sysName}}</div>
      </el-col>
      <el-col :span="7">
        <div class="logo-title">海关检疫E码通</div>
      </el-col>
      <!-- <el-col v-if="asideShowFlag" :span="2">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>-->
      <el-col :span="12" class="userinfo">
        <div class="homeBtn" @click="goHome">{{$t('menu.home')}}</div>
        <el-dropdown trigger="click" style="margin-right: 20px;">
          <div class="lang">
            <span class="el-dropdown-link userinfo-inner">{{$t('menu.yuyan')}}</span>
            <span class="el-icon-arrow-down"></span>
          </div>
          <el-dropdown-menu style="height: 600px;overflow-y: scroll;" slot="dropdown">
            <el-dropdown-item
              v-for="item in getLangs"
              :key="item.languageCode"
              @click.native="changeLang(item.languageCode)"
            >
              <span>{{item.iconImageURL}}</span>
              {{item.languageName}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner">{{$t('menu.ninhao')}}，{{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item @click.native="editUserInfo">修改昵称</el-dropdown-item>-->
            <el-dropdown-item divided>用户角色：{{roleName}}</el-dropdown-item>
            <el-dropdown-item @click.native="editPassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <header :class="collapsed?'menu-collapsed':'menu-expanded'" v-if="asideShowFlag">
        <!--导航菜单-未折叠-->
        <el-menu
          :default-active="$route.path"
          class="el-menu-demo"
          @open="handleopen"
          @close="handleclose"
          @select="handleselect"
          unique-opened
          router
          v-show="!collapsed"
          model="horizontal"
        >
          <template v-for="(item,index) in routes">
            <el-submenu :index="index+''" :key="index" v-if="!item.leaf">
              <template slot="title">
                <i :class="item.iconCls"></i>
                {{$t(item.name)}}
              </template>
              <el-menu-item
                v-for="child in routeChildren(item)"
                :index="child.path"
                :key="child.path"
              >{{$t(child.name)}}</el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf&&item.children.length>0"
              :key="item.name"
              :index="item.children[0].path"
            >
              <i :class="item.iconCls"></i>
              {{$t(item.children[0].name)}}
            </el-menu-item>
          </template>
        </el-menu>
        <ul class="el-menu el-menu-demo collapsed" v-show="collapsed" ref="menuCollapsed">
          <li v-for="(item,index) in routes" :key="item.name" class="el-submenu item">
            <!--非单节点route渲染-->
            <template v-if="!item.leaf">
              <!--经过菜单显示对应ul的事件-->
              <div
                class="el-submenu__title"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <i :class="item.iconCls"></i>
              </div>
              <ul
                class="el-menu submenu"
                :class="'submenu-hook-'+index"
                @mouseover="showMenu(index,true)"
                @mouseout="showMenu(index,false)"
              >
                <li
                  v-for="child in item.children"
                  :key="child.path"
                  class="el-menu-item"
                  :class="$route.path===child.path?'is-active':''"
                  @click="$router.push(child.path)"
                >{{$t(child.name)}}</li>
              </ul>
            </template>
            <template v-else>
              <li class="el-submenu">
                <div
                  class="el-submenu__title el-menu-item"
                  :class="$route.path===item.children[0].path?'is-active':''"
                  @click="$router.push(item.children[0].path)"
                >
                  <i :class="item.iconCls"></i>
                </div>
              </li>
            </template>
          </li>
        </ul>
      </header>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <!-- <el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$t($route.name)}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ $t(item.name) }}
							</el-breadcrumb-item>
						</el-breadcrumb>
          </el-col>-->
          <el-col :span="24" class="content-wrapper">
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
    <!-- 个人信息编辑-->
    <el-dialog title="修改个人信息" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="addForm.nickName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editUserInfoSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 个人信息编辑-->
    <el-dialog title="修改密码" :visible.sync="editPasswordVisible" :close-on-click-modal="false">
      <el-form
        :model="editPasswordForm"
        label-width="100px"
        :rules="editPasswordRules"
        ref="editPasswordForm"
      >
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="editPasswordForm.oldPwd" show-password auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="editPasswordForm.newPwd" show-password auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPwd">
          <el-input v-model="editPasswordForm.confirmNewPwd" show-password auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editPasswordSubmit" :loading="addLoading">提交</el-button>
        <el-button @click.native="editPasswordVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapGetters } from "vuex";
import logoImg from "../assets/logo.png";
import { ChangePwd, editUserInfoSubmit, getLanguageDict } from "../api/api";

export default {
  data() {
     var validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        if (value != this.oldPwd) {
          callback(new Error("旧密码输入不正确"));
        } else {
          callback();
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (value == this.editPasswordForm.oldPwd) {
          callback(new Error("新密码不能和旧密码相同"));
        } else if (!value.match(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/)) {
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
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认新密码"));
      } else {
        if (value != this.editPasswordForm.newPwd) {
          callback(new Error("两次新登陆密码输入不一致"));
        } else {
          callback();
        }
      }
    };
    return {
      asideShowFlag: true,
      logoImg: logoImg,
      sysName: "wespace",
      collapsed: false,
      sysUserName: "",
      roleName: "",
      sysUserAvatar: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      //修改个人信息
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        nickName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        organizeCode: [
          {
            required: true,
            type: "array",
            message: "请选择部门",
            trigger: "change"
          }
        ]
      },
      addForm: {
        userName: "",
        nickName: "",
        organizeCode: ""
      },
      //修改个人密码
      editPasswordVisible: false, // 新增界面是否显示
      editPasswordRules: {
        oldPwd: [
          {
            required: true,
            message: "请输入原登录密码",
            trigger: "blur"
          },
          { validator: validateOldPass, trigger: "blur" }
        ],
        newPwd: [
          {
            required: true,
            message: "请输入新登录密码",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ],
        confirmNewPwd: [
          {
            required: true,
            message: "请输入确认新密码",
            trigger: "blur"
          },
          { validator: validatePass1, trigger: "blur" }
        ]
      },
      editPasswordForm: {
        userId: "",
        oldPwd: "",
        newPwd: "",
        confirmNewPwd:""
      },
      oldPwd:""
    };
  },
  computed: {
    ...mapGetters([
      "getLangs"
      // ...
    ]),
    // 关于v-for v-if，data里未定义的变量遍历使用计算属性。否则使用v-for v-if配合使用
    routes: function() {
      return this.$router.options.routes.filter(function(item) {
        return !item.hidden;
      });
    },
    // 利用闭包实现计算属性传参。
    routeChildren: function(route) {
      return function(route) {
        return route.children.filter(function(child) {
          // child.name = this.$t('menu['+child.name+']')
          return !child.hidden;
        });
      };
    }
  },
  methods: {
    getLanguageDict() {
      let para = {
        pageSize: 100,
        pageNum: 1
      };
      getLanguageDict(para).then(res => {
        if (res.result) {
          console.log(res.data.list);
          this.$store.dispatch("setLangs", res.data.list);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    changeLang(lang_) {
      localStorage.lang = lang_;
      this.$i18n.locale = lang_;
    },
    onSubmit() {
      console.log("submit!");
    },
    handleopen() {
      // console.log('handleopen');
    },
    handleclose() {
      // console.log('handleclose');
    },
    handleselect: function(a, b) {},
    editUserInfo() {
      this.addFormVisible = true;
    },
    editPassword() {
      this.editPasswordVisible = true;
    },
    editPasswordSubmit() {
      this.$refs.editPasswordForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
              let param = {
              userId: JSON.parse(sessionStorage.getItem("user")).userID || "",
              oldPwd: this.editPasswordForm.oldPwd,
              newPwd: this.editPasswordForm.newPwd
            };
              ChangePwd(param).then(res => {
                if (res.result) {
                  this.$message({
                    message: "密码修改成功",
                    type: "success"
                  });
                  this.$refs["editPasswordForm"].resetFields();
                  this.editPasswordVisible = false;
                  sessionStorage.removeItem("user");
                  this.oldPwd=this.editPasswordForm.newPwd;
                  sessionStorage.setItem("pwd", JSON.stringify(this.editPasswordForm.newPwd));
                  this.$router.push("/login");
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
                this.addLoading = false;
              });
          });
        }
      });
    },
    editUserInfoSubmit() {
      this.$refs.addForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            this.addForm.userName = JSON.parse(
              sessionStorage.getItem("user")
            ).userName;
            editUserInfoSubmit(this.addForm).then(res => {
              if (res.data.result) {
                this.sysUserName = this.addForm.nickName;
                this.$message({
                  message: "个人信息修改成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
              this.addLoading = false;
            });
          });
        }
      });
    },
    // 退出登录
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        // type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          localStorage.removeItem("MenuList");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    goHome() {
      this.$router.push("/home");
    },
    // 折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(
        "submenu-hook-" + i
      )[0].style.display = status ? "block" : "none";
    },
    //fullScreen()和exitScreen()有多种实现方式，此处只使用了其中一种
    //全屏
    fullScreen() {
      var element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    },

    //退出全屏
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  },
  mounted() {
    this.roleName = JSON.parse(sessionStorage.getItem("user")).roleName;
    // this.asideShowFlag = (type=='jianyanyuan'||type=='pandingyuan'||type=='jiankangyuan')?false:true;
    localStorage.lang = "zh-CN";
    this.sysUserName =
      JSON.parse(sessionStorage.getItem("user")).nickName || "";
      this.oldPwd = JSON.parse(sessionStorage.getItem("pwd"));
    // 获取语言
    // this.getLanguageDict()
  },
  created() {
    let menuList = JSON.parse(localStorage.getItem("MenuList"));
    let roleList = [];
    menuList.forEach(item => {
      roleList.push(item.menuCode);
    });
    this.$router.options.routes.forEach(item => {
      if (item.menucode) {
        if (roleList.indexOf(item.menucode) > -1) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
      }
    });
  }
};
</script>
