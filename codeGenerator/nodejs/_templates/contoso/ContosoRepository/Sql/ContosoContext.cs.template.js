fs.writeFileSync(generatedFileConfig.outFilePath,
`
// Generated code ${new Date()}

using Contoso.Models;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Repository.Sql
{
    /// <summary>
    /// Entity Framework Core DbContext for Contoso.
    /// </summary>
    public class Context : DbContext
    {
        /// <summary>
        /// Creates a new Contoso DbContext.
        /// </summary>
        public ContosoContext(DbContextOptions<ContosoContext> options) : base(options)
        { }

        ${tables.map(table => `
        /// <summary>
        /// Gets the ${table.codeName.toLowerCase()} DbSet.
        /// </summary>
        public DbSet<${table.modelName}> ${table.codeName} { get; set; }
        `).join("")}
    }
}
`
);