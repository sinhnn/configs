`// Generated on ${new Date()}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using ${context.namespace.ParentNamespace(1)}.Models;
namespace ${context.namespace}
{
    /// <summary>
    /// Defines methods for interacting with the ${table.entityName}s backend.
    /// </summary>
    public partial interface I${table.entityName}Repository
    {

        /// <summary>
        /// Returns all ${table.entityName}s. 
        /// </summary>
        List<${table.entityName}> Get();

        /// <summary>
        /// Returns all ${table.entityName}s. 
        /// </summary>
        Task<IEnumerable<${table.entityName}>> GetAsync();

        /// <summary>
        /// Returns all ${table.entityName}s with a data field matching the start of the given string. 
        /// </summary>
        Task<IEnumerable<${table.entityName}>> SearchAsync(string search);
        ${table.fields.filter(f => f.primaryKey === true).map(f => `
        /// <summary>
        /// Returns all ${table.entityName}s by primary key ${f.classMemberName}. 
        /// </summary>
        ${table.entityName} GetBy${f.classMemberName}(${f.destLangType} ${f.variableName});
        Task<${table.entityName}> GetBy${f.classMemberName}Async(${f.destLangType} ${f.variableName});
        void DeleteBy${f.classMemberName}Async(${f.destLangType} ${f.variableName});`
        ).join("")}
        ${table.fields.filter(f => f.destLangType === "string").filter(e => e.IsNotMapped !== true).map(f => `
        /// <summary>
        /// Returns all ${table.entityName}s matches the string by ${f.classMemberName}. 
        /// </summary>
        Task<IEnumerable<${table.entityName}>> SearchBy${f.classMemberName.ToClassMemberName()}Async(string value);`).join("\n")}

        /// <summary>
        /// Adds a new ${table.entityName} if the ${table.entityName} does not exist, updates the 
        /// existing ${table.entityName} otherwise.
        /// </summary>
        Task<${table.entityName}> UpsertAsync(${table.entityName} ${table.entityName.ToVariableName()});    
    
    
        /// <summary>
        /// Adds a new ${table.entityName} if the ${table.entityName} does not exist, updates the 
        /// existing ${table.entityName} otherwise.
        /// </summary>
        Task Remove(${table.entityName} ${table.entityName.ToVariableName()});    
    
    }
}
`