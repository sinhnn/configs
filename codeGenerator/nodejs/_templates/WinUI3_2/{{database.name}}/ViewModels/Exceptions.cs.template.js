`
using System;

namespace ${context.namespace}
{
    ${tables.map(table => `
    /// <summary>
    /// Represents an exception that occurs when there's an error saving an ${table.entityName}.
    /// </summary>
    public partial class ${table.entityName}SavingException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the${table.entityName}SavingException class with a default error message.
        /// </summary>
        public ${table.entityName}SavingException() : base("Error saving an ${table.entityName}.")
        {
        }

        /// <summary>
        /// Initializes a new instance of the ${table.entityName}SavingException class with the specified error message.
        /// </summary>
        public ${table.entityName}SavingException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the ${table.entityName}SavingException class with 
        /// the specified error message and inner exception.
        /// </summary>
        public ${table.entityName}SavingException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

    /// <summary>
    /// Represents an exception that occurs when there's an error deleting an ${table.entityName}.
    /// </summary>
    public partial class ${table.entityName}DeletionException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the ${table.entityName}DeletionException class with a default error message.
        /// </summary>
        public ${table.entityName}DeletionException() : base("Error deleting an ${table.entityName}.")
        {
        }

        /// <summary>
        /// Initializes a new instance of the ${table.entityName}DeletionException class with the specified error message.
        /// </summary>
        public ${table.entityName}DeletionException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the${table.entityName}DeletionException class with 
        /// the specified error message and inner exception.
        /// </summary>
        public ${table.entityName}DeletionException(string message,
            Exception innerException) : base(message, innerException)
        {
        }
    }`
    ).join("")}
}`
