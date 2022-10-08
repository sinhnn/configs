const fs = require('fs');
const path = require('path');
const slash = require('slash');
const Template = require('./template');

const { Sequelize } = require('sequelize');
const SQLite = require('sqlite3');

const kSqliteType_To_CStype = {
    'TEXT': 'string',
    'LONGVARCHAR': 'string',
    'VARCHAR': 'string',
    'BLOB': 'byte[]',
    'INTEGER': 'long', // long, int, bool
    'FLOAT': 'double',
    'REAL': 'double',
    'DOUBLE': 'double'
}

String.prototype.ToCapitalizeCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

String.prototype.ToVariableName = function() {
    return this.charAt(0).toLowerCase() + this.slice(1)
}

String.prototype.ToClassMemberName = function() {
    return this.split('_').filter(i => i).map(i => i.ToCapitalizeCase()).join("");
}

String.prototype.UpperCaseToHumanName = function () {
    return this.replace(/([A-Z]+)/g, " $1").replace(/^,/, "").replace(/^\s*/g,"").replace(/\s*$/g,"");
}

String.prototype.ParentNamespace = function (depth)
{
    return this.split('.').slice(0, -depth).join(".");
}

Object.prototype.ClassMemberName = function ()
{
    return this.classMemberName || this.name.toString().ToClassMemberName();
}

Object.prototype.VariableName = function ()
{
    return this.variableName || this.name.ToVariableName();
}

Object.prototype.ViewModelName = function ()
{
    return this.viewModleName || this.name.ToClassMemberName() + "ViewModel";
}

const fsCustom = require('./fsCustom');
async function readDatabaseInfo(sqliteFilePath, options)
{
    const sequelize = new Sequelize('database', null, null, {
        dialect: 'sqlite',
        storage: sqliteFilePath, // or ':memory:'
        dialectOptions: {
        mode: SQLite.OPEN_READONLY,
        },
    });

    /* query object information */
    const tables =  (await sequelize.getQueryInterface().showAllSchemas())
        .filter(table => !options.table || options.table.findIndex(name => name === table.name) >= 0);

    await Promise.all(tables.map( async(table) => {
        const describe = await sequelize.getQueryInterface().describeTable(table.name);
        

        if (table.name[table.name.length - 1] === 's') {
            table.codeName = table.name.ToCapitalizeCase();
        } else {
            table.codeName = table.name.ToCapitalizeCase() + 's';
        }

        table.entity = {
            'name': table.codeName.slice(0, -1),
        }

        table.entityName = table.codeName.slice(0, -1);
        table.indexes = await sequelize.getQueryInterface().showIndex(table.name);
        table.fields = []; 
        // table.fieldNames = [];
        for(const field of Object.keys(describe)) {
            const f = describe[field];
            f.name = field;
            f.destLangType = f.allowNull && kSqliteType_To_CStype[f.type] !== "string" ? `${kSqliteType_To_CStype[f.type]}?` : kSqliteType_To_CStype[f.type];
            f.isReadOnly = false;
            f.humanReadableName = f.ClassMemberName().UpperCaseToHumanName()
            f.isMapped = true;
            f.isVisible = !f.destLangType.includes("byte");
            table.fields.push(f);
        }

        table.primaryKeysOrUniqueIndex = table.fields.find(f => f.isPrimary) ? table.fields.filter(f => f.isPrimary) : table.indexes.find(f => f.unique).fields.map(f => table.fields.find(ff => ff.name  == f.attribute));
        return table;
    }));
    const databaseContext =     {
        'name': path.basename(sqliteFilePath).replace(/ /g, '').replace(/\..*$/, ''), // + "Db", 
        'tables': tables, 
        'source': slash(sqliteFilePath),
        'type': 'Database'
    }    
    return databaseContext;
}


const { stringify } = require('csv-stringify/sync');
const internal = require('stream');
async function __main__ () {
    const { Command } = require('commander');
    const program = new Command();
    program
        .name('generate database to entity framework c#, an extend of dotnet ef dbcontext scaffold')
        .version('0.1.0')
        .description('Split a string into substrings and display as an array')
        .argument('<connection>', 'path/connection to datasource or exported JSON file')
        .argument('<template>', 'template folder/file path')
        .option('-o, --output-dir <PATH>', 'The directory to put files in. Paths are relative to the project directory.')
        .option('-p, --project-directory <PROJECT_DIR>', 'The directory of project.')
        .option('--project-name <PROJECT_NAME>', 'The name of project.')
        .option('-t, --table [TABLE_NAME...]', 'The directory to put files in. Paths are relative to the project directory.')
        .option('-n, --namespace [NAMESPACE...]', 'The namespace to use. Matches the directory by default.')
        .option('--export-json [JSON_FILE]', 'Export database to JSON file.')
        .option('--import-json [JSON_FILE]', 'User database information from JSON file.')
        .option('--import-js [JS_FILE]', 'Import project information from JS file.')
        .option('--context-namespace [NAMESPACE...]', 'The namespace to use. Matches the directory by default.')
        .option('--parent-namespace [NAMESPACE...]', 'The parent namespace to use.')
        .option('--skip', 'Skip generating code.')
        .option('--force', 'Overwrite existing files.')
        .option('--merge', 'Merge to current json file')
        .option('--overwrite', 'Merge to current json file')
        .parse(process.argv);

    const options = program.opts();
    const sqliteFilePath = program.args[0];
    const templatePath = program.args[1];

    if (options.importJson)
    {
        databaseContext = JSON.parse(fs.readFileSync(sqliteFilePath, 'utf-8'));
    }
    else if (options.importJs)
    {
        databaseContext = require(sqliteFilePath);
    }
    else
    {
        databaseContext = [(await readDatabaseInfo(sqliteFilePath, options))]
    }

    console.dir(databaseContext, {depth: null});
    if (options.exportJson) {
        if (options.merge && fs.existsSync(options.exportJson))
        {
            const old = JSON.parse(fs.readFileSync(options.exportJson, 'utf-8'));
            for (const inOld of old)
            {
                const index = databaseContext.findIndex(inNew => inNew.name === inOld.name);
                if (index === -1) databaseContext.push(inOld);
            }
        }
        fs.writeFileSync(options.exportJson, JSON.stringify(databaseContext, null, 2));
        for (const database of databaseContext)
        {
            for (const table of database.tables)
            {
                fs.writeFileSync(`${table.name}Fields.csv`, stringify(table.fields, {header: true, cast: {boolean: (f) => `${f}`}}));
            }
        }
    }

    if (options.skip)
    {
        return 0;
    }

    const projectTemplate = new Template(templatePath);
    projectTemplate.load();
    projectTemplate.generate(databaseContext, options);

    // use dot not
    // const spawnSync = require('child_process').spawnSync;
    // const dotnetefArgs = [
    //     'dbcontext',
    //     'scaffold',
    //     `Data Source=${sqliteFilePath}`,
    //     "Microsoft.EntityFrameworkCore.Sqlite",
    //     "--verbose", "--force",
    //     "--no-onconfiguring",
    //     "--no-build",
    //     "--data-annotations",
    //     (options.table || []).map(t => `--table=${t}`),
    //     `--output-dir=dotnet/${databaseContext.name}/Models`,
    //     `--namespace=${options.namespace || [options.projectName, 'Database', databaseContext.name, "Models"].filter(e => e).join(".")}`,
    //     `--context-dir=dotnet/${databaseContext.name}/Repository/Sql`,
    //     `--context-namespace=${options.contextNamespace || [options.projectName, 'Database', databaseContext.name, "Repository", 'Sql'].filter(e => e).join(".")}`,
    //     `--project=${options.projectDirectory || "."}`
    // ].flat();

    // console.log(dotnetefArgs);
    // const dotnetef = spawnSync('dotnet-ef', dotnetefArgs);
    // console.log(dotnetef.stdout.toString());
    // console.log(dotnetef.stderr);
}
__main__()
