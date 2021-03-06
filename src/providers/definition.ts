import * as vscode from 'vscode';
import * as state from '../state';
import * as util from '../utilities';

export class ClojureDefinitionProvider implements vscode.DefinitionProvider {
  state: any;
  constructor() {
    this.state = state;
  }

  async provideDefinition(document, position, token) {
    if (util.getConnectedState()) {
      const text = util.getWordAtPosition(document, position);
      const client = util.getSession(util.getFileType(document));
      const info = await client.info(util.getNamespace(document), text);
      if (info.file && info.file.length > 0) {
        const pos = new vscode.Position(info.line - 1, info.column);
        try {
          return new vscode.Location(vscode.Uri.parse(info.file, true), pos);
        } catch(e) { /* ignore */ }
      }
    }
  }
}

export class PathDefinitionProvider implements vscode.DefinitionProvider {
  state: any;
  constructor() {
    this.state = state;
  }

  async provideDefinition(document, position, token) {
    const text = util.getWordAtPosition(document, position);
    const pattern = new RegExp(/(.*\.[a-z]+):(\d+)(?::(\d)+)?$/);
    if (text.match(pattern)) {
      let [_, path, line, column] = text.match(pattern);
      if (!path.match(/^([a-z]+:|\/)/)) {
        return null;
        // Doesn't work yet...
        // path = `file:${state.getProjectRoot()}/${path}`;
      }
      const pos = new vscode.Position(line - 1, column ? column : 0);
      return new vscode.Location(vscode.Uri.parse(path, true), pos);
    }
  }
}