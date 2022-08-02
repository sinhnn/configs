`// Generated on ${new Date()}

using ${context.namespace.ParentNamespace(1)}.Models;
namespace ${context.namespace}
{
    /// <summary>
    /// Defines methods for interacting with the app backend.
    /// </summary>
    public partial interface I${database.name}Repository
    {
        ${ database.tables.map(table => `
        /// <summary>
        /// Returns all ${table.codeName}. 
        /// </summary>
        I${table.entityName}Repository ${table.codeName} { get; }`).join('')
        }
    }
}
`