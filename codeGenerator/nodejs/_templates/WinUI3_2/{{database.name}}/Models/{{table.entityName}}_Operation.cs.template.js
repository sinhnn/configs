`
// Generated on ${new Date()}
/// <summary>
/// List of basic operations of ${table.entityName}
/// </summary>


using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ${context.namespace} {
    public partial class ${table.entityName} : IEquatable<${table.entityName}>
    {
        /// <summary>
        /// Fast check equal by primary keys
        /// </summary>
        bool IEquatable<${table.entityName}>.Equals(${table.entityName} other)
        {
            return ${table.fields.map(f => `other.${f.classMemberName} == this.${f.classMemberName}`).join('\n                && ')};
        }

        /// <summary>
        /// ${table.entityName} to string
        /// </summary>
        public bool Equals(${table.entityName} other)
        {
            return ${table.fields.map(f => `other.${f.classMemberName} == this.${f.classMemberName}`).join('\n                && ')};
        }

        /// <summary>
        /// Check two objects are the same, by given identify fields.
        /// </summary>
        public bool IsSameIdentify(${table.entityName} other)
        {
            return ${table.fields.find(f => f.primaryKey)  ? `other.${table.fields.find(f => f.primaryKey).classMemberName} == this.${table.fields.find(f => f.primaryKey).classMemberName}`  : table.compositeKey.map(name => `other.${table.fields.find(f => f.Name === name).classMemberName} == this.${table.fields.find(f => f.Name === name).classMemberName}`).join('\n                && ')};
        }       

        /// <summary>
        /// ${table.entityName} to string
        /// </summary>
        public override string ToString()
        {
            return ${
                table.fields.map(field => {
                    return field.destLangType === "byte[]" ? '"byte[]"' : `this.${field.classMemberName}`;
                }).join("\n                + \" \" + ")
            };
        }

        /// <summary>
        /// ${table.entityName} to string
        /// </summary>
        public string ToString(string separator)
        {
            return ${
                table.fields.map(field => {
                    return field.destLangType === "byte[]" ? '"byte[]"' : `this.${field.classMemberName}`;
                }).join("\n                + separator + ")
            };
        }

        /// <summary>
        /// Clone to new  ${table.entityName}
        /// </summary>
        public ${table.entityName} Clone()
        {
            ${table.entityName} newEntity = new ${table.entityName}();
            ${table.fields.map(field => {
                return `newEntity.${field.classMemberName} = this.${field.classMemberName};`
            }).join("\n            ")}
            return newEntity;            
        }

        /// <summary>
        /// Assign all members in src entity to corresponding memeer in this entity.
        /// </summary>
        public void CopyFrom(${table.entityName} srcEntity)
        {
            ${table.fields.map(field => {
                return `this.${field.classMemberName} = srcEntity.${field.classMemberName};`
            }).join("\n            ")}
        }
    }
}`