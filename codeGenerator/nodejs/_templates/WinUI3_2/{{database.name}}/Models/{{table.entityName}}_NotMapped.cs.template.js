`
// Generated on ${new Date()}
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ${context.namespace} {
    public partial class ${table.entityName}
    {
        ${table.fields.findIndex(f => f.classMemberName === "Id") >= 0 ? "" : `
        /// <summary>
        /// Generated unique Id in runtime.
        /// </summary>
        [NotMapped]
        public Guid Id { get; set; } = Guid.NewGuid();`}
        ${table.fields.filter(f => f.IsNotMapped === true).map(f => `
        [NotMapped]
        public ${f.destLangType} ${f.classMemberName} { get; set; }
        `).join("\n")}
    }
}`