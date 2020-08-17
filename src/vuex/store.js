import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  count: 10,
  langs:[{
		"iconImageURL": "🇨🇳",
		"countryCode": "CHN",
		"countryName": "中国",
		"languageCode": "zh-CN",
		"languageName": "中文"
	}, {
		"iconImageURL": "🇺🇸",
		"countryCode": "USA",
		"countryName": "美国",
		"languageCode": "en-US",
		"languageName": "英语"
	},{
		"iconImageURL": "🇯🇵",
		"countryCode": "JAPAN",
		"countryName": "日本",
		"languageCode": "ja-JP",
		"languageName": "日语"
	},{
		"iconImageURL": "🇰🇷",
		"countryCode": "",
		"countryName": "韩国",
		"languageCode": "kor",
		"languageName": "韩语"
	},{
		"iconImageURL": "🇫🇷",
		"countryCode": "",
		"countryName": "法国",
		"languageCode": "fra",
		"languageName": "法语"
	}, {
		"iconImageURL": "🇪🇸",
		"countryCode": "",
		"countryName": "西班牙",
		"languageCode": "spa",
		"languageName": "西班牙语"
	},{
		"iconImageURL": "🇹🇭",
		"countryCode": "",
		"countryName": "泰国",
		"languageCode": "th",
		"languageName": "泰语"
	},{
		"iconImageURL": "🇸🇦",
		"countryCode": "",
		"countryName": "阿拉伯",
		"languageCode": "ara",
		"languageName": "阿拉伯语"
	},{
		"iconImageURL": "🇷🇺",
		"countryCode": "",
		"countryName": "俄国",
		"languageCode": "ru",
		"languageName": "俄语"
	}, {
		"iconImageURL": "🇵🇹",
		"countryCode": "",
		"countryName": "葡萄牙",
		"languageCode": "pt",
		"languageName": "葡萄牙语"
	},{
		"iconImageURL": "🇩🇪",
		"countryCode": "",
		"countryName": "德国",
		"languageCode": "de",
		"languageName": "德语"
	},{
		"iconImageURL": "🇮🇹",
		"countryCode": "",
		"countryName": "意大利",
		"languageCode": "it",
		"languageName": "意大利语"
	},{
		"iconImageURL": "🇬🇷",
		"countryCode": "",
		"countryName": "希腊",
		"languageCode": "el",
		"languageName": "希腊语"
	}, {
		"iconImageURL": "🇳🇱",
		"countryCode": "",
		"countryName": "荷兰",
		"languageCode": "nl",
		"languageName": "荷兰语"
	},{
		"iconImageURL": "🇵🇱",
		"countryCode": "",
		"countryName": "波兰",
		"languageCode": "pl",
		"languageName": "波兰语"
	},{
		"iconImageURL": "🇧🇬",
		"countryCode": "",
		"countryName": "保加利亚",
		"languageCode": "bul",
		"languageName": "保加利亚语"
	},{
		"iconImageURL": "🇪🇪",
		"countryCode": "",
		"countryName": "爱沙尼亚",
		"languageCode": "est",
		"languageName": "爱沙尼亚语"
	}, {
		"iconImageURL": "🇩🇰",
		"countryCode": "",
		"countryName": "丹麦",
		"languageCode": "dan",
		"languageName": "丹麦语"
	},{
		"iconImageURL": "🇫🇮",
		"countryCode": "",
		"countryName": "芬兰",
		"languageCode": "fin",
		"languageName": "芬兰语"
	},{
		"iconImageURL": "🇨🇿",
		"countryCode": "",
		"countryName": "捷克",
		"languageCode": "cs",
		"languageName": "捷克语"
	},{
		"iconImageURL": "🇷🇴",
		"countryCode": "",
		"countryName": "罗马尼亚",
		"languageCode": "rom",
		"languageName": "罗马尼亚语"
	},{
		"iconImageURL": "🇸🇮",
		"countryCode": "",
		"countryName": "斯洛文尼亚",
		"languageCode": "slo",
		"languageName": "斯洛文尼亚语"
	},{
		"iconImageURL": "🇸🇪",
		"countryCode": "",
		"countryName": "瑞典",
		"languageCode": "swe",
		"languageName": "瑞典语"
	},{
		"iconImageURL": "🇭🇺",
		"countryCode": "",
		"countryName": "匈牙利",
		"languageCode": "hu",
		"languageName": "匈牙利语"
	},{
		"iconImageURL": "🇻🇳",
		"countryCode": "",
		"countryName": "越南",
		"languageCode": "vie",
		"languageName": "越南语"
	},{
		"iconImageURL": "🇨🇳",
		"countryCode": "",
		"countryName": "中国（台湾）",
		"languageCode": "cht",
		"languageName": "繁体中文"
	}]
}


// 定义所需的 mutations
const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  },
  SETLANGS (state,langs_){
	  state.langs = langs_
  }
}

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
