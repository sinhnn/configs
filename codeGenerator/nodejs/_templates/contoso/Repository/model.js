// const fs = require('fs');
// const path = require('path');
// const rootPath =  `${process.env.OUTPUT_DIR || "/generated"}/ContosoRepository`;
// fs.mkdirSync(rootPath, {recursive: true});

for (const table of tables) {
    const outFilePath = `${generatedFileConfig.outDirPath}/I${table.modelName}Repository.cs`;
    fsCustom.writeFileSync(outFilePath,
`
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contoso.Models
{
    /// <summary>
    /// Defines methods for interacting with the ${table.modelName}s backend.
    /// </summary>
    public interface I${table.modelName}Repository
    {

        /// <summary>
        /// Returns all ${table.modelName}s. 
        /// </summary>
        List<${table.modelName}> Get();

        /// <summary>
        /// Returns all ${table.modelName}s. 
        /// </summary>
        ${table.modelName} Get(Guid id);

        /// <summary>
        /// Returns all ${table.modelName}s. 
        /// </summary>
        Task<IEnumerable<${table.modelName}>> GetAsync();

        /// <summary>
        /// Returns all ${table.modelName}s with a data field matching the start of the given string. 
        /// </summary>
        Task<IEnumerable<${table.modelName}>> GetAsync(string search);

        /// <summary>
        /// Returns the ${table.modelName} with the given id. 
        /// </summary>
        Task<${table.modelName}> GetAsync(Guid id);

        /// <summary>
        /// Adds a new ${table.modelName} if the ${table.modelName} does not exist, updates the 
        /// existing ${table.modelName} otherwise.
        /// </summary>
        Task<${table.modelName}> UpsertAsync(${table.modelName} ${table.modelName});

        /// <summary>
        /// Deletes a ${table.modelName}.
        /// </summary>
        Task DeleteAsync(Guid ${table.modelName}Id);
    }
}
`
    );
}

// fsCustom.writeFileSync(path.join(rootPath, 'IContosoRepository.cs'),
// `
// using Contoso.Models;

// namespace Contoso.Repository
// {
//     /// <summary>
//     /// Defines methods for interacting with the app backend.
//     /// </summary>
//     public interface IContosoRepository
//     {
//         ${
//             tables.map(table => {
//                 return `
//         /// <summary>
//         /// Returns all ${table.codeName}. 
//         /// </summary>
//         ICustomerRepository ${table.codeName} { get; }
//                 `;
//             }).join('')
//         }
//     }
// }
// `
// );