import * as vscode from 'vscode';
import * as os from 'os';
import * as si from 'systeminformation';

export function activate(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = `$(pulse) Monitorando...`;
    statusBarItem.show();

    detectAndStartMonitoring(statusBarItem, context);
}

function detectAndStartMonitoring(statusBarItem: vscode.StatusBarItem, context: vscode.ExtensionContext) {
    const platform = os.platform();

    if (platform === 'linux') {
        statusBarItem.text = `SO: ${platform}`;
        startMonitoringLinux(statusBarItem, context);
    } else if (platform === 'win32') {
        statusBarItem.text = `Monitoramento para Windows ainda não implementado`;
        //startMonitoringWindows(statusBarItem);
    } else {
        statusBarItem.text = `OS não suportado`;
    }
}

function startMonitoringLinux(statusBarItem: vscode.StatusBarItem, context: vscode.ExtensionContext) {
    let interval: NodeJS.Timeout | undefined;

    async function updateStats() {
        try {
            const cpu = await si.currentLoad();
            const mem = await si.mem();
            const temp = await si.cpuTemperature();

            const cpuUsage = cpu.currentLoad.toFixed(1);
            const ramUsage = ((mem.active / mem.total) * 100).toFixed(1);
            let text = `Testando | CPU: ${cpuUsage}% | RAM: ${ramUsage}%`;

            if (typeof temp.main === 'number' && !isNaN(temp.main)) {
                text += ` | Temp: ${temp.main.toFixed(0)}°C`;
            }

            statusBarItem.text = text;
        } catch (err) {
            statusBarItem.text = `Erro ao ler dados`;
            console.error(err);
        }
    }

    interval = setInterval(updateStats, 2000);
    updateStats();

    context.subscriptions.push({
        dispose() {
            if (interval) {
                clearInterval(interval);
            }
        },
    });
}

function startMonitoringWindows(statusBarItem: vscode.StatusBarItem) {
    // Temporariamente exibe mensagem padrão
    statusBarItem.text = 'Monitoramento para Windows ainda não implementado';
}
