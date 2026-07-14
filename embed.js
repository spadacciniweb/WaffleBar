(() => {
    const WORKSPACE =
        new URL(document.currentScript.src).origin;
    if (document.getElementById("wafflebar")) {
        return;
    }
    function create() {
        const iframe = document.createElement("iframe");
        iframe.id = "wafflebar";
        iframe.src =
            WORKSPACE +
            "/?parent=" +
            encodeURIComponent(
                window.location.origin
            );
        Object.assign(iframe.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "52px",
            height: "52px",
            border: "0",
            margin: "0",
            padding: "0",
            background: "transparent",
            overflow: "hidden",
            zIndex: "2147483647"
        });
        iframe.setAttribute(
            "scrolling",
            "no"
        );
        document.body.appendChild(
            iframe
        );
        window.addEventListener(
            "message",
            function (event) {
                if (event.origin !== WORKSPACE) {
                    return;
                }
                if (
                    !event.data ||
                    event.data.source !== "wafflebar"
                ) {
                    return;
                }
                switch (event.data.type) {
                    case "wafflebar-open":
                        iframe.style.width = "100%";
                        iframe.style.height = "100vh";
                        break;
                    case "wafflebar-close":
                        iframe.style.width = "52px";
                        iframe.style.height = "52px";
                        break;
                }
            }
        );
    }
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            create
        );
    } else {
        create();
    }
})();
