
fsCustom.writeFileSync(generatedFileConfig.outFilePath,
`
using Contoso.Models;

namespace Contoso.Repository
{
    /// <summary>
    /// Defines methods for interacting with the app backend.
    /// </summary>
    public interface IContosoRepository
    {
        ${
            tables.map(table => {
                return `
        /// <summary>
        /// Returns all ${table.codeName}. 
        /// </summary>
        I${table.modelName}Repository ${table.codeName} { get; }
                `;
            }).join('')
        }
    }
}
`
);