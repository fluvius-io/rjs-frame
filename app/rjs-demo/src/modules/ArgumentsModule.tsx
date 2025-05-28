import React, { useEffect } from 'react';
import { PageModule } from 'rjs-frame';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import { pageStore } from 'rjs-frame/src/store/pageStore';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ '*': string }>();

  useEffect(() => {
    console.log('Current page state:', page);
    console.log('Current URL params:', params);
    console.log('Current location:', location);
    console.log('Current args:', args);
  }, [page, params, location, args]);

  // Convert args array to URL fragments
  const getUrlFromArgs = (newArgs: PageArgument[]): string => {
    const fragments = newArgs
      .filter(([name, value]) => name && value) // Filter out empty args
      .map(([name, value]) => `${name}:${value}`)
      .join('/');
    const newUrl = `/${name}${fragments ? '/' + fragments : ''}${location.search}`;
    console.log('Generated URL:', newUrl, 'from args:', newArgs);
    return newUrl;
  };

  const handleAddArgument = () => {
    const newArgs = [
      ...args,
      [`arg${args.length + 1}`, `value${args.length + 1}`] as PageArgument
    ];
    console.log('Adding argument, new args:', newArgs);
    const newUrl = getUrlFromArgs(newArgs);
    console.log('Navigating to:', newUrl);
    navigate(newUrl, { replace: false });
  };

  const handleUpdateArgument = (index: number, newName: string, newValue: string) => {
    const newArgs = [...args];
    newArgs[index] = [newName, newValue];
    console.log('Updating argument at index', index, 'new args:', newArgs);
    navigate(getUrlFromArgs(newArgs), { replace: true });
  };

  const handleRemoveArgument = (index: number) => {
    const newArgs = args.filter((_, i) => i !== index);
    console.log('Removing argument at index', index, 'new args:', newArgs);
    navigate(getUrlFromArgs(newArgs), { replace: true });
  };

  return (
    <div className="arguments-module" style={{ padding: '20px', border: '1px solid #eee' }}>
      <h3>URL Arguments Demo</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Current Page: {name}</label>
        </div>
        <p>URL Format: /{name}/argument_name:value/...</p>
        <p>Current Arguments: {args && args.length ? args.map(([n, v]) => `${n}:${v}`).join(', ') : 'none'}</p>
        <p>Raw Args Data: {JSON.stringify(args)}</p>
        <p>URL Params: {JSON.stringify(params)}</p>
      </div>

      <div className="arguments-list" style={{ marginBottom: '20px' }}>
        {args && args.map(([argName, argValue]: PageArgument, index: number) => (
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