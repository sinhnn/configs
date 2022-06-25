fsCustom.writeFileSync(generatedFileConfig.outFilePath,
`
using System;

namespace Contoso.App.ViewModels
{
    ${tables.map(table => `
    /// <summary>
    /// Represents an exception that occurs when there's an error saving an ${table.modelName}.
    /// </summary>
    public class ${table.modelName}SavingException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the${table.modelName}SavingException class with a default error message.
        /// </summary>
        public ${table.modelName}SavingException() : base("Error saving an ${table.modelName}.")
        {
        }

        /// <summary>
        /// Initializes a new instance of the ${table.modelName}SavingException class with the specified error message.
        /// </summary>
        public ${table.modelName}SavingException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the ${table.modelName}SavingException class with 
        /// the specified error message and inner exception.
        /// </summary>
        public ${table.modelName}SavingException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

    /// <summary>
    /// Represents an exception that occurs when there's an error deleting an ${table.modelName}.
    /// </summary>
    public class ${table.modelName}DeletionException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the ${table.modelName}DeletionException class with a default error message.
        /// </summary>
        public ${table.modelName}DeletionException() : base("Error deleting an ${table.modelName}.")
        {
        }

        /// <summary>
        /// Initializes a new instance of the ${table.modelName}DeletionException class with the specified error message.
        /// </summary>
        public ${table.modelName}DeletionException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the${table.modelName}DeletionException class with 
        /// the specified error message and inner exception.
        /// </summary>
        public ${table.modelName}DeletionException(string message,
            Exception innerException) : base(message, innerException)
        {
        }
    }`
    ).join("")}
}`);
