var inquirer = require('inquirer');
let exec = require('child_process').exec;
var fs = require('fs');
var template = require('./template');


init();
function init(){
    console.log("+++++++++++++++++++++++ Welcome to Node-Kubernitify +++++++++++++++++++");
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'workspace',
            message: 'Please enter project location',
        },
        {
            type: 'input',
            name: 'port',
            message: 'Please enter port',
            default: 3000
        },
        {
            type: 'input',
            name: 'appName',
            message: 'Please enter app name',
            default: 'app'
        },
        {
            type: 'input',
            name: 'namespace',
            message: 'Please enter namespace',
            default: 'default'
        },
        {
            type: 'input',
            name: 'externalPort',
            message: 'Please enter externalPort',
            default: 30000
        },
        {
            type: 'input',
            name: 'internalPort',
            message: 'Please enter internalPort',
            default: 3000
        },
        {
            type: 'input',
            name: 'podCount',
            message: 'Please enter podCount',
            default: 1
        },
        {
            type: 'input',
            name: 'imageName',
            message: 'Please enter imageName',
            default: 'default'
        }
      ])
      .then(answers => {  
            if(answers.workspace != ''){
                return writeFilePromise(answers.workspace+'/Dockerfile',template.dockerFile(answers.port))
                .then(()=>{
                    return writeFilePromise(answers.workspace+'/k8s.yaml',template.kubernetesYaml(answers));
                })
                .then(()=>{
                    return execCommand(`cd ${answers.workspace} && docker build -t ${answers.imageName} .  && kubectl create -f k8s.yaml`);
                })
                .catch(err=>{
                    console.log(err.message);  
                })
            }  
            else{
                console.log('Please Enter Correct Path'); 
            }
      })
}


function execCommand(command, errMsg) {
    return new Promise((resolve, reject) => {
        exec(command, (_err, _stdout) => {
            if (_err) {
                console.log(`ERROR :: ${command}`);
                console.log(_err);
                return reject(new Error(errMsg));
            }
            console.log(`SUCCESS :: ${command}`);
            console.log(_stdout);
            return resolve(_stdout);
        });
    });
}


function writeFilePromise(file, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(error);
            resolve("file created successfully with handcrafted Promise!");
        });
    });
};