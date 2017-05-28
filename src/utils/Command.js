const STATUS = require('../const/status');
const cp = require('child_process');

module.exports = class {
    constructor(name, comment) {
        this.name = name || '';
        this.comment = comment || '';
        this.status = STATUS.PROCESS;
        this.output = '';
        this.endTime = null;
    }

    launch() {
        //const process = this.process = cp.exec(this.name);//spawn('ls', ['-lh', '/usr']);

        const process = this.process = cp.exec(this.name, (error, stdout, stderr) => {
            // if (error) {
            //     //console.error(`exec error: ${error}`);
            //     this.output += error;
            //     this.status = STATUS.ERROR;
            //     return;
            // }
            if(stdout) {
                this.output = stdout;
                this.status = STATUS.COMPLETE;
            }
            if(stderr) {
                this.output = stderr;
                this.status = STATUS.ERROR;
            }
            //console.log(`stdout: ${stdout}`);
            //console.log(`stderr: ${stderr}`);
        });
        process.stdout.on('data', (data) => {
            this.output += data;
            //console.log(`stdout: ${data}`);
        });

        process.stderr.on('data', (data) => {
            this.output += data;
            this.status = STATUS.ERROR;
            //console.log(`stderr: ${data}`);
        });

        process.on('close', (code) => {
            if(this.status === STATUS.PROCESS) this.status = STATUS.COMPLETE;
            this.endTime = new Date(Date.now());
            //console.log(`child process exited with code ${code}`);
        });
    }

    kill() {
    }

    get() {
        return {
            name: this.name,
            comment: this.comment,
            status: this.status,
            output: this.output,
            endTime: this.endTime,
            updateTime: new Date(Date.now())
        }
    }
};