<template>
  <div class="app-container">
    <el-button
      type="primary"
      v-if="customersList.length==0"
      @click="initData()"
      style="margin-bottom:10px;"
    >{{$t('menu.xinzeng')}}</el-button>
    <el-col :span="24" class="custom-card">
      <el-tree
        :props="props"
        :data="customersList"
        node-key="customsCode"
        default-expand-all
        :expand-on-click-node="true"
      >
        <span
          class="custom-tree-node"
          :class="'custom-tree-node'+node.level"
          slot-scope="{ node, data }"
        >
          <!-- <span class="firstNode" v-if="node.level==1"></span> -->
          <span>{{ node.label }}</span>
          <span class="btn">
            <el-button
              type="text"
              size="mini"
              class="el-icon-plus"
              @click.stop="() => append(node,data)"
              :title="$t('menu.xinzeng')"
            ></el-button>
            <el-button
              type="text"
              size="mini"
              class="el-icon-edit"
              @click.stop="() => edit(node,data)"
              :title="$t('menu.bianji')"
            ></el-button>
            <el-button
              type="text"
              size="mini"
              class="el-icon-delete"
              @click="() => remove(node, data)"
              :title="$t('menu.shanchu')"
            ></el-button>
          </span>
        </span>
      </el-tree>
    </el-col>

    <el-dialog
      :title="addOrEdit==1?'新增关区':'编辑关区'"
      :visible.sync="dialogFormVisible"
      :before-close="closeDialog"
    >
      <el-form :model="customForm" :rules="rules" ref="customForm">
        <el-form-item label="关区编码" :label-width="formLabelWidth" required prop="code">
          <el-input v-model="customForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="关区名称" :label-width="formLabelWidth" required prop="name">
          <el-input v-model="customForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrEditCustom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCustomsList,
  getCustomsList_all,
  customs_add,
  customs_eidt,
  customs_delete
} from "../../api/api";

export default {
  data() {
    return {
      props: {
        label: "customsName",
        children: "child"
      },
      customersList: [],
      dialogFormVisible: false,
      customForm: {
        code: "",
        name: "",
        fatherCode: ""
      },
      formLabelWidth: "80px",
      addOrEdit: "",
      rules: {
        name: [{ required: true, message: "请输入关区名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入关区编码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getCustomsList_all();
  },
  methods: {
    getCustomsList_all() {
      getCustomsList_all({}).then(res => {
        console.warn(res);
        if (res.result) {
          this.customersList = res.data.list;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    append(node, data) {
      this.addOrEdit = 1;
      this.dialogFormVisible = true;
      this.customForm.fatherCode = data.customsCode;
      // this.$prompt("请输入关区名称", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消"
      // })
      //   .then(({ value }) => {
      //     if (value == "" || (value == null) | (value == "undefined")) {
      //       return;
      //     }
      //     let para = {
      //       customsCode: String(new Date().getTime()),
      //       customsName: value,
      //       customsFatherCode: data.customsCode
      //     };
      //     customs_add(para).then(res => {
      //       console.warn(res);
      //       if (res.result) {
      //         this.$message({
      //           message: "新添加关区: " + value,
      //           type: "success"
      //         });
      //         this.getCustomsList_all();
      //       } else {
      //         this.$message({
      //           message: res.msg,
      //           type: "error"
      //         });
      //       }
      //     });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "取消输入"
      //     });
      //   });
    },
    edit(node, data) {
      this.addOrEdit = 2;
      this.dialogFormVisible = true;
      this.customForm.fatherCode = node.parent.data.customsCode;
      this.customForm.code = data.customsCode;
      this.customForm.name = data.customsName;
    },
    addOrEditCustom() {
      let _this = this;
      _this.$refs.customForm.validate(valid => {
        if (valid) {
          let para = {
            customsCode: _this.customForm.code,
            customsName: _this.customForm.name,
            customsFatherCode: _this.customForm.fatherCode
          };
          if (_this.addOrEdit == 1) {
            customs_add(para).then(res => {
              if (res.result) {
                this.$message({
                  message: "新添加关区成功！",
                  type: "success"
                });
                //清空
                _this.closeDialog();
                _this.getCustomsList_all();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          } else {
            customs_eidt(para).then(res => {
              if (res.result) {
                this.$message({
                  message: "编辑关区成功！",
                  type: "success"
                });
                //清空
                _this.closeDialog();
                _this.getCustomsList_all();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    closeDialog() {
      let _this = this;
      _this.dialogFormVisible = false;
      _this.customForm.code = "";
      _this.customForm.name = "";
      _this.customForm.fatherCode = "";
      _this.$refs.customForm.resetFields();
    },
    initData() {
      let _this = this;
      this.$prompt("请输入功能名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "新添加功能: " + value
          });
          _this.data.push({
            id: 0,
            label: value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    remove(node, data) {
      this.$confirm("确认删除该关区吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          let para = {
            customsCodes: [data.customsCode]
          };
          customs_delete(para).then(res => {
            console.warn(res);
            if (res.result) {
              this.$message({
                message: "删除关区: " + data.customsName,
                type: "success"
              });
              this.getCustomsList_all();
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
  }
};
</script>
