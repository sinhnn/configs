`// Generated on ${new Date()}

using ${context.namespace.ParentNamespace(2)}.Models;
using Microsoft.EntityFrameworkCore;

namespace ${context.namespace}
{
    /// <summary>
    /// Entity Framework Core DbContext for ${database.name}.
    /// </summary>
    public partial class ${database.name}Context : DbContext
    {
        /// <summary>
        /// Creates a new ${database.name} DbContext.
        /// </summary>
        public ${database.name}Context(DbContextOptions<${database.name}Context> options) : base(options)
        { }

        ${database.tables.map(table => `
        /// <summary>
        /// Gets the ${table.codeName.ToVariableName()} DbSet.
        /// </summary>
        public DbSet<${table.entityName}> ${table.codeName} { get; set; }`).join("")}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ${tables.fields.filter(table => table.compositeKey).map(table => `
            modelBuilder.Entity<${table.entityName}>()
                .HasKey(item => new { ${table.fields.filter(f => f.primaryKey == true).map(f => `item.${f.classMemberName}`).join(", ") } });`).join("")
            }
            ${function (a) {
                function onTable(table) {
                    var primaryKeys = table.fields.filter(f => f.primaryKey === true);
                    if (primaryKeys.length > 1)
                    {
                        return `
                        modelBuilder.Entity<${table.entityName}>()
                            .HasKey(item => new { ${primarykeys.map(f => `item.${f.classMemberName}`).join(", ") } });`;
                    }
                    else
                    {
                        return null;
                    }
                }

                tables.map(table => onTable(table)).filter(d => d).join("\n");
            } ()}
        } 
    }
}
`