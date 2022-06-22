// const fs = require('fs');
// const path = require('path');

for (const table of tables) {
    const outFilePath = `${generatedFileConfig.outDirPath}/${table.modelName}.cs`;
    fsCustom.writeFileSync(outFilePath,
`
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Models {
    ${
        [
            `Table("${table.name}")`,
            table.primaryKey ? null :  "Keyless",
        ].filter(e=> e).map(e => "[" + e + "]").join("\n    ")
    }
    public class ${table.modelName} : DbObject, IEquatable<${table.modelName}> {
        ${table.fields.map(field => `
        public ${field.destLangType} ${field.Name} { get; set; }`).join("")
        }

        bool Equals(${table.modelName} other) {
            return ${
                table.fieldNames.map(name => `
                other.${name} == this.${name}`).join(' &&')
            };
        }
    }
}
`
    );
}
