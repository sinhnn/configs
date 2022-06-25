fsCustom.writeFileSync(generatedFileConfig.outFilePath,
`
using Contoso.Models;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Repository.Sql
{
    /// <summary>
    /// Contains methods for interacting with the app backend using 
    /// SQL via Entity Framework Core 6.0. 
    /// </summary>
    public class SqlContosoRepository : IContosoRepository
    {
        private readonly DbContextOptions<ContosoContext> _dbOptions; 

        public SqlContosoRepository(DbContextOptionsBuilder<ContosoContext> 
            dbOptionsBuilder)
        {
            _dbOptions = dbOptionsBuilder.Options;
            using (var db = new ContosoContext(_dbOptions))
            {
                db.Database.EnsureCreated(); 
            }
        }
        ${tables.map(table => {
            return `
        public I${table.modelName}Repository ${table.codeName} => new Sql${table.modelName}Repository(new ContosoContext(_dbOptions));`;
        }).join("\n")}
    }
}
`
);