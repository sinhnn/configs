const fs = require('fs');
const path = require('path');
const slash = require('slash');
const Mustache = require('mustache');
const os = require('os');
const _ = require('lodash');
const {include} = require("./utils.js");
const fsCustom_ = require('./fsCustom');

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

/**
 * 
 * @param {string} dir template directory 
 * @param {function} filter custom filter to add/ignore template files/folders
 * @param {List<string>} dest list of file will be generate
 * @returns 
 */
function scan_(rootdir, curdir, filter, dest) {
    for (const file_ of fs.readdirSync(path.join(rootdir, curdir), { withFileTypes: true }))
    {
        // relative path to project
        file_.relativePathToTemplateDir = slash(path.normalize(path.join(curdir, file_.name)));

        if (filter(file_))
        {
            if (file_.isFile() === true)
            {
                if (filter(file_))
                {
                    dest.push(slash(path.join(rootdir, curdir, file_.name)));
                }
                else
                {
                    logger.warn(curdir, file_, 'is not template file.');
                }
            }
            if (file_.isDirectory() === true) {
                const subdir = slash(path.join(curdir, file_.name));
                logger.info(`scanning subdirectory ${subdir}`);
                scan_(rootdir, subdir, filter, dest);
            }
        }
    }
    return dest;
}

/**
 * 
 * @param {string} dir  template directory path 
 * @param {functor} filter  filter function
 * @returns 
 */
function scan(dir, filter) {
    const dest = [];
    
    // Load ignores from template configure file
    let ignores = [];
    const ignoreConfigFile = path.join(dir, 'template.ignores');
    if (fs.existsSync(ignoreConfigFile) == true)
    {
        ignores = fs.readFileSync(ignoreConfigFile, 'utf-8').split('\n').map(l => l.trim()).filter(l => l).map(l => new RegExp('^' + l));
    }
    console.log(ignores);

    const filters = (file_) =>
    {
        let s = ignores.findIndex(regex => file_.relativePathToTemplateDir.search(regex) === 0);
        if (s >= 0)
        {
            logger.info("ignore file " + JSON.stringify(file_));
            return false;
        }
        return filter(file_);
    }

    scan_(dir, '.', filters, dest);
    let ret = dest.map(p => {
            return {
                'absolute': slash((path.resolve(p))),
                'path': slash((path.relative(dir, p))),
                'dirname': slash(path.dirname(p)),
                'filename': path.basename(p),
                'isTemplate': p.search(/\.template\.js$/) >=0 ,
                'extension': p.split('.').pop()
            }
        });
    return ret;
}


module.exports = class Template {
    constructor (projectTemplateDirectory) {
        this.root_ = projectTemplateDirectory;
        this.projectTemplate_ = undefined;
    }

    load () {
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
        const projectName = options.projectName;
        function render (info, options, overwrite=false)
        {
            const context = info.context;
            const namespace_ = [options.projectName];
            const tmp = slash(path.join(options.outputDir, path.dirname(info.outFilePath))).split('/').filter(e => e);
            namespace_.push(...tmp);
            context.namespace = (namespace_.filter(f => f).join(".")).split(".").filter(f => f).join(".");

            const output = path.join(options.projectDirectory, options.outputDir, info.outFilePath);
            global.context = context;
            if (fs.existsSync(output) && overwrite === false) 
            {
                logger.warn(`${output} is already exist! Ignored.`)
                return {'output': output, 'rendered': 'ignore'};
            }
            else
            {
                logger.info(`rendering ${output} from ${info.templateFilePath}`);
                const namespace = context.namespace;
                const classname = path.basename(output).split(".")[0];
                const classpath = [namespace, classname].join(".");
                const entity = info.context.table.entity;
                const table = info.context.table;
                const tables = info.context.database.tables;
                const database = info.context.database;
                const databases = info.context.databases;
                fs.mkdirSync(path.dirname(output), {recursive: true});

                if (info.templateFilePath.includes(".template.js"))
                {
                    const text = eval(fs.readFileSync(info.templateFilePath, 'utf-8'));
                    fs.writeFileSync(output, text);
                    return {'output': output, 'rendered': 'templated'};

                }
                else
                {
                    fs.copyFileSync(info.templateFilePath, output);
                    return {'output': output, 'rendered': 'copy'};

                }
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

        const results = [];
        for (const f of _.uniqBy(alls, 'outFilePath'))
        {
            results.push(render(f, options, options.overwrite));
        }
        console.table(results);
    }
}
