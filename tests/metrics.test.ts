

import * as assert from 'assert';
import * as vscode from 'vscode';
import sinon from 'sinon';

describe('Argus Monitor Extension - Métricas', () => {
    let extension: vscode.Extension<any> | undefined;
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        extension = vscode.extensions.getExtension('JoaoRotger.system-monitor');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('Exibe corretamente o valor de uso da CPU', async () => {
        const si = require('systeminformation');
        sandbox.stub(si, 'currentLoad').resolves({ currentLoad: 42.5 });
        sandbox.stub(si, 'mem').resolves({ active: 4000, total: 8000 });
        sandbox.stub(si, 'cpuTemperature').resolves({ main: 55 });
        await extension!.activate();
        const statusBarItems = (vscode.window as any)._statusBar?._items;
        const found = statusBarItems && statusBarItems.some((item: any) =>
            typeof item.text === 'string' && item.text.includes('CPU: 42.5%')
        );
        assert.ok(found, 'Valor de CPU mockado não exibido corretamente');
    });

    it('Exibe corretamente o valor de uso da RAM', async () => {
        const si = require('systeminformation');
        sandbox.stub(si, 'currentLoad').resolves({ currentLoad: 10 });
        sandbox.stub(si, 'mem').resolves({ active: 2000, total: 4000 }); // 50%
        sandbox.stub(si, 'cpuTemperature').resolves({ main: 60 });
        await extension!.activate();
        const statusBarItems = (vscode.window as any)._statusBar?._items;
        const found = statusBarItems && statusBarItems.some((item: any) =>
            typeof item.text === 'string' && item.text.includes('RAM: 50.0%')
        );
        assert.ok(found, 'Valor de RAM mockado não exibido corretamente');
    });

    it('Exibe corretamente a temperatura da CPU', async () => {
        const si = require('systeminformation');
        sandbox.stub(si, 'currentLoad').resolves({ currentLoad: 10 });
        sandbox.stub(si, 'mem').resolves({ active: 1000, total: 4000 });
        sandbox.stub(si, 'cpuTemperature').resolves({ main: 77 });
        await extension!.activate();
        const statusBarItems = (vscode.window as any)._statusBar?._items;
        const found = statusBarItems && statusBarItems.some((item: any) =>
            typeof item.text === 'string' && item.text.includes('Temp: 77°C')
        );
        assert.ok(found, 'Temperatura não exibida corretamente');
    });

    it('Não exibe temperatura quando não está disponível', async () => {
        const si = require('systeminformation');
        sandbox.stub(si, 'currentLoad').resolves({ currentLoad: 10 });
        sandbox.stub(si, 'mem').resolves({ active: 1000, total: 4000 });
        sandbox.stub(si, 'cpuTemperature').resolves({ main: null });
        await extension!.activate();
        const statusBarItems = (vscode.window as any)._statusBar?._items;
        const found = statusBarItems && statusBarItems.some((item: any) =>
            typeof item.text === 'string' && !item.text.includes('Temp')
        );
        assert.ok(found, 'Temperatura não deveria ser exibida quando não está disponível');
    });
});
