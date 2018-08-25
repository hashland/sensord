const
    HID = require('node-hid');

class STM32F030 {
    constructor() {
        this.name = "STM32F030 USB HID";
    }

    findHIDDevice() {
        const devices = HID.devices();

        return devices.find((device) => {
            return device.vendorId === 5824 && device.productId === 1152;
        });
    }

    async probe() {
        const hidDevice = this.findHIDDevice();
        if(!hidDevice)
            throw 'Could not find HID device';

        return true;
    }

    getValues() {
        return new Promise((resolve, reject) => {
            let deviceInfo = this.findHIDDevice();

            if (!deviceInfo) {
                reject("Could not find RawHID device in device list");
            }

            const device = new HID.HID(deviceInfo.path);

            let res = [];

            device.on('data', (data) => {
                // 02 02 01 00 2d 01 00 00 28ffd1250117053c

                var sensorCount = data.readUIntBE(0, 1),
                    sensorId = data.readUIntBE(1, 1),
                    power = data.readUIntBE(2, 1),
                    value = data.readIntLE(4, 2) / 10,
                    serial = data.toString('hex', 8, 16);

                const entry = res.filter((r) => r.id === serial);

                if(entry.length == 0) {
                    res.push({
                        id: serial,
                        value: value
                    })
                }

                if(res.length == sensorCount) {
                    device.close();
                    resolve(res);
                }

            });

            device.on('error', (err) => {
                device.close();
                reject(err);
            });
        });
    }
}

exports.STM32F030 = STM32F030;
