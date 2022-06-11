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

    for (const table of tables) {
        const text = eval(fs.readFileSync('./_templates/entity.js', 'utf-8'));
        fs.mkdirSync(`generated/models`, {recursive: true, exist: true})
        fs.writeFileSync(`generated/models/${table.name}.js`, text);
    }
}


__main__();
