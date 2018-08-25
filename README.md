# sensord

Export DS18B20 1-wire temperature sensors via HTTP

## Getting Started

Checkout this repository, npm install, run main.js

### Prerequisites

If you plan to use a STM32F030 based controller you'll need to install the following packages under linux in order to access USB HID devices with nodejs.

```
apt-get install libudev-dev libusb-1.0-0-dev
```

## Supported Devices

### Linux 1-wire Kernel Module

Tested with a Raspberry Pi. For more information have a look at https://de.pinout.xyz/pinout/1_wire

### STM32F030 based controller

The STM32F030 controller series are ARM® Cortex® -M0 microcontrollers and are available with embedded USB device controllers.

They are an easy way to connect to the 1-wire bus via USB.

The complete device can be bought at https://www.led-genial.de/USB-Temperatur-Sensor-Tester-fuer-DS18B20-Rev-C

You can find the chip firmware at https://github.com/hashland/tempsensor-STM32F030

## Output

All available sensor data will be exported via HTTP on port 3333. Example:

```
[{"id":"28ff221e50170486","value":25.6},{"id":"28ff79d1501704c0","value":26.3}]
```

`id` is the unique 64 bit serial from the DS18B20 sensor.

`value` holds the current temperature in celsius.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
