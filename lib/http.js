const axios = require('axios');

// axios 的拦截器，当时怎么没有想到这个？直接用拦截器获取到 restful 结构里面的 data 数据即可
axios.interceptors.response.use(res=>{
  return res.data
})

/**
 * 获取模板列表
 * @returns Promise
 */
async function getRepoList() {
  return axios.get('https://api.github.com/orgs/zhurong-cli/repos')
}

/**
 * 获取版本信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
async function getTagList(rego){
  //return axios.get(`https://api.github.com/repos/zhurong-cli/${repo}/tags`)
  return axios.get('https://api.github.com/repos/zhurong-cli/vue3.0-template/tags')
}

module.exports = {
  getRepoList,
  getTagList
}