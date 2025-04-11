import React, { useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ChatMessage } from './types';
import { toPng, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import useExportSql from '../hooks/useExportSql';

const ChatBubble: React.FC<ChatMessage> = ({ role, type, text, nodes, edges, loading }) => {
  const alignment = role === 'user' ? 'justify-end' : 'justify-center';
  const bubbleClasses =
    role === 'user'
      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none self-end'
      : 'bg-white text-gray-800 border rounded-bl-none self-center';

  const flowRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const { fitView } = useReactFlow();
  const {exportSql} = useExportSql();

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
    setTimeout(() => {
      fitView({ padding: 0.2 });
    }, 100);
  };

  const handleExportSql = async (nodes: any, edges: any) => {
      await exportSql(JSON.stringify({ nodes, edges }));
  };

  const handleExport = async (format: 'png' | 'svg' | 'pdf') => {
    if (!flowRef.current) return;

    if (format === 'png') {
      const dataUrl = await toPng(flowRef.current);
      const link = document.createElement('a');
      link.download = 'diagramme.png';
      link.href = dataUrl;
      link.click();
    }

    if (format === 'svg') {
      const dataUrl = await toSvg(flowRef.current);
      const link = document.createElement('a');
      link.download = 'diagramme.svg';
      link.href = dataUrl;
      link.click();
    }

    if (format === 'pdf') {
      const dataUrl = await toPng(flowRef.current);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0);
      pdf.save('diagramme.pdf');
    }
  };

  return (
    <div className={`flex ${alignment}`}>
      <div className={`max-w-xl w-full px-4 py-3 rounded-xl shadow text-sm ${bubbleClasses}`}>
        {type === 'text' && <p className="text-center">{text}</p>}

        {type === 'mcd' && (
          <div
            className={`relative mx-auto mt-2 border rounded-md overflow-hidden bg-gray-50 ${
              fullscreen ? 'w-full h-[80vh]' : 'w-full max-w-3xl h-[300px]'
            }`}
          >
            {!loading && (
              <div className="absolute top-2 right-2 z-10 flex flex-wrap gap-2">
                <button
                  onClick={handleFullscreen}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {fullscreen ? 'Quitter' : 'Plein écran'}
                </button>
                <button
                  onClick={() => handleExport('png')}
                  className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  PNG
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleExportSql(nodes, edges)}
                  className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  SQL
                </button>
              </div>
            )}

            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-blue-500 text-sm animate-pulse">
                Chargement du MCD...
              </div>
            ) : (
              <div ref={flowRef} className="w-full h-full">
                <ReactFlow nodes={nodes || []} edges={edges || []} fitView>
                  {/* <MiniMap /> */}
                  <Controls />
                  <Background />
                </ReactFlow>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
