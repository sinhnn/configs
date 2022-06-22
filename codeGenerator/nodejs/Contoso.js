const fs = require('fs');
const path = require('path');
const slash = require('slash');
const Template = require('./template');

const { Sequelize } = require('sequelize');
const SQLite = require('sqlite3');
const sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: "C:/Users/sinhnn/AppData/Local/Google/Chrome/User Data/Default/Network/Cookies", // or ':memory:'
    dialectOptions: {
      // Your sqlite3 options here
      // for instance, this is how you can configure the database opening mode:
      mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
    },
});

const kSqliteType_To_CStype = {
    'TEXT': 'string',
    'LONGVARCHAR': 'string',
    'BLOB': 'byte[]',
    'INTEGER': 'int', // long
    'FLOAT': 'double',
    'DOUBLE': 'double'
}

String.prototype.ToCapitalizeCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
const fsCustom = require('./fsCustom');
async function __main__ () {
    /* query object information */
    const tables =  await sequelize.getQueryInterface().showAllSchemas();
    // remove ending 's'
    await Promise.all( tables.map( async(table) => {
        const describe = await sequelize.getQueryInterface().describeTable(table.name);

        if (table.name[table.name.length - 1] === 's') {
            table.codeName = table.name.ToCapitalizeCase();
        } else {
            table.codeName = table.name.ToCapitalizeCase() + 's';
        }
        table.modelName = table.codeName.slice(0, -1);

        console.log(table.name, '=>', table.codeName, table.modelName);
        table.fields = []; 
        table.fieldNames = [];
        for(const field of Object.keys(describe)) {
            const f = describe[field];
            f.Name = field;
            f.destLangType = kSqliteType_To_CStype[f.type];
            table.fieldNames.push(field); // as shortcut path in templates
            table.fields.push(f);
        }
        table.primaryFieldName = (table.fields.find(field_ => field_.primaryKey === true) || {}).Name;
        console.log(table);
        return table;
    }));

    const projectTemplate = new Template("./_templates/contoso", "cs");
    projectTemplate.load();
    projectTemplate.generate("generated/Consoto", tables);

}
__main__();
