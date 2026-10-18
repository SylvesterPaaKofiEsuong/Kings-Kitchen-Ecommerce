import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { getMessages, sendMessage, subscribe } from '@/lib/store-data';
import { formatDateTime } from '@/lib/format';

export default function OrderConversation({ orderId, customerName, isAdminSide = false, customerEmail }) {
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    getMessages(orderId).then(setMessages);
    const unsub = subscribe('OrderMessage', (ev) => {
      if (ev.type === 'create' && ev.data && ev.data.order_id === orderId) {
        setMessages((prev) =>
          prev.some((m) => m.id === ev.data.id) ? prev : [...prev, ev.data]
        );
      }
    });
    return unsub;
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage({
        order_id: orderId,
        sender: isAdminSide ? 'admin' : 'customer',
        sender_name: isAdminSide ? "King's Kitchen — Fulfilment Team" : customerName,
        body: body.trim(),
      });
      setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
      setBody('');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-border">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em]">Order Conversation</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Fulfilment &amp; delivery only</p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-label="Order conversation"
        aria-live="polite"
        className="max-h-96 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 ? (
          <p className="text-center font-mono text-[11px] text-muted-foreground py-8">
            {isAdminSide
              ? 'No messages yet. Start the conversation with the customer.'
              : 'No messages yet. Ask a question about your order here.'}
          </p>
        ) : (
          messages.map((msg) => {
            const isMine = isAdminSide ? msg.sender === 'admin' : msg.sender === 'customer';
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] border px-3 py-2 text-sm ${
                    isMine
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-muted/60 text-foreground'
                  }`}
                >
                  {msg.sender === 'admin' && !isMine && (
                    <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#2D4B73]">
                      {msg.sender_name || "King's Kitchen — Fulfilment Team"}
                    </p>
                  )}
                  <p>{msg.body}</p>
                  <p className={`mt-1 font-mono text-[9px] ${isMine ? 'text-background/60' : 'text-muted-foreground'}`}>
                    {formatDateTime(msg.created_date)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="border-t border-border p-3 flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={isAdminSide ? 'Message customer…' : 'Message us…'}
          aria-label="Message"
          className="flex-1 border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!body.trim() || sending}
          aria-label="Send message"
          className="flex h-10 w-10 items-center justify-center border border-foreground text-foreground transition-colors hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-40"
        >
          <Send className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
}
