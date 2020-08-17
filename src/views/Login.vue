<template>
  <div id="login">
    <el-row class="logo"></el-row>
    <el-row class="title">海关检疫E码通</el-row>
    <el-form
      :model="ruleForm2"
      :rules="rules2"
      ref="ruleForm2"
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-container"
    >
      <!-- <h3 class="title">系统登录</h3> -->
      <el-form-item prop="account" class="input">
        <div class="user-icon"></div>
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" class="input">
        <div class="password-icon"></div>
        <el-input
          type="password"
          v-model="ruleForm2.checkPass"
          @keyup.enter.native="handleSubmit2"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleSubmit2"
          :loading="logining"
        >登录</el-button>
      </el-form-item>
    </el-form>
    <el-row class="footer">
      <span class="logo1"></span>
      同方威视WeSpace(卫室)系列产品
    </el-row>

    <!-- 个人信息编辑-->
    <!-- 个人信息编辑-->
    <el-dialog title="修改密码" :visible.sync="editPasswordVisible" :close-on-click-modal="false">
      <el-row class="editTip">经检测您是首次登陆系统，请修改您的密码！</el-row>
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
        <el-button type="primary" @click.native="editPasswordSubmit">提交</el-button>
        <el-button @click.native="closeDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestLogin, ChangePwd } from "../api/api";
export default {
  data() {
    var validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        if (value != this.ruleForm2.checkPass) {
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
      logining: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true,
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
        confirmNewPwd: ""
      }
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    handleSubmit2(ev) {
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true;
          var loginParams = {
            userID: this.ruleForm2.account,
            password: this.ruleForm2.checkPass
          };
          requestLogin(loginParams).then(data => {
            this.logining = false;
            if (!data.result) {
              this.$message({
                message: data.msg,
                type: "error"
              });
            } else {
              sessionStorage.setItem("user", JSON.stringify(data.data));
              sessionStorage.setItem("pwd", JSON.stringify(this.ruleForm2.checkPass));
              localStorage.setItem(
                "MenuList",
                JSON.stringify(data.data.menuList)
              );
              let roleList = [];
              data.data.menuList.forEach(item => {
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
              if (data.data.updatePwd) {
                this.editPasswordVisible = true;
              } else {
                this.$router.push({ path: "/home" });
              }
              // if (roleList.length > 0) {
              //   this.$router.push({ path: "/home" });
              // } else {
              //   this.$router.push({ path: "/404" });
              // }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editPasswordSubmit() {
      this.$refs.editPasswordForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            let param = {
              userId: this.ruleForm2.account,
              oldPwd: this.editPasswordForm.oldPwd,
              newPwd: this.editPasswordForm.newPwd
            };
            ChangePwd(param).then(res => {
              if (res.result) {
                this.$message({
                  message: "密码修改成功",
                  type: "success"
                });
                this.editPasswordVisible = false;
                this.$router.push({ path: "/home" });
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
    closeDialog() {
      this.editPasswordVisible = false;
      this.$router.push({ path: "/home" });
    }
  }
};
</script>
