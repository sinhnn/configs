`
// Generated on ${new Date()}
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ${context.namespace} {
    ${
        [
            `Table("${table.name}")`,
            table.fields.find(e => e.primaryKey === true ) ? null :  "Keyless",
        ].filter(e=> e).map(e => "[" + e + "]").join("\n    ")
    }
    public partial class ${table.entityName}
    {
        ${table.fields.filter(f => f.IsNotMapped !== true).map(field => `${
            [
                `Column("${field.Name}")`,
                field.allowNull === false ? "Required" :  null,
                field.primaryKey ? "Key": null,
            ].filter(e => e).map(e => "[" + e + "]").join("\n        ")
        }
        public ${field.destLangType} ${field.classMemberName} { get; set; }`).join("\n\n        ")
        }
    }
}
`