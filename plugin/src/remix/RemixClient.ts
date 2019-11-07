import { Api, createIframeClient, HighlightPosition, PluginClient, RemixApi } from '@remixproject/plugin';

export class RemixClient {

    private client: PluginClient<any> = createIframeClient<Api, RemixApi>();

    createClient = () => {
        return this.client.onload();
    }

    getFile = async (name: string) => {
        return new Promise<string>(async (resolve, reject) => {
            let path = name.startsWith('./') ? name.substr(2) : name;
            let content = await this.client.call('fileManager', 'getFile', this.getBrowserPath(path));
            return content ? resolve(content) : reject(`Could not find "${name}"`);
        });
    }

    getFolder = async() => {
        return this.client.call('fileManager', 'getFolder', '/browser');
    }

    getCurrentFile = async () => {
        return this.client.call('fileManager', 'getCurrentFile');
    }

    createFile = async (name: string, content: string) => {
        return new Promise<string>(async (resolve, reject) => {
            try {
                await this.client.call('fileManager', 'setFile', name, content)
                await this.client.call('fileManager', 'switchFile', name)
                resolve(this.getBrowserPath(name));
            } catch (err) {
                reject(err);
            }
        });
    }

    highlight = async (position: HighlightPosition, file: string, color: string) => {
        await this.client.call('editor', 'highlight', position, this.getBrowserPath(file), color);
    }

    discardHighlight = async () => {
        await this.client.call('editor', 'discardHighlight');
    }

    switchFile = async (file: string) => {
        await this.client.call('fileManager', 'switchFile', this.getBrowserPath(file));
    }

    private getBrowserPath = (path: string) => {
        if (path.startsWith('browser/')) {
            return path;
        }
        return `browser/${path}`;
    }
}

const remixClient = new RemixClient();
export { remixClient };