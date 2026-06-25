import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import { CATEGORY_LABELS, fetchProducts } from '../lib/products';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const GEMINI_MODEL = 'gemini-2.5-flash';

const WEBSITE_CONTEXT = `
Brand: Mishfa Care
Focus: Premium hygiene products for women and babies in India.
Women care products: Soft cotton feel, leak lock protection, up to 12-hour protection, mint cool freshness, anion chip technology, dermatologist-tested positioning, regular and extra-long protection messaging.
Baby care products: Soft, breathable, protective diaper range for babies.
Website sections: Home, Products, Women Care, Baby Care, About, Contact, Distributor.
Brand values: Comfort, safety, dignity, reliability, accessible premium care.
Ordering guidance: Users can shop on the website, add products to cart, check out online, or contact Mishfa Care on WhatsApp for support or bulk orders.
Distributor guidance: Interested partners can use the distributor form for wholesale/distributor inquiries.
Contact details: Phone +91 79905 07301, email mishfacare@gmail.com, Instagram @mishfacare.
Location: Office No. 10, Nr. Hakim Residency, Sabhool Pura, Nandni, Gujarat 385205, India.
Women's health scope: General menstrual hygiene, pad usage, comfort, common period-care tips, skin comfort, and when to seek medical care.
Medical safety: Do not diagnose. Do not prescribe medicines. If the user reports severe pain, very heavy bleeding, fainting, fever, unusual discharge with strong odor, rash/allergic reaction, pregnancy-related concerns, or symptoms lasting a long time, advise them to speak to a qualified gynecologist or doctor promptly.
Response style: Warm, practical, concise, supportive, and grounded in Mishfa Care's website context. If a fact is not available on the website context, say that clearly instead of inventing it.
`;

function formatProductsContext(products: Product[]) {
  if (products.length === 0) {
    return 'Live product catalog could not be loaded. Do not guess exact pricing, stock, or pack details.';
  }

  return products
    .map((product) => {
      const features = product.features.length > 0 ? product.features.join(', ') : 'No feature list available';
      const originalPrice = product.original_price ? ` (original price Rs. ${product.original_price})` : '';

      return [
        `- ${product.name}`,
        `category: ${CATEGORY_LABELS[product.category]}`,
        `price: Rs. ${product.price}${originalPrice}`,
        `description: ${product.description || 'No description available'}`,
        `features: ${features}`,
      ].join(' | ');
    })
    .join('\n');
}

function buildPrompt(messages: Message[], userMessage: string, products: Product[]) {
  const recentConversation = messages
    .slice(-6)
    .map((message) => `${message.sender === 'user' ? 'User' : 'Assistant'}: ${message.text}`)
    .join('\n');

  return `You are Mishfa Care Assistant for the Mishfa Care website.

Follow these rules:
- Answer using Mishfa Care website context first.
- Be especially helpful for women's health questions, particularly period problems, pad selection, hygiene, comfort, cramps self-care, heavy flow support, and skin sensitivity.
- Give only general wellness guidance, not diagnosis or treatment.
- Recommend medical consultation for red-flag symptoms or anything urgent.
- When users ask about products, recommend Mishfa Care products only when relevant to their need.
- If exact stock, price, or policy is unknown, say so and direct the user to WhatsApp or the products page.
- Keep answers short and natural, usually 3 to 6 sentences.

Website context:
${WEBSITE_CONTEXT.trim()}

Live product context:
${formatProductsContext(products)}

Recent conversation:
${recentConversation || 'No previous conversation.'}

Latest user question:
${userMessage}`;
}

async function generateReply(messages: Message[], userMessage: string, products: Product[]) {
  const env = import.meta.env as ImportMetaEnv & {
    GEMINI_API_KEY?: string;
    VITE_GEMINI_API_KEY?: string;
  };
  const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Gemini API key in environment variables.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildPrompt(messages, userMessage, products),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          maxOutputTokens: 350,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.message || 'Gemini request failed.';
    throw new Error(errorMessage);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Mishfa Care Assistant. You can ask me about Mishfa Care products, period care, pad selection, hygiene, or common women's wellness concerns.",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen || productsLoaded) {
      return;
    }

    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ activeOnly: true });
        setProducts(data);
      } catch (loadError) {
        console.error('Failed to load chatbot product context:', loadError);
      } finally {
        setProductsLoaded(true);
      }
    };

    void loadProducts();
  }, [isOpen, productsLoaded]);

  const handleSend = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoadingReply) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoadingReply(true);

    try {
      const reply = await generateReply(messages, trimmedInput, products);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (replyError) {
      console.error('Failed to generate chatbot reply:', replyError);

      const fallbackText =
        replyError instanceof Error && replyError.message.includes('Gemini API key')
          ? 'The chat assistant is not configured correctly yet. Please add a Gemini API key to the app environment and restart the site.'
          : "I'm having trouble replying right now. For product help, period care support, or women's hygiene questions, please try again or contact Mishfa Care on WhatsApp at +91 79905 07301.";

      setError(replyError instanceof Error ? replyError.message : 'Failed to generate reply.');
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: fallbackText,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoadingReply(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Mishfa Care chat assistant"
        className="focus-ring fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 min-h-14 min-w-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white shadow-lg transition-all hover:from-amber-600 hover:to-amber-700 hover:shadow-xl motion-safe:animate-bounce motion-safe:hover:scale-110 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-6"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex max-h-[calc(100dvh-2rem)] min-h-[24rem] flex-col rounded-lg border border-amber-600 bg-black shadow-2xl animate-fadeIn sm:left-auto sm:right-6 sm:w-[calc(100vw-2rem)] sm:max-w-96 md:max-h-[600px]">
      <div className="flex items-center justify-between gap-3 rounded-t-lg bg-gradient-to-r from-amber-600 to-amber-700 p-3 text-white sm:p-4">
        <h3 className="min-w-0 truncate font-bold">Mishfa Care Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close chat assistant"
          className="focus-ring touch-button min-w-11 rounded transition-colors hover:bg-amber-700"
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
              className={`max-w-[min(18rem,85vw)] break-words px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none border border-amber-600'
              } whitespace-pre-wrap`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoadingReply && (
          <div className="flex justify-start">
            <div className="max-w-xs rounded-lg rounded-bl-none border border-amber-600 bg-gray-800 px-4 py-2 text-gray-100">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

       <div className="flex gap-2 border-t border-amber-600 p-3 sm:p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Ask about period care, products, or women's hygiene..."
          className="form-control flex-1 border border-amber-600 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={isLoadingReply}
        />
        <button
          onClick={() => void handleSend()}
          aria-label="Send chat message"
          className="focus-ring touch-button min-w-11 rounded bg-amber-600 p-2 text-white transition-colors hover:bg-amber-700 disabled:bg-gray-700"
          disabled={isLoadingReply || !input.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      {error && (
        <div className="border-t border-amber-600 px-4 py-3 text-xs text-amber-200">
          {error}
        </div>
      )}
    </div>
  );
}
