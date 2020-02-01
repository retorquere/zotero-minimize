declare const Zotero: any
declare const Components: any

const marker = 'MinimizeMonkeyPatched'

function patch(object, method, patcher) {
  if (object[method][marker]) return
  object[method] = patcher(object[method])
  object[method][marker] = true
}

const Minimize = Zotero.Minimize || new class { // tslint:disable-line:variable-name
  private initialized: boolean = false

  constructor() {
    window.addEventListener('load', event => {
      this.init().catch(err => Zotero.logError(err))
    }, false)
  }

  private async init() {
    if (this.initialized) return
    this.initialized = true

    await Zotero.uiReadyPromise

    const wm = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator)
    const windows = wm.getEnumerator(null)
    while (windows.hasMoreElements()) {
      const win = windows.getNext().QueryInterface(Components.interfaces.nsIDOMChromeWindow)
      Zotero.debug('minimizing...')
      win.minimize()
    }
  }
}

export = Minimize

// otherwise this entry point won't be reloaded: https://github.com/webpack/webpack/issues/156
delete require.cache[module.id]
