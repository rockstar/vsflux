class Actions {
  constructor (vscode = acquireVsCodeApi()) {
    this.vscode = vscode

    if (this.isV1) {
      this.toggleToV1()
    }

    if (this.isHostEmpty) {
      this.resetHost()
    }
  }

  save () {
    if (!this.validate()) {
      return
    }
    this.vscode.postMessage({
      command: 'save',
      ...this.getData()
    })
  }

  test () {
    if (!this.validate()) {
      return
    }
    this.vscode.postMessage({
      command: 'testConn',
      ...this.getData()
    })
  }

  bind () {
    document.querySelector('#testConn').addEventListener('click', () => {
      this.test()
    })

    document.querySelector('#save').addEventListener('click', () => {
      this.save()
    })

    this.versionElement.addEventListener('change', () => {
      this.toggleOptions()
    })
  }

  /* getters */
  get isHostEmpty () {
    return this.hostElement.querySelector('input').value === ''
  }

  get versionElement () {
    return document.querySelector('#connVersion')
  }

  get hostElement () {
    return document.querySelector('#connHost')
  }

  get tokenElement () {
    return document.querySelector('#connToken')
  }

  get orgElement () {
    return document.querySelector('#connOrg')
  }

  get form () {
    return document.querySelector('form')
  }

  get isV1 () {
    return this.versionElement.value === '1'
  }

  get defaultURL () {
    return this.isV1 ? this.hostElement.dataset.v1 : ''
  }

  /* private api */

  validate () {
    if (!this.form.checkValidity()) {
      this.form.reportValidity()
      return false
    }

    return true
  }

  getData () {
    const result = {
      connID: document.querySelector('#connID').value,
      connName: document.querySelector('#connName input').value,
      connHost: document.querySelector('#connHost input').value,
      connVersion: document.querySelector('#connVersion').value,
      connToken: '',
      connOrg: ''
    }

    // trim trailing slash on connHost input
    let host = result.connHost
    if (host[host.length-1] === '/') {
      result.connHost = host.slice(0, -1)
    }

    if (result.connVersion !== 1) {
      const connToken = this.tokenElement.querySelector('input').value
      const connOrg = this.orgElement.querySelector('input').value

      return { ...result, connToken, connOrg }
    }

    return result
  }

  setHost (val) {
    this.hostElement.querySelector('input').value = val
  }

  hide (element) {
    element.classList.add('hidden')
  }

  show (element) {
    element.classList.remove('hidden')
  }

  toggleToV1 () {
    this.tokenElement.querySelector('input').removeAttribute('required')
    this.orgElement.querySelector('input').removeAttribute('required')
    this.hide(this.tokenElement)
    this.hide(this.orgElement)
    this.hostElement.querySelector('input').removeAttribute('list')
  }

  toggleToV2 () {
    this.show(this.tokenElement)
    this.show(this.orgElement)
    this.tokenElement.querySelector('input').setAttribute('required', 'true')
    this.orgElement.querySelector('input').setAttribute('required', 'true')
    this.hostElement.querySelector('input').setAttribute('list', 'hosts')
  }

  resetHost () {
    this.setHost(this.defaultURL)
  }

  toggleOptions () {
    this.isV1 ? this.toggleToV1() : this.toggleToV2()
    this.resetHost()
  }
}

const actions = new Actions()
actions.bind()
