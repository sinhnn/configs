`class ${table.name}Entity {
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
        return new ${table.name}Entity(${table.fieldNames.map(name => `${name}=this.${name}_`).join(", ")});
    }
}`