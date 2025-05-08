n-zip {{PATH}}  {{PARENT_PATH}}/{{NAME}}.tgz
n-upload  {{PARENT_PATH}}/{{NAME}}.tgz {{USER:root}}@{{IP}}:{{PORT:22}}{{UPLOAD_PATH:/opt/uploads}} -p {{PASSWORD}}
n-login {{USER:root}}@{{IP}}:{{PORT:22}} -p {{PASSWORD}}
tar -xzvf {{UPLOAD_PATH}}/{{NAME}}.tgz -C {{UPLOAD_PATH}}
[ -e "{{PUBLISH_PATH:/var/www/html}}" ] && mkdir -p {{UPLOAD_PATH}}/{{NAME}}-versions && mv {{PUBLISH_PATH}} {{UPLOAD_PATH}}/{{NAME}}-versions/{{TIMESTAMP}}
mv {{UPLOAD_PATH}}/{{NAME}} {{PUBLISH_PATH}}