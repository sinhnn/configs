for (const table of tables) {
    const outFilePath = `${generatedFileConfig.outDirPath}/Sql${table.modelName}Repository.cs`;
    fsCustom.writeFileSync(outFilePath,
`
using Contoso.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Contoso.Repository.Sql
{
    /// <summary>
    /// Contains methods for interacting with the ${table.codeName} backend using 
    /// SQL via Entity Framework Core 2.0.
    /// </summary>
    public class Sql${table.modelName}Repository : I${table.modelName}Repository
    {
        private readonly ContosoContext _db; 

        public Sql${table.modelName}Repository(ContosoContext db) => _db = db;

        public List<${table.modelName}> Get() =>
            _db.${table.codeName}
                .AsNoTracking()
                .ToList();

        public List<${table.modelName}> Get(Guid id) =>
            _db.${table.codeName}
                .AsNoTracking()
                .FirstOrDefaultAsync(${table.modelName.toLowerCase()} => ${table.modelName.toLowerCase()}.Id == id);

        public async Task<IEnumerable<${table.modelName}>> GetAsync() =>
            await _db.${table.codeName}
                .AsNoTracking()
                .ToListAsync();

        public async Task<${table.modelName}> GetAsync(Guid id) =>
            await _db.${table.codeName}
                .AsNoTracking()
                .FirstOrDefaultAsync(${table.modelName.toLowerCase()} => ${table.modelName.toLowerCase()}.Id == id);

        public async Task<IEnumerable<${table.modelName}>> GetAsync(string value)
        {
            string[] parameters = value.Split(' ');
            return await _db.${table.codeName}
                .Where(${table.modelName.toLowerCase()} => parameters
                    .Any(parameter => 
                            ${table.fields.map(f => {
                                let t = f.destLangType === "string"  ? "" : ".ToString()";
                                return `${table.modelName.toLowerCase()}.${f.Name}${t}.StartsWith(parameter)`
                            }).join(" ||\n                            ")}
                    )
                )
                .OrderByDescending(${table.modelName.toLowerCase()} => parameters
                    .Count(parameter => 
                            ${table.fields.map(f => {
                                let t = f.destLangType === "string"  ? "" : ".ToString()";
                                return `${table.modelName.toLowerCase()}.${f.Name}${t}.StartsWith(parameter)`
                            }).join(" ||\n                            ")}
                    )
                )
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<${table.modelName}> UpsertAsync(${table.modelName} ${table.modelName.toLowerCase()})
        {
            var existing = await _db.${table.codeName}.FirstOrDefaultAsync(_${table.modelName.toLowerCase()} => ${table.modelName.toLowerCase()}.Id == ${table.modelName.toLowerCase()}.Id);
            if (null == existing)
            {
                _db.${table.codeName}.Add(${table.modelName.toLowerCase()});
            }
            else
            {
                _db.Entry(existing).CurrentValues.SetValues(${table.modelName.toLowerCase()});
            }
            await _db.SaveChangesAsync();
            return ${table.modelName.toLowerCase()};
        }

        public async Task DeleteAsync(Guid ${table.modelName.toLowerCase()}Id)
        {
            var match = await _db.${table.codeName}.FirstOrDefaultAsync(_${table.modelName.toLowerCase()} => _${table.modelName.toLowerCase()}.Id == ${table.modelName.toLowerCase()}Id);
            if (match != null)
            {
                _db.${table.codeName}.Remove(match);
            }
            await _db.SaveChangesAsync();
        }
    }
}
`
    );
}