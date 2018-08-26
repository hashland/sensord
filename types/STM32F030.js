const
    HID = require('node-hid'),
    EventEmitter = require('events');

class STM32F030 extends EventEmitter {
    constructor() {
        super();
        this.name = "STM32F030 USB HID";
        this.device = null;
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


    start() {
        let deviceInfo = this.findHIDDevice();

        if (!deviceInfo) {
            throw "Could not find RawHID device in device list";
        }

        this.device = new HID.HID(deviceInfo.path);

        this.device.on('data', data => {
            // 02 02 01 00 2d 01 00 00 28ffd1250117053c

            var sensorCount = data.readUIntBE(0, 1),
                sensorId = data.readUIntBE(1, 1),
                power = data.readUIntBE(2, 1),
                value = data.readIntLE(4, 2) / 10,
                serial = data.toString('hex', 8, 16);

            this.emit('data', {id: serial, value: value});
        });

        device.on('error', err => console.log(err));
    }

    stop() {
        this.device.close();
    }
}

exports.STM32F030 = STM32F030;
