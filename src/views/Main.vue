<template>
	<div style="position: relative;width: 100%;height: 100%;display: flex;align-items: center;flex-direction: column;">
		<div style="text-align: center;font-size: 28px;text-align: center;padding:30px;font-weight: 700;" :span="24">
			法律责任声明
		</div>
		<el-col :span="18" class="falv"> 
			通常推流端使用WebRTC将本地视频上传到流媒体服务器端，然后在服务端将WebRTC的流转码成RTMP，HLS，MPEG-DASH等，再通过传统的流媒体通道进行直播分发。
			
			这个架构还是借助传统直播的方案，只是利用了WebRTC的特性将推流端到服务端之间的流传进行优化，这样做的最大问题是服务端的性能消耗和直播分发的延时，我们知道类似HLS这样的协议通常延时在15s+。
			
			随着应用场景对于实时性要求的提高，上面的架构无疑还是无法满足需求的。通过anyRTC的运营数据和市场需求分析来看，更多的需求方希望看到更低延时的视频流，以帮助他们完成更加丰富的场景需求。
			
			而当前这种架构不能胜任实时直播的工作，因为在传统直播架构中缓存，分片等设计方式保障了直播的流畅性，但是却牺牲了直播的实时性。
			
			WebRTC能做什么
			
			由于传统直播方案无法应对低延时直播场景，这就是为什么需要一个全新的直播架构，当然低延时和实时性是必需的。但是由于一个协议的标准化和实施需要很长时间，因此目前最佳的可选方案就是WebRTC，今年(2018年6月)WebRTC 1.0规范正式发布，各大厂商均表现出很高的积极性，而且现在大多数浏览器中已经原生支持，这对WebRTC未来更加广泛的应用打下了非常夯实的基础。
			
			
			图2
			图2是WebRTC做直播的架构，所有的流媒体都会走WebRTC通道，这样可以保证整个流媒体从推流端到观看端的每个环节都能使用WebRTC的特性。
			
			当然使用WebRTC做直播有很多难点需要攻克，广播服务器需要具备大容量，大并发，低延时，可动态伸缩，可灾备等一些列高级特性，而不仅仅是简单的媒体流转发。
			
			要做到这些，我们需要一个完全不同的服务器架构来实现WebRTC流媒体的转发，这与当今市场上的一些方案（开源和商业方案）有所不同。因为现有的方案服务器上的WebRTC实现几乎是背靠背的实现——它们在服务端对每个连接模拟一个完整的客户端来接收或转发WebRTC的媒体流。这样实现没有问题，但是它很难应对上千、几万或数百万的大并发连接。
			
			anyRTC如何实现
			
			anyRTC一直主推WebRTC技术方案对原有的直播系统进行升级改造。anyRTC采用的是微服务分离架构，流媒体服务只对信令和媒体包进行转发，这些我们定义为轻任务；而类似媒体处理、编解码等重任务由单独的业务服务进行处理。
			
			同时服务端之间的流分发如何保障低延时，单机最大容量，系统容灾，媒体流过防火墙，跨国分发流，流路径跟踪等等一些列问题也需要考虑。由于篇幅有限这些问题我们将在后续的文章中再做详细讨论。
			
			结语
			
			那么直播为什么不使用WebRTC呢，其中的缘由很多，可能是觉得WebRTC方案还不够成熟，可能是因为技术难度较高实现较复杂，可能是因为需求不迫切，可能你认为这本身就是伪命题，也有可能是因为你还不知道。无论因为什么原因，WebRTC近几年的发展势头都是不能够忽略的，不久的将来WebRTC会在更多场景中广泛应用，而不仅仅是直播行业。
		</el-col>
		 <el-button style="margin-top: 40px;" @click="go" type="warning">我同意</el-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// liudiao_topLeft: liudiao_topLeft,
				// liudiao_topRight: liudiao_topRight,
				// liudiao_bottomLeft: liudiao_bottomLeft,
				// liudiao_bottomRight: liudiao_bottomRight,
				formData: {},
				formDesc: {},
				formList: [{
					name: "流调表"
				}, {
					name: "流调表"
				}, {
					name: "流调表"
				}, {
					name: "流调表"
				}, {
					name: "流调表"
				}]
			}

		},
		watch: {
			//检测数据结构发生变化
			formData: {
				handler: function(val, oldVal) {
					console.log(val)
				},
				deep: true
			}
		},
		methods: {
			go(){
				this.$router.push({path:"form"})
			},
			getFormList() { //获取表格列表
				let para = {
					"checkRecordCode": "",
					"formCode": "",
					"passengerCode": "",
					"officerCode": ""
				}
				getFormList(para).then((res) => {
					if (res.data.result) {
						this.total = res.data.data.totalCount
						this.users = res.data.data.list
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						})
					}
					console.log(res)

				})
			}

		},
		mounted() {

		}
	}
</script>
<style lang="scss">
	form {
		background-color: white;
		padding: 60px;
		margin-top: 50px;
		font-size: 34px !important;
	}

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

	.nameWrap {
		margin-top: 30px;
		text-align: center;
	}
	.falv{
		    line-height: 30px;
		    background-color: white;
		    height: 60%;
		    padding: 25px;
		    align-self: center;
		    overflow-y: scroll;
		    font-size: 18px;

	}
</style>
