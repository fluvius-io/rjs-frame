import React from 'react';
import { PageModule } from 'rjs-frame';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { pageStore, updatePageState, setPageName } from 'rjs-frame/src/store/pageStore';
import type { PageArgument, PageState } from 'rjs-frame/src/types/PageState';

export class ArgumentsModule extends PageModule {
  renderContent() {
    return <ArgumentsContent />;
  }
}

function ArgumentsContent() {
  const typedPageStore = pageStore as unknown as ReturnType<typeof atom<PageState>>;
  const page = useStore(typedPageStore);
  const { args, name } = page;

  const handlePageNameChange = (newName: string) => {
    setPageName(newName);
  };

  const handleAddArgument = () => {
    const newArg: PageArgument = [`arg${args.length + 1}`, `value${args.length + 1}`];
    updatePageState(state => ({
      ...state,
      args: [...state.args, newArg]
    }));
  };

  const handleUpdateArgument = (index: number, newName: string, newValue: string) => {
    const newArgs = [...args];
    newArgs[index] = [newName, newValue];
    updatePageState(state => ({
      ...state,
      args: newArgs
    }));
  };

  const handleRemoveArgument = (index: number) => {
    updatePageState(state => ({
      ...state,
      args: state.args.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="arguments-module" style={{ padding: '20px', border: '1px solid #eee' }}>
      <h3>URL Arguments Demo</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Page Name:</label>
          <input
            value={name}
            onChange={(e) => handlePageNameChange(e.target.value)}
            placeholder="Enter page name"
            style={{ width: '200px' }}
          />
        </div>
        <p>URL Format: /{name}/argument_name:value/...</p>
      </div>

      <div className="arguments-list" style={{ marginBottom: '20px' }}>
        {args.map(([argName, argValue]: PageArgument, index: number) => (
          <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <input
              value={argName}
              onChange={(e) => handleUpdateArgument(index, e.target.value, argValue)}
              placeholder="Argument name"
              style={{ width: '150px' }}
            />
            <input
              value={argValue}
              onChange={(e) => handleUpdateArgument(index, argName, e.target.value)}
              placeholder="Value"
              style={{ width: '150px' }}
            />
            <button onClick={() => handleRemoveArgument(index)}>Remove</button>
          </div>
        ))}
      </div>

      <button onClick={handleAddArgument}>Add Argument</button>
    </div>
  );
} 