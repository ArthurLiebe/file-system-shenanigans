const fs = require('fs');
const path = require('path');

async function createFileWithMessage(message) {
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // yyyy-mm-dd
    const timeString = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // hh-mm-ss

    const dirPath = path.join(__dirname, dateString);
    const filePath = path.join(dirPath, `${timeString}.txt`);

    try {
        await fs.promises.mkdir(dirPath, { recursive: true });

        const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);

        if (fileExists) {
            await fs.promises.appendFile(filePath, message + '\n');
        } else {
            await fs.promises.writeFile(filePath, message + '\n');
        }

        console.log(`Message written to ${filePath}`);
    } catch (err) {
        console.error('Error creating file:', err);
    }
}

async function deleteFileByName(filePath) {
    try {
        await fs.promises.access(filePath);
        await fs.promises.unlink(filePath);
        console.log(`File ${filePath} deleted successfully.`);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`File ${filePath} does not exist.`);
        } else {
            console.error('Error deleting file:', err);
        }
    }
}

if (process.argv[2] === 'create' && process.argv[3]) {
    createFileWithMessage(process.argv[3]);
} else if (process.argv[2] === 'delete' && process.argv[3]) {
    deleteFileByName(process.argv[3]);
}

module.exports = { createFileWithMessage, deleteFileByName };


// node index.js create "Hello there"
// node index.js delete ./yyyy-mm-dd/hh-mm-ss.txt
