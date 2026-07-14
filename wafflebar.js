(() => {
    /***************************
     * CONFIGURATION
     **************************/
    const params = new URLSearchParams(window.location.search);
    const parentOrigin = params.get("parent") || "*";
    const appId = params.get("app") || "";
    /***************************
     * DOM
     **************************/
    const overlay = document.getElementById("wb-overlay");
    const launcher = document.getElementById("wb-launcher");
    const button = document.getElementById("wb-waffle");

    if (!overlay || !launcher || !button) {
        return;
    }
    /***************************
     * STATE
     **************************/
    let appsCache = null;
    let isLoaded = false;
    let position = "right";
    let theme = "dark";
    /***************************
     * LOAD CONFIG
     **************************/
    async function loadConfig() {
        try {
            const response = await fetch("./api/config.json", {
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error("Cannot load config.json");
            }
            const config = await response.json();
            const ui = config.ui || {};
            if (
                ui.position === "left" ||
                ui.position === "right"
            ) {
                position = config.ui.position;
            }
            if (
                ui.theme === "dark" ||
                ui.theme === "light"
            ) {
                theme = config.ui.theme;
            }
        } catch (err) {
            console.error("WaffleBar config:", err);
            position = "right";
            theme = "dark";
        }
        if (appId) {
            try {
                const apps = await loadApps();
                const app = apps.find(
                    a => a.id === appId
                );
                if (
                    app &&
                    (
                        app.theme === "dark" ||
                        app.theme === "light"
                    )
                ) {
                    theme = app.theme;
                }
            } catch (err) {
                // ignore and keep global theme
            }
        }
        document.body.classList.remove(
            "wb-left",
            "wb-right",
            "wb-theme-dark",
            "wb-theme-light"
        );
        document.body.classList.add(
            "wb-" + position
        );
        document.body.classList.add(
            "wb-theme-" + theme
        );
        notifyParent(
            "wafflebar-position-" + position
        );
        notifyParent(
            "wafflebar-ready"
        );
    }
    /***************************
     * PARENT COMMUNICATION
     **************************/
    function notifyParent(type) {
        if (window.parent !== window) {
            window.parent.postMessage(
                {
                    source: "wafflebar",
                    type
                },
                parentOrigin
            );
        }
    }
    /***************************
     * LOAD APPS
     **************************/
    async function loadApps() {
        if (appsCache !== null) {
            return appsCache;
        }
        try {
            const response = await fetch("./api/apps.json", {
                cache: "no-store"
            });
            if (!response.ok) {
                throw new Error(
                    "Cannot load apps.json"
                );
            }
            const data = await response.json();
            appsCache = Array.isArray(data)
                ? data
                : [];
        } catch (err) {
            console.error(
                "WaffleBar:",
                err
            );
            appsCache = [];
        }
        return appsCache;
    }
    /***************************
     * RENDER APPS
     **************************/
    function renderApps(apps) {
        launcher.innerHTML = "";
        apps.forEach(app => {
            const link = document.createElement("a");
            link.className = "wb-app";
            link.href = app.url;
            link.title = app.title;
            link.target = "_top";
            const img = document.createElement("img");
            img.src = app.icon;
            img.alt = app.title;
            img.onerror = () => {
                img.remove();
            };
            const label = document.createElement("span");
            label.textContent = app.title;
            link.appendChild(img);
            link.appendChild(label);
            link.addEventListener(
                "click",
                () => {
                    closeLauncher();
                }
            );
            launcher.appendChild(link);
        });
    }
    /***************************
     * OPEN
     **************************/
    async function openLauncher() {
        overlay.classList.remove(
            "hidden"
        );
        if (!isLoaded) {
            const apps = await loadApps();
            renderApps(apps);
            isLoaded = true;
        }
        notifyParent(
            "wafflebar-open"
        );
    }
    /***************************
     * CLOSE
     **************************/
    function closeLauncher() {
        overlay.classList.add(
            "hidden"
        );
        notifyParent(
            "wafflebar-close"
        );
    }
    /***************************
     * TOGGLE
     **************************/
    function toggleLauncher() {
        if (
            overlay.classList.contains(
                "hidden"
            )
        ) {
            openLauncher();
        } else {
            closeLauncher();
        }
    }
    /***************************
     * EVENTS
     **************************/
    function initEvents() {
        button.addEventListener(
            "click",
            function (e) {
                e.stopPropagation();
                toggleLauncher();
            }
        );
        overlay.addEventListener(
            "click",
            function (e) {
                if (e.target === overlay) {
                    closeLauncher();
                }
            }
        );
        document.addEventListener(
            "keydown",
            function (e) {
                if (e.key === "Escape") {
                    closeLauncher();
                }
            }
        );
    }
    /***************************
     * START
     **************************/
    async function init() {
        try {
            await loadConfig();
            document.body.classList.remove("wb-loading");
            initEvents();
        } catch (err) {
            console.error(
                "WaffleBar initialization failed:",
                err
            );
        }
    }
    init();
})();
