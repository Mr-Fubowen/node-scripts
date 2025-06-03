# Node-Scripts-Tools

预定义各种实用脚本，包括部署、上传、下载、备份等，在开发和部署中使用

## 扩展的命令

### ⚠️**注意事项**

1. 脚本中 {{xxx:defaultValue}} 为环境变量占位符, 执行时由用户指定,
2. **defaultValue** 为默认值, 脚本中只需要指定一次即可随地使用, 无位置要求
3. **PF** 为 **PASSWORD** 别名，可在命令**执行**的时候，使用 **PF** 指定密码文件的方式设置 **PASSWORD** 的值
4. 这些命令可单独使用也可以在脚本中使用, 脚本中结合环境变量动态传递参数，然后使用 **n** 命令调用脚本

### 命令列表

1. n: 执行脚本的命令, 例如 n ./bin/publish.sh -e PATH=./dist,IP=xxx.xxx.xxx.xxx,PF=./password.txt 可选参数 -c Cron 表达式 "0/5 \* \* \* \* \*"
2. n-upload: 上传文件 {{PARENT_PATH}}/{{NAME}}.tgz {{USER:root}}@{{IP}}:{{PORT:22}}{{UPLOAD_PATH:/opt/uploads}} -p {{PASSWORD}}
3. n-login: n-login {{USER:root}}@{{IP}}:{{PORT:22}} -p {{PASSWORD}}
4. n-text: 创建并写入文本文件 n-text ./demo.txt 文件内容
5. n-zip: n-zip {{PATH}} {{PARENT_PATH}}/{{NAME}}.tgz
6. n-unzip: n-unzip {{PATH}} {{PARENT_PATH}}/{{NAME}}.tgz
7. n-web: n-web -e PATH=./dist,IP=xxx.xxx.xxx.xxx,PF=./password.txt
8. n-commit: n-commit ./ -m '自动提交'
9. 目前扩充的命令有限, 请自行扩充或者在 **Github** 提交需求
10. 请特别关注下面的**注意事项**

## 预定义脚本 n-web

```bash
n-zip {{PATH}}  {{PARENT_PATH}}/{{NAME}}.tgz
n-upload  {{PARENT_PATH}}/{{NAME}}.tgz {{USER:root}}@{{IP}}:{{PORT:22}}{{UPLOAD_PATH:/opt/uploads}} -p {{PASSWORD}}
n-login {{USER:root}}@{{IP}}:{{PORT:22}} -p {{PASSWORD}}
tar -xzvf {{UPLOAD_PATH}}/{{NAME}}.tgz -C {{UPLOAD_PATH}}
[ -e "{{PUBLISH_PATH:/var/www/html}}" ] && mkdir -p {{UPLOAD_PATH}}/{{NAME}}-versions && mv {{PUBLISH_PATH}} {{UPLOAD_PATH}}/{{NAME}}-versions/{{TIMESTAMP}}
mv {{UPLOAD_PATH}}/{{NAME}} {{PUBLISH_PATH}}
```

> 调用方法 **n-web -e PATH=./dist,IP=xxx.xxx.xxx.xxx,PF=./password.txt**

### 密码文件 PF=./password.txt

```text
文本密码(注意密码不要包含不可见字符)
```

### ⚠️**注意事项**

1. **n-login** 执行后, 后续的命令都在登录后的服务器 **bash** 中执行, 请不要使用不支持的本地命令
2. 其中包含的环境变量可任意指定，会在脚本执行的时候通过 **-e** 参数传递, 未传递的参数会在控制台请求用户输入
3. 其中密码的 **PASSWORD** 环境变量指定其登陆密码, 为了安全和 Git 便捷性提供了 **-e** 别名 **PF**, 可指定密码文件的路径
4. 源码已发布到 Github 可自行提交 PR 扩充其功能

## 相关

1. 使用了 [node-ssh-plus](https://www.npmjs.com/package/node-ssh-plus) 作为操作服务器的库
2. **npm install node-ssh-plus**
