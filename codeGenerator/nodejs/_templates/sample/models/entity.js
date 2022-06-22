const fs = require('fs');
const path = require('path');
const outFilePath = `${process.env.OUTPUT_DIR || "."}/generated/models/${table.codeName}Entity.js`;
fs.mkdirSync(path.dirname(outFilePath), {recursive: true});
fs.writeFileSync(outFilePath,
`class ${table.codeName}Entity {
    constructor(${table.fieldNames.join(", ")}) {
        ${table.fieldNames.map(name => `this.${name}_ = ${name};`).join("\n        ")}
    }

    ${
        table.fieldNames.map(name => {
            return `get ${name}() { return this.${name}_; }`
        }).join("\n    ")
    }

    ${
        table.fieldNames.map(name => {
            return `set ${name}(value) { this.${name}_ = value; }`
        }).join("\n    ")
    }

    equals(other) {
        return ${
            table.fieldNames.map(name => {
                return `other.${name} === this.${name}`
            }).join('\n            && ')
        };
    }
    
    clone() {
        return new ${table.codeName}Entity(${table.fieldNames.map(name => `${name}=this.${name}_`).join(", ")});
    }
}`);