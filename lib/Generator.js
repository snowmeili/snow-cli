const {
  getRepoList,
  getTagList
} = require('./http');
const ora = require('ora');
const inquire = require('inquirer');
const util = require('util');
const downloadGitRepo = require('download-git-repo');
const chalk = require('chalk');
const path = require('path');

//加载动画
async function wrapLoading(fn, message, ...args){
  const spinner = ora(message);
  spinner.start();
  try{
    const result = await fn(...args);
    spinner.succeed();
    return result;
  }catch(err){
    spinner.fail('request failed, refetch...')
  }
}

class Generator {
  constructor(name, targetDir){
    this.name = name;
    this.targetDir = targetDir;
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }
  
  //下载远程模板
  async download(repo, tag){
    console.log(repo, tag, 11111)
    const requestUrl = `zhurong-cli/${repo}${tag?'#'+tag:''}`;
    console.log(requestUrl,222)
    
    const spinner = ora('初始化项目！');
    spinner.start();
    
    this.downloadGitRepo('zhurong-cli/vue3.0-template','my-project', function (err) {
        console.log(err ? 'Error' : 'Success');
        spinner.succeed();
        console.log('初始化结束！');
        spinner.stop();
    })
  }
  
  // 获取用户选择的模板
  async getRepo(){
    // 从远处拉去模板
    const repoList = await wrapLoading(getRepoList,'等待下载模板');
    
    if(!repoList){
      return;
    }
    
    const repos = repoList.map(item=> item.name);
    const {
      repo
    } = await inquire.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择你要创建的模板'
    })
    console.log(repo,4444)
    return repo
  }
  
  // 创建版本
  async getTag(repo){
    //基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList,'等待下载版本', repo);
    
    if(!tags){
      return;
    }
    
    const tagList = tags.map(item => item.name);
    
    const {
      tag
    } = await inquire.prompt({
      name: 'tag',
      type: 'list',
      choices: tagList,
      message: '请选择你要创建项目的 tag'
    })
    
    return tag;
  }
  
  //核心创建逻辑
  async create(){
    const repo = await this.getRepo();
    //获取版本
    const tag = await this.getTag(repo);
    console.log(repo, tag,33333)
    await this.download(repo, tag);
    
    console.log(`\r\n cd ${chalk.rgb(this.name)}`);
    console.log(`\r\n npm run dev`);
  }
}

module.exports = Generator;
