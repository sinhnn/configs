`
// Generated on ${new Date()}
using ${context.namespace.ParentNamespace(2)}.Models;
using Microsoft.EntityFrameworkCore;

namespace ${context.namespace}
{
    /// <summary>
    /// Contains methods for interacting with the app backend using 
    /// SQL via Entity Framework Core 6.0. 
    /// </summary>
    public partial class Sql${database.name}Repository : I${database.name}Repository
    {
        private readonly DbContextOptions<${database.name}Context> _dbOptions; 

        public Sql${database.name}Repository(DbContextOptionsBuilder<${database.name}Context> dbOptionsBuilder)
        {
            _dbOptions = dbOptionsBuilder.Options;
            using (var db = new ${database.name}Context(_dbOptions))
            {
                db.Database.EnsureCreated(); 
            }
        }
        ${tables.map(table => `
        public I${table.entityName}Repository ${table.codeName} => new Sql${table.entityName}Repository(new ${database.name}Context(_dbOptions));`
        ).join("\n")}
    }
}
`
