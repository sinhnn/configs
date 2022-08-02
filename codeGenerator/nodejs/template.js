const fs = require('fs');
const path = require('path');
const slash = require('slash');
const Mustache = require('mustache');
const _ = require('lodash');

const fsCustom_ = require('./fsCustom');
// const log4js = require('log4js');
const winston = require('winston');
const { table } = require('console');
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
    constructor (projectTemplateDirectory) {
        this.root_ = projectTemplateDirectory;
        this.projectTemplate_ = undefined;
    }

    load () {
        // this.projectTemplate_ = scan(this.root_,  (f) => f.name.match(/\.js$/) !== null);
        this.projectTemplate_ = scan(this.root_,  (f) => true);
        return this.projectTemplate_;
    }

    preprocess (templateFilePath, context)
    {
        // Get all valid variables in template file path
        const alls = [];
        for (const database of context.databases)
        {
            for (const table of database.tables)
            {
                const _context = {
                    'database': database,
                    'table': table,
                    'databases': context.databases,
                    'projectName': context.projectName
                };
                alls.push({
                    'templateFilePath': slash(path.join(this.root_, templateFilePath)),
                    'outFilePath': Mustache.render(templateFilePath.replace('.template.js', ''), _context),
                    'context': _context
                });
            }
        }
        return alls;
    }

    template() { return this.projectTemplate_ };

    /**
     * 
     * @param {string} outputDir 
     * @param {object} databases   store information to generates 
     */
    generate (databases, options) {
        console.log(this.projectTemplate_);
        const projectName = options.projectName;

        function render (info, options, overwrite=false)
        {
            console.log(arguments);
            const context = info.context;
            const namespace_ = [options.projectName];
            const tmp = slash(path.join(options.outputDir, path.dirname(info.outFilePath))).split('/').filter(e => e);
            namespace_.push(...tmp);
            context.namespace = (namespace_.filter(f => f).join(".")).split(".").filter(f => f).join(".");
            const output = path.join(options.projectDirectory, options.outputDir, info.outFilePath);

            if (fs.existsSync(output) && overwrite === false) 
            {
                logger.warn(`${output} is already exist! Ignored.`)
            }
            else
            {
                // const projectName = options.projectName;
                const table = info.context.table;
                const tables = info.context.database.tables;
                const database = info.context.database;
                const databases = info.context.databases;
                const text = eval(fs.readFileSync(info.templateFilePath, 'utf-8'));
                fs.mkdirSync(path.dirname(output), {recursive: true});
                fs.writeFileSync(output, text);
            }
        }

        // console.log(allTableContext);
        const alls = [];
        for (const template of this.projectTemplate_)  {
            alls.push(...this.preprocess(template.path, {
                    'databases': databases,
                    'projectName': options.projectName
                }
            ));
        }
        for (const f of _.uniqBy(alls, 'outFilePath'))
        {
            render(f, options, options.overwrite);
        }
    }
}
