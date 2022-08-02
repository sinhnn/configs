`// Generated on ${new Date()}

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using ${context.namespace.ParentNamespace(2)}.Models;

namespace ${context.namespace}
{
    /// <summary>
    /// Contains methods for interacting with the ${table.codeName} backend using 
    /// SQL via Entity Framework Core 2.0.
    /// </summary>
    public partial class Sql${table.entityName}Repository : I${table.entityName}Repository
    {
        private readonly ${database.name}Context _db; 

        public Sql${table.entityName}Repository(${database.name}Context db) => _db = db;

        public List<${table.entityName}> Get() 
        {
            return _db.${table.codeName}.AsNoTracking().ToList();
        }

        /// <summary>
        /// Returns all ${table.entityName}s. 
        /// </summary>
        public async Task<IEnumerable<${table.entityName}>> GetAsync() {
            return await _db.${table.codeName}.AsNoTracking().ToListAsync();
        }
        ${table.fields.filter(f => f.primaryKey === true).map(f => `
        /// <summary>
        /// Returns all ${table.entityName}s by primary key ${f.classMemberName}. 
        /// </summary>
        public ${table.entityName} GetBy${f.classMemberName}(${f.destLangType} ${f.classMemberName}) {
            return _db.${table.codeName}
                .AsNoTracking()
                .FirstOrDefault(${table.entityName.ToVariableName()} => ${table.entityName.ToVariableName()}.${f.classMemberName} == ${f.classMemberName});
        }

        /// <summary>
        /// Returns all ${table.entityName}s by primary key ${f.classMemberName}. 
        /// </summary>
        public async Task<${table.entityName}> GetBy${f.classMemberName}Async (${f.destLangType} ${f.classMemberName}) {
            return await _db.${table.codeName}
                .AsNoTracking()
                .FirstOrDefaultAsync(${table.entityName.ToVariableName()} => ${table.entityName.ToVariableName()}.${f.classMemberName} == ${f.classMemberName});
        }        

        /// <summary>
        /// Delete ${table.entityName}s by primary key ${f.classMemberName}. 
        /// </summary>
        public async void DeleteBy${f.classMemberName}Async (${f.destLangType} ${f.classMemberName}) {
            var match = await _db.${table.codeName}.FirstOrDefaultAsync(${table.entityName} => ${table.entityName}.${f.classMemberName} == ${f.classMemberName});
            if (match != null)
            {
                _db.${table.codeName}.Remove(match);
            }
            await _db.SaveChangesAsync();
        }`).join("")}
       
        /// <summary>
        /// Returns all ${table.entityName}s matches the string. 
        /// </summary>
        public async Task<IEnumerable<${table.entityName}>> SearchAsync(string searchString)
        {
            string[] parameters = searchString.Split(' ');
            return await _db.${table.codeName}
                .Where(${table.entityName.ToVariableName()} => parameters
                    .Any(parameter => 
                            ${table.fields.filter(f => f.IsNotMapped !== true ).map(f => {
                                let t = f.destLangType === "string"  ? "" : ".ToString()";
                                return `${table.entityName.ToVariableName()}.${f.classMemberName}${t}.Contains(parameter)`
                            }).join("\n                            || ")}
                    )
                )
                .OrderByDescending(${table.entityName.ToVariableName()} => parameters
                    .Count(parameter => 
                            ${table.fields.filter(f => f.IsNotMapped !== true ).map(f => {
                                let t = f.destLangType === "string"  ? "" : ".ToString()";
                                return `${table.entityName.ToVariableName()}.${f.classMemberName}${t}.Contains(parameter)`
                            }).join("\n                            || ")}
                    )
                )
                .AsNoTracking()
                .ToListAsync();
        }

        ${table.fields.filter(f => f.destLangType === "string" && f.IsNotMapped !== true).map(f => `
        /// <summary>
        /// Returns all ${table.entityName}s matches the string by ${f.classMemberName}. 
        /// </summary>
        public async Task<IEnumerable<${table.entityName}>> SearchBy${f.classMemberName}Async(string ${f.Name.ToVariableName()})
        {
            return await _db.${table.codeName}
                .Where(${table.entityName.ToVariableName()} => ${table.entityName.ToVariableName()}.${f.classMemberName}.Contains(${f.Name.ToVariableName()}))
                .OrderByDescending(${table.entityName.ToVariableName()} => ${table.entityName.ToVariableName()}.${f.classMemberName})
                .AsNoTracking()
                .ToListAsync();
        }`).join("")}
        
        public async Task<${table.entityName}> UpsertAsync(${table.entityName} ${table.entityName.ToVariableName()})
        {
            ${function a() {
                let s =  table.fields.filter(f => f.primaryKey);
                // if (s.length === 0) {
                //     if (table.identifyByFields) {
                //         s = table.identifyByFields.map(name => table.fields.find(f => f.Name === name));
                //     }
                // }
                // s = s.length === 0 ? table.fields.filter(f => f.IsNotMapped !== true) : s;
                s = s.length === 0 ? table.compositeKey.map(f => table.fields.find(field => field.Name === f)) : s;
                let n = table.entityName.ToVariableName();
                return  `var existing = await _db.${table.codeName}.FirstOrDefaultAsync(${n}InDB => 
                    ${s.map(f => `${n}InDB.${f.classMemberName} == ${n}.${f.classMemberName}`).join("\n                && ")}
            );
            if (null == existing)
            {
                _db.${table.codeName}.Add(${n});
            }
            else
            {
                _db.Entry(existing).CurrentValues.SetValues(${n});
            }
            await _db.SaveChangesAsync();
            return ${n};`
            } ()
            }
        }

        public async Task Remove(${table.entityName} item)
        {
            _db.Remove(item);
            await _db.SaveChangesAsync();
        }
    }
}
`