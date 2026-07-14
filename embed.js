(() => {
    const script = document.currentScript;
    const APP_ID = script.dataset.app || "";
    const WORKSPACE = new URL(document.currentScript.src).origin;
    const SIZE = "44px";
    const MARGIN = "4px";
    if (document.getElementById("wafflebar")) {
        return;
    }
    function create() {
        const iframe = document.createElement("iframe");
        iframe.id = "wafflebar";
        iframe.src = WORKSPACE +
                     "/?parent=" +
                     encodeURIComponent( window.location.origin ) +
                     "&app=" +
                     encodeURIComponent( APP_ID );
        Object.assign(iframe.style, {
            position: "fixed",
            top: "0",
            right: "0",
            left: "auto",
            width: SIZE,
            height: SIZE,
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
                        iframe.style.width = "100vw";
                        iframe.style.height = "100vh";
                        break;
                    case "wafflebar-close":
                        iframe.style.width = SIZE;
                        iframe.style.height = SIZE;
                        break;
                    case "wafflebar-position-left":
                        iframe.style.left = MARGIN;
                        iframe.style.right = "auto";
                        break;
                    case "wafflebar-position-right":
                        iframe.style.right = MARGIN;
                        iframe.style.left = "auto";
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
