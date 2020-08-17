import axios from 'axios'
//请求头加userid和customcode
const Axios=axios.create({
  timeout: 10000 // 请求超时时间
});

// request拦截器
Axios.interceptors.request.use(config => {
  if(sessionStorage.getItem("user")){
    config.headers['userId'] = JSON.parse(sessionStorage.getItem("user")).userID
    config.headers['customsCode'] =JSON.parse(sessionStorage.getItem("user")).customsCode
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器
// Axios.interceptors.response.use(
//   response => {
//     const res = response.data;
//     return res;
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )


// let base = 'http://39.100.236.246:9998'
// 登录
export const requestLogin = params => {
  return Axios.post(`${base}/api/OfficerManager/Login`, params).then(res => res.data)
}

// 官员列表
export const getOfficerList = params => {
  return Axios.get(`${base}/api/OfficerManager/OfficerList`, {
    params: params
  }).then(res => res.data)
}
// 添加关员
export const officer_add = params => {
  return Axios.post(`${base}/api/OfficerManager/AddOfficer`, params).then(res => res.data)
}
// 编辑关员
export const officer_edit = params => {
  return Axios.post(`${base}/api/OfficerManager/EditOfficer`, params).then(res => res.data)
}
// 关员删除
export const officer_delete = params => {
  return Axios.post(`${base}/api/OfficerManager/DeleteOfficer`, params).then(res => res.data)
}

// 关区列表,按照登记，返回包含自身及以下的关区
export const getCustomsList = params => {
  return Axios.get(`${base}/api/OfficerManager/CustomsList`, {
    params: params
  }).then(res => res.data)
}
// 关区列表，返回所有的
export const getCustomsList_all = params => {
  return Axios.get(`${base}/api/OfficerManager/CustomsListAll`, {
    params: params
  }).then(res => res.data)
}

// 关区添加
export const customs_add = params => {
  return Axios.post(`${base}/api/OfficerManager/AddCustoms`, params).then(res => res.data)
}
// 关区编辑
export const customs_eidt = params => {
  return Axios.post(`${base}/api/OfficerManager/EditCustoms`, params).then(res => res.data)
}
// 关区删除
export const customs_delete = params => {
  return Axios.post(`${base}/api/OfficerManager/DeleteCustoms`, params).then(res => res.data)
}

// 表单字典列表
export const getFormDicList = params => {
  return Axios.get(`${base}/api/FormManager/FormDictList`, {
    params: params
  }).then(res => res.data)
}
// 表单字典详情
export const getFormDicDetail = params => {
  return Axios.get(`${base}/api/FormManager/FormDictDetail`, {
    params: params
  }).then(res => res.data)
}
// 表单字典添加
export const formDic_add = params => {
  return Axios.post(`${base}/api/FormManager/FormDictAdd`, params).then(res => res.data)
}
// 表单字典编辑
export const formDic_edit = params => {
  return Axios.post(`${base}/api/FormManager/FormDictEdit`, params).then(res => res.data)
}
// 表单字典删除
export const formDic_delete = params => {
  return Axios.post(`${base}/api/FormManager/FormDictDelete`, params).then(res => res.data)
}

// 解析字典项
export const parseHtmlTemplateText = params => {
  return Axios.post(`${base}/api/FormManager/ParseHtmlTemplateText`, params).then(res => res.data)
}

// 获取表格列表
export const getFormList = params => {
  return Axios.post(`${base}/api/FormManager/FormList`, params).then(res => res.data)
}
// 获取表单详情
export const getFormDetail = params => {
  return Axios.get(`${base}/api/FormManager/FormDetail`, {
    params: params
  }).then(res => res.data)
}
// 提交表单
export const submitFormData = params => {
  return Axios.post(`${base}/api/FormManager/SubmitForm`, params).then(res => res.data)
}
// 导出表格
export const exportWord = params => {
  return Axios.post(`${base}/api/FormManager/FormExportWord`, params).then(res => res.data)
}
// 删除表格数据
export const deleteFormData = params => {
  return Axios.post(`${base}/api/FormManager/FormDelete`, params).then(res => res.data)
}
// 修改表格数据
export const editFormData = params => {
  return Axios.post(`${base}/api/FormManager/FormEdit`, params).then(res => res.data)
}
// 批量提交数据
export const BatchCommit = params => {
  return Axios.post(`${base}/api/FormManager/BatchCommit`, params).then(res => res.data)
}
// 批量转交
export const PrintDeliverForm = params => {
  return Axios.post(`${base}/api/FormManager/PrintDeliverForm`, params).then(res => res.data)
}

// 采样表列表
export const getTaskList = params => {
  return Axios.post(`${base}/api/FormManager/TaskList`, params).then(res => res.data)
}
// 采样表详情
export const getTaskDetail = params => {
  return Axios.get(`${base}/api/FormManager/TaskDetail`, {
    params: params
  })
}
// 提交采样表
export const submitTask = params => {
  return Axios.post(`${base}/api/FormManager/TaskSubmitForm`, params).then(res => res.data)
}

// 字典项的获取
// 获取国家字典
export const getCountryDict = params => {
  return Axios.get(`${base}/api/DictManager/CountryDict`, {
    params: params
  }).then(res => res.data)
}
// 获取语言字典
export const getLanguageDict = params => {
  return Axios.get(`${base}/api/DictManager/LanguageDict`, {
    params: params
  }).then(res => res.data)
}
// 导出类型字典
export const getExportTypeDict = params => {
  return Axios.get(`${base}/api/DictManager/ExportTypeDict`, {
    params: params
  }).then(res => res.data)
}
// HTMLitem类型
export const getHTMLItemTypeDict = params => {
  return Axios.get(`${base}/api/DictManager/HTMLItemTypeDict`, {
    params: params
  }).then(res => res.data)
}

// 翻译
export const TranslateHtmlTemplateText = params => {
  return Axios.post(`${base}/api/FormManager/TranslateHtmlTemplateText`, params).then(res => res.data)
}

// 获取旅客信息通过健康码
export const GetPassengerInfoByJianKangMa = params => {
  return Axios.get(`${base}/api/output/GetPassengerInfoByJianKangMa`, {
    params: params
  }).then(res => res.data)
}

// 获取相关联表单信息
export const getRelatedFormDetailListByTaskCode = params => {
  return Axios.get(`${base}/api/FormManager/FormDetailListByTaskCode`, {
    params: params
  }).then(res => res.data)
}
// 根据语言查询系统内的表单列表
export const GetQueryFormType = params => {
  return Axios.get(`${base}/api/FormManager/QueryFormType`, {
    params: params
  }).then(res => res.data)
}
// 查询系统支持的语言信息
export const GetQueryLanguage = params => {
  return Axios.get(`${base}/api/FormManager/QueryLanguage`, {
    params: params
  }).then(res => res.data)
}
// 查询当前登录用户所属关区以及下属关区关员列表
export const GetQueryOfficerList = params => {
  return Axios.get(`${base}/api/FormManager/QueryOfficerList`, {
    params: params
  }).then(res => res.data)
}

// 获取表格列表
export const getFormList_youke = params => {
  return Axios.get(`${base}/api/FormManager/FormDictListForSubmit`, {
    params: params
  }).then(res => res.data)
}
// 获取表单详情
export const getFormDetail_youke = params => {
  return Axios.get(`${base}/api/FormManager/FormDetail`, {
    params: params
  }).then(res => res.data)
}
// 提交表单
export const submitFormData_youke = params => {
  return Axios.post(`${base}/api/FormManager/SubmitForm`, params).then(res => res.data)
}
// 获取旅客信息通过健康码
// export const GetPassengerInfoByJianKangMa = params => { return Axios.get(`${base}/api/output/GetPassengerInfoByJianKangMa`, { params: params }).then(res => res.data) }
// 护照号获取信息
export const GetPassengerInfoByHuZhaoHao = params => {
  return Axios.get(`${base}/api/output/GetPassengerInfoByHuZhaoHao`, {
    params: params
  }).then(res => res.data)
}
// 获取航班信息
export const GetFlightPersonTypeInfo = params => {
  return Axios.get(`${base}/api/output/GetFlightPersonTypeInfo`, {
    params: params
  }).then(res => res.data)
}
// 通过健康码和表单类型获取生成的任务对象
export const QueryTask = params => {
  return Axios.get(`${base}/api/FormManager/QueryTask`, {
    params: params
  }).then(res => res.data)
}

// 角色列表
// 获取所有的角色列表
export const GetRoleList = params => {
  return Axios.get(`${base}/api/RoleManager/GetRoleList`, {
    params: params
  }).then(res => res.data)
}
// 获取指定角色的角色详情，包含菜单列表
export const GetRoleDetail = params => {
  return Axios.get(`${base}/api/RoleManager/GetRoleDetail`, {
    params: params
  }).then(res => res.data)
}
// 更新角色，包含角色的菜单信息
export const UpdateRoleInfo = params => {
  return Axios.post(`${base}/api/RoleManager/UpdateRoleInfo`, params).then(res => res.data)
}
// 请求删除角色
export const DeleteRole = params => {
  return Axios.post(`${base}/api/RoleManager/DeleteRole`, params).then(res => res.data)
}
// 获取菜单
export const GetMenuList = params => {
  return Axios.get(`${base}/api/RoleManager/GetMenuList`, {
    params: params
  }).then(res => res.data)
}
// 新增角色，包含角色的菜单信息
export const InsertRoleInfo = params => {
  return Axios.post(`${base}/api/RoleManager/InsertRoleInfo`, params).then(res => res.data)
}

// 首页
// 获取统计列表
export const GetSummary = params => {
  return Axios.get(`${base}/api/Home/GetSummary`, {
    params: params
  }).then(res => res.data)
}
// 表单数量
export const GetStatistics = params => {
  return Axios.get(`${base}/api/Home/GetStatistics`, {
    params: params
  }).then(res => res.data)
}
// 填写时长
export const GetDurationStatistic = params => {
  return Axios.get(`${base}/api/Home/GetDurationStatistic`, {
    params: params
  }).then(res => res.data)
}

// 获取异常表单列表
export const GetList = params => {
  return Axios.post(`${base}/api/FormException/GetList`, params).then(res => res.data)
}
// 异常表单批量删除
export const BatchDelete = params => {
  return Axios.post(`${base}/api/FormException/BatchDelete`, params).then(res => res.data)
}

// 通关记录
// 通关记录详情
export const QueryPassengerEntryDetail = params => {
  return Axios.post(`${base}/api/Passenger/QueryPassengerEntryDetail`, params).then(res => res.data)
}
// 获取通关记录列表
export const QueryPassengerEntryList = params => {
  return Axios.post(`${base}/api/Passenger/QueryPassengerEntryList`, params).then(res => res.data)
}
// 删除通关记录
export const DeleteEntry = params => {
  return Axios.post(`${base}/api/Passenger/DeleteEntry`, params).then(res => res.data)
}

//获取送检处理表单列表
export const QueryUnSendFormList = params => {
  return Axios.post(`${base}/api/FormManager/QueryUnSendFormList`, params).then(res => res.data)
}
//送检
export const SendFormToCheck = params => {
  return Axios.post(`${base}/api/FormManager/SendFormToCheck`, params).then(res => res.data)
}
//送检统计
export const QuerySendStatisticsResult = params => {
  return Axios.post(`${base}/api/FormManager/QuerySendStatisticsResult`, params).then(res => res.data)
}

//操作
export const QueryOperationLog = params => {
  return Axios.post(`${base}/api/Operation/QueryOperationLog`, params).then(res => res.data)
}

//修改密码
export const ChangePwd = params => {
  return Axios.post(`${base}/api/OfficerManager/ChangePwd`, params).then(res => res.data)
}
//获取申明卡信息
export const QueryPasserHealthyInfo = params => {
  return Axios.post(`${base}/api/Passenger/QueryPasserHealthyInfo`, params).then(res => res.data)
}