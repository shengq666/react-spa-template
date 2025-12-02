// vConsole 调试工具
let vconsoleInstance: any = null

export const initVConsole = () => {
  // 只在开发环境或配置启用时加载
  if (import.meta.env.VITE_VCONSOLE_ENABLED === 'true') {
    import('vconsole').then((VConsole) => {
      if (!vconsoleInstance) {
        vconsoleInstance = new VConsole.default({
          theme: 'dark',
        })
        console.log('vConsole initialized')
      }
    })
  }
}

export const destroyVConsole = () => {
  if (vconsoleInstance) {
    vconsoleInstance.destroy()
    vconsoleInstance = null
  }
}

