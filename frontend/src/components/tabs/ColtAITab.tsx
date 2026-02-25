import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../GlassCard';
import { respondToMessage } from '../../utils/coltAI';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const SUBJECT_PROMPTS = [
  { label: '📐 Math', prompt: 'Solve 2x + 5 = 15', color: 'text-neon-cyan' },
  { label: '📜 History', prompt: 'Who was the first president of the United States?', color: 'text-neon-green' },
  { label: '📝 English', prompt: 'What is a metaphor?', color: 'text-neon-purple' },
  { label: '🔬 Science', prompt: 'What is photosynthesis?', color: 'text-neon-pink' },
];

export default function ColtAITab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: "Hello! I'm Colt AI, your personal study assistant! I can help you with Math, History, English, and Science. Click a subject button below or type your question!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    const botResponse = respondToMessage(trimmed);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: botResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSubjectClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto gap-4">
      {/* Header */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 flex items-center justify-center">
            <Bot className="w-5 h-5 text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neon-cyan neon-text">Colt AI</h2>
            <p className="text-xs text-gray-400">Your study assistant for Math · History · English · Science</p>
          </div>
        </div>
      </GlassCard>

      {/* Subject Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SUBJECT_PROMPTS.map(subject => (
          <button
            key={subject.label}
            onClick={() => handleSubjectClick(subject.prompt)}
            className={`glass-card p-3 text-sm font-semibold ${subject.color} hover:scale-105 transition-transform border border-white/10 hover:border-white/30 rounded-lg text-center`}
          >
            {subject.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <GlassCard className="flex-1 p-4 overflow-hidden flex flex-col" style={{ minHeight: '400px', maxHeight: '500px' }}>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                msg.role === 'bot'
                  ? 'bg-neon-cyan/20 border border-neon-cyan/50'
                  : 'bg-neon-purple/20 border border-neon-purple/50'
              }`}>
                {msg.role === 'bot'
                  ? <Bot className="w-4 h-4 text-neon-cyan" />
                  : <User className="w-4 h-4 text-neon-purple" />
                }
              </div>
              <div
                className={`max-w-[75%] rounded-xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-neon-purple/20 border border-neon-purple/30 text-white ml-auto'
                    : 'bg-white/5 border border-white/10 text-gray-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </GlassCard>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Colt AI anything about Math, History, English, or Science..."
          className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-neon-cyan/20 border border-neon-cyan/50 hover:bg-neon-cyan/30 disabled:opacity-40 disabled:cursor-not-allowed text-neon-cyan rounded-lg px-4 py-3 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
