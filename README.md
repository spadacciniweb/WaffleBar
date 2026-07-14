# WaffleBar

**A lightweight application launcher for multi-app web workspaces**

WaffleBar is a lightweight workspace launcher that brings independent web applications together under a single, unified navigation experience.

It provides a small floating waffle square that opens a full-screen application launcher, allowing users to switch seamlessly between multiple web applications.

Each application remains completely independent, while users experience them as part of a single workspace.

> **Status:** WaffleBar is in active development. The project is functional and already suitable for internal deployments. Contributions, ideas, and feedback are welcome.

---

## Why WaffleBar?

Modern internal systems are often split across multiple web applications:

- CRM
- Wiki / documentation
- Monitoring dashboards
- Billing systems
- Internal tools
- Admin panels

These applications usually live on different domains or virtual hosts, but users still expect:

> “One place to navigate everything”

WaffleBar solves this by introducing a **shared launcher layer** that works across all applications without modifying them.

---

## Key Features

- Lightweight and dependency-free
- Framework agnostic (works with any stack)
- Works with existing applications (no refactor required)
- Isolated UI via iframe sandbox
- Centralized configuration via `apps.json`
- Configurable launcher position via `config.json`
- Instant deployment across all apps (single script)
- No Bootstrap / React / Vue dependencies
- Clean separation between host apps and workspace UI

---

## How It Works

WaffleBar uses a simple **iframe-based architecture**:

- Each application embeds WaffleBar via a single script
- The script injects an iframe into the page
- The iframe loads the WaffleBar workspace
- WaffleBar communicates with the host via `postMessage`
- The iframe expands/collapses when the launcher opens/closes, switching between a compact waffle square and a full-screen launcher.

---

## Architecture

WaffleBar is composed of two independent parts:

- **Host Application** — Any web application that includes WaffleBar using `embed.js`.
- **Workspace** — The WaffleBar application, loaded inside an iframe and responsible for rendering the launcher UI.

The host application remains completely unaware of WaffleBar's internal implementation. The only interaction between the two is a small `postMessage` protocol used to expand and collapse the iframe.

```text
                    Host Application
+----------------------------------------------------------+
|                                                          |
|  +----------------------------------------------------+  |
|  | embed.js                                           |  |
|  |                                                    |  |
|  |  • Creates the iframe                              |  |
|  |  • Injects required CSS                            |  |
|  |  • Listens for postMessage events                  |  |
|  |  • Expands and collapses the iframe                |  |
|  +---------------------------+------------------------+  |
|                              |                           |
+------------------------------|---------------------------+
                               |
                               | iframe
                               |
+------------------------------v---------------------------+
|                   WaffleBar Workspace                    |
|----------------------------------------------------------|
| index.html                                               |
| wafflebar.js                                             |
| wafflebar.css                                            |
| api/apps.json                                            |
| api/config.json                                          |
|                                                          |
|  • Displays the waffle square                            |
|  • Opens the application launcher                        |
|  • Loads the application list                            |
|  • Sends open/close events to the host                   |
+----------------------------------------------------------+
```

This architecture provides several advantages:

- Applications remain completely independent.
- No CSS or JavaScript conflicts with host applications.
- A single WaffleBar deployment serves every application.
- Adding or removing applications only requires updating `apps.json`.
- Host applications require only one line of integration:

```html
<script src="https://workspace.example.com/embed.js"></script>
```

---

## Project Structure

```text
wafflebar/
│
├── index.html          # Workspace shell
├── wafflebar.js        # Launcher logic (inside iframe)
├── wafflebar.css       # UI styling
│
├── embed.js            # Host integration script
│
├── api/
│   ├── apps.json       # App registry
│   └── config.json     # Workspace UI configuration
│
└── icons/              # App icons
```

---

## Configuration

Applications are defined in `api/apps.json`.


Example:

```json
[
  {
    "id": "crm",
    "title": "CRM",
    "icon": "icons/crm.svg",
    "url": "https://crm.example.com"
  },
  {
    "id": "wiki",
    "title": "Wiki",
    "icon": "icons/wiki.svg",
    "url": "https://wiki.example.com"
  }
]
```

No code changes are required when adding or removing applications.

---

## Workspace Configuration

The waffle square position can be configured through `api/config.json`.

Example:

```json
{
  "ui": {
    "position": "right"
  }
}
```

Supported values:

| Value   | Description                                      |
| ------- | ------------------------------------------------ |
| `left`  | Places the waffle square in the top-left corner  |
| `right` | Places the waffle square in the top-right corner |


If `config.json` is missing, invalid, or contains an unsupported value, WaffleBar defaults to:

```json
{
  "ui": {
    "position": "right"
  }
}
```

---

## Embedding WaffleBar

To integrate WaffleBar into any application, add one line of code:

```html
<script src="https://workspace.example.com/embed.js"></script>
```

That’s it.

The script will:
- Inject the iframe automatically
- Load the WaffleBar workspace UI
- Handle resizing and interaction
- Keep the host application untouched

---

## Getting Started

1. Deploy WaffleBar to your workspace server.
2. Configure your applications in `api/apps.json`.
3. Add the following line to every application:

```html
<script src="https://workspace.example.com/embed.js"></script>
```

That's all. WaffleBar will automatically inject itself into the page and provide a shared application launcher.

---

## Communication Model

WaffleBar communicates with host applications using the browser `postMessage` API.

This allows the iframe (WaffleBar) to request UI state changes from the parent application (the host page) without requiring any direct integration or shared code.

### Events

| Event             | Description                                |
|-------------------|--------------------------------------------|
| `wafflebar-open`  | Expands the iframe to full screen          |
| `wafflebar-close` | Collapses the iframe back to waffle square |

### Flow

1. User clicks the waffle button inside WaffleBar  
2. WaffleBar sends a `wafflebar-open` message to the parent window  
3. The host application (via `embed.js`) expands the iframe to full height  
4. When the launcher is closed, WaffleBar sends `wafflebar-close`  
5. The host application collapses the iframe back to the compact waffle square size

### Key Principle

There is **no direct dependency** between WaffleBar and the host application.

The host only needs to include a single script:

```html
<script src="https://workspace.example.com/embed.js"></script>
```

Everything else is handled automatically by WaffleBar.

---

## Design Principles

- Applications remain fully independent
- No shared dependencies between apps
- Zero CSS or JS conflicts
- Single source of configuration (`apps.json`)
- Centralized navigation experience
- Minimal integration effort (one script tag)
- Fully self-contained workspace UI

---

## Use Cases

WaffleBar is ideal for:
- Internal company tool ecosystems
- SaaS admin dashboards
- Multi-service architectures
- Micro-frontend environments (without complexity)
- Self-hosted application suites
- Developer toolchains

---

## Philosophy

WaffleBar is not a framework.
It is a navigation layer that sits above independent applications and connects them into a workspace experience without coupling them together.

---

## License

MIT License
