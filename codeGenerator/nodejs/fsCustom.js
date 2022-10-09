const fs = require('fs');
const path = require('path');

module.exports = {
    writeFileSync : function (filePath, text) {
        let startCommentCharacter = '// ';
        let endCommentCharacter = '';
        const fileExtension = filePath.split('.').pop();
        switch (fileExtension) {
            case "py":
                startCommentCharacter = "# ";
                break;
            case "xaml":
            case "csproj":
                startCommentCharacter = "<!-- "; 
                endCommentCharacter = " -->"; 
            default:
                break;
        }
        fs.mkdirSync(path.dirname(filePath), {recursive: true});
        const header = `${startCommentCharacter}Generated ${new Date()}${endCommentCharacter}`;
        fs.writeFileSync(filePath, [/*header, */text].join("\n"));
    },
    
    copyFile: function (src, dst) {
        fs.copyFile(src, dst, (err) => {
            if (err) throw err;
        });
    }
}