const
    Koa = require('koa'),
    app = new Koa(),
    { OneWire } = require('./types/Onewire'),
    { STM32F030 } = require('./types/STM32F030');

let values = [];

const oneWire = new OneWire(1),
    stm32f030 = new STM32F030(),
    dataHandler = data => {
        const value = values.find(v => v.id == data.id);
        if(value) {
            value.value = data.value;
            value.last_updated_at = Date.now() / 1000 | 0;
        } else {
            values.push({
                id: data.id,
                value: data.value,
                last_updated_at: Date.now() / 1000 | 0
            })
        }
    };


[oneWire, stm32f030].forEach((sensor) => {

    sensor.probe().then(() => {
        console.log('Registered ' + sensor.name);
        sensor.on('data', dataHandler);
        sensor.start();

    }).catch((e) => {});

});

app.use(async (ctx, next) => {
    ctx.body = values;
});

app.listen(3333);
