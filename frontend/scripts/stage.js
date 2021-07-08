const { exec } = require('child_process');
const { writeFileSync } = require('fs');




function setStage() {
    const content = {}
    if (process.env.IS_HEROKU === 'true') {
        console.log('prod baby')
        content.stage = 'prod'
    } else {
        console.log('dev baby')
        content.stage = 'dev'
    }
    writeFileSync('project-metadata.json', JSON.stringify(content), 'utf8', () => {});
    console.log(`\n------------\n stage: ${content.stage}, ${process.env.IS_HEROKU}, ${process.env}}\n------------\n`) 
}

setStage()

  

  