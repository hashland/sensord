const
    Koa = require('koa'),
    app = new Koa(),
    { OneWire } = require('./types/Onewire'),
    { STM32F030 } = require('./types/STM32F030');

const oneWire = new OneWire(1),
    stm32f030 = new STM32F030();

let sensors = [];

[oneWire, stm32f030].forEach((sensor) => {

    sensor.probe().then(() => {
        sensors.push(sensor);
        console.log('Registered ' + sensor.name);

    }).catch((e) => {});

});

app.use(async (ctx, next) => {
    ctx.body = await Promise.all(
        sensors.map((s) => s.getValues())

    ).then((arrayOfArrays) => {
         return [].concat.apply([], arrayOfArrays);
     });
});

app.listen(3333);
