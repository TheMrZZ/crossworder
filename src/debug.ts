const DEBUG_MODE = false;

const debug = DEBUG_MODE ? console : Object.assign({}, console, {
    log: () => {
    },
    table: () => {
    },
    time: () => {
    },
    timeEnd: () => {
    }
});

export default debug;