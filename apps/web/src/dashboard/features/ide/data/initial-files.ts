import type { FileNode } from '@/shared/types';

export const INITIAL_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'project-root',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'main',
            name: 'main.py',
            type: 'file',
            language: 'python',
            content:
              'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"Hello": "World"}\n',
          },
          {
            id: 'utils',
            name: 'utils.py',
            type: 'file',
            language: 'python',
            content:
              'def process_data(data):\n    # TODO: Implement processing logic\n    return data * 2\n',
          },
        ],
      },
      {
        id: 'req',
        name: 'requirements.txt',
        type: 'file',
        language: 'plaintext',
        content: 'fastapi==0.104.1\nuvicorn==0.24.0',
      },
      {
        id: 'readme',
        name: 'README.md',
        type: 'file',
        language: 'markdown',
        content: '# Project Documentation\n\nThis is a Pytholit project.',
      },
    ],
  },
];
