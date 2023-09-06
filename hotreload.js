fetch("./id").then(async (resp) => {
    const body = await resp.text();
    const id = Number(body);
    if (isNaN(id)) {
        return console.error("API-ID is not a number");
    };

    console.info("Current API-ID " + id);

    setInterval(async () => {
        const resp = await fetch("./id");
        const body = await resp.text();
        const id2 = Number(body);
        if (isNaN(id2)) {
            return console.error("API-ID is not a number");
        };

        if (id !== id2) {
            location.reload();
        }
    }, 200);
});