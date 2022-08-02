const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function readCsv (filePath)
{
    return parse(fs.readFileSync(filePath), {
        columns: true,
        skip_empty_lines: true,
        auto_cast: true,
        cast: true,
        trim: true
    });
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath));
}

function include (filePath)
{
    switch (path.extname(filePath)) {
        case ".csv":
            return readCsv(filePath);
            break;
        case ".json":
            return readJson(filePath);
            break;
        case ".js":
            return require(filePath);
            break;
        default:
            throw new Error("unsupported file format " + filePath);
            break;
    }
}

module.exports = {
    "include": include
}