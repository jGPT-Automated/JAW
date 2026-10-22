import { createRoot } from "react-dom/client"

import css from "./index.css?inline"
import { LocalCheckNav } from "@/lc/nav"

class LocalCheckNavElement extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return
    const root = this.attachShadow({ mode: "open" })
    const style = document.createElement("style")
    style.textContent = `${css}\n:host{display:block;position:sticky;top:0;z-index:50}`
    const mount = document.createElement("div")
    root.append(style, mount)
    createRoot(mount).render(
      <LocalCheckNav current={this.getAttribute("current") ?? "index.html"} />
    )
  }
}

if (!customElements.get("lc-nav")) {
  customElements.define("lc-nav", LocalCheckNavElement)
}
