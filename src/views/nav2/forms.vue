<template>
  <section
    style="width: calc(100% - 40px);
    height: calc(100% - 40px);
    overflow:hidden;
    padding: 20px;
    background-color: #fff;position:relative;"
  >
    <el-col
      :span="24"
      class="toolbar"
      style="padding-bottom: 0px;border-bottom: 1px dotted #d0c5c5;margin-bottom:5px;"
    >
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>-->
        <!-- <el-form-item v-if="">
					<el-select v-model="langValue" @change="handleChange" :placeholder="$t('menu.qingxuanzeyuyan')">
						<el-option v-for="item in langs" :key="item.languageCode" :label="item.languageName" :value="item.languageCode">
						</el-option>
					</el-select>
        </el-form-item>-->
        <el-form-item>
          <el-input v-model="formCode" placeholder></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" v-on:click="getListBy">{{$t('menu.chaxun')}}</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="handleAdd">{{$t('menu.xinzeng')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-row class="actionBox">
      <el-button
        type="success"
        size="mini"
        @click="handleView"
        :disabled="selectData.length!=1"
      >{{$t('menu.yulan')}}</el-button>
      <el-button
        type="warning"
        size="mini"
        @click="handleEdit"
        :disabled="selectData.length!=1"
      >{{$t('menu.bianji')}}</el-button>
      <el-button
        type="danger"
        size="mini"
        @click="handleDel"
        :disabled="selectData.length<=0"
      >{{$t('menu.shanchu')}}</el-button>
    </el-row>
    <!-- <el-row class="actionBox" style="padding-top:5px;">
      <div class="actionBtn" :title="$t('menu.yulan')">
        <span class="btn_normal" v-if="selectData.length!=1">
          <img src="../../assets/btnImg/chakan_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length==1" @click="handleView">
          <img src="../../assets/btnImg/chakan_light.png" />
        </span>
      </div>
      <div class="actionBtn" :title="$t('menu.bianji')">
        <span class="btn_normal" v-if="selectData.length!=1">
          <img src="../../assets/btnImg/bianji_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length==1" @click="handleEdit">
          <img src="../../assets/btnImg/bianji_light.png" />
        </span>
      </div>    
      <div class="actionBtn" :title="$t('menu.shanchu')">
        <span class="btn_normal" v-if="selectData.length<=0">
          <img src="../../assets/btnImg/shanchu_normal.png" />
        </span>
        <span class="btn_light" v-if="selectData.length>0" @click="handleDel">
          <img src="../../assets/btnImg/shanchu_light.png" />
        </span>
      </div>
    </el-row>-->
    <!--列表-->
    <el-table
      :data="users"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
      border
      stripe
      header-row-class-name="headerClass"
      style="width: 100%;margin-top:5px;"
      height="calc(100% - 115px)"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="code"
        :key="Math.random()"
        :label="$t('menu.biaodanweiyibiaoshi')"
        width
        sortable
      ></el-table-column>
      <el-table-column prop="formDictName" :label="$t('menu.mingcheng')" width sortable></el-table-column>
      <el-table-column prop="languageName" :label="$t('menu.yuyan')" width sortable></el-table-column>
      <el-table-column prop="formDictCode" :label="$t('menu.biaodancode')" width sortable></el-table-column>
      <el-table-column prop="createTimeStr" :label="$t('menu.chuangjianshijian')" width sortable></el-table-column>
      <!-- <el-table-column :label="$t('menu.caozuo')" width="250">
				<template scope="scope">
					<el-button type="success" size="small" @click="handleView(scope.$index, scope.row)">{{$t('menu.yulan')}}</el-button>
					<el-button type="warning" size="small" @click="handleEdit(scope.$index, scope.row)">{{$t('menu.bianji')}}</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">{{$t('menu.shanchu')}}</el-button>
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

    <!--编辑界面-->
    <el-dialog
      :title="$t('menu.bianji')"
      :visible.sync="editFormVisible"
      @close="resetForm"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="120px" ref="editForm" v-if="!editLoading">
        <el-form-item :label="$t('menu.biaodanweiyibiaoshi')" prop="code">
          <el-input disabled="true" v-model="editForm.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.shenfen')" prop="formType">
          <el-radio
            v-for="item in roles"
            @input="updateView($event)"
            v-model="editForm.formType"
            :label="item.formTypeCode"
          >{{item.formTypeName}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('menu.yuyan')" prop="lang">
          <el-radio
            v-for="item in langs"
            v-model="editFormChooseLang"
            :label="item.languageCode"
          >{{item.languageName}}</el-radio>
        </el-form-item>
        <div v-for="editItem,indexxx in editForm.languageList" :key="editItem.languageType">
          <template v-if="editItem.languageType == editFormChooseLang">
            <el-form-item :label="$t('menu.mingcheng')" prop="name">
              <el-input v-model="editItem.formData.name" @input="updateView($event)"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu.shujuyuan')" prop="htmlTemplateText">
              <el-input
                type="textarea"
                :rows="10"
                v-model="editItem.formData.htmlTemplateText"
                @input="updateView($event)"
              ></el-input>
              <a style="text-decoration: none;color: white;" target="_blank" :href="editFormWebUrl">
                <el-button type="warning">{{$t('menu.shujuyuan')}}</el-button>
              </a>
              <el-button
                type="primary"
                @click="TranslateHtmlTemplateText_edit(editItem)"
                style="margin: 0 20px;"
              >{{$t('menu.fanyi')}}</el-button>
              <el-button type="infor" @click="parseHTMLtemplate_edit(editItem)">{{$t('menu.jiexi')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('menu.mubanjiexijieguo')" prop="formItemData">
              <el-input
                type="textarea"
                :rows="10"
                v-model="editItem.formItemData"
                @input="updateView($event)"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu.shangchuanwenjianmuban')" prop="exportTemplateFile">
              <el-upload
                class="upload-demo"
                :action="upLoadURL"
                :on-preview="handlePreview"
                :limit="1"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-exceed="handleExceed"
                :on-error="upLoadFileFail"
                :on-success="(response, file, fileList)=>upLoadFileSuccess_edit(response, file, fileList,editItem)"
                :file-list="editItem.formData.exportTemplateFile"
              >
                <el-button size="small" type="primary">{{$t('menu.dianjishangchuan')}}</el-button>
                <div slot="tip" class="el-upload__tip">{{$t('menu.zhinengshangchuanword')}}</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('menu.shangchuanwenjianmuban')" prop="exportTemplateType">
              <el-radio v-model="editItem.formData.exportTemplateType" label="word">word</el-radio>
              <el-radio v-model="editItem.formData.exportTemplateType" label="excel">excel</el-radio>
            </el-form-item>
          </template>
        </div>
      </el-form>
      <div class="loading" v-if="editLoading">
        <div class="loading-icon">
          <p class="loading-text">拼命加载中</p>
        </div>
      </div>
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
      width="60%"
      :title="$t('menu.xinzeng')"
      :visible.sync="addFormVisible"
      @close="resetForm"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="120px" ref="addForm">
        <el-form-item :label="$t('menu.biaodanweiyibiaoshi')" prop="code">
          <el-input v-model="addForm.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('menu.shenfen')" prop="formType">
          <el-radio
            v-for="item in roles"
            v-model="addForm.formType"
            :label="item.formTypeCode"
          >{{item.formTypeName}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('menu.yuyan')" prop="lang">
          <el-radio
            v-for="item in langs"
            v-model="addFormChooseLang"
            :label="item.languageCode"
          >{{item.languageName}}</el-radio>
        </el-form-item>
        <div v-for="itemmm,indexxx in addForm.languageList" :key="itemmm.languageType">
          <template v-if="itemmm.languageType == addFormChooseLang">
            <el-form-item :label="$t('menu.mingcheng')" prop="name">
              <el-input v-model="itemmm.formData.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu.shujuyuan')" prop="htmlTemplateText">
              <el-input
                type="textarea"
                :rows="10"
                v-model="itemmm.formData.htmlTemplateText"
                auto-complete="off"
              ></el-input>
              <a style="text-decoration: none;color: white;" target="_blank" :href="editFormWebUrl">
                <el-button type="warning">{{$t('menu.zhizuoshujuyuan')}}</el-button>
              </a>
              <el-button
                type="primary"
                @click="TranslateHtmlTemplateText(itemmm)"
                style="margin: 0 20px;"
              >{{$t('menu.fanyi')}}</el-button>
              <el-button type="infor" @click="parseHTMLtemplate(itemmm)">{{$t('menu.jiexi')}}</el-button>
            </el-form-item>
            <el-form-item :label="$t('menu.mubanjiexijieguo')" prop="formItemData">
              <el-input
                type="textarea"
                :rows="10"
                v-model="itemmm.formItemData"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('menu.shangchuanwenjianmuban')" prop="exportTemplateFile">
              <el-upload
                class="upload-demo"
                :action="upLoadURL"
                :on-preview="handlePreview"
                :limit="1"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-exceed="handleExceed"
                :on-error="upLoadFileFail"
                :on-success="(response, file, fileList)=>upLoadFileSuccess(response, file, fileList,itemmm)"
                :file-list="itemmm.formData.exportTemplateFile"
              >
                <el-button size="small" type="primary">{{$t('menu.dianjishangchuan')}}</el-button>
                <div slot="tip" class="el-upload__tip">{{$t('menu.zhinengshangchuanword')}}</div>
              </el-upload>
            </el-form-item>
            <el-form-item :label="$t('menu.shangchuanwenjianmuban')" prop="exportTemplateType">
              <el-radio v-model="itemmm.formData.exportTemplateType" label="word">word</el-radio>
              <el-radio v-model="itemmm.formData.exportTemplateType" label="excel">excel</el-radio>
            </el-form-item>
          </template>
        </div>
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
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
const upLoadURL = base + "/api/FileManager/UploadExportTemplateFile";
import util from "../../common/js/util";
import {
  getFormDicList,
  getFormDicDetail,
  formDic_add,
  formDic_edit,
  formDic_delete,
  parseHtmlTemplateText,
  TranslateHtmlTemplateText
} from "../../api/api";

export default {
  data() {
    return {
      selectData: [],
      roles: [
        {
          formTypeCode: "lvke",
          formTypeName: "流调员、临检员"
        },
        {
          formTypeCode: "jianyanyuan",
          formTypeName: "检验员"
        },
        {
          formTypeCode: "pandingyuan",
          formTypeName: "判定员"
        },
        {
          formTypeCode: "jiankangyuan",
          formTypeName: "健康员"
        },
        {
          formTypeCode: "admin",
          formTypeName: "管理员"
        }
      ],
      editFormWebUrl: base.substring(0, base.length - 5) + ":9996",
      // editFormWebUrl: "http://39.100.29.52:887",
      upLoadURL: upLoadURL,
      langs: [],
      editFormChooseLang: "zh-CN",
      addFormChooseLang: "zh-CN",
      transLangDic: {
        "en-US": "en",
        "zh-CN": "cn",
        "ja-JP": "jp",
        kor: "kor",
        fra: "fra",
        spa: "spa",
        th: "th",
        ara: "ara",
        ru: "ru",
        pt: "pt",
        de: "de",
        it: "it",
        el: "el",
        nl: "nl",
        pl: "pl",
        bul: "bul",
        est: "est",
        dan: "dan",
        fin: "fin",
        cs: "cs",
        rom: "rom",
        slo: "slo",
        swe: "swe",
        hu: "hu",
        vie: "vie",
        cht: "cht"
      },
      fileList: [],
      options: [
        {
          value: "选项1",
          label: "中文"
        },
        {
          value: "选项2",
          label: "English"
        },
        {
          value: "选项3",
          label: "Japanese"
        },
        {
          value: "选项4",
          label: "Korea"
        }
      ],
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
      editFormRules: {},
      // 编辑界面数据
      editForm: "",

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: "",
      // 新增界面数据
      addForm: "",
      OrganizeListByCode: null,
      optionProps: {
        value: "customsCode",
        label: "customsName",
        children: "child",
        checkStrictly: true
      },
      langValue: "",
      //新的
      formCode: "",
      pageNum: 1,
      pageSize: 20
    };
  },
  computed: {
    ...mapGetters([
      "getLangs"
      // ...
    ])
  },
  watch:{
 $route( to , from ){   
       this.getFormDicList();
     }
  },
  methods: {
    getListBy() {
      this.pageNum = 1;
      this.pageSize = 20;
      this.getFormDicList();
    },
    updateView(e) {
      this.$forceUpdate();
    },
    // 获取用户列表
    getFormDicList() {
      let para = {
        formCode: this.formCode,
        languageCode: this.langValue,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      this.listLoading = true;
      getFormDicList(para).then(res => {
        if (res.result) {
          this.total = res.data.totalCount;
          this.users = res.data.list;
          this.listLoading = false;
        } else {
          this.listLoading = false;
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
      this.page = val;
      this.getUsers(JSON.parse(sessionStorage.getItem("user")).organizeCode);
    },
    handleChange(value) {
      console.log(value);
      this.langValue = value;
      this.getFormDicList();
    },
    handleSelectionChange(val) {
      this.selectData = val;
    },
    handleView() {
      this.$router.push({
        path: "/form/tableView",
        query: {
          formParams: this.selectData[0]
        }
      });
    },
    // 删除
    handleDel() {
      this.$confirm("确认删除该表单吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let dellist = [];
          this.selectData.forEach(item => {
            dellist.push(item.formDictCode);
          });
          let para = {
            formDictCodes: dellist
          };
          formDic_delete(para).then(res => {
            this.listLoading = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getFormDicList();
          });
        })
        .catch(() => {});
    },
    // 显示编辑界面
    handleEdit() {
      let that = this;
      that.editFormVisible = true;
      that.editLoading = true;
      let para = {
        code: this.selectData[0].code
      };
      getFormDicDetail(para).then(res => {
        if (res.result) {
          let data = res.data;
          // 把文件列表的改为数组，把解析结果改为字符串
          data.languageList.forEach(item => {
            if (item.formData.exportTemplateFile) {
              item.formData.exportTemplateFile = [
                {
                  name: item.formData.exportTemplateFile,
                  url: item.formData.exportTemplateFile
                }
              ];
            }
            if (item.formItemData) {
              item.formItemData = JSON.stringify(item.formItemData);
            }
            //把原始的editform里面已经提交内容的给替换掉
            for (let i = 0; i < that.editForm.languageList.length; i++) {
              if (
                that.editForm.languageList[i].languageType == item.languageType
              ) {
                that.editForm.languageList[i] = JSON.parse(
                  JSON.stringify(item)
                );
              }
            }
          });
          that.editForm.code = data.code;
          that.editForm.formType = data.formType;
          that.editLoading = false;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
          that.editLoading = false;
          that.editFormVisible = false;
        }
      });
      console.warn(that.editForm);
    },
    // 显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
    },
    // 编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        // console.log(valid);
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            console.log("这是eidtform");
            console.warn(this.editForm);
            let para = {
              code: this.editForm.code,
              formType: this.editForm.formType,
              languageList: []
            };
            this.editForm.languageList.forEach(item => {
              if (item.formData.name) {
                para.languageList.push(item);
              }
            });
            para.languageList.forEach(item => {
              if (
                item.formData.exportTemplateFile &&
                item.formData.exportTemplateFile.length > 0
              ) {
                item.formData.exportTemplateFile =
                  item.formData.exportTemplateFile[0].name;
              } else {
                item.formData.exportTemplateFile = "";
              }
              if (item.formItemData) {
                item.formItemData = JSON.parse(item.formItemData);
              }
            });
            console.log("这是提交的数据");
            console.warn(para);
            formDic_edit(para).then(res => {
              if (res.result) {
                this.editFormVisible = false;
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.resetForm();
                this.getFormDicList();
              }
              this.editLoading = false;
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
            console.log("这是addform");
            console.warn(this.addForm);
            let para = {
              code: this.addForm.code,
              formType: this.addForm.formType,
              languageList: []
            };
            this.addForm.languageList.forEach(item => {
              if (item.formData.name) {
                para.languageList.push(item);
              }
            });
            para.languageList.forEach(item => {
              if (
                item.formData.exportTemplateFile &&
                item.formData.exportTemplateFile.length > 0
              ) {
                item.formData.exportTemplateFile =
                  item.formData.exportTemplateFile[0].url;
              } else {
                item.formData.exportTemplateFile = "";
              }
              if (item.formItemData) {
                item.formItemData = JSON.parse(item.formItemData);
              }
            });
            console.log("这是提交的数据");
            console.warn(para);
            formDic_add(para).then(res => {
              if (res.result) {
                if (res.data.successData.length == 0) {
                  this.$message({
                    message: "fail",
                    type: "error"
                  });
                  return;
                }
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getFormDicList();
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
    // 上传开始
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    upLoadFileSuccess(response, file, fileList, item_) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      if (response.result) {
        let fileUrl = response.data.exportTemplateName;
        let name = file.name;
        this.addForm.languageList.forEach(v => {
          if (v.languageType == item_.languageType) {
            // alert(JSON.stringify(fileUrl+'-------------'+name))
            v.formData.exportTemplateFile.push({
              name: name,
              url: fileUrl
            });
          }
        });
      }
    },
    upLoadFileSuccess_edit(response, file, fileList, item_) {
      console.log(response);
      console.log(file);
      console.log(fileList);
      if (response.result) {
        let fileUrl = response.data.exportTemplateName;
        let name = file.name;
        this.editForm.languageList.forEach(v => {
          if (v.languageType == item_.languageType) {
            v.formData.exportTemplateFile.push({
              name: name,
              url: fileUrl
            });
          }
        });
      }
    },
    upLoadFileFail(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
    },
    // 上传结束
    // 解析模板
    parseHTMLtemplate(item_) {
      let t_ = JSON.parse(item_.formData.htmlTemplateText).formDesc
        ? JSON.parse(item_.formData.htmlTemplateText).formDesc
        : JSON.parse(item_.formData.htmlTemplateText);
      let s = JSON.stringify(t_);
      // s = s.substring(0,s.length-1)
      let para = {
        htmlTemplateText: s
      };
      parseHtmlTemplateText(para).then(res => {
        if (res.result) {
          this.listLoading = false;
          this.addForm.languageList.forEach(v => {
            if (v.languageType == item_.languageType) {
              v.formItemData = JSON.stringify(res.data.formItemList);
              this.updateView();
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        console.log(res);
      });
    },
    parseHTMLtemplate_edit(item_) {
      let t_ = JSON.parse(item_.formData.htmlTemplateText).formDesc
        ? JSON.parse(item_.formData.htmlTemplateText).formDesc
        : JSON.parse(item_.formData.htmlTemplateText);
      let s = JSON.stringify(t_);
      // s = s.substring(0,s.length-1)
      let para = {
        htmlTemplateText: s
      };
      parseHtmlTemplateText(para).then(res => {
        if (res.result) {
          this.listLoading = false;
          this.editForm.languageList.forEach(v => {
            if (v.languageType == item_.languageType) {
              v.formItemData = JSON.stringify(res.data.formItemList);
              this.updateView();
            }
          });
          this.updateView();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        console.log(res);
      });
    },
    TranslateHtmlTemplateText(item_) {
      let t_ = JSON.parse(item_.formData.htmlTemplateText).formDesc
        ? JSON.parse(item_.formData.htmlTemplateText).formDesc
        : JSON.parse(item_.formData.htmlTemplateText);
      let s = JSON.stringify(t_);
      // s = s.substring(0,s.length-1)
      alert(s);
      let para = {
        htmlTemplateText: s,
        languageFromCode: "",
        languageToCode: this.transLangDic[this.addFormChooseLang]
      };
      TranslateHtmlTemplateText(para).then(res => {
        if (res.result) {
          this.listLoading = false;
          this.addForm.languageList.forEach(v => {
            if (v.languageType == item_.languageType) {
              v.formData.htmlTemplateText = res.data;
              this.updateView();
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        console.log(res);
      });
    },
    TranslateHtmlTemplateText_edit(item_) {
      let t_ = JSON.parse(item_.formData.htmlTemplateText).formDesc
        ? JSON.parse(item_.formData.htmlTemplateText).formDesc
        : JSON.parse(item_.formData.htmlTemplateText);
      let s = JSON.stringify(t_);
      // s = s.substring(0,s.length-1)
      let para = {
        htmlTemplateText: s,
        languageFromCode: "",
        languageToCode: this.transLangDic[this.editFormChooseLang]
      };
      TranslateHtmlTemplateText(para).then(res => {
        if (res.result) {
          this.listLoading = false;
          this.editForm.languageList.forEach(v => {
            if (v.languageType == item_.languageType) {
              v.formData.htmlTemplateText = res.data;
              this.updateView();
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        console.log(res);
      });
    },
    resetForm() {
      let p = {
        code: "",
        languageList: []
      };
      this.langValue = localStorage.lang;
      this.langs = this.$store.state.langs;
      this.$store.state.langs.forEach(item => {
        let l = {
          languageType: item.languageCode,
          formData: {
            name: "",
            htmlTemplateText: "",
            exportTemplateFile: [],
            exportTemplateType: ""
          },
          formItemData: ""
        };
        p.languageList.push(l);
      });
      this.addForm = JSON.parse(JSON.stringify(p));
      this.editForm = JSON.parse(JSON.stringify(p));
      console.warn(JSON.stringify(p));
    }
  },
  mounted() {
    // this.getUsers(JSON.parse(sessionStorage.getItem('user')).organizeCode)
    // if(!JSON.parse(sessionStorage.getItem('user')).isSuper){
    // 	this.getOrganizeListByCode()
    // }else{
    // 	this.getOrganizeListByCode_super();
    // }
    // this.getCustomsList_all()
    this.resetForm();
    this.getFormDicList();
  }
};
</script>

<style lang="scss">
.el-table th {
  background-color: #f2f6fc;
}

.headerClass {
  // color: black;
}
.el-dialog__body {
  min-height: 50vh;
  position: relative;
  width: calc(100% - 40px);
  overflow-x: hidden;
}
</style>
