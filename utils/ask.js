const readline = require('readline')
const colors = require('colors-console')
const inquirer = require('inquirer')

async function input(name, description) {
    const question = {
        type: 'input',
        name: name,
        message: description,
        validate: function (input) {
            if (input.trim() === '') {
                return '输入不能为空'
            }
            return true
        }
    }
    const answer = await inquirer.default.prompt([question])
    return answer[name]
}

async function inputList(props) {
    const questions = props.map(it => ({
        type: 'input',
        name: it.name,
        message: it.description
    }))
    return await inquirer.default.prompt(questions)
}

function create() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return {
        question(text, color) {
            return new Promise(resolve => {
                rl.question(colors(color, text), answer => {
                    if (answer.trim()) {
                        resolve(answer)
                    } else {
                        resolve(this.question(text, color))
                    }
                })
            })
        },
        close() {
            rl.close()
        }
    }
}

module.exports = {
    create,
    input,
    inputList
}
