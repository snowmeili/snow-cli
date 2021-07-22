const path = require("path")

const fs = require("fs-extra")
const inquire = require("inquirer");
const Generator = require('./Generator');

module.exports = async function(name, option){
  console.log(name,option,888)
  // 通过根目录获取根路径
  const cwd = process.cwd();
  const targetUrl = path.join(cwd, name);
  console.log(targetUrl)
  if(fs.existsSync(targetUrl)){
     
    //看看询问里面是否有强制
    if(option.force){
      await fs.remove(targetUrl)
    }
    
    // 如果不强制就询问是否需要覆盖
    let {
      action
    } = await inquire.prompt([{
      name: 'action',
      type: 'list',
      message: 'target directory already exists pick an action',
      choices:[{
        name: '重写',
        value: 'overwrite'
      },{
        name: '取消',
        value: 'false'
      }]
    }])
    
    if(!action){
      return;
    }
    
   // console.log('\r\n Removing....');
   // await fs.remove(targetUrl)
   // 新建文件
   const generator = new Generator(name, targetUrl);
   generator.create()
  }
}
