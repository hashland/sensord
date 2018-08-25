const
    fs = require('fs');

class OneWire {
    constructor(busMasterId = 1) {
        this.name = "Local 1-wire";
        this.busMasterId = busMasterId;
    }

    async probe() {
        const slaveIds = await this.getOnewireSlaveDeviceIds();
        if(!slaveIds || slaveIds.length === 0) {
            throw 'Could not find connected sensors';
        }

        return true;
    }


    async getValues() {
        const slaveDeviceIds = await this.getOnewireSlaveDeviceIds();
        const serials = await Promise.all(slaveDeviceIds.map((slaveDeviceId) => this.getSerial(slaveDeviceId)));
        const values = await Promise.all(slaveDeviceIds.map((slaveDeviceId) => this.getValue(slaveDeviceId)));

        let res = [];
        for(let i=0; i<slaveDeviceIds.length; i++) {
            res.push({id: serials[i], value: values[i]});
        }

        return res;
    }


    getOnewireSlaveDeviceIds() {
        return new Promise((resolve, reject) => {
            fs.readFile('/sys/bus/w1/devices/w1_bus_master' + this.busMasterId + '/w1_master_slaves', 'utf-8', (error, data) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(data.trim().split("\n"));
                }
            });
        });
    }

    getSerial(deviceId) {
        return new Promise((resolve, reject) => {
            fs.readFile('/sys/bus/w1/devices/' + deviceId + '/id', 'hex', (error, data) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }

    getValue(deviceId) {
        return new Promise((resolve, reject) => {
            fs.readFile('/sys/bus/w1/devices/' + deviceId + '/w1_slave', 'utf-8', (error, data) => {
                if(error) {
                    reject(error);
                } else {

                    if (data.indexOf('YES') > -1) {
                        const out = data.match(/t=([\-0-9]+)/),
                            temp = Math.round(parseInt(out[1], 10) / 100) / 10

                        resolve(temp);
                    } else {
                        reject('Could not get data for given sensor');
                    }
                }
            });
        });
    }
}

exports.OneWire = OneWire;
