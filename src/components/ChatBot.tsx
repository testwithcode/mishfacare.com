import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Mishfa Care Assistant. How can I help you today? Ask me about sanitary pads, baby diapers, or our products!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    if (
      lower.includes('sanitary') ||
      lower.includes('pad') ||
      lower.includes('period') ||
      lower.includes('bubbly')
    ) {
      return "Our Bubbly'z sanitary pads are premium quality with soft cotton, leak lock protection, and 12-hour protection. Available in regular, XXL, and XXXL sizes. They feature mint cool freshness and anion chip technology. Do you need information about a specific size?";
    }

    if (lower.includes('diaper') || lower.includes('baby')) {
      return "Our baby diapers are designed for comfort and protection. They are soft, breathable, and have excellent leak protection. Perfect for all stages of baby development. Would you like to know about sizes or pricing?";
    }

    if (lower.includes('price') || lower.includes('cost')) {
      return "Our products are competitively priced. Sanitary pads start from ₹399, and we offer bulk discounts for distributors. Please visit our shop for detailed pricing or contact us at mishfacare@gmail.com.";
    }

    if (lower.includes('order') || lower.includes('buy')) {
      return "You can shop directly on our website or contact us for bulk orders. For wholesale inquiries, please fill out our distributor form or WhatsApp us at +91 79905 07301.";
    }

    if (lower.includes('distribution') || lower.includes('distributor')) {
      return "We're looking for distributors across India! If you're interested in becoming a Mishfa Care distributor, please fill out the distributor application form. We offer competitive margins and support.";
    }

    if (lower.includes('health') || lower.includes('medical') || lower.includes('doctor')) {
      return "I provide general guidance only and cannot give medical advice. For health concerns like heavy bleeding, infections, allergies, or any pregnancy-related issues, please consult a qualified doctor or pediatrician immediately.";
    }

    if (lower.includes('contact') || lower.includes('phone') || lower.includes('email')) {
      return "You can reach us at:\n📞 +91 79905 07301\n📧 mishfacare@gmail.com\nAlso follow us on Instagram @mishfacare for updates!";
    }

    return "Thank you for your question! For more detailed information, please contact us at mishfacare@gmail.com or WhatsApp +91 79905 07301. Our team will be happy to help!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 animate-bounce"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 h-screen md:h-auto md:max-h-[600px] bg-black border border-amber-600 rounded-lg shadow-2xl flex flex-col animate-fadeIn">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">Mishfa Care Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-amber-700 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none border border-amber-600'
              } whitespace-pre-wrap`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-amber-600 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          className="flex-1 bg-gray-900 text-white border border-amber-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={handleSend}
          className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
