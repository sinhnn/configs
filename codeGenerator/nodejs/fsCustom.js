const fs = require('fs');
const path = require('path');

module.exports = {
    writeFileSync : function (filePath, text) {
        let commentCharacter = '//';
        const fileExtension = filePath.split('.').pop();
        switch (fileExtension) {
            case "py":
                commentCharacter = "#";
                break;
            default:
                break;
        }
        const header = `${commentCharacter} Generated ${new Date()}`;
        fs.writeFileSync(filePath, [header, text].join("\n"));
    }
}