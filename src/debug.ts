const DEBUG_MODE = true;

const debug = DEBUG_MODE ? console : Object.assign({}, console, {
    log: () => {
    },
    table: () => {
    }
});

export default debug;