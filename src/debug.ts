const DEBUG_MODE = false;

const debug = DEBUG_MODE ? console : Object.assign({}, console, {
    log: () => {
    },
    table: () => {
    }
});

export default debug;