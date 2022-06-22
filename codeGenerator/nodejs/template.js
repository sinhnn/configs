const fs = require('fs');
const path = require('path');
const slash = require('slash');
const fsCustom = require('./fsCustom');
// const log4js = require('log4js');
const winston = require('winston');
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`)
    ),
    transports: [
      new winston.transports.Console(),
    ]
});
function scan_(dir, filter, dest) {
    for (const file_ of fs.readdirSync(dir, { withFileTypes: true })) {
        if (file_.isFile() === true) {
            if (filter(file_)) {
                dest.push(slash(path.join(dir, file_.name)));
            } else {
                logger.warn(dir, file_, 'is not template file.');
            }
        }
        if (file_.isDirectory() === true) {
            const subdir = slash(path.join(dir, file_.name));
            logger.info(`scanning subdirectory ${subdir}`);
            scan_(subdir, filter, dest);
        }
    }
    return dest;
}

function scan(dir, filter) {
    const dest = [];
    scan_(dir, filter, dest);
    return dest.map(p => {
            return {
                'absolute': slash(path.resolve(p)),
                'path': slash(path.relative(dir, p)),
                'dirname': slash(path.dirname(p)),
                'filename': path.basename(p),
                'isTemplate': p.search(/\.template\.js$/) >=0 ,
                'extension': p.split('.').pop()
            }
        }) 
}


module.exports = class Template {
    constructor (projectTemplateDirectory, targetFileExtension) {
        this.root_ = projectTemplateDirectory;
        this.extension_ = targetFileExtension;
        this.projectTemplate_ = undefined;
    }

    load () {
        // this.projectTemplate_ = scan(this.root_,  (f) => f.name.match(/\.js$/) !== null);
        this.projectTemplate_ = scan(this.root_,  (f) => true);
        return this.projectTemplate_;
    }

    template() { return this.projectTemplate_ };
    /**
     * 
     * @param {string} outputDir 
     * @param {object} tables   store information to generates 
     */
    generate (outputDir, tables) {
        const projectOutputDir = outputDir;
        for (const template of this.projectTemplate_)  {
            const generatedFileConfig = template;
            
            if (template.isTemplate) {
                generatedFileConfig.outFilePath = slash(path.join(outputDir, template.path.replace(/\.template\.js$/, '') + "." + this.extension_));
                generatedFileConfig.outFilePathWoExt = generatedFileConfig.outFilePath.replace(/\.js$/, '');
                generatedFileConfig.outDirPath = slash(path.join(outputDir, path.dirname(template.path)));
                fs.mkdirSync(generatedFileConfig.outDirPath, {recursive: true});
                logger.info(`Executing template file ${template.path}`);
                eval(fs.readFileSync(template.absolute, 'utf-8'));;
            } else {
                generatedFileConfig.outFilePath = slash(path.join(outputDir, template.path));
                generatedFileConfig.outFilePathWoExt = generatedFileConfig.outFilePath.replace(/\.js$/, '');
                generatedFileConfig.outDirPath = slash(path.join(outputDir, path.dirname(template.path)));
                fs.mkdirSync(generatedFileConfig.outDirPath, {recursive: true});
                logger.info(`Copying template file ${template.path}`);
                fs.copyFile(template.absolute, generatedFileConfig.outFilePath, (err) => {
                    if (err) throw err;
                });
            }
        }
    }
}
