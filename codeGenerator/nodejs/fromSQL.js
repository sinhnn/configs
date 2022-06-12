const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const SQLite = require('sqlite3');
const sequelize = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'C:/Users/sinhnn/source/repos/Windows-appsample-customers-orders-database/ContosoApp/Assets/Contoso.db', // or ':memory:'
    dialectOptions: {
      // Your sqlite3 options here
      // for instance, this is how you can configure the database opening mode:
      mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
    },
});


async function __main__ () {
    /* query object information */
    const tables =  await sequelize.getQueryInterface().showAllSchemas();
    await Promise.all( tables.map( async(table) => {
        const describe = await sequelize.getQueryInterface().describeTable(table.name);
        table.fields = []; 
        table.fieldNames = [];
        for(const field of Object.keys(describe)) {
            const f = describe[field];
            f.Name = field;
            table.fieldNames.push(field); // as shortcut path in templates
            table.fields.push(f);
        }
        return table;
    }));

    // process.env.OUTPUT_DIR = "sinhnn";
    // const templatePaths = [];
    process.env.TEMPLATE_DIR = process.env.TEMPLATE_DIR ||  "./_templates";
    function scan_(dir, filter, dest) {
        for (const file_ of fs.readdirSync(dir, { withFileTypes: true })) {
            if (file_.isFile() === true) {
                if (filter(file_)) {
                    dest.push(path.join(dir, file_.name));
                } else {
                    console.log(dir, file_, 'is invalid');
                }
            }
            if (file_.isDirectory() === true) {
                console.log('scanning recursive', file_.name);
                scan_(path.join(dir, file_.name), filter, dest);
            }
        }
        return dest;
    }
    
    function scan(dir, filter) {
        const dest = [];
        scan_(dir, filter, dest);
        return dest;
    }

    const templatePaths = scan(process.env.TEMPLATE_DIR, (f) => f.name.match(/\.js$/) !== null);
    /* working on the template */
    for (const table of tables) {
        for (const template of templatePaths)  {
            process.env.RELATIVE_TEMPLATE_FILE = path.relative(process.env.TEMPLATE_DIR, template);
            eval(fs.readFileSync(template, 'utf-8'));
        }
    }
}


__main__();
