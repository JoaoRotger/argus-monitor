import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Argus Monitor Extension', () => {
    let extension: vscode.Extension<any> | undefined;

    beforeEach(() => {
        extension = vscode.extensions.getExtension('JoaoRotger.system-monitor');
    });

    it('Deve criar um item na barra de status ao ativar', async () => {
        assert.ok(extension, 'Extensão não encontrada');
        await extension!.activate();
        // Teste visual: verifique se algum item da barra de status contém "CPU:"
        const statusBarItems = (vscode.window as any)._statusBar?._items;
        const found = statusBarItems && statusBarItems.some((item: any) =>
            typeof item.text === 'string' && item.text.includes('CPU:')
        );
        assert.ok(found, 'Item da barra de status não foi criado ou não contém "CPU:"');
    });
});
