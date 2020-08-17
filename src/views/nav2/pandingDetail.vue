<template>
	<div id="tabl" style="position: relative;padding: 20px;">
		<!-- <img :src="liudiao_topLeft" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;left: 0;">
		<img :src="liudiao_topRight" alt="" style="position: absolute;width: 24%;z-index: 99;top: 0;right: 0;">
		<img :src="liudiao_bottomLeft" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;left: 0;">
		<img :src="liudiao_bottomRight" alt="" style="position: absolute;width: 24%;z-index: 99;bottom: 0;right: 0;"> -->
		<el-button size="mini" type="primary" @click="goback">返回</el-button>
		<div style="text-align: center;font-size: 28px;text-align: center;font-weight: 700;" :span="24">
			{{formParams.formName}}
		</div>
		<!-- <div style="text-align: center;font-size: 14px;padding-top: 15px;padding-bottom: 10px;" :span="24">
			为了您和他人的健康，请如实填报，如有隐瞒或者虚假填报，将依法追究相关责任
		</div>
		<div class="devideLine"></div> -->
		<ele-form :formDesc="formDesc" v-model="formData" 
		:isLoading="isLoading"
		:formError="formError"
		@request="handleRequest"
		labelPosition="top">
		</ele-form>
	</div>
</template>

<script>
	import {getFormDetail,submitFormData,getTaskDetail,submitTask} from '../../api/api'
	import liudiao_topLeft from '../../assets/liudiao_topLeft.png'
	import liudiao_topRight from '../../assets/liudiao_topRight.png'
	import liudiao_bottomLeft from '../../assets/liudiao_bottomLeft.png'
	import liudiao_bottomRight from '../../assets/liudiao_bottomRight.png'
	export default {
		data() {
			return {
				formParams:'',
				isLoading:null,
				formError:null,
				liudiao_topLeft: liudiao_topLeft,
				liudiao_topRight: liudiao_topRight,
				liudiao_bottomLeft: liudiao_bottomLeft,
				liudiao_bottomRight: liudiao_bottomRight,
				formData: {},
				formDesc: {}
			}

		},
		watch: {
			//检测数据结构发生变化
			formData: {
				handler: function(val, oldVal) {
					console.log("值发生了变化")
					console.log(val)
				},
				deep: true
			}
		},
		methods: {
			getFormDetail() { //获取表格列表
				let para = {
					"taskCode":this.formParams.taskCode,
					"formCode": "caiyangbiao",
					"languageCode":localStorage.lang,
					"formRecordCode": "",
					
				}
				getTaskDetail(para).then((res) => {
					if (res.data.result) {
						let data = res.data.data
						//获取到页面表单渲染数据
						this.formDesc = JSON.parse(data.formTemplate.htmltemplatetext);
						this.formDesc = this.formDesc.formDesc?this.formDesc.formDesc:this.formDesc
						//获取到页面填充数据
						let formList = data.formData.formList
						if(formList&&formList.length>0){
							for(let i=0;i<formList.length;i++){
								this.formData[formList[i].htmlCode] = formList[i].htmlValue
								if(formList[i].htmlType == 'DateTime'){
									this.formData[formList[i].htmlCode] = parseInt(formList[i].htmlValue)
								}
							}
						}
						
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						})
					}
			
				})
			},
			async handleRequest(data) {
			        if (this.isLoading) return // 判断状态
			        try {
			          this.isLoading = true // 更改状态
			          const response = await this.submitFormData() // 发送请求
			          // 成功处理
			          this.$message.success('提交成功')
			          this.goback() // 跳转回上一页
			        } catch (error) {
			          // 处理错误
			          // 为了表单同步显示后端返回的错误, 需要将错误信息传递给表单
			          this.formError = { "错误": '提交错误'}
			        } finally {
			          this.isLoading = false
			        }
			      },
			submitFormData(){
				console.log(JSON.stringify(this.formData))
				let formList = []
				for(let key in this.formData){
					let htmlType = null;
					if(this.formDesc[key].type=='radio'){
						htmlType = "radio"
					}else if(this.formDesc[key].type=='checkbox'){
						htmlType = "radio"
					}else{
						htmlType = "string"
					}
					formList.push({
						htmlCode:key,
						htmlValue:this.formData[key],
						htmlType:htmlType,
						htmlVerifyType:''
					})
				}
				let para = {
				  "checkRecordCode": "",
				  "taskCode":this.formParams.taskCode,
				  "formCode": this.formParams.formCode,
				  "passengerCode": "",
				  "officerCode": "",
				  "formList": formList
				}
				console.log("这是提交的数据")
				console.log(para)
				return new Promise((resolve,reject)=>{
					submitTask(para).then((res) => {
						if(res.result) {
							resolve(res.data)
							
						} else {
							reject(res.data)
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'error'
							// })
						}
						console.log(res)
					
					})
				})
				
			},
			goback(){
				this.$router.go(-1)
			},

		},
		
		mounted() {
			console.log(this.$route.query.formParams)
			this.formParams = this.$route.query.formParams
			this.getFormDetail()
		}
	}
</script>
<style lang="scss">
	// form {
	// 	background-color: white;
	// 	border: 1px solid #dedede;
	// 	padding: 60px;
	// 	margin-top: 30px;
	// 	font-size: 34px !important;
	// }

	.el-form-item__label {
		font-size: 18px;
		// font-weight: bold;
		color: #000000;
	}

	.el-form-item__content {
		// display: flex !important;
		// align-items: center !important;
		// justify-content: center;
	}

	.devideLine {
		width: 40%;
		height: 6px;
		background-color: rgba(42, 219, 185, 0.3);
		position: relative;
		top: 75px;
		z-index: 99;
		left: 30%;
	}
</style>
