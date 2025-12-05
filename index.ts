/* eslint-disable no-console */
import type {Plugin, ResolvedConfig} from 'vite'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import * as process from 'node:process'

interface ColorReplaceMapItem {
    test: string
    replace: string
}

const colorReplaceMap: ColorReplaceMapItem[] = [
    {
        test: 'shadow-grey.png',
        replace:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGBAMAAADwPukCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURdnZ2fT09N7e3uzs7OTk5Pr6+vVa4lkAAAAUSURBVAjXY2BgUGBwYDBgEGAIAAAEXADx8btKYQAAAABJRU5ErkJggg==',
    },
    {
        test: 'shadow-blue.png',
        replace:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGBAMAAADwPukCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURb7T9ezy/MbY9t/p+tHg+Pf6/gmQWsMAAAAUSURBVAjXY2BgUGBwYDBgEGAIAAAEXADx8btKYQAAAABJRU5ErkJggg==',
    },
    {
        test: 'shadow-green.png',
        replace:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGBAMAAADwPukCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURb71vuz87Mb2xt/639H40ff+98iMtmEAAAAUSURBVAjXY2BgUGBwYDBgEGAIAAAEXADx8btKYQAAAABJRU5ErkJggg==',
    },
    {
        test: 'shadow-orange.png',
        replace:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGBAMAAADwPukCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURfXTvvzy7PbYxvrp3/jg0f7692in75UAAAAUSURBVAjXY2BgUGBwYDBgEGAIAAAEXADx8btKYQAAAABJRU5ErkJggg==',
    },
    {
        test: 'shadow-red.png',
        replace:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGBAMAAADwPukCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURfW+yvzs7/bG0Prf5PjR2v73+TToEXgAAAAUSURBVAjXY2BgUGBwYDBgEGAIAAAEXADx8btKYQAAAABJRU5ErkJggg==',
    },
    {
        test: 'shadow-yellow.png',
        replace:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGBAMAAADwPukCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURfXvvvz67Pbxxvr33/j00f7997nVB7sAAAAUSURBVAjXY2BgUGBwYDBgEGAIAAAEXADx8btKYQAAAABJRU5ErkJggg==',
    },
]

// Map of platform to style file extension
const platformExtMap: Record<string, string> = {
    'mp-weixin': '.wxss',
    'mp-alipay': '.acss',
    'mp-baidu': '.css',
    'mp-toutiao': '.ttss',
    'mp-lark': '.ttss',
    'mp-qq': '.qss',
    'mp-kuaishou': '.css',
    'mp-jd': '.jxss',
    'mp-360': '.css',
    'h5': '.css',
    'app': '.css',
    'app-plus': '.css',
}

export const replaceCssText = (data: string, color: string, replaceColor: string) => {
    const replaceColorRegex = new RegExp(
        `url\\((https?://[^)]*/${color})\\)`,
        'g',
    )
    return data.replace(replaceColorRegex, `url(${replaceColor})`)
}

export const replaceJsText = (data: string, color: string, replaceColor: string) => {
    // Matches pattern: src:"https://"+e+"/.../img/shadow-grey.png"
    // Allowing for variable names (\w+) and potential whitespace
    const replaceColorRegex = new RegExp(
        `src\\s*:\\s*"https://"\\s*\\+\\s*\\w+\\s*\\+\\s*"[^"]*?/${color}"`,
        'g',
    )
    return data.replace(replaceColorRegex, `src:"${replaceColor}"`)
}

const modifyFile = async (filePath: string, styleExt: string) => {
    let data = await fs.readFile(filePath, 'utf8')
    let fileModified = false
    const modifiedColors: string[] = []
    const ext = path.extname(filePath)

    colorReplaceMap.forEach(({test: color, replace: replaceColor}) => {
        let regex: RegExp
        if (ext === styleExt) {
            regex = new RegExp(color, 'i')
        } else if (ext === '.js') {
            // For JS, we need to be more specific to avoid false positives if the filename just appears in a string
            // But for checking existence, simple check is fine, the replace function does the heavy lifting
            regex = new RegExp(color, 'i')
        } else {
            return
        }

        if (regex.test(data)) {
            let newData = data
            if (ext === styleExt) {
                newData = replaceCssText(data, color, replaceColor)
            } else if (ext === '.js') {
                newData = replaceJsText(data, color, replaceColor)
            }

            if (newData !== data) {
                data = newData
                fileModified = true
                modifiedColors.push(color)
            }
        }
    })

    if (fileModified) {
        await fs.writeFile(filePath, data)
    }

    return {
        filePath,
        modify: fileModified,
        color: modifiedColors.length > 0 ? modifiedColors : undefined,
    }
}

const readAndModifyFiles = async (
    defaultPath: string,
    styleExt: string,
    log: any[] = [],
) => {
    try {
        const files = await fs.readdir(defaultPath, {withFileTypes: true})

        for (const file of files) {
            const fullPath = path.join(defaultPath, file.name)
            if (file.isDirectory()) {
                await readAndModifyFiles(fullPath, styleExt, log)
            } else if (path.extname(file.name) === styleExt || path.extname(file.name) === '.js') {
                const fileLog = await modifyFile(fullPath, styleExt)
                if (fileLog.modify) {
                    log.push(fileLog)
                }
            }
        }
    } catch (e) {
        console.warn(`[vite-plugin-replace-image] Could not read directory: ${defaultPath}`, e)
    }
    return log
}

export interface Options {
    /**
     * Whether to run the plugin in development mode (watch mode).
     * @default false
     */
    runOnDev?: boolean
}

function vitePluginUniReplaceImage(options: Options = {}): Plugin {
    let config: ResolvedConfig

    return {
        name: 'vite-plugin-uni-replace-image',
        apply: 'build',
        configResolved(resolvedConfig) {
            config = resolvedConfig
        },
        closeBundle: async () => {
            const isWatch = !!config.build.watch
            const shouldRun = !isWatch || (isWatch && options.runOnDev)

            if (!shouldRun) {
                return
            }

            const platform = process.env.UNI_PLATFORM || 'mp-weixin'
            const styleExt = platformExtMap[platform] || '.css'

            console.log(`[vite-plugin-replace-image] Platform: ${platform}, Style Extension: ${styleExt}`)
            console.log('开始替换图片...')

            let targetPath = config.build.outDir
            if (!targetPath) {
                targetPath = path.resolve(process.cwd(), `./dist/build/${platform}/`)
            }
            // Ensure absolute path
            if (!path.isAbsolute(targetPath)) {
                targetPath = path.resolve(process.cwd(), targetPath)
            }

            console.log(`Target directory: ${targetPath}`)

            const log = await readAndModifyFiles(targetPath, styleExt)

            if (log.length) {
                console.table(log)
                console.log('修改完成')
            } else {
                console.log('未发现需要修改的文件')
            }
        },
    }
}

export {vitePluginUniReplaceImage as default}
